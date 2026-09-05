"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Baby,
  Bandage,
  Bone,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplet,
  Flame,
  Heart,
  HeartHandshake,
  HeartPulse,
  Home as HomeIcon,
  Lock,
  Sparkles,
  Stethoscope,
  Syringe,
  TestTube,
} from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────
const WA_NUM = "971581649910";
const BOOK_MSG = encodeURIComponent(
  "Hi Nordic! I'd like to book my World First Aid Day offer — 50% off blood tests / 40% off other eligible services."
);
const GENERAL_MSG = encodeURIComponent(
  "Hi Nordic! I'd like to learn more about the World First Aid Day offer."
);
const NOTIFY_MSG = encodeURIComponent(
  "Hi Nordic! Please notify me when the World First Aid Day offer goes live."
);
const waLink = (msg: string) => `https://wa.me/${WA_NUM}?text=${msg}`;

// Page unlocks 9 September 2026 and the offer runs through World First Aid
// Day itself, 12 September 2026 — both Dubai time (UTC+4).
const LAUNCH_DATE = new Date("2026-09-09T00:00:00+04:00");
const OFFER_END = new Date("2026-09-12T23:59:59+04:00");

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511" />
  </svg>
);

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

// TEMPORARY — unlocked for testing at the requester's ask. Set back to
// false to re-enable the real LAUNCH_DATE gate below.
const TESTING_FORCE_UNLOCK = false;

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
            <Calendar className="w-3.5 h-3.5 text-[#D4A373]" /> World First Aid Day &middot; 12 September 2026
          </span>

          <h1 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(24px, 4vw, 36px)" }}>
            This Offer Isn&rsquo;t Live Yet.
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full shadow-md">
              50% Off Blood Tests
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full">
              40% Off Other Services
            </span>
          </div>

          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-9 max-w-sm mx-auto">
            Our World First Aid Day offer unlocks on <strong className="text-white">9 September 2026</strong> and runs through World First Aid Day on <strong className="text-white">12 September 2026</strong>. Check back soon.
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
  { label: "Be Prepared", href: "#prepared" },
  { label: "Our Services", href: "#services" },
  { label: "Book Now", href: "#book" },
];

const FIRST_AID_BASICS = [
  { title: "Bleeding", desc: "Learn how to respond to bleeding and when professional help is needed.", Icon: Droplet },
  { title: "Burns", desc: "Understand the right first steps when someone suffers a burn.", Icon: Flame },
  { title: "Cardiac Emergencies", desc: "Recognize warning signs and know when to call emergency services.", Icon: HeartPulse },
  { title: "Unconsciousness", desc: "Know how to check responsiveness and breathing.", Icon: AlertTriangle },
  { title: "Injuries", desc: "Learn how to provide basic support while waiting for medical assistance.", Icon: Bone },
];

const HEALTHCARE_SERVICES = [
  { title: "Blood Tests at Home", Icon: TestTube, href: "/blood-test" },
  { title: "IV Therapy", Icon: Syringe, href: "/iv-therapy" },
  { title: "Nursing Care", Icon: Stethoscope },
  { title: "Elderly Care", Icon: HeartHandshake, href: "/elderly-care" },
  { title: "Baby Care", Icon: Baby, href: "/mother-and-baby" },
  { title: "Physiotherapy", Icon: Bandage, href: "/physiotherapy" },
  { title: "General Home Healthcare", Icon: HomeIcon },
];

