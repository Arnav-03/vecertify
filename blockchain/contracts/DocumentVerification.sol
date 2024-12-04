// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract DocumentVerification {
    // Struct to store document details
    struct Document {
        bytes32 documentHash;  // Hash of the document
        address authority;     // Authority who issued the document
        uint256 issuedDate;    // Date of document issue
        string documentType;   // Type of document (e.g., degree, certificate)
        string documentMetadata;  // Additional metadata or information about the document
    }

    // Mapping to store documents by their unique hash
    mapping(bytes32 => Document) public documents;

    // Mapping to store user documents by student address
    mapping(address => bytes32[]) public studentDocuments;

    // Owner of the contract (who deploys the contract)
    address public owner;

    // Event for document submission by students
    event DocumentSubmitted(address indexed student, bytes32 documentHash);

    // Event for document verification
    event DocumentVerified(address indexed student, bytes32 documentHash, bool isVerified);

    // Constructor to set the contract owner (authority)
    constructor() {
        owner = msg.sender;  // The deployer of the contract is the owner
    }

    // Function to issue a document and store its hash on the blockchain
    // No longer restricted to only the owner
    function issueDocument(
        address student,
        bytes32 documentHash,
        string memory documentType,
        string memory documentMetadata
    ) public {
        // Store the document details
        documents[documentHash] = Document({
            documentHash: documentHash,
            authority: msg.sender,
            issuedDate: block.timestamp,
            documentType: documentType,
            documentMetadata: documentMetadata
        });

        // Record the document under the student's address
        studentDocuments[student].push(documentHash);

        // Emit event that document has been issued
        emit DocumentSubmitted(student, documentHash);
    }

    // Function for students to submit documents for verification
    function verifyDocument(bytes32 documentHash) public {
        Document storage doc = documents[documentHash];

        // Ensure the document exists in the contract
        require(doc.authority != address(0), "Document not found");

        // Check if the student's submitted document matches the hash stored on the blockchain
        bool isVerified = (doc.documentHash == documentHash);

        // Emit event for verification result
        emit DocumentVerified(msg.sender, documentHash, isVerified);
    }

    // Function to get all documents associated with a student
    function getStudentDocuments(address student) public view returns (bytes32[] memory) {
        return studentDocuments[student];
    }
}
