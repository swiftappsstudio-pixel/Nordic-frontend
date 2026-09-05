"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Activity,
  Award,
  Battery,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplet,
  Gift,
  Heart,
  Home as HomeIcon,
  Info,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Syringe,
  TestTube,
  Zap,
} from "lucide-react";
import { getCategoryByLink } from "@/app/_common/api";
import { CategoryWithServices, Service } from "@/app/_common/interfaces";

// ─── Config ───────────────────────────────────────────────────────────────
const WA_NUM = "971581649910";
const BOOK_MSG = encodeURIComponent(
  "Hi Nordic! I'd like to book the NAD+ / Glutathione / Vitamin C IV offer (40% off)."
);
const GENERAL_MSG = encodeURIComponent(
  "Hi Nordic! I'd like to learn more about your NAD+, Glutathione & Vitamin C IV drips."
);
const PACKAGE_MSG = encodeURIComponent(
  "Hi Nordic! I'd like a personalized IV package recommendation for my body's needs."
);
const waLink = (msg: string) => `https://wa.me/${WA_NUM}?text=${msg}`;

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

// ─── Section data ───────────────────────────────────────────────────────────
const TRIO = [
  {
    name: "NAD+",
    Icon: Battery,
    title: "Cellular Energy & Repair",
    desc: "NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme found in every cell, essential for energy production and cellular repair. Levels naturally decline with age and stress — replenishing it intravenously may support energy, mental clarity, and healthy aging.",
  },
  {
    name: "Glutathione",
    Icon: Sparkles,
    title: "The Master Antioxidant",
    desc: "Glutathione is one of the body's most powerful antioxidants, produced naturally in the liver. It supports the body's detox pathways and helps neutralize free radicals — support that may show up as brighter, more even-toned skin over time.",
  },
  {
    name: "Vitamin C",
    Icon: Sun,
    title: "Immunity & Collagen Support",
    desc: "Vitamin C (Ascorbic Acid) is an essential nutrient that supports immune function and collagen production. Delivered intravenously at a high dose, it reaches your bloodstream directly rather than passing through digestion first.",
  },
];

const BENEFITS = [
  { title: "Increases Energy & Focus", desc: "Support for mental clarity and reduced fatigue, commonly reported after NAD+ infusions.", Icon: Zap },
  { title: "Supports Immunity & Liver Health", desc: "Vitamin C and Glutathione work together to support your immune system and the liver's natural detox pathways.", Icon: ShieldCheck },
  { title: "Promotes Anti-Aging & Skin Brightness", desc: "Antioxidant support that may help even out tone and support a healthy glow over time.", Icon: Sparkles },
  { title: "Powerful Antioxidant Protection", desc: "Helps neutralize free radicals and reduce oxidative stress at the cellular level.", Icon: Activity },
  { title: "Cellular Repair & Vitality", desc: "NAD+ plays a role in how your cells repair and produce energy day to day.", Icon: Brain },
  { title: "Better Sleep Quality", desc: "Many clients report more restorative sleep as oxidative load is reduced.", Icon: Moon },
];

const WHO_FOR = [
  "Adults looking for an energy and focus boost",
  "Those wanting support for skin radiance and tone",
  "People seeking extra immune system support",
  "Anyone interested in supporting healthy aging",
  "Those recovering from travel fatigue or a demanding week",
  "Not recommended during pregnancy or breastfeeding",
];

const JOURNEY = [
  { n: 1, title: "Book Your Session", desc: "Choose a single session or a multi-session package, and pick a time that suits you.", video: "/videos/iv-glutathione/clip-1.mp4" },
  { n: 2, title: "We Come To You", desc: "A DHA-licensed nurse arrives at your home with sterile, single-use equipment — no clinic visit needed.", video: "/videos/iv-glutathione/clip-2.mp4" },
  { n: 3, title: "Relax During Your Infusion", desc: "Your drip runs over roughly 30–75 minutes while you relax in your own space." },
  { n: 4, title: "Aftercare & Results", desc: "Your nurse monitors you throughout and shares simple aftercare guidance before they leave." },
];

