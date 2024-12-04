"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Briefcase, GraduationCap, Building2 } from "lucide-react";
import SignupLeftPanel from "@/components/ui/LeftHero";
import Layout from "@/components/layout/Layout";
import { signUpWithEmail } from "@/lib/appwrite";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    metamaskAddress: '', // Initialize as an empty string
  });
  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchMetaMaskAddress = async () => {
    if (typeof window.ethereum !== "undefined" && window.ethereum.request) {
      try {
        const accounts = (await window.ethereum.request({
          method: "eth_requestAccounts",
        })) as string[];
  
        if (accounts && accounts.length > 0) {
          console.log(accounts);
          return accounts[0]; // Return the first account
        } else {
          toast.error("No accounts found in MetaMask");
          return ""; // Return an empty string as fallback
        }
      } catch (error) {
        console.error("MetaMask connection error:", error);
        toast.error("Failed to connect to MetaMask. Please try again.");
        return ""; // Return an empty string as fallback
      }
    } else {
      toast.error("MetaMask is not installed or enabled. Please install it to proceed.");
      return ""; // Return an empty string as fallback
    }
  };
  
  const handleMetaMaskConnect = async () => {
    const address = await fetchMetaMaskAddress();
    setFormData(prev => ({
      ...prev,
      metamaskAddress: address, // Ensure it's always a string
    }));
  };
  
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      // Fetch MetaMask address
      const metamaskAddress = await fetchMetaMaskAddress();
      if(metamaskAddress.length===0){
        
        return;
      }
      setFormData((prev) => ({ ...prev, metamaskAddress }));

      // Include MetaMask address in the signup request
      const result = await signUpWithEmail({ ...formData, metamaskAddress });

      if (result.success && result.otpSent) {
        // Redirect to OTP verification page with userId
        router.push(`/email-verify?userId=${result.userId}&role=${formData.role}`);
      } else {
        throw new Error(result.error || "Failed to create account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Error creating account", {
        description:
          "Please check your information and try again. If the problem persists, contact support.",
      });
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[100dvh] screen mt-[75px]">
        <div className="hidden md:flex w-full items-center justify-center flex-col bg-primary">
          <SignupLeftPanel />
        </div>
        <div className="flex flex-col w-full mt-[-50px] p-4 items-center justify-center">
          <Card className="w-full max-w-md bg-background shadow-custom">
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
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
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
                    onValueChange={(value) =>
                      handleInputChange({ target: { name: "role", value } })
                    }
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
