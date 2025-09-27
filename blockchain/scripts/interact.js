import hre from "hardhat";

async function main() {
  // --- 1. SETUP ---
  // PASTE THE ADDRESS OF THE CONTRACT YOU DEPLOYED HERE
  const deployedContractAddress = "0xfd66499d8456C458bCF4AB96Bf79Efd9B0e9434e";

  // This is the address we will grant access to.
  // You can use any valid Ethereum address. Let's use a well-known one for this example.
  const providerAddressToGrant = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"; // Vitalik Buterin's address

  console.log(`Attempting to interact with contract at: ${deployedContractAddress}`);

  // --- 2. GET THE SIGNER (THE PATIENT) ---
  // This will get the wallet associated with the private key in your .env file.
  // Because of our updated deploy script, this signer is the `patientOwner`.
  const [patientSigner] = await hre.ethers.getSigners();
  console.log(`Using patient wallet: ${patientSigner.address}`);

  // --- 3. GET THE CONTRACT INSTANCE ---
  // This creates a JavaScript object that lets us call the functions of our deployed contract.
  const RecordManager = await hre.ethers.getContractFactory("RecordManager");
  const contract = RecordManager.attach(deployedContractAddress);

  // --- 4. CALL THE `grantAccess` FUNCTION ---
  console.log(`\nCalling grantAccess() to give permission to ${providerAddressToGrant}...`);

  // This sends a real transaction to the Sepolia network.
  const tx = await contract.connect(patientSigner).grantAccess(providerAddressToGrant);

  // Wait for the transaction to be mined and confirmed.
  console.log("Transaction sent. Waiting for confirmation...");
  await tx.wait();
  console.log(`Transaction confirmed! Hash: ${tx.hash}`);

  // --- 5. VERIFY THE RESULT ---
  console.log(`\nCalling checkPermission() to verify access for ${providerAddressToGrant}...`);

  // Call the read-only function to check the new state.
  const hasPermission = await contract.checkPermission(providerAddressToGrant);

  console.log(`\n--- TEST RESULT ---`);
  if (hasPermission) {
    console.log(`✅ SUCCESS: The provider now has access (permission = ${hasPermission}).`);
  } else {
    console.log(`❌ FAILED: The provider still does not have access (permission = ${hasPermission}).`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
