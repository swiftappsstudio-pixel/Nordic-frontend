"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  AlertTriangle,
  Baby,
  Ban,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplet,
  EyeOff,
  Hand,
  HandHeart,
  HeartPulse,
  Info,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  TestTube,
  Thermometer,
  Trash2,
  UserCheck,
  UsersRound,
  Wind,
} from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────
const WA_NUM = "971581649910";
const waLink = (msg: string) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
const BOOK_MSG = "Hi Nordic! I'd like to book a seasonal flu service at home in Dubai.";
const GENERAL_MSG = "Hi Nordic! I'd like to learn more about your Dubai flu season services.";

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

// ─── Section data ───────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: "Guidance", href: "#guidance" },
  { label: "Services", href: "#services" },
  { label: "Who Should Get It", href: "#who" },
  { label: "Symptoms", href: "#symptoms" },
  { label: "Offers", href: "#offers" },
  { label: "FAQ", href: "#faq" },
];

const GUIDANCE_POINTS = [
  "Annual seasonal flu vaccination is recommended for most people.",
  "Children aged 6 months to 5 years are among the recommended groups.",
  "Adults aged 65 and above are particularly encouraged to get vaccinated.",
  "Pregnant women are recommended to receive the flu vaccine during any trimester.",
  "People with chronic medical conditions should consider annual vaccination.",
  "Healthcare workers are also among the recommended groups.",
  "Family members and caregivers in close contact with vulnerable people or babies under 6 months should also consider vaccination.",
];

const WHO_FOR = [
  { title: "Young Children", desc: "Children aged 6 months to 5 years are among the groups specifically recommended for annual influenza vaccination.", Icon: Baby },
  { title: "Pregnant Women", desc: "Annual influenza vaccination is recommended during pregnancy, including any trimester.", Icon: HandHeart },
  { title: "Adults 65+", desc: "Older adults are among the higher-risk groups encouraged to receive annual flu vaccination.", Icon: UserCheck },
  { title: "People With Chronic Conditions", desc: "People with chronic medical conditions may be at higher risk of complications from influenza.", Icon: HeartPulse },
  { title: "Healthcare Workers", desc: "Healthcare workers are also included among the groups recommended for vaccination.", Icon: Stethoscope },
  { title: "Caregivers & Families", desc: "People who live with or care for vulnerable individuals or babies under 6 months should also consider vaccination.", Icon: UsersRound },
];

const SYMPTOMS = ["Fever", "Dry cough", "Headache", "Muscle and joint pain", "Severe tiredness", "Sore throat", "Runny nose"];

const PREVENTION = [
  { text: "Wash and dry your hands regularly", Icon: Hand },
  { text: "Cover your mouth and nose when coughing or sneezing", Icon: Wind },
  { text: "Dispose of used tissues properly", Icon: Trash2 },
  { text: "Stay home when feeling unwell", Icon: ShieldCheck },
  { text: "Avoid close contact with people who are sick", Icon: Ban },
  { text: "Avoid touching your eyes, nose and mouth", Icon: EyeOff },
  { text: "Stay up to date with recommended vaccination", Icon: Syringe },
];

type Offer = {
  title: string;
  desc: string;
  price: number;
  originalPrice: number;
  badge: string;
  image?: string;
  href: string;
  Icon: typeof Syringe;
};

const OFFERS: Offer[] = [
  {
    title: "Seasonal Flu Vaccination",
    desc: "Administered at home by a DHA-licensed nurse — a single vaccination to help reduce your risk of influenza this season.",
    price: 149,
    originalPrice: 199,
    badge: "AED 50 OFF",
    image: "/images/nurse2.png",
    href: "/back-to-school-sale/kids-health/flu-influenza-vaccine-for-kids",
    Icon: Syringe,
  },
  {
    title: "Seasonal Flu PCR / Swab Test",
    desc: "A gentle swab test to help identify the virus behind cold, cough or flu-like symptoms, processed by an accredited lab.",
    price: 199,
    originalPrice: 239,
    badge: "AED 40 OFF",
    image: "/images/blood_test_intrument.png",
    href: "/back-to-school-sale/kids-health/seasonal-flu-pcr-swab-test",
    Icon: TestTube,
  },
  {
    title: "Health & Wellness Blood Test",
    desc: "A focused blood panel checking essential vitamins and minerals — useful as part of general health monitoring during flu season.",
    price: 299,
    originalPrice: 399,
    badge: "AED 100 OFF",
    image: "/images/nordic_blood_test.png",
    href: "/back-to-school-sale/kids-health/basic-vitamins-minerals-blood-test",
    Icon: Droplet,
  },
];

