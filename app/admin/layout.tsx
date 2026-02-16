
import React from "react";
import { Toaster } from "react-hot-toast";
import AdminSideBar from "../_components/admin-side-bar";
import AdminNavBar from "../_components/admin-nav-bar";
// import { useAuth } from "../_common/useAuth";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { isAuthenticated, user } = useAuth();

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Toaster position="top-right" />
      {/* Sidebar - Only show if admin is logged in */}
      {/* {isAuthenticated && user?.role == 3 && ( */}
        <div className="shrink-0">
          <AdminSideBar />
        </div>
      {/* ) */}
      {/* } */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar - Only show if admin is logged in */}
?          <div className="flex-0 p-5 pb-0">
            <AdminNavBar />
          </div>
?        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 bg-gray rounded-tl-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
