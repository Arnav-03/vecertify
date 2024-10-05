"use client"
import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import NavbarLogin from "./NavbarLogin";
import Footer from "./Footer";
import { useUser } from "@/hooks/useUser";

const Layout = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {user}=useUser();
  useEffect(() => { 
      if(user){
        setIsLoggedIn(true);
      }
  },[user]);

  return (
    <div
      className={cn(
        "w-screen flex  flex-col justify-between font-poppins",
        className
      )}
    >
      {isLoggedIn ? <NavbarLogin /> : <Navbar />}
      {children}
      <Footer />
    </div>
  );
};

export default Layout;