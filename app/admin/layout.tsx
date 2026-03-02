"use client";

import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AdminSideBar from "../_components/admin-side-bar";
import AdminNavBar from "../_components/admin-nav-bar";
import { useAuth } from "../_common/auth-context";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!token || user?.role !== "admin")) {
      router.replace("/sign-in");
    }
  }, [isLoading, token, user, router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="border-4 border-[#543826] border-t-transparent rounded-full w-8 h-8 animate-spin" />
      </div>
    );
  }

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
