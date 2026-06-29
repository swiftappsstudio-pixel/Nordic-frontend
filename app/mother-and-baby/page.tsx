"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useAnimation, useScroll, useTransform } from "framer-motion";
import { getCategoryByLink } from "@/app/_common/api";
import { CategoryWithServices, Service } from "@/app/_common/interfaces";
import ServicesSection from "@/app/_components/services-section";

// ─── Config ───────────────────────────────────────────────────────────────
const WA_NUM = "971581649910";
const WA_MSG = encodeURIComponent("Hi Nordic! I'd like to learn more about Mother & Baby care services.");
const CALL_NUM = "tel:+971581649910";

// ─── Colors (matching design spec) ───────────────────────────────────────
// Primary: #2D5B4F  Dark Green: #23463D  Cream: #F7F4EE

// ─── Static Data ──────────────────────────────────────────────────────────
const TRUST_CARDS = [
  { icon: "🏥", title: "DHA Licensed", desc: "Certified by Dubai Health Authority — your safety is guaranteed" },
  { icon: "⭐", title: "Trusted Since 2020", desc: "Serving thousands of Dubai families with excellence" },
  { icon: "🕐", title: "Always Available", desc: "Our care team is on call every hour of every day" },
  { icon: "👩‍⚕️", title: "NICU Specialists", desc: "Trained in the most advanced neonatal care techniques" },
];

const BENEFITS = [
  "DHA Licensed & Fully Regulated",
  "Female-Only Caregivers",
  "Home Visits Across All Dubai",
  "Emergency Response 24/7",
  "Personalised Monthly Plans",
  "NICU & BLS Certified Nurses",
];

const PHONE_LEFT = [
  { icon: "📅", title: "Simple Booking", desc: "Confirm your visit in under 2 minutes" },
  { icon: "👩‍⚕️", title: "Expert Nurses", desc: "NICU-certified, Nordic-employed professionals" },
  { icon: "🔔", title: "Live Updates", desc: "Real-time reports straight to your phone" },
];

const PHONE_RIGHT = [
  { icon: "👶", title: "Your Nurse, Always", desc: "The same face every single visit" },
  { icon: "📊", title: "Health Logs", desc: "Daily tracking of your baby's milestones" },
  { icon: "❤️", title: "Parent Guidance", desc: "Support and reassurance for the whole family" },
];

const STEPS = [
  { num: "01", title: "Tell Us Your Needs", desc: "Message us on WhatsApp — your baby's age, your schedule, what you need." },
  { num: "02", title: "Meet Your Specialist", desc: "A senior nurse reviews your case and prepares a tailored care plan." },
  { num: "03", title: "Approve Your Plan", desc: "Review your caregiver's profile and confirm when you are ready." },
  { num: "04", title: "Care Begins at Home", desc: "Your dedicated caregiver arrives prepared, briefed, and ready." },
];

const SERVICES = [
  { icon: "🍼", title: "Newborn Home Care", desc: "Hands-on support for your newborn's feeding, sleeping and daily routines." },
  { icon: "💊", title: "Postpartum Recovery", desc: "Medical and emotional support for mothers through every stage of recovery." },
  { icon: "🤱", title: "Breastfeeding Support", desc: "Certified lactation nurses guiding you through feeding with confidence." },
  { icon: "🌙", title: "Night Nurse Service", desc: "A trained nurse takes the night shift so your family can rest and heal." },
  { icon: "😴", title: "Baby Sleep Training", desc: "Science-backed sleep routines that work — for baby and for you." },
  { icon: "📱", title: "Health Monitoring", desc: "Daily health logs, milestone tracking and instant nurse communication." },
];

const TESTIMONIALS = [
  { name: "Fatima Al-Hassan", role: "Mother of twins · Dubai Marina", rating: 5, text: "Nordic sent us an extraordinary nurse. From the very first night, our twins slept soundly and we finally felt like a family again." },
  { name: "Sarah Mitchell", role: "First-time mother · JBR", rating: 5, text: "Nothing prepares you for a newborn. Nordic did. Our nurse was calm, expert and always one step ahead of what we needed." },
  { name: "Aisha Al-Mansoori", role: "Mother of 3 · Palm Jumeirah", rating: 5, text: "We have used Nordic for all three of our children. The quality and consistency is unlike anything else in Dubai." },
  { name: "Priya Sharma", role: "Postpartum recovery · DIFC", rating: 5, text: "My recovery was so much smoother knowing a professional was with me at home. Nordic genuinely changed how I experienced motherhood." },
];

