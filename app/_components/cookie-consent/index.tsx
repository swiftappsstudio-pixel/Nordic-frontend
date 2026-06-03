"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "nordic_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pb-0">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={decline} />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-t-2xl max-w-xl w-full mx-4 p-6 shadow-lg border border-white/20 mb-0">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#C9C3B3]/40 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#543826]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-brand text-base font-semibold text-[#543826] mb-2">
              Cookie Privacy Preference
            </h3>
            <p className="font-brand text-sm font-normal leading-5 text-gray-600">
              This website stores cookies on your computer. These cookies are used to improve your website experience and provide more personalized services to you, both on this website and through other media. To find out more about the cookies we use, see our{" "}
              <Link href="/privacy-policy" className="text-[#543826] underline hover:no-underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p className="font-brand text-sm font-normal leading-5 text-gray-600 mt-3">
              We won't track your information when you visit our site. But in order to comply with your preferences, we'll have to use just one tiny cookie so that you're not asked to make this choice again.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={decline}
            className="whitespace-nowrap font-brand text-sm font-normal leading-5 px-6 py-2 rounded-full border border-[#543826] text-[#543826] hover:bg-[#C9C3B3]/30 transition"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="whitespace-nowrap font-brand text-sm font-normal leading-5 px-6 py-2 rounded-full bg-[#543826] text-white hover:bg-[#3e2a1c] transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}