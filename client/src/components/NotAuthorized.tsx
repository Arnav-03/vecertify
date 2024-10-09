import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, Home, LogIn } from 'lucide-react'

export default function Unauthorized() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background mt-[50px] flex flex-col justify-center items-center p-4">
      <Card className="max-w-md w-full shadow-custom">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-yellow-100 text-yellow-600 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription>You are not authorized to view this page.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            If you believe this is an error, please contact your system administrator or try logging in with an account that has the necessary permissions.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full" 
            variant="default"
            onClick={() => router.push('/login')}
          >
            <LogIn className="mr-2 h-4 w-4" /> Log In
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => router.push('/')}
          >
            <Home className="mr-2 h-4 w-4" /> Go to Homepage
          </Button>
          <Button 
            className="w-full" 
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}