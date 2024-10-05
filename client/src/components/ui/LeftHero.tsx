import React from 'react';
import Image from 'next/image';

export default function SignupLeftPanel() {

  return (
    <div className="hidden md:flex flex-col items-center justify-between  w-full rounded-lg  text-primary-foreground p-4 ">
      <div className="">
        <div className="flex items-center gap-4 my-4  ">
        <div className="border-white flex items-center justify-center rounded-full   border-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="15" fill="#e11d48" />
            <circle cx="16" cy="16" r="8" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="16" cy="7" r="3" fill="white" />
            <circle cx="23.5" cy="20.5" r="3" fill="white" />
            <circle cx="8.5" cy="20.5" r="3" fill="white" />
            <path d="M14 16L16 18L20 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
          <span className="text-4xl font-bold text-primary-foreground">DecentraVerify</span>
        </div>
        
        <div>
          <h1 className="text-4xl font-bold mb-2">Join the Future of Document Verification</h1>
          <p className="text-muted-foreground text-xl">
            Create your account to experience secure, blockchain-powered credential verification.
          </p>
        </div>

        <div className="relative h-48 w-full">
          <Image 
            src="/blockchain.png"
            alt="Blockchain Verification Illustration"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>
    </div>
  );
}