const WHY_NORDIC = [
  { title: "Professional IV Therapy", desc: "Your treatment in the comfort of your own home — no clinic visits needed.", Icon: HomeIcon },
  { title: "Specialized Techniques", desc: "Advanced protocols tailored to your unique wellness goals.", Icon: Activity },
  { title: "DHA-Certified Nurses", desc: "Every treatment is guided by licensed professionals who put your safety first.", Icon: ShieldCheck },
  { title: "Comfort-Driven Experience", desc: "Relaxing sessions designed for your comfort, with consistent, careful care.", Icon: Heart },
];

const PACKAGES = [
  { sessions: "1 Session", price: 479 as number | null, note: "40% OFF", extra: null as string | null },
  { sessions: "Buy 2, Get 1 FREE", price: null, note: "Most Popular", extra: "+ More Discount" },
];

const FAQS = [
  { q: "What is NAD+, and how is it different from Glutathione or Vitamin C?", a: "NAD+ is a coenzyme that supports cellular energy production and repair, while Glutathione is an antioxidant focused on detox and skin brightness, and Vitamin C supports immunity and collagen. They work well together, but each can also be booked on its own depending on your goals." },
  { q: "What is IV Glutathione + Vitamin C and how does it work?", a: "Glutathione + Vitamin C is an intravenous therapy that delivers a potent combination of antioxidants directly into the bloodstream, bypassing digestion. Glutathione supports the body's detox pathways and helps reduce oxidative stress, while Vitamin C supports immunity and collagen production." },
  { q: "What are the key ingredients in the IV Glutathione + Vitamin C drip?", a: "The formula uses Glutathione 1200mg and Ascorbic Acid (Vitamin C) 2500mg." },
  { q: "Who can benefit from these IV drips?", a: "These therapies may benefit individuals looking to support detoxification, skin radiance, immunity, energy, or general wellness — the right combination depends on your goals, so we're happy to help you choose on WhatsApp." },
  { q: "How do I schedule an at-home session in Dubai?", a: "Scheduling is simple — book through Nordic's website, WhatsApp, or by calling us. Select your preferred date and time, and our team will confirm your booking." },
  { q: "How often is it recommended to take these IV drips?", a: "We generally recommend a gap of 3–5 days between sessions, though this can vary — your nurse can advise based on your goals." },
  { q: "Is it safe during pregnancy or breastfeeding?", a: "These IV therapies are not recommended during pregnancy or breastfeeding." },
  { q: "What safety measures are followed during administration?", a: "Our team follows strict DHA protocols, including reviewing your medical history, using sterile single-use equipment, monitoring you during the drip, and providing aftercare guidance." },
  { q: "Are there any side effects?", a: "Most people tolerate these IVs very well. Some may notice mild nausea, a metallic taste, or brief discomfort at the injection site — effects that typically resolve quickly." },
];

