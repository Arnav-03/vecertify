"use client"
import React, { useState } from 'react';
import {
    Award,
    Download,
    ExternalLink,
    Filter,
    Search,
    Share2,
    CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import Layout from '@/components/layout/Layout';

// Mock data for demonstration
const mockCertificates = [
    {
        id: '1',
        title: 'Web Development Fundamentals',
        issuer: 'Tech Academy',
        issueDate: '2024-03-15',
        expiryDate: '2027-03-15',
        status: 'Valid',
        credentialID: 'CERT-WD-001'
    },
    {
        id: '2',
        title: 'Data Science Specialization',
        issuer: 'DataLearn Institute',
        issueDate: '2024-02-01',
        expiryDate: '2027-02-01',
        status: 'Valid',
        credentialID: 'CERT-DS-045'
    },
    {
        id: '3',
        title: 'UI/UX Design Principles',
        issuer: 'Design School Pro',
        issueDate: '2024-01-10',
        expiryDate: '2027-01-10',
        status: 'Valid',
        credentialID: 'CERT-UX-112'
    }
];

export default function IssuedCertificates() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredCertificates = mockCertificates.filter(cert => {
        const matchesSearch =
            cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.credentialID.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterType === 'all') return matchesSearch;
        return matchesSearch && cert.status.toLowerCase() === filterType.toLowerCase();
    });

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
                                <Select
                                    value={filterType}
                                    onValueChange={setFilterType}
                                >
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Filter by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Certificates</SelectItem>
                                        <SelectItem value="valid">Valid</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Certificate</TableHead>
                                        <TableHead>Issuer</TableHead>
                                        <TableHead className="hidden md:table-cell">Issue Date</TableHead>
                                        <TableHead className="hidden lg:table-cell">Credential ID</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCertificates.map((cert) => (
                                        <TableRow key={cert.id}>
                                            <TableCell>
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                                                    <div>
                                                        <div className="font-medium">{cert.title}</div>
                                                        <div className="text-sm text-muted-foreground md:hidden">{cert.issueDate}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{cert.issuer}</TableCell>
                                            <TableCell className="hidden md:table-cell">{cert.issueDate}</TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                                                    {cert.credentialID}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm">
                                                        <Download className="h-4 w-4" />
                                                        <span className="sr-only">Download</span>
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Share2 className="h-4 w-4" />
                                                        <span className="sr-only">Share</span>
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <ExternalLink className="h-4 w-4" />
                                                        <span className="sr-only">View</span>
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
                                <p className="text-muted-foreground">No certificates found matching your criteria.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>

    );
}