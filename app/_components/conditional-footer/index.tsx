"use client";

import { usePathname } from "next/navigation";
import Footer from "../footer";

export const ConditionalFooter = () => {
  const pathname = usePathname();
  
  // Don't show footer on auth routes
  const isAuthRoute = pathname.startsWith("/sign-in") || 
                     pathname.startsWith("/sign-up") || 
                     pathname.startsWith("/forget-password");
  
  // Don't show footer on admin routes (they have their own layout)
  const isAdminRoute = pathname.startsWith("/admin");

  // Only show footer if not on auth or admin routes
  if (isAuthRoute || isAdminRoute) {
    return null;
  }
  
  return <Footer />;
};

