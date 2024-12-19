"use client";
import React, { useState, useEffect } from "react";
import { User, LogOut, Moon, Sun, Mail, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { useUser } from "@/hooks/useUser"; 
import { useTheme } from "next-themes";

const SettingsPage = () => {
  const router = useRouter();
  const { user, setUser,loading } = useUser();
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize isDarkMode based on theme
  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);
    
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        router.push("/login");
        toast.success("Logged out successfully");
        setUser(null);
      }
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <Layout>
      <div className="bg-background py-8 px-4 sm:px-6 lg:px-8 mt-[90px]">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <User className="w-6 h-6" />
                      Settings
                    </h2>
                    <p className="text-muted-foreground">
                      Manage your account preferences
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleLogout()}
                    className="bg-red-600 hover:text-red-600 hover:bg-red-50 border-none text-primary-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>

                {/* Profile Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Profile Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        readOnly
                        value={user?.name || "Loading..."}
                        className="max-w-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        readOnly
                        value={user?.email || "Loading..."}
                        className="max-w-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Theme Preference */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Theme Preference</h3>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={!isDarkMode ? "secondary" : "outline"}
                      onClick={() => {
                        setIsDarkMode(false);
                        setTheme("light");
                      }}
                      className="flex items-center gap-2"
                    >
                      <Sun className="w-4 h-4" />
                      Light
                    </Button>
                    <Button
                      variant={isDarkMode ? "secondary" : "outline"}
                      onClick={() => {
                        setIsDarkMode(true);
                        setTheme("dark");
                      }}
                      className="flex items-center gap-2"
                    >
                      <Moon className="w-4 h-4" />
                      Dark
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;