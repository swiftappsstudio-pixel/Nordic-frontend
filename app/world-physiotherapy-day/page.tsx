"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Activity,
  Bone,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  Gift,
  Heart,
  Home as HomeIcon,
  Move,
  PersonStanding,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────
const WA_NUM = "971581649910";
const BOOK_MSG = encodeURIComponent(
  "Hi Nordic! I'd like to book my 50% off physiotherapy session for World Physiotherapy Day."
);
const GENERAL_MSG = encodeURIComponent(
  "Hi Nordic! I'd like to learn more about the World Physiotherapy Day offer (50% off)."
);
const waLink = (msg: string) => `https://wa.me/${WA_NUM}?text=${msg}`;

// World Physiotherapy Day is 8 September 2026; the offer runs one extra day,
// ending end of day 9 September 2026, Dubai time (UTC+4).
const OFFER_END = new Date("2026-09-09T23:59:59+04:00");
const ORIGINAL_PRICE = 350;
const DISCOUNTED_PRICE = 175;

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

function Countdown({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const { mounted, days, hours, minutes, seconds, expired } = useCountdown(OFFER_END);

  if (mounted && expired) {
    return <p className={`text-sm font-semibold ${dark ? "text-white" : "text-[#1a2e28]"}`}>This offer has ended.</p>;
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

// ─── Section data ───────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: "The Offer", href: "#offer" },
  { label: "Why Physio", href: "#why" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Book Now", href: "#book" },
];

const WHY_CARDS = [
  { title: "Back & Neck Pain", desc: "Relieve chronic tension and restore pain-free movement.", Icon: Activity },
  { title: "Sports Injuries", desc: "Targeted rehab to get you back to peak performance.", Icon: Dumbbell },
  { title: "Muscle & Joint Pain", desc: "Ease stiffness and rebuild strength where it matters.", Icon: Bone },
  { title: "Post-Surgery Recovery", desc: "Guided recovery plans to heal safely and fully.", Icon: ShieldCheck },
  { title: "Mobility & Flexibility", desc: "Move freely again with tailored mobility work.", Icon: Move },
  { title: "Posture Correction", desc: "Correct alignment and prevent long-term strain.", Icon: PersonStanding },
];

const HOW_STEPS = [
  { n: 1, title: "Book Your Session", desc: "Message us on WhatsApp to reserve your 50% off slot." },
  { n: 2, title: "Meet Your Physiotherapist", desc: "A DHA-licensed physiotherapist visits you at home, on your schedule.", video: "/videos/world-physiotherapy-day/session.mp4" },
  { n: 3, title: "Get Your Personalized Treatment", desc: "A plan built around your body, your pain points, your goals.", image: "/images/world-physiotherapy-day/home-visit-1.jpg" },
  { n: 4, title: "Feel The Difference", desc: "Walk away lighter, looser, and closer to pain-free movement.", video: "/videos/world-physiotherapy-day/feel-the-difference.mp4" },
];

// ─── Mouse spotlight (glass reflection that follows the cursor) ────────────
function useSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--wpd-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--wpd-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };
  return { ref, handleMove };
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function WorldPhysiotherapyDayPage() {
  const { ref: spotlightRef, handleMove } = useSpotlight();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const shineY = useTransform(scrollYProgress, [0, 1], [0, 160]);

  // Try to autoplay this one with sound; browsers that block unmuted
  // autoplay will reject the promise, so we fall back to a muted
  // autoplay loop (viewers can still unmute via the native controls).
  const actionVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = actionVideoRef.current;
    if (!video) return;
    const attempt = video.play();
    if (attempt !== undefined) {
      attempt.catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }
    // Explicitly stop playback (and any sound) the moment this page is
    // left, rather than relying on the browser to notice the element was
    // removed — keeps the audio scoped to this page only.
    return () => {
      video.pause();
    };
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans">

      {/* 1. HERO */}
      <section
        ref={heroRef}
        onMouseMove={handleMove}
        className="relative min-h-[100svh] sm:min-h-[92vh] flex items-center overflow-hidden bg-[#0d1a16]"
      >
        <video autoPlay muted loop playsInline poster="/images/world-physiotherapy-day/home-visit-1.jpg" className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/world-physiotherapy-day/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a16]/85 via-[#0d1a16]/55 to-[#0d1a16]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a16]/75 via-[#0d1a16]/20 to-[#0d1a16]/60" />
        <div ref={spotlightRef} className="absolute inset-0 wpd-spotlight mix-blend-overlay pointer-events-none" />
        <motion.div
          style={{ y: shineY }}
          className="absolute -inset-x-10 -top-1/2 h-[180%] rotate-6 bg-gradient-to-b from-white/12 via-white/0 to-transparent pointer-events-none"
        />

        {/* Floating glass chips */}
        <div className="hidden lg:block absolute top-[20%] right-[9%] wpd-floating">
          <div className="wpd-glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
            <span className="text-white text-xs font-semibold whitespace-nowrap">DHA Licensed Physiotherapists</span>
          </div>
        </div>
        <div className="hidden lg:block absolute bottom-[24%] right-[15%] wpd-floating-slow">
          <div className="wpd-glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <HomeIcon className="w-4 h-4 text-[#D4A373]" />
            <span className="text-white text-xs font-semibold whitespace-nowrap">At Your Doorstep</span>
          </div>
        </div>
        <div className="hidden lg:block absolute top-[42%] left-[7%] wpd-floating">
          <div className="wpd-glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#D4A373]" />
            <span className="text-white text-xs font-semibold whitespace-nowrap">A Gift From Your Physio</span>
          </div>
        </div>

        <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-8 w-full pt-32 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 flex justify-center">
            <span className="wpd-glass-dark inline-flex items-center gap-2 text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] px-4 sm:px-5 py-2.5 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-[#D4A373]" />
              World Physiotherapy Day &middot; 8 September 2026
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-bold text-white leading-[1.08] mb-5" style={{ fontSize: "clamp(28px, 4.8vw, 54px)" }}>
            A Gift From <span className="text-[#D4A373]">Your Physio</span>
          </motion.h1>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
            <span className="text-white font-extrabold leading-none" style={{ fontSize: "clamp(52px, 10vw, 108px)" }}>50%</span>
            <span className="text-left">
              <span className="block text-white font-bold text-xl sm:text-2xl leading-tight">OFF</span>
              <span className="block text-white/65 text-xs sm:text-sm">Physiotherapy Sessions</span>
            </span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-white/75 max-w-xl mx-auto mb-9 text-base sm:text-lg leading-relaxed">
            Celebrate World Physiotherapy Day with half off your session — DHA-licensed physiotherapists, delivered to your door in Dubai.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-10 max-w-sm sm:max-w-none mx-auto">
            <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-7 sm:px-8 py-3.5 rounded-full text-sm transition-all shadow-lg hover:scale-[1.03]">
              Book Your Physiotherapy
            </a>
            <a href={waLink(GENERAL_MSG)} target="_blank" rel="noopener noreferrer" className="wpd-glass-dark inline-flex items-center justify-center gap-2 text-white font-semibold px-7 sm:px-8 py-3.5 rounded-full text-sm transition-all hover:scale-[1.03]">
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              WhatsApp Us
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <p className="text-white/55 text-[11px] font-semibold uppercase tracking-widest mb-3">Offer ends in</p>
            <div className="flex justify-center"><Countdown dark /></div>
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
        <div className="relative max-w-[880px] mx-auto">
          <FadeIn className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-[#543826]/8 border border-[#543826]/15 text-[#543826] text-[11px] font-semibold uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-4">
              <Gift className="w-3.5 h-3.5" /> A Gift From Your Physio
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">
              Celebrate World Physiotherapy Day<br className="hidden sm:block" /> With 50% Off Your Session
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="wpd-glass rounded-[32px] p-6 sm:p-14 text-center relative overflow-hidden">
              <div className="wpd-shine" />
              <motion.span
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
                className="absolute top-5 right-5 sm:top-7 sm:right-7 inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md"
              >
                50% OFF
              </motion.span>

              <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-5">Limited Time Offer</p>

              <div className="flex items-end justify-center gap-3 sm:gap-4 mb-2 flex-wrap">
                <span className="text-[#6B7280] text-xl sm:text-2xl line-through">AED {ORIGINAL_PRICE}</span>
                <span className="text-[#1a2e28] font-extrabold leading-none" style={{ fontSize: "clamp(44px, 7vw, 68px)" }}>
                  AED {DISCOUNTED_PRICE}
                </span>
              </div>
              <p className="text-[#6B7280] text-sm mb-8">per session &middot; save AED {ORIGINAL_PRICE - DISCOUNTED_PRICE}</p>

              <div className="inline-flex items-center gap-2 mb-8 text-[#543826] text-sm font-semibold bg-[#543826]/8 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4" /> Offer expires 9 September 2026
              </div>

              <div className="flex justify-center mb-9"><Countdown /></div>

              <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-9 py-4 rounded-full text-sm transition-all shadow-lg hover:scale-[1.03]">
                Book Your Physiotherapy <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. WHY PHYSIOTHERAPY */}
      <section id="why" className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white to-[#F7F4EE]">
        <div className="absolute top-10 -right-20 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#2D5B4F]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Why Physiotherapy</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">What We Can Help You With</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CARDS.map(({ title, desc, Icon }, i) => (
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

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-[#F7F4EE]">
        <div className="absolute top-10 right-0 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D5B4F]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">Four Steps To Feeling Better</h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_STEPS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.08}>
                <div className="wpd-glass rounded-2xl overflow-hidden h-full flex flex-col">
                  {step.video ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                        <source src={step.video} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  ) : step.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={step.image} alt={step.title} fill sizes="(max-width: 1024px) 100vw, 25vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-[#543826] to-[#2D5B4F]">
                      <span className="text-white font-extrabold text-4xl">{String(step.n).padStart(2, "0")}</span>
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-1.5">Step {step.n}</span>
                    <h3 className="font-bold text-[#1a2e28] text-base mb-1.5">{step.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. REAL CARE GALLERY */}
      <section className="py-14 sm:py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Real Care, At Home</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">See Nordic Physiotherapists In Action</h2>
          </FadeIn>

          <FadeIn className="mb-16">
            <div className="wpd-glass rounded-[28px] p-3 sm:p-4">
              <div className="relative rounded-[20px] overflow-hidden bg-black flex items-center justify-center">
                <video ref={actionVideoRef} autoPlay controls loop playsInline preload="auto" className="w-full max-h-[50vh] sm:max-h-[75vh] block">
                  <source src="/videos/world-physiotherapy-day/ambient.mp4" type="video/mp4" />
                </video>
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 wpd-glass-dark rounded-full px-4 py-2 flex items-center gap-2 pointer-events-none">
                  <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
                  <span className="text-white text-xs font-semibold tracking-wide">Nordic Home Healthcare</span>
                </div>
              </div>
              <div className="px-3 sm:px-6 pt-6 pb-3 sm:pb-4 text-center">
                <h3 className="font-bold text-[#1a2e28] text-lg sm:text-xl mb-2">DHA-Licensed Physiotherapy, At Your Doorstep</h3>
                <p className="text-[#6B7280] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                  Watch how Nordic Home Healthcare&rsquo;s physiotherapists bring professional, personalized care into homes across Dubai — turn the sound on for the full experience.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            <FadeIn>
              <div className="wpd-glass rounded-[24px] p-2.5">
                <div className="relative rounded-[18px] overflow-hidden aspect-[4/5]">
                  <Image src="/images/world-physiotherapy-day/home-visit-1.jpg" alt="Nordic Home Healthcare clinician during a home visit" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="wpd-glass rounded-[24px] p-2.5">
                <div className="relative rounded-[18px] overflow-hidden aspect-[4/5]">
                  <Image src="/images/world-physiotherapy-day/home-visit-2.jpg" alt="Nordic Home Healthcare mobility assessment at home" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
            <FadeIn className="sm:rotate-[-3deg]">
              <div className="wpd-glass rounded-2xl p-2.5 w-[180px] sm:w-[260px] hover:rotate-0 transition-transform duration-300">
                <div className="relative rounded-xl overflow-hidden aspect-square">
                  <Image src="/images/world-physiotherapy-day/campaign-en.jpg" alt="Living with pain is not normal — Nordic Home Healthcare physiotherapy campaign" fill sizes="(max-width: 640px) 180px, 260px" className="object-cover" />
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.1} className="sm:rotate-[2deg] sm:mt-8">
              <div className="wpd-glass rounded-2xl p-2.5 w-[180px] sm:w-[260px] hover:rotate-0 transition-transform duration-300">
                <div className="relative rounded-xl overflow-hidden aspect-square">
                  <Image src="/images/world-physiotherapy-day/campaign-ar.jpg" alt="Nordic Home Healthcare physiotherapy campaign" fill sizes="(max-width: 640px) 180px, 260px" className="object-cover" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 6. URGENCY */}
      <section className="relative py-16 sm:py-24 px-6 lg:px-8 overflow-hidden bg-[#0d1a16]">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-25 scale-110 blur-[2px]">
          <source src="/videos/world-physiotherapy-day/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a16]/90 via-[#0d1a16]/82 to-[#0d1a16]/95" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4A373]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2D5B4F]/25 rounded-full blur-3xl" />

        <div className="relative max-w-[800px] mx-auto text-center">
          <FadeIn>
            <div className="wpd-glass-dark rounded-[32px] p-6 sm:p-14 relative overflow-hidden">
              <div className="wpd-shine" />
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">
                <Clock className="w-3.5 h-3.5 text-[#D4A373]" /> Limited Time
              </span>
              <h2 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(24px, 4vw, 40px)" }}>
                This Gift Won&rsquo;t Last Forever.
              </h2>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                Your 50% off World Physiotherapy Day offer is available for a limited time — book before it&rsquo;s gone.
              </p>
              <div className="flex justify-center mb-10"><Countdown dark /></div>
              <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-[#1a2e28] font-semibold px-9 py-4 rounded-full text-sm transition-all shadow-lg hover:scale-[1.03]">
                Claim My 50% Off <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 7. FINAL CTA */}
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
                  Your Body Deserves Better.
                </h2>
                <p className="text-white/75 text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
                  Give it the gift of movement — 50% off your physiotherapy session, for World Physiotherapy Day only.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
                  <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-[#543826] font-bold px-9 py-4 rounded-full text-sm shadow-lg hover:scale-[1.03] transition-all duration-300">
                    <CheckCircle2 className="w-4 h-4" /> BOOK NOW &mdash; 50% OFF
                  </a>
                  <a href={waLink(GENERAL_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-9 py-4 rounded-full text-sm shadow-lg transition-all duration-300">
                    <WhatsAppIcon /> WhatsApp Us
                  </a>
                </div>
                <p className="text-white/40 text-xs mt-8 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Offer valid through 9 September 2026 &middot; Dubai, UAE
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
