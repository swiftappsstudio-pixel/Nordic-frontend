"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, X } from "lucide-react";
import { getActiveOffer, type ExclusiveOffer } from "@/app/_data/exclusive-offers";

const WHATSAPP_NUMBER = "971581649910";
const waLink = (msg: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const CLOSE_ANIM_MS = 300;
const SHOW_DELAY_MS = 800;

// Fired once this alert has either finished being shown (closed) or has
// decided it has nothing to show this page load — lets other, unrelated
// promo components (e.g. the NAD+ alert) wait their turn without this
// component needing to know they exist.
export const OFFER_ALERT_DONE_EVENT = "nordic:offer-alert-done";
const announceDone = () => window.dispatchEvent(new Event(OFFER_ALERT_DONE_EVENT));

// Site-wide promo alert. Reads the same EXCLUSIVE_OFFERS schedule as the
// header dropdown, so whichever campaign is currently active there is the
// one shown here too — no separate logic to keep in sync. Shows at most
// once per full page load (a hard refresh resets it); dismissing it, or
// simply navigating around the site, won't bring it back until reloaded.
export default function OfferAlert() {
  const pathname = usePathname();
  const [offer, setOffer] = useState<ExclusiveOffer | null>(null);
  const [visible, setVisible] = useState(false);
  const hasShownRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up") || pathname.startsWith("/forget-password");
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (hasShownRef.current || isAuthRoute || isAdminRoute) {
      announceDone();
      return;
    }

    const active = getActiveOffer(Date.now());
    if (!active || pathname.startsWith(active.href)) {
      announceDone(); // nothing to show — let other promos take their turn
      return;
    }

    hasShownRef.current = true;
    const timer = setTimeout(() => setOffer(active), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
    // Only ever fires once per page load, regardless of later navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (offer === null) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [offer]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const close = () => {
    setVisible(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOffer(null), CLOSE_ANIM_MS);
    announceDone();
  };

  if (!offer) return null;

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
          <source src={offer.alertVideo} type="video/mp4" />
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
            <Calendar className="w-3.5 h-3.5 text-[#D4A373]" />
            {offer.alertTitle} &middot; {offer.alertDate}
          </span>

          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full shadow-md mb-5">
            {offer.alertBadge}
          </span>

          <p className="text-white/75 text-sm leading-relaxed mb-7">{offer.alertDescription}</p>

          <div className="flex flex-col gap-2.5">
            <Link
              href={offer.href}
              onClick={close}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1a2e28] font-bold px-6 py-3 rounded-full text-sm shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              View Offer
            </Link>
            <a
              href={waLink(`Hi Nordic! I saw your ${offer.alertTitle} offer — I'd like to know more.`)}
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
