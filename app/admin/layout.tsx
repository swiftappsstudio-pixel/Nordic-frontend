"use client";

import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AdminSideBar from "../_components/admin-side-bar";
import AdminNavBar from "../_components/admin-nav-bar";
import { useAuth } from "../_common/auth-context";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoading) return;

    // If on login page and already authenticated as admin, go to dashboard
    if (isLoginPage && token && user?.role === "admin") {
      router.replace("/admin");
      return;
    }

    // If on any other admin page and NOT authenticated, go to admin login
    if (!isLoginPage && (!token || user?.role !== "admin")) {
      router.replace("/admin/login");
    }
  }, [isLoading, token, user, router, isLoginPage, pathname]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="border-4 border-[#543826] border-t-transparent rounded-full w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Login page renders without sidebar/navbar
  if (isLoginPage) {
    return (
      <>
        <Toaster position="top-right" />
        {children}
      </>
    );
  }

  // Not authenticated — show nothing while redirect happens
  if (!token || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Toaster position="top-right" />
      <div className="shrink-0">
        <AdminSideBar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-0 p-5 pb-0">
          <AdminNavBar />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 bg-gray rounded-tl-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
