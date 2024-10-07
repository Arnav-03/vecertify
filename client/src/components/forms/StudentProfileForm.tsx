"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { createStudentProfile } from "@/lib/appwrite"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  collegeName: z.string({
    required_error: "Please select a college.",
  }),
  rollno: z.string().min(4, {
    message: "Full name must be at least 4 characters.",
  }),
  degreeName: z.string({
    required_error: "Please select a degree.",
  }),
  branchName: z.string({
    required_error: "Please select a branch.",
  }),
  gradYear: z.string({
    required_error: "Please select a graduation year.",
  }),
})

const collegeOptions = ["CCET"]
const degreeOptions = ["B.E."]
const branchOptions = ["Computer Science", "Electronics and Communication", "Civil Engineering"]
const gradYearOptions = ["2025", "2026"]

export default function StudentProfileForm() {
  const navigate=useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collegeName: "",
      rollno: "",
      degreeName: "",
      branchName: "",
      gradYear: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      const result = await createStudentProfile(values); 
      if (result.success) {
        toast.success("Profile completed successfully");
        navigate.push('/dashboard');
      } else {
        toast.error(result.error || "Failed to complete profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-custom mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Student Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 outline-none">
          <FormField
            control={form.control}
            name="collegeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your college" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {collegeOptions.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rollno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College Roll Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your College Roll Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="degreeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your degree" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {degreeOptions.map((degree) => (
                      <SelectItem key={degree} value={degree}>
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="branchName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {branchOptions.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gradYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graduation Year</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your graduation year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gradYearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Complete Profile</Button>
        </form>
      </Form>
    </div>
  )
}