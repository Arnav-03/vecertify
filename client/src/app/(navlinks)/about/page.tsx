import React from 'react';
import { Shield, FileCheck, Database, Cpu, Lock, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import blockchain from '../../../../public/blockchain.png';
import Layout from '@/components/layout/Layout';

interface FeatureCardProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-accent text-card-foreground p-6 rounded-lg shadow-custom">
    <Icon className="w-12 h-12 text-primary mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-16 pb-4 w-full mt-8 border-t-2 min-h-[100dvh]">
        {/* Project Overview Section */}
        <header className="text-center md:text-start flex flex-col md:flex-row gap-4 mt-10">
          <div className="w-full flex flex-col justify-center md:justify-start items-center md:items-start">
            <div className="text-4xl lg:text-5xl text-primary font-bold flex items-center justify-center md:justify-start gap-4 my-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="15" fill="#e11d48" />
                <circle cx="16" cy="16" r="8" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="16" cy="7" r="3" fill="white" />
                <circle cx="23.5" cy="20.5" r="3" fill="white" />
                <circle cx="8.5" cy="20.5" r="3" fill="white" />
                <path d="M14 16L16 18L20 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              About The Project
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              DecentraVerify leverages blockchain technology to revolutionize document verification, 
              making it secure, efficient, and tamper-proof.
            </p>
          </div>
          <div className="w-full flex items-center justify-center">
            <Image src={blockchain} alt='blockchain' height={300} priority />
          </div>
        </header>

        {/* How It Works Section */}
        <section className="my-16">
          <h2 className="text-3xl font-semibold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FileCheck}
              title="Document Submission"
              description="Upload your document through our secure interface. The system generates a unique hash of your document."
            />
            <FeatureCard
              icon={Database}
              title="Blockchain Storage"
              description="The document hash is stored on the blockchain, creating an immutable record of its existence and content."
            />
            <FeatureCard
              icon={Cpu}
              title="Verification Process"
              description="When verification is needed, the system compares the current document's hash with the blockchain record."
            />
          </div>
        </section>

        {/* Key Advantages Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8">Key Advantages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="Immutable Security"
              description="Once recorded on the blockchain, document verification data cannot be altered or tampered with."
            />
            <FeatureCard
              icon={Lock}
              title="Privacy Focused"
              description="Your documents remain private. Only the hash is stored on the blockchain, ensuring confidentiality."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Instant Verification"
              description="Verify documents in seconds, eliminating lengthy manual verification processes."
            />
          </div>
        </section>


        {/* Use Cases Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-accent p-6 rounded-lg shadow-custom">
              <h3 className="text-xl font-semibold mb-2">Educational Institutions</h3>
              <p className="text-muted-foreground">Verify academic credentials and transcripts instantly.</p>
            </div>
            <div className="bg-accent p-6 rounded-lg shadow-custom">
              <h3 className="text-xl font-semibold mb-2">Corporate Sector</h3>
              <p className="text-muted-foreground">Validate employment records and professional certifications.</p>
            </div>
            <div className="bg-accent p-6 rounded-lg shadow-custom">
              <h3 className="text-xl font-semibold mb-2">Government Agencies</h3>
              <p className="text-muted-foreground">Secure verification of official documents and licenses.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-10">
          <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the future of secure document verification with DecentraVerify.
          </p>
          <Button size="lg" className="text-lg px-8 py-6">Start Verifying Now</Button>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;