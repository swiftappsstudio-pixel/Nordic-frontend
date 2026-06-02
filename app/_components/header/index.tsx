"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/_common/auth-context";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#our-services", isAnchor: true },
  { label: "Offers", href: "/offers" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
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
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (href: string, isAnchor?: boolean) => {
    if (isAnchor && pathname === "/") {
      const el = document.querySelector(href.replace("/", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
      return;
    }
  };

  const isActive = (href: string, isAnchor?: boolean) => {
    if (isAnchor) return pathname === "/";
    return pathname === href;
  };

  const getActiveLabel = () => {
    const found = NAV_ITEMS.find((n) => isActive(n.href, n.isAnchor));
    return found?.label ?? null;
  };

  const activeLabel = getActiveLabel();

  return (
    <nav
      onMouseEnter={() => setHoverExpand(true)}
      onMouseLeave={() => setHoverExpand(false)}
      className={`fixed z-50 bg-white/70 backdrop-blur-xl border border-white/20 shadow-sm transition-all duration-500 ease-in-out ${
        expanded
          ? "top-4 left-4 right-4 rounded-[20px] py-3"
          : "top-4 left-1/2 -translate-x-1/2 w-auto max-w-md rounded-[16px] py-2.5"
      }`}
    >
      <div className={`flex items-center justify-between px-5 lg:px-8 transition-all duration-500 ${expanded ? "max-w-7xl mx-auto" : "gap-4"}`}>
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.jpeg"
            alt="Nordic Home Healthcare"
            width={60}
            height={18}
            priority
            unoptimized
            className="rounded-full transition-all duration-500"
          />
        </Link>

        <div className={`hidden lg:flex items-center gap-6 transition-all duration-500 ${expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none w-0 overflow-hidden"}`}>
          {NAV_ITEMS.map((item) =>
            item.isAnchor ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    handleAnchorClick(item.href, item.isAnchor);
                  }
                }}
                className={`whitespace-nowrap font-brand text-sm font-normal leading-5 px-4 py-1.5 rounded-full transition flex items-center gap-1.5 ${
                  isActive(item.href, item.isAnchor)
                    ? "bg-[#C9C3B3] text-[#543826]"
                    : "text-[#543826] hover:bg-[#C9C3B3]/40"
                }`}
              >
                {item.label}
                {item.label === "Services" && <span className="bg-red-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full leading-none">New</span>}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap font-brand text-sm font-normal leading-5 px-4 py-1.5 rounded-full transition ${
                  isActive(item.href)
                    ? "bg-[#C9C3B3] text-[#543826]"
                    : "text-[#543826] hover:bg-[#C9C3B3]/40"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className={`hidden lg:flex items-center gap-3 shrink-0 transition-all duration-500 ${expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none w-0 overflow-hidden"}`}>
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
                  <div className="absolute right-0 top-12 bg-white/80 backdrop-blur-xl shadow-lg rounded-xl w-48 py-2 border border-white/20">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/change-password" onClick={() => setUserMenu(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#C9C3B3]/30 transition-colors font-brand">Change Password</Link>
                    <button onClick={() => { logout(); setUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-brand">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/sign-in" className="whitespace-nowrap font-brand text-sm font-normal leading-5 px-4 py-1.5 rounded-full text-[#543826] hover:bg-[#C9C3B3]/40 transition">
                  Sign In
                </Link>
                <Link href="/sign-up" className="whitespace-nowrap font-brand text-sm font-normal leading-5 px-4 py-1.5 rounded-full bg-[#543826] text-white hover:bg-[#3e2a1c] transition">
                  Sign Up
                </Link>
              </>
            ))}
        </div>

        {!expanded && activeLabel && (
          <Link
            href="/#our-services"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                const el = document.querySelector("#our-services");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="whitespace-nowrap font-brand text-sm font-normal leading-5 px-4 py-1.5 rounded-full bg-[#C9C3B3] text-[#543826] transition"
          >
            {activeLabel}
          </Link>
        )}

        <button className="flex lg:hidden text-[#543826] text-2xl p-1 ml-auto" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white/80 backdrop-blur-xl py-4 px-6">
          <ul className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={(e) => {
                    if (item.isAnchor && pathname === "/") {
                      e.preventDefault();
                      handleAnchorClick(item.href, item.isAnchor);
                    } else {
                      setOpen(false);
                    }
                  }}
                  className={`whitespace-nowrap font-brand text-sm font-normal leading-5 px-4 py-1.5 rounded-full transition flex items-center gap-1.5 ${
                    isActive(item.href, item.isAnchor)
                      ? "bg-[#C9C3B3] text-[#543826]"
                      : "text-[#543826] hover:bg-[#C9C3B3]/40"
                  }`}
                >
                  {item.label}
                  {item.label === "Services" && <span className="bg-red-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full leading-none">New</span>}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-white/20">
            {!isLoading && (
              user ? (
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm font-brand">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button onClick={() => { logout(); setOpen(false); }} className="text-red-600 text-sm font-medium font-brand">Sign Out</button>
                  </div>
                  <Link href="/change-password" onClick={() => setOpen(false)} className="block mt-3 text-sm text-[#543826] font-brand font-medium hover:underline">Change Password</Link>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link href="/sign-in" onClick={() => setOpen(false)} className="flex-1 text-center whitespace-nowrap font-brand text-sm font-normal leading-5 px-4 py-1.5 rounded-full border border-[#543826] text-[#543826]">Sign In</Link>
                  <Link href="/sign-up" onClick={() => setOpen(false)} className="flex-1 text-center whitespace-nowrap font-brand text-sm font-normal leading-5 px-4 py-1.5 rounded-full bg-[#543826] text-white">Sign Up</Link>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}