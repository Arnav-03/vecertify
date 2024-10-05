import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DecentraVerify",
  description: "Secure and Efficient Credential Verification.",
  openGraph: {
    title: 'DecentraVerify',
    description: 'Secure and Efficient Credential Verification.',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/fileshare-60268.appspot.com/o/Fileophile%2Farnavarora0003gmail%2Fog.PNG?alt=media&token=b90bcea7-5724-4e9b-9819-742c435de565',
        width: 1200,
        height: 630,
        alt: 'Og Image Alt',
      },
    ],
    url: 'https://decentra-verify.vercel.app/',
    type: 'website',
  },
  twitter: {
    title: 'DecentraVerify',
    description: 'Secure and Efficient Credential Verification.',
    images: ['https://firebasestorage.googleapis.com/v0/b/fileshare-60268.appspot.com/o/Fileophile%2Farnavarora0003gmail%2Fog.PNG?alt=media&token=b90bcea7-5724-4e9b-9819-742c435de565'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}