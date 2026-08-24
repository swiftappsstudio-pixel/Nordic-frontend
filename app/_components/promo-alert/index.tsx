"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const WHATSAPP_NUMBER = "971581649910";

const buildWhatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const PROMOS = [
  {
    src: "/images/promos/emirati-womens-day.jpg",
    alt: "Emirati Women's Day — Nordic Home Healthcare",
    width: 1080,
    height: 1080,
    whatsappUrl: buildWhatsappUrl(
      "Hi Nordic! I saw your Emirati Women's Day post — I'd like to know more about your home healthcare services."
    ),
  },
  {
    src: "/images/promos/child-checkup.jpg",
    alt: "It's time for your child's next routine checkup — Nordic Home Healthcare",
    width: 1024,
    height: 1024,
    whatsappUrl: buildWhatsappUrl(
      "Hi Nordic! I'd like to book my child's back-to-school routine checkup and vaccines."
    ),
  },
  {
    src: "/images/promos/back-to-school.png",
    alt: "Back-to-school vaccines, up to 40% off — Nordic Home Healthcare",
    width: 1080,
    height: 1097,
    whatsappUrl: buildWhatsappUrl(
      "Hi Nordic! I'd like to book the back-to-school vaccines offer (up to 40% off)."
    ),
  },
];

const CLOSE_ANIM_MS = 300;

export default function PromoAlert() {
  const pathname = usePathname();
  const [index, setIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const shownCountRef = useRef(0);
  const lastPathRef = useRef<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up") || pathname.startsWith("/forget-password");
  const isAdminRoute = pathname.startsWith("/admin");
  const skip = isAuthRoute || isAdminRoute;

  useEffect(() => {
    // shownCountRef lives only in memory, so a hard refresh (or a new tab)
    // remounts this component and naturally restarts the sequence at photo 1.
    // Each distinct page visited during the same load shows the next photo,
    // up to all three — then no more alerts until the site is reloaded.
    if (skip) return;
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    if (shownCountRef.current >= PROMOS.length) return;
    const photoIndex = shownCountRef.current;
    shownCountRef.current += 1;

    const timer = setTimeout(() => setIndex(photoIndex), 500);
    return () => clearTimeout(timer);
  }, [pathname, skip]);

  useEffect(() => {
    if (index === null) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [index]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const close = () => {
    setVisible(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setIndex(null), CLOSE_ANIM_MS);
  };

  if (skip || index === null) return null;

  const promo = PROMOS[index];

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 ease-out ${
          visible ? "scale-100" : "scale-95"
        }`}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-[#543826] transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative overflow-y-auto">
          <Image
            src={promo.src}
            alt={promo.alt}
            width={promo.width}
            height={promo.height}
            unoptimized
            className="block w-full h-auto"
          />

          <PromoCta key={index} whatsappUrl={promo.whatsappUrl} onNavigate={close} />
        </div>
      </div>
    </div>
  );
}

function PromoCta({ whatsappUrl, onNavigate }: { whatsappUrl: string; onNavigate: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`absolute inset-x-0 bottom-0 px-4 pb-4 pt-14 bg-gradient-to-t from-black/80 via-black/45 to-transparent transition-all duration-700 ease-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-white/15 backdrop-blur-lg border border-white/25 rounded-2xl px-4 py-4 shadow-xl flex flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-1.5 text-white text-xs sm:text-sm font-semibold tracking-wide drop-shadow">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-red-400 opacity-75 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-red-500" />
          </span>
          Limited Slots Available
        </span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener"
          onClick={onNavigate}
          className="promo-cta-glow inline-flex items-center gap-2 bg-[#543826] text-white text-sm font-bold px-7 py-3 rounded-full hover:bg-[#3e2a1c] active:scale-95 transition-all duration-200"
        >
          Book Now
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
