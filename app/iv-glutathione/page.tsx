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
  { title: "Skin Lightening & Brightening", desc: "Reduces melanin production for a radiant, even-toned complexion." },
  { title: "Powerful Antioxidant", desc: "Neutralizes free radicals, slows aging, and protects cells from damage." },
  { title: "Liver Detoxification", desc: "Supports the liver's natural detox pathways for whole-body wellness." },
  { title: "Immune System Boost", desc: "Strengthens immune response and helps the body fight oxidative stress." },
  { title: "Energy & Vitality", desc: "Improves cellular energy production, reduces fatigue and brain fog." },
  { title: "Better Sleep Quality", desc: "Promotes deeper, more restorative sleep by reducing oxidative load." },
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
  { q: "How do I schedule an at-home IV Glutathione + Vitamin C session in Dubai?", a: "Scheduling is simple. You can book an appointment through Valeo's website or mobile app. Select your preferred date and time, and our team will reach on the day of the booking." },
  { q: "Is a prior medical consultation required before booking?", a: "In most cases, no consultation is required. However, if you have underlying health conditions or specific medical concerns, our team will recommend a free doctor consultation before the session." },
  { q: "Can I choose the same nurse for future sessions?", a: "Yes, you can request the same nurse when booking, subject to availability. We'll always do our best to accommodate your preference." },
  { q: "How often is it recommended to take the IV Glutathione + Vitamin C ?", a: "We recommend a gap of 3-5 days after each session." },
  { q: "Can I book my sessions in advance?", a: "Absolutely. You can schedule your Glutathione IV Drip + Vitamin C sessions days or weeks in advance, making it easy to plan around your routine, travel, or special events." },
  { q: "Are blood tests required before taking the IV Glutathione + Vitamin C ?", a: "Blood tests are not always required. However, if you have pre-existing medical conditions or specific health concerns, your doctor or our team may recommend certain tests before starting IV therapy." },
  { q: "Can I eat or drink before or after the session?", a: "Yes, you should eat and drink normally before and after your IV drip. Staying well-hydrated can even make the session more comfortable." },
  { q: "Is it safe during pregnancy or breastfeeding?", a: "IV Glutathione + Vitamin C therapy is not recommended during pregnancy or breastfeeding." },
  { q: "What should I do if I feel unwell during or after the session?", a: "If you feel any discomfort during the session, notify your nurse immediately so they can take appropriate steps. If you experience any unusual symptoms after the session, contact Valeo support or seek medical attention." },
  { q: "What safety measures are followed during administration?", a: "Our team follows strict DHA protocols, including verifying medical history, using sterile equipment, monitoring you during the drip, and following post-care guidelines to ensure a safe experience." },
  { q: "Are nurses vaccinated and medically cleared?", a: "Yes. All our nurses undergo routine medical checks, vaccinations, and clearances to ensure they are fit to provide home healthcare." },
  { q: "Is the session held at-home?", a: "Yes, they are administered at-home by DHA-licensed nurses." },
  { q: "Is IV Glutathione + Vitamin C safe to take?", a: "Yes, IV Glutathione + Vitamin C is absolutely safe to take. However, if you feel dizziness or nausea, report it to the nurse immediately." },
  { q: "Is it possible to reschedule if I book a pack of 3?", a: "Yes, you can easily reschedule your appointment. However, please note: changes made less than 4 hours before your session may incur a cancellation fee." },
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
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-[#1a2e28]">
        <div className="absolute inset-0">
          <Image src={bgImage} alt="IV Glutathione Therapy at Home Dubai" fill className="object-cover object-center" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e28]/95 via-[#1a2e28]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full pt-28 pb-10">
          <div className="lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-center">
            {/* ── LEFT: Slider ── */}
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
                  >
                    <Image
                      src={sliderImages[sliderIndex]}
                      alt={`Glutathione slider ${sliderIndex + 1}`}
                      width={0} height={0} sizes="100vw"
                      className="w-auto h-auto max-h-[50vh] rounded-[30px]"
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Mobile slider */}
            {sliderImages.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:hidden mt-8 flex justify-center">
                <div className="rounded-[28px] p-[1.5px] bg-gradient-to-b from-white/30 to-white/5 inline-block">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={sliderIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image src={sliderImages[sliderIndex]} alt={`Slider ${sliderIndex + 1}`} width={0} height={0} sizes="100vw" className="w-auto h-auto max-h-[45vh] rounded-[26px]" unoptimized />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ── RIGHT: Title + Info ── */}
            <div>
             

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-bold text-white leading-[1.15] mb-4" style={{ fontSize: "clamp(26px, 3.6vw, 48px)" }}>
                {title}
              </motion.h1>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="flex items-center gap-2 mb-5">
              
                <span className="inline-flex items-center gap-1.5 bg-[#F4F2EF] text-[#1a2e28] text-sm font-medium px-4 py-1.5 rounded-full">Session time: <span className="text-red-500 font-semibold">45 mins - 60 mins</span></span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/10 max-w-md">
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
                    <span className="font-bold">959 <span className="text-xs font-normal text-white/60">AED</span></span>
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span className="text-sm">Buy 3, Get <span className="text-amber-400 font-semibold">2 FREE</span></span>
                    <span className="font-bold">1,437 <span className="text-xs font-normal text-white/60">AED</span></span>
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span className="text-sm">Buy 4, Get <span className="text-amber-400 font-semibold">3 FREE</span></span>
                    <span className="font-bold">1,975 <span className="text-xs font-normal text-white/60">AED</span></span>
                  </div>
                </div>
              </motion.div>

              {heroData?.services?.[0]?._id && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                  <Link href={`/services/${heroData.services[0]._id}`} className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-md">
                    Book Now
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 lg:px-8 bg-[white]">
        <div className="max-w-[800px] mx-auto bg-[#F7F4EE] rounded-2xl p-8 lg:p-10 shadow-sm border border-[#543826]/10">
          <FadeIn className="flex justify-center mb-10">
            <Image src="/images/logo.jpeg" alt="Nordic Logo" width={110} height={44} className="object-contain rounded-full" unoptimized />
          </FadeIn>

          <FadeIn className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">At-Home IV Infusions</h2>
          </FadeIn>

          <div className="flex flex-col">
            <FadeIn delay={0.05}>
              <div className="flex items-start gap-5 pb-5 border-b border-[#543826]/10">
                <div className="w-16 h-16 rounded-full bg-[#543826] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#1a2e28] text-lg">Professional IV Therapy</h3>
                  <p className="text-[#6B7280] text-base mt-1 leading-relaxed">Your treatment in the comfort of your own home — no clinic visits needed.</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="flex items-start gap-5 py-5 border-b border-[#543826]/10">
                <div className="w-16 h-16 rounded-full bg-[#543826] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#1a2e28] text-lg">Highly specialised & focused techniques</h3>
                  <p className="text-[#6B7280] text-base mt-1 leading-relaxed">Advanced protocols tailored to your unique wellness goals.</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex items-start gap-5 py-5 border-b border-[#543826]/10">
                <div className="w-16 h-16 rounded-full bg-[#543826] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#1a2e28] text-lg">Personalised care by DHA-certified professionals</h3>
                  <p className="text-[#6B7280] text-base mt-1 leading-relaxed">Every treatment is guided by licensed experts who put your safety first.</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex items-start gap-5 pt-5">
                <div className="w-16 h-16 rounded-full bg-[#543826] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#1a2e28] text-lg">Comfort driven experience with proven results</h3>
                  <p className="text-[#6B7280] text-base mt-1 leading-relaxed">Relaxing sessions designed for your comfort with visible, lasting outcomes.</p>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.25} className="flex flex-col items-center mt-8">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {heroData?.services?.[0]?._id && (
                <Link href={`/services/${heroData.services[0]._id}`} className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-md">
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
      <section className="bg-[#F7F4EE] py-12 px-6 pb-24">
        <div className="max-w-[860px] mx-auto">
          <FadeIn>
            <div className="bg-white rounded-3xl px-8 sm:px-16 py-14 text-center shadow-sm border border-black/5">
              <div className="inline-flex items-center gap-2 mb-5">
                <svg className="w-4 h-4 text-[#543826]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#543826] text-xs font-semibold">DHA-licensed nurses · All Dubai · At your doorstep</span>
              </div>
              <h2 className="font-bold text-[#1a2e28] mb-4" style={{ fontSize: "clamp(22px, 3vw, 38px)" }}>Book your IV Glutathione at home today.</h2>
              <p className="text-[#6B7280] text-sm mb-7 max-w-sm mx-auto">No clinic. No waiting. A DHA-licensed nurse arrives at your door with everything needed for your Glutathione infusion.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#543826] text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-[#3e2a1c] transition">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                  Book on WhatsApp
                </a>
                <a href={CALL_NUM} className="inline-flex items-center justify-center gap-2 border border-[#1a2e28]/20 text-[#1a2e28] font-semibold px-7 py-3.5 rounded-full text-sm hover:border-[#1a2e28]/50 transition">Call us, toll-free</a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
