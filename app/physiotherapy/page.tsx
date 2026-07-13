"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Testimonials } from "../_components/testimonials";
import ReviewsSection from "../_components/reviews-section";

// ─── Config ───────────────────────────────────────────────────────────────
const WA_NUM = "971581649910";
const WA_BOOK_MSG = encodeURIComponent("Hi Nordic! I'd like to book a physiotherapy home visit.");
const WA_GENERAL_MSG = encodeURIComponent("Hi Nordic! I'd like to learn more about your Physiotherapy at Home service.");

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511" />
  </svg>
);

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

function CheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

// ─── Section Data ───────────────────────────────────────────────────────────
const TRUST_POINTS = [
  "DHA Licensed Therapists",
  "Home Visits Across Dubai",
  "Personalized Treatment Plans",
  "Flexible Scheduling",
];

const WHY_HOME = [
  { icon: "🏠", title: "Comfort of Home", desc: "Receive treatment without travelling." },
  { icon: "👨‍⚕️", title: "One-on-One Care", desc: "Dedicated attention during every session." },
  { icon: "⚡", title: "Faster Recovery", desc: "Customized exercises designed for your condition." },
  { icon: "📅", title: "Flexible Appointments", desc: "Morning, afternoon, and evening visits available." },
];

const CONDITIONS = [
  "Back Pain", "Neck Pain", "Shoulder Pain", "Sports Injuries", "Arthritis",
  "Stroke Rehabilitation", "Knee Pain", "Hip Pain", "Post Surgery Rehabilitation",
  "Sciatica", "Balance Disorders", "Frozen Shoulder",
];

