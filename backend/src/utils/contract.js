import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let contractABI;
try {
  contractABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../contractABI.json'), 'utf8'));
  console.log('✅ Contract ABI loaded from contractABI.json');
} catch (err) {
  console.error('❌ Failed to load contract ABI:', err);
  throw err;
}

const alchemyUrl = process.env.ALCHEMY_URL;
const contractAddress = process.env.CONTRACT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

console.log('🔗 Alchemy URL:', alchemyUrl);
console.log('🏠 Contract Address:', contractAddress);

const web3 = new Web3(new Web3.providers.HttpProvider(alchemyUrl));
console.log('✅ Web3 initialized');

const contract = new web3.eth.Contract(contractABI, contractAddress);
console.log('✅ Contract instance created');

if (privateKey) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  console.log('🔑 Blockchain account loaded:', account.address);
}

export { web3, contract };
