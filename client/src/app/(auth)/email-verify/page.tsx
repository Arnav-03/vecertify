"use client"
import React, { Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import OTPVerificationForm from "./OTPVerification";

const OTPVerificationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPVerificationContent />
    </Suspense>
  );
};

const OTPVerificationContent = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const role = searchParams.get('role') || '';

  return <OTPVerificationForm userId={userId} role={role} />;
};

export default OTPVerificationPage;