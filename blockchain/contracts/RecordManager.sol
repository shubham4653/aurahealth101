// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title RecordManager
 * @dev This contract manages the ownership and access permissions for a single medical record.
 * A new instance of this contract is deployed by the backend for every new record,
 * creating a decentralized and patient-controlled access control list (ACL).
 */
contract RecordManager {
    // --- STATE VARIABLES ---

    // A unique identifier for the record this contract manages.
    // This is a hash of the off-chain database UUID to ensure consistency.
    bytes32 public immutable recordIdHash;

    // The wallet address of the patient who has exclusive control over this record.
    address public immutable patientOwner;

    // The Content Identifier (CID) from IPFS where the encrypted record file is stored.
    string public ipfsHash;

    // A mapping that stores access permissions.
    // Mapping: Provider's Wallet Address => boolean (true if access is granted, false otherwise).
    mapping(address => bool) public accessPermissions;

    // The address of the backend server that deployed this contract.
    address public immutable backendServer;

    // --- EVENTS ---

    // Emitted when the contract is first deployed (i.e., when a new record is created).
    event RecordCreated(bytes32 indexed recordIdHash, address indexed patientOwner, string ipfsHash);

    // Emitted when the patient grants access to a provider.
    event AccessGranted(bytes32 indexed recordIdHash, address indexed providerAddress);

    // Emitted when the patient revokes access from a provider.
    event AccessRevoked(bytes32 indexed recordIdHash, address indexed providerAddress);

    // --- MODIFIERS ---

    /**
     * @dev Restricts a function so that it can only be called by the patientOwner.
     */
    modifier onlyPatient() {
        require(msg.sender == patientOwner, "RecordManager: Caller is not the patient owner.");
        _;
    }

    // --- CONSTRUCTOR ---

    /**
     * @dev Sets the initial state of the contract upon deployment.
     * @param _recordIdHash The unique hash of the record ID from the off-chain database.
     * @param _patientOwner The wallet address of the patient who will own this record.
     * @param _ipfsHash The IPFS CID where the encrypted file is stored.
     */
    constructor(bytes32 _recordIdHash, address _patientOwner, string memory _ipfsHash) {
        backendServer = msg.sender; // The deployer of the contract is the backend server
        recordIdHash = _recordIdHash;
        patientOwner = _patientOwner;
        ipfsHash = _ipfsHash;
        emit RecordCreated(_recordIdHash, _patientOwner, _ipfsHash);
    }

    // --- PATIENT-ONLY FUNCTIONS ---

    /**
     * @dev Allows the patient to grant access to a healthcare provider.
     * @param _providerAddress The wallet address of the provider to grant access to.
     */
    function grantAccess(address _providerAddress) public onlyPatient {
        require(_providerAddress != address(0), "RecordManager: Cannot grant access to the zero address.");
        accessPermissions[_providerAddress] = true;
        emit AccessGranted(recordIdHash, _providerAddress);
    }

    /**
     * @dev Allows the patient to revoke access from a healthcare provider.
     * @param _providerAddress The wallet address of the provider whose access will be revoked.
     */
    function revokeAccess(address _providerAddress) public onlyPatient {
        require(_providerAddress != address(0), "RecordManager: Cannot revoke access from the zero address.");
        accessPermissions[_providerAddress] = false;
        emit AccessRevoked(recordIdHash, _providerAddress);
    }

    // --- PUBLIC VIEW FUNCTION ---

    /**
     * @dev A public function that allows anyone (typically the backend server)
     * to check if a provider has permission to access this record.
     * @param _providerAddress The provider's wallet address to check.
     * @return A boolean indicating if access is currently granted.
     */
    function checkPermission(address _providerAddress) public view returns (bool) {
        return accessPermissions[_providerAddress];
    }
}
