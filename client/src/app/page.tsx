import React from 'react';
import { Shield, FileCheck, Database, Cpu, Lock, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import blockchain from '../../public/blockchain.png';

interface FeatureCardProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}
interface ProcessStepProps {
  number: number; // Specify that number should be of type number
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-accent text-card-foreground p-6 rounded-lg shadow-custom ">
    <Icon className="w-12 h-12 text-primary mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);
const ProcessStep: React.FC<ProcessStepProps> = ({ number, title, description }) => (
  <div className="flex items-start space-x-6 p-6 rounded-lg bg-accent shadow-custom">
    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center md:text-start  flex flex-col md:flex-row  gap-4">
        <div className="w-full flex flex-col justify-center md:justify-start items-center md:items-start ">
        <div className="text-5xl text-primary font-bold my-4 flex items-center justify-center md:justify-start gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="15" fill="#e11d48" />
              <circle cx="16" cy="16" r="8" fill="none" stroke="white" stroke-width="2" />
              <circle cx="16" cy="7" r="3" fill="white" />
              <circle cx="23.5" cy="20.5" r="3" fill="white" />
              <circle cx="8.5" cy="20.5" r="3" fill="white" />
              <path d="M14 16L16 18L20 14" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          DecentraVerify</div>
        <h1 className="text-3xl  font-bold mb-4">Secure Document Verification Powered by Blockchain</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Instantly verify credentials and documents with our cutting-edge blockchain technology.
        </p>
        <Button size="lg" className="text-lg bg-primary px-8 py-6 w-fit">Get Started</Button>
        </div>
   
        <div className="w-full flex items-center justify-center">
        <Image src={blockchain} alt='blockchain' height={300} />
        </div>
      </header>

      <section className="my-16">
        <h2 className="text-3xl font-semibold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Shield}
            title="Blockchain Security"
            description="Leverage the immutability and transparency of blockchain for foolproof verification."
          />
          <FeatureCard
            icon={FileCheck}
            title="Instant Verification"
            description="Get real-time results for document authenticity checks."
          />
          <FeatureCard
            icon={Database}
            title="Decentralized Storage"
            description="Ensure data integrity with distributed ledger technology."
          />
          <FeatureCard
            icon={Cpu}
            title="AI-Powered Analysis"
            description="Utilize advanced AI for complex document and legal text analysis."
          />
          <FeatureCard
            icon={Lock}
            title="Privacy-Focused"
            description="Maintain confidentiality with state-of-the-art encryption methods."
          />
          <FeatureCard
            icon={CheckCircle}
            title="Tamper-Proof"
            description="Detect any alterations to documents with our robust verification system."
          />
        </div>
      </section>

      <section className="mb-16 w-full">
        <h2 className="text-3xl font-semibold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       
            <ProcessStep
              number={1}
              title="Authorities Issue Credentials"
              description="Educational institutions and other authorities securely issue credentials and store their hash on the blockchain."
            />
      
       
            <ProcessStep
              number={2}
              title="Document Submission"
              description="Students or individuals submit their documents for verification through our platform."
            />
      
       
            <ProcessStep
              number={3}
              title="Blockchain Verification"
              description="Our system hashes the submitted document and compares it with the blockchain record for authenticity."
            />
      
       
            <ProcessStep
              number={4}
              title="AI Analysis"
              description="For applicable documents, our AI system performs in-depth analysis of legal and complex texts."
            />
      
       
            <ProcessStep
              number={5}
              title="Results Delivery"
              description="Verification results are securely provided to students, individuals, or institutions as required."
            />
      
        </div>
      </section>
      <section className="text-center ">
        <h2 className="text-3xl font-semibold mb-4">Ready to Transform Document Verification?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join DecentraVerify today and experience the future of secure, efficient credential verification.
        </p>
        <Button size="lg" className="text-lg px-8 py-6">Start Verifying Now</Button>
      </section>
    </div>
  );
};

export default LandingPage;
