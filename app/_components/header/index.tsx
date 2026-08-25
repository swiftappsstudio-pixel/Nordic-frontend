"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAuth } from "@/app/_common/auth-context";

type NavItem = {
  label: string;
  href: string;
  dropdown?: { label: string; href: string; badge?: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Exclusive Offers",
    href: "/back-to-school-sale",
    dropdown: [
      { label: "Back to School Sale", href: "/back-to-school-sale", badge: "40% OFF" },
      { label: "Emirati Women's Day", href: "/emirati-womens-day", badge: "40% OFF" },
      { label: "IV Glutathione", href: "/iv-glutathione" },
    ],
  },
  { label: "Mother & Baby", href: "/mother-and-baby" },
  { label: "Elderly Care", href: "/elderly-care" },
  { label: "Blood Test", href: "/blood-test" },
  { label: "Peptides", href: "/peptides" },
  { label: "IV Therapy", href: "/iv-therapy" },
  { label: "Weight Loss", href: "/weight-loss" },
  { label: "Physiotherapy", href: "/physiotherapy" },
  {
    label: "Our Team",
    href: "/our-team",
    dropdown: [
      { label: "Our Management", href: "/our-management" },
      { label: "Our Physiotherapist", href: "/our-physiotherapist" },
      { label: "Our Nurses", href: "/our-nurses" },
      { label: "Join Our Team", href: "/join-our-team" },
    ],
  },
];

