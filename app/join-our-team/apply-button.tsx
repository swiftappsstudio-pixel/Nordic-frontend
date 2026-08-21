"use client";

import { useState } from "react";

const CONTACT_EMAIL = "hr@nordichc.ae";
const CONTACT_WHATSAPP = "+971569147945";

export default function ApplyButton({ jobTitle }: { jobTitle: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Apply for ${jobTitle}`}
        className="whitespace-nowrap text-sm font-semibold bg-[#543826] text-white px-5 py-2.5 rounded-full hover:bg-[#3e2a1c] transition shrink-0 self-start sm:self-center"
      >
        Apply for this Position
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#C9C3B3]/40">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 shrink-0 rounded-full bg-[#C9C3B3]/40 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#543826]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-brand text-base font-semibold text-[#543826] mb-1">Apply for {jobTitle}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Email your CV and cover letter, or reach us on WhatsApp — we&apos;ll get back to you shortly.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mb-5">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Job Application: ${jobTitle}`)}`}
                className="flex items-center gap-3 rounded-xl border border-[#C9C3B3]/50 px-4 py-3 hover:bg-[#F7EEE0] transition"
              >
                <svg className="w-4.5 h-4.5 text-[#543826] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-semibold text-[#543826]">{CONTACT_EMAIL}</span>
              </a>
              <a
                href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 rounded-xl border border-[#C9C3B3]/50 px-4 py-3 hover:bg-[#F7EEE0] transition"
              >
                <svg className="w-4.5 h-4.5 text-[#543826] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5C10.1 9 9.5 7.6 9.3 7c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3z" />
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.8 3.3 1.3 5.2 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.7 0-3.3-.5-4.7-1.3l-.3-.2-3.1 1 1-3-.2-.3C3.9 15 3.3 13.5 3.3 12c0-4.8 3.9-8.7 8.7-8.7s8.7 3.9 8.7 8.7-3.9 8.7-8.7 8.7z" />
                </svg>
                <span className="text-sm font-semibold text-[#543826]">{CONTACT_WHATSAPP}</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full text-sm font-semibold px-6 py-2.5 rounded-full border border-[#543826] text-[#543826] hover:bg-[#C9C3B3]/30 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
