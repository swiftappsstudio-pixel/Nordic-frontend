"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getServicesByCategory, getCategories } from "@/app/_common/api";
import { Service } from "@/app/_common/interfaces";

// ─── Config ────────────────────────────────────────────────────────────────
const WA_NUM = "971555828945";
const WA_MSG = encodeURIComponent("Hi Nordic! I'd like to start my weight loss programme.");
const CALL_NUM = "tel:+971555828945";

// ─── Static Data ───────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    step: "Step 01",
    title: "Free Online Visit",
    desc: "Complete a brief online assessment about your health history, lifestyle, and goals — from the comfort of your home.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    step: "Step 02",
    title: "Video Consultation",
    desc: "Schedule a video consultation with a doctor for personalised care and medical guidance.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: "Step 03",
    title: "Personalised Medications",
    desc: "Receive prescription medications tailored to your unique health needs and weight loss goals.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    step: "Step 04",
    title: "Ongoing Support & Care",
    desc: "Enjoy unlimited doctor visits and ongoing support to help you stay on track and achieve your health goals.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

const PROGRAMME_CARDS = [
  {
    title: "Free online visit",
    desc: "Complete health history analysis",
    dark: true,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Science backed medications, delivered",
    desc: "To your home in partnership with the largest pharmacy chain in the UAE",
    dark: true,
    hasCta: true,
    hasImage: true,
  },
  {
    title: "Chat with your doctor anytime",
    desc: "Specialised doctors who know how weight management works",
    dark: true,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    title: "100% online and at-home care",
    desc: "Unlimited doctor visits and support all from your home",
    dark: true,
    hasChart: true,
  },
];

// ─── FAQ Item ──────────────────────────────────────────────────────────────
function WlFaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left gap-4 group">
        <span className="text-gray-800 text-sm font-medium group-hover:text-[#1a3a35] transition">{q}</span>
        <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <p className="mt-3 text-gray-400 text-sm leading-relaxed">{a}</p>}
    </div>
  );
}

