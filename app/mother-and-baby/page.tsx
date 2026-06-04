"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useAnimation, useScroll, useTransform } from "framer-motion";

// ─── Config ───────────────────────────────────────────────────────────────
const WA_NUM = "971555828945";
const WA_MSG = encodeURIComponent("Hi Nordic! I'd like to learn more about Mother & Baby care services.");
const CALL_NUM = "tel:+971555828945";

// ─── Colors (matching design spec) ───────────────────────────────────────
// Primary: #2D5B4F  Dark Green: #23463D  Cream: #F7F4EE

// ─── Static Data ──────────────────────────────────────────────────────────
const TRUST_CARDS = [
  { icon: "🏥", title: "DHA Licensed", desc: "Fully licensed by Dubai Health Authority" },
  { icon: "⭐", title: "5 Years Experience", desc: "Trusted by thousands of families" },
  { icon: "🕐", title: "24/7 Support", desc: "Round-the-clock care & assistance" },
  { icon: "👩‍⚕️", title: "NICU Trained", desc: "Certified neonatal care specialists" },
];

const BENEFITS = [
  "DHA Licensed & Regulated",
  "Female Caregivers Available",
  "Home Visits Across Dubai",
  "Emergency Support 24/7",
  "Flexible Care Plans",
  "NICU Trained Nurses",
];

const PHONE_LEFT = [
  { icon: "📅", title: "Easy Booking", desc: "Book in under 2 minutes" },
  { icon: "👩‍⚕️", title: "Professional Care", desc: "Certified NICU nurses" },
  { icon: "🔔", title: "Real Time Updates", desc: "Live progress reports" },
];

const PHONE_RIGHT = [
  { icon: "👶", title: "Same Caregiver", desc: "Consistency for your baby" },
  { icon: "📊", title: "Daily Tracking", desc: "Health logs & milestones" },
  { icon: "❤️", title: "Family Support", desc: "Guidance for parents too" },
];

const STEPS = [
  { num: "01", title: "Book Consultation", desc: "Choose a time that works for you — online or via WhatsApp." },
  { num: "02", title: "Speak To Specialist", desc: "Our NICU-trained nurse reviews your needs and answers questions." },
  { num: "03", title: "Get Care Plan", desc: "A personalised care plan tailored to your baby and family." },
  { num: "04", title: "Receive Home Care", desc: "Your dedicated caregiver arrives at your door, ready to help." },
];

const SERVICES = [
  { icon: "🍼", title: "Newborn Care", desc: "Expert care for your newborn's first precious weeks at home." },
  { icon: "💊", title: "Postpartum Care", desc: "Dedicated support for mothers during the postpartum recovery period." },
  { icon: "🤱", title: "Lactation Support", desc: "Professional guidance for breastfeeding and infant nutrition." },
  { icon: "🌙", title: "Night Nurse", desc: "Overnight care so you can rest and recover peacefully." },
  { icon: "😴", title: "Sleep Training", desc: "Evidence-based sleep routines for healthy infant sleep habits." },
  { icon: "📱", title: "Baby Monitoring", desc: "Tech-assisted health tracking and milestone monitoring." },
];

const TESTIMONIALS = [
  { name: "Fatima Al-Hassan", role: "Mother of twins", rating: 5, text: "The best newborn care service in Dubai. Our nurse was incredibly professional and caring. We felt completely supported." },
  { name: "Sarah Mitchell", role: "First-time mother", rating: 5, text: "Having a NICU-trained nurse at home gave us so much confidence. I cannot recommend Nordic enough." },
  { name: "Aisha Al-Mansoori", role: "Mother of 3", rating: 5, text: "From the first call to the last visit, everything was seamless. The caregiver became part of our family." },
  { name: "Priya Sharma", role: "Postpartum recovery", rating: 5, text: "The postpartum care plan was exactly what I needed. Professional, warm and genuinely caring team." },
];

const FAQS = [
  { q: "What services are included in the Mother & Baby package?", a: "Our packages include newborn care, postpartum recovery support, lactation guidance, night nursing, sleep training, and daily health monitoring — all delivered at home by certified nurses." },
  { q: "How much does it cost?", a: "Pricing depends on the level of care required. We offer flexible hourly, daily, and monthly plans. Contact us for a personalised quote." },
  { q: "How do I book?", a: "Simply click 'Talk To Us Now' or send us a WhatsApp message. Our team will respond within minutes and guide you through the booking process." },
  { q: "Are the caregivers certified?", a: "Yes. All our nurses are DHA-licensed, NICU-trained, and have a minimum of 3 years of neonatal care experience." },
  { q: "Can I change or cancel my plan?", a: "Absolutely. Our plans are fully flexible — you can upgrade, downgrade, or pause your plan at any time with 24 hours notice." },
];

