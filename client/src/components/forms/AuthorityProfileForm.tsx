"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createAuthorityProfile } from "@/lib/appwrite"

const formSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  organizationType: z.string({
    required_error: "Please select an organization type.",
  }),
  designation: z.string().min(2, {
    message: "Designation must be at least 2 characters.",
  }),
  websiteUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  officialIdNumber: z.string().min(4, {
    message: "Official ID number must be at least 4 characters.",
  }),
  organizationEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  organizationPhone: z.string().regex(/^\+?[\d\s-]+$/, {
    message: "Please enter a valid phone number.",
  }),
})

const organizationTypes = [
  "Educational Institution",
  "Government Body",
  "Certification Agency",
  "Professional Association",
  "Accreditation Board"
]

const designations = [
  "Director",
  "Manager",
  "Coordinator",
  "Administrator",
  "Officer"
]

export default function AuthorityProfileForm() {
  const navigate = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      organizationType: "",
      designation: "",
      websiteUrl: "",
      officialIdNumber: "",
      organizationEmail: "",
      organizationPhone: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Sending", values);
      const result = await createAuthorityProfile(values);
     
      if (result.success) {
        toast.success("Authority profile completed successfully");
        navigate.push('/dashboard');
      } else {
        toast.error("Failed to complete authority profile");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-custom mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Authority Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your organization name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="organizationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {organizationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {designations.map((designation) => (
                      <SelectItem key={designation} value={designation}>
                        {designation}
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
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Official Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="officialIdNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Official ID Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter official ID number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organizationEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Email</FormLabel>
                <FormControl>
                  <Input placeholder="org@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organizationPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 234 567 8900" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Complete Authority Profile</Button>
        </form>
      </Form>
    </div>
  )
}
