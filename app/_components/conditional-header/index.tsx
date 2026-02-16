"use client";
import { usePathname } from "next/navigation";
import Navbar from "../header";

export const ConditionalNavBar = () => {
  const pathname = usePathname();
  
  // Don't show navbar on auth routes
  const isAuthRoute = pathname.startsWith("/sign-in") || 
                     pathname.startsWith("/sign-up") || 
                     pathname.startsWith("/forget-password");
  
  // Don't show navbar on admin routes (they have their own layout)
  const isAdminRoute = pathname.startsWith("/admin");
  
  // Only show navbar if not on auth or admin routes
  if (isAuthRoute || isAdminRoute) {
    return null;
  }
  
  return <Navbar />;
};
