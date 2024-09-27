import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileCheck, Users } from 'lucide-react'
import { ModeToggle } from '@/components/ui/ModeToggle';
import Navbar from '@/components/ui/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-bgg">
      <header className="border-b-2 border-primary/60">
        <Navbar/>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16 sm:py-24">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-4">
            Secure Document Verification<br />Powered by Blockchain
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Instantly verify credentials and documents with our cutting-edge blockchain technology.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <Card>
            <CardHeader>
              <Shield className="w-12 h-12 text-blue-500 mb-4" />
              <CardTitle>Secure & Tamper-Proof</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our blockchain technology ensures that once a document is verified, it cannot be altered or falsified.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <FileCheck className="w-12 h-12 text-green-500 mb-4" />
              <CardTitle>Instant Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Verify documents in seconds, saving time and resources for both issuers and verifiers.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="w-12 h-12 text-purple-500 mb-4" />
              <CardTitle>User-Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easy to use for students, employers, and educational institutions alike.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          © 2024 CertifyChain. All rights reserved.
        </div>
      </footer>
    </div>
  );
}


