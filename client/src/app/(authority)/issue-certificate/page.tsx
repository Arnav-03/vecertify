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
import { AlertCircle, CalendarIcon, FileText, Loader2, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import Layout from '@/components/layout/Layout'
import NotAuthorized from '@/components/NotAuthorized'
import { useUser } from '@/hooks/useUser'
import { uploadPhoto } from '@/lib/FirebaseUpload'

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const formSchema = z.object({
    studentRollNo: z.string().min(1, {
        message: "Student Roll No is required.",
    }),
    studentName: z.string().min(2, {
        message: "Student name must be at least 2 characters.",
    }),
    courseName: z.string().min(1, {
        message: "Course name is required.",
    }),
    issueDate: z.date({
        required_error: "Issue date is required.",
    }),
    issuedBy: z.enum(["Dean", "Professor", "HOD", "Registrar"], {
        required_error: "Issuer role is required.",
    }),
    certificateType: z.enum(["completion", "participation", "achievement"], {
        required_error: "Certificate type is required.",
    }),
    certificateId: z.string().min(1, {
        message: "Certificate ID is required.",
    }),
    certificateFile: z
        .instanceof(File)
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
            "Only PDF files are accepted."
        ),
})

const FormSkeleton = () => (
    <div className="container mx-auto px-4 py-8 mt-[75px]">
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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentRollNo: "",
            studentName: "",
            courseName: "",
            issueDate: new Date(),
            issuedBy: "Dean",
            certificateType: "completion",
            certificateId: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const downloadURL = await uploadPhoto(values.certificateFile, values.certificateId, values.studentRollNo);
            console.log('File uploaded at:', downloadURL);
            /*             const result= await createIssuedCertificate(values,downloadURL);
             */
            console.log({ ...values, fileUrl: downloadURL });
            toast.success("Certificate Issued");
            form.reset();
            setIsSubmitting(false);

        } catch (error) {
            console.error("Error issuing certificate:", error);
            toast.error("Failed to issue certificate");
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
                                    {/* Rest of the form fields remain unchanged */}
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
                                        name="studentName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Student Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter student name" {...field} />
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
                                        name="certificateType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Certificate Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a certificate type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="completion">Completion</SelectItem>
                                                        <SelectItem value="participation">Participation</SelectItem>
                                                        <SelectItem value="achievement">Achievement</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="certificateFile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Certificate PDF</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-4">
                                                        <Input
                                                            type="file"
                                                            accept=".pdf"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                field.onChange(file);
                                                            }}
                                                            className="cursor-pointer bg-accent"
                                                        />
                                                        <Upload className="h-4 w-4 text-muted-foreground" />
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