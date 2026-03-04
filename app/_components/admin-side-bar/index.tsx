"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";

export const AdminSideBar = () => {
  const pathname = usePathname();

  const links = [
    {
      href: "/admin/categories",
      label: "Categories",
      icon: <BiCategoryAlt className="h-7 w-7 mr-2" />,
    },
    {
      href: "/admin/services",
      label: "Services",
      icon: <MdOutlineMiscellaneousServices className="h-7 w-7 mr-2" />,
    },
  ];

  return (
    <div className="w-64 bg-[#5b3c2a] shadow-lg md:block h-screen flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="shrink-0 my-5 px-5 py-10 flex items-center justify-center border-divider border-b">
        <Image
          src="https://nordichc.com/wp-content/uploads/2025/04/Horizental-Original-Logo-resized.png"
          alt="Nordic Home Healthcare Logo"
          className="h-12 w-auto"
          height={48}
          width={160}
          unoptimized
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-5 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              pathname === link.href || pathname.startsWith(link.href + "/")
                ? "bg-orange-500 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};
export default AdminSideBar;