// ─── Weight Calculator ─────────────────────────────────────────────────────
function WeightCalculator() {
  const [weight, setWeight] = useState(80);
  const lossPercent = 0.20;
  const potentialLoss = Math.round(weight * lossPercent);
  const needleAngle = Math.min((weight / 150) * 180 - 90, 90);

  return (
    <div className="bg-[#1a3a35] rounded-3xl p-8 text-white flex flex-col items-center">
      {/* Gauge */}
      <div className="relative w-52 h-28 mb-6">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Track */}
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" strokeLinecap="round" />
          {/* Ticks */}
          {Array.from({ length: 19 }).map((_, i) => {
            const angle = -180 + i * 10;
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 75 * Math.cos(rad);
            const y1 = 100 + 75 * Math.sin(rad);
            const x2 = 100 + 65 * Math.cos(rad);
            const y2 = 100 + 65 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />;
          })}
          {/* Needle */}
          <line
            x1="100" y1="100"
            x2={100 + 60 * Math.cos(((needleAngle - 90) * Math.PI) / 180)}
            y2={100 + 60 * Math.sin(((needleAngle - 90) * Math.PI) / 180)}
            stroke="white" strokeWidth="3" strokeLinecap="round"
            style={{ transition: "all 0.5s ease" }}
          />
          <circle cx="100" cy="100" r="5" fill="white" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">You can lose up to</p>
          <p className="text-3xl font-bold">{potentialLoss} <span className="text-lg font-normal">Kgs</span></p>
        </div>
      </div>

      {/* Slider */}
      <div className="w-full">
        <p className="text-xs text-white/50 uppercase tracking-wider text-center mb-3">Your present weight is</p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-[#2a4a45] rounded-full px-5 py-2 text-white font-bold text-lg">
            {weight} <span className="text-sm font-normal">Kgs</span>
          </div>
        </div>
        <input
          type="range" min={40} max={150} value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full accent-white cursor-pointer"
        />
        <div className="flex justify-between text-xs text-white/30 mt-1">
          <span>40 Kgs</span>
          <span>150 Kgs</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function WeightLossPage() {
  const medicationsRef = useRef<HTMLDivElement>(null);
  const scrollToMeds = () => medicationsRef.current?.scrollIntoView({ behavior: "smooth" });
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const categories = await getCategories();
        const wlCategory = categories.find((c) =>
          c.name.toLowerCase().includes("weight") || c.link?.replace(/^\/+/, "") === "weight-loss"
        );
        if (wlCategory) {
          const data = await getServicesByCategory(wlCategory._id);
          setServices(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-[#f5f0e8] min-h-screen">

      {/* ══════════════════════════════════════
          1. HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen bg-[#0d1f1c] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image src="/images/weight-loss.jpeg" alt="" fill className="object-cover opacity-30" priority />
        </div>
        <div className="absolute inset-0 bg-[#0d1f1c]/70 z-[1]" />
        {/* Spotlight effect */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#1a3a35]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.05] tracking-tight mb-8">
                Lose weight in<br />4 weeks with our<br />
                <span className="text-[#7ecdc4]">online weight loss<br />clinic</span>
              </h1>

              {/* Feature list */}
              <div className="space-y-4 mb-10">
                {[
                  { icon: "👤", text: "Personalised for each individual with long lasting results" },
                  { icon: "💊", text: "Prescription treatments proven by science" },
                  { icon: "📱", text: "24×7 access to care and doctors, 100% online, and over 1000+ satisfied users" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center text-sm shrink-0">
                      {item.icon}
                    </div>
                    <p className="text-white/70 text-xs leading-relaxed pt-1">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex">
                <a
                  href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-[#0d1f1c] font-bold px-8 py-4 rounded-full text-base hover:bg-[#f5f0e8] transition-all hover:shadow-lg"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511" />
                  </svg>
                  <span>WhatsApp us</span>
                </a>
              </div>

              <p className="text-white/30 text-xs mt-4">From AED 149 / month onwards</p>

              {/* Payment options */}
              <div className="flex gap-4 mt-6">
                {["tabby · Pay in 12 or 4 interest free payments", "tamara · Pay in 3 interest free payments"].map((p) => (
                  <div key={p} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <p className="text-white/50 text-[11px] leading-snug max-w-[130px]">{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — medication image */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f1c] via-transparent to-transparent z-10 pointer-events-none" />
             
              
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. MEDICATIONS
      ══════════════════════════════════════ */}
      {!loading && services.length > 0 && (
        <section className="py-24 bg-[#f5f0e8]" ref={medicationsRef}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 max-w-2xl leading-snug">
              Get access to original medications from the manufacturers
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map((s) => (
                <Link href={`/services/${s._id}`} key={s._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col">
                  <div className="h-44 bg-gray-50 flex items-center justify-center relative">
                    {s.images?.[0] ? (
                      <Image src={s.images[0]} alt={s.title} fill className="object-cover" unoptimized sizes="(max-width: 768px) 100vw, 25vw" />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-xl mb-3">{s.title}</h3>
                    {s.description && (
                      <p className="text-gray-500 text-xs leading-relaxed flex-1 mb-4 line-clamp-3">{s.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">From</p>
                        <p className="font-bold text-gray-900">
                          {s.discountPrice && s.actualPrice && s.discountPrice < s.actualPrice
                            ? `AED ${s.discountPrice}`
                            : s.actualPrice
                              ? `AED ${s.actualPrice}`
                              : "Contact us"}
                        </p>
                      </div>
                      <span
                        className="bg-[#1a3a35] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#0d1f1c] transition"
                      >
                        Learn more
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          3. CLINICAL RESULTS + CALCULATOR
      ══════════════════════════════════════ */}
      <section className="py-24 bg-[#f5f0e8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <p className="text-[#1a3a35] text-xs font-semibold uppercase tracking-widest mb-4">Clinical Results</p>
              <div className="mb-4">
                <p className="text-4xl font-bold text-gray-900">Lose up to</p>
                <p className="text-[7rem] font-bold text-[#1a3a35] leading-none">20%</p>
                <p className="text-4xl font-bold text-gray-900">Bodyweight</p>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
                People lost an average of 15% (up to 20%) bodyweight in a 68-week clinical trial study of Wegovy® (semaglutide).*
              </p>
              <a
                href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1a3a35] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#0d1f1c] transition text-sm"
              >
                Speak to our doctor now
              </a>
              <p className="text-gray-300 text-xs mt-4 max-w-xs leading-relaxed">
                *When combined with a reduced-calorie diet and increased physical activity. Wegovy® is a registered trademark of Novo Nordisk A/S.
              </p>
            </div>

            {/* Right — Calculator */}
            <WeightCalculator />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. THE PROGRAMME — 2x2 GRID
      ══════════════════════════════════════ */}
      <section className="py-24 bg-[#1a3a35]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">The Programme</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl sm:text-4xl font-bold text-white">
              Your personalised weight loss<br />journey with Nordic
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1 — Free Online Visit */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }} className="bg-[#0d1f1c] rounded-3xl p-8 min-h-[280px] flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Free online visit</h3>
                <p className="text-white/50 text-sm">Complete health history analysis</p>
              </div>
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 mt-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </motion.div>

            {/* Card 2 — Medications Delivered */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }} className="bg-[#0d1f1c] rounded-3xl p-8 min-h-[280px] flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-white font-bold text-xl mb-2">Science backed medications, delivered</h3>
                <p className="text-white/50 text-sm mb-5">To your home in partnership with the largest pharmacy chain in the UAE</p>
                {/* <button
                  onClick={scrollToMeds}
                  className="bg-white text-[#0d1f1c] font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-[#f5f0e8] transition"
                >
                  Start your free online visit
                </button> */}
              </div>
              {/* Decorative injection pen outline */}
              <div className="absolute right-4 bottom-4 opacity-10">
                <svg className="w-32 h-32" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </motion.div>

            {/* Card 3 — Chat doctor */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }} className="bg-[#0d1f1c] rounded-3xl p-8 min-h-[280px] flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Chat with your doctor anytime!</h3>
                <p className="text-white/50 text-sm">Specialised doctors who know how weight management works</p>
              </div>
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 mt-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </motion.div>

            {/* Card 4 — 100% Online */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.45 }} className="bg-[#0d1f1c] rounded-3xl p-8 min-h-[280px] flex flex-col justify-between relative overflow-hidden">
              <div>
                <h3 className="text-white font-bold text-xl mb-2">100% online<br />and at-home care</h3>
                <p className="text-white/50 text-sm">Unlimited doctor visits and support all from your home</p>
              </div>
              {/* Chart decoration */}
              <div className="mt-6 relative h-16">
                <svg viewBox="0 0 200 60" className="w-full h-full opacity-30">
                  <polyline points="0,55 30,50 60,45 90,35 120,25 150,15 200,5" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="0,55 30,50 60,45 90,35 120,25 150,15 200,5 200,60 0,60" fill="rgba(255,255,255,0.05)" strokeWidth="0" />
                </svg>
                <p className="absolute bottom-0 right-0 text-white/30 text-xs font-semibold">100% results</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="py-24 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#1a3a35] text-xs font-semibold uppercase tracking-widest mb-3">The Programme</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How does it work?</h2>
            <p className="text-gray-400 mt-3 text-sm">Four steps from sign-up to your first prescription — nothing rushed.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {HOW_STEPS.map((s) => (
              <div key={s.title} className="flex flex-col">
                <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-4">{s.step}</p>
                <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-[#1a3a35] mb-4 shadow-sm">
                  {s.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">

            <p className="text-gray-400 text-xs mt-3">From AED 149 / month onwards</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          6. DOCTOR MESSAGE
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-16">A message from your doctor</h2>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Letter */}
            <div className="text-gray-600 text-sm leading-relaxed space-y-4">
              <p>Hey friend,</p>
              <p>I&apos;m Dr. Sami, and I&apos;ll be your doctor — but more than that, your partner in getting your life back.</p>
              <p>I know how it feels to give your best and still feel like your body&apos;s not listening. You try to eat right, move more, stay disciplined... and somehow the scale won&apos;t budge. It&apos;s not weakness. It&apos;s biology working against you.</p>
              <p>I&apos;m not just licensed by the Dubai Health Authority — <strong className="text-gray-900">I&apos;m SCOPE-certified</strong> by the World Obesity Federation, trained to treat weight loss as a science, not a guessing game.</p>
              <p>When you start this journey, you won&apos;t be doing it alone. I&apos;ll be here for your check-ins, your questions, your doubts — all of it. Because losing weight safely isn&apos;t about willpower. It&apos;s about the right care, the right plan, and someone who genuinely gives a damn about your progress.</p>
              <p>This is your turning point. Let&apos;s make it the last time you ever have to start over.</p>
              <p className="mt-4">warm regards,</p>
              <p className="font-serif text-2xl text-gray-800 italic mt-2">Dr. Sami</p>
              <p className="text-xs text-gray-400 mt-1">Medical Director & Physician, Nordic Healthcare</p>
            </div>

            {/* Doctor card */}
            <div className="relative">
              <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-[3/4] flex items-center justify-center">
                <div className="text-center text-gray-300">
                  <svg className="w-20 h-20 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm">Dr. Sami</p>
                </div>
              </div>
              {/* SCOPE badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#1a3a35] rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">What is SCOPE certification?</p>
                    <p className="text-gray-400 text-xs leading-relaxed mt-1">SCOPE (Strategic Centre for Obesity Professional Education) is the gold standard in obesity training by the World Obesity Federation. It ensures doctors are trained in the latest science of safe, effective weight management.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          7. PATIENT STORIES — BEFORE/AFTER
      ══════════════════════════════════════ */}
      <section className="py-24 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#1a3a35] text-xs font-semibold uppercase tracking-widest mb-3">Patient Stories</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Real people, real results.</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Before/After image placeholder */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-200 aspect-video flex items-center justify-center">
              <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gray-300 flex items-end p-4">
                <span className="bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full">Before</span>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gray-100 flex items-end p-4 justify-end">
                <span className="bg-[#1a3a35] text-white text-xs font-semibold px-3 py-1 rounded-full">After</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-px h-full bg-white/50" />
              </div>
              <p className="relative z-10 text-gray-400 text-sm">Patient photos</p>
            </div>

            {/* Review */}
            <div className="space-y-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-xl font-medium text-gray-900 leading-relaxed">
                &ldquo;Working long shifts and barely any time to cook, I thought weight loss was out of reach. But I finally found a way to get fit, without leaving my house.&rdquo;
              </blockquote>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-400">Weight loss program user from 2 months</p>
                <p className="text-xs text-gray-400">Lost 8 kgs in 2 months</p>
                <p className="font-semibold text-gray-900 mt-2">Mehreen Zubair</p>
              </div>
              <a
                href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-[#1a3a35] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#0d1f1c] transition text-sm inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511" />
                </svg>
                Start your journey
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          8. QUALITY STANDARDS
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-[#1a3a35] text-xs font-semibold uppercase tracking-widest mb-3">Our Standards</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 max-w-lg leading-snug">
              Original medications, always quality-tested.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-16 gap-y-10">
            {[
              {
                num: "01",
                title: "US-FDA approved medications",
                desc: "All prescribed medications are US-FDA approved and adhere to guidelines established by both local and international regulatory authorities.",
                icon: (
                  <div className="w-12 h-12 bg-[#1a3a35] rounded-full flex items-center justify-center text-white font-bold text-xs">FDA</div>
                ),
              },
              {
                num: "02",
                title: "Authentic and original medicines",
                desc: "Counterfeit weight loss medications are widespread, but we partner directly with manufacturers and their authorised retailers to guarantee the authenticity of every product.",
                icon: (
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#1a3a35]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                ),
              },
              {
                num: "03",
                title: "Temperature controlled in transit",
                desc: "Our deliveries are temperature-controlled at all times, with our valets utilising state-of-the-art storage technology to ensure the medication's optimal efficacy and safety.",
                icon: (
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#1a3a35]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                ),
              },
              {
                num: "04",
                title: "Delivered to your home",
                desc: "Once prescribed by your doctor, we ensure delivery of the medication straight to your doorstep anywhere in the UAE. We work in close collaboration with the manufacturers to ensure adequate availability, authenticity, and stocking.",
                icon: (
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#1a3a35]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                ),
              },
            ].map((item) => (
              <div key={item.num} className="flex gap-5">
                {item.icon}
                <div>
                  <p className="text-xs text-gray-300 font-semibold mb-1">{item.num}</p>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <button onClick={scrollToMeds} className="bg-[#1a3a35] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#0d1f1c] transition text-sm">
              See if I qualify
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          9. UAE LOVES US — SOCIAL PROOF
      ══════════════════════════════════════ */}
      <section className="py-24 bg-[#f5f0e8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-gray-400 text-xs ml-2">1000+ happy members</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">UAE loves us</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Nicole", tag: "Finally lost the weight — without giving up real food.", text: "I lost 5 kg in just a month and didn't feel like I was dieting. The plan was super easy to follow, personalised to me, and actually fit my routine. I feel lighter, more energetic, and more confident. Best part? No crazy workouts or starving.", bg: "bg-gray-800" },
              { name: "Nordic", tag: "UAE's first online weight loss clinic", text: "Personalised for each individual with long lasting results · Prescription treatments proven by science · 24×7 access to care", bg: "bg-[#1a3a35]", isCta: true },
              { name: "Marta Jess", tag: "Actually works", text: "As an athlete, I've always been mindful of my health and performance — but recently, I've faced some personal challenges and stronger-than-usual sugar cravings. That's why I just started my online weight loss program with Nordic.", bg: "bg-gray-50" },
              { name: "Emily R", tag: "It's super easy", text: "Messaging the doctor was really quick and easy and I didn't have to wait to make an appointment. The weekly check-ins and personalised tips kept me on track, and I lost 4 kg in just three weeks!", bg: "bg-gray-50" },
            ].map((card) => (
              <div key={card.name} className={`rounded-3xl p-6 ${card.bg} ${card.bg === "bg-gray-50" ? "border border-gray-100" : ""} flex flex-col justify-between min-h-[320px]`}>
                {card.isCta ? (
                  <>
                    <div>
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Only AED 149 / mo</p>
                      <h3 className="text-white font-bold text-lg mb-3 leading-snug">{card.tag}</h3>
                      <ul className="space-y-2">
                        {card.text.split(" · ").map((t) => (
                          <li key={t} className="flex items-start gap-2 text-white/60 text-xs">
                            <svg className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={scrollToMeds} className="w-full bg-white text-[#1a3a35] font-bold py-3 rounded-full hover:bg-[#f5f0e8] transition text-sm mt-4">
                      Start your free online visit
                    </button>
                  </>
                ) : (
                  <>
                    <p className={`text-sm leading-relaxed flex-1 ${card.bg === "bg-gray-800" ? "text-white" : "text-gray-600"}`}>{card.text}</p>
                    <div className="mt-4">
                      <p className={`font-bold text-sm ${card.bg === "bg-gray-800" ? "text-white" : "text-gray-900"}`}>{card.name}</p>
                      <p className={`text-xs mt-0.5 ${card.bg === "bg-gray-800" ? "text-white/40" : "text-gray-400"}`}>{card.tag}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          10. PRESS / HIGHER STANDARD
      ══════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">A higher standard for your health</h2>
            <p className="text-gray-400 mt-3 text-sm">Precision health for those who demand more</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Doctor quote 1 */}
            <div className="bg-gray-900 rounded-3xl p-6 min-h-[200px] flex flex-col justify-between">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div>
                <p className="text-white/70 text-sm italic">&ldquo;I&apos;ve been so impressed by Nordic.&rdquo;</p>
                <p className="text-white/40 text-xs mt-2">Dr. Elle · Aberschied</p>
              </div>
            </div>

            {/* Khaleej Times */}
            <div className="bg-[#f5f0e8] rounded-3xl p-6 min-h-[200px] flex items-center justify-center">
              <p className="font-serif font-bold text-2xl text-gray-900 tracking-tight">Khaleej Times</p>
            </div>

            {/* Doctor quote 2 */}
            <div className="bg-[#1a3a35] rounded-3xl p-6 min-h-[200px] flex flex-col justify-between">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div>
                <p className="text-white/70 text-sm italic">&ldquo;I didn&apos;t want to fix healthcare. I wanted to reimagine where it happens.&rdquo;</p>
                <p className="text-white/40 text-xs mt-2">Keswin Suresh</p>
              </div>
            </div>

            {/* Entrepreneur */}
            <div className="bg-[#f5f0e8] rounded-3xl p-6 min-h-[200px] flex items-center justify-center">
              <p className="font-serif font-bold text-xl text-gray-900">Entrepreneur<br /><span className="text-sm font-normal text-gray-400">Middle East</span></p>
            </div>

            {/* Doctor quote 3 */}
            <div className="col-span-2 bg-gray-100 rounded-3xl p-6 min-h-[160px] flex flex-col justify-between">
              <div>
                <p className="text-gray-700 text-sm italic">&ldquo;I walked away from traditional clinics to join something truly revolutionary.&rdquo;</p>
                <p className="text-gray-400 text-xs mt-2">Dr. Sami Mohammed</p>
              </div>
            </div>

            {/* Forbes */}
            <div className="bg-[#f5f0e8] rounded-3xl p-6 min-h-[160px] flex items-center justify-center">
              <p className="font-serif font-bold text-2xl text-gray-900">Forbes<br /><span className="text-sm font-normal text-gray-400">Middle East</span></p>
            </div>

            {/* Personal quote */}
            <div className="bg-gray-900 rounded-3xl p-6 min-h-[160px] flex flex-col justify-between">
              <p className="text-white/70 text-sm italic">&ldquo;I&apos;ve always been the first to try new things, and Nordic helped me improve my lifestyle.&rdquo;</p>
              <p className="text-white/40 text-xs mt-2">Samer · Masri</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          11. FAQ
      ══════════════════════════════════════ */}
      <section className="py-24 bg-[#f5f0e8] relative overflow-hidden">
        <div className="absolute bottom-0 left-6 text-[#e8e3d8] font-bold text-[10rem] leading-none select-none pointer-events-none">
          FAQ
        </div>
        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[280px_1fr] gap-16">
            <div className="pt-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Questions?<br />Answers.
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                { q: "What medications do you offer?", a: "We offer Wegovy® (semaglutide), Mounjaro® (tirzepatide), and Foundayo® — all FDA-approved weight loss medications prescribed by our DHA-licensed doctors." },
                { q: "How much does the treatment cost?", a: "Treatments start from AED 149/month. Payment plans are available via Tabby and Tamara." },
                { q: "How do I get started with the treatment?", a: "Click 'Join now for free', complete a brief online health assessment, and book a video consultation with our doctor. The entire process is 100% online." },
                { q: "Do you provide insurance coverage?", a: "Currently our programme operates on a direct-pay basis. We are working towards insurance partnerships." },
                { q: "What is GLP-1 medication?", a: "GLP-1 receptor agonists reduce appetite and slow digestion, helping you feel fuller for longer and lose weight sustainably." },
                { q: "Who is not eligible for this treatment?", a: "People who are pregnant, breastfeeding, or have a history of thyroid cancer may not be eligible. Our doctor will assess your full medical history." },
                { q: "When will I see results?", a: "Most patients begin seeing results within 4 weeks. Clinical studies show an average of 15–20% body weight reduction over 68 weeks." },
              ].map(({ q, a }) => <WlFaqItem key={q} q={q} a={a} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          12. FINAL CTA CARD
      ══════════════════════════════════════ */}
      <section className="py-16 bg-[#f5f0e8]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl px-10 py-14 text-center shadow-sm border border-gray-100">
            <div className="flex items-center justify-center gap-2 text-[#1a3a35] text-xs font-medium mb-5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personalised to your unique needs
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Start losing<br />weight today.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              Free assessment by physician-made algorithm. No in-person visit or insurance required — for only AED 149/mo.
            </p>
            <button onClick={scrollToMeds} className="bg-[#1a3a35] text-white font-bold px-12 py-4 rounded-full text-base hover:bg-[#0d1f1c] transition">
              Join now for free
            </button>
            <p className="text-gray-300 text-xs mt-3">AED 149 next month onwards</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          13. FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-[#f5f0e8] border-t border-gray-200 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 mb-12">
            <div>
              <p className="text-[#1a3a35] text-xs font-semibold uppercase tracking-widest mb-4">Get the Nordic App</p>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
                UAE&apos;s fastest growing<br />health and wellness App
              </h3>
              <div className="flex gap-3 mb-8">
                {["App Store", "Google Play"].map((store) => (
                  <a key={store} href="#" className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-black transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={store === "App Store"
                        ? "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                        : "M3.18 23.76c.35.2.77.2 1.14.01l11.34-6.35-2.48-2.49-9.99 8.83zM.5 1.5C.19 1.86 0 2.37 0 3.01v17.97c0 .64.19 1.15.5 1.51l.07.07 10.07-10.07v-.24L.57 1.43.5 1.5zm19.38 8.77l-2.7-1.51-2.78 2.78 2.78 2.78 2.71-1.52c.77-.43.77-1.13-.01-1.53zm-18.7 12.49l10-8.85-2.49-2.49-7.51 11.34z"
                      } />
                    </svg>
                    <div>
                      <p className="text-[9px] text-white/60 leading-none">{store === "App Store" ? "Download on the" : "GET IT ON"}</p>
                      <p className="text-sm font-semibold leading-tight">{store}</p>
                    </div>
                  </a>
                ))}
              </div>
              <div className="bg-gray-200 rounded-3xl h-48 flex items-center justify-center">
                <p className="text-gray-400 text-sm">App Preview</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">Location</p>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-gray-900 text-base mb-1">Abu Dhabi</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Nordic Healthcare,<br />15th Floor, Al Khattem Tower,<br />Al Maryah Island</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base mb-1">Dubai</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Nordic Health Services LLC,<br />701-13, Opal Tower,<br />Business Bay</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Contact Us</p>
                  <a href={CALL_NUM} className="block text-[#1a3a35] font-semibold text-sm hover:underline">+971 58 164 9910</a>
                  <p className="text-gray-400 text-xs">Toll-Free</p>
                  <a href="mailto:wecare@nordic.ae" className="block text-gray-600 text-sm mt-1 hover:underline">wecare@nordic.ae</a>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Legal</p>
                  <a href="#" className="block text-gray-600 text-sm hover:text-gray-900 transition">Terms of Use</a>
                  <a href="#" className="block text-gray-600 text-sm mt-1 hover:text-gray-900 transition">Privacy Policy</a>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Regulatory License (DHA)</p>
                  <p className="text-gray-500 text-xs">Digital Clinic License # 2985077</p>
                  <p className="text-gray-500 text-xs mt-1">Home Healthcare License # 5167298</p>
                  <p className="text-gray-500 text-xs mt-1">Pharmacy License # 1736821</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Read More</p>
                  <a href="/blog" className="block text-gray-600 text-sm hover:text-gray-900 transition mb-3">Blogs</a>
                  <div className="flex gap-2">
                    {[
                      "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
                      "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
                      "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z",
                      "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.84 1.56V6.82a4.85 4.85 0 01-1.07-.13z",
                    ].map((d, i) => (
                      <a key={i} href="#" className="w-9 h-9 bg-gray-200 hover:bg-[#1a3a35] hover:text-white rounded-full flex items-center justify-center text-gray-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d={d} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-gray-400 text-xs">© 2025 Nordic Home Health Care Centre. All Rights Reserved.</p>
            <p className="text-gray-400 text-xs">DHA License No. 3171506</p>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          STICKY MOBILE BAR
      ══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-gray-100 shadow-2xl">
        <div className="grid grid-cols-2">
          <a href={CALL_NUM} className="flex flex-col items-center justify-center py-3 gap-1 text-gray-600 hover:bg-gray-50 transition border-r border-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-[10px] font-semibold">Call Now</span>
          </a>
          <button onClick={scrollToMeds} className="flex flex-col items-center justify-center py-3 gap-1 bg-[#1a3a35] text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-semibold">Join Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
