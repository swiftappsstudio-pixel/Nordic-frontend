"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "@/app/_common/auth-context";
import { getCategories } from "@/app/_common/api";
import { Category } from "@/app/_common/interfaces";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user, logout, isLoading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      {/* ── Row 1: Logo | Search | Auth ── */}
      <div className="max-w-7xl mx-auto flex items-center gap-4 py-2.5 px-5 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image
            src="https://nordichc.com/wp-content/uploads/2025/04/Horizental-Original-Logo-resized.png"
            alt="Nordic Home Healthcare"
            width={180}
            height={54}
            priority
            unoptimized
          />
        </Link>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 items-center max-w-xl mx-4">
          <div className="relative w-full flex items-center">
            <FaSearch className="absolute left-3 text-gray-400 text-base pointer-events-none" />
            <input
              type="text"
              placeholder="Search services, treatments..."
              className="w-full pl-10 pr-20 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#543826]/20 focus:border-[#543826] focus:bg-white transition-all"
            />
            <button
              type="button"
              className="absolute right-1.5 bg-[#543826] text-white px-4 py-1 rounded-full text-xs font-semibold hover:bg-[#3e2a1c] transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Auth */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {!isLoading &&
            (user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 bg-[#543826] text-white px-4 py-2 rounded-full hover:bg-[#3e2a1c] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[110px] truncate">{user.name}</span>
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-48 py-2 border">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/change-password" onClick={() => setUserMenu(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Change Password</Link>
                    <button onClick={() => { logout(); setUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/sign-in" className="text-[#543826] font-semibold text-xs uppercase tracking-wide hover:underline">Sign In</Link>
                <Link href="/sign-up" className="bg-[#543826] text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wide hover:bg-[#3e2a1c] transition-colors">Sign Up</Link>
              </>
            ))}
        </div>

        {/* Mobile Search + Hamburger */}
        <div className="flex lg:hidden items-center gap-2 ml-auto">
          <button className="text-[#543826] text-lg p-1" onClick={() => setSearchOpen(!searchOpen)} aria-label="Toggle search"><FaSearch /></button>
          <button className="text-[#543826] text-3xl p-1" onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="lg:hidden px-5 pb-3 bg-white border-b border-gray-100">
          <div className="relative flex items-center">
            <FaSearch className="absolute left-3 text-gray-400 text-sm pointer-events-none" />
            <input type="text" placeholder="Search services, treatments..." className="w-full pl-9 pr-3 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#543826]/20 focus:border-[#543826] focus:bg-white" />
          </div>
        </div>
      )}

      {/* ── Row 2: Slim nav bar ── */}
      <div className="border-t border-gray-100 bg-white lg:block hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-10 px-6 py-2.5">
          <Link href="/" className="text-[#543826] text-sm font-semibold hover:text-orange-600 transition-colors relative group">Home<span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" /></Link>
          <div className="relative cursor-pointer" onMouseEnter={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
            <div className="flex items-center gap-1 text-[#543826] text-sm font-semibold hover:text-orange-600 transition-colors">
              Services<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </div>
            {dropdown && (
              <div className="absolute left-0 top-6 bg-white shadow-lg rounded-md w-56 py-3 z-50 border">
                {categories.length > 0 ? (
                  categories.map((c) => (<Link key={c._id} href={`/services/category/${c._id}`} className="block px-4 py-2 hover:bg-gray-100 text-[#543826] text-sm">{c.name}</Link>))
                ) : (<span className="block px-4 py-2 text-gray-400 text-sm">No categories</span>)}
              </div>
            )}
          </div>
          <Link href="/offers" className="text-[#543826] text-sm font-semibold hover:text-orange-600 transition-colors relative group">Offers<span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" /></Link>
          <Link href="/about" className="text-[#543826] text-sm font-semibold hover:text-orange-600 transition-colors relative group">About Us<span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" /></Link>
          <Link href="/contact" className="text-[#543826] text-sm font-semibold hover:text-orange-600 transition-colors relative group">Contact<span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" /></Link>
          <Link href="/blog" className="text-[#543826] text-sm font-semibold hover:text-orange-600 transition-colors relative group">Blog<span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" /></Link>
        </div>
      </div>

      {/* ── Mobile Dropdown ── */}
      {open && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6 text-[#543826]">
          <ul className="flex flex-col gap-4 text-base font-semibold">
            <li><Link href="/" onClick={() => setOpen(false)}>Home</Link></li>
            <li>
              <details className="cursor-pointer">
                <summary className="flex items-center justify-between py-1">Services</summary>
                <div className="flex flex-col ml-4 mt-2 gap-2">
                  {categories.length > 0 ? (
                    categories.map((cat) => (<Link key={cat._id} href={`/services/category/${cat._id}`} onClick={() => setOpen(false)} className="text-sm text-gray-600">{cat.name}</Link>))
                  ) : (<span className="text-gray-400 text-sm">No categories</span>)}
                </div>
              </details>
            </li>
            <li><Link href="/offers" onClick={() => setOpen(false)}>Offers</Link></li>
            <li><Link href="/about" onClick={() => setOpen(false)}>About Us</Link></li>
            <li><Link href="/contact" onClick={() => setOpen(false)}>Contact</Link></li>
            <li><Link href="/blog" onClick={() => setOpen(false)}>Blog</Link></li>
          </ul>
          <div className="mt-4 pt-4 border-t">
            {!isLoading && (
              user ? (
                <div>
                  <div className="flex items-center justify-between">
                    <div><p className="font-semibold text-sm">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div>
                    <button onClick={() => { logout(); setOpen(false); }} className="text-red-600 text-sm font-medium">Sign Out</button>
                  </div>
                  <Link href="/change-password" onClick={() => setOpen(false)} className="block mt-3 text-sm text-[#543826] font-medium hover:underline">Change Password</Link>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link href="/sign-in" onClick={() => setOpen(false)} className="flex-1 text-center border border-[#543826] text-[#543826] py-2 rounded-lg text-sm font-medium">Sign In</Link>
                  <Link href="/sign-up" onClick={() => setOpen(false)} className="flex-1 text-center bg-[#543826] text-white py-2 rounded-lg text-sm font-medium">Sign Up</Link>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
