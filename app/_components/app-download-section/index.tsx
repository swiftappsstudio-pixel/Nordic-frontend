"use client";

import Image from "next/image";

export default function AppDownloadSection() {
  return (
    <section className="py-20 bg[#FFFFFF] text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <div className="mb-6 flex items-center gap-6">
            <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center overflow-hidden border-2 border-[#543826]">
              <Image
                src="/images/footer-download-qr.webp"
                alt="QR Code"
                width={112}
                height={112}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          </div>

          <h2 className="font-brand text-[#543826] text-3xl md:text-4xl font-semibold leading-tight mb-3">
            Get the free Nordic App
          </h2>
          <p className="font-brand text-lg text-[#543826] mb-8">
            UAE&apos;s fastest growing health and wellness App
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-3 bg-[#543826] text-white font-brand font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:bg-[#C9C3B3] hover:text-[#543826] hover:gap-5"
          >
            Download the app
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="relative">
            <Image
              src="/images/footer-phone.webp"
              alt="Nordic App"
              width={320}
              height={580}
              className="w-auto h-auto max-h-[520px] drop-shadow-2xl"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}