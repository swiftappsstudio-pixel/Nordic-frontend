"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { getCategoryByLink } from "@/app/_common/api";
import { CategoryWithServices, Service } from "@/app/_common/interfaces";

const WA_NUM = "971581649910";
const WA_MSG = encodeURIComponent("Hi Nordic! I'd like to book an IV Glutathione session at home in Dubai.");
const CALL_NUM = "tel:+971581649910";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

const BENEFITS = [
  { title: "Skin Lightening & Brightening", desc: "Reduces melanin production for a radiant, even-toned complexion.", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" },
  { title: "Powerful Antioxidant", desc: "Neutralizes free radicals, slows aging, and protects cells from damage.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "Liver Detoxification", desc: "Supports the liver's natural detox pathways for whole-body wellness.", icon: "M12 21.75c4.97 0 9-3.694 9-8.25 0-4.556-9-13.5-9-13.5S3 8.944 3 13.5c0 4.556 4.03 8.25 9 8.25z" },
  { title: "Immune System Boost", desc: "Strengthens immune response and helps the body fight oxidative stress.", icon: "M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Energy & Vitality", desc: "Improves cellular energy production, reduces fatigue and brain fog.", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
  { title: "Better Sleep Quality", desc: "Promotes deeper, more restorative sleep by reducing oxidative load.", icon: "M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Book Online", desc: "Select your IV Glutathione package and book a time that works for you." },
  { step: "02", title: "Nurse Arrives", desc: "A DHA-licensed nurse arrives at your home with sterile equipment." },
  { step: "03", title: "IV Infusion", desc: "Relax while the Glutathione drip is administered over 30–60 minutes." },
  { step: "04", title: "Results You Feel", desc: "Notice brighter skin, more energy, and improved well-being." },
];

const FAQS = [
  { q: "What is the IV Glutathione + Vitamin C and how does it work?", a: "Glutathione + Vitamin C is an intravenous therapy that delivers a potent combination of antioxidants directly into the bloodstream. Glutathione IV Drip helps detoxify the body, supports liver function, and reduces oxidative stress, while Vitamin C boosts immunity, promotes collagen production, and enhances overall wellness. Delivered intravenously, these nutrients work faster and more efficiently than oral supplements." },
  { q: "What are the key ingredients in IV Glutathione + Vitamin C ?", a: "The key ingredients in IV Glutathione + Vitamin C are Glutathione 1200mg and Ascorbic Acid 2500 mg known as Vitamin C." },
  { q: "Who can benefit from the IV Glutathione + Vitamin C ?", a: "This therapy may benefit individuals looking to support detoxification, improve skin radiance, boost immunity, combat fatigue, reduce oxidative stress, or maintain overall wellness." },
  { q: "How do I schedule an at-home IV Glutathione + Vitamin C session in Dubai?", a: "Scheduling is simple. You can book through Nordic’s website, WhatsApp, or by calling us. Select your preferred date and time, and our team will confirm your booking." },
  { q: "How often is it recommended to take the IV Glutathione + Vitamin C ?", a: "We recommend a gap of 3-5 days after each session." },
  { q: "Is it safe during pregnancy or breastfeeding?", a: "IV Glutathione + Vitamin C therapy is not recommended during pregnancy or breastfeeding." },
  { q: "What safety measures are followed during administration?", a: "Our team follows strict DHA protocols, including verifying medical history, using sterile equipment, monitoring you during the drip, and following post-care guidelines to ensure a safe experience." },
  { q: "Are there any side effects?", a: "Most people tolerate this IV very well. In some cases, you may experience mild nausea, slight pain, or temporary discomfort at the injection site — but these effects typically resolve quickly." },
];

function ServiceCard({ svc }: { svc: Service }) {
  return (
    <Link href={`/services/${svc._id}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gray-100">
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
          <div className="absolute top-3 right-3 bg-[#543826] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">Get Best Offer</div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{svc.title}</h3>
        {svc.description && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">{svc.description}</p>
        )}
        <div className="mb-4">
          {svc.discountPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">AED {svc.discountPrice}</span>
              <span className="text-sm text-gray-300 line-through font-normal">AED {svc.actualPrice}</span>
            </div>
          ) : svc.actualPrice ? (
            <span className="text-xl font-bold text-gray-900">AED {svc.actualPrice}</span>
          ) : (
            <span className="text-sm text-[#543826] font-semibold">Contact for pricing</span>
          )}
        </div>
        <span className="w-full bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold py-2.5 rounded-xl transition text-sm text-center">Book Now</span>
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
      <section className="py-20 bg-white">
        <div className="px-8 sm:px-12 lg:px-16">
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#543826]/20 border-t-[#543826] rounded-full animate-spin" />
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
              <div className="mb-12">
                <h1 className="font-inter text-[#143D3D] text-[clamp(32px,4vw,56px)] leading-[1.1] font-medium tracking-[-0.03em]">{cat.name}</h1>
                {cat.description && (
                  <p className="mt-4 max-w-3xl text-lg text-[#6B7280] leading-relaxed">{cat.description}</p>
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

export default function IVGlutathionePage() {
  const [heroData, setHeroData] = useState<CategoryWithServices | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    getCategoryByLink("iv-glutathione")
      .then((data) => {
        if (data?.length) {
          const cat = data[0];
         
          setHeroData(cat);
        }
      })
      .catch(() => {});
  }, []);

  const bgImage = heroData?.image || "/images/Immune-Boost-Hydration-B.webp";
  const sliderImages = heroData?.slider || [];
  const title = heroData?.name || "IV Glutathione Therapy";
  const description = heroData?.description || "";

  useEffect(() => {
    if (sliderImages.length < 2) return;
    const t = setInterval(() => {
      setSliderIndex((p) => (p + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(t);
  }, [sliderImages.length]);

  return (
    <div className="bg-[#F7F4EE] min-h-screen font-sans">

      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden bg-[#1a2e28]">
        <div className="absolute inset-0">
          <Image src={bgImage} alt="IV Glutathione Therapy at Home Dubai" fill className="object-cover object-center" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a2e28]/95 via-[#1a2e28]/80 to-[#1a2e28]/95 lg:bg-gradient-to-r lg:from-[#1a2e28]/95 lg:via-[#1a2e28]/70 lg:to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full pt-20 lg:pt-28 pb-10">
          <div className="lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-center">
            {/* ── LEFT: Slider (desktop only) ── */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="hidden lg:flex items-center gap-5 justify-center">
              {/* Vertical thumbnail circles */}
              {sliderImages.length > 0 && (
                <div className="flex flex-col items-center gap-3">
                  {sliderImages.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setSliderIndex(i)}
                      className={`rounded-full overflow-hidden shrink-0 border-2 transition-all duration-300 ${
                        i === sliderIndex
                          ? "w-10 h-10 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                          : "w-8 h-8 border-white/30 hover:border-white/60"
                      }`}
                    >
                      <Image src={src} alt="" width={40} height={40} className="w-full h-full object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}

              {/* Slider image rectangle */}
              <div className="rounded-[32px] p-[1.5px] bg-gradient-to-b from-white/30 to-white/5 inline-block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={sliderIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center justify-center"
                    style={{ height: "50vh" }}
                  >
                    <Image
                      src={sliderImages[sliderIndex]}
                      alt={`Glutathione slider ${sliderIndex + 1}`}
                      width={0} height={0} sizes="100vw"
                      className="w-auto max-h-full rounded-[30px]"
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Mobile slider */}
            {sliderImages.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:hidden mb-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-[28px] p-[1.5px] bg-gradient-to-b from-white/30 to-white/5 inline-block overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={sliderIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center"
                        style={{ height: "35vh" }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -50) {
                            setSliderIndex((p) => (p + 1) % sliderImages.length);
                          } else if (info.offset.x > 50) {
                            setSliderIndex((p) => (p - 1 + sliderImages.length) % sliderImages.length);
                          }
                        }}
                      >
                        <Image src={sliderImages[sliderIndex]} alt={`Slider ${sliderIndex + 1}`} width={0} height={0} sizes="100vw" className="w-auto max-h-full rounded-[26px] pointer-events-none" unoptimized />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  {/* Dot indicators */}
                  {sliderImages.length > 1 && (
                    <div className="flex items-center gap-2">
                      {sliderImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSliderIndex(i)}
                          className={`rounded-full transition-all duration-300 ${
                            i === sliderIndex
                              ? "w-2.5 h-2.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.5)]"
                              : "w-2 h-2 bg-white/40 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── RIGHT: Title + Info ── */}
            <div>
             

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-bold text-white leading-[1.15] mb-4" style={{ fontSize: "clamp(26px, 3.6vw, 48px)" }}>
                {title}
              </motion.h1>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="flex items-center gap-2 mb-4 lg:mb-5">
              
                <span className="inline-flex items-center gap-1.5 bg-[#F4F2EF] text-[#1a2e28] text-sm font-medium px-4 py-1.5 rounded-full">Session time: <span className="text-red-500 font-semibold">45 mins - 60 mins</span></span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-5 mb-5 lg:mb-6 border border-white/10 max-w-md lg:max-w-md">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Flash Sale</span>
                  <span className="text-white/50 text-xs">Summer Glow</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-sm">1 Session</span>
                    <span className="font-bold">479 <span className="text-xs font-normal text-white/60">AED</span></span>
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span className="text-sm">Buy 2, Get <span className="text-amber-400 font-semibold">1 FREE</span></span>
                    <span className="font-bold">1198 <span className="text-xs font-normal text-white/60">AED</span></span>
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span className="text-sm">Buy 4, Get <span className="text-amber-400 font-semibold">2 FREE</span></span>
                    <span className="font-bold">2339 <span className="text-xs font-normal text-white/60">AED</span></span>
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span className="text-sm">Buy 6, Get <span className="text-amber-400 font-semibold">3 FREE</span></span>
                    <span className="font-bold">3419 <span className="text-xs font-normal text-white/60">AED</span></span>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-md">
                  Book Now
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULA / DOSAGE + BENEFITS */}
      <section className="py-16 px-6 lg:px-8 bg-[#F7F4EE]">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn className="text-center mb-10">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">The Formula</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-4">
              IV Glutathione 1200mg + Vitamin C 2500mg
            </h2>
            <p className="text-[#6B7280] text-base max-w-2xl mx-auto leading-relaxed">
              A clinically dosed antioxidant infusion pairing high-dose Glutathione with Vitamin C to detoxify, brighten, and energize — delivered straight into your bloodstream for maximum absorption.
            </p>
          </FadeIn>

          <FadeIn delay={0.05} className="flex flex-nowrap items-center justify-center gap-2 sm:gap-4 mb-14">
            <div className="flex items-center gap-2 sm:gap-3 bg-white border border-[#543826]/10 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 shadow-sm">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#543826]/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#543826]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <div className="text-base sm:text-2xl font-bold text-[#1a2e28] leading-none whitespace-nowrap">1200<span className="text-[10px] sm:text-sm font-medium text-[#6B7280] ml-1">mg</span></div>
                <div className="text-[10px] sm:text-xs text-[#6B7280] font-medium mt-1 whitespace-nowrap">Glutathione</div>
              </div>
            </div>

            <div className="text-base sm:text-2xl text-[#543826]/30 font-light">+</div>

            <div className="flex items-center gap-2 sm:gap-3 bg-white border border-[#543826]/10 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 shadow-sm">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#543826]/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#543826]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c4.97 0 9-3.694 9-8.25 0-4.556-9-13.5-9-13.5S3 8.944 3 13.5c0 4.556 4.03 8.25 9 8.25z" />
                </svg>
              </div>
              <div>
                <div className="text-base sm:text-2xl font-bold text-[#1a2e28] leading-none whitespace-nowrap">2500<span className="text-[10px] sm:text-sm font-medium text-[#6B7280] ml-1">mg</span></div>
                <div className="text-[10px] sm:text-xs text-[#6B7280] font-medium mt-1 whitespace-nowrap">Vitamin C</div>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => (
              <FadeIn key={b.title} delay={0.05 * i}>
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left bg-white rounded-2xl p-6 h-full border border-[#543826]/10 hover:shadow-lg hover:border-[#543826]/20 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#543826] flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#1a2e28] text-base mb-1.5">{b.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{b.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3} className="flex justify-center mt-10">
            <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-md">
              Book Now
            </a>
          </FadeIn>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/images/nurse2.png" alt="" fill className="object-cover object-top" unoptimized />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e28]/95 via-[#1a2e28]/90 to-[#543826]/90" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4A373]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#543826]/30 rounded-full blur-3xl" />

        <div className="relative max-w-[800px] mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/10">
          <FadeIn className="flex justify-center mb-10">
            <div className="bg-white rounded-full p-1.5 shadow-lg">
              <Image src="/images/logo.jpeg" alt="Nordic Logo" width={110} height={44} className="object-contain rounded-full" unoptimized />
            </div>
          </FadeIn>

          <FadeIn className="text-center mb-8">
            <p className="text-[#D4A373] text-xs font-semibold uppercase tracking-widest mb-3">Why Choose Nordic</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">At-Home IV Infusions</h2>
          </FadeIn>

          <div className="flex flex-col">
            <FadeIn delay={0.05}>
              <div className="flex items-start gap-5 pb-5 border-b border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A373] to-[#543826] flex items-center justify-center shrink-0 mt-0.5 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Professional IV Therapy</h3>
                  <p className="text-white/60 text-base mt-1 leading-relaxed">Your treatment in the comfort of your own home — no clinic visits needed.</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="flex items-start gap-5 py-5 border-b border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A373] to-[#543826] flex items-center justify-center shrink-0 mt-0.5 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Highly specialised & focused techniques</h3>
                  <p className="text-white/60 text-base mt-1 leading-relaxed">Advanced protocols tailored to your unique wellness goals.</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex items-start gap-5 py-5 border-b border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A373] to-[#543826] flex items-center justify-center shrink-0 mt-0.5 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Personalised care by DHA-certified professionals</h3>
                  <p className="text-white/60 text-base mt-1 leading-relaxed">Every treatment is guided by licensed experts who put your safety first.</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex items-start gap-5 pt-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A373] to-[#543826] flex items-center justify-center shrink-0 mt-0.5 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Comfort driven experience with proven results</h3>
                  <p className="text-white/60 text-base mt-1 leading-relaxed">Relaxing sessions designed for your comfort with visible, lasting outcomes.</p>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.25} className="flex flex-col items-center mt-8">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {heroData?.services?.[0]?._id && (
                <Link href={`/services/${heroData.services[0]._id}`} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4A373] to-[#543826] hover:brightness-110 text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-md">
                  Book Now
                </Link>
              )}
              <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-md">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                Speak with us
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

    



     

      {/* FAQ */}
      <section className="bg-[#F7F4EE] py-16 px-6">
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

      {/* CTA */}
      <section className="bg-[#F7F4EE] py-12 px-4 sm:px-6 pb-20 sm:pb-24">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl px-5 sm:px-10 lg:px-16 py-12 sm:py-16 text-center shadow-2xl">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e28] via-[#20362f] to-[#543826]" />
              <div className="absolute -top-32 -left-20 w-80 h-80 bg-[#D4A373]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[#543826]/40 rounded-full blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
              />

              <div className="relative">
                <div className="inline-flex items-center gap-2 mb-6 bg-white/10 border border-white/15 rounded-full px-4 py-1.5">
                  <svg className="w-4 h-4 text-[#D4A373]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-xs font-semibold">DHA-licensed nurses · All Dubai · At your doorstep</span>
                </div>

                <h2 className="font-bold text-white mb-4 leading-tight" style={{ fontSize: "clamp(24px, 3.4vw, 42px)" }}>
                  Book your IV Glutathione at home today.
                </h2>
                <p className="text-white/60 text-base mb-9 max-w-lg mx-auto leading-relaxed">
                  No clinic. No waiting. A DHA-licensed nurse arrives at your door with everything needed for your Glutathione infusion.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-10">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <svg className="w-4 h-4 text-[#D4A373] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Certified nurses
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <svg className="w-4 h-4 text-[#D4A373] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    Same-day booking
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <svg className="w-4 h-4 text-[#D4A373] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" /></svg>
                    At your doorstep
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-lg shadow-[#25D366]/20 hover:scale-[1.03]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                    Book on WhatsApp
                  </a>
                  <a href={CALL_NUM} className="inline-flex items-center justify-center gap-2 border border-white/25 bg-white/5 text-white font-semibold px-8 py-3.5 rounded-full text-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    Call us, toll-free
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
