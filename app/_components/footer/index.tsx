"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { getServices } from "@/app/_common/api";
import { Service } from "@/app/_common/interfaces";

export default function Footer() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices()
      .then((data) => setServices(data.slice(0, 6)))
      .catch(() => setServices([]));
  }, []);

  return (
    <footer className="bg-[#543826] text-white pt-12 pb-6">
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
                {services.map((s) => (
                  <li key={s._id}>
                    <Link href={`/services/${s._id}`} className="hover:text-white transition">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-brand font-semibold text-sm mb-3 text-white/80">Company</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blogs</Link></li>
                <li><Link href="/offers" className="hover:text-white transition">Offers</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-brand font-semibold text-sm mb-3 text-white/80">Contact Us</h4>
            <div className="space-y-2 text-sm text-white/50">
              <a href="https://wa.me/971555828945" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition">
                <FaWhatsapp className="text-base" />
                +971 55 582 8945
              </a>
              <a href="https://wa.me/971581649910" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition">
                <FaWhatsapp className="text-base" />
                +971 58 164 9910
              </a>
            </div>

            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white rounded-full flex items-center justify-center transition">
                <FaFacebookF className="text-sm text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white rounded-full flex items-center justify-center transition">
                <FaLinkedinIn className="text-sm text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white rounded-full flex items-center justify-center transition">
                <FaInstagram className="text-sm text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-2 pt-6 text-xs text-white/40">
          <p>&copy; 2025 Nordic Home Health Care Center &ndash; All Rights Reserved</p>
          <p>DHA License No.: 3171506</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition">Terms &amp; Conditions</Link>
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}