function CampaignPage() {
  return (
    <div className="bg-white min-h-screen font-sans">

      {/* 1. HERO */}
      <section className="relative min-h-[100svh] sm:min-h-[85vh] flex items-center overflow-hidden bg-[#0d1a16]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a16] via-[#16261f] to-[#3a2a1c]" />
        <div className="absolute -top-24 -right-24 w-[30rem] h-[30rem] bg-[#D4A373]/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-[30rem] h-[30rem] bg-[#2D5B4F]/25 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.06),transparent_55%)]" />

        <div className="hidden lg:block absolute top-[20%] right-[10%] wpd-floating">
          <div className="wpd-glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#D4A373]" />
            <span className="text-white text-xs font-semibold whitespace-nowrap">Be Ready. Be Prepared.</span>
          </div>
        </div>
        <div className="hidden lg:block absolute bottom-[24%] left-[10%] wpd-floating-slow">
          <div className="wpd-glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <HomeIcon className="w-4 h-4 text-[#D4A373]" />
            <span className="text-white text-xs font-semibold whitespace-nowrap">At Your Doorstep</span>
          </div>
        </div>

        <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-8 w-full pt-32 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 flex justify-center">
            <span className="wpd-glass-dark inline-flex items-center gap-2 text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] px-4 sm:px-5 py-2.5 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-[#D4A373]" />
              World First Aid Day &middot; 12 September 2026
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-bold text-white leading-[1.08] mb-5" style={{ fontSize: "clamp(30px, 5vw, 56px)" }}>
            Be Ready. Be Prepared. <span className="text-[#D4A373]">Take Care.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/75 max-w-xl mx-auto mb-8 text-base sm:text-lg leading-relaxed">
            Celebrate World First Aid Day with Nordic Home Healthcare Center.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap items-center justify-center gap-3 mb-9">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full shadow-md">
              50% Off Blood Tests
            </span>
            <span className="wpd-glass-dark inline-flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full">
              40% Off Other Services
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
              A Health Check, Made Simple
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
                <h3 className="font-bold text-[#1a2e28] text-lg mb-3">Blood Test Services</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">Get your blood tests done conveniently from the comfort of your home.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="wpd-glass rounded-[28px] p-7 sm:p-9 text-center h-full relative overflow-hidden">
                <div className="wpd-shine" />
                <span className="inline-flex items-center gap-1 bg-[#543826]/10 text-[#543826] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-5">
                  Site-Wide
                </span>
                <p className="text-[#1a2e28] font-extrabold leading-none mb-2" style={{ fontSize: "clamp(40px, 6vw, 56px)" }}>40% OFF</p>
                <h3 className="font-bold text-[#1a2e28] text-lg mb-3">All Other Eligible Services</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">Because taking care of your health should be simple, comfortable and accessible.</p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.15}>
            <div className="wpd-glass rounded-[28px] p-7 sm:p-10 text-center">
              <div className="inline-flex items-center gap-2 mb-7 text-[#543826] text-sm font-semibold bg-[#543826]/8 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4" /> Offer valid 9&ndash;12 September 2026
              </div>
              <div className="flex justify-center mb-8"><Countdown target={OFFER_END} /></div>
              <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-9 py-4 rounded-full text-sm transition-all shadow-lg hover:scale-[1.03]">
                Book Now <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. FIRST AID STARTS WITH BEING PREPARED */}
      <section id="prepared" className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white to-[#F7F4EE]">
        <div className="absolute top-10 -right-20 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#2D5B4F]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-5">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Know The Basics</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-4">First Aid Starts With Being Prepared</h2>
            <p className="text-[#6B7280] text-base max-w-2xl mx-auto leading-relaxed">
              Would you know what to do when an emergency happens? First aid knowledge can help you respond calmly and appropriately while professional medical help is being arranged.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {FIRST_AID_BASICS.map(({ title, desc, Icon }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
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

      {/* 4. YOUR HEALTH, OUR CARE */}
      <section id="services" className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-[#F7F4EE]">
        <div className="absolute top-10 right-0 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D5B4F]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Your Health, Our Care</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-4">Our Home Healthcare Services</h2>
            <p className="text-[#6B7280] text-base max-w-2xl mx-auto leading-relaxed">
              At Nordic Home Healthcare Center, we bring professional healthcare services directly to your home.
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {HEALTHCARE_SERVICES.map(({ title, Icon, href }, i) => {
              const content = (
                <div className="wpd-glass rounded-2xl p-5 h-full flex flex-col items-center text-center gap-3 hover:shadow-lg transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#543826] to-[#2D5B4F] flex items-center justify-center shadow-md">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[#1a2e28] text-sm font-semibold leading-snug">{title}</span>
                </div>
              );
              return (
                <FadeIn key={title} delay={(i % 4) * 0.06}>
                  {href ? (
                    <Link href={href} className="block h-full">{content}</Link>
                  ) : (
                    <a
                      href={waLink(encodeURIComponent(`Hi Nordic! I'd like to learn more about ${title}.`))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {content}
                    </a>
                  )}
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
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
                  Take Care Of Your Health Today.
                </h2>
                <p className="text-white/75 text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                  You don&rsquo;t have to wait for a health concern to become an emergency. Take advantage of our World First Aid Day special offer.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-9">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full shadow-md">
                    50% Off Blood Tests
                  </span>
                  <span className="wpd-glass-dark inline-flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full">
                    40% Off Other Eligible Services
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
                  <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-[#543826] font-bold px-9 py-4 rounded-full text-sm shadow-lg hover:scale-[1.03] transition-all duration-300">
                    <CheckCircle2 className="w-4 h-4" /> Book Your Home Healthcare Service
                  </a>
                  <a href={waLink(GENERAL_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-9 py-4 rounded-full text-sm shadow-lg transition-all duration-300">
                    <WhatsAppIcon /> WhatsApp Us
                  </a>
                </div>
                <p className="text-white/50 text-sm font-semibold mt-9 mb-1">Nordic Home Healthcare Center</p>
                <p className="text-white/40 text-xs flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Professional Care, Right At Your Doorstep &middot; Offer valid 9&ndash;12 September 2026
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
export default function WorldFirstAidDayPage() {
  const phase = usePhase();
  return phase === "active" ? <CampaignPage /> : <LaunchGate />;
}
