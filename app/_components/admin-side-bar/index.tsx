"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { RiDashboardFill } from "react-icons/ri";
import { TbUsersGroup } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { BsBox } from "react-icons/bs";
import { MdImage, MdVideoLibrary } from "react-icons/md";

export const AdminSideBar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#5b3c2a] shadow-lg  md:block h-screen flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="shrink-0 my-5 px-5 py-10 flex items-center justify-center border-divider border-b">
        <Image
          src="/images/zush-logo.svg"
          alt="Zush Logo"
          className="h-12 w-1/2 "
          height={12}
          width={20}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-5 overflow-y-auto">
        <Link
          href="/admin"
          className={`flex items-center  px-4 py-3 rounded-lg transition-colors ${
            pathname === "/admin"
              ? "bg-orange-500 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          <RiDashboardFill className="h-7 w-7 mr-2  " />

          {/* <Image
            src="/svgs/dashboard.svg"
            alt="Dashboard Icon"
            className="h-7 w-7 mr-2  "
            height={48}
            width={48}
          /> */}
          <div className="">Dashboard</div>
        </Link>
        <Link
          href="/admin/users"
          className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
            pathname === "/admin/users"
              ? "bg-orange-500 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
       <FiUsers className="h-7 w-7 mr-2  " />

          Users
        </Link>
        <Link
          href="/admin/orders"
          className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
            pathname === "/admin/orders"
              ? "bg-orange-500 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          <BsBox className="h-7 w-7 mr-2  " />
          {/* <Image
            src="/svgs/orders.svg"
            alt="order icon"
            className="h-7 w-7 mr-2  "
            height={48}
            width={48}
          /> */}
          Orders
        </Link>
        
        <Link
          href="/admin/categories"
          className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
            pathname === "/admin/categories"
              ? "bg-orange-500 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          <BiCategoryAlt className="h-7 w-7 mr-2  " />

          {/* <Image
            src="/svgs/services.svg"
            alt="categories icon"
            className="h-7 w-7 mr-2  "
            height={48}
            width={48}
          /> */}
          Categories
        </Link>
        <Link
          href="/admin/services"
          className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
            pathname === "/admin/services"
              ? "bg-orange-500 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          {/* <Image
            src="/svgs/services.svg"
            alt="services icon"
            className="h-7 w-7 mr-2  "
            height={48}
            width={48}
          /> */}
          <MdOutlineMiscellaneousServices className="h-7 w-7 mr-2  " />

          Services
        </Link>
        <Link
          href="/admin/banner"
          className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
            pathname === "/admin/banner"
              ? "bg-orange-500 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          <MdImage className="h-7 w-7 mr-2  " />
          Banners
        </Link>
        <Link
          href="/admin/videos"
          className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
            pathname === "/admin/videos"
              ? "bg-orange-500 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          <MdVideoLibrary className="h-7 w-7 mr-2  " />
          Videos
        </Link>
      
      </nav>
    </div>
  );
};
  export default AdminSideBar;