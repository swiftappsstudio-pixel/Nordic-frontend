"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#f7f7f7] shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">

        {/* Logo */}
        <Link href="/">
          <Image
            src="/public/images/logo.png"       // Replace with your logo
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

        {/* Social Icons */}
        <div className="hidden lg:flex items-center gap-4">
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
