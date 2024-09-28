"use client"
import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./ModeToggle"
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuHeight, setMenuHeight] = useState('0px')
  const pathname = usePathname()

  const navItems = [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  useEffect(() => {
    if (isOpen) {
      const navbarHeight = 75 // This should match the height of your navbar
      const windowHeight = window.innerHeight
      setMenuHeight(`${windowHeight - navbarHeight}px`)
    } else {
      setMenuHeight('0px')
    }
  }, [isOpen])

  interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }

  const NavLink: React.FC<NavLinkProps> = ({ href, children, className, onClick }) => {
    const isActive = pathname === href
    return (
      <Link href={href} passHref>
        <div
          className={`${className} ${isActive ? 'border-b-2 border-primary' : ''} text-[16px] `}
          onClick={onClick}
        >
          {children}
        </div>
      </Link>
    )
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border overflow-visible w-full">
        <div className="flex justify-around items-center p-4 md:px-8 h-[75px] max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-primary flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="15" fill="#e11d48" />
              <circle cx="16" cy="16" r="8" fill="none" stroke="white" strokeWidth="2" />
              <circle cx="16" cy="7" r="3" fill="white" />
              <circle cx="23.5" cy="20.5" r="3" fill="white" />
              <circle cx="8.5" cy="20.5" r="3" fill="white" />
              <path d="M14 16L16 18L20 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            DecentraVerify
          </div>
          <div className="hidden md:flex items-center text-lg space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.name} href={item.href}>
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="gap-2 items-center hidden md:flex">
            <ModeToggle />
            <Button className='text-[16px] bg-primary p-4 py-5'>Get Started</Button>
          </div>
          <div className="flex items-center md:hidden">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-10 w-10" /> : <Menu className="h-10 w-10" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden fixed left-0 right-0 bg-background border-t border-border transition-all duration-300 ease-in-out overflow-hidden`}
          style={{ 
            top: '75px', // This should match the height of your navbar
            height: menuHeight,
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? 'visible' : 'hidden'
          }}
        >
          <div className="flex flex-col space-y-4  p-4 h-full">
            {navItems.map((item) => (
              <NavLink key={item.name} href={item.href} className="w-full justify-start" onClick={() => setIsOpen(false)}>
                {item.name}
              </NavLink>
            ))}
            <div className="flex-grow" /> {/* This pushes the content to the top */}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar