"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Activity,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  ClipboardCheck,
  ClipboardList,
  HandHeart,
  Heart,
  HeartHandshake,
  Home as HomeIcon,
  Lock,
  Milk,
  Pill,
  ShieldCheck,
  Sparkles,
  Thermometer,
  UserCheck,
  Users,
  Move,
  Baby,
  Droplet,
} from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────
const WA_NUM = "971581649910";
const BOOK_MSG = encodeURIComponent(
  "Hi Nordic! I'd like to book my World Patient Safety Day offer — 50% off Elderly/Baby Care or 40% off IV Therapy."
);
const GENERAL_MSG = encodeURIComponent(
  "Hi Nordic! I'd like to learn more about the World Patient Safety Day offer."
);
const NOTIFY_MSG = encodeURIComponent(
  "Hi Nordic! Please notify me when the World Patient Safety Day offer goes live."
);
const ELDERLY_MSG = encodeURIComponent(
  "Hi Nordic! I'd like to book Elderly Care — 50% off, World Patient Safety Day offer."
);
const BABY_MSG = encodeURIComponent(
  "Hi Nordic! I'd like to book Baby Care — 50% off, World Patient Safety Day offer."
);
const IV_MSG = encodeURIComponent(
  "Hi Nordic! I'd like to book IV Therapy — 40% off, World Patient Safety Day offer."
);
const waLink = (msg: string) => `https://wa.me/${WA_NUM}?text=${msg}`;

// The offer runs 13–18 September 2026, Dubai time (UTC+4).
const LAUNCH_DATE = new Date("2026-09-13T00:00:00+04:00");
const OFFER_END = new Date("2026-09-18T23:59:59+04:00");

// TEMPORARY — flip to true only for a quick look before launch; keep false
// so the real LAUNCH_DATE gate below stays in effect for real visitors.
const TESTING_FORCE_UNLOCK = false;

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511" />
  </svg>
);

function CheckIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Countdown ──────────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const [mounted, setMounted] = useState(false);
  const [msLeft, setMsLeft] = useState(0);

  useEffect(() => {
    setMounted(true);
    const tick = () => setMsLeft(Math.max(target.getTime() - Date.now(), 0));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return {
    mounted,
    days: Math.floor(msLeft / 86400000),
    hours: Math.floor((msLeft / 3600000) % 24),
    minutes: Math.floor((msLeft / 60000) % 60),
    seconds: Math.floor((msLeft / 1000) % 60),
    expired: mounted && msLeft <= 0,
  };
}

function CountdownTile({ value, label, dark }: { value: number; label: string; dark?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 rounded-2xl px-3.5 py-3 sm:px-4 sm:py-3.5 min-w-[62px] sm:min-w-[74px] ${dark ? "wpd-glass-dark" : "wpd-glass"}`}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`font-bold tabular-nums leading-none ${dark ? "text-white" : "text-[#1a2e28]"}`}
          style={{ fontSize: "clamp(18px, 3vw, 28px)" }}
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
      <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest ${dark ? "text-white/60" : "text-[#6B7280]"}`}>{label}</span>
    </div>
  );
}

function Countdown({ target, dark = false, className = "", expiredLabel = "This offer has ended." }: { target: Date; dark?: boolean; className?: string; expiredLabel?: string }) {
  const { mounted, days, hours, minutes, seconds, expired } = useCountdown(target);

  if (mounted && expired) {
    return <p className={`text-sm font-semibold ${dark ? "text-white" : "text-[#1a2e28]"}`}>{expiredLabel}</p>;
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <CountdownTile value={mounted ? days : 0} label="Days" dark={dark} />
      <CountdownTile value={mounted ? hours : 0} label="Hrs" dark={dark} />
      <CountdownTile value={mounted ? minutes : 0} label="Min" dark={dark} />
      <CountdownTile value={mounted ? seconds : 0} label="Sec" dark={dark} />
    </div>
  );
}