const FAQS = [
  { q: "Who should get the flu vaccine every year?", a: "Annual flu vaccination is generally recommended for most people, and particularly encouraged for young children, adults 65 and older, pregnant women, people with chronic medical conditions, healthcare workers, and those in close contact with vulnerable individuals or babies under 6 months." },
  { q: "Should children get the flu vaccine?", a: "Children aged 6 months to 5 years are among the groups specifically recommended for annual influenza vaccination, as young children can be more susceptible to flu-related complications." },
  { q: "Can pregnant women get the flu vaccine?", a: "Yes — annual influenza vaccination is recommended during pregnancy, including in any trimester. If you have specific concerns, it's best to discuss them with your doctor beforehand." },
  { q: "Should people over 65 get vaccinated?", a: "Yes. Adults aged 65 and above are among the higher-risk groups particularly encouraged to receive annual flu vaccination." },
  { q: "Should caregivers and family members get vaccinated?", a: "Yes — people who live with or care for vulnerable individuals, or for babies under 6 months who are too young to be vaccinated themselves, should also consider annual vaccination to help reduce the risk of passing the virus on." },
  { q: "Can the flu vaccine make you sick?", a: "The inactivated flu vaccines used for seasonal vaccination cannot cause influenza, since they don't contain a live virus capable of causing infection. Some people may experience mild, short-lived effects like soreness at the injection site." },
  { q: "Are all flu vaccines injections?", a: "The seasonal flu vaccine offered by Nordic is given as an injection, administered at home by a DHA-licensed nurse." },
  { q: "What are common flu symptoms?", a: "Common symptoms can include fever, dry cough, headache, muscle and joint pain, severe tiredness, sore throat, and a runny nose. If symptoms are severe or you're concerned, seek medical advice promptly." },
  { q: "What can I do to reduce my risk of getting flu?", a: "Alongside annual vaccination, simple habits help: wash and dry your hands regularly, cover coughs and sneezes, dispose of tissues properly, stay home when unwell, avoid close contact with people who are sick, and avoid touching your eyes, nose and mouth." },
  { q: "Can Nordic provide flu-related healthcare services at home?", a: "Yes. Nordic offers at-home seasonal flu vaccination, seasonal flu PCR/swab testing for those with symptoms, and health & wellness blood tests as part of general health monitoring. We also offer at-home IV wellness options for hydration and general wellness support — these are not a treatment or cure for influenza, and are provided subject to clinical assessment and suitability." },
];

