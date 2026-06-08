"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServices } from "@/app/_common/api";
import { Service } from "@/app/_common/interfaces";

// ─── Config ────────────────────────────────────────────────────────────────
const WA_NUM = "971555828945";
const WA_MSG = encodeURIComponent("Hi Nordic! I'd like to book an IV Therapy session at home in Dubai.");
const CALL_NUM = "tel:+971555828945";

// ─── Static Data ───────────────────────────────────────────────────────────
const BENEFITS = [
  {
    title: "Instant Hydration",
    desc: "Rapid cellular rehydration — up to 3× faster than drinking fluids orally.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Increased Energy",
    desc: "B-vitamins and essential minerals replenish your natural energy at the cellular level.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Stronger Immunity",
    desc: "High-dose Vitamin C, zinc and antioxidants fortify your immune defences.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Better Skin & Glow",
    desc: "Glutathione and collagen-boosting nutrients improve skin brightness from within.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
      </svg>
    ),
  },
  {
    title: "Improved Focus",
    desc: "Magnesium, NAD+ and amino acids sharpen mental clarity and reduce brain fog.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Treatment at Home",
    desc: "A DHA-licensed nurse arrives at your door within 30–60 minutes, anywhere in Dubai.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
];

const HOW_STEPS = [
  { num: "01", title: "Book in Seconds", desc: "Select your IV drip, choose a date and time that works for you — online or via WhatsApp." },
  { num: "02", title: "Quick Assessment", desc: "Our team does a brief health check to ensure the right formula for your needs." },
  { num: "03", title: "Nurse Arrives", desc: "A DHA-licensed nurse comes to your home, hotel, or office within 30–60 minutes." },
  { num: "04", title: "Feel the Difference", desc: "Sit back and let the drip work. Most clients feel results within the hour." },
];

const COMPARISON = [
  { nordic: "Treatment at your location", clinic: "Travel to clinic required" },
  { nordic: "DHA Licensed nurses", clinic: "Varies by provider" },
  { nordic: "Available 24 / 7", clinic: "Limited clinic hours" },
  { nordic: "Personalised care", clinic: "Standardised protocols" },
  { nordic: "Book in under 2 minutes", clinic: "Long waiting times" },
  { nordic: "Home, Hotel & Office", clinic: "Clinic only" },
];

const BEFORE_AFTER = [
  { before: "Fatigue & Low Energy", after: "Energised & Revitalised" },
  { before: "Dehydration", after: "Fully Hydrated" },
  { before: "Weakened Immunity", after: "Strong Immune Defence" },
  { before: "Brain Fog", after: "Sharp Mental Clarity" },
];

const FAQS = [
  { q: "How long does an IV therapy session take?", a: "Most sessions take between 30 and 60 minutes depending on the formula. You can relax at home while the drip works." },
  { q: "Is IV therapy safe?", a: "Yes. All sessions are conducted by DHA-licensed nurses using pharmaceutical-grade ingredients. A brief health assessment is done before every session." },
  { q: "Can I book at my home, hotel, or office?", a: "Absolutely. We deliver IV therapy to any location across Dubai — home, hotel room, or workplace." },
  { q: "Which IV drip is best for energy?", a: "Our NAD+ IV Therapy and Energy Boost drip are most popular for instant energy, mental clarity, and stamina." },
  { q: "Do you offer same-day appointments?", a: "Yes, subject to availability. WhatsApp us for the fastest booking confirmation." },
  { q: "What areas of Dubai do you cover?", a: "We cover all areas including Dubai Marina, JBR, Downtown, Palm Jumeirah, DIFC, Business Bay, JLT, and more." },
];

const REVIEWS = [
  { name: "Sarah M.", area: "Dubai Marina", stars: 5, text: "The nurse arrived within 40 minutes and was incredibly professional. I felt energised within hours. Will definitely book again." },
  { name: "Ahmed K.", area: "Downtown Dubai", stars: 5, text: "Booked the Immunity Boost before a big work trip. The team was fast, professional and the process was seamless." },
  { name: "Priya R.", area: "Palm Jumeirah", stars: 5, text: "I was exhausted and this completely turned my day around. The convenience of having it done at home is unbeatable." },
  { name: "James T.", area: "DIFC", stars: 5, text: "I have tried several IV therapy services in Dubai. Nordic is by far the most professional and reliable option." },
];

