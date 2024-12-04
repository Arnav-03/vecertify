import { create } from "zustand";
import { ethers } from "ethers";
import DocumentVerificationJSON from "@/lib/Contracts/DocumentVerification.json";

const DocumentVerificationJSONabi = DocumentVerificationJSON.abi;

// TypeScript interfaces
interface Document {
  documentHash: string;
  authority: string;
  issuedDate: number;
  documentType: string;
  documentMetadata: string;
}

interface DocumentVerificationStore {
  contract: ethers.Contract | null;
  owner: string | null;
  isInitializing: boolean;

  // Contract Initialization
  initContract: (provider: ethers.BrowserProvider) => Promise<void>;
  ensureContract: () => Promise<ethers.Contract>;

  // Document Management Functions
  issueDocument: (
    student: string,
    documentHash: string,
    documentType: string,
    documentMetadata: string
  ) => Promise<void>;

  verifyDocument: (documentHash: string) => Promise<boolean>;

  // View Functions
  getStudentDocuments: (student: string) => Promise<string[]>;
  getDocumentDetails: (documentHash: string) => Promise<Document | null>;

  // Event Listeners
  onDocumentSubmitted: (
    callback: (student: string, documentHash: string) => void
  ) => () => void;
  onDocumentVerified: (
    callback: (
      student: string,
      documentHash: string,
      isVerified: boolean
    ) => void
  ) => () => void;
}

const MAX_INIT_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
console.log("Contract Address from ENV:", address);

const useDocumentVerificationStore = create<DocumentVerificationStore>(
  (set, get) => ({
    contract: null,
    owner: null,
    isInitializing: false,
    initContract: async (provider: ethers.BrowserProvider) => {
      try {
        console.log("Initializing contract...");

        // Get network information
        const network = await provider.getNetwork();
        console.log("Connected network:", network);

        // Normalize chainId for comparison
        const normalizedChainId = Number(network.chainId);
        if (normalizedChainId !== 31337) {
          throw new Error(
            `Unexpected chain ID: ${normalizedChainId}. Expected 31337.`
          );
        }

        // Signer
        const signer = await provider.getSigner();
        console.log("Signer Address:", await signer.getAddress());

        if (!address) {
          throw new Error("Contract address is not defined");
        }

        console.log("Contract Address:", address);

        // Initialize contract
        const contract = new ethers.Contract(
          '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          DocumentVerificationJSONabi,
          signer
        );
        console.log("Deployed Contract:", contract);

        // Fetch and set the owner
        const owner = await contract.owner();
        console.log("Owner:", owner);

        set({ contract, owner });
        console.log("Contract initialization complete");
      } catch (error) {
        console.error("Failed to initialize contract:", error);
        throw error;
      } finally {
        set({ isInitializing: false });
      }
    },

    ensureContract: async () => {
      const { contract, isInitializing } = get();
      if (contract) return contract;

      if (isInitializing) {
        let retries = 0;
        while (isInitializing && retries < MAX_INIT_RETRIES) {
          await sleep(RETRY_DELAY);
          retries++;
        }
        if (get().contract) return get().contract!;
      }

      try {
        if (typeof window !== "undefined" && window.ethereum) {
          const provider = new ethers.BrowserProvider(
            window.ethereum as unknown as ethers.Eip1193Provider,
            {
              name: "hardhat",
              chainId: 31337, // Explicitly set the chain ID here
            }
          );
          await get().initContract(provider);
          if (get().contract) return get().contract!;
        }
      } catch (error) {
        console.error("Failed to auto-initialize contract:", error);
      }

      throw new Error(
        "Contract not initialized and auto-initialization failed"
      );
    },

    issueDocument: async (
      student,
      documentHash,
      documentType,
      documentMetadata
    ) => {
      try {
        const contract = await get().ensureContract();
        const tx = await contract.issueDocument(
          student,
          ethers.encodeBytes32String(documentHash),
          documentType,
          documentMetadata
        );
        await tx.wait();
      } catch (error) {
        console.error("Failed to issue document:", error);
        throw error;
      }
    },

    verifyDocument: async (documentHash) => {
      try {
        const contract = await get().ensureContract();
        const encodedHash = ethers.encodeBytes32String(documentHash);

        // Call the verifyDocument function
        const tx = await contract.verifyDocument(encodedHash);
        console.log("verified",tx)
        // Return the verification result
        return true;
      } catch (error) {
        console.error("Document verification failed:", error);
        return false;
      }
    },

    getStudentDocuments: async (student) => {
      try {
        const contract = await get().ensureContract();
        const documents = await contract.getStudentDocuments(student);
        return documents.map(ethers.decodeBytes32String);
      } catch (error) {
        console.error("Failed to get student documents:", error);
        throw error;
      }
    },

    getDocumentDetails: async (documentHash) => {
      try {
        const contract = await get().ensureContract();
        const encodedHash = ethers.encodeBytes32String(documentHash);
        const doc = await contract.documents(encodedHash);
        console.log(doc);
        // If document doesn't exist, return null
        if (doc.authority === ethers.ZeroAddress) return null;
    
        return {
          student: doc.student, // Adding student address here
          documentHash: ethers.decodeBytes32String(doc.documentHash),
          authority: doc.authority,
          issuedDate: Number(doc.issuedDate),
          documentType: doc.documentType,
          documentMetadata: doc.documentMetadata,
        };
      } catch (error) {
        console.error("Failed to get document details:", error);
        throw error;
      }
    },

    onDocumentSubmitted: (callback) => {
      const contract = get().contract;
      if (!contract) throw new Error("Contract not initialized");

      const eventHandler = (student: string, documentHash: string) => {
        callback(student, ethers.decodeBytes32String(documentHash));
      };

      contract.on("DocumentSubmitted", eventHandler);

      // Return unsubscribe function
      return () => {
        contract.off("DocumentSubmitted", eventHandler);
      };
    },

    onDocumentVerified: (callback) => {
      const contract = get().contract;
      if (!contract) throw new Error("Contract not initialized");

      const eventHandler = (
        student: string,
        documentHash: string,
        isVerified: boolean
      ) => {
        callback(student, ethers.decodeBytes32String(documentHash), isVerified);
      };

      contract.on("DocumentVerified", eventHandler);

      // Return unsubscribe function
      return () => {
        contract.off("DocumentVerified", eventHandler);
      };
    },
  })
);

export default useDocumentVerificationStore;
