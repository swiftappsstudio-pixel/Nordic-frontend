"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Check, HeartHandshake, MapPin, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import {
  getEligibleFridayServices,
  getNextFridayBoundary,
  isFridayCampaignLive,
  markFridayOfferSeen,
  shouldShowFridayOffer,
  type FridayOfferService,
} from "@/app/_data/friday-offer";

const SHOW_DELAY_MS = 800;
const CLOSE_ANIM_MS = 300;
// While nothing is selected, the media panel rotates through the services.
const ROTATE_MS = 7000;
// Backup re-check in case a timer is throttled (sleeping laptop, background tab).
const RECHECK_MS = 30_000;
// setTimeout overflows above ~24.8 days; the backup interval covers longer waits.
const MAX_TIMEOUT_MS = 2_147_483_647;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Homepage-only "Nordic Friday Offer" popup. Shows once per page load (every
// hard reload or new visit), lists only services that are live right now, and hides itself for
// good at the campaign cutoff (see app/_data/friday-offer.ts).
export default function FridayOfferPopup() {
  const pathname = usePathname();
  const router = useRouter();
  const titleId = useId();
  const descId = useId();
  const radioName = useId();

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [offers, setOffers] = useState<FridayOfferService[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [rotateIndex, setRotateIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const openRef = useRef(false);

  // ── Open: homepage only, once per session, campaign still live ──────────
  useEffect(() => {
    if (openRef.current || !shouldShowFridayOffer(pathname, Date.now())) return;
    const timer = setTimeout(() => {
      const now = Date.now();
      // Re-check the cutoff at the moment of showing.
      if (!shouldShowFridayOffer(pathname, now)) return;
      markFridayOfferSeen();
      openRef.current = true;
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      setOffers(getEligibleFridayServices(now));
      setSelectedId(null);
      setOpen(true);
    }, SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const close = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setVisible(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpen(false), CLOSE_ANIM_MS);
    const back = returnFocusRef.current;
    if (back && document.contains(back)) back.focus({ preventScroll: true });
  }, []);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  // Homepage-only: the backdrop blocks in-page links, so the only way to
  // leave while open is browser Back/Forward — close when that happens.
  useEffect(() => {
    if (!open) return;
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, [open, close]);

  // Drop expired offers, clear a selection that's gone, close when nothing's left.
  const refresh = useCallback((): FridayOfferService[] => {
    const now = Date.now();
    const live = getEligibleFridayServices(now);
    if (!isFridayCampaignLive(now) || live.length === 0) {
      close();
      return [];
    }
    setOffers((prev) =>
      prev.length === live.length && prev.every((o, i) => o.id === live[i].id) ? prev : live
    );
    setSelectedId((id) => (id && live.some((o) => o.id === id) ? id : null));
    return live;
  }, [close]);

  // ── While open: exact timer to the next expiry/cutoff, backup interval,
  //    and a re-check whenever the tab becomes active again. ───────────────
  useEffect(() => {
    if (!open) return;
    const delay = Math.max(0, getNextFridayBoundary(Date.now()) - Date.now());
    const boundaryTimer = delay <= MAX_TIMEOUT_MS ? setTimeout(refresh, delay + 50) : null;
    const interval = setInterval(refresh, RECHECK_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      if (boundaryTimer) clearTimeout(boundaryTimer);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [open, offers, refresh]);

  // ── While open: lock page scroll, initial focus, Escape + focus trap ─────
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      // Native radios: only the checked one (or the first, if none) is tabbable.
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) =>
          !(el instanceof HTMLInputElement && el.type === "radio") ||
          el.checked ||
          !dialogRef.current!.querySelector(`input[name="${el.getAttribute("name")}"]:checked`)
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  // Rotate the featured service until the visitor picks one.
  useEffect(() => {
    if (!open || selectedId || reduceMotion || offers.length < 2) return;
    const id = setInterval(() => setRotateIndex((i) => i + 1), ROTATE_MS);
    return () => clearInterval(id);
  }, [open, selectedId, reduceMotion, offers.length]);

  const viewOffer = () => {
    if (!selectedId) return;
    // Confirm the offer is still live before leaving.
    const live = refresh();
    const offer = live.find((o) => o.id === selectedId);
    if (!offer) return;
    close();
    router.push(offer.href);
  };

  if (!open) return null;

  const featured =
    offers.find((o) => o.id === selectedId) ??
    offers.find((o) => o.id === hoveredId) ??
    offers[rotateIndex % Math.max(offers.length, 1)];
  const rise = (i: number) => ({ animationDelay: `${120 + i * 90}ms` });

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-end sm:items-center justify-center sm:p-6 transition-opacity duration-500 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop: blurred, darkened video of the featured service (like the service heroes) */}
      <div className="absolute inset-0 overflow-hidden bg-[#0d1a16]" onClick={close} aria-hidden="true">
        {featured && (
          <video
            key={`bg-${featured.id}`}
            className="hidden sm:block absolute inset-0 w-full h-full object-cover blur-[3px] opacity-60 fo-kenburns"
            src={featured.video}
            poster={featured.poster}
            autoPlay={!reduceMotion}
            muted
            loop
            playsInline
            preload="auto"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a16]/85 via-[#1a2e28]/60 to-[#543826]/70" />
      </div>

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className={`relative w-full sm:max-w-[560px] lg:max-w-none lg:w-[min(1060px,94vw)] max-h-[92dvh] sm:max-h-[min(860px,calc(100dvh-3rem))] lg:h-[min(660px,calc(100dvh-3rem))] flex flex-col lg:flex-row bg-white rounded-t-[28px] sm:rounded-[32px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/20 overflow-hidden outline-none transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 sm:translate-y-6 sm:scale-[0.94]"
        }`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close Nordic Friday Offer"
          className="absolute top-3 right-3 short:top-1.5 short:right-1.5 z-30 w-11 h-11 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:rotate-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* ── Media panel: phone-style video with text + alert on it ── */}
        <div className="relative shrink-0 h-40 compact:h-28 sm:h-60 lg:h-auto lg:w-[400px] short:hidden bg-[#1a2e28] lg:p-4 lg:bg-gradient-to-b lg:from-[#1a2e28] lg:to-[#2b211a]">
          <div className="relative w-full h-full overflow-hidden lg:rounded-[26px] lg:ring-2 lg:ring-white/80 lg:shadow-2xl">
            {offers.map((o) => (
              <video
                key={o.id}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  featured?.id === o.id ? "opacity-100" : "opacity-0"
                }`}
                src={o.video}
                poster={o.poster}
                autoPlay={!reduceMotion}
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />

            {/* glass pill: logo + featured service */}
            <div className="absolute top-3 left-3 right-16 lg:right-3 flex compact:hidden lg:compact:flex items-center gap-2.5 rounded-2xl bg-white/80 backdrop-blur-md px-2.5 py-2 shadow-lg fo-rise" style={rise(1)}>
              <Image src="/images/logo.jpeg" alt="Nordic Home Healthcare" width={36} height={36} className="rounded-full ring-1 ring-black/10" />
              <span key={`pill-${featured?.id}`} className="flex-1 text-right pr-1 text-[#543826] text-sm font-semibold truncate fo-rise">
                {featured?.name}
              </span>
            </div>

            {/* text + alert on the video */}
            <div className="absolute inset-x-0 bottom-0 p-4 compact:p-3 compact:pr-16 lg:p-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 px-3 py-1.5 text-white text-[11px] font-semibold uppercase tracking-[0.14em] mb-2.5 compact:mb-1.5 fo-float">
                <span className="w-2 h-2 rounded-full bg-red-500 fo-blink" aria-hidden="true" />
                Nordic Friday &middot; Ends 29 Nov
              </div>
              <p key={`word2-${featured?.id}`} className="text-white font-bold leading-none drop-shadow-lg fo-word text-4xl compact:text-3xl lg:text-6xl">
                {featured?.word}
              </p>
              <p key={`tag-${featured?.id}`} className="hidden sm:block compact:hidden text-white/85 text-sm mt-2 max-w-[300px] fo-rise" style={rise(1)}>
                {featured?.tagline}
              </p>
              {!selectedId && !reduceMotion && offers.length > 1 && (
                <div className="hidden lg:flex gap-1.5 mt-4" aria-hidden="true">
                  {offers.map((o) => (
                    <span key={o.id} className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden">
                      {featured?.id === o.id && !hoveredId && (
                        <span key={rotateIndex} className="block h-full bg-white fo-progress" style={{ animationDuration: `${ROTATE_MS}ms` }} />
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Content panel ── */}
        <div className="relative flex-1 min-h-0 flex flex-col bg-gradient-to-b from-white to-[#F7F4EE]">
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#D4A373]/20 blur-3xl" aria-hidden="true" />

          {/* Header */}
          <div className="relative shrink-0 px-5 sm:px-8 lg:px-10 pt-4 sm:pt-7 lg:pt-10 pb-2 sm:pb-4 short:pt-3 short:pb-2 short:pr-16">
            <div className="flex items-center gap-3 mb-2 sm:mb-3 short:mb-1.5 fo-rise" style={rise(0)}>
              {/* Animated flash icon */}
              <span className="relative inline-flex w-9 h-9 sm:w-11 sm:h-11 short:w-8 short:h-8 shrink-0 items-center justify-center" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-amber-400/50 fo-ring" />
                <span className="absolute inset-0 rounded-full bg-amber-400/40 fo-ring" style={{ animationDelay: "1.3s" }} />
                <span className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600 shadow-[0_6px_18px_-4px_rgba(245,158,11,0.8)] flex items-center justify-center">
                  <Zap className="w-5 h-5 short:w-4 short:h-4 text-white fill-white fo-flash" strokeWidth={2.2} />
                </span>
                <Sparkles className="absolute -top-1.5 -right-2 w-3.5 h-3.5 text-amber-400 fo-twinkle" />
                <Sparkles className="absolute -bottom-1 -left-2 w-3 h-3 text-[#D4A373] fo-twinkle" style={{ animationDelay: "1.1s" }} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#543826]">Nordic Friday</span>
            </div>
            <h2
              id={titleId}
              className="fo-gradient-text text-[26px] sm:text-4xl lg:text-[44px] short:text-xl font-extrabold leading-[1.05] tracking-tight mb-2 short:mb-1 fo-rise"
              style={rise(1)}
            >
              Nordic Friday Offer
            </h2>
            <p
              id={descId}
              className="text-[#6B7280] text-[13px] sm:text-[15px] lg:text-base short:text-xs leading-relaxed max-w-[460px] fo-rise"
              style={rise(2)}
            >
              Explore special offers on selected Nordic Home Healthcare services through 29 November.
            </p>
          </div>

          {/* Service list — scrolls on small screens */}
          <div
            role="radiogroup"
            aria-label="Choose a service"
            className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-8 lg:px-10 py-2 sm:py-3 short:py-1.5"
          >
            <ul className="space-y-2.5 sm:space-y-3 short:space-y-2">
              {offers.map((offer, i) => {
                const selected = offer.id === selectedId;
                return (
                  <li key={offer.id} className="fo-rise" style={rise(3 + i)}>
                    <label
                      onMouseEnter={() => setHoveredId(offer.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`group relative flex items-center gap-3.5 sm:gap-4 rounded-2xl border-2 px-3 sm:px-4 py-3 sm:py-3.5 short:py-2 min-h-[56px] cursor-pointer transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#543826]/40 has-[:focus-visible]:ring-offset-2 ${
                        selected
                          ? "border-[#543826] bg-gradient-to-r from-[#fbf6ef] to-white shadow-[0_12px_30px_-14px_rgba(84,56,38,0.55)] -translate-y-0.5"
                          : "border-[#543826]/10 bg-white hover:border-[#543826]/35 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-16px_rgba(84,56,38,0.45)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name={radioName}
                        value={offer.id}
                        checked={selected}
                        onChange={() => setSelectedId(offer.id)}
                        className="sr-only"
                      />
                      <span className="relative shrink-0 w-12 h-12 sm:w-16 sm:h-16 short:w-10 short:h-10 rounded-xl overflow-hidden ring-1 ring-black/5" aria-hidden="true">
                        <Image src={offer.poster} alt="" fill sizes="64px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-[#1a2e28] text-base sm:text-lg short:text-[15px] leading-snug">{offer.name}</span>
                        <span className="block text-[#6B7280] text-xs sm:text-sm short:text-xs leading-relaxed mt-0.5">{offer.description}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                          selected ? "bg-[#543826] border-[#543826] text-white" : "border-[#543826]/25 text-transparent group-hover:border-[#543826]/50"
                        }`}
                      >
                        {selected && <Check key="on" className="w-4 h-4 fo-pop" strokeWidth={3} />}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>

            {/* Trust row — fills the desktop panel */}
            <ul className="hidden lg:grid grid-cols-3 gap-2.5 mt-5 fo-rise" style={rise(6)} aria-label="Why Nordic">
              {[
                { Icon: ShieldCheck, text: "DHA-licensed nurses" },
                { Icon: HeartHandshake, text: "Nordic-employed caregivers" },
                { Icon: MapPin, text: "All Dubai, at your doorstep" },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-2 rounded-xl bg-white/70 border border-[#543826]/10 px-3 py-2.5 text-[12px] font-medium text-[#543826]">
                  <Icon className="w-4 h-4 shrink-0 text-[#2D5B4F]" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer — always visible */}
          <div
            className="relative shrink-0 px-5 sm:px-8 lg:px-10 pt-3 short:pt-2 bg-gradient-to-t from-[#F7F4EE] via-[#F7F4EE] to-transparent"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <button
              type="button"
              onClick={viewOffer}
              disabled={!selectedId}
              className={`group relative w-full overflow-hidden inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#543826] via-[#6b4730] to-[#543826] text-white font-semibold px-6 py-4 short:py-3 min-h-[44px] rounded-full text-base short:text-sm transition-all duration-300 disabled:from-[#543826]/35 disabled:via-[#543826]/35 disabled:to-[#543826]/35 disabled:cursor-not-allowed enabled:hover:scale-[1.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#543826]/50 focus-visible:ring-offset-2 ${
                selectedId ? "fo-glow" : ""
              }`}
            >
              {selectedId && (
                <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent fo-shine" aria-hidden="true" />
              )}
              <span className="relative">View Offers</span>
              <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-enabled:group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <p className="text-center text-xs text-[#6B7280] mt-2 h-4 short:hidden" aria-live="polite">
              {selectedId ? `Opens ${offers.find((o) => o.id === selectedId)?.name ?? ""}` : "Select a service to continue"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
