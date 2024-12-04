// 1. Initializing the Contract (typically in a component or page)
import useDocumentVerificationStore from '@/lib/store/useDocumentVerificationStore';
import { ethers } from 'ethers';
import { useEffect } from 'react';

function DocumentManagementPage() {
  const { initContract, issueDocument, verifyDocument , getStudentDocuments ,getDocumentDetails,onDocumentSubmitted,onDocumentVerified } = useDocumentVerificationStore();

  useEffect(() => {
    // Initialize the contract when the component mounts
    async function setupContract() {
      try {
        const provider = new ethers.BrowserProvider(
            window.ethereum as unknown as ethers.Eip1193Provider
        );
        await initContract(provider);
        console.error('Contract initialization done !');
      } catch (error) {
        console.error('Contract initialization failed', error);
      }
    }
    setupContract();
  }, []);

  // 2. Issuing a New Document
  const handleIssueDocument = async () => {
    try {
      await issueDocument(
        '0x1234567890123456789012345678901234567890', // student address
        'unique-document-hash-123', // unique document hash
        'Transcript', // document type
        'Fall 2023 Academic Record' // additional metadata
      );
      console.log('Document issued successfully');
    } catch (error) {
      console.error('Failed to issue document', error);
    }
  };

  // 3. Verifying a Document
  const handleVerifyDocument = async () => {
    const isVerified = await verifyDocument('unique-document-hash-123');
    console.log('Document verified:', isVerified);
  };

  // 4. Retrieving Student Documents
  const handleGetStudentDocuments = async () => {
    try {
      const documents = await getStudentDocuments('0x1234567890123456789012345678901234567890');
      console.log('Student documents:', documents);
    } catch (error) {
      console.error('Failed to retrieve documents', error);
    }
  };

  // 5. Getting Document Details
  const handleGetDocumentDetails = async () => {
    try {
      const documentDetails = await getDocumentDetails('unique-document-hash-123');
      if (documentDetails) {
        console.log('Document Details:', {
          authority: documentDetails.authority,
          issuedDate: new Date(documentDetails.issuedDate * 1000),
          documentType: documentDetails.documentType
        });
      } else {
        console.log('Document not found');
      }
    } catch (error) {
      console.error('Failed to get document details', error);
    }
  };

  // 6. Setting up Event Listeners
  useEffect(() => {
    // Listen for document submission events
    const unsubscribeSubmitted = onDocumentSubmitted((student, documentHash) => {
      console.log(`New document submitted by ${student}: ${documentHash}`);
    });

    // Listen for document verification events
    const unsubscribeVerified = onDocumentVerified((student, documentHash, isVerified) => {
      console.log(`Document ${documentHash} for ${student} verified: ${isVerified}`);
    });

    // Cleanup listeners when component unmounts
    return () => {
      unsubscribeSubmitted();
      unsubscribeVerified();
    };
  }, []);

  return (
    <div className=""></div>
  );
}