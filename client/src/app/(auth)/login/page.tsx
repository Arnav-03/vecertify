"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { LogIn, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import SignupLeftPanel from '@/components/ui/LeftHero';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { toast } from 'sonner';
import { getLoggedInUser, loginWithEmail } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: { target: any; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); 
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getLoggedInUser();
        if (user) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      }
    };

    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const result = await loginWithEmail(formDataToSend);
      if (result.success) {
        toast.success("Login successful", {
          description: "Welcome back to DecentraVerify. Redirecting you to your dashboard...",
        });
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        throw new Error(result.error || "Failed to log in");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error logging in", {
        description: "Please check your credentials and try again. If the problem persists, contact support.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[100dvh] mt-[75px]">
        <div className="hidden md:flex w-full items-center justify-center flex-col bg-primary">
          <SignupLeftPanel />
        </div>
        <div className="flex flex-col w-full mt-[-50px] p-4 items-center justify-center">
          <Card className="w-full max-w-md bg-background shadow-custom">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-6 w-6" />
                Login
              </CardTitle>
              <CardDescription>
                Welcome back! Please select your role and enter your credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
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
                      <RadioGroupItem value="student" id="login-student" />
                      <Label htmlFor="login-student" className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Student
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="authority" id="login-authority" />
                      <Label htmlFor="login-authority" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Authority
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employer" id="login-employer" />
                      <Label htmlFor="login-employer" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Employer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link 
                    href="/signup" 
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}