"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import { OFFER_ALERT_DONE_EVENT } from "@/app/_components/offer-alert";

const WHATSAPP_NUMBER = "971581649910";
const waLink = (msg: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
const BOOK_MSG = "Hi Nordic! I saw your NAD+, Glutathione & Vitamin C offer — I'd like to know more.";

const OFFER_HREF = "/iv-glutathione";
const OFFER_VIDEO = "/videos/iv-glutathione/clip-5.mp4";
const CLOSE_ANIM_MS = 300;
const SHOW_DELAY_MS = 600;

// Every page already listed under the header's "Exclusive Offers" dropdown
// — this alert skips all of them, not just its own page, so it only ever
// shows on an ordinary (non-offer) page.
const EXCLUSIVE_OFFER_PATHS = [
  "/back-to-school-sale",
  "/world-physiotherapy-day",
  "/world-first-aid-day",
  "/world-patient-safety-day",
  OFFER_HREF,
];

// A second, independent promo alert for the NAD+ / Glutathione / Vitamin C
// offer. Unlike OfferAlert, this one has no schedule — it's always "on".
// It waits for OfferAlert to finish its turn (shown-and-closed, or decided
// it had nothing to show) via OFFER_ALERT_DONE_EVENT, then shows itself the
// next time the visitor is on an ordinary page (not an Exclusive Offers
// page, and not an auth/admin route) — at most once per full page load.
export default function NadOfferAlert() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [otherAlertDone, setOtherAlertDone] = useState(false);
  const hasShownRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up") || pathname.startsWith("/forget-password");
  const isAdminRoute = pathname.startsWith("/admin");
  const isExclusiveOffersPage = EXCLUSIVE_OFFER_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    const handleDone = () => setOtherAlertDone(true);
    window.addEventListener(OFFER_ALERT_DONE_EVENT, handleDone);
    return () => window.removeEventListener(OFFER_ALERT_DONE_EVENT, handleDone);
  }, []);

  // Re-checked on every navigation: if the visitor was on an Exclusive
  // Offers page (or an auth/admin page) when it became their turn, it
  // simply waits until they land on an ordinary page, then shows there.
  useEffect(() => {
    if (hasShownRef.current || !otherAlertDone) return;
    if (isAuthRoute || isAdminRoute || isExclusiveOffersPage) return;

    hasShownRef.current = true;
    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname, otherAlertDone, isAuthRoute, isAdminRoute, isExclusiveOffersPage]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const close = () => {
    setVisible(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpen(false), CLOSE_ANIM_MS);
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-opacity duration-300 ease-out ${visible ? "opacity-100" : "opacity-0"
        }`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div
        className={`relative rounded-[28px] max-w-sm w-full overflow-hidden border border-white/15 shadow-2xl transition-all duration-300 ease-out ${visible ? "scale-100" : "scale-95"
          }`}
      >
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-110 blur-[1.5px]">
          <source src={OFFER_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a16]/75 via-[#0d1a16]/65 to-[#0d1a16]/88" />
        <div className="wpd-shine" />

        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative p-7 sm:p-9 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[10px] font-semibold uppercase tracking-[0.18em] px-4 py-2 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            NAD+ &middot; Glutathione &middot; Vitamin C
          </span>

          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full shadow-md mb-5">
            40% Off + Buy 2 Get 1 Free
          </span>

          <p className="text-white/75 text-sm leading-relaxed mb-7">
            Heal &amp; restore your body with natural care — boost your energy, immunity &amp; glow with our IV drip trio, delivered at home.
          </p>

          <div className="flex flex-col gap-2.5">
            <Link
              href={OFFER_HREF}
              onClick={close}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1a2e28] font-bold px-6 py-3 rounded-full text-sm shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              View Offer
            </Link>
            <a
              href={waLink(BOOK_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-6 py-3 rounded-full text-sm transition-all duration-300"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
