"use client";

import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Lock, Loader } from "lucide-react";
import { verifyEmailOTP } from "@/lib/appwrite";
import { useRouter } from 'next/navigation';

interface OTPVerificationFormProps {
    userId: string;
    role: string; // Add role to the props
}

const OTPVerificationForm = ({ userId, role }: OTPVerificationFormProps) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;
    if (!/^[0-9]$/.test(value)) return;

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });

    if (value !== "" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace') {
      event.preventDefault();

      if (otp[index] !== '') {
        setOtp((prevOtp) => {
          const newOtp = [...prevOtp];
          newOtp[index] = '';
          return newOtp;
        });
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setOtp((prevOtp) => {
          const newOtp = [...prevOtp];
          newOtp[index - 1] = '';
          return newOtp;
        });
      }
    }
  };
  
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError("");

    const otpSecret = otp.join("");

    try {
      const result = await verifyEmailOTP(userId, otpSecret,role);

      if (result.success) {
        setIsVerified(true);
        router.push(`/details?role=${role}`);
      } else {
        setError(result.error ?? "");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("An error occurred while verifying the OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  if (isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-screen "
      >
        <div className=" w-4/5 lg:w-96 p-8 bg-white bg-opacity-20 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-6"
          >
            <CheckCircle className="h-24 w-24 text-green-500" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">Verified!</h1>
          <p className="text-lg text-center text-black dark:text-white">Thank you for verifying your email.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <div className=" w-4/5 lg:w-96 p-8 bg-white shadow-custom bg-opacity-20 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex justify-center mb-6"
        >
          <Lock className="h-16 w-16 text-black dark:text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">Verify OTP</h1>
        <p className="mb-6 text-center text-black dark:text-white">Enter the 6-digit code sent to your email</p>
        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <Input
              key={index}
              className="w-10 h-10 lg:w-12 lg:h-12   text-center text-2xl bg-white bg-opacity-20 border-[1px] border-black dark:border-white rounded-lg outline-none  transition-all duration-300"
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              ref={(el) => {
                inputRefs.current[index] = el;
              }} />
          ))}
        </div>
        <Button
          onClick={handleVerifyOtp}
          className="w-full bg-primary hover:bg-opacity-30 text-white rounded-lg border-white transition-all duration-300"
          disabled={isLoading || !isOtpComplete}
        >
          {isLoading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="mt-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-500 dark:text-white">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default OTPVerificationForm;