function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl transition-all duration-300 ${open ? "bg-[#1a2e28]/5 shadow-sm" : "bg-transparent"}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 text-left group px-4 py-4">
        <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${open ? "bg-[#1a2e28] text-white" : "bg-[#1a2e28]/10 text-[#1a2e28]"}`}>{String(idx + 1).padStart(2, "0")}</span>
        <span className="text-[#1a2e28] text-sm font-medium leading-snug group-hover:text-[#2D5B4F] transition-colors flex-1">{q}</span>
        <span className="shrink-0 w-6 h-6 flex items-center justify-center">
          <svg className={`w-4 h-4 transition-all duration-300 ${open ? "rotate-180 text-[#1a2e28]" : "text-[#1a2e28]/40"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
        <p className="text-[#6B7280] text-sm leading-relaxed px-4 pb-4 pl-[60px]">{a}</p>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function DubaiFluSeasonContent() {
  const { ref: spotlightRef, handleMove } = useSpotlight();

  return (
    <div className="bg-white min-h-screen font-sans pb-20 lg:pb-0">

      {/* 1. HERO — a distinct split, warm-sand layout (not the dark video hero used elsewhere) */}
      <section
        onMouseMove={handleMove}
        className="relative overflow-hidden bg-gradient-to-br from-[#FBF3E7] via-[#F3E4CE] to-[#E8D3B0] pt-28 pb-16 lg:pt-36 lg:pb-24"
      >
        <div ref={spotlightRef} className="absolute inset-0 wpd-spotlight opacity-40 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[26rem] h-[26rem] bg-[#D4A373]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-[#2D5B4F]/12 rounded-full blur-3xl" />
        {/* Subtle UAE-flag accent stripe */}
        <div className="absolute top-0 inset-x-0 h-1.5 flex">
          <div className="flex-1 bg-[#EF3340]" />
          <div className="flex-[3] bg-[#1a2e28]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#00732F]" />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">

            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <FadeIn>
                <span className="inline-flex items-center gap-2 bg-white/70 border border-[#543826]/15 text-[#543826] text-[11px] font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full mb-6 shadow-sm">
                  <Calendar className="w-3.5 h-3.5" /> Nordic Home Healthcare &middot; Dubai
                </span>
              </FadeIn>

              <FadeIn delay={0.08}>
                <h1 className="font-brand text-[#1a2e28] leading-[0.92] mb-1" style={{ fontSize: "clamp(44px, 7.5vw, 88px)" }}>
                  Flu Season
                </h1>
                <h1 className="font-brand text-[#543826] leading-[0.92] mb-6" style={{ fontSize: "clamp(44px, 7.5vw, 88px)" }}>
                  2026
                </h1>
              </FadeIn>

              <FadeIn delay={0.14}>
                <p className="text-[#2D5B4F] font-bold text-lg sm:text-xl mb-5">Stay Protected. Stay Healthy. Stay Prepared.</p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="text-[#4b4237] max-w-lg mx-auto lg:mx-0 mb-8 text-base sm:text-lg leading-relaxed">
                  As flu season approaches in the UAE, help protect yourself and your family with convenient healthcare services delivered directly to your home.
                </p>
              </FadeIn>

              <FadeIn delay={0.26}>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-9">
                  {[
                    { t: "DHA-Guided Care", Icon: ShieldCheck },
                    { t: "Vaccination At Home", Icon: Syringe },
                    { t: "Care For The Whole Family", Icon: UsersRound },
                  ].map(({ t, Icon }) => (
                    <span key={t} className="inline-flex items-center gap-1.5 bg-white/70 border border-[#543826]/10 text-[#1a2e28] text-xs font-semibold px-3.5 py-2 rounded-full shadow-sm">
                      <Icon className="w-3.5 h-3.5 text-[#2D5B4F]" /> {t}
                    </span>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.32}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 max-w-sm sm:max-w-none mx-auto lg:mx-0">
                  <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-7 sm:px-8 py-3.5 rounded-full text-sm transition-all shadow-lg hover:scale-[1.03]">
                    Book Your Flu Service
                  </a>
                  <a href={waLink(GENERAL_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white/80 border border-[#543826]/15 text-[#1a2e28] font-semibold px-7 sm:px-8 py-3.5 rounded-full text-sm transition-all hover:scale-[1.03] hover:bg-white">
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366]" /> WhatsApp Us
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Right: photo collage — two real Nordic photos, overlapping glass-framed */}
            <FadeIn delay={0.2}>
              <div className="relative mx-auto max-w-[420px] lg:max-w-none h-[420px] sm:h-[480px] lg:h-[560px]">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                  className="absolute top-0 right-0 w-[68%] h-[62%] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/90 rotate-[2deg]"
                >
                  <Image src="/images/mother_child_2.png" alt="A Nordic nurse caring for a child at home in Dubai" fill sizes="(max-width: 1024px) 60vw, 420px" className="object-cover" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-0 left-0 w-[62%] h-[55%] rounded-[28px] overflow-hidden shadow-2xl border-4 border-white/90 -rotate-[3deg]"
                >
                  <Image src="/images/nurse_with_elder.png" alt="A Nordic nurse caring for an elderly patient at home in Dubai" fill sizes="(max-width: 1024px) 55vw, 380px" className="object-cover" />
                </motion.div>

                <div className="hidden sm:flex absolute top-[6%] left-0 wpd-glass rounded-2xl px-4 py-2.5 items-center gap-2 shadow-lg wpd-floating">
                  <UsersRound className="w-4 h-4 text-[#543826]" />
                  <span className="text-[#1a2e28] text-xs font-semibold whitespace-nowrap">Every Generation, Protected</span>
                </div>
                <div className="hidden sm:flex absolute bottom-[4%] right-0 wpd-glass rounded-2xl px-4 py-2.5 items-center gap-2 shadow-lg wpd-floating-slow">
                  <Syringe className="w-4 h-4 text-[#543826]" />
                  <span className="text-[#1a2e28] text-xs font-semibold whitespace-nowrap">At-Home Vaccination</span>
                </div>
              </div>
            </FadeIn>
          </div>
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

      {/* 2. GUIDANCE */}
      <section id="guidance" className="relative pt-4 pb-14 sm:pb-20 px-6 lg:px-8 overflow-hidden bg-[#F7F4EE]">
        <div className="absolute -top-10 -left-24 w-96 h-96 bg-[#D4A373]/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#2D5B4F]/12 rounded-full blur-3xl" />
        <div className="relative max-w-[1000px] mx-auto">
          <FadeIn className="text-center mb-10">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Health Guidance</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-4">Why Seasonal Flu Vaccination Matters</h2>
            <p className="text-[#6B7280] text-base max-w-2xl mx-auto leading-relaxed">
              Flu viruses circulate every year in the UAE, and vaccination remains one of the most effective ways to reduce your risk of infection and complications. Here's what's generally recommended:
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="wpd-glass rounded-[28px] p-6 sm:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {GUIDANCE_POINTS.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 mt-0.5 rounded-full bg-[#543826]/10 text-[#543826] flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[#1a2e28] text-sm font-medium leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            <FadeIn delay={0.15}>
              <div className="wpd-glass rounded-2xl p-6 flex items-start gap-4 h-full">
                <div className="w-11 h-11 rounded-xl bg-[#543826]/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-[#543826]" />
                </div>
                <p className="text-[#1a2e28] text-sm leading-relaxed">
                  <strong>Inactivated flu vaccines cannot cause influenza</strong> — they don't contain a live virus capable of causing infection.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="wpd-glass rounded-2xl p-6 flex items-start gap-4 h-full">
                <div className="w-11 h-11 rounded-xl bg-[#543826]/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#543826]" />
                </div>
                <p className="text-[#1a2e28] text-sm leading-relaxed">
                  Flu vaccines are <strong>updated regularly</strong> to better match the strains expected to circulate each season.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. NORDIC SEASONAL FLU SERVICES */}
      <section id="services" className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white to-[#F7F4EE]">
        <div className="absolute top-10 -right-20 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#2D5B4F]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Nordic Seasonal Flu Services</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">Care At Home, This Flu Season</h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FadeIn>
              <Link href="/back-to-school-sale/kids-health/flu-influenza-vaccine-for-kids" className="block wpd-glass ring-2 ring-[#D4A373] rounded-2xl p-6 h-full hover:shadow-xl transition-all duration-300">
                <span className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Main Service</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#543826] to-[#2D5B4F] flex items-center justify-center mb-4 shadow-md">
                  <Syringe className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#1a2e28] text-base mb-1.5">Seasonal Flu Vaccination</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">Administered at home by a DHA-licensed nurse — can help reduce your risk of influenza and related complications.</p>
              </Link>
            </FadeIn>
            <FadeIn delay={0.07}>
              <Link href="/back-to-school-sale/kids-health/seasonal-flu-pcr-swab-test" className="block wpd-glass rounded-2xl p-6 h-full hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#543826] to-[#2D5B4F] flex items-center justify-center mb-4 shadow-md">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#1a2e28] text-base mb-1.5">Seasonal Flu PCR / Swab Testing</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">For people experiencing symptoms or who require testing — a gentle swab collected at home.</p>
              </Link>
            </FadeIn>
            <FadeIn delay={0.14}>
              <Link href="/blood-test" className="block wpd-glass rounded-2xl p-6 h-full hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#543826] to-[#2D5B4F] flex items-center justify-center mb-4 shadow-md">
                  <Droplet className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#1a2e28] text-base mb-1.5">Health &amp; Wellness Blood Tests</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">General health screening to support overall wellness monitoring during the season.</p>
              </Link>
            </FadeIn>
            <FadeIn delay={0.21}>
              <Link href="/iv-therapy" className="block wpd-glass rounded-2xl p-6 h-full hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#543826] to-[#2D5B4F] flex items-center justify-center mb-4 shadow-md">
                  <Droplet className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[#1a2e28] text-base mb-1.5">Relevant IV Therapy</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">Feeling run down or dehydrated? Explore Nordic&rsquo;s at-home IV wellness options, subject to clinical assessment and suitability.</p>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 4. WHO SHOULD CONSIDER */}
      <section id="who" className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-[#F7F4EE]">
        <div className="absolute top-10 right-0 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D5B4F]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Recommended Groups</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">Who Should Consider Flu Vaccination?</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHO_FOR.map(({ title, desc, Icon }, i) => (
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

      {/* 5. SYMPTOMS */}
      <section id="symptoms" className="py-14 sm:py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-[900px] mx-auto">
          <FadeIn className="text-center mb-10">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Flu Symptoms</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">Know The Signs</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="wpd-glass rounded-[28px] p-6 sm:p-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SYMPTOMS.map((s) => (
                  <div key={s} className="flex items-center gap-2 bg-[#543826]/5 rounded-xl px-3 py-2.5">
                    <Thermometer className="w-4 h-4 text-[#543826] shrink-0" />
                    <span className="text-[#1a2e28] text-sm font-medium">{s}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 mt-6 pt-6 border-t border-[#543826]/10">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[#1a2e28] text-sm font-medium leading-relaxed">
                  If symptoms are severe or you are concerned about your health, seek medical advice promptly.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 6. PREVENTION */}
      <section className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-[#F7F4EE]">
        <div className="absolute top-10 -right-20 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[1000px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Prevention</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">Protect Yourself &amp; Your Family</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PREVENTION.map(({ text, Icon }, i) => (
              <FadeIn key={text} delay={i * 0.06}>
                <div className="wpd-glass rounded-2xl px-5 py-4 flex items-center gap-3.5 hover:shadow-lg transition-all duration-300">
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-[#543826]/10 text-[#543826] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-[#1a2e28] text-sm font-semibold">{text}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MID-PAGE CTA */}
      <section className="py-14 sm:py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[32px] px-6 sm:px-14 py-12 sm:py-16 text-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e28] via-[#20362f] to-[#543826]" />
              <div className="absolute -top-24 -left-20 w-72 h-72 bg-[#D4A373]/20 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="font-bold text-white mb-4 leading-tight" style={{ fontSize: "clamp(24px, 3.4vw, 40px)" }}>
                  Protect Your Health This Flu Season
                </h2>
                <p className="text-white/70 text-base mb-8 max-w-lg mx-auto leading-relaxed">
                  Get convenient healthcare services at home with Nordic Home Healthcare Center.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
                  <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-[#1a2e28] font-bold px-8 py-3.5 rounded-full text-sm shadow-lg hover:scale-[1.03] transition-all duration-300">
                    Book Your Flu Service
                  </a>
                  <a href={waLink(GENERAL_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-8 py-3.5 rounded-full text-sm shadow-lg transition-all duration-300">
                    <WhatsAppIcon /> WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 8. OFFERS */}
      <section id="offers" className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-[#1a2e28]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2D5B4F]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#543826]/30 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              Limited-Time Flu Season Offers
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">Dubai Flu Season Offers</h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {OFFERS.map((offer, i) => (
              <FadeIn key={offer.title} delay={i * 0.08}>
                <div className="wpd-glass-dark rounded-2xl overflow-hidden h-full flex flex-col">
                  <Link href={offer.href} className="relative aspect-[16/10] overflow-hidden block">
                    {offer.image && <Image src={offer.image} alt={offer.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                      {offer.badge}
                    </span>
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-white text-base mb-1.5">{offer.title}</h3>
                    <p className="text-white/60 text-xs leading-relaxed mb-4 flex-1">{offer.desc}</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-white font-bold text-lg">AED {offer.price}</span>
                      <span className="text-white/50 text-xs line-through">AED {offer.originalPrice}</span>
                    </div>
                    <a href={waLink(`Hi Nordic! I'd like to book "${offer.title}" (Dubai Flu Season offer).`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 bg-white text-[#1a2e28] font-semibold px-5 py-2.5 rounded-full text-xs hover:bg-white/90 transition">
                      Book Now <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.28} className="mt-6">
            <div className="wpd-glass-dark rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Info className="w-6 h-6 text-[#D4A373]" />
              </div>
              <p className="text-white/75 text-sm leading-relaxed flex-1">
                Feeling run down or dehydrated? Explore Nordic&rsquo;s at-home IV wellness options, subject to clinical assessment and suitability — not a treatment or cure for influenza.
              </p>
              <Link href="/iv-therapy" className="shrink-0 inline-flex items-center justify-center gap-1.5 bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-full text-xs hover:bg-white/15 transition whitespace-nowrap">
                Explore IV Wellness
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 9. FAQ */}
      <section id="faq" className="bg-white py-14 sm:py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <FadeIn className="mb-10 text-center">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28]">Flu Season Questions, Answered</h2>
          </FadeIn>
          <div className="space-y-2">
            {FAQS.map(({ q, a }, i) => <FaqItem key={q} q={q} a={a} idx={i} />)}
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section id="book" className="py-14 sm:py-20 px-6 pb-16 sm:pb-24">
        <div className="max-w-[900px] mx-auto">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[32px] px-5 sm:px-14 py-10 sm:py-20 text-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e28] via-[#20362f] to-[#543826]" />
              <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
              <div className="absolute -top-32 -left-20 w-80 h-80 bg-[#D4A373]/25 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[#543826]/40 rounded-full blur-3xl" />

              <div className="relative">
                <ShieldCheck className="w-10 h-10 text-[#D4A373] mx-auto mb-6" />
                <h2 className="font-bold text-white mb-3 leading-tight" style={{ fontSize: "clamp(26px, 4vw, 44px)" }}>
                  Protect Your Health This Flu Season
                </h2>
                <p className="text-white/75 text-base sm:text-lg mb-9 max-w-md mx-auto leading-relaxed">
                  Get convenient healthcare services at home with Nordic Home Healthcare Center.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
                  <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-[#543826] font-bold px-9 py-4 rounded-full text-sm shadow-lg hover:scale-[1.03] transition-all duration-300">
                    <CheckCircle2 className="w-4 h-4" /> Book Your Flu Service
                  </a>
                  <a href={waLink(GENERAL_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-9 py-4 rounded-full text-sm shadow-lg transition-all duration-300">
                    <WhatsAppIcon /> WhatsApp Us
                  </a>
                </div>
                <p className="text-white/40 text-xs mt-8 flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> DHA-licensed nurses &middot; All Dubai &middot; At your doorstep
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Sticky mobile offer bar */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 wpd-glass-dark flex items-center justify-between gap-3 px-4 py-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">FLU SEASON</span>
          <span className="text-white text-xs font-semibold truncate">Book Your Flu Service</span>
        </div>
        <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-white text-[#1a2e28] font-bold px-4 py-2 rounded-full text-xs shrink-0">
          Book Now
        </a>
      </div>

    </div>
  );
}