// ─── Reusable Components ───────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Scroll Sticky Section ─────────────────────────────────────────────────
//
// Timeline (scrollYProgress 0 → 1):
//   0.00        → Section enters. BG video + center video both fully visible.
//   0.00–0.50   → Text lines flow bottom→top beside center video (left & right of it).
//   0.50–0.68   → Text + BG video fade out together.
//   0.62–0.82   → Cards slide in from left/right, scaling up small→full, stopping flush
//                  against center video. Cards lock in place for rest of scroll down.
//   0.82–1.00   → Cards stay locked. Nothing moves (held state until scroll-up reverses).
//
// Scrolling UP fully reverses every step.
//
function ScrollStickySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── BG VIDEO: visible from start, fades out sharply exactly as cards begin arriving
  const bgVideoO = useTransform(scrollYProgress, [0, 0.58, 0.68], [1, 1, 0]);

  // ── TEXT LINES: appear beside center video, flow bottom → top, exit before cards
  // Left side — "Someone"
  const t1y = useTransform(scrollYProgress, [0.03, 0.18, 0.34], [120, 0, -120]);
  const t1o = useTransform(scrollYProgress, [0.03, 0.11, 0.27, 0.34], [0, 1, 1, 0]);
  // Left side — "for you"
  const t3y = useTransform(scrollYProgress, [0.14, 0.29, 0.45], [120, 0, -120]);
  const t3o = useTransform(scrollYProgress, [0.14, 0.22, 0.38, 0.45], [0, 1, 1, 0]);
  // Right side — "who cares"
  const t2y = useTransform(scrollYProgress, [0.08, 0.23, 0.39], [120, 0, -120]);
  const t2o = useTransform(scrollYProgress, [0.08, 0.16, 0.32, 0.39], [0, 1, 1, 0]);
  // Right side — "and yours"
  const t4y = useTransform(scrollYProgress, [0.19, 0.34, 0.50], [120, 0, -120]);
  const t4o = useTransform(scrollYProgress, [0.19, 0.27, 0.43, 0.50], [0, 1, 1, 0]);

  // ── TEXT GROUP: fade out as cards come in
  const textGroupO = useTransform(scrollYProgress, [0.50, 0.65], [1, 0]);

  // ── CARDS: slide from offscreen → locked flush beside center video
  //    x travels from far offscreen to 0 then stays at 0 (locked)
  //    scale grows 0.5 → 1 then stays at 1 (locked)
  //    adding a keyframe at 1.0 ensures they never move again after arriving
  const leftX  = useTransform(scrollYProgress, [0.62, 0.82, 1.0], [-480, 0, 0]);
  const leftO  = useTransform(scrollYProgress, [0.62, 0.72], [0, 1]);
  const leftS  = useTransform(scrollYProgress, [0.62, 0.82, 1.0], [0.45, 1, 1]);

  const rightX = useTransform(scrollYProgress, [0.65, 0.85, 1.0], [480, 0, 0]);
  const rightO = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
  const rightS = useTransform(scrollYProgress, [0.65, 0.85, 1.0], [0.45, 1, 1]);

  return (
    <div ref={containerRef} style={{ height: "600vh" }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#1a2e28]">

        {/* ── BACKGROUND VIDEO — visible immediately, fades out when cards arrive ── */}
        <motion.div
          style={{ opacity: bgVideoO }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <video
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
          >
            <source src="/video/mother-bg.mp4" type="video/mp4" />
            <source src="/video/mother.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/45" />
        </motion.div>

        {/* ── TEXT PHASE — words appear left & right of center video, flow bottom→top ── */}
        <motion.div
          style={{ opacity: textGroupO }}
          className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
        >
          {/* The text is laid out relative to the center video width so words hug it */}
          <div className="relative w-full h-full">

            {/* LEFT TEXT — right-aligned, sits just left of center video */}
            <div
              className="absolute top-1/2 -translate-y-1/2 text-right"
              style={{ right: "calc(50% + clamp(110px, 14vw, 210px) + 24px)" }}
            >
              <div style={{ overflow: "visible" }}>
                <motion.p
                  style={{ opacity: t1o, y: t1y, fontSize: "clamp(36px, 5vw, 70px)", fontWeight: 600, lineHeight: 1.05 }}
                  className="text-white select-none drop-shadow-xl whitespace-nowrap"
                >
                  Someone
                </motion.p>
              </div>
              <div style={{ overflow: "visible", marginTop: "6px" }}>
                <motion.p
                  style={{ opacity: t3o, y: t3y, fontSize: "clamp(36px, 5vw, 70px)", fontWeight: 600, lineHeight: 1.05 }}
                  className="text-white/80 select-none drop-shadow-xl whitespace-nowrap"
                >
                  for you
                </motion.p>
              </div>
            </div>

            {/* RIGHT TEXT — left-aligned, sits just right of center video */}
            <div
              className="absolute top-1/2 -translate-y-1/2 text-left"
              style={{ left: "calc(50% + clamp(110px, 14vw, 210px) + 24px)" }}
            >
              <div style={{ overflow: "visible" }}>
                <motion.p
                  style={{ opacity: t2o, y: t2y, fontSize: "clamp(36px, 5vw, 70px)", fontWeight: 600, lineHeight: 1.05 }}
                  className="text-white select-none drop-shadow-xl whitespace-nowrap"
                >
                  who cares
                </motion.p>
              </div>
              <div style={{ overflow: "visible", marginTop: "6px" }}>
                <motion.p
                  style={{ opacity: t4o, y: t4y, fontSize: "clamp(36px, 5vw, 70px)", fontWeight: 600, lineHeight: 1.05 }}
                  className="text-white/80 select-none drop-shadow-xl whitespace-nowrap"
                >
                  and yours
                </motion.p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ── CENTER VIDEO FRAME — large portrait, always visible ── */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="relative" style={{ width: "clamp(200px, 26vw, 380px)", aspectRatio: "9/16" }}>
            <div className="w-full h-full border-[3px] border-white rounded-[28px] overflow-hidden shadow-2xl bg-black">
              <video
                autoPlay muted loop playsInline
                className="w-full h-full object-cover"
              >
                <source src="/video/mother.mp4" type="video/mp4" />
              </video>
            </div>
            {/* WA button */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
              <a
                href="https://wa.me/971555828945"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#25D366] text-white text-[11px] font-semibold px-4 py-2 rounded-full shadow-lg whitespace-nowrap"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                Talk to us now
              </a>
            </div>
          </div>
        </div>

        {/* ── LEFT CARDS — hidden on mobile/tablet, visible on lg+ ── */}
        <motion.div
          style={{
            opacity: leftO,
            x: leftX,
            scale: leftS,
            position: "absolute",
            right: "calc(50% + clamp(100px, 13vw, 195px) + 12px)",
            top: "50%",
            translateY: "-50%",
            width: "clamp(270px, 24vw, 370px)",
            zIndex: 30,
            transformOrigin: "right center",
          }}
          className="hidden lg:flex flex-col gap-3 pointer-events-none"
        >
          {/* Card 1 — Every caregiver is vetted */}
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-[#E8E4DC]">
            <div className="relative h-14 mb-4">
              {[2,1,0].map((i) => (
                <div key={i} className="absolute rounded-xl overflow-hidden bg-[#e8e4dc] flex items-end justify-center"
                  style={{ width: "48px", height: "56px", left: `${i * 16}px`, bottom: 0, zIndex: 3-i, transform: `rotate(${i===0?-8:i===1?-2:4}deg)` }}>
                  <svg className="w-8 h-8 text-[#2D5B4F]/40 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                </div>
              ))}
              <div className="absolute bottom-0 z-10" style={{ left: "36px" }}>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-[#222222] text-base leading-snug mb-1.5">Every caregiver is vetted</h3>
            <p className="text-[#6B7280] text-xs leading-relaxed">Background checks, skill assessments, licence verification, and reference calls.</p>
          </div>

          {/* Card 2 — All female */}
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-[#E8E4DC]">
            <svg className="w-7 h-7 text-[#2D5B4F] mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 12v5m-2.5 2.5h5"/>
            </svg>
            <h3 className="font-bold text-[#222222] text-lg">All female caregivers</h3>
          </div>
        </motion.div>

        {/* ── RIGHT CARDS — hidden on mobile/tablet, visible on lg+ ── */}
        <motion.div
          style={{
            opacity: rightO,
            x: rightX,
            scale: rightS,
            position: "absolute",
            left: "calc(50% + clamp(100px, 13vw, 195px) + 12px)",
            top: "50%",
            translateY: "-50%",
            width: "clamp(270px, 24vw, 370px)",
            zIndex: 30,
            transformOrigin: "left center",
          }}
          className="hidden lg:flex flex-col gap-3 pointer-events-none"
        >
          {/* Card 3 — Same caregiver */}
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-[#E8E4DC]">
            <div className="flex gap-1.5 mb-4">
              {["S","M","T","W","T","S"].map((d,i) => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${i===0?"bg-[#2D5B4F] text-white":"bg-[#2D5B4F]/10 text-[#2D5B4F]"}`}>{d}</div>
              ))}
            </div>
            <h3 className="font-bold text-[#222222] text-base leading-snug mb-1.5">Same caregiver every time</h3>
            <p className="text-[#6B7280] text-xs leading-relaxed">Subscribe to a weekly or monthly plan and keep the exact same caregiver at home.</p>
          </div>

          {/* Card 4 — NICU */}
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-[#E8E4DC]">
            <div className="w-14 h-14 bg-[#F0ECE4] rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#2D5B4F]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
            </div>
            <h3 className="font-bold text-[#222222] text-lg leading-snug">NICU-trained newborn caregivers</h3>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

// ── Video Testimonial Section ─────────────────────────────────────────────
const VIDEO_TESTIMONIALS = [
  {
    quote: "Bringing a night nurse postpartum was one of the best decisions I made. Postpartum is no joke, and having overnight support gave me the space to sleep, heal, and actually enjoy my baby while also caring for my family.",
    name: "Melissa Rahal",
    role: "Mother of newborn · Dubai Marina",
  },
  {
    quote: "Our NICU-trained nurse arrived on day one and immediately gave us confidence. She knew exactly what our premature baby needed. I cannot imagine those first weeks without Nordic's support.",
    name: "Fatima Al-Hassan",
    role: "Mother of twins · Downtown Dubai",
  },
  {
    quote: "From the first consultation to the last visit, everything felt personal and professional. Our caregiver became part of the family — same person every single day.",
    name: "Sarah Mitchell",
    role: "First-time mother · Palm Jumeirah",
  },
  {
    quote: "The sleep training program transformed our nights. Within two weeks our baby had a proper routine. I finally got to sleep and feel human again. Worth every dirham.",
    name: "Priya Sharma",
    role: "Postpartum recovery · DIFC",
  },
];

function VideoTestimonialSection() {
  const [active, setActive] = useState(0);
  const total = VIDEO_TESTIMONIALS.length;
  const prev = () => setActive((p) => (p - 1 + total) % total);
  const next = () => setActive((p) => (p + 1) % total);
  const t = VIDEO_TESTIMONIALS[active];

  return (
    <section className="bg-[#1a2e28] pt-24 pb-20 px-6 overflow-hidden">
      <div className="max-w-[900px] mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <h2
            className="text-white font-semibold leading-[1.2]"
            style={{ fontSize: "clamp(20px, 2.5vw, 32px)" }}
          >
            They trusted us with the<br />most important job in the world.
          </h2>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:border-white/60 hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/25 flex items-center justify-center text-white hover:bg-white/20 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Card */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-[#F7F4EE] rounded-2xl overflow-hidden flex flex-col sm:flex-row"
          style={{ minHeight: "300px" }}
        >
          {/* Left — video (same for all cards) */}
          <div className="relative sm:w-[40%] shrink-0" style={{ minHeight: "300px" }}>
            <video
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/video/mother.mp4" type="video/mp4" />
            </video>
            {/* Icon overlays */}
            <div className="absolute top-3 right-3 flex gap-1.5 z-10">
              <div className="w-7 h-7 bg-black/35 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <div className="w-7 h-7 bg-black/35 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right — quote text (changes on click) */}
          <div className="flex flex-col justify-between px-8 sm:px-10 py-8 flex-1">
            <div>
              <p className="text-[#2D5B4F] text-[10px] font-semibold uppercase tracking-[0.22em] mb-5">
                Real Mothers, Real Words
              </p>
              <blockquote
                className="text-[#1a2e28] font-medium leading-[1.65]"
                style={{ fontSize: "clamp(14px, 1.4vw, 18px)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            </div>
            <div className="mt-8 pt-5 border-t border-black/8">
              <p className="text-[#1a2e28] font-semibold text-sm">{t.name}</p>
              <p className="text-[#6B7280] text-xs mt-0.5">{t.role}</p>
            </div>
          </div>
        </motion.div>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-6 justify-center">
          {VIDEO_TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/25"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}


// Cards slide up from bottom, stacking one over the other.
// Each covered card shows only its step-label strip (PEEK_H px) at top.

const STACK_CARDS = [
  {
    step: "STEP 01  •  START THE CONVERSATION",
    h1: "Tell us what you",
    h2: "need. That's it.",
    body: "No forms. No long booking trails. Just message us with your baby's age, your schedule, and what kind of care you're looking for.",
    cta: "Start now",
    img: "/images/health2.png",
    bg: "#F7F4EE",
    accent: "#2D5B4F",
  },
  {
    step: "STEP 02  •  WE SELECT FOR YOU",
    h1: "A caregiver chosen,",
    h2: "not assigned.",
    body: "We review every detail you share and personally match you with the right caregiver for your baby's needs and your routine.",
    cta: "See your match",
    img: "/images/mother1.png",
    bg: "#EFF0EB",
    accent: "#2D5B4F",
  },
  {
    step: "STEP 03  •  REVIEW WITH CONFIDENCE",
    h1: "See everything.",
    h2: "Decide at your pace.",
    body: "See your caregiver's full profile, qualifications, and experience. Speak with her if you'd like before you book.",
    cta: "See profiles",
    img: "/images/health.png",
    bg: "#E8EAE4",
    accent: "#2D5B4F",
  },
  {
    step: "STEP 04  •  READY FROM DAY ONE",
    h1: "She arrives prepared,",
    h2: "not guessing.",
    body: "Once you confirm, we brief your caregiver on your baby's schedule, preferences, and any medical notes. Day one feels like day fifty.",
    cta: "Book your first day",
    img: "/images/healthcare.png",
    bg: "#E2E5DE",
    accent: "#2D5B4F",
  },
];

// PEEK_H: how many px of a stacked card's top peek above the one on top of it
const PEEK_H = 48;

function StackCardBody({ idx }: { idx: number }) {
  const card = STACK_CARDS[idx];
  return (
    <div className="flex flex-col lg:flex-row items-stretch flex-1 min-h-0">

      {/* ── LEFT: Text panel ── */}
      <div className="flex flex-col justify-center gap-5 px-6 sm:px-10 lg:px-14 py-8 lg:py-0 lg:w-[45%] lg:shrink-0">
        <span
          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] w-fit"
          style={{ color: card.accent }}
        >
          <span className="inline-block w-5 h-px" style={{ backgroundColor: card.accent }} />
          {card.step.split("  •  ")[0]}
        </span>

        <h3
          className="font-semibold leading-[1.12] text-[#1A2E28]"
          style={{ fontSize: "clamp(22px, 2.6vw, 44px)" }}
        >
          {card.h1}<br />{card.h2}
        </h3>

        <p className="text-[#6B7280] text-sm leading-[1.7] max-w-[380px]">
          {card.body}
        </p>

        <a
          href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start text-sm font-semibold px-6 py-3 rounded-full transition-all hover:opacity-90 hover:shadow-lg"
          style={{ backgroundColor: card.accent, color: "#fff" }}
        >
          {card.cta}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* ── RIGHT: Image panel ── */}
      <div
        className="relative w-full lg:flex-1 overflow-hidden"
        style={{ minHeight: "220px", borderRadius: "0 0 20px 0" }}
      >
        <Image
          src={card.img}
          alt={card.h1}
          fill
          className="object-cover object-center"
          unoptimized
        />
        <div
          className="absolute inset-y-0 left-0 w-16 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${card.bg}, transparent)` }}
        />
      </div>
    </div>
  );
}

function StackedScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const TITLE_H = 80;
  const [cardHPx, setCardHPx] = useState(800);

  useEffect(() => {
    setCardHPx(window.innerHeight - TITLE_H);
    const onResize = () => setCardHPx(window.innerHeight - TITLE_H);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const card1Y = useTransform(scrollYProgress, [0.0, 0.28], [cardHPx, PEEK_H * 1]);
  const card2Y = useTransform(scrollYProgress, [0.28, 0.56], [cardHPx, PEEK_H * 2]);
  const card3Y = useTransform(scrollYProgress, [0.56, 0.84], [cardHPx, PEEK_H * 3]);
  const cardH = `calc(100vh - ${TITLE_H}px)`;
  const cardBase = "absolute inset-x-3 sm:inset-x-5 rounded-[20px] overflow-hidden border border-black/6 flex flex-col";

  return (
    <>
      {/* ── MOBILE: simple stacked cards (no sticky scroll) ── */}
      <div className="lg:hidden bg-[#F0EDE6] px-4 py-6 space-y-4">
        {STACK_CARDS.map((card, idx) => (
          <div key={idx} className="rounded-[20px] overflow-hidden border border-black/6 flex flex-col" style={{ backgroundColor: card.bg }}>
            <div className="flex items-center px-5 border-b border-black/6" style={{ height: PEEK_H }}>
              <p className="text-[#2D5B4F] text-[10px] font-semibold uppercase tracking-[0.2em]">{card.step}</p>
            </div>
            <StackCardBody idx={idx} />
          </div>
        ))}
      </div>

      {/* ── DESKTOP: sticky scroll effect ── */}
      <div ref={containerRef} style={{ height: "500vh" }} className="relative hidden lg:block">
        <div className="sticky top-0 h-screen overflow-hidden" style={{ backgroundColor: "#F0EDE6" }}>
          <div className="flex items-center justify-center" style={{ height: TITLE_H, zIndex: 5, position: "relative" }}>
            <h2 className="font-bold text-[#1A2E28] text-center" style={{ fontSize: "clamp(18px, 2vw, 26px)" }}>
              Human-led care, from the first message.
            </h2>
          </div>
          <div className={cardBase} style={{ top: TITLE_H, height: cardH, backgroundColor: STACK_CARDS[0].bg, zIndex: 10 }}>
            <div className="flex items-center shrink-0 px-8 sm:px-12 border-b border-black/8" style={{ height: PEEK_H }}>
              <p className="text-[#2D5B4F] text-[10px] font-semibold uppercase tracking-[0.2em]">{STACK_CARDS[0].step}</p>
            </div>
            <StackCardBody idx={0} />
          </div>
          <motion.div className={cardBase} style={{ top: TITLE_H, height: cardH, y: card1Y, backgroundColor: STACK_CARDS[1].bg, zIndex: 20 }}>
            <div className="flex items-center shrink-0 px-8 sm:px-12 border-b border-black/8" style={{ height: PEEK_H }}>
              <p className="text-[#2D5B4F] text-[10px] font-semibold uppercase tracking-[0.2em]">{STACK_CARDS[1].step}</p>
            </div>
            <StackCardBody idx={1} />
          </motion.div>
          <motion.div className={cardBase} style={{ top: TITLE_H, height: cardH, y: card2Y, backgroundColor: STACK_CARDS[2].bg, zIndex: 30 }}>
            <div className="flex items-center shrink-0 px-8 sm:px-12 border-b border-black/8" style={{ height: PEEK_H }}>
              <p className="text-[#2D5B4F] text-[10px] font-semibold uppercase tracking-[0.2em]">{STACK_CARDS[2].step}</p>
            </div>
            <StackCardBody idx={2} />
          </motion.div>
          <motion.div className={cardBase} style={{ top: TITLE_H, height: cardH, y: card3Y, backgroundColor: STACK_CARDS[3].bg, zIndex: 40 }}>
            <div className="flex items-center shrink-0 px-8 sm:px-12 border-b border-black/8" style={{ height: PEEK_H }}>
              <p className="text-[#2D5B4F] text-[10px] font-semibold uppercase tracking-[0.2em]">{STACK_CARDS[3].step}</p>
            </div>
            <StackCardBody idx={3} />
          </motion.div>
        </div>
      </div>
    </>
  );
}


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
    <div className="py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 text-left group"
      >
        <span className="text-[#1a2e28] text-sm font-medium leading-snug group-hover:text-[#2D5B4F] transition-colors">
          {q}
        </span>
        <span className="shrink-0 w-6 h-6 flex items-center justify-center text-[#1a2e28]/50">
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.22 }}
        className="overflow-hidden"
      >
        <p className="text-[#6B7280] text-sm leading-relaxed pt-3 pb-1 max-w-2xl">{a}</p>
      </motion.div>
    </div>
  );
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function MotherAndBabyPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollToCta = () => ctaRef.current?.scrollIntoView({ behavior: "smooth" });

  // Auto-advance testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[#F7F4EE] min-h-screen font-sans">

      {/* ══════════════════════════
          SECTION 2 — HERO
          Exact DarDoc Mother & Baby style
      ══════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        {/* Background — real photo */}
        <div className="absolute inset-0">
          <Image
            src="/images/mother.png"
            alt="Mother and Baby care at home"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Dark overlay — bottom-heavy so text is readable */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.72) 100%)" }} />
        </div>

        {/* Content — bottom-left anchored like DarDoc */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full pb-10 pt-32">

          {/* Small label — uppercase, wide tracking */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white/65 text-[11px] font-medium uppercase tracking-[0.18em] mb-4"
          >
            Maternity Care · Newborn Care · Post-Natal Support in Dubai
          </motion.p>

          {/* Main heading — font-weight 500, exact DarDoc sizing */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-medium text-white leading-[1.05] tracking-tight mb-4 max-w-2xl"
            style={{ fontSize: "clamp(38px, 5.5vw, 68px)" }}
          >
            Pregnancy. Newborn. Nights and beyond.
            <br />
            <span className="text-white/70" style={{ fontWeight: 400, fontSize: "clamp(28px, 4vw, 52px)" }}>
              One trained caregiver, every step of the way.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-base leading-relaxed mb-7 max-w-lg"
          >
            From your first scan to your baby&apos;s first laugh.
          </motion.p>

          {/* CTA Buttons — exact DarDoc style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <motion.a
              href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`}
              target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-white text-[#222222] font-semibold px-6 py-3 rounded-full text-sm shadow-md"
            >
              <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
              Talk to us now
            </motion.a>
            <motion.button
              onClick={scrollToCta}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-white/15 border border-white/50 text-white backdrop-blur-sm font-semibold px-6 py-3 rounded-full text-sm"
            >
              Calculate your pricing plan
            </motion.button>
          </motion.div>

          {/* Trust bar — inline at bottom like DarDoc */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap gap-x-6 gap-y-1.5"
          >
            {[
              { icon: "⭐", text: "4.9 rated" },
              { icon: "👶", text: "3,000+ mothers" },
              { icon: "🏥", text: "DHA License #2985077" },
              { icon: "🩺", text: "NICU · BLS trained" },
              { icon: "👩‍⚕️", text: "Nordic-employed" },
              { icon: "💰", text: "From AED 33/hr" },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-1.5">
                <span className="text-sm">{item.icon}</span>
                <span className="text-white/75 text-xs font-medium whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════
          SECTION 2B — CARE FOR EVERY STAGE
          5 image cards — exact DarDoc style
      ══════════════════════════ */}
      <section className="py-16 bg-[#F7F4EE]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          {/* Heading */}
          <FadeIn className="mb-10">
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1F3C34] leading-tight max-w-lg">
              Care for every stage, from one trained team.
            </h2>
            <p className="text-[#6B7280] mt-3 text-base">Nordic-employed. NICU-trained. Never a freelance pool.</p>
          </FadeIn>

          {/* 5 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                tag: "Before Birth",
                title: "Pre-natal & midwife support",
                desc: "Prenatal check-ins and midwife support at home. Sets up the team that will care for you after delivery.",
                img: "/images/nurse.png",
              },
              {
                tag: "Specialised Newborn",
                title: "Premature & post-procedure care",
                desc: "NICU-trained caregivers for moments that need real expertise. Premature babies, post-procedures, and specialist-grade newborn care.",
                img: "/images/nurse2.png",
              },
              {
                tag: "Daily Newborn",
                title: "Newborn & post-natal care",
                desc: "Feeding, sleep, and newborn routines for those first few months. The hands-on support every new parent really needs from the start.",
                img: "/images/nurse.png",
              },
              {
                tag: "Night and Overnight",
                title: "Overnight care, every night",
                desc: "NICU-trained caregivers through the night, so you can actually sleep. The first night feels like getting your life back.",
                img: "/images/nurse2.png",
              },
              {
                tag: "On-Demand",
                title: "Occasional babysitting",
                desc: "Trained caregivers for date nights, work calls, or plans you love. Same vetted caregivers, by the hour, never a stranger.",
                img: "/images/nurse.png",
              },
            ].map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
                  style={{ minHeight: "380px" }}
                >
                  {/* Background image */}
                  <div className="absolute inset-0">
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    {/* Gradient overlay — dark at bottom */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0.85) 100%)" }} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col justify-between h-full p-5" style={{ minHeight: "380px" }}>
                    {/* Top tag */}
                    <span className="self-start text-[9px] text-white/60 uppercase tracking-widest font-medium bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15">
                      {card.tag}
                    </span>

                    {/* Bottom content */}
                    <div className="mt-auto">
                      <h3 className="text-white font-semibold text-lg leading-snug mb-3">{card.title}</h3>
                      <p className="text-white/55 text-xs leading-relaxed mb-5">{card.desc}</p>
                      <motion.a
                        href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent(`Hi! I'd like to learn more about ${card.title}.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.04 }}
                        className="inline-flex items-center bg-white text-[#1F3C34] text-xs font-semibold px-5 py-2.5 rounded-full"
                      >
                        Learn more
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          SECTION 3B — SCROLL STICKY
      ══════════════════════════ */}
      <ScrollStickySection />

      {/* ══════════════════════════
          SECTION 6 — STACKED SCROLL CARDS
      ══════════════════════════ */}
      <div className="hidden lg:block bg-[#F7F4EE] text-center pt-16 pb-8 px-6">
        <h2 className="text-[#1F3C34] font-semibold leading-tight" style={{ fontSize: "clamp(28px, 3.5vw, 50px)" }}>
          Human-led care,<br />from the first message.
        </h2>
      </div>
      <div className="lg:hidden bg-[#F7F4EE] text-center pt-12 pb-4 px-6">
        <h2 className="text-[#1F3C34] font-semibold leading-tight text-2xl">
          Human-led care,<br />from the first message.
        </h2>
      </div>
      <StackedScrollSection />

      {/* ══════════════════════════
          VIDEO TESTIMONIAL SECTION
          "They trusted us with the most important job in the world."
      ══════════════════════════ */}
      <VideoTestimonialSection />

      {/* ══════════════════════════
          SECTION 10 — FAQ
          DarDoc style — left heading, right accordion
      ══════════════════════════ */}
      <section className="bg-[#F7F4EE] py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid lg:grid-cols-[280px_1fr] gap-16 items-start">

            {/* Left — heading */}
            <FadeIn>
              <h2 className="font-semibold text-[#1a2e28] leading-[1.1] sticky top-24"
                style={{ fontSize: "clamp(28px, 3vw, 42px)" }}>
                Questions?<br />Answers.
              </h2>
            </FadeIn>

            {/* Right — accordion */}
            <div className="divide-y divide-[#1a2e28]/10">
              {[
                { q: "How does newborn care at home with Nordic work?", a: "We match you with a NICU-trained, Nordic-employed caregiver based on your baby's age, your schedule, and your specific needs. Your caregiver arrives briefed and ready — no strangers, no surprises." },
                { q: "What is the difference between a maternity nurse, a caregiver, and a nanny?", a: "A maternity nurse is clinically trained for newborn and postpartum care. A caregiver provides daily support including feeding, bathing, and health monitoring. A nanny focuses on general childcare. Nordic provides maternity nurses and caregivers — never untrained nannies." },
                { q: "Do you offer pre-natal and post-natal support beyond newborn care?", a: "Yes. We offer prenatal home visits, midwife support, postpartum recovery care, and lactation guidance — covering the full journey from pregnancy through the fourth trimester." },
                { q: "Do you offer overnight or night-nurse care?", a: "Absolutely. Our overnight care is one of our most popular services. A NICU-trained caregiver takes the night shift so you can sleep, recover, and wake up rested." },
                { q: "Can you help with breastfeeding support?", a: "Yes. Our lactation-trained nurses provide hands-on breastfeeding guidance, latch support, and feeding schedules — at home, on your schedule." },
                { q: "Do you provide specialised care for premature babies?", a: "Yes. We have NICU-trained caregivers with direct experience caring for premature and medically complex newborns. We also coordinate with your hospital team if needed." },
                { q: "Can I book a caregiver for just a few hours or one night?", a: "Yes. We offer hourly, daily, overnight, and monthly plans. Whether you need a few hours of relief or full-time support, we have a plan for you." },
                { q: "Are your caregivers Nordic employees or freelancers?", a: "All our caregivers are directly employed by Nordic — never freelancers or from a third-party pool. This means consistent standards, proper training, and full accountability." },
                { q: "Are your caregivers NICU-trained?", a: "Yes. Every caregiver we place for newborn and infant care holds NICU training or equivalent clinical certification, with a minimum of 3 years of neonatal experience." },
                { q: "Is Nordic a licensed care provider in the UAE?", a: "Yes. Nordic holds a valid DHA (Dubai Health Authority) license and operates fully within UAE healthcare regulations." },
                { q: "Can I keep the same caregiver throughout my journey?", a: "Yes. With a weekly or monthly plan, you are assigned the same caregiver for every visit. Consistency matters — for you and your baby." },
                { q: "What if I do not like the assigned caregiver?", a: "We will replace your caregiver, no questions asked. Your comfort and your baby's wellbeing come first. We will find the right match for your family." },
              ].map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════
          SECTION 11 — FINAL CTA
          DarDoc style — cream bg, centered white card
      ══════════════════════════ */}
      <section className="bg-[#F7F4EE] py-16 px-6" ref={ctaRef}>
        <div className="max-w-[860px] mx-auto">
          <FadeIn>
            <div className="bg-white rounded-3xl px-8 sm:px-16 py-14 text-center shadow-sm border border-black/5">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6">
                <svg className="w-4 h-4 text-[#2D5B4F]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#2D5B4F] text-xs font-semibold">
                  UAE&apos;s #1 home care provider for newborns.
                </span>
              </div>

              {/* Heading */}
              <h2
                className="font-bold text-[#1a2e28] leading-[1.12] mb-4"
                style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}
              >
                Book your baby&apos;s first care<br />visit today.
              </h2>

              {/* Description */}
              <p className="text-[#6B7280] text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                NICU-trained caregivers, Nordic-employed and never freelance. Monthly plans include a free first midwife visit, and we cover transport visa end to end.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.a
                  href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`}
                  target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 bg-[#1a2e28] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all hover:bg-[#23463D]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511" />
                  </svg>
                  Book on WhatsApp
                </motion.a>
                <motion.a
                  href={CALL_NUM}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#1a2e28]/20 text-[#1a2e28] font-semibold px-7 py-3.5 rounded-full text-sm transition-all hover:border-[#1a2e28]/50"
                >
                  Call us, toll-free
                </motion.a>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