const SERVICES = [
  { title: "Pain Management", desc: "Reduce chronic and acute pain through targeted therapy.", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" },
  { title: "Sports Injury Rehabilitation", desc: "Recover strength and mobility after sports injuries.", icon: "M13.5 4.5L18 9m0 0l-4.5 4.5M18 9H3" },
  { title: "Orthopedic Physiotherapy", desc: "Treatment for bones, muscles, ligaments, and joints.", icon: "M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Neurological Rehabilitation", desc: "Support recovery after stroke and neurological disorders.", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" },
  { title: "Post-Surgical Rehabilitation", desc: "Accelerate healing after orthopedic or general surgeries.", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
  { title: "Elderly Mobility Therapy", desc: "Improve strength, flexibility, and independence.", icon: "M8.25 9.75h4.875a2.625 2.625 0 010 5.25H12M8.25 9.75L10.5 7.5M8.25 9.75L10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" },
  { title: "Pediatric Physiotherapy", desc: "Specialized care for children with developmental or physical challenges.", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" },
  { title: "Women's Health Physiotherapy", desc: "Support during pregnancy and postpartum recovery.", icon: "M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35" },
];

const PROCESS_STEPS = [
  "Book Your Appointment",
  "Initial Assessment",
  "Personalized Treatment Plan",
  "Therapy Sessions",
  "Progress Monitoring",
  "Recovery & Maintenance",
];

const BENEFITS = [
  "Faster Recovery",
  "Reduced Pain",
  "Better Mobility",
  "Improved Balance",
  "Increased Flexibility",
  "Prevent Future Injuries",
  "Personalized Care",
  "Family Involvement",
  "Comfortable Environment",
  "No Travel Required",
];

const WHY_NORDIC = [
  { title: "DHA Licensed Physiotherapists", desc: "Highly qualified professionals with extensive experience." },
  { title: "Personalized Care", desc: "Treatment plans tailored to every patient." },
  { title: "Home Visits", desc: "Convenient appointments throughout Dubai." },
  { title: "Modern Techniques", desc: "Evidence-based rehabilitation methods." },
  { title: "Flexible Scheduling", desc: "Appointments that fit your routine." },
  { title: "Patient-Centered Approach", desc: "Focused on long-term recovery and well-being." },
];

const FAQS = [
  { q: "How long is each session?", a: "Most sessions last between 45 and 60 minutes depending on your condition." },
  { q: "Do I need a doctor's referral?", a: "Not always. Our team can assess your needs and advise if a referral is required." },
  { q: "Do you provide physiotherapy for elderly patients?", a: "Yes. We specialize in mobility improvement, fall prevention, and rehabilitation for seniors." },
  { q: "What should I wear?", a: "Comfortable clothing that allows easy movement." },
  { q: "How many sessions will I need?", a: "The number of sessions depends on your condition, recovery goals, and assessment." },
  { q: "Which areas do you cover?", a: "We provide home physiotherapy services across Dubai." },
];

const TESTIMONIALS = [
  { quote: "The therapist was professional, punctual, and helped me recover quickly after knee surgery.", name: "" },
  { quote: "Excellent home physiotherapy service. Very convenient and effective.", name: "" },
  { quote: "My father regained mobility after stroke rehabilitation. Highly recommended.", name: "" },
];

// ─── Reusable Components ──────────────────────────────────────────────────
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

function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % total), 4500);
    return () => clearInterval(t);
  }, [total]);

  return (
    <div className="max-w-[700px] mx-auto">
      <div className="relative overflow-hidden" style={{ minHeight: "220px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-[#543826]/10 text-center"
          >
            <div className="flex justify-center gap-1 mb-5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.367-2.447a1 1 0 00-1.175 0l-3.367 2.447c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.813 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.958z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-[#1a2e28] text-lg font-medium leading-relaxed">
              &ldquo;{TESTIMONIALS[active].quote}&rdquo;
            </blockquote>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-center gap-2 mt-6">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 ${i === active ? "w-6 h-2 bg-[#543826]" : "w-2 h-2 bg-[#543826]/25"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function PhysiotherapyPage() {
  return (
    <div className="bg-white min-h-screen font-sans">

      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F4EE] to-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2D5B4F]/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-24 w-80 h-80 bg-[#543826]/5 rounded-full blur-3xl" />

        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-8 pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-5">
                <span className="inline-flex items-center gap-2 bg-[#543826]/8 border border-[#543826]/15 text-[#543826] text-[11px] font-semibold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
                  Physiotherapy · Dubai · DHA Licensed
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-bold text-[#1a2e28] leading-[1.12] mb-5" style={{ fontSize: "clamp(32px, 4.6vw, 54px)" }}>
                Physiotherapy at Home in Dubai
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-[#6B7280] text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                Recover safely and comfortably in your own home with personalized physiotherapy delivered by experienced, DHA-licensed professionals.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-3 mb-9">
                <a href={`https://wa.me/${WA_NUM}?text=${WA_BOOK_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all shadow-md">
                  Book Appointment
                </a>
                <a href={`https://wa.me/${WA_NUM}?text=${WA_GENERAL_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[#543826]/25 text-[#543826] font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-[#543826]/5 transition-all">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  WhatsApp Us
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="grid grid-cols-2 gap-x-6 gap-y-3">
                {TRUST_POINTS.map((tp) => (
                  <div key={tp} className="flex items-center gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#543826]/10 text-[#543826] flex items-center justify-center">
                      <CheckIcon className="w-3 h-3" />
                    </span>
                    <span className="text-[#1a2e28] text-sm font-medium">{tp}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative mt-12 lg:mt-0">
              <div className="relative rounded-[28px] overflow-hidden shadow-2xl aspect-[4/3]">
                <Image src="/images/physiotherapy-hero.jpeg" alt="Physiotherapist treating a patient at home in Dubai" fill className="object-cover object-center" priority unoptimized />
              </div>

              {/* Floating cards */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }} className="absolute -top-4 -left-4 sm:top-6 sm:-left-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5 border border-[#543826]/10">
                <span className="w-8 h-8 rounded-full bg-[#543826]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#543826]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span>
                <span className="text-[#1a2e28] text-xs font-semibold whitespace-nowrap">DHA Licensed</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.85 }} className="absolute top-1/2 -right-4 -translate-y-1/2 sm:-right-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5 border border-[#543826]/10">
                <span className="w-8 h-8 rounded-full bg-[#543826]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#543826]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                </span>
                <span className="text-[#1a2e28] text-xs font-semibold whitespace-nowrap">Home Visit</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }} className="absolute -bottom-4 left-6 sm:-bottom-6 sm:left-10 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5 border border-[#543826]/10">
                <span className="w-8 h-8 rounded-full bg-[#543826]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#543826]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                </span>
                <span className="text-[#1a2e28] text-xs font-semibold whitespace-nowrap">Same Day Appointment</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE HOME PHYSIOTHERAPY */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Why Home Physiotherapy</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">Why Choose Home Physiotherapy</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_HOME.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="bg-[#F7F4EE] rounded-2xl p-6 h-full border border-[#543826]/8 hover:shadow-lg hover:border-[#543826]/20 transition-all duration-300 text-center sm:text-left">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-bold text-[#1a2e28] text-base mb-1.5">{item.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT HOME PHYSIOTHERAPY */}
      <section className="py-16 sm:py-20 px-6 lg:px-8 bg-[#F7F4EE]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn>
            <div className="relative rounded-[24px] overflow-hidden shadow-lg aspect-[4/3]">
              <Image src="/images/physiotherapy-2.png" alt="Home physiotherapy assessment in Dubai" fill className="object-cover object-center" unoptimized />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">About</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-5">
              About Home Physiotherapy
            </h2>
            <p className="text-[#6B7280] text-base leading-relaxed mb-4">
              Home physiotherapy provides professional rehabilitation and pain management services in the comfort of your home. Whether you are recovering from surgery, managing a chronic condition, or seeking relief from muscle and joint pain, our licensed physiotherapists develop personalized treatment plans to restore movement, reduce pain, and improve your quality of life.
            </p>
            <p className="text-[#6B7280] text-base leading-relaxed">
              Every session focuses on your individual goals, ensuring effective recovery while avoiding unnecessary travel.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 4. CONDITIONS WE TREAT */}
      <section className="py-16 sm:py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Expertise</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">Conditions We Treat</h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CONDITIONS.map((c, i) => (
              <FadeIn key={c} delay={(i % 6) * 0.05}>
                <div className="flex items-center gap-3 bg-[#F7F4EE] rounded-xl px-5 py-4 border border-[#543826]/8 hover:border-[#543826]/25 hover:shadow-sm transition-all duration-300">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#543826]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#543826]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </span>
                  <span className="text-[#1a2e28] text-sm font-semibold">{c}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR PHYSIOTHERAPY SERVICES */}
      <section className="py-16 sm:py-20 px-6 lg:px-8 bg-[#F7F4EE]">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Services</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">Our Physiotherapy Services</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.title} delay={(i % 4) * 0.08}>
                <div className="bg-white rounded-2xl p-6 h-full border border-[#543826]/8 hover:shadow-lg hover:border-[#543826]/20 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#543826] flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#1a2e28] text-base mb-1.5">{s.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OUR TREATMENT PROCESS */}
      <section className="py-16 sm:py-20 px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-14">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">Our Treatment Process</h2>
          </FadeIn>

          <div className="hidden lg:flex items-start justify-between relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-[#543826]/15" />
            {PROCESS_STEPS.map((step, i) => (
              <FadeIn key={step} delay={i * 0.08} className="relative flex flex-col items-center text-center" >
                <div className="w-12 h-12 rounded-full bg-[#543826] text-white font-bold flex items-center justify-center relative z-10 mb-4 shadow-md">
                  {i + 1}
                </div>
                <p className="text-[#1a2e28] text-sm font-semibold max-w-[130px] leading-snug">{step}</p>
              </FadeIn>
            ))}
          </div>

          <div className="lg:hidden flex flex-col gap-0">
            {PROCESS_STEPS.map((step, i) => (
              <FadeIn key={step} delay={i * 0.06} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#543826] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                    {i + 1}
                  </div>
                  {i < PROCESS_STEPS.length - 1 && <div className="w-0.5 flex-1 bg-[#543826]/15 my-1" style={{ minHeight: "28px" }} />}
                </div>
                <p className="text-[#1a2e28] text-sm font-semibold pt-2 pb-6">{step}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BENEFITS OF PHYSIOTHERAPY AT HOME */}
      <section className="py-16 sm:py-20 px-6 lg:px-8 bg-[#F7F4EE]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn className="order-2 lg:order-1">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Benefits</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-6">
              Benefits of Physiotherapy at Home
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
              {BENEFITS.map((b) => (
                <div key={b} className="flex items-center gap-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#543826]/10 text-[#543826] flex items-center justify-center">
                    <CheckIcon className="w-3 h-3" />
                  </span>
                  <span className="text-[#1a2e28] text-sm font-medium">{b}</span>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="order-1 lg:order-2">
            <div className="relative rounded-[24px] overflow-hidden shadow-lg aspect-[4/3]">
              <Image src="/images/healthcare.png" alt="Benefits of physiotherapy at home" fill className="object-cover object-center" unoptimized />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 8. WHY CHOOSE NORDIC HOME HEALTHCARE */}
      <section className="relative py-16 sm:py-20 px-6 lg:px-8 overflow-hidden bg-[#1a2e28]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2D5B4F]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#543826]/30 rounded-full blur-3xl" />
        <div className="relative max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[#D4A373] text-xs font-semibold uppercase tracking-widest mb-3">Why Nordic</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">Why Choose Nordic Home Healthcare</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_NORDIC.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.07}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4A373] to-[#543826] flex items-center justify-center mb-4 shadow-md">
                    <CheckIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1.5">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="bg-white py-16 sm:py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <FadeIn className="mb-10 text-center">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28]">Frequently Asked Questions</h2>
          </FadeIn>
          <div className="space-y-2">
            {FAQS.map(({ q, a }, i) => <FaqItem key={q} q={q} a={a} idx={i} />)}
          </div>
        </div>
      </section>

      {/* 10. PATIENT TESTIMONIALS */}
      <ReviewsSection></ReviewsSection>

      {/* 11. CTA BANNER */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl px-6 sm:px-14 py-14 sm:py-16 text-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e28] via-[#20362f] to-[#543826]" />
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
              />
              <div className="relative">
                <h2 className="font-bold text-white mb-4 leading-tight" style={{ fontSize: "clamp(26px, 3.4vw, 42px)" }}>
                  Start Your Recovery Today
                </h2>
                <p className="text-white/80 text-base mb-9 max-w-lg mx-auto leading-relaxed">
                  Experience professional physiotherapy in the comfort of your home.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href={`https://wa.me/${WA_NUM}?text=${WA_BOOK_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-[#543826] font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-lg hover:scale-[1.03]">
                    Book Appointment
                  </a>
                  <a href={`https://wa.me/${WA_NUM}?text=${WA_GENERAL_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-lg">
                    <WhatsAppIcon />
                    WhatsApp Now
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
