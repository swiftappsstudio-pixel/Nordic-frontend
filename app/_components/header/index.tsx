"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/_common/auth-context";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "IV Glutathione", href: "/iv-glutathione" },
  { label: "Mother & Baby", href: "/mother-and-baby" },
  { label: "Elderly Care", href: "/elderly-care" },
  { label: "Blood Test", href: "/blood-test" },
  { label: "Peptides", href: "/peptides" },
  { label: "IV Therapy", href: "/iv-therapy" },
  { label: "Weight Loss", href: "/weight-loss" },
  { label: "Physiotherapy", href: "/physiotherapy" },
];

const SCROLL_THRESHOLD = 80;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoverExpand, setHoverExpand] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const expanded = !scrolled || hoverExpand;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const handleAnchorClick = (e: React.MouseEvent, href: string, isAnchor?: boolean) => {
    setOpen(false);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <nav
      onMouseEnter={() => setHoverExpand(true)}
      onMouseLeave={() => setHoverExpand(false)}
      className={`fixed z-50 bg-white/75 backdrop-blur-xl border border-white/30 shadow-sm transition-all duration-500 ease-in-out ${expanded
          ? "top-3 left-3 right-3 rounded-[22px] py-2.5"
          : "top-3 left-1/2 -translate-x-1/2 w-auto max-w-xs rounded-2xl py-2"
        }`}
    >
      <div
        className={`flex items-center justify-between px-4 lg:px-6 transition-all duration-500 ${expanded ? "max-w-7xl mx-auto" : "gap-3"
          }`}
      >
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.jpeg"
            alt="Nordic Home Healthcare"
            width={52}
            height={52}
            priority
            unoptimized
            className="rounded-full"
          />
        </Link>

        {/* Desktop nav links */}
        <div
          className={`hidden lg:flex items-center gap-1 transition-all duration-500 ${expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none w-0 overflow-hidden"
            }`}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleAnchorClick(e, item.href)}
              className={`relative whitespace-nowrap text-sm font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${isActive(item.href)
                  ? "bg-[#C9C3B3]/60 text-[#543826] font-semibold"
                  : "text-[#543826]/80 hover:bg-[#C9C3B3]/30 hover:text-[#543826]"
                }`}
            >
              {item.label}
              {item.label === "Services" && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  New
                </span>
              )}
              {item.label === "IV Therapy" && (
                <span className="bg-[#543826] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  HOT
                </span>
              )}
              {item.label === "Peptides" && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  New
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div
          className={`hidden lg:flex items-center gap-2 shrink-0 transition-all duration-500 ${expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none w-0 overflow-hidden"
            }`}
        >
          {!isLoading &&
            (user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 bg-[#543826] text-white pl-2 pr-4 py-1.5 rounded-full hover:bg-[#3e2a1c] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-11 bg-white shadow-xl rounded-2xl w-48 py-2 border border-gray-100 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link href="/change-password" onClick={() => setUserMenu(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Change Password
                    </Link>
                    <button onClick={() => { logout(); setUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/sign-in" className="whitespace-nowrap text-sm font-medium text-[#543826]/80 hover:text-[#543826] px-4 py-1.5 rounded-full hover:bg-[#C9C3B3]/30 transition">
                  Sign In
                </Link>
                <Link href="/sign-up" className="whitespace-nowrap text-sm font-semibold bg-[#543826] text-white px-4 py-1.5 rounded-full hover:bg-[#3e2a1c] transition shadow-sm">
                  Sign Up
                </Link>
              </>
            ))}
        </div>

        {/* Collapsed state pill label */}
        {!expanded && (
          <span className="hidden lg:block whitespace-nowrap text-sm font-medium text-[#543826] px-3 py-1">
            {NAV_ITEMS.find((n) => isActive(n.href))?.label ?? "Menu"}
          </span>
        )}

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="flex lg:hidden flex-col justify-center items-center w-9 h-9 rounded-xl hover:bg-[#C9C3B3]/30 transition gap-1.5 ml-auto"
          aria-label="Toggle menu"
        >
          <span className={`block w-4.5 h-0.5 bg-[#543826] rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-[7px]" : ""}`} style={{ width: "18px" }} />
          <span className={`block h-0.5 bg-[#543826] rounded-full transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} style={{ width: "18px" }} />
          <span className={`block h-0.5 bg-[#543826] rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} style={{ width: "18px" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white/90 backdrop-blur-xl rounded-b-[18px] px-4 pt-2 pb-4 mt-1 border-t border-white/20">
          <ul className="flex flex-col gap-1 mb-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item.href)
                      ? "bg-[#C9C3B3]/50 text-[#543826] font-semibold"
                      : "text-[#543826]/80 hover:bg-[#C9C3B3]/20"
                    }`}
                >
                  <span>{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    {item.label === "Services" && (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">New</span>
                    )}
                    {item.label === "IV Therapy" && (
                      <span className="bg-[#543826] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">HOT</span>
                    )}
                    {item.label === "Peptides" && (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-100 pt-3">
            {!isLoading && (
              user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#543826] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/change-password" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 rounded-xl hover:bg-gray-50 transition">
                    Change Password
                  </Link>
                  <button onClick={() => { logout(); setOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 rounded-xl hover:bg-red-50 transition">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/sign-in" onClick={() => setOpen(false)} className="text-center text-sm font-medium text-[#543826] border border-[#543826]/30 py-2.5 rounded-full hover:bg-[#543826]/5 transition">
                    Sign In
                  </Link>
                  <Link href="/sign-up" onClick={() => setOpen(false)} className="text-center text-sm font-semibold bg-[#543826] text-white py-2.5 rounded-full hover:bg-[#3e2a1c] transition">
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
