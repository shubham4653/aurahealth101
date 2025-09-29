import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { MedicalRecord } from '../models/medicalRecord.model.js';
import { Patient } from '../models/patient.model.js';
import { Provider } from '../models/provider.model.js';
import { generateFileHash, generateRecordIdHash } from '../utils/fileHash.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { web3 } from '../utils/contract.js';
import fs from 'fs';
import path from 'path';

// Upload a new medical record
const uploadRecord = asyncHandler(async (req, res) => {
  const { patientId, recordType, description } = req.body;
  const providerId = req.provider._id;
  
  if (!req.file) {
    throw new ApiError(400, 'File is required');
  }
  
  if (!patientId || !recordType) {
    throw new ApiError(400, 'Patient ID and record type are required');
  }
  
  // Verify patient exists
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }
  
  if (!patient.walletAddress) {
    throw new ApiError(400, 'Patient must have a connected wallet address');
  }
  
  try {
    // Generate file content hash
    const fileContentHash = generateFileHash(req.file.buffer);
    
    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, {
      folder: 'medical-records',
      resource_type: 'auto',
      public_id: `record_${Date.now()}_${patientId}`,
      mimeType: req.file.mimetype
    });
    
    // Generate record ID hash and normalize to bytes32 (0x-prefixed, 32 bytes)
    let recordIdHash = generateRecordIdHash(patientId, fileContentHash);
    const toBytes32 = (value) => {
      let hex = value;
      if (!hex) return web3.utils.keccak256(Date.now().toString());
      // Ensure hex string
      if (!hex.startsWith('0x')) {
        hex = '0x' + hex;
      }
      // If not 32 bytes, hash it to bytes32
      if (hex.length !== 66) {
        return web3.utils.keccak256(hex);
      }
      return hex;
    };
    const recordIdHashBytes32 = toBytes32(recordIdHash);
    
    // Deploy smart contract
    const contractAddress = await deployRecordContract(
      recordIdHashBytes32,
      patient.walletAddress,
      cloudinaryResult.public_id // Using Cloudinary public ID as IPFS hash
    );
    
    // Create medical record in database
    const medicalRecord = await MedicalRecord.create({
      patientId,
      providerId,
      recordType,
      description,
      fileName: req.file.originalname,
      cloudinaryUrl: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      contractAddress,
      recordIdHash: recordIdHashBytes32,
      fileContentHash,
      ipfsHash: cloudinaryResult.public_id
    });
    
    // Populate the record with patient and provider info
    await medicalRecord.populate(['patient', 'provider']);
    
    return res.status(201).json(
      new ApiResponse(201, {
        record: medicalRecord,
        contractAddress,
        recordIdHash,
        fileContentHash,
        cloudinaryUrl: cloudinaryResult.secure_url
      }, 'Medical record uploaded and registered on blockchain successfully')
    );
    
  } catch (error) {
    // Clean up uploaded file if database operation fails
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    throw new ApiError(500, `Failed to upload record: ${error.message}`);
  }
});

// Get records for a patient
const getPatientRecords = asyncHandler(async (req, res) => {
  const patientId = req.patient._id;
  
  console.log('🔍 Backend: Fetching records for patient:', patientId);
  
  const records = await MedicalRecord.find({ 
    patientId, 
    isActive: true 
  }).populate('providerId', 'name specialty email');
  
  console.log('🔍 Backend: Found records:', records.length);
  if (records.length > 0) {
    console.log('🔍 Backend: First record providerId:', records[0].providerId);
    console.log('🔍 Backend: First record provider:', records[0].provider);
  }
  
  return res.status(200).json(
    new ApiResponse(200, records, 'Patient records retrieved successfully')
  );
});

// Get records accessible to a provider
const getProviderRecords = asyncHandler(async (req, res) => {
  const providerId = req.provider._id;
  const providerWalletAddress = req.provider.walletAddress;
  
  if (!providerWalletAddress) {
    throw new ApiError(400, 'Provider must have a connected wallet address');
  }
  
  // Get records where provider has access
  const records = await MedicalRecord.find({
    $or: [
      { providerId }, // Records created by this provider
      { 'accessPermissions.providerAddress': providerWalletAddress.toLowerCase() }
    ],
    isActive: true
  }).populate('patient', 'fullName email').populate('provider', 'name specialty');
  
  return res.status(200).json(
    new ApiResponse(200, records, 'Provider records retrieved successfully')
  );
});

