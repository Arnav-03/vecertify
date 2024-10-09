"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, FileBadge, CircleUserRound, LayoutDashboard, LogOut, FolderKanban } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../ui/ModeToggle";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/appwrite';
import { toast } from 'sonner';

enum UserRole {
  STUDENT = 'student',
  AUTHORITY = 'authority',
  EMPLOYER = 'employer',
}

interface NavbarLoginProps {
  userRole: UserRole | string; 
}

const NavbarLogin: React.FC<NavbarLoginProps> = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [menuHeight, setMenuHeight] = useState<string>('0px');
  const pathname = usePathname();
  const navigate = useRouter();

  const navItems: Record<UserRole, { name: string; href: string; icon: React.ReactNode }[]> = {
    [UserRole.STUDENT]: [
      { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
      { name: 'Certifications', href: '/issued-certificates', icon: <FileBadge /> },
      { name: 'Profile', href: '/profile', icon: <CircleUserRound /> },
    ],
    [UserRole.AUTHORITY]: [
      { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
      { name: 'Issue Certificate', href: '/issue-certificate', icon: <FileBadge /> },
      { name: 'Manage Certificates', href: '/manage-certificates', icon: <FolderKanban /> },
    ],
    [UserRole.EMPLOYER]: [
      { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
      { name: 'Applications', href: '/applications', icon: <FileBadge /> },
      { name: 'Profile', href: '/profile', icon: <CircleUserRound /> },
    ],
  };

  useEffect(() => {
    if (isOpen) {
      const navbarHeight = 75; // This should match the height of your navbar
      const windowHeight = window.innerHeight;
      setMenuHeight(`${windowHeight - navbarHeight}px`);
    } else {
      setMenuHeight('0px');
    }
  }, [isOpen]);

  const NavLink: React.FC<{
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    icon: React.ReactNode;
  }> = ({ href, children, className, onClick, icon }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} passHref>
        <div
          className={`${className} pb-2 mt-2 ${isActive ? 'border-b-2 border-primary' : ''} text-[16px] flex items-center`}
          onClick={onClick}
        >
          {icon}
          <span className="ml-2">{children}</span>
        </div>
      </Link>
    );
  };

  const handleSignOut = async () => {
    try {
      const response = await logout();
      if (response.success) {
        navigate.push("/login");
        toast.success("Signed out successfully");
      } else {
        toast.error("Error signing out");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border overflow-visible w-full shadow-custom">
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
          <div className="hidden md:flex items-center text-primary font-bold text-lg space-x-4 lg:ml-[-50px]">
            {navItems[userRole as UserRole] && navItems[userRole as UserRole].map((item) => (
              <NavLink key={item.name} href={item.href} icon={item.icon}>
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="gap-2 items-center hidden md:flex mr-12">
            <ModeToggle />
            <LogOut className="h-6 w-6 mx-4 cursor-pointer text-primary" onClick={handleSignOut} />
          </div>
          <div className="flex items-center md:hidden">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-10 w-10 text-primary" /> : <Menu className="h-10 w-10 text-primary" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden fixed left-0 right-0 bg-background border-t border-border transition-all duration-300 ease-in-out overflow-hidden`}
          style={{
            top: '75px',
            height: menuHeight,
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? 'visible' : 'hidden'
          }}
        >
          <div className="flex flex-col text-primary font-bold space-y-4 p-4 h-full">
            {navItems[userRole as UserRole] && navItems[userRole as UserRole].map((item) => (
              <NavLink key={item.name} href={item.href} className="w-full justify-start" icon={item.icon} onClick={() => setIsOpen(false)}>
                {item.name}
              </NavLink>
            ))}
            <div className="flex-grow" />
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarLogin;
