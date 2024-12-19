"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileCheck2, FileX2, Loader, Upload } from "lucide-react";
import useDocumentVerificationStore from "@/lib/store/useDocumentVerificationStore";
import Layout from "@/components/layout/Layout";
import { createVerifiedCertificate, getCertificateByHash } from "@/lib/appwrite";
import { analyzeDocument } from "@/lib/gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { tree } from "next/dist/build/templates/app-page";
import { useUser } from "@/hooks/useUser";
const key = process.env.GEMINI;
console.log(key);

interface CertificateDocument {
  certificateId: string;
  certificateName: string;
  certificateUrl: string;
  fileHash: string;
  issueDate: string;
  issuerMetaMask: string;
  issuerOrg: string;
  studentMetaMask: string;
}

const VerifyDocumentPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [geminiResult, setGeminiResult] = useState("");
  const [studentInfo, setStudentInfo] = useState<CertificateDocument | null>(
    null
  );
  const [loadingGeminiResult, setLoadingGeminiResult] = useState(false)

  const [verificationResult, setVerificationResult] = useState<boolean | null>(
    null
  );
  const [documentDetails, setDocumentDetails] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const {user} =useUser();
  const { verifyDocument, getDocumentDetails } =
    useDocumentVerificationStore.getState();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setVerificationResult(null);
      setDocumentDetails(null);
    }
  };

  const hashFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/generate-hash", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Hashing failed");
      }

      const data = await response.json();

      return data.hash;
    } catch (error) {
      console.error("File hashing error:", error);
      throw error;
    }
  };
  async function analyzePDFasync(pdfFile: File) {
    setLoadingGeminiResult(true);
    const arrayBuffer = await pdfFile.arrayBuffer(); // Convert File to ArrayBuffer
    const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
    await analyzeDocument(buffer); // Pass the Buffer to analyzeDocument
    setLoadingGeminiResult(false)
  }

  const formatResponse = (cleanedResponse: string) => {
    const formattedResponse = cleanedResponse
      .replace(/\. /g, ".\n") // Add newline after periods followed by a space
      .replace(/Document/g, "\nDocument") // Add newline before "Document"
      .replace(/Recommendations:/g, "\nRecommendations:\n") // Format Recommendations section
      .replace(/Disclaimer:/g, "\nDisclaimer:\n") // Format Disclaimer section
      .replace(/Summary:/g, "\n\nSummary:\n"); // Add two line breaks before Summary section

    return formattedResponse;
  };

  const analyzePDF = async () => {
    setLoadingGeminiResult(true);
    // Validate file existence
    if (!file) {
      console.log("No file selected");
      setLoadingGeminiResult(false)
      return;
    }

    try {
      console.log("called");
      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI(
        "AIzaSyC4b51BnG3Ittir3wmVGdEZl79uW7zMlVs"
      );

      // Create the model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        if (reader.result) {
          const base64Data = (reader.result as string).split(",")[1]; // Type assertion here

          // Prepare the prompt for document analysis
          const prompt = `
          Analyze the following document text for potential tampering and validate its metadata. 
        
          Provide an analysis that is concise and limited to 300 words. Focus on key observations without being overly critical. Additionally, include a brief summary of the document, starting with "Summary:" and highlighting its primary details.
          `;

          // Create image part
          const imagePart = {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          };

          // Generate content
          const result = await model.generateContent([prompt, imagePart]);
          const response = await result.response;
          const text = await response.text(); // Await text() for the result

          console.log("PDF Analysis:", text);
          setGeminiResult(text);
          setLoadingGeminiResult(false)
        } else {
          console.error("Error: File data not available.");
        }
      };
    } catch (error) {
      console.error("Error analyzing PDF:", error);
      setLoadingGeminiResult(false)
    }
  };

  const handleVerification = async () => {
    if (!file) return;

    try {
      const documentHash = await hashFile(file);
      const isVerified = await verifyDocument(documentHash);
      setVerificationResult(isVerified);

      if (isVerified) {
        const details = await getDocumentDetails(documentHash);
        setDocumentDetails(details);
        console.log(details);
        const data = await getCertificateByHash(documentHash);
        if (data.success && data.response) {
          setStudentInfo(data.response); // Works without type error
          console.log(data.response);
        }
      }
      const name = file.name;
      const status = isVerified.toString();
      const by = user?.email ?? "Unknown"; 
      const verifyDate = new Date().toLocaleDateString(); 
      
      const data = {
        name,
        by,
        status,
        verifyDate,
      };
      
      const response = await createVerifiedCertificate(data);
      console.log(response)
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationResult(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 min-h-dvh mt-[75px]">
        <div className="max-w-2xl mx-auto bg-accent shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-6 text-center">
            Document Verification
          </h1>

          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-xl p-6 flex flex-col items-center justify-center">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className=" hidden"
              />
              <label
                htmlFor="file-upload"
                className="bg-white/10 p-4 rounded-md  cursor-pointer flex flex-col items-center space-y-4"
              >
                <Upload size={48} className="text-primary" />
                <span className="">{file ? file.name : "Upload Document"}</span>
              </label>
            </div>

            <div className="flex flex-col space-y-4">
              <Button
                onClick={handleVerification}
                disabled={!file}
                className="w-full bg-primary hover:bg-primary/80 transition-colors"
              >
                Verify Document
              </Button>

              {verificationResult !== null && (
                <div
                  className={`flex items-center space-x-4 p-4 rounded-lg ${verificationResult
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                    }`}
                >
                  {verificationResult ? (
                    <>
                      <FileCheck2 color="green" size={32} />
                      <span className="text-green-800 font-semibold">
                        Document Verified Successfully
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <span className="text-red-800 font-semibold flex gap-2 items-center">
                          <FileX2 color="red" size={32} />
                          Document Not Verified
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          The document could not be authenticated in our
                          blockchain records. This might occur due to:
                          <br /> • Document not originally issued through our
                          system <br /> • Potential file tampering <br /> •
                          Incorrect document submission
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {documentDetails && verificationResult && (
                <div className="bg-gray-50 p-6 rounded-xl space-y-3">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Document Details
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <DetailItem
                      label="Type"
                      value={documentDetails.documentType}
                    />
                    <DetailItem
                      label="Issued By"
                      value={documentDetails.authority}
                    />
                    <DetailItem
                      label="Issued Date"
                      value={new Date(
                        documentDetails.issuedDate * 1000
                      ).toLocaleDateString()}
                    />
                    <DetailItem
                      label="Issued To"
                      value={studentInfo?.studentMetaMask || "loading..."}
                    />
                    <DetailItem
                      label="Authority"
                      value={studentInfo?.issuerOrg || "loading..."}
                    />
                    <DetailItem
                      label="Certificate Name"
                      value={studentInfo?.certificateName || "loading..."}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div onClick={analyzePDF} className="">
            <div className="bg-[#d3394d] px-4 py-1.5 my-4 rounded-lg text-center capitalize">{loadingGeminiResult ? (
              <div className="flex justify-center cursor-pointer">
                <Loader className="h-6 w-6 shrink-0 animate-spin" />
              </div>
            ) : "Analyze"}</div>
            {geminiResult.length > 0 && (
              <div className="bg-white/10 p-2 rounded-md text-justify">
                <div className="flex justify-center font-bold text-lg">AI Summary</div>
                {formatResponse(geminiResult)}</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white rounded-lg p-3 shadow-sm">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="font-medium text-gray-800 truncate">{value}</p>
  </div>
);

export default VerifyDocumentPage;
