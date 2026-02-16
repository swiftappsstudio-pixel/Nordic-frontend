"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
// import { useAuth } from "../../_common/useAuth";
import { LogOut, User } from "lucide-react";

export  const AdminNavBar = () => {
  const pathname = usePathname();
  // const { user, adminLogout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const getPageTitle = () => {
    switch (pathname) {
      case "/admin":
        return "Dashboard";
      case "/admin/users":
        return "Users";
      case "/admin/orders":
        return "Orders";
      case "/admin/vendors":
        return "Vendors";
      case "/admin/services":
        return "Services";
      default:
        return "Dashboard";
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("handleLogout called");
    setShowProfileMenu(false);
    // adminLogout();
    // Reload the page after logout
    window.location.reload();
  };

  const handleProfileClick = () => {
    console.log("Profile clicked, current state:", showProfileMenu);
    setShowProfileMenu(!showProfileMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showProfileMenu && !target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <div className="bg-white rounded-xl shadow-sm px-5 py-2 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
      <div className="flex flex-row space-x-2">
        <div className="flex flex-col">
          {/* <span className="text-gray-800 text-base">{user?.name || "Admin"}</span> */}
          <span className="text-gray-500 text-sm">(Admin)</span>
        </div>
        <div className="relative profile-menu-container">
          <button 
            className="group relative" 
            onClick={handleProfileClick}
            title="Profile Menu"
          >
            <Image
              src={
                "/public/next.svg"
              }
              alt="Admin Profile"
              height={40}
              width={40}
              className="rounded-full cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-200 hover:border-orange-400"
            />
          </button>
          
          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg z-50 min-w-48">
              <div className="py-2">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  {/* <div className="font-medium text-gray-900">{user?.name || "Admin"}</div> */}
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 export default AdminNavBar;