// ─── Reusable UI pieces ────────────────────────────────────────────────────
function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-4 h-4 ${i <= n ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${open ? "border-[#543826]/30 bg-[#543826]/2" : "border-gray-200 bg-white"}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left">
        <span className="font-semibold text-gray-900 text-sm pr-8">{q}</span>
        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${open ? "bg-[#543826] text-white rotate-45" : "bg-gray-100 text-gray-500"}`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      {open && <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">{a}</div>}
    </div>
  );
}

function WaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511" />
    </svg>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function IVTherapyPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loadingSvc, setLoadingSvc] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getServices()
      .then((all) => {
        const iv = all.filter((s) =>
          s.title.toLowerCase().includes("iv") ||
          s.title.toLowerCase().includes("drip") ||
          s.title.toLowerCase().includes("boost") ||
          s.title.toLowerCase().includes("hydration") ||
          s.title.toLowerCase().includes("glutathione") ||
          s.title.toLowerCase().includes("nad") ||
          s.category?.toLowerCase().includes("iv")
        );
        setServices(iv.length > 0 ? iv : all.slice(0, 8));
      })
      .catch(() => setServices([]))
      .finally(() => setLoadingSvc(false));
  }, []);

  const scrollToServices = () =>
    servicesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const categories: string[] = ["All", ...Array.from(new Set(services.map((s) => s.category).filter(Boolean) as string[]))];
  const filteredServices = activeCategory === "All" ? services : services.filter((s) => s.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex items-center bg-[#0f0a07] overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <Image src="/images/Immune-Boost-Hydration-B.webp" alt="IV Therapy at Home Dubai" fill className="object-cover opacity-30" unoptimized priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a07] via-[#0f0a07]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
          <div className="max-w-2xl">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 border border-white/20 text-white/70 text-xs font-medium px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              Limited Time —  Selected IV Therapies
            </div>

            <h1 className="font-bold text-white leading-[1.08] tracking-tight mb-5" style={{ fontSize: "clamp(30px, 6vw, 72px)" }}>
              IV Therapy<br />
              <span className="text-[#C9C3B3]">at Home</span><br />
              <span className="text-3xl sm:text-4xl font-normal text-white/60">in Dubai</span>
            </h1>

            <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-lg">
              DHA-Licensed nurses deliver premium IV drips to your <strong className="text-white/90 font-semibold">home, hotel, or office</strong> across Dubai — in as little as 30 minutes.
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2 mb-9">
              {["Available 24 / 7", "DHA Licensed Nurses", "30–60 Min Arrival", "All Dubai Areas"].map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-xs text-white/75 bg-white/8 border border-white/12 px-3.5 py-1.5 rounded-full font-medium">
                  <svg className="w-3 h-3 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button onClick={scrollToServices} className="inline-flex items-center justify-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-8 py-4 rounded-full text-base transition-all hover:shadow-lg hover:shadow-[#543826]/25">
                Book IV Therapy
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-full text-base transition-all backdrop-blur-sm">
                <WaIcon className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRow n={5} />
              <span className="text-white font-semibold text-sm">4.9</span>
              <span className="text-white/30 text-sm">/</span>
              <span className="text-white/50 text-sm">500+ bookings across Dubai</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════ */}
      <section className="bg-[#543826]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-2">
            {["DHA License No. 3171506", "500+ Happy Clients", "All Dubai Areas Covered", "Pharmaceutical-Grade Ingredients", "24 / 7 Availability", "Special Offer Today"].map((t) => (
              <span key={t} className="text-white/70 text-xs font-medium whitespace-nowrap">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BENEFITS
      ══════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-xl mb-14">
            <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Why IV Therapy?</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug">
              Feel the difference<br />from within
            </h2>
            <p className="text-gray-500 mt-4 text-base leading-relaxed">Intravenous nutrient delivery bypasses the digestive system for near-instant results that oral supplements simply cannot match.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#543826]/20 hover:shadow-lg transition-all duration-300 group">
                <div className="w-11 h-11 bg-[#543826]/8 rounded-xl flex items-center justify-center text-[#543826] mb-5 group-hover:bg-[#543826] group-hover:text-white transition-colors duration-300">
                  {b.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          IV DRIPS / SERVICES
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white" ref={servicesRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Our Menu</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Popular IV Drips</h2>
              <p className="text-gray-400 text-sm mt-2">All formulas prepared by licensed pharmacists · Administered by DHA-certified nurses</p>
            </div>
            <Link href="/services" className="shrink-0 text-sm font-semibold text-[#543826] hover:text-[#3e2a1c] flex items-center gap-1 transition-colors">
              View all services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {loadingSvc ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#543826]/20 border-t-[#543826] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {categories.length > 2 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        activeCategory === cat
                          ? "bg-[#543826] text-white shadow-sm"
                          : "bg-[#F7EEE0] text-[#543826] hover:bg-[#543826]/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredServices.map((svc) => (
                <div key={svc._id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col">
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
                    {svc.images?.[0] ? (
                      <Image src={svc.images[0]} alt={svc.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#543826]/10 to-[#543826]/20 flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#543826]/30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                    )}
                    {svc.discountPrice && svc.actualPrice && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                        {Math.round(((svc.actualPrice - svc.discountPrice) / svc.actualPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    {svc.category && (
                      <span className="text-[10px] text-[#543826] font-semibold uppercase tracking-wider mb-1.5">{svc.category}</span>
                    )}
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{svc.title}</h3>
                    {svc.description && (
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">{svc.description}</p>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      {svc.discountPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-gray-900">AED {svc.discountPrice}</span>
                          <span className="text-sm text-gray-300 line-through font-normal">AED {svc.actualPrice}</span>
                        </div>
                      ) : svc.actualPrice ? (
                        <span className="text-xl font-bold text-gray-900">AED {svc.actualPrice}</span>
                      ) : null}
                    </div>

                    <button
                      onClick={() => router.push(`/services/${svc._id}`)}
                      className="w-full bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold py-2.5 rounded-xl transition text-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          OFFER BANNER
      ══════════════════════════════════════ */}
      <section className="py-16 bg-[#543826]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3 font-medium">Limited Time</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3">Up to <span className="text-[#C9C3B3]">40% Off</span></h2>
          <p className="text-white/60 text-base mb-7">On selected IV therapies. Book today before slots fill up.</p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["NAD+ IV Therapy", "Immunity Boost", "Energy Boost", "Hydration Therapy"].map((d) => (
              <span key={d} className="text-sm text-white/80 border border-white/20 px-4 py-2 rounded-full font-medium">{d}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={scrollToServices} className="inline-flex items-center justify-center gap-2 bg-white text-[#543826] font-bold px-8 py-4 rounded-full text-base hover:bg-[#C9C3B3] transition">
              Book Today & Save
            </button>
            <a href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent("Hi! I want to claim the 40% off IV therapy discount.")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1eb954] text-white font-bold px-8 py-4 rounded-full text-base transition">
              <WaIcon className="w-4 h-4" />
              Claim via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY NORDIC — COMPARISON
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Why Nordic?</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">We come to you</h2>
            <p className="text-gray-400 mt-3 text-base">No commute, no waiting room. Healthcare delivered on your terms.</p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="bg-[#543826] text-white text-sm font-semibold text-center py-4 px-6">Nordic Home Healthcare</div>
              <div className="bg-gray-50 text-gray-500 text-sm font-semibold text-center py-4 px-6 border-l border-gray-100">Typical Clinic</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.nordic} className={`grid grid-cols-1 sm:grid-cols-2 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                <div className="py-4 px-6 flex items-center gap-3 border-r border-gray-100">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm font-medium text-gray-800">{row.nordic}</span>
                </div>
                <div className="py-4 px-6 flex items-center gap-3">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  <span className="text-sm text-gray-400">{row.clinic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How it works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_STEPS.map((s, i) => (
              <div key={s.num} className="relative">
                {i < HOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(50%+3rem)] right-[-50%] h-px bg-gradient-to-r from-[#543826]/20 to-transparent" />
                )}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow h-full">
                  <div className="w-12 h-12 bg-[#543826] text-white rounded-2xl flex items-center justify-center font-bold text-base mb-5 shadow-sm shadow-[#543826]/20">
                    {s.num}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button onClick={scrollToServices} className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-10 py-4 rounded-full transition hover:shadow-lg hover:shadow-[#543826]/20">
              Book Your Session
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BEFORE & AFTER
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Transformation</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Before & After</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BEFORE_AFTER.map((row) => (
              <div key={row.before} className="flex rounded-2xl overflow-hidden border border-gray-100">
                <div className="flex-1 bg-gray-50 px-6 py-5">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Before</p>
                  <p className="text-sm font-semibold text-gray-600">{row.before}</p>
                </div>
                <div className="flex items-center px-3 bg-gray-100">
                  <svg className="w-4 h-4 text-[#543826]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
                <div className="flex-1 bg-[#543826]/5 px-6 py-5">
                  <p className="text-[10px] text-[#543826] font-semibold uppercase tracking-wider mb-2">After</p>
                  <p className="text-sm font-bold text-[#543826]">{row.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          REVIEWS
      ══════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Client Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Trusted across Dubai</h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <StarRow n={5} />
              <span className="font-bold text-gray-900 text-sm">4.9 / 5</span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-400 text-sm">Based on 500+ bookings</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                <StarRow n={r.stars} />
                <p className="text-gray-600 text-sm leading-relaxed mt-4 flex-1">&ldquo;{r.text}&rdquo;</p>
                <div className="border-t border-gray-100 mt-4 pt-4">
                  <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Frequently asked questions</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
          </div>
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm mb-4">Still have questions?</p>
            <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-semibold px-8 py-3 rounded-full transition text-sm">
              <WaIcon className="w-4 h-4" />
              Ask us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="py-24 bg-[#0f0a07] relative overflow-hidden pb-20 sm:pb-24">
        <div className="absolute inset-0">
          <Image src="/images/CTA!.jpg" alt="Book IV Therapy" fill className="object-cover opacity-15" unoptimized />
          <div className="absolute inset-0 bg-[#0f0a07]/60" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-5 font-medium">Book Today</p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight tracking-tight">
            Feel better,<br /><span className="text-[#C9C3B3]">faster.</span>
          </h2>
          <p className="text-white/50 text-base mb-10 leading-relaxed">
            DHA-licensed nurses · Premium IV drips · At your door within 30–60 min · All Dubai areas
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button onClick={scrollToServices} className="inline-flex items-center justify-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-10 py-4 rounded-full text-base transition hover:shadow-lg hover:shadow-[#543826]/25">
              Book IV Therapy
            </button>
            <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1eb954] text-white font-semibold px-10 py-4 rounded-full text-base transition">
              <WaIcon className="w-4 h-4" />
              WhatsApp Now
            </a>
          </div>
          <p className="text-white/20 text-xs">No subscription · Cash on Delivery · DHA License No. 3171506</p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STICKY MOBILE BAR
      ══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-gray-100 shadow-2xl">
        <div className="grid grid-cols-3">
          <a href={CALL_NUM} className="flex flex-col items-center justify-center py-3 gap-1 text-gray-600 hover:bg-gray-50 transition border-r border-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <span className="text-[10px] font-semibold">Call Now</span>
          </a>
          <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center py-3 gap-1 bg-[#25D366] text-white border-r border-[#1eb954] transition">
            <WaIcon className="w-5 h-5" />
            <span className="text-[10px] font-semibold">WhatsApp</span>
          </a>
          <button onClick={scrollToServices} className="flex flex-col items-center justify-center py-3 gap-1 bg-[#543826] text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-[10px] font-semibold">Book Now</span>
          </button>
        </div>
      </div>

      </div>
  );
}