const SCROLL_THRESHOLD = 80;

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
};

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoverExpand, setHoverExpand] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const { user, logout, isLoading } = useAuth();
  const navRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const [canScrollNavRight, setCanScrollNavRight] = useState(false);
  const [canScrollNavLeft, setCanScrollNavLeft] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dropdownPanelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const expanded = !scrolled || hoverExpand;

  const cancelScheduledClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openDropdownAt = (label: string, triggerEl: HTMLButtonElement | null) => {
    cancelScheduledClose();
    if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, left: rect.left });
    }
    setOpenDropdown(label);
  };

  const scheduleCloseDropdown = () => {
    cancelScheduledClose();
    closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const toggleDropdown = (label: string, triggerEl: HTMLButtonElement | null) => {
    if (openDropdown === label) {
      setOpenDropdown(null);
      return;
    }
    openDropdownAt(label, triggerEl);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenu(false);
      if (openDropdown) {
        const target = e.target as Node;
        if (open) {
          // Mobile menu: the dropdown is rendered inline inside <nav>, not via
          // the desktop trigger/portal refs below. Only treat a tap outside the
          // whole nav as "outside" so taps on submenu links reach their own
          // onClick (which closes the menu and navigates) instead of being
          // pre-empted here.
          if (navRef.current && !navRef.current.contains(target)) setOpenDropdown(null);
          return;
        }
        const trigger = dropdownTriggerRefs.current[openDropdown];
        const panel = dropdownPanelRefs.current[openDropdown];
        const insideTrigger = trigger && trigger.contains(target);
        const insidePanel = panel && panel.contains(target);
        if (!insideTrigger && !insidePanel) setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown, open]);

  useEffect(() => {
    if (!expanded) setOpenDropdown(null);
  }, [expanded]);

  useEffect(() => () => cancelScheduledClose(), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setOpenDropdown(null); }, [pathname]);

  useEffect(() => {
    const el = navLinksRef.current;
    if (!el) return;
    const updateScrollState = () => {
      setCanScrollNavRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
      setCanScrollNavLeft(el.scrollLeft > 4);
    };
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollNavRight = () => {
    navLinksRef.current?.scrollBy({ left: 220, behavior: "smooth" });
  };

  const scrollNavLeft = () => {
    navLinksRef.current?.scrollBy({ left: -220, behavior: "smooth" });
  };

  const handleAnchorClick = (e: React.MouseEvent, href: string, isAnchor?: boolean) => {
    setOpen(false);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  const isDropdownActive = (item: NavItem) => {
    if (isActive(item.href)) return true;
    return item.dropdown?.some((sub) => isActive(sub.href)) ?? false;
  };

  return (
    <nav
      ref={navRef}
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
        <Link href="/" className="shrink-0 mr-3 lg:mr-4">
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
          className={`hidden lg:flex relative min-w-0 transition-all duration-500 ${expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none w-0 overflow-hidden"
            }`}
        >
          <div
            ref={navLinksRef}
            style={{ scrollbarWidth: "none" }}
            className={`flex items-center gap-1 py-1.5 [&::-webkit-scrollbar]:hidden ${expanded ? "overflow-x-auto" : "overflow-hidden"}`}
          >
          {NAV_ITEMS.map((item) =>
            item.dropdown ? (
              <div
                key={item.label}
                className="relative shrink-0"
                onMouseEnter={(e) => openDropdownAt(item.label, dropdownTriggerRefs.current[item.label] ?? (e.currentTarget.querySelector("button") as HTMLButtonElement | null))}
                onMouseLeave={scheduleCloseDropdown}
              >
                <button
                  ref={(el) => { dropdownTriggerRefs.current[item.label] = el; }}
                  onClick={(e) => toggleDropdown(item.label, e.currentTarget)}
                  data-glass-open={openDropdown === item.label}
                  className={`nav-glass-tab shrink-0 whitespace-nowrap text-sm font-medium px-3.5 py-1.5 rounded-full flex items-center gap-1.5 ${openDropdown === item.label || isDropdownActive(item)
                      ? "bg-[#C9C3B3]/60 text-[#543826] font-semibold"
                      : "text-[#543826]/80 hover:text-[#543826]"
                    }`}
                >
                  {item.label}
                  {item.label === "Exclusive Offers" && (
                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      SALE
                    </span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`} />
                </button>
                {openDropdown === item.label && dropdownPos &&
                  createPortal(
                    <div
                      ref={(el) => { dropdownPanelRefs.current[item.label] = el; }}
                      onMouseEnter={cancelScheduledClose}
                      onMouseLeave={scheduleCloseDropdown}
                      style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left }}
                      className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl w-56 py-2 border border-white/50 z-[100]"
                    >
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setOpenDropdown(null)}
                          className="dropdown-glass-item mx-2 flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm text-gray-700 hover:text-[#543826]"
                        >
                          <span>{sub.label}</span>
                          {sub.badge && (
                            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none shrink-0">
                              {sub.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>,
                    document.body
                  )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className={`nav-glass-tab shrink-0 whitespace-nowrap text-sm font-medium px-3.5 py-1.5 rounded-full flex items-center gap-1.5 ${isActive(item.href)
                    ? "bg-[#C9C3B3]/60 text-[#543826] font-semibold"
                    : "text-[#543826]/80 hover:text-[#543826]"
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
            )
          )}
          </div>

          {expanded && canScrollNavLeft && (
            <button
              onClick={scrollNavLeft}
              aria-label="Show previous tabs"
              className="absolute left-0 top-0 bottom-0 flex items-center pr-8 pl-0.5 bg-gradient-to-r from-white via-white/95 to-transparent pointer-events-auto"
            >
              <span className="w-6 h-6 rounded-full bg-white shadow-md border border-[#C9C3B3]/50 flex items-center justify-center text-[#543826]">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </span>
            </button>
          )}

          {expanded && canScrollNavRight && (
            <button
              onClick={scrollNavRight}
              aria-label="Show more tabs"
              className="absolute right-0 top-0 bottom-0 flex items-center pl-8 pr-0.5 bg-gradient-to-l from-white via-white/95 to-transparent pointer-events-auto"
            >
              <span className="w-6 h-6 rounded-full bg-white shadow-md border border-[#C9C3B3]/50 flex items-center justify-center text-[#543826]">
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          )}
        </div>

        {/* Desktop auth */}
        <div
          className={`hidden lg:flex items-center gap-2 shrink-0 ml-4 transition-all duration-500 ${expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none w-0 overflow-hidden"
            }`}
        >
          {!isLoading &&
            (user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 bg-[#543826] text-white pl-2 pr-4 py-1.5 rounded-full hover:bg-[#3e2a1c] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{getInitials(user.name)}</span>
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
                     
                    <Link href="/manage-address" onClick={() => setUserMenu(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Manage Address
                    </Link>
                    <button onClick={() => { logout(); setUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/sign-in" className="whitespace-nowrap text-sm font-semibold bg-[#543826] text-white px-4 py-1.5 rounded-full hover:bg-[#3e2a1c] transition shadow-sm">
                Sign In
              </Link>
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
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${openDropdown === item.label
                          ? "bg-[#C9C3B3]/50 text-[#543826] font-semibold"
                          : "text-[#543826]/80 hover:bg-[#C9C3B3]/20"
                        }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {item.label}
                        {item.label === "Exclusive Offers" && (
                          <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                            SALE
                          </span>
                        )}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="flex flex-col gap-1 mt-1 pl-4">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => { setOpen(false); setOpenDropdown(null); }}
                            className="flex items-center justify-between gap-2 px-4 py-2 rounded-xl text-sm text-[#543826]/70 hover:bg-[#C9C3B3]/20 transition-all"
                          >
                            <span>{sub.label}</span>
                            {sub.badge && (
                              <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none shrink-0">
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
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
                )}
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
                  <Link href="/manage-address" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 rounded-xl hover:bg-gray-50 transition">
                    Manage Address
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