// Grant access to a provider
const grantAccess = asyncHandler(async (req, res) => {
  const { recordId, providerAddress } = req.body;
  const patientId = req.patient._id;
  
  if (!recordId || !providerAddress) {
    throw new ApiError(400, 'Record ID and provider address are required');
  }
  
  const record = await MedicalRecord.findOne({ 
    _id: recordId, 
    patientId, 
    isActive: true 
  });
  
  if (!record) {
    throw new ApiError(404, 'Record not found or you do not have permission');
  }
  
  // Verify provider exists
  const provider = await Provider.findOne({ walletAddress: providerAddress });
  if (!provider) {
    throw new ApiError(404, 'Provider with this wallet address not found');
  }
  
  try {
    // Call smart contract to grant access
    await callSmartContractMethod(
      record.contractAddress,
      'grantAccess',
      [providerAddress]
    );
    
    // Update database
    await record.grantAccess(providerAddress);
    
    return res.status(200).json(
      new ApiResponse(200, {}, 'Access granted successfully')
    );
    
  } catch (error) {
    throw new ApiError(500, `Failed to grant access: ${error.message}`);
  }
});

// Revoke access from a provider
const revokeAccess = asyncHandler(async (req, res) => {
  const { recordId, providerAddress } = req.body;
  const patientId = req.patient._id;
  
  if (!recordId || !providerAddress) {
    throw new ApiError(400, 'Record ID and provider address are required');
  }
  
  const record = await MedicalRecord.findOne({ 
    _id: recordId, 
    patientId, 
    isActive: true 
  });
  
  if (!record) {
    throw new ApiError(404, 'Record not found or you do not have permission');
  }
  
  try {
    // Call smart contract to revoke access
    await callSmartContractMethod(
      record.contractAddress,
      'revokeAccess',
      [providerAddress]
    );
    
    // Update database
    await record.revokeAccess(providerAddress);
    
    return res.status(200).json(
      new ApiResponse(200, {}, 'Access revoked successfully')
    );
    
  } catch (error) {
    throw new ApiError(500, `Failed to revoke access: ${error.message}`);
  }
});

// Verify file integrity
const verifyFileIntegrity = asyncHandler(async (req, res) => {
  const { recordId } = req.params;
  const { fileContentHash } = req.body;
  
  if (!fileContentHash) {
    throw new ApiError(400, 'File content hash is required');
  }
  
  const record = await MedicalRecord.findById(recordId);
  if (!record) {
    throw new ApiError(404, 'Record not found');
  }
  
  const isValid = record.fileContentHash === fileContentHash;
  
  return res.status(200).json(
    new ApiResponse(200, { 
      isValid, 
      storedHash: record.fileContentHash,
      providedHash: fileContentHash 
    }, 'File integrity verification completed')
  );
});

// Helper function to deploy smart contract
const deployRecordContract = async (recordIdHash, patientAddress, ipfsHash) => {
  try {
    // Load contract ABI and bytecode
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const artifactPath = path.resolve(__dirname, '../../../blockchain/artifacts/contracts/RecordManager.sol/RecordManager.json');
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    
    const contractABI = artifact.abi;
    const bytecode = artifact.bytecode;
    
    // Deploy contract
    const contract = new web3.eth.Contract(contractABI);
    const deployTx = contract.deploy({
      data: bytecode,
      arguments: [recordIdHash, patientAddress, ipfsHash]
    });
    
    const from = web3.eth.defaultAccount;
    if (!from) {
      throw new Error('No blockchain account loaded in backend');
    }
    
    const gas = await deployTx.estimateGas({ from });
    const newContractInstance = await deployTx.send({ from, gas });
    
    return newContractInstance.options.address;
    
  } catch (error) {
    throw new Error(`Failed to deploy contract: ${error.message}`);
  }
};

// Helper function to call smart contract methods
const callSmartContractMethod = async (contractAddress, methodName, params) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const artifactPath = path.resolve(__dirname, '../../../blockchain/artifacts/contracts/RecordManager.sol/RecordManager.json');
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    
    const contract = new web3.eth.Contract(artifact.abi, contractAddress);
    const method = contract.methods[methodName];
    
    if (!method) {
      throw new Error(`Method ${methodName} not found in contract`);
    }
    
    const from = web3.eth.defaultAccount;
    if (!from) {
      throw new Error('No blockchain account loaded in backend');
    }
    
    const gas = await method(...params).estimateGas({ from });
    const receipt = await method(...params).send({ from, gas });
    
    return receipt;
    
  } catch (error) {
    throw new Error(`Failed to call contract method: ${error.message}`);
  }
};

export {
  uploadRecord,
  getPatientRecords,
  getProviderRecords,
  grantAccess,
  revokeAccess,
  verifyFileIntegrity
};
