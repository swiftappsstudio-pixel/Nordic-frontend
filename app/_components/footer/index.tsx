"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp } from "react-icons/fa";

const FOOTER_SERVICES = [
  { label: "Mother & Baby", href: "/mother-and-baby" },
  { label: "Elderly Care", href: "/elderly-care" },
  { label: "Blood Test", href: "/blood-test" },
  { label: "Peptides", href: "/peptides" },
  { label: "IV Therapy", href: "/iv-therapy" },
  { label: "Weight Loss", href: "/weight-loss" },
  { label: "Physiotherapy", href: "/physiotherapy" },
];

export default function Footer() {
  return (
    <footer className="bg-[#543826] text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 mb-10">
          <div className="flex flex-col items-center md:items-start">
            <Image
              src="/images/logo.jpeg"
              width={90}
              height={38}
              alt="Nordic"
              unoptimized
              className="mb-4 rounded-full"
            />
            <p className="font-brand text-sm text-white/50 max-w-xs text-center md:text-left">
              UAE&apos;s fastest growing home healthcare platform
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-x-10 gap-y-4">
            <div>
              <h4 className="font-brand font-semibold text-sm mb-3 text-white/80">Services</h4>
              <ul className="space-y-2 text-sm text-white/50">
                {FOOTER_SERVICES.map((s) => (
                  <li key={s.label}>
                    <Link href={s.href} className="hover:text-white transition flex items-center gap-1.5">
                      {s.label}
                      
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-brand font-semibold text-sm mb-3 text-white/80">Contact Us</h4>
            <div className="space-y-2 text-sm text-white/50">
              <a href="https://wa.me/971581649910" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition">
                <FaWhatsapp className="text-base" />
                +971 55 582 8945
              </a>
              <a href="https://wa.me/971581649910" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition">
                <FaWhatsapp className="text-base" />
                +971 58 164 9910
              </a>
            </div>

            <div className="flex gap-3 mt-5">
              <a href="https://www.facebook.com/nordichomehealthcare" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-[#3e2a1c] rounded-full flex items-center justify-center transition">
                <FaFacebookF className="text-sm text-white" />
              </a>
              <a href="https://www.linkedin.com/company/nordic-home-healthcare-center/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-[#3e2a1c] rounded-full flex items-center justify-center transition">
                <FaLinkedinIn className="text-sm text-white" />
              </a>
              <a href="https://www.instagram.com/nordichomehealthcare?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-[#3e2a1c] rounded-full flex items-center justify-center transition">
                <FaInstagram className="text-sm text-white" />
              </a>
              <a href="https://www.tiktok.com/@nordic_home_healthcare?_r=1&_t=ZS-97Kz7TLpPgi" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-[#3e2a1c] rounded-full flex items-center justify-center transition">
                <FaTiktok className="text-sm text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-2 pt-6 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Nordic Home Health Care Center &ndash; All Rights Reserved</p>
          <p><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link> &middot; DHA Licence No. : 3171506</p>
        </div>
      </div>
    </footer>
  );
}