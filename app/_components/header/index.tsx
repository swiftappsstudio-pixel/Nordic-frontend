"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useAuth } from "@/app/_common/auth-context";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#f7f7f7] shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">

        {/* Logo */}
        <Link href="/">
          <Image
            src="/public/images/logo.png"
            alt="logo"
            width={220}
            height={80}
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-10 font-semibold text-[#543826] text-lg">

          <li>
            <Link href="/">Home</Link>
          </li>

          {/* Services dropdown */}
          <li
            className="relative cursor-pointer"
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            <div className="flex items-center gap-1">
              Services
              <span className="text-xl">▾</span>
            </div>

            {dropdown && (
              <div className="absolute left-0 top-8 bg-white shadow-lg rounded-md w-48 py-3">
                <Link href="/services/service1" className="block px-4 py-2 hover:bg-gray-100 text-[#543826]">
                  Service 1
                </Link>
                <Link href="/services/service2" className="block px-4 py-2 hover:bg-gray-100 text-[#543826]">
                  Service 2
                </Link>
                <Link href="/services/service3" className="block px-4 py-2 hover:bg-gray-100 text-[#543826]">
                  Service 3
                </Link>
              </div>
            )}
          </li>

          <li><Link href="/offers">Offers</Link></li>
          <li><Link href="/about-us">About Us</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/blog">Blog</Link></li>
        </ul>

        {/* Right side: Auth buttons or User menu + Social icons */}
        <div className="hidden lg:flex items-center gap-4">
          {!isLoading && (
            user ? (
              /* Logged-in user dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 bg-[#543826] text-white px-4 py-2 rounded-full hover:bg-[#3e2a1c] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {userMenu && (
                  <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-48 py-2 border">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest: Sign In / Sign Up buttons */
              <div className="flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="text-[#543826] font-semibold text-sm hover:underline"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-[#543826] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#3e2a1c] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )
          )}

          <div className="w-10 h-10 rounded-full bg-[#543826] flex items-center justify-center">
            <FaFacebookF className="text-white text-lg" />
          </div>

          <div className="w-10 h-10 rounded-full bg-[#543826] flex items-center justify-center">
            <FaInstagram className="text-white text-lg" />
          </div>

          <div className="w-10 h-10 rounded-full bg-[#543826] flex items-center justify-center">
            <FaLinkedinIn className="text-white text-lg" />
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="lg:hidden text-3xl text-[#543826]"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6 text-[#543826]">
          <ul className="flex flex-col gap-4 text-lg font-semibold">

            <li><Link href="/" onClick={() => setOpen(false)}>Home</Link></li>

            <li>
              <details className="cursor-pointer">
                <summary className="flex items-center justify-between">
                  Services
                </summary>
                <div className="flex flex-col ml-4 mt-2 gap-2">
                  <Link href="/services/service1">Service 1</Link>
                  <Link href="/services/service2">Service 2</Link>
                  <Link href="/services/service3">Service 3</Link>
                </div>
              </details>
            </li>

            <li><Link href="/offers" onClick={() => setOpen(false)}>Offers</Link></li>
            <li><Link href="/about" onClick={() => setOpen(false)}>About us</Link></li>
            <li><Link href="/contact" onClick={() => setOpen(false)}>Contact</Link></li>
            <li><Link href="/blog" onClick={() => setOpen(false)}>Blog</Link></li>
          </ul>

          {/* Mobile Auth */}
          <div className="mt-4 pt-4 border-t">
            {!isLoading && (
              user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="text-red-600 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center border border-[#543826] text-[#543826] py-2 rounded-lg text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center bg-[#543826] text-white py-2 rounded-lg text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Social Icons */}
          <div className="flex gap-4 mt-5">
            <div className="w-10 h-10 rounded-full bg-[#543826] flex items-center justify-center">
              <FaFacebookF className="text-white text-lg" />
            </div>
            <div className="w-10 h-10 rounded-full bg-[#543826] flex items-center justify-center">
              <FaInstagram className="text-white text-lg" />
            </div>
            <div className="w-10 h-10 rounded-full bg-[#543826] flex items-center justify-center">
              <FaLinkedinIn className="text-white text-lg" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
