AuraHealth: Decentralized Patient-Centric Medical Record Management

AuraHealth is a hybrid blockchain application designed to shift control of medical data from central institutions back to the patients. By leveraging Ethereum smart contracts and encrypted cloud storage, it ensures that health records are secure, immutable, and accessible only with explicit patient consent.

Key Features

Patient Sovereignty: Patients are the legal "owners" of their records on-chain.

Cryptographic Access Control: Permission management (Grant/Revoke) is handled via Solidity smart contracts on the Sepolia testnet.

Secure Hybrid Storage: Encrypted medical files are stored on Cloudinary, providing high-performance retrieval while maintaining blockchain-level validation.

Immutable Audit Trail: Every access request and permission change is logged on the blockchain for transparent auditing.

Automated Deployment: The backend programmatically deploys a unique RecordManager contract for every new record created.

Architecture Overview

The system follows a Hybrid Blockchain-Cloud architecture:

Frontend (React): User interface for patients to manage permissions via MetaMask and for providers to upload/view records.

Backend (Node.js): The orchestrator that handles file encryption, Cloudinary uploads, and interacts with the Ethereum network using ethers.js.

Storage (Cloudinary): Stores the encrypted blobs of medical data.

Blockchain (Ethereum/Sepolia): Stores the cryptographic hash of the records and the mapping of authorized provider addresses.

🛠️ Tech Stack

Frontend: React.js, Tailwind CSS, Lucide-React, Ethers.js

Backend: Node.js, Express, Cloudinary SDK, Multer, Crypto

Blockchain: Solidity, Hardhat, Ethers.js, Sepolia Testnet

Database: PostgreSQL (via Supabase)

📦 Project Structure

aurahealth101/
├── blockchain/        # Hardhat environment, Smart Contracts, & Deployment scripts
├── backend/           # Node.js Express API & Cloudinary integration
└── frontend/          # React + Vite dashboard application


⚙️ Installation & Setup

1. Blockchain Setup

Navigate to the blockchain folder:

cd blockchain
npm install


Create a .env file in the blockchain directory:

SEPOLIA_RPC_URL="your_infura_or_alchemy_url"
BACKEND_PRIVATE_KEY="your_metamask_private_key"
ETHERSCAN_API_KEY="your_etherscan_api_key"


Compile and deploy the contract:

npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia


2. Backend Setup

Navigate to the backend folder:

cd ../backend
npm install


Create a .env file in the backend directory:

PORT=8000
SEPOLIA_RPC_URL="your_rpc_url"
BACKEND_PRIVATE_KEY="your_private_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
DATABASE_URL="your_supabase_postgresql_url"


Start the server:

npm run dev


3. Frontend Setup

Navigate to the frontend folder:

cd ../frontend
npm install
npm run dev


Smart Contract Logic

The core logic resides in RecordManager.sol.

onlyPatient Modifier: Ensures that only the patient's wallet can call grantAccess or revokeAccess.

checkPermission Function: A public view function used by the backend to verify if a provider has the right to access the encrypted file URL.

function grantAccess(address _providerAddress) public onlyPatient {
    accessPermissions[_providerAddress] = true;
    emit AccessGranted(recordIdHash, _providerAddress);
}


Contributing

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request
