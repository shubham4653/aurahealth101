// We use require() here which is the standard for Hardhat scripts and configs.
import hre from "hardhat";

async function main() {
  // --- 1. GET THE DEPLOYER'S WALLET ---
  // This is the most important change for testing.
  // It gets the account connected to the PRIVATE_KEY in your .env file.
  // We will set this account as the "patient" so we can sign transactions for it later.
  const [deployer] = await hre.ethers.getSigners();
  const patientOwnerAddress = deployer.address;

  // --- 2. DEFINE DUMMY DATA FOR DEPLOYMENT ---
  // These values are placeholders for our manual test deployment.
  const dummyRecordIdHash = "0x" + "a".repeat(64); // A 32-byte hex string (bytes32)
  const dummyIpfsHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"; // Example IPFS CID

  console.log("----------------------------------------------------");
  console.log("Deploying RecordManager contract with the following:");
  console.log(` - Deployer/Patient Wallet: ${patientOwnerAddress}`);
  console.log(` - Record ID Hash: ${dummyRecordIdHash}`);
  console.log(` - IPFS Hash: ${dummyIpfsHash}`);
  console.log("----------------------------------------------------");

  // --- 3. GET THE CONTRACT FACTORY & DEPLOY ---
  const RecordManager = await hre.ethers.getContractFactory("RecordManager");

  console.log("Deploying contract to the network...");
  const recordManager = await RecordManager.deploy(
    dummyRecordIdHash,
    patientOwnerAddress, // Use the deployer's address here
    dummyIpfsHash
  );

  // --- 4. WAIT FOR DEPLOYMENT CONFIRMATION ---
  await recordManager.waitForDeployment();

  const contractAddress = await recordManager.getAddress();

  // --- 5. LOG THE FINAL RESULT ---
  console.log(`\n✅ RecordManager contract deployed successfully!`);
  console.log(`   - Deployed to address: ${contractAddress}`);
  console.log(`   - Transaction hash: ${recordManager.deploymentTransaction().hash}`);
  console.log("\nRun the following command to verify your contract on Etherscan:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress} "${dummyRecordIdHash}" "${patientOwnerAddress}" "${dummyIpfsHash}"`);
}

// Standard pattern for running scripts with async/await and handling errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

