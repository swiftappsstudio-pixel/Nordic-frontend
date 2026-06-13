"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { getCategoryByLink } from "@/app/_common/api";
import { CategoryWithServices, Service } from "@/app/_common/interfaces";
import ServicesSection from "@/app/_components/services-section";

// ─── Config ───────────────────────────────────────────────────────────────
const WA_NUM = "971555828945";
const WA_MSG = encodeURIComponent("Hi Nordic! I'd like to learn more about Elderly Care services.");
const CALL_NUM = "tel:+971555828945";

const HERO_SLIDES = [
  { src: "/images/elder_patient_2.png", alt: "Elderly patient care at home" },
  { src: "/images/elder_patient_1.png", alt: "Compassionate elderly caregiver" },
  { src: "/images/older5.jpg", alt: "Elderly care at home Dubai" },
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
          <span className="inline-flex items-center gap-1.5 bg-white text-[#1a2e28] text-xs font-semibold px-5 py-2.5 rounded-full group-hover:bg-[#F7F4EE] transition">
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
    getCategoryByLink("elderly-care")
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#1a2e28]/20 border-t-[#1a2e28] rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

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

function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center mx-auto lg:ml-[80px]" style={{ minHeight: "320px", maxWidth: "260px" }}>
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image src={HERO_SLIDES[active].src} alt={HERO_SLIDES[active].alt} fill className="object-cover object-center" unoptimized />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 ${i === active ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Reusable Components ──────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
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

// ── Scroll Sticky Section ─────────────────────────────────────────────────
function ScrollStickySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const bgVideoO = useTransform(scrollYProgress, [0, 0.58, 0.68], [1, 1, 0]);
  const t1y = useTransform(scrollYProgress, [0.03, 0.18, 0.34], [120, 0, -120]);
  const t1o = useTransform(scrollYProgress, [0.03, 0.11, 0.27, 0.34], [0, 1, 1, 0]);
  const t3y = useTransform(scrollYProgress, [0.14, 0.29, 0.45], [120, 0, -120]);
  const t3o = useTransform(scrollYProgress, [0.14, 0.22, 0.38, 0.45], [0, 1, 1, 0]);
  const t2y = useTransform(scrollYProgress, [0.08, 0.23, 0.39], [120, 0, -120]);
  const t2o = useTransform(scrollYProgress, [0.08, 0.16, 0.32, 0.39], [0, 1, 1, 0]);
  const t4y = useTransform(scrollYProgress, [0.19, 0.34, 0.50], [120, 0, -120]);
  const t4o = useTransform(scrollYProgress, [0.19, 0.27, 0.43, 0.50], [0, 1, 1, 0]);
  const textGroupO = useTransform(scrollYProgress, [0.50, 0.65], [1, 0]);
  const leftX  = useTransform(scrollYProgress, [0.62, 0.82, 1.0], [-480, 0, 0]);
  const leftO  = useTransform(scrollYProgress, [0.62, 0.72], [0, 1]);
  const leftS  = useTransform(scrollYProgress, [0.62, 0.82, 1.0], [0.45, 1, 1]);
  const rightX = useTransform(scrollYProgress, [0.65, 0.85, 1.0], [480, 0, 0]);
  const rightO = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
  const rightS = useTransform(scrollYProgress, [0.65, 0.85, 1.0], [0.45, 1, 1]);

  return (
    <>
      {/* Mobile/Tablet — simple centered video + WA button */}
      <div className="lg:hidden bg-[#1a2e28] flex flex-col items-center justify-center py-16 px-6 gap-6">
        <div className="relative w-[200px] aspect-[9/16] rounded-[20px] overflow-hidden border-[3px] border-white shadow-2xl">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/images/older1.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="text-center">
          <h3 className="text-white font-semibold text-xl mb-2">Care that comes to you.</h3>
          <p className="text-white/60 text-sm mb-4 max-w-xs mx-auto">Nordic-employed caregivers. Clinically trained. Available 24/7 across Dubai.</p>
          <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
            Talk to us now
          </a>
        </div>
      </div>

      {/* Desktop — full sticky scroll */}
      <div ref={containerRef} style={{ height: "600vh" }} className="relative hidden lg:block">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#1a2e28]">
        <motion.div style={{ opacity: bgVideoO }} className="absolute inset-0 z-0 pointer-events-none">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/images/older1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/45" />
        </motion.div>

        {/* ── TEXT PHASE — hidden on mobile, visible lg+ ── */}
        <motion.div style={{ opacity: textGroupO }} className="hidden lg:flex absolute inset-0 z-10 pointer-events-none items-center justify-center">
          <div className="relative w-full h-full">
            <div className="absolute top-1/2 -translate-y-1/2 text-right" style={{ right: "calc(50% + clamp(110px, 14vw, 210px) + 24px)" }}>
              <div style={{ overflow: "visible" }}>
                <motion.p style={{ opacity: t1o, y: t1y, fontSize: "clamp(36px, 5vw, 70px)", fontWeight: 600, lineHeight: 1.05 }} className="text-white select-none drop-shadow-xl whitespace-nowrap">Someone</motion.p>
              </div>
              <div style={{ overflow: "visible", marginTop: "6px" }}>
                <motion.p style={{ opacity: t3o, y: t3y, fontSize: "clamp(36px, 5vw, 70px)", fontWeight: 600, lineHeight: 1.05 }} className="text-white/80 select-none drop-shadow-xl whitespace-nowrap">for them</motion.p>
              </div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 text-left" style={{ left: "calc(50% + clamp(110px, 14vw, 210px) + 24px)" }}>
              <div style={{ overflow: "visible" }}>
                <motion.p style={{ opacity: t2o, y: t2y, fontSize: "clamp(36px, 5vw, 70px)", fontWeight: 600, lineHeight: 1.05 }} className="text-white select-none drop-shadow-xl whitespace-nowrap">who cares</motion.p>
              </div>
              <div style={{ overflow: "visible", marginTop: "6px" }}>
                <motion.p style={{ opacity: t4o, y: t4y, fontSize: "clamp(36px, 5vw, 70px)", fontWeight: 600, lineHeight: 1.05 }} className="text-white/80 select-none drop-shadow-xl whitespace-nowrap">and yours</motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="relative" style={{ width: "clamp(200px, 26vw, 380px)", aspectRatio: "9/16" }}>
            <div className="w-full h-full border-[3px] border-white rounded-[28px] overflow-hidden shadow-2xl bg-black">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source src="/images/older1.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 pointer-events-auto">
              <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-6 py-3 rounded-full shadow-lg whitespace-nowrap">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                Talk to us now
              </a>
            </div>
          </div>
        </div>

        <motion.div style={{ opacity: leftO, x: leftX, scale: leftS, position: "absolute", right: "calc(50% + clamp(100px, 13vw, 195px) + 12px)", top: "50%", translateY: "-50%", width: "clamp(270px, 24vw, 370px)", zIndex: 30, transformOrigin: "right center" }} className="hidden lg:flex flex-col gap-3 pointer-events-none">
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-[#E8E4DC]">
            <div className="relative h-14 mb-4">
              {[2,1,0].map((i) => (
                <div key={i} className="absolute rounded-xl overflow-hidden bg-[#e8e4dc] flex items-end justify-center" style={{ width: "48px", height: "56px", left: `${i * 16}px`, bottom: 0, zIndex: 3-i, transform: `rotate(${i===0?-8:i===1?-2:4}deg)` }}>
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
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-[#E8E4DC]">
            <svg className="w-7 h-7 text-[#2D5B4F] mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 12v5m-2.5 2.5h5"/>
            </svg>
            <h3 className="font-bold text-[#222222] text-lg">All female caregivers</h3>
          </div>
        </motion.div>

        <motion.div style={{ opacity: rightO, x: rightX, scale: rightS, position: "absolute", left: "calc(50% + clamp(100px, 13vw, 195px) + 12px)", top: "50%", translateY: "-50%", width: "clamp(270px, 24vw, 370px)", zIndex: 30, transformOrigin: "left center" }} className="hidden lg:flex flex-col gap-3 pointer-events-none">
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-[#E8E4DC]">
            <div className="flex gap-1.5 mb-4">
              {["S","M","T","W","T","S"].map((d,i) => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${i===0?"bg-[#2D5B4F] text-white":"bg-[#2D5B4F]/10 text-[#2D5B4F]"}`}>{d}</div>
              ))}
            </div>
            <h3 className="font-bold text-[#222222] text-base leading-snug mb-1.5">Same caregiver every time</h3>
            <p className="text-[#6B7280] text-xs leading-relaxed">Subscribe to a weekly or monthly plan and keep the exact same caregiver at home.</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-[#E8E4DC]">
            <div className="w-14 h-14 bg-[#F0ECE4] rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#2D5B4F]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
            </div>
            <h3 className="font-bold text-[#222222] text-lg leading-snug">Clinically-trained elderly caregivers</h3>
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
    quote: "Having a full-time caregiver for my father after his surgery was one of the best decisions we made. The nurse was incredibly professional, patient, and genuinely caring. We finally had peace of mind.",
    name: "Ahmed Al-Mansoori",
    role: "Son of patient · Dubai Marina",
    img: "/images/older2.jpg",
  },
  {
    quote: "Our mother has dementia and we were struggling to manage. Nordic's caregiver arrived on day one knowing exactly what to do. The consistency and expertise made a world of difference for our whole family.",
    name: "Sarah Mitchell",
    role: "Daughter · Downtown Dubai",
    img: "/images/older3.jpg",
  },
  {
    quote: "From the first conversation to every daily visit, everything was seamless. The same caregiver came every day — my father knew her name, trusted her. That consistency is everything.",
    name: "Priya Sharma",
    role: "Family carer · Palm Jumeirah",
    img: "/images/older4.jpg",
  },
  {
    quote: "The overnight care plan gave us real rest for the first time in months. Knowing a trained nurse was there through the night completely changed our family's quality of life.",
    name: "Fatima Al-Hassan",
    role: "Daughter · DIFC",
    img: "/images/older5.jpg",
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
              <p className="text-[#2D5B4F] text-[10px] font-semibold uppercase tracking-[0.22em] mb-5">Real Families, Real Words</p>
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

// ── Stacked Scroll Cards ──────────────────────────────────────────────────
const STACK_CARDS = [
  {
    step: "STEP 01  •  TELL US ABOUT YOUR LOVED ONE",
    h1: "One conversation.",
    h2: "We take care of everything.",
    body: "No long forms or waiting lists. Simply tell us your loved one's condition, daily routine, and what support you need — we handle the rest.",
    cta: "Start the conversation",
    img: "/images/older2.jpg",
    bg: "#F7F4EE", accent: "#2D5B4F",
  },
  {
    step: "STEP 02  •  YOUR CAREGIVER IS CHOSEN",
    h1: "Matched by expertise,",
    h2: "not by availability.",
    body: "We select a caregiver based on your loved one's medical needs, personality, and daily schedule — never just whoever is free.",
    cta: "See how we match",
    img: "/images/older3.jpg",
    bg: "#EFF0EB", accent: "#2D5B4F",
  },
  {
    step: "STEP 03  •  MEET HER BEFORE SHE ARRIVES",
    h1: "Full transparency.",
    h2: "Complete peace of mind.",
    body: "View your caregiver's qualifications, clinical background, and experience. Speak with her if you wish — before she ever steps into your home.",
    cta: "Review profiles",
    img: "/images/older4.jpg",
    bg: "#E8EAE4", accent: "#2D5B4F",
  },
  {
    step: "STEP 04  •  CARE BEGINS AT HOME",
    h1: "Prepared from",
    h2: "the very first visit.",
    body: "We brief your caregiver on every detail — medication schedule, mobility needs, food preferences, daily routine. She arrives ready, not learning on the job.",
    cta: "Book the first visit",
    img: "/images/older7.jpg",
    bg: "#E2E5DE", accent: "#2D5B4F",
  },
];

const PEEK_H = 28;

function StackCardBody({ idx }: { idx: number }) {
  const card = STACK_CARDS[idx];
  return (
    <div className="flex flex-col lg:flex-row items-stretch flex-1 min-h-0">
      <div className="flex flex-col justify-center gap-3 px-4 sm:px-6 lg:px-8 py-5 lg:py-0 lg:w-[40%] lg:shrink-0">
        <span className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] w-fit" style={{ color: card.accent }}>
          <span className="inline-block w-4 h-px" style={{ backgroundColor: card.accent }} />
          {card.step.split("  •  ")[0]}
        </span>
        <h3 className="font-semibold leading-[1.12] text-[#1A2E28]" style={{ fontSize: "clamp(18px, 2vw, 36px)" }}>
          {card.h1}<br />{card.h2}
        </h3>
        <p className="text-[#6B7280] text-xs leading-[1.7] max-w-[320px]">{card.body}</p>
        <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 self-start text-xs font-semibold px-4 py-2.5 rounded-full transition-all hover:opacity-90 hover:shadow-lg" style={{ backgroundColor: card.accent, color: "#fff" }}>
          {card.cta}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </a>
      </div>
      <div className="relative w-full lg:flex-1 overflow-hidden" style={{ minHeight: "160px", borderRadius: "0 0 14px 0" }}>
        <Image src={card.img} alt={card.h1} fill className="object-cover object-center" unoptimized />
        <div className="absolute inset-y-0 left-0 w-12 pointer-events-none" style={{ background: `linear-gradient(to right, ${card.bg}, transparent)` }} />
      </div>
    </div>
  );
}

function StackedScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const TITLE_H = 48;
  const [cardHPx, setCardHPx] = useState(450);

  useEffect(() => {
    setCardHPx(window.innerHeight - TITLE_H);
    const onResize = () => setCardHPx(window.innerHeight - TITLE_H);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const card1Y = useTransform(scrollYProgress, [0.00, 0.20], [cardHPx, PEEK_H * 1]);
  const card2Y = useTransform(scrollYProgress, [0.30, 0.50], [cardHPx, PEEK_H * 2]);
  const card3Y = useTransform(scrollYProgress, [0.60, 0.80], [cardHPx, PEEK_H * 3]);
  const cardH = `calc(100vh - ${TITLE_H}px)`;
  const cardBase = "absolute inset-x-3 sm:inset-x-5 rounded-[20px] overflow-hidden border border-black/6 flex flex-col";

  return (
    <>
      {/* ── MOBILE: simple stacked cards ── */}
      <div className="lg:hidden bg-[#F0EDE6] px-3 py-4 space-y-3">
        {STACK_CARDS.map((card, idx) => (
          <div key={idx} className="rounded-[14px] overflow-hidden border border-black/6 flex flex-col" style={{ backgroundColor: card.bg }}>
            <div className="flex items-center px-4 border-b border-black/6" style={{ height: 32 }}>
              <p className="text-[#2D5B4F] text-[9px] font-semibold uppercase tracking-[0.18em]">{card.step}</p>
            </div>
            <StackCardBody idx={idx} />
          </div>
        ))}
      </div>

      {/* ── DESKTOP: sticky scroll effect ── */}
      <div ref={containerRef} style={{ height: "600vh" }} className="relative hidden lg:block">
        <div className="sticky top-0 h-screen overflow-hidden" style={{ backgroundColor: "#F0EDE6" }}>
          <div className="flex items-center justify-center" style={{ height: TITLE_H, zIndex: 5, position: "relative" }}>
            <h2 className="font-bold text-[#1A2E28] text-center" style={{ fontSize: "clamp(16px, 1.8vw, 24px)" }}>
              Human-led care, from the first message.
            </h2>
          </div>
          <div className={cardBase} style={{ top: TITLE_H, height: cardH, backgroundColor: STACK_CARDS[0].bg, zIndex: 10 }}>
            <div className="flex items-center shrink-0 px-6 border-b border-black/8" style={{ height: PEEK_H }}>
              <p className="text-[#2D5B4F] text-[9px] font-semibold uppercase tracking-[0.18em]">{STACK_CARDS[0].step}</p>
            </div>
            <StackCardBody idx={0} />
          </div>
          <motion.div className={cardBase} style={{ top: TITLE_H, height: cardH, y: card1Y, backgroundColor: STACK_CARDS[1].bg, zIndex: 20 }}>
            <div className="flex items-center shrink-0 px-6 border-b border-black/8" style={{ height: PEEK_H }}>
              <p className="text-[#2D5B4F] text-[9px] font-semibold uppercase tracking-[0.18em]">{STACK_CARDS[1].step}</p>
            </div>
            <StackCardBody idx={1} />
          </motion.div>
          <motion.div className={cardBase} style={{ top: TITLE_H, height: cardH, y: card2Y, backgroundColor: STACK_CARDS[2].bg, zIndex: 30 }}>
            <div className="flex items-center shrink-0 px-6 border-b border-black/8" style={{ height: PEEK_H }}>
              <p className="text-[#2D5B4F] text-[9px] font-semibold uppercase tracking-[0.18em]">{STACK_CARDS[2].step}</p>
            </div>
            <StackCardBody idx={2} />
          </motion.div>
          <motion.div className={cardBase} style={{ top: TITLE_H, height: cardH, y: card3Y, backgroundColor: STACK_CARDS[3].bg, zIndex: 40 }}>
            <div className="flex items-center shrink-0 px-6 border-b border-black/8" style={{ height: PEEK_H }}>
              <p className="text-[#2D5B4F] text-[9px] font-semibold uppercase tracking-[0.18em]">{STACK_CARDS[3].step}</p>
            </div>
            <StackCardBody idx={3} />
          </motion.div>
        </div>
      </div>
    </>
  );
}

// ── We Also Serve ─────────────────────────────────────────────────────────
function WeAlsoServeSection() {
  const cards = [
    { title: "Mother & Baby Care", desc: "NICU-trained night nurses, midwives and newborn caregivers — Nordic-employed and clinically trained.", img: "/images/older2.jpg", href: "/mother-and-baby" },
    { title: "IV Therapy at Home", desc: "IV therapy and vitamin drips at home, administered by DHA-licensed nurses across Dubai.", img: "/images/older3.jpg", href: "/iv-therapy" },
    { title: "Weight Loss Rx", desc: "GLP-1 medication management with physician-led care plans, delivered at home.", img: "/images/older4.jpg", href: "/weight-loss" },
  ];
  return (
    <section className="bg-[#F7F4EE] py-20 px-6">
      <div className="max-w-[1100px] mx-auto">
        <FadeIn className="mb-10">
          <h2 className="font-semibold text-[#1a2e28] leading-tight" style={{ fontSize: "clamp(24px, 2.8vw, 36px)" }}>We also serve</h2>
          <p className="text-[#6B7280] text-sm mt-2">More ways Nordic cares for your family at home.</p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.08}>
              <a href={card.href} className="group block bg-white rounded-2xl overflow-hidden border border-black/6 hover:shadow-md transition-all duration-300">
                <div className="relative h-44 overflow-hidden bg-[#e8e4dc]">
                  <Image src={card.img} alt={card.title} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-500" unoptimized />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#1a2e28] text-base mb-1.5">{card.title}</h3>
                  <p className="text-[#6B7280] text-xs leading-relaxed mb-4">{card.desc}</p>
                  <span className="inline-flex items-center gap-1 text-[#1a2e28] text-xs font-semibold group-hover:gap-2 transition-all">
                    Learn more
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Modal ────────────────────────────────────────────────────────
const CARE_TYPES = ["Companionship", "Post-Hospital", "Overnight", "Dementia Support", "Daily Care"];

function PricingModal({ onClose }: { onClose: () => void }) {
  const [careType, setCareType] = useState("Companionship");
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const estimated = Math.round(hoursPerDay * daysPerWeek * 4.33 * 33);
  const waMsg = encodeURIComponent(`Hi Nordic! I'd like to book:\n- Care: ${careType}\n- ${hoursPerDay}h/day · ${daysPerWeek} days/week\n- Estimated: AED ${estimated.toLocaleString()}/month`);
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.22 }} className="bg-white rounded-[20px] w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="p-7 space-y-5">
          <div><p className="text-[#1F3C34] text-xs font-semibold uppercase tracking-widest mb-1">Pricing</p><h3 className="text-2xl font-bold text-[#222222]">Calculate Your Care Plan</h3></div>
          <div>
            <label className="block text-xs font-semibold text-[#222222] mb-2">Care Type</label>
            <select value={careType} onChange={e => setCareType(e.target.value)} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none">{CARE_TYPES.map(t => <option key={t}>{t}</option>)}</select>
          </div>
          <div>
            <div className="flex justify-between mb-2"><label className="text-xs font-semibold text-[#222222]">Hours Per Day</label><span className="text-[#1F3C34] font-bold text-sm">{hoursPerDay}h</span></div>
            <input type="range" min={4} max={24} value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))} className="w-full accent-[#1F3C34] cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between mb-2"><label className="text-xs font-semibold text-[#222222]">Days Per Week</label><span className="text-[#1F3C34] font-bold text-sm">{daysPerWeek} days</span></div>
            <input type="range" min={1} max={7} value={daysPerWeek} onChange={e => setDaysPerWeek(Number(e.target.value))} className="w-full accent-[#1F3C34] cursor-pointer" />
          </div>
          <div className="bg-[#F6F2EB] rounded-xl p-4 text-center border border-[#1F3C34]/10">
            <p className="text-xs text-[#6B7280] mb-1">Estimated Monthly Cost</p>
            <p className="text-3xl font-bold text-[#1F3C34]">AED {estimated.toLocaleString()}</p>
          </div>
          <a href={`https://wa.me/${WA_NUM}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#1F3C34] text-white font-semibold py-3.5 rounded-xl text-sm">Book This Plan</a>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function ElderlyCarePage() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollToCta = () => ctaRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-[#F7F4EE] min-h-screen font-sans">

      {/* HERO */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/nurse_with_elder.png" alt="Elderly care at home Dubai" fill className="object-cover object-center" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e28]/85 via-[#2D5B4F]/75 to-[#1a2e28]/85" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full pt-28 pb-16">
          <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-5">
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-[11px] font-semibold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
                  Elderly Care · Dubai · DHA-Licensed
                </span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-bold text-white leading-[1.1] mb-3 max-w-2xl" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
                Elderly Care at Home<br />
                <span className="font-normal text-white/70" style={{ fontSize: "clamp(18px, 3vw, 34px)" }}>Clinically-Trained, Nordic-Employed Caregivers</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/60 text-base leading-relaxed mb-6 max-w-md">
                Daytime. Overnight. Post-hospital and beyond.
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="text-white/80 text-lg font-medium mb-8 max-w-lg">
                One trained caregiver, every step of the way.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-3">
                <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-[#1a2e28] font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-[#F7F4EE] transition">
                  <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                  Talk to us now
                </a>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0, y: [0, -12, 0] }} transition={{ duration: 0.8, delay: 0.4, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }} className="hidden lg:block">
              <HeroSlider />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES — grouped by category from admin */}
      <CategoryServicesSection />

      {/* SCROLL STICKY */}
      <ScrollStickySection />

      {/* STACKED SCROLL CARDS */}
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

      {/* VIDEO TESTIMONIAL */}
      <VideoTestimonialSection />

      {/* FAQ */}
      <section className="bg-[#F7F4EE] py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <FadeIn className="mb-10 text-center">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28]">Questions? Answers.</h2>
          </FadeIn>
          <div className="space-y-2">
            {[
              { q: "What types of elderly care do you provide?", a: "We provide companionship, post-hospital recovery, overnight care, dementia support, daily personal care, mobility assistance, and medication management — all by DHA-licensed caregivers at home." },
              { q: "How much does elderly home care cost?", a: "Services start from AED 33/hr. Use our pricing calculator or contact us for a personalised quote based on your specific needs." },
              { q: "Are caregivers DHA licensed?", a: "Yes. All Nordic caregivers are DHA licensed, clinically trained, and undergo rigorous background checks before placement." },
              { q: "Can I always have the same caregiver?", a: "Yes. With a monthly subscription plan you keep the exact same caregiver for every visit — consistency matters for elderly care." },
              { q: "What Dubai areas do you cover?", a: "We cover all Dubai areas — Marina, Downtown, JBR, Palm Jumeirah, DIFC, Business Bay, JLT and more." },
              { q: "Do you provide dementia or Alzheimer's care?", a: "Yes. We have specialist caregivers trained in dementia and Alzheimer's care, providing safe, compassionate, and structured support at home." },
              { q: "Can I book care for just a few hours?", a: "Yes. We offer hourly, daily, overnight, and monthly plans with full flexibility to suit your schedule and budget." },
              { q: "Are your caregivers Nordic employees or freelancers?", a: "All caregivers are directly employed by Nordic — never freelancers — ensuring consistent standards, proper insurance, and full accountability." },
              { q: "What happens if my loved one needs emergency support?", a: "Our team is available 24/7. Your caregiver is trained for emergencies and our coordination team can be reached any time for urgent support." },
              { q: "Can the caregiver accompany my loved one to hospital appointments?", a: "Yes. Our caregivers can accompany your loved one to medical appointments, manage communication with doctors, and provide continuity of care." },
            ].map(({ q, a }, i) => <FaqItem key={q} q={q} a={a} idx={i} />)}
          </div>
        </div>
      </section>

      {/* OUR SERVICES — from admin */}
      <ServicesSection
        categoryFilter="elderly"
        heading="Elderly Care Services"
        subheading="All services delivered at home by DHA-licensed, clinically trained caregivers."
        label="Our Services"
        accentColor="#1F3C34"
        bgColor="bg-[#F6F2EB]"
      />

     

      {/* FINAL CTA */}
      <section className="bg-[#F7F4EE] py-16 px-6" ref={ctaRef}>
        <div className="max-w-[860px] mx-auto">
          <FadeIn>
            <div className="bg-white rounded-3xl px-8 sm:px-16 py-14 text-center shadow-sm border border-black/5">
              <div className="inline-flex items-center gap-2 mb-6">
                <svg className="w-4 h-4 text-[#2D5B4F]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#2D5B4F] text-xs font-semibold">UAE&apos;s #1 home care provider for elderly.</span>
              </div>
              <h2 className="font-bold text-[#1a2e28] leading-[1.12] mb-4" style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
                Book your loved one&apos;s first<br />care visit today.
              </h2>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Clinically-trained caregivers, Nordic-employed and never freelance. Plans start from AED 33/hr with full flexibility.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 bg-[#1a2e28] text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-[#23463D] transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511" /></svg>
                  Book on WhatsApp
                </motion.a>
                <motion.a href={CALL_NUM} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center gap-2 border border-[#1a2e28]/20 text-[#1a2e28] font-semibold px-7 py-3.5 rounded-full text-sm hover:border-[#1a2e28]/50 transition-all">
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
