"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import SignupLeftPanel from '@/components/ui/LeftHero';
import Layout from '@/components/layout/Layout';
import { signUpWithEmail } from '@/lib/appwrite';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const result = await signUpWithEmail(formDataToSend);

      if (result.success) {
        toast.success("Account created successfully", {
          description: "Welcome to Credify. Redirecting you to your dashboard...",
          action: {
            label: "Dismiss",
            onClick: () => console.log("Dismissed"),
          },
        });
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        throw new Error(result.error || "Failed to create account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Error creating account", {
        description: "Please check your information and try again. If the problem persists, contact support.",
      });
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[100dvh] screen mt-[75px]  ">
        <div className="hidden md:flex w-full items-center justify-center   flex-col bg-primary"><SignupLeftPanel /></div>
        <div className="flex flex-col w-full mt-[-50px] p-4 items-center justify-center">
          <Card className="w-full max-w-md bg-background shadow-custom " >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" />
                Sign Up
              </CardTitle>
              <CardDescription>
                Create your account by selecting your role and filling in your details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select your role</Label>
                  <RadioGroup
                    name="role"
                    value={formData.role}
                    onValueChange={(value) => handleInputChange({ target: { name: 'role', value } })}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Student
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="authority" id="authority" />
                      <Label htmlFor="authority" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Authority
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employer" id="employer" />
                      <Label htmlFor="employer" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Employer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}