const FAQS = [
  { q: "What does Nordic's Mother & Baby service include?", a: "Every plan includes newborn care, overnight nursing, postpartum recovery support, breastfeeding guidance, baby sleep training, and daily health monitoring — all at home in Dubai by our DHA-licensed nurses." },
  { q: "How quickly can a nurse arrive?", a: "In most cases, a Nordic nurse can be with you within 24 hours of booking. For urgent situations, message us on WhatsApp and we will prioritise your case immediately." },
  { q: "How do I get started with Nordic?", a: "Just send us a WhatsApp message with your baby's age and what you need. Our team responds within minutes and handles everything from there." },
  { q: "Are Nordic nurses truly qualified for newborn care?", a: "Every nurse we place is DHA-licensed, NICU-trained, and has completed a minimum of 3 years of neonatal clinical experience. We also conduct reference checks and in-person assessments." },
  { q: "Can I pause or change my care plan?", a: "Yes, always. Nordic plans are completely flexible. You can increase hours, reduce visits, swap your nurse, or pause your plan with just 24 hours notice — no penalties." },
];

function ServiceCard({ svc }: { svc: Service }) {
  const waLink = `https://wa.me/${WA_NUM}?text=${encodeURIComponent(`Hi Nordic! I'd like to learn more about ${svc.title}.`)}`;
  return (
    <a href={waLink} target="_blank" rel="noopener noreferrer" className="group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl" style={{ minHeight: "340px" }}>
      <div className="absolute inset-0">
        {svc.images?.[0] ? (
          <Image src={svc.images[0]} alt={svc.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a2e28]/20 to-[#1a2e28]/40" />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.75) 100%)" }} />
      </div>
      <div className="relative z-10 flex flex-col justify-between h-full p-5" style={{ minHeight: "340px" }}>
        <div>
          <h3 className="text-white font-semibold text-base leading-snug">{svc.title}</h3>
          {svc.description && (
            <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mt-2">{svc.description}</p>
          )}
        </div>
        <div className="mt-auto flex justify-center">
          <span className="inline-flex items-center gap-1.5 bg-[#543826] text-white text-xs font-semibold px-5 py-2.5 rounded-full group-hover:bg-[#3e2a1c] transition">
            Book Now
          </span>
        </div>
      </div>
    </a>
  );
}

function CategoryServicesSection() {
  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryByLink("mother-and-baby")
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="px-8 sm:px-12 lg:px-16">
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#1a2e28]/20 border-t-[#1a2e28] rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) return null;
  if (!categories.some(cat => cat.services?.length > 0)) return null;

  return (
    <section className="py-20 bg-white">
      <div className="px-8 sm:px-12 lg:px-16">
        {categories.map((cat) => (
          <div key={cat._id} className="mb-16">
            <FadeIn>
              <div className="mb-6">
                <h3 className="text-black font-brand text-[clamp(22px,2.4vw,36px)] leading-[1.2] font-normal tracking-[-0.3px] lg:tracking-[-0.6px]">{cat.name}</h3>
                {cat.description && (
                  <p className="text-gray-500 text-sm leading-relaxed mt-1">{cat.description}</p>
                )}
              </div>
            </FadeIn>

            {cat.services.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <p className="text-gray-400 text-base">No services exist in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {cat.services.map((svc) => (
                  <ServiceCard key={svc._id} svc={svc} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

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
  const leftX = useTransform(scrollYProgress, [0.62, 0.82, 1.0], [-480, 0, 0]);
  const leftO = useTransform(scrollYProgress, [0.62, 0.72], [0, 1]);
  const leftS = useTransform(scrollYProgress, [0.62, 0.82, 1.0], [0.45, 1, 1]);

  const rightX = useTransform(scrollYProgress, [0.65, 0.85, 1.0], [480, 0, 0]);
  const rightO = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
  const rightS = useTransform(scrollYProgress, [0.65, 0.85, 1.0], [0.45, 1, 1]);

  return (
    <>
      {/* Mobile/Tablet — simple centered video + WA button */}
      <div className="lg:hidden bg-[#1a2e28] flex flex-col items-center justify-center py-16 px-6 gap-8">
        <div className="relative w-[240px] aspect-[9/16] rounded-[28px] overflow-hidden border-[3px] border-white shadow-2xl">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/video/mother.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="text-center">
          <h3 className="text-white font-semibold text-2xl mb-3">Care that comes to you.</h3>
          <p className="text-white/60 text-sm mb-6 max-w-xs mx-auto">Nordic-employed nurses. NICU-trained. Available 24/7 across Dubai.</p>
          <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-6 py-3 rounded-full shadow-lg">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511" /></svg>
            Talk to us now
          </a>
        </div>
      </div>

      {/* Desktop — full sticky scroll experience */}
      <div ref={containerRef} style={{ height: "350vh" }} className="relative hidden lg:block">
        <div className="sticky top-0 h-screen overflow-hidden bg-[#1a2e28]">

          {/* ── BACKGROUND VIDEO ── */}
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

          {/* ── TEXT PHASE — hidden on mobile, visible lg+ ── */}
          <motion.div
            style={{ opacity: textGroupO }}
            className="hidden lg:flex absolute inset-0 z-10 pointer-events-none items-center justify-center"
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
                    Devoted
                  </motion.p>
                </div>
                <div style={{ overflow: "visible", marginTop: "6px" }}>
                  <motion.p
                    style={{ opacity: t3o, y: t3y, fontSize: "clamp(36px, 5vw, 70px)", fontWeight: 600, lineHeight: 1.05 }}
                    className="text-white/80 select-none drop-shadow-xl whitespace-nowrap"
                  >
                    to you
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
                    heart and
                  </motion.p>
                </div>
                <div style={{ overflow: "visible", marginTop: "6px" }}>
                  <motion.p
                    style={{ opacity: t4o, y: t4y, fontSize: "clamp(36px, 5vw, 70px)", fontWeight: 600, lineHeight: 1.05 }}
                    className="text-white/80 select-none drop-shadow-xl whitespace-nowrap"
                  >
                    your little one
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
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-auto">
                <a
                  href="https://wa.me/971581649910"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#25D366] text-white text-[11px] font-semibold px-4 py-2 rounded-full shadow-lg whitespace-nowrap"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511" /></svg>
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
                {[2, 1, 0].map((i) => (
                  <div key={i} className="absolute rounded-xl overflow-hidden bg-[#e8e4dc] flex items-end justify-center"
                    style={{ width: "48px", height: "56px", left: `${i * 16}px`, bottom: 0, zIndex: 3 - i, transform: `rotate(${i === 0 ? -8 : i === 1 ? -2 : 4}deg)` }}>
                    <svg className="w-8 h-8 text-[#2D5B4F]/40 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
                  </div>
                ))}
                <div className="absolute bottom-0 z-10" style={{ left: "36px" }}>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-[#222222] text-base leading-snug mb-1.5">Every caregiver is vetted</h3>
              <p className="text-[#6B7280] text-xs leading-relaxed">Background checks, skill assessments, licence verification, and reference calls.</p>
            </div>

            {/* Card 2 — All female */}
            <div className="bg-white rounded-2xl p-5 shadow-2xl border border-[#E8E4DC]">
              <svg className="w-7 h-7 text-[#2D5B4F] mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12v5m-2.5 2.5h5" />
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
                {["S", "M", "T", "W", "T", "S"].map((d, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-[#2D5B4F] text-white" : "bg-[#2D5B4F]/10 text-[#2D5B4F]"}`}>{d}</div>
                ))}
              </div>
              <h3 className="font-bold text-[#222222] text-base leading-snug mb-1.5">Same caregiver every time</h3>
              <p className="text-[#6B7280] text-xs leading-relaxed">Subscribe to a weekly or monthly plan and keep the exact same caregiver at home.</p>
            </div>

            {/* Card 4 — NICU */}
            <div className="bg-white rounded-2xl p-5 shadow-2xl border border-[#E8E4DC]">
              <div className="w-14 h-14 bg-[#F0ECE4] rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#2D5B4F]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
              <h3 className="font-bold text-[#222222] text-lg leading-snug">NICU-trained newborn caregivers</h3>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}

// ── Video Testimonial Section ─────────────────────────────────────────────
const VIDEO_TESTIMONIALS = [
  {
    quote: "After my C-section I was completely overwhelmed. Nordic sent a night nurse the very next day — she walked in, took charge, and I finally slept for the first time in three days. I cannot put into words what that meant.",
    name: "Mariam Al-Suwaidi",
    role: "Mother of newborn · Arabian Ranches",
    img: "/images/mother3.jpg",
  },
  {
    quote: "Our daughter was born six weeks early and we were terrified to bring her home. Our Nordic nurse had real NICU experience and arrived knowing exactly what to monitor. That knowledge gave our whole family peace of mind.",
    name: "Layla Al-Rashidi",
    role: "Mother of twins · Downtown Dubai",
    img: "/images/mother2.jpg",
  },
  {
    quote: "I was hesitant at first — I thought I should manage on my own. But our caregiver was so warm and professional that she felt like family within a week. Same face, same care, every single day.",
    name: "Jessica Thornton",
    role: "First-time mother · Palm Jumeirah",
    img: "/images/mother3.jpg",
  },
  {
    quote: "The sleep routine they helped us build changed everything. Our baby went from waking five times a night to sleeping through in just twelve days. I went back to work feeling like a real person again.",
    name: "Hessa Al-Marzouqi",
    role: "Postpartum recovery · Business Bay",
    img: "/images/mother4.jpg",
  },
];

function VideoTestimonialSection() {
  const [active, setActive] = useState(0);
  const total = VIDEO_TESTIMONIALS.length;
  const prev = () => setActive((p) => (p - 1 + total) % total);
  const next = () => setActive((p) => (p + 1) % total);
  const t = VIDEO_TESTIMONIALS[active];

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((p) => (p + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <section className="bg-[#1a2e28] pt-24 pb-20 px-6 overflow-hidden">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <h2 className="text-white font-semibold leading-[1.2]" style={{ fontSize: "clamp(20px, 2.5vw, 32px)" }}>
            They trusted us with the<br />most important job in the world.
          </h2>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <button onClick={prev} className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:border-white/60 hover:text-white transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={next} className="w-9 h-9 rounded-full bg-white/10 border border-white/25 flex items-center justify-center text-white hover:bg-white/20 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="bg-[#F7F4EE] rounded-2xl overflow-hidden flex flex-col sm:flex-row" style={{ minHeight: "300px" }}>
          <div className="relative sm:w-[40%] shrink-0" style={{ minHeight: "300px" }}>
            <Image src={t.img} alt={t.name} fill className="object-cover object-center" unoptimized />
          </div>
          <div className="flex flex-col justify-between px-8 sm:px-10 py-8 flex-1">
            <div>
              <p className="text-[#2D5B4F] text-[10px] font-semibold uppercase tracking-[0.22em] mb-5">Real Mothers, Real Words</p>
              <blockquote className="text-[#1a2e28] font-medium leading-[1.65]" style={{ fontSize: "clamp(14px, 1.4vw, 18px)" }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            </div>
            <div className="mt-8 pt-5 border-t border-black/8">
              <p className="text-[#1a2e28] font-semibold text-sm">{t.name}</p>
              <p className="text-[#6B7280] text-xs mt-0.5">{t.role}</p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-4 mt-6 justify-center">
          {VIDEO_TESTIMONIALS.map((t, i) => (
            <button key={i} onClick={() => setActive(i)} className="group flex flex-col items-center gap-1.5">
              <div className={`transition-all duration-300 rounded-full ${i === active ? "w-10 h-2.5 bg-white" : i < active ? "w-2.5 h-2.5 bg-white/60" : "w-2.5 h-2.5 bg-white/25"}`} />
              <span className={`text-xs font-semibold transition-colors duration-300 ${i === active ? "text-white" : "text-white/40"}`}>{t.name.split(" ")[0]}</span>
            </button>
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
    step: "STEP 01  •  SHARE YOUR NEEDS",
    h1: "One message.",
    h2: "We handle the rest.",
    body: "No paperwork, no waiting. Just tell us your baby's age, your schedule, and what matters most — we take it from there.",
    cta: "Reach out now",
    img: "/images/health2.png",
    bg: "#F7F4EE",
    accent: "#2D5B4F",
  },
  {
    step: "STEP 02  •  YOUR PERFECT MATCH",
    h1: "Handpicked,",
    h2: "not pulled from a list.",
    body: "We read every detail you share and personally select the caregiver who fits your baby's stage, your culture, and your home.",
    cta: "Meet your caregiver",
    img: "/images/mother1.png",
    bg: "#EFF0EB",
    accent: "#2D5B4F",
  },
  {
    step: "STEP 03  •  KNOW HER BEFORE SHE ARRIVES",
    h1: "Full profile.",
    h2: "Total confidence.",
    body: "Review her qualifications, experience, and training. Speak with her directly if you wish — no surprises when she walks through your door.",
    cta: "Contact us",
    img: "/images/health.png",
    bg: "#E8EAE4",
    accent: "#2D5B4F",
  },
  {
    step: "STEP 04  •  CARE FROM HOUR ONE",
    h1: "Fully briefed.",
    h2: "Ready before she knocks.",
    body: "Before her first visit we share your baby's full picture — feeding schedule, health notes, family preferences. She arrives knowing your world.",
    cta: "Reserve your first visit",
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
          Matching IV Therapy hero style
      ══════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#1a2e28]">
        <div className="absolute inset-0">
          <Image src="/images/mother_child_2.png" alt="Mother and Baby care at home in Dubai" fill className="object-cover object-center" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e28]/95 via-[#1a2e28]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full pt-28 pb-16">
          <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-5">
                <span className="inline-flex items-center gap-2 bg-[#2D5B4F]/15 border border-[#2D5B4F]/20 text-[#C9C3B3] text-[11px] font-semibold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
                  <svg className="w-3.5 h-3.5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                  Mother & Baby Care · Dubai · DHA-Licensed
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-bold text-white leading-[1.1] mb-3" style={{ fontSize: "clamp(32px, 5vw, 60px)" }}>
                Premium Mother & Baby Care in UAE<br />
                <span className="font-normal text-white/70" style={{ fontSize: "clamp(18px, 3vw, 36px)" }}>NICU-Trained, Home Delivered</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/60 text-base leading-relaxed mb-4 max-w-md">
                Pregnancy, Newborn & Post-Natal Support
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="text-white/80 text-lg font-medium mb-8 max-w-md">
                One trained caregiver, every step of the way
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-3 mb-8">
                <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-black font-semibold px-7 py-3.5 rounded-full text-sm transition-all duration-300">
                  <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                  Talk to us now
                </a>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: "480px" }}>
                <Image src="/images/mother_child_1.png" alt="Mother and Baby care nurse at home" fill className="object-cover object-center" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e28]/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4">
                    <p className="text-white font-semibold text-sm">Starting from AED 33/hr</p>
                    <p className="text-white/60 text-xs mt-1">Home visits · DHA-licensed · NICU-trained nurses</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          SERVICES — grouped by category from API
      ══════════════════════════ */}
      <CategoryServicesSection />

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
      ══════════════════════════ */}
      <section className="bg-[#F7F4EE] py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <FadeIn className="mb-10 text-center">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28]">Questions? Answers.</h2>
          </FadeIn>
          <div className="space-y-2">
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
            ].map(({ q, a }, i) => <FaqItem key={q} q={q} a={a} idx={i} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          OUR SERVICES — from admin
      ══════════════════════════ */}
      <ServicesSection
        categoryFilter="mother"
        heading="Mother & Baby Services"
        subheading="All services delivered at home by DHA-licensed, NICU-trained professionals."
        label="Our Services"
        accentColor="#543826"
        bgColor="bg-[#F7F4EE]"
      />

      {/* ══════════════════════════
          SECTION 11 — FINAL CTA
          DarDoc style — cream bg, centered white card
      ══════════════════════════ */}
      <section className="bg-[#F7F4EE] py-16 pb-24 sm:pb-16 px-6" ref={ctaRef}>
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
