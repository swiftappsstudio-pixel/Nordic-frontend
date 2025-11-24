"use client";

import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-[#5b3c2a] text-white pt-16 pb-6 relative">

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">

        {/* Column 1 – Services */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-[#e6d9d0]">
            <li>Nursing</li>
            <li>Physiotherapy</li>
            <li>Laboratory Test</li>
            <li>IV Therapy</li>
            <li>Doctor On Call</li>
            <li>Create Your Own Test</li>
          </ul>
        </div>

        {/* Column 2 – Contact Us */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <div className="space-y-3 text-[#e6d9d0]">
            <div className="flex items-center gap-3">
              <FaWhatsapp className="text-lg" />
              <span>+971 58 164 9910</span>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="text-lg" />
              <span>+971 58 624 1964</span>
            </div>
          </div>
        </div>

        {/* Column 3 – Logo and Location */}
        <div className="text-center md:text-right">
          <Image
            src="/logo.webp"   // replace with your actual logo
            width={180}
            height={80}
            alt="Footer Logo"
            className="mx-auto md:ml-auto"
          />

          <p className="text-lg font-semibold mt-2">
            Located in: Dubai Real Estate Center
          </p>

          <button className="mt-4 px-6 py-2 bg-[#d6c5b8] text-[#5b3c2a] rounded-full font-semibold">
            Get Directions!
          </button>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end mt-5 gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <FaFacebookF className="text-[#5b3c2a] text-xl" />
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <FaLinkedinIn className="text-[#5b3c2a] text-xl" />
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <FaInstagram className="text-[#5b3c2a] text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#ab9a90] my-6"></div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-[#e6d9d0] text-sm">

        <p>© 2025 Nordic Home Health Care Center – All Rights Reserved<br />
          DHA License No. : 3171506
        </p>

        <p className="mt-3 md:mt-0">
          Terms & Conditions | Privacy Policy
        </p>
      </div>

      {/* Floating Left Logo Bubble */}
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
        <Image
          src="https://nordichc.com/wp-content/uploads/2025/04/Horizental-Original-Logo-resized.png"  // replace with correct small footer logo
          alt="Logo Bubble"
          width={40}
          height={40}
        />
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/971581649910"
        target="_blank"
        className="absolute bottom-4 right-4 w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700"
      >
        <FaWhatsapp className="text-white text-4xl" />
      </a>

    </footer>
  );
}
