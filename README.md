

# 🏥 Aura Health 
### Decentralized Patient-Centric Medical Record Management

**Aura Health**  is a hybrid blockchain system that gives patients full control over their medical records. Using **Ethereum smart contracts** and **encrypted cloud storage**, it ensures medical data is secure, immutable, and accessible only with patient consent.

---

## 🚀 Key Features
- **Patient Ownership** – Patients control who can access their records.
- **Smart Contract Permissions** – Grant/Revoke access using Solidity contracts on the Sepolia testnet.
- **Secure Hybrid Storage** – Encrypted files stored on Cloudinary.
- **Immutable Audit Trail** – All access events recorded on blockchain.
- **Automated Contract Deployment** – A unique `RecordManager` contract for every record.

---

## 🏗️ Architecture
- **Frontend:** React + Tailwind (MetaMask integration)
- **Backend:** Node.js + Express (encryption & blockchain interaction)
- **Storage:** Cloudinary (encrypted medical files)
- **Blockchain:** Ethereum Sepolia (record hashes & access permissions)
- **Database:** PostgreSQL via Supabase

---

## 🛠️ Tech Stack
React.js • Node.js • Express • Solidity • Hardhat • Ethers.js • Cloudinary • PostgreSQL

---

## 📦 Project Structure


medichain/
├── blockchain/   # Smart contracts & Hardhat setup
├── backend/      # Node.js API
└── frontend/     # React dashboard



---

## ⚙️ Setup
```bash
# Install dependencies
cd blockchain && npm install
cd ../backend && npm install
cd ../frontend && npm install

# Run services
npm run dev
````

---

## 🔐 Smart Contract Example

```solidity
function grantAccess(address _providerAddress) public onlyPatient {
    accessPermissions[_providerAddress] = true;
    emit AccessGranted(recordIdHash, _providerAddress);
}
```

---

## 📄 License

MIT License

