"use client";
import React, { useState, useEffect } from "react";
import {
  Award,
  ExternalLink,
  Search,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import useDocumentVerificationStore from "@/lib/store/useDocumentVerificationStore";
import { useUser } from "@/hooks/useUser";
import { getCertificateByHash } from "@/lib/appwrite";

// Updated interface to include more detailed certificate information
interface DetailedCertificate {
  documentHash: string ;
  documentType: string;
  issuedDate: number;
  documentMetadata: string;
  authority: string;
  fileUrl?: string;
  additionalDetails?: any;
}

export default function IssuedCertificates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [certificates, setCertificates] = useState<DetailedCertificate[]>([]);
  const [studentAddress, setStudentAddress] = useState<string | null>(null);

  const { metaMask } = useUser();
  const { getStudentDocuments, getDocumentDetails } = useDocumentVerificationStore();

  // Enhanced fetch to get detailed certificate information
  const fetchStudentCertificates = async (address: string) => {
    try {
      // Get document hashes for the student
      const documentHashes = await getStudentDocuments(address);
      
      // Fetch details for each document with comprehensive information
      const certificateDetails = await Promise.all(
        documentHashes.map(async (hash) => {
          // Get basic document details from blockchain
          const baseDetails = await getDocumentDetails(hash);
          
          // Additional retrieval logic can be added here
          // For example, fetching additional metadata from other sources
          const additionalInfo = await getCertificateByHash(hash);
          
          // Merge blockchain details with additional information
          return {
            ...baseDetails,
            fileUrl: additionalInfo.success ? additionalInfo.response?.certificateUrl : undefined,
            additionalDetails: additionalInfo.success ? additionalInfo.response : null
          };
        })
      );


      console.log(certificateDetails)
      setCertificates(certificateDetails);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
      toast.error("Failed to retrieve certificates");
    }
  };

  // Filter certificates based on search 
  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.documentMetadata.toLowerCase().includes(searchTerm.toLowerCase());

    return filterType === "all" ? matchesSearch : matchesSearch;
  });

  // Fetch certificates when MetaMask address is available
  useEffect(() => {
    if (metaMask) {
      fetchStudentCertificates(metaMask);
      setStudentAddress(metaMask);
    }
  }, [metaMask]);

  return (
    <Layout>
      <div className="space-y-6 mt-[75px]">
        <Card className="shadow-custom bg-accent">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-500" />
                <CardTitle>Issued Certificates</CardTitle>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    placeholder="Search certificates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Certificates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!studentAddress ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Certificate</TableHead>
                        <TableHead>Issued By</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Issue Date
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCertificates.map((cert) => (
                        <TableRow key={cert.documentHash}>
                          <TableCell>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                              <div>
                                <div className="font-medium">{cert.additionalDetails.certificateName}</div>                
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{cert.additionalDetails.issuerOrg}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(cert.issuedDate * 1000).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Open certificate details or download
                                  if (cert.fileUrl) {
                                    window.open(cert.fileUrl, '_blank');
                                  }
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredCertificates.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      No certificates found.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}