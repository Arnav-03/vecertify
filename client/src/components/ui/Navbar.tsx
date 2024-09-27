"use client"
import React, { useState } from 'react'
import {  Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./ModeToggle"
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
  }

  const NavLink: React.FC<NavLinkProps> = ({ href, children, className }) => {
    const isActive = pathname === href
    return (
      <Link href={href} passHref>
        <Button
          variant={isActive ? "default" : "ghost"}
          className={`${className} ${isActive ? 'bg-primary  text-primary-foreground' : ''} text-[16px] `}
        >
          {children}
        </Button>
      </Link>
    )
  }

  return (
    <nav className="flex justify-between items-center p-4 md:px-8
    sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-[1px] h-[75px]">
      <div className="text-2xl font-bold text-primary flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="15" fill="#e11d48" />
          <circle cx="16" cy="16" r="8" fill="none" stroke="white" stroke-width="2" />
          <circle cx="16" cy="7" r="3" fill="white" />
          <circle cx="23.5" cy="20.5" r="3" fill="white" />
          <circle cx="8.5" cy="20.5" r="3" fill="white" />
          <path d="M14 16L16 18L20 14" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>   
        DecentraVerify</div>
      <div className="hidden md:flex items-center text-lg space-x-4">
        {navItems.map((item) => (
          <NavLink key={item.name} href={item.href}>
            {item.name}
          </NavLink>
        ))}
        <ModeToggle />
        <Button className='text-[16px] bg-primary p-4 py-5 '>Get Started</Button>
      </div>
      <div className="flex items-center md:hidden">
        <ModeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-10 w-10" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Custom Sheet */}
        <div
          className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none '
            }`}
          onClick={() => setIsOpen(false)} // Close the sheet on background click
        >
          <div
            className={`fixed right-0 top-0 h-full w-[300px] sm:w-[400px] bg-background shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col   ${isOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sheet
          >
            <div className="w-full text-center mt-4  text-2xl font-bold border-b-2 pb-4 p-2">Vecertify</div>
            <div className="flex flex-col space-y-4 mt-4 p-4">
              {navItems.map((item) => (
                <NavLink key={item.name} href={item.href} className="w-full justify-start">
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