// ─── Launch gate ────────────────────────────────────────────────────────────
type Phase = "locked" | "active";

function usePhase(): Phase {
  const [phase, setPhase] = useState<Phase>("locked");
  useEffect(() => {
    const check = () => {
      // ?preview=1 lets the team view the live page before launch, for
      // testing, without touching the real LAUNCH_DATE gate below.
      const preview = new URLSearchParams(window.location.search).get("preview") === "1";
      setPhase(TESTING_FORCE_UNLOCK || preview || Date.now() >= LAUNCH_DATE.getTime() ? "active" : "locked");
    };
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);
  return phase;
}

function LaunchGate() {
  return (
    <div className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#0d1a16] px-6 py-16">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4A373]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2D5B4F]/25 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />

      <FadeIn className="relative max-w-[560px] w-full">
        <div className="wpd-glass-dark rounded-[32px] p-7 sm:p-12 text-center relative overflow-hidden">
          <div className="wpd-shine" />

          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 wpd-floating-slow">
            <Lock className="w-7 h-7 text-[#D4A373]" />
          </div>

          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-2 rounded-full mb-6">
            <Calendar className="w-3.5 h-3.5 text-[#D4A373]" /> World Patient Safety Day
          </span>

          <h1 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(24px, 4vw, 36px)" }}>
            This Offer Isn&rsquo;t Live Yet.
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full shadow-md">
              50% Off Elderly &amp; Baby Care
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full">
              40% Off IV Therapy
            </span>
          </div>

          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-9 max-w-sm mx-auto">
            Our World Patient Safety Day offer unlocks on <strong className="text-white">13 September 2026</strong> and runs through <strong className="text-white">18 September 2026</strong>. Check back soon.
          </p>

          <p className="text-white/50 text-[11px] font-semibold uppercase tracking-widest mb-3">Unlocks in</p>
          <div className="flex justify-center mb-9">
            <Countdown target={LAUNCH_DATE} dark expiredLabel="This offer is now live — refresh to view it." />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <a href={waLink(NOTIFY_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all shadow-lg">
              <WhatsAppIcon /> Notify Me When It&rsquo;s Live
            </a>
            <Link href="/" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-white/15 transition-all">
              Back To Home
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

// ─── Section data ───────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: "The Offer", href: "#offer" },
  { label: "Elderly Care", href: "#elderly-care" },
  { label: "Baby Care", href: "#baby-care" },
  { label: "Book Now", href: "#book" },
];

const PILLARS = [
  { title: "Right Care", desc: "Care tailored to the needs of each patient.", Icon: UserCheck },
  { title: "Safe Care", desc: "Professional healthcare support in a familiar home environment.", Icon: HomeIcon },
  { title: "Family Support", desc: "Keeping families informed and involved.", Icon: HeartHandshake },
  { title: "Continuous Attention", desc: "Recognizing changes and knowing when additional medical care may be required.", Icon: Clock },
];

const ELDERLY_SUPPORT = [
  { label: "Personal Care Assistance", Icon: HandHeart },
  { label: "Mobility Support", Icon: Move },
  { label: "Medication Support", Icon: Pill },
  { label: "Daily Care Assistance", Icon: ClipboardList },
  { label: "Health Monitoring", Icon: Activity },
  { label: "Companionship", Icon: Users },
  { label: "Post-Hospital Care", Icon: ShieldCheck },
];

const BABY_SUPPORT = [
  { label: "Newborn Care Support", Icon: Baby },
  { label: "Baby Hygiene & Routine Care", Icon: Droplet },
  { label: "Feeding Support", Icon: Milk },
  { label: "Basic Health Monitoring", Icon: Thermometer },
  { label: "Parent Support", Icon: HeartHandshake },
  { label: "Post-Discharge Support", Icon: ClipboardCheck },
];

function SupportList({ items }: { items: { label: string; Icon: typeof HandHeart }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
      {items.map(({ label, Icon }) => (
        <div key={label} className="flex items-center gap-2.5">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#543826]/10 text-[#543826] flex items-center justify-center">
            <Icon className="w-3.5 h-3.5" />
          </span>
          <span className="text-[#1a2e28] text-sm font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}

function CampaignPage() {
  return (
    <div className="bg-white min-h-screen font-sans">

      {/* 1. HERO */}
      <section className="relative min-h-[100svh] sm:min-h-[85vh] flex items-center overflow-hidden bg-[#0d1a16]">
        <video autoPlay muted loop playsInline poster="/images/nurse_with_elder.png" className="absolute inset-0 w-full h-full object-cover">
          <source src="/images/older1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a16]/88 via-[#0d1a16]/60 to-[#0d1a16]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a16]/75 via-[#0d1a16]/20 to-[#0d1a16]/60" />

        <div className="hidden lg:block absolute top-[20%] right-[9%] wpd-floating">
          <div className="wpd-glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
            <span className="text-white text-xs font-semibold whitespace-nowrap">Safe Care, At Home</span>
          </div>
        </div>
        <div className="hidden lg:block absolute bottom-[24%] left-[9%] wpd-floating-slow">
          <div className="wpd-glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#D4A373]" />
            <span className="text-white text-xs font-semibold whitespace-nowrap">Gentle, Compassionate Care</span>
          </div>
        </div>

        <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-8 w-full pt-32 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 flex justify-center">
            <span className="wpd-glass-dark inline-flex items-center gap-2 text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] px-4 sm:px-5 py-2.5 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-[#D4A373]" />
              World Patient Safety Day &middot; 7 September
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-bold text-white leading-[1.08] mb-5" style={{ fontSize: "clamp(28px, 4.8vw, 52px)" }}>
            Safe Care. Gentle Care. <span className="text-[#D4A373]">Right at Home.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/75 max-w-xl mx-auto mb-8 text-base sm:text-lg leading-relaxed">
            This World Patient Safety Day, Nordic Home Healthcare Center is making quality home care more accessible for the people who need it most.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap items-center justify-center gap-3 mb-9">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full shadow-md">
              50% Off Elderly &amp; Baby Care
            </span>
            <span className="wpd-glass-dark inline-flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full">
              40% Off IV Therapy
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-10 max-w-sm sm:max-w-none mx-auto">
            <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-7 sm:px-8 py-3.5 rounded-full text-sm transition-all shadow-lg hover:scale-[1.03]">
              Book Now
            </a>
            <a href={waLink(GENERAL_MSG)} target="_blank" rel="noopener noreferrer" className="wpd-glass-dark inline-flex items-center justify-center gap-2 text-white font-semibold px-7 sm:px-8 py-3.5 rounded-full text-sm transition-all hover:scale-[1.03]">
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              WhatsApp Us
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <p className="text-white/55 text-[11px] font-semibold uppercase tracking-widest mb-3">Offer ends in</p>
            <div className="flex justify-center"><Countdown target={OFFER_END} dark /></div>
          </motion.div>
        </div>
      </section>

      {/* Quick glass nav */}
      <div className="sticky top-24 z-30 flex justify-center px-4 py-4 bg-gradient-to-b from-[#F7F4EE] to-[#F7F4EE]/0">
        <nav className="wpd-pill-nav rounded-full px-1.5 py-1.5 flex items-center gap-1 overflow-x-auto scrollbar-hide max-w-full">
          {QUICK_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="whitespace-nowrap text-[#1a2e28] text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-full hover:bg-white/60 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      {/* 2. OFFER */}
      <section id="offer" className="relative pt-4 pb-14 sm:pb-24 px-6 lg:px-8 overflow-hidden bg-[#F7F4EE]">
        <div className="absolute -top-10 -left-24 w-96 h-96 bg-[#D4A373]/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#2D5B4F]/12 rounded-full blur-3xl" />
        <div className="relative max-w-[1000px] mx-auto">
          <FadeIn className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-[#543826]/8 border border-[#543826]/15 text-[#543826] text-[11px] font-semibold uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Special Limited-Time Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">
              Care For The People You Love Most
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <FadeIn>
              <div className="wpd-glass rounded-[28px] p-7 sm:p-9 text-center h-full relative overflow-hidden">
                <div className="wpd-shine" />
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md mb-5">
                  Most Popular
                </span>
                <p className="text-[#1a2e28] font-extrabold leading-none mb-2" style={{ fontSize: "clamp(40px, 6vw, 56px)" }}>50% OFF</p>
                <h3 className="font-bold text-[#1a2e28] text-lg mb-3">Elderly Care &amp; Baby Care</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">Because the people you love deserve professional, compassionate and safe care.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="wpd-glass rounded-[28px] p-7 sm:p-9 text-center h-full relative overflow-hidden">
                <div className="wpd-shine" />
                <span className="inline-flex items-center gap-1 bg-[#543826]/10 text-[#543826] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-5">
                  Wellness
                </span>
                <p className="text-[#1a2e28] font-extrabold leading-none mb-2" style={{ fontSize: "clamp(40px, 6vw, 56px)" }}>40% OFF</p>
                <h3 className="font-bold text-[#1a2e28] text-lg mb-3">IV Therapy</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">Professional IV therapy delivered conveniently at home.</p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.15}>
            <div className="wpd-glass rounded-[28px] p-7 sm:p-10 text-center">
              <div className="inline-flex items-center gap-2 mb-7 text-[#543826] text-sm font-semibold bg-[#543826]/8 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4" /> Offer valid 13&ndash;18 September 2026
              </div>
              <div className="flex justify-center mb-8"><Countdown target={OFFER_END} /></div>
              <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-9 py-4 rounded-full text-sm transition-all shadow-lg hover:scale-[1.03]">
                Book Now <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. CARE FOR THE ONES WHO NEED YOU MOST */}
      <section className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white to-[#F7F4EE]">
        <div className="absolute top-10 -right-20 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[900px] mx-auto text-center">
          <FadeIn>
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Family First</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-4">Care For The Ones Who Need You Most</h2>
            <p className="text-[#6B7280] text-base leading-relaxed max-w-2xl mx-auto">
              Some family members need a little more care, attention and support. Nordic brings professional healthcare support directly to your home, helping your loved ones stay comfortable in a familiar environment.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 3a. ELDERLY CARE */}
      <section id="elderly-care" className="py-14 sm:py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <FadeIn>
            <div className="wpd-glass rounded-[28px] p-2.5">
              <div className="relative rounded-[20px] overflow-hidden aspect-[4/3]">
                <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                  <source src="/images/older1.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Elderly Care</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-4">Compassionate Care for Your Loved Ones</h2>
            <p className="text-[#6B7280] text-base leading-relaxed mb-6">
              Give your parents and elderly family members the support they deserve without taking them out of the comfort of their home.
            </p>
            <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-4">Our Elderly Care Support</p>
            <SupportList items={ELDERLY_SUPPORT} />
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-full shadow-md">
                50% Off Elderly Care
              </span>
              <a href={waLink(ELDERLY_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-md hover:scale-[1.03]">
                Book Elderly Care <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3b. BABY CARE */}
      <section id="baby-care" className="py-14 sm:py-20 px-6 lg:px-8 bg-[#F7F4EE]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <FadeIn className="order-2 lg:order-1">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Baby Care</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-4">Gentle Care for Your Little Ones</h2>
            <p className="text-[#6B7280] text-base leading-relaxed mb-6">
              Your baby deserves careful attention, comfort and professional support. Nordic provides convenient home healthcare support for babies and families.
            </p>
            <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-4">Our Baby Care Support</p>
            <SupportList items={BABY_SUPPORT} />
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-full shadow-md">
                50% Off Baby Care
              </span>
              <a href={waLink(BABY_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-md hover:scale-[1.03]">
                Book Baby Care <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="order-1 lg:order-2">
            <div className="wpd-glass rounded-[28px] p-2.5">
              <div className="relative rounded-[20px] overflow-hidden aspect-[4/3]">
                <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                  <source src="/video/mother.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. PATIENT SAFETY STARTS AT HOME */}
      <section className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-white">
        <div className="absolute top-10 right-0 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D5B4F]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">World Patient Safety Day</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-4">Patient Safety Starts At Home</h2>
            <p className="text-[#6B7280] text-base max-w-2xl mx-auto leading-relaxed">
              Professional home healthcare is not only about treatment. It&rsquo;s about providing care with attention, responsibility and compassion.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map(({ title, desc, Icon }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="wpd-glass rounded-2xl p-6 h-full hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#543826] to-[#2D5B4F] flex items-center justify-center mb-4 shadow-md">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-[#1a2e28] text-base mb-1.5">{title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. YOUR WELLNESS, AT HOME (IV THERAPY) */}
      <section className="py-14 sm:py-20 px-6 lg:px-8 bg-[#F7F4EE]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <FadeIn>
            <div className="wpd-glass rounded-[28px] p-2.5">
              <div className="relative rounded-[20px] overflow-hidden aspect-[4/3]">
                <Image src="/images/Immune-Boost-Hydration-B.webp" alt="IV Therapy at home — Nordic Home Healthcare" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Your Wellness, At Home</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-4">40% Off IV Therapy</h2>
            <p className="text-[#6B7280] text-base leading-relaxed mb-8">
              Support your wellness and hydration without leaving your home.
            </p>
            <a href={waLink(IV_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all shadow-md hover:scale-[1.03]">
              Book IV Therapy <ChevronRight className="w-4 h-4" />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section id="book" className="py-14 sm:py-20 px-6 pb-16 sm:pb-24">
        <div className="max-w-[900px] mx-auto">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[32px] px-5 sm:px-14 py-10 sm:py-20 text-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e28] via-[#20362f] to-[#543826]" />
              <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
              <div className="absolute -top-32 -left-20 w-80 h-80 bg-[#D4A373]/25 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[#543826]/40 rounded-full blur-3xl" />

              <div className="relative">
                <Heart className="w-10 h-10 text-[#D4A373] mx-auto mb-6" />
                <h2 className="font-bold text-white mb-3 leading-tight" style={{ fontSize: "clamp(26px, 4vw, 44px)" }}>
                  For The Ones Who Matter Most.
                </h2>
                <p className="text-white/75 text-base sm:text-lg mb-2 max-w-md mx-auto leading-relaxed">
                  Their comfort matters. Their safety matters. Their wellbeing matters.
                </p>
                <p className="text-white/75 text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                  Give your loved ones the care they deserve — in the comfort of home.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-9">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full shadow-md">
                    50% Off Elderly Care
                  </span>
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full shadow-md">
                    50% Off Baby Care
                  </span>
                  <span className="wpd-glass-dark inline-flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full">
                    40% Off IV Therapy
                  </span>
                </div>
                <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mb-8">Limited-Time World Patient Safety Day Offer</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
                  <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-[#543826] font-bold px-9 py-4 rounded-full text-sm shadow-lg hover:scale-[1.03] transition-all duration-300">
                    <CheckCircle2 className="w-4 h-4" /> Book Your Home Care Today
                  </a>
                  <a href={waLink(GENERAL_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-9 py-4 rounded-full text-sm shadow-lg transition-all duration-300">
                    <WhatsAppIcon /> WhatsApp Us
                  </a>
                </div>
                <p className="text-white/50 text-sm font-semibold mt-9 mb-1">Nordic Home Healthcare Center</p>
                <p className="text-white/40 text-xs flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Professional Care, Right At Your Doorstep &middot; Offer valid 13&ndash;18 September 2026
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function WorldPatientSafetyDayPage() {
  const phase = usePhase();
  return phase === "active" ? <CampaignPage /> : <LaunchGate />;
}
