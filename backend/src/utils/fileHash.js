import crypto from 'crypto';
import fs from 'fs';

/**
 * Generate a SHA-256 hash of file content
 * @param {Buffer|string} fileContent - The file content to hash
 * @returns {string} - The hexadecimal hash string
 */
export const generateFileHash = (fileContent) => {
  if (Buffer.isBuffer(fileContent)) {
    return crypto.createHash('sha256').update(fileContent).digest('hex');
  }
  return crypto.createHash('sha256').update(fileContent).digest('hex');
};

/**
 * Generate a hash from file path (for existing files)
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} - The hexadecimal hash string
 */
export const generateFileHashFromPath = async (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
};

/**
 * Generate a unique record ID hash combining patient ID, timestamp, and file hash
 * @param {string} patientId - Patient's database ID
 * @param {string} fileHash - Hash of the file content
 * @param {string} timestamp - Optional timestamp (defaults to current time)
 * @returns {string} - Combined hash
 */
export const generateRecordIdHash = (patientId, fileHash, timestamp = Date.now().toString()) => {
  const combinedData = `${patientId}-${timestamp}-${fileHash}`;
  return crypto.createHash('sha256').update(combinedData).digest('hex');
};

/**
 * Validate file hash against stored hash
 * @param {string} currentFileHash - Hash of current file content
 * @param {string} storedHash - Hash stored in blockchain
 * @returns {boolean} - True if hashes match
 */
export const validateFileHash = (currentFileHash, storedHash) => {
  return currentFileHash === storedHash;
};
