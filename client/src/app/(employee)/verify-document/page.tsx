"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileCheck2, FileX2, Upload } from "lucide-react";
import useDocumentVerificationStore from "@/lib/store/useDocumentVerificationStore";
import Layout from "@/components/layout/Layout";
import { getCertificateByHash } from "@/lib/appwrite";

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
  const [studentInfo, setStudentInfo] = useState<CertificateDocument | null>(null);


  const [verificationResult, setVerificationResult] = useState<boolean | null>(
    null
  );
  const [documentDetails, setDocumentDetails] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

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
            <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center justify-center">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-4"
              >
                <Upload size={48} className="text-blue-500" />
                <span className="text-gray-600">
                  {file ? file.name : "Upload Document"}
                </span>
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
                  className={`flex items-center space-x-4 p-4 rounded-lg ${
                    verificationResult
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
