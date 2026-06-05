"use client";

import Image from "next/image";

export default function AppDownloadSection() {
  return (
    <section className="py-20 bg[#FFFFFF] text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-[#543826]" />
            <span className="text-[#543826] text-xs font-semibold uppercase tracking-[0.2em]">Download App</span>
          </div>

          <h2 className="text-[#543826] text-3xl md:text-4xl font-bold leading-tight mb-3">
            Get the free Nordic App
          </h2>
          <p className="text-[#543826]/60 text-base md:text-lg mb-6 leading-relaxed max-w-md">
            UAE&apos;s fastest growing health and wellness App. Book home healthcare services, track your appointments, and manage your wellness — all from your phone.
          </p>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex flex-col items-center">
              <p className="text-[#543826] font-bold text-2xl leading-none">4.9</p>
              <p className="text-[#543826]/50 text-xs mt-1">App Rating</p>
            </div>
            <div className="h-8 w-px bg-[#543826]/20" />
            <div className="flex flex-col items-center">
              <p className="text-[#543826] font-bold text-2xl leading-none">3K+</p>
              <p className="text-[#543826]/50 text-xs mt-1">Downloads</p>
            </div>
            <div className="h-8 w-px bg-[#543826]/20" />
            <div className="flex flex-col items-center">
              <p className="text-[#543826] font-bold text-2xl leading-none">DHA</p>
              <p className="text-[#543826]/50 text-xs mt-1">Licensed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.46-2.48 4.18-2.51 1.34-.03 2.61.9 3.29.9.68 0 2.09-1.1 3.44-.95.59.03 2.2.24 3.24 1.8-2.85 1.77-2.41 6.33.4 7.96-.6 1.2-1.36 2.37-2.04 2.91zM12.17 5.28c-.63-1.01-.21-2.41.34-3.12 1.1.07 2.04.72 2.54 1.56.56 1 .12 2.32-.42 3.02-.88-.01-1.96-.65-2.46-1.46z"/>
              </svg>
              App Store
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.89l2.302 2.302-11.847 5.86 9.545-8.162zm3.072-2.2l2.802 1.39c.51.25.51.98 0 1.23l-2.802 1.39-2.472-2.472 2.472-2.472zM5.158 2.744l11.847 5.86-2.302 2.302-9.545-8.162z"/>
              </svg>
              Google Play
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="relative">
            <Image
              src="/images/our-mobile-app1.png"
              alt="Nordic App"
              width={320}
              height={580}
              className="w-auto h-auto max-h-[520px] drop-shadow-2xl border-4 border-[#543826] rounded-3xl"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}