function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl transition-all duration-300 ${open ? "bg-[#543826]/5 shadow-sm" : "bg-transparent"}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 text-left group px-4 py-4">
        <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${open ? "bg-[#543826] text-white" : "bg-[#543826]/10 text-[#543826]"}`}>{String(idx + 1).padStart(2, "0")}</span>
        <span className="text-[#1a2e28] text-sm font-medium leading-snug group-hover:text-[#2D5B4F] transition-colors flex-1">{q}</span>
        <span className="shrink-0 w-6 h-6 flex items-center justify-center">
          <svg className={`w-4 h-4 transition-all duration-300 ${open ? "rotate-180 text-[#543826]" : "text-[#543826]/40"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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

// ─── Real, bookable services for this category (unchanged data source) ────
function ServiceCard({ svc }: { svc: Service }) {
  return (
    <Link href={`/services/${svc._id}`} className="group wpd-glass rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300">
      <div className="relative h-40 overflow-hidden bg-[#543826]/5">
        {svc.images?.[0] ? (
          <Image src={svc.images[0]} alt={svc.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TestTube className="w-10 h-10 text-[#543826]/25" />
          </div>
        )}
        {svc.discountPrice && svc.actualPrice && (
          <div className="absolute top-3 right-3 bg-[#543826] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">Best Offer</div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[#1a2e28] text-base leading-snug mb-2">{svc.title}</h3>
        {svc.description && <p className="text-[#6B7280] text-xs leading-relaxed line-clamp-2 mb-4 flex-1">{svc.description}</p>}
        <div className="mb-4">
          {svc.discountPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#1a2e28]">AED {svc.discountPrice}</span>
              <span className="text-sm text-[#6B7280]/60 line-through font-normal">AED {svc.actualPrice}</span>
            </div>
          ) : svc.actualPrice ? (
            <span className="text-xl font-bold text-[#1a2e28]">AED {svc.actualPrice}</span>
          ) : (
            <span className="text-sm text-[#543826] font-semibold">Contact for pricing</span>
          )}
        </div>
        <span className="w-full bg-[#543826] group-hover:bg-[#3e2a1c] text-white font-semibold py-2.5 rounded-xl transition text-sm text-center">Book Now</span>
      </div>
    </Link>
  );
}

function CategoryServicesSection() {
  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryByLink("iv-glutathione")
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-[#543826]/20 border-t-[#543826] rounded-full animate-spin" />
      </div>
    );
  }

  if (!categories.length || !categories.some((cat) => cat.services?.length > 0)) return null;

  return (
    <div className="mt-14">
      {categories.map((cat) => (
        cat.services.length > 0 && (
          <div key={cat._id} className="mb-10">
            <FadeIn className="text-center mb-8">
              <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-1.5">More Ways To Book</p>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1a2e28]">{cat.name}</h3>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.services.map((svc) => (
                <FadeIn key={svc._id}><ServiceCard svc={svc} /></FadeIn>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function IVGlutathionePage() {
  const [heroData, setHeroData] = useState<CategoryWithServices | null>(null);
  const { ref: spotlightRef, handleMove } = useSpotlight();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const shineY = useTransform(scrollYProgress, [0, 1], [0, 160]);

  useEffect(() => {
    getCategoryByLink("iv-glutathione")
      .then((data) => { if (data?.length) setHeroData(data[0]); })
      .catch(() => {});
  }, []);

  const bookHref = heroData?.services?.[0]?._id ? `/services/${heroData.services[0]._id}` : null;

  return (
    <div className="bg-white min-h-screen font-sans pb-20 lg:pb-0">

      {/* 1. HERO */}
      <section
        ref={heroRef}
        onMouseMove={handleMove}
        className="relative min-h-[100svh] sm:min-h-[92vh] flex items-center overflow-hidden bg-[#0d1a16]"
      >
        <video autoPlay muted loop playsInline poster="/images/Immune-Boost-Hydration-B.webp" className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/iv-glutathione/clip-5.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a16]/85 via-[#0d1a16]/55 to-[#0d1a16]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a16]/75 via-[#0d1a16]/20 to-[#0d1a16]/60" />
        <div ref={spotlightRef} className="absolute inset-0 wpd-spotlight mix-blend-overlay pointer-events-none" />
        <motion.div
          style={{ y: shineY }}
          className="absolute -inset-x-10 -top-1/2 h-[180%] rotate-6 bg-gradient-to-b from-white/12 via-white/0 to-transparent pointer-events-none"
        />

        <div className="hidden lg:block absolute top-[18%] right-[8%] wpd-floating">
          <div className="wpd-glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <Battery className="w-4 h-4 text-[#D4A373]" />
            <span className="text-white text-xs font-semibold whitespace-nowrap">NAD+ Cellular Energy</span>
          </div>
        </div>
        <div className="hidden lg:block absolute bottom-[26%] right-[14%] wpd-floating-slow">
          <div className="wpd-glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
            <span className="text-white text-xs font-semibold whitespace-nowrap">DHA Licensed Nurses</span>
          </div>
        </div>
        <div className="hidden lg:block absolute top-[42%] left-[6%] wpd-floating">
          <div className="wpd-glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <HomeIcon className="w-4 h-4 text-[#D4A373]" />
            <span className="text-white text-xs font-semibold whitespace-nowrap">At Your Doorstep</span>
          </div>
        </div>

        <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-8 w-full pt-32 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 flex justify-center">
            <span className="wpd-glass-dark inline-flex items-center gap-2 text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] px-4 sm:px-5 py-2.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              Nordic Home Healthcare &middot; Limited Nordic Deal
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-bold text-white leading-[1.08] mb-5" style={{ fontSize: "clamp(28px, 4.8vw, 54px)" }}>
            NAD+ &middot; Glutathione &middot; <span className="text-[#D4A373]">Vitamin C</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="text-white/75 max-w-xl mx-auto mb-7 text-base sm:text-lg leading-relaxed">
            Heal &amp; restore your body with natural care — boost your energy, immunity &amp; glow with our powerful IV drip trio, delivered at home in Dubai.
          </motion.p>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.24 }} className="flex justify-center mb-7">
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-extrabold uppercase tracking-wide px-6 py-2.5 rounded-full shadow-lg"
              style={{ fontSize: "clamp(16px, 2.4vw, 22px)" }}
            >
              Get 40% Off
            </motion.span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto mb-9">
            {["Increases energy & focus", "Supports immunity & liver health", "Promotes anti-aging & skin brightness"].map((t) => (
              <div key={t} className="wpd-glass-dark rounded-xl px-3 py-2.5 flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span className="text-white text-xs font-medium leading-snug">{t}</span>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.36 }} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-6 max-w-sm sm:max-w-none mx-auto">
            <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-7 sm:px-8 py-3.5 rounded-full text-sm transition-all shadow-lg hover:scale-[1.03]">
              Book Your IV Session
            </a>
            <a href={waLink(GENERAL_MSG)} target="_blank" rel="noopener noreferrer" className="wpd-glass-dark inline-flex items-center justify-center gap-2 text-white font-semibold px-7 sm:px-8 py-3.5 rounded-full text-sm transition-all hover:scale-[1.03]">
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              WhatsApp Us
            </a>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }} className="text-white/55 text-xs">
            <Gift className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-[#D4A373]" />
            Buy 2, Get 1 Free &mdash; plus more packages tailored to your body&rsquo;s needs
          </motion.p>
        </div>
      </section>


      {/* 2. OFFER RECAP */}
      <section id="offer" className="relative pt-4 pb-14 sm:pb-20 px-6 lg:px-8 overflow-hidden bg-[#F7F4EE]">
        <div className="absolute -top-10 -left-24 w-96 h-96 bg-[#D4A373]/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#2D5B4F]/12 rounded-full blur-3xl" />
        <div className="relative max-w-[880px] mx-auto">
          <FadeIn>
            <div className="wpd-glass rounded-[32px] p-6 sm:p-12 text-center relative overflow-hidden">
              <div className="wpd-shine" />
              <motion.span
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
                className="absolute top-5 right-5 sm:top-7 sm:right-7 inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md"
              >
                40% OFF
              </motion.span>

              <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-5">A Trusted Leader In Home Healthcare Across The UAE</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-4">
                Heal &amp; Restore Your Body With Natural Care
              </h2>
              <p className="text-[#6B7280] text-base leading-relaxed mb-9 max-w-xl mx-auto">
                Boost your energy, immunity &amp; glow with our powerful IV drip trio — NAD+, Glutathione, and Vitamin C — delivered straight to your door in Dubai.
              </p>

              <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-9 py-4 rounded-full text-sm transition-all shadow-lg hover:scale-[1.03]">
                Get The Offer <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. THE TRIO — WHAT IS IT */}
      <section id="trio" className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white to-[#F7F4EE]">
        <div className="absolute top-10 -right-20 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#2D5B4F]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">What Is It</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-4">Meet The IV Drip Trio</h2>
            <p className="text-[#6B7280] text-base max-w-2xl mx-auto leading-relaxed">
              Three well-known nutrients, delivered directly into your bloodstream for fast, high-dose absorption — bookable individually or together.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TRIO.map(({ name, title, desc, Icon }, i) => (
              <FadeIn key={name} delay={i * 0.1}>
                <div className="wpd-glass rounded-2xl p-7 h-full hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#543826] to-[#2D5B4F] flex items-center justify-center mb-5 shadow-md">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-[#543826] text-xs font-bold uppercase tracking-widest mb-1.5">{name}</p>
                  <h3 className="font-bold text-[#1a2e28] text-lg mb-2.5">{title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2} className="mt-8">
            <div className="wpd-glass rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-[#543826]/10 flex items-center justify-center shrink-0">
                <Droplet className="w-7 h-7 text-[#543826]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1a2e28] text-base mb-1.5">How Does It Work?</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  An IV infusion delivers nutrients directly into your bloodstream, bypassing the digestive system entirely — so little is lost along the way. A DHA-licensed nurse inserts a small IV line, and your drip runs over roughly 30–75 minutes while you relax at home.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. BENEFITS */}
      <section id="benefits" className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-[#F7F4EE]">
        <div className="absolute top-10 right-0 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D5B4F]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Potential Benefits</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">Commonly Discussed Benefits</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map(({ title, desc, Icon }, i) => (
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

          {/* Who may consider */}
          <FadeIn delay={0.15} className="mt-8">
            <div className="wpd-glass rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-[#1a2e28] text-lg mb-5">Who May Consider This Treatment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {WHO_FOR.map((w) => (
                  <div key={w} className="flex items-start gap-2.5">
                    <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-[#543826]/10 text-[#543826] flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                    <span className="text-[#1a2e28] text-sm font-medium leading-snug">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. SESSION JOURNEY */}
      <section className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-white">
        <div className="absolute top-10 -right-20 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">What To Expect</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">Your Session, Start To Finish</h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {JOURNEY.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.08}>
                <div className="wpd-glass rounded-2xl overflow-hidden h-full flex flex-col">
                  {step.video ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                        <source src={step.video} type="video/mp4" />
                      </video>
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

      {/* 6. REAL EXPERIENCE GALLERY */}
      <section className="py-14 sm:py-20 px-6 lg:px-8 bg-[#F7F4EE]">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Delivered At Home</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">See The Experience</h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
            <FadeIn>
              <div className="wpd-glass rounded-[24px] p-2.5">
                <div className="relative rounded-[18px] overflow-hidden aspect-[4/5]">
                  <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                    <source src="/videos/iv-glutathione/clip-3.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="wpd-glass rounded-[24px] p-2.5">
                <div className="relative rounded-[18px] overflow-hidden aspect-[4/5]">
                  <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                    <source src="/videos/iv-glutathione/clip-4.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="flex justify-center">
            <FadeIn className="sm:rotate-[-2deg]">
              <div className="wpd-glass rounded-2xl p-2.5 w-[220px] sm:w-[280px] hover:rotate-0 transition-transform duration-300">
                <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
                  <Image src="/images/iv-glutathione/campaign-flyer.jpg" alt="Nordic Home Healthcare — NAD+, Glutathione & Vitamin C campaign" fill sizes="280px" className="object-cover" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 7. PACKAGES */}
      <section id="packages" className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-white">
        <div className="absolute top-10 right-0 w-80 h-80 bg-[#543826]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D5B4F]/10 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-4">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Packages</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-4">Choose Your Package</h2>
            <p className="text-[#6B7280] text-base max-w-2xl mx-auto leading-relaxed">
              Start with a single session at 40% off, or save more with Buy 2 Get 1 Free — plus additional packages and combinations (including NAD+) tailored to your body&rsquo;s needs.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10 max-w-[640px] mx-auto">
            {PACKAGES.map((pkg, i) => (
              <FadeIn key={pkg.sessions} delay={i * 0.07}>
                <div className={`relative rounded-2xl p-6 h-full flex flex-col text-center ${pkg.note ? "wpd-glass ring-2 ring-[#D4A373]" : "wpd-glass"}`}>
                  {pkg.note && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                      {pkg.note}
                    </span>
                  )}
                  <Gift className="w-6 h-6 text-[#543826] mx-auto mb-3 mt-2" />
                  <p className="text-[#1a2e28] font-bold text-sm mb-2">{pkg.sessions}</p>
                  {pkg.price != null ? (
                    <p className="text-[#1a2e28] font-extrabold mb-4" style={{ fontSize: "clamp(26px, 3vw, 34px)" }}>
                      AED {pkg.price}
                    </p>
                  ) : (
                    <p className="text-[#543826] font-extrabold mb-4" style={{ fontSize: "clamp(18px, 2.2vw, 22px)" }}>
                      {pkg.extra}
                    </p>
                  )}
                  <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center gap-1.5 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-5 py-2.5 rounded-full text-xs transition-all">
                    Book Now
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2} className="mt-8">
            <div className="wpd-glass rounded-2xl p-6 sm:p-8 max-w-[640px] mx-auto flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#543826]/10 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-[#543826]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#1a2e28] text-base mb-1">More Packages, Tailored To Your Body&rsquo;s Needs</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">Additional multi-session bundles and NAD+ combinations are available with extra discounts — message us for a personalized recommendation and pricing.</p>
              </div>
              <a href={waLink(PACKAGE_MSG)} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center justify-center gap-1.5 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-5 py-2.5 rounded-full text-xs transition-all whitespace-nowrap">
                Ask On WhatsApp
              </a>
            </div>
          </FadeIn>

          {/* Real, bookable services pulled from the category (unchanged) */}
          <CategoryServicesSection />
        </div>
      </section>

      {/* 8. WHY CHOOSE NORDIC */}
      <section className="relative py-14 sm:py-20 px-6 lg:px-8 overflow-hidden bg-[#1a2e28]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2D5B4F]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#543826]/30 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#D4A373] text-xs font-semibold uppercase tracking-widest mb-3">Why Choose Nordic</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">At-Home IV Infusions, Done Right</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_NORDIC.map(({ title, desc, Icon }, i) => (
              <FadeIn key={title} delay={i * 0.07}>
                <div className="wpd-glass-dark rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4A373] to-[#543826] flex items-center justify-center mb-4 shadow-md">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1.5">{title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SAFETY INFORMATION */}
      <section className="py-14 sm:py-16 px-6 lg:px-8 bg-[#F7F4EE]">
        <div className="max-w-[900px] mx-auto">
          <FadeIn>
            <div className="wpd-glass rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-5">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Info className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-[#1a2e28] text-base mb-2">Important Safety Information</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  These IV therapies are not recommended during pregnancy or breastfeeding and may not be suitable for everyone. Our nurses review your medical history before every session, follow strict DHA protocols, and monitor you throughout your infusion. This page is for general information only and is not a substitute for professional medical advice — please consult your doctor if you have underlying health conditions.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="bg-white py-14 sm:py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <FadeIn className="mb-10 text-center">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28]">Questions? Answers.</h2>
          </FadeIn>
          <div className="space-y-2">
            {FAQS.map(({ q, a }, i) => <FaqItem key={q} q={q} a={a} idx={i} />)}
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="py-14 sm:py-20 px-6 pb-16 sm:pb-24">
        <div className="max-w-[900px] mx-auto">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[32px] px-5 sm:px-14 py-10 sm:py-20 text-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e28] via-[#20362f] to-[#543826]" />
              <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
              <div className="absolute -top-32 -left-20 w-80 h-80 bg-[#D4A373]/25 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[#543826]/40 rounded-full blur-3xl" />

              <div className="relative">
                <Syringe className="w-10 h-10 text-[#D4A373] mx-auto mb-6" />
                <h2 className="font-bold text-white mb-3 leading-tight" style={{ fontSize: "clamp(26px, 4vw, 44px)" }}>
                  Feel The Difference, From The Inside Out.
                </h2>
                <p className="text-white/75 text-base sm:text-lg mb-9 max-w-md mx-auto leading-relaxed">
                  40% off NAD+, Glutathione &amp; Vitamin C — plus Buy 2 Get 1 Free and more packages tailored to your body&rsquo;s needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
                  {bookHref ? (
                    <Link href={bookHref} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-[#543826] font-bold px-9 py-4 rounded-full text-sm shadow-lg hover:scale-[1.03] transition-all duration-300">
                      Book Your IV Session
                    </Link>
                  ) : (
                    <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-[#543826] font-bold px-9 py-4 rounded-full text-sm shadow-lg hover:scale-[1.03] transition-all duration-300">
                      Book Your IV Session
                    </a>
                  )}
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

      {/* Sticky mobile offer bar — keeps the offer visible while scrolling */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 wpd-glass-dark flex items-center justify-between gap-3 px-4 py-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">40% OFF</span>
          <span className="text-white text-xs font-semibold truncate">NAD+ &middot; Glutathione &middot; Vitamin C</span>
        </div>
        <a href={waLink(BOOK_MSG)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-white text-[#1a2e28] font-bold px-4 py-2 rounded-full text-xs shrink-0">
          Book Now
        </a>
      </div>

    </div>
  );
}
