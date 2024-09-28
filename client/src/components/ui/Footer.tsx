import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background text-gray-300">
      <div className="max-w-7xl mx-auto px-0 pt-12 py-6 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center text-2xl font-bold text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="mr-2">
                <circle cx="16" cy="16" r="15" fill="#e11d48" />
                <circle cx="16" cy="16" r="8" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="16" cy="7" r="3" fill="white" />
                <circle cx="23.5" cy="20.5" r="3" fill="white" />
                <circle cx="8.5" cy="20.5" r="3" fill="white" />
                <path d="M14 16L16 18L20 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              DecentraVerify
            </div>
            <p className="text-sm mb-4">
              Empowering trust in the digital age through decentralized verification solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <div className="flex items-center mb-2">
              <Mail size={18} className="mr-2" />
              <a href="mailto:arnavarora0003@gmail.com" className="hover:text-primary transition-colors">
                arnavarora0003@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section with social icons and copyright */}
        <div className="mt-8 pt-8  border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
          </div>
          <div className="text-sm">
            © {currentYear} DecentraVerify. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer