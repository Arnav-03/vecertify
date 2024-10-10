'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { AlertCircle, CalendarIcon, FileText, Loader2, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import Layout from '@/components/layout/Layout'
import NotAuthorized from '@/components/NotAuthorized'
import { useUser } from '@/hooks/useUser'
import { uploadPhoto } from '@/lib/FirebaseUpload'
import { createIssuedCertificate } from '@/lib/appwrite'

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const formSchema = z.object({
    studentRollNo: z.string().min(1, {
        message: "Student Roll No is required.",
    }),
    issueDate: z.date({
        required_error: "Issue date is required.",
    }),
    issuedBy: z.enum(["Dean", "Professor", "HOD", "Registrar"], {
        required_error: "Issuer role is required.",
    }),
    certificateId: z.string().min(1, {
        message: "Certificate ID is required.",
    }),
    courseName: z.string().min(1, {
        message: "Course name is required.",
    }),
    fileHash: z.string().optional(),
    certificateFile: z
        .custom<File>()
        .refine((file) => file instanceof File, "Please upload a file.")
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
            "Only PDF files are accepted."
        )
        .nullable(),
})
type FormValues = z.infer<typeof formSchema>;

const FormSkeleton = () => (
    <div className="container mx-auto px-4 py-8 ">
        <Card className="max-w-2xl mx-auto bg-background shadow-custom">
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96 mt-2" />
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    </div>
)

export default function IssueCertificate() {
    const { user, loading } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedFileName, setSelectedFileName] = useState<string>("")

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            courseName: "",
            issueDate: new Date(),
            studentRollNo: "",
            issuedBy: "Dean",
            certificateId: "",
            certificateFile: null,
            fileHash: "",
        },
    })

    const handleClearFile = () => {
        form.setValue('certificateFile', null);
        setSelectedFileName("");
    }
    const generateFileHash = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/api/generate-hash', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to generate hash')
            }

            const data = await response.json()
            return data.hash
        } catch (error) {
            console.error('Error generating hash:', error)
            toast.error('Failed to generate file hash')
            return null
        }
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue('certificateFile', file)
            setSelectedFileName(file.name)

            // Generate and set the file hash
            const hash = await generateFileHash(file)
            if (hash) {
                form.setValue('fileHash', hash)
            }
        }
    }

    async function onSubmit(values: FormValues) {
        if (!values.certificateFile || !values.fileHash) {
            toast.error("Please upload a certificate file.");
            return;
        }

        setIsSubmitting(true);
        try {
            const downloadURL = await uploadPhoto(values.certificateFile, values.certificateId, values.studentRollNo);
            console.log('File uploaded at:', downloadURL);
            const result = await createIssuedCertificate({
                courseName: values.courseName,
                issueDate: values.issueDate.toLocaleDateString('en-CA'),
                studentRollNo: values.studentRollNo,
                issuedBy: values.issuedBy,
                certificateId: values.certificateId,
                fileHash: values.fileHash, // Include the file hash
            }, downloadURL)

            if (result.success) {
                console.log({ ...values, fileUrl: downloadURL });
                toast.success("Certificate Issued");
                form.reset();
                setSelectedFileName("");
            } else {
                toast.error("Failed to issue certificate");
            }
        } catch (error) {
            console.error("Error issuing certificate:", error);
            toast.error("Failed to issue certificate");
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <Layout>
            {loading ? (
                <FormSkeleton />
            ) : user?.labels[0] !== "authority" ? (
                <NotAuthorized />
            ) : (
                <div className="container mx-auto px-4 py-8 mt-[75px]">
                    <Card className="max-w-2xl mx-auto shadow-custom">
                        <CardHeader>
                            <CardTitle className="text-2xl">Issue New Certificate</CardTitle>
                            <CardDescription>Fill in the details to issue a new certificate for a student.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="certificateId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Certificate ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter certificate ID" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="studentRollNo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Student Roll No</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter student roll number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="courseName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Course Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter course name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="issueDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Issue Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="issuedBy"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Issued By</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select issuer" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Dean">Dean</SelectItem>
                                                        <SelectItem value="HOD">Head of Department</SelectItem>
                                                        <SelectItem value="Professor">Professor</SelectItem>
                                                        <SelectItem value="Registrar">Registrar</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="certificateFile"
                                        render={({ field: { onChange, value, ...field } }) => (
                                            <FormItem>
                                                <FormLabel>Certificate PDF</FormLabel>
                                                <FormControl>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="relative h-9">
                                                            <Input
                                                                type="file"
                                                                accept=".pdf"
                                                                onChange={handleFileChange}
                                                                {...field}
                                                                className="cursor-pointer"
                                                                key={value ? 'file-selected' : 'no-file'}
                                                            />
                                                        </div>
                                                        {(value || selectedFileName) && (
                                                            <div className="flex items-center justify-between bg-accent p-2 rounded">
                                                                <span className="text-sm truncate">
                                                                    {selectedFileName || (value instanceof File ? value.name : '')}
                                                                </span>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={handleClearFile}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                                <p className="text-sm text-muted-foreground">
                                                    Upload a PDF file (max 5MB)
                                                </p>
                                            </FormItem>
                                        )}
                                    />
                                    <Alert className='bg-secondary'>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Important</AlertTitle>
                                        <AlertDescription>
                                            Once issued, the certificate will be permanently recorded on the blockchain and cannot be altered.
                                        </AlertDescription>
                                    </Alert>
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Issuing Certificate...
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="mr-2 h-4 w-4" />
                                                Issue Certificate
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Layout>
    )
}