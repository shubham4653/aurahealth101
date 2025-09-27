import express from 'express';
import { contract, web3 } from '../utils/contract.js';

const router = express.Router();

// GET /api/v1/contract/check-permission?providerAddress=0x...
router.get('/check-permission', async (req, res) => {
  const { providerAddress } = req.query;
  if (!providerAddress) {
    return res.status(400).json({ error: 'providerAddress query parameter is required' });
  }
  try {
    const hasPermission = await contract.methods.checkPermission(providerAddress).call();
    res.json({ providerAddress, hasPermission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/contract/grant-access
router.post('/grant-access', async (req, res) => {
  const { providerAddress } = req.body;
  if (!providerAddress) {
    return res.status(400).json({ error: 'providerAddress is required in body' });
  }
  try {
    const from = web3.eth.defaultAccount;
    if (!from) return res.status(403).json({ error: 'No blockchain account loaded in backend.' });
    const tx = contract.methods.grantAccess(providerAddress);
    const gas = await tx.estimateGas({ from });
    const receipt = await tx.send({ from, gas });
    res.json({ success: true, txHash: receipt.transactionHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/contract/revoke-access
router.post('/revoke-access', async (req, res) => {
  const { providerAddress } = req.body;
  if (!providerAddress) {
    return res.status(400).json({ error: 'providerAddress is required in body' });
  }
  try {
    const from = web3.eth.defaultAccount;
    if (!from) return res.status(403).json({ error: 'No blockchain account loaded in backend.' });
    const tx = contract.methods.revokeAccess(providerAddress);
    const gas = await tx.estimateGas({ from });
    const receipt = await tx.send({ from, gas });
    res.json({ success: true, txHash: receipt.transactionHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/contract/record-info
router.get('/record-info', async (req, res) => {
  try {
    const [recordIdHash, patientOwner, ipfsHash, backendServer] = await Promise.all([
      contract.methods.recordIdHash().call(),
      contract.methods.patientOwner().call(),
      contract.methods.ipfsHash().call(),
      contract.methods.backendServer().call()
    ]);
    res.json({ recordIdHash, patientOwner, ipfsHash, backendServer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/contract/ipfs-hash
router.get('/ipfs-hash', async (req, res) => {
  try {
    const ipfsHash = await contract.methods.ipfsHash().call();
    res.json({ ipfsHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/contract/patient-owner
router.get('/patient-owner', async (req, res) => {
  try {
    const patientOwner = await contract.methods.patientOwner().call();
    res.json({ patientOwner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/contract/backend-server
router.get('/backend-server', async (req, res) => {
  try {
    const backendServer = await contract.methods.backendServer().call();
    res.json({ backendServer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/contract/deploy
router.post('/deploy', async (req, res) => {
  try {
    const { patientOwner, ipfsHash } = req.body;
    if (!patientOwner || !ipfsHash) {
      return res.status(400).json({ error: 'patientOwner and ipfsHash are required' });
    }
    // Simulate recordIdHash (e.g., hash of Date.now() + patientOwner)
    const recordIdHash = web3.utils.keccak256(Date.now().toString() + patientOwner);

    // Load ABI and bytecode
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const artifact = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../blockchain/artifacts/contracts/RecordManager.sol/RecordManager.json'), 'utf8'));
    const contractABI = artifact.abi;
    const bytecode = artifact.bytecode;

    // Prepare contract deployment
    const contract = new web3.eth.Contract(contractABI);
    const deployTx = contract.deploy({
      data: bytecode,
      arguments: [recordIdHash, patientOwner, ipfsHash]
    });
    const from = web3.eth.defaultAccount;
    if (!from) return res.status(403).json({ error: 'No blockchain account loaded in backend.' });
    const gas = await deployTx.estimateGas({ from });
    const newContractInstance = await deployTx.send({ from, gas });
    res.json({ contractAddress: newContractInstance.options.address, recordIdHash, ipfsHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
