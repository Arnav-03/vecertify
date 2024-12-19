"use client";

import React, { useState, useEffect } from "react";
import { Award, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getVerifiedCertificatesByEmployerEmail } from "@/lib/appwrite";
import { useUser } from "@/hooks/useUser";

interface Certificate {
    $id: string;
    name: string;
    by: string;
    verifyDate: string;
    status: string;
}

export default function IssuedCertificates(): JSX.Element {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterType, setFilterType] = useState<string>("all");
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useUser();
    const employerEmail = user?.email || "";

    useEffect(() => {
        const fetchCertificates = async (): Promise<void> => {
            setLoading(true);
            try {
                const result = await getVerifiedCertificatesByEmployerEmail(employerEmail);
                if (result.success) {
                    setCertificates(result.response as unknown as Certificate[]);
                } else {
                    toast.error(result.error || "Failed to fetch certificates");
                }
            } catch (error) {
                toast.error("An error occurred while fetching certificates");
                console.error("Error fetching certificates:", error);
            } finally {
                setLoading(false);
            }
        };

        if (employerEmail) {
            fetchCertificates();
        }
    }, [employerEmail]);

    const filteredCertificates = certificates.filter((cert) => {
        const matchesSearch =
            cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.by.toLowerCase().includes(searchTerm.toLowerCase());

        return filterType === "all" ? matchesSearch : matchesSearch;
    });

    return (
        <Layout>
            <div className="space-y-6 mt-[100px]">
                <Card className="shadow-custom bg-accent">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Award className="h-6 w-6 text-yellow-500" />
                                <CardTitle>Applications</CardTitle>
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
                        {loading ? (
                            <div className="text-center py-6">Loading...</div>
                        ) : (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Certificate Name</TableHead>
                                                <TableHead>Verified By</TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Date of Verification
                                                </TableHead>
                                                <TableHead>Verification Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredCertificates.map((cert) => (
                                                <TableRow key={cert.$id}>
                                                    <TableCell>{cert.name}</TableCell>
                                                    <TableCell>{cert.by}</TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {cert.verifyDate}
                                                    </TableCell>
                                                    <TableCell>
                                                        {cert.status === "true" ? (
                                                            <span className="text-green-500">Verified</span>
                                                        ) : (
                                                            <span className="text-red-500">Unverified</span>
                                                        )}
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
