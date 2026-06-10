"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { getCategoryByLink } from "@/app/_common/api";
import { CategoryWithServices, Service } from "@/app/_common/interfaces";

const WA_NUM = "971555828945";
const WA_MSG = encodeURIComponent("Hi Nordic! I'd like to book an IV therapy session at home in Dubai.");
const CALL_NUM = "tel:+971555828945";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-6 text-left group">
        <span className="text-[#1a2e28] text-sm font-medium leading-snug group-hover:text-[#2D5B4F] transition-colors">{q}</span>
        <span className="shrink-0 w-6 h-6 flex items-center justify-center text-[#1a2e28]/50">
          <svg className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
        <p className="text-[#6B7280] text-sm leading-relaxed pt-3 pb-1 max-w-2xl">{a}</p>
      </motion.div>
    </div>
  );
}

function ServiceCard({ svc }: { svc: Service }) {
  const router = useRouter();
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
          <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            {Math.round(((svc.actualPrice - svc.discountPrice) / svc.actualPrice) * 100)}% OFF
          </div>
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
        <span className="w-full bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold py-2.5 rounded-xl transition text-sm text-center">
          Book Now
        </span>
      </div>
    </Link>
  );
}

function WaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511" />
    </svg>
  );
}

function CategoryServicesSection() {
  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryByLink("iv-therapy")
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#543826]/20 border-t-[#543826] rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn className="mb-12">
          <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Our Services</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Services in IV Therapy</h2>
          <p className="text-gray-400 text-sm mt-2">All IV drips delivered at home by DHA-licensed nurses across Dubai.</p>
        </FadeIn>

        {categories.map((cat) => (
          <div key={cat._id} className="mb-16">
            <FadeIn>
              <div className="flex items-center gap-4 mb-6">
                {cat.image && (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" unoptimized />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900 text-2xl">Services in &ldquo;{cat.name}&rdquo;</h3>
                  {cat.description && (
                    <p className="text-gray-500 text-sm leading-relaxed mt-1">{cat.description}</p>
                  )}
                </div>
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

const IV_CATEGORIES = [
  {
    tag: "Hydration",
    title: "Hydration Drips",
    desc: "Replenish fluids and electrolytes — ideal after travel, illness, or intense activity. Fast relief from dehydration and fatigue.",
    img: "/images/Immune-Boost-Hydration-B.webp",
  },
  {
    tag: "Immunity",
    title: "Immunity Boosters",
    desc: "High-dose Vitamin C, Zinc, and antioxidants to strengthen your immune system and fight off seasonal infections.",
    img: "/images/nurse.png",
  },
  {
    tag: "Energy",
    title: "Energy & Recovery",
    desc: "B-complex vitamins, amino acids, and CoQ10 — designed to restore energy, reduce burnout, and accelerate recovery.",
    img: "/images/health.png",
  },
  {
    tag: "Beauty",
    title: "Beauty & Glow",
    desc: "Glutathione, collagen-boosting vitamins, and biotin for radiant skin, stronger hair, and anti-aging from the inside out.",
    img: "/images/health2.png",
  },
  {
    tag: "Detox",
    title: "Detox & Wellness",
    desc: "Liver-supporting blends, antioxidant drips, and metabolic boosters to cleanse, rebalance, and revitalise your body.",
    img: "/images/healthcare.png",
  },
];

export default function IVTherapyPage() {
  return (
    <div className="bg-[#F7F4EE] min-h-screen font-sans">

      {/* HERO */}
      <section className="relative min-h-[60vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/Immune-Boost-Hydration-B.webp" alt="IV Therapy at Home Dubai" fill className="object-cover object-center" priority unoptimized />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.72) 80%)" }} />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full pb-12 pt-32">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-white/60 text-[11px] font-medium uppercase tracking-[0.18em] mb-4">
            IV Drips at Home · Dubai · DHA-Licensed Nurses
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-medium text-white leading-[1.05] mb-4 max-w-2xl" style={{ fontSize: "clamp(28px, 5vw, 62px)" }}>
            IV Therapy<br />
            <span className="text-white/60" style={{ fontSize: "clamp(18px, 3vw, 36px)", fontWeight: 400 }}>at Home in Dubai</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/70 text-base mb-7 max-w-lg">
            Hydration, immunity, energy, beauty, and detox drips administered by DHA-licensed nurses — right at your doorstep.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-3 mb-6">
            <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-[#1a2e28] font-semibold px-6 py-3 rounded-full text-sm shadow-md">
              <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
              Book an IV drip
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-x-5 gap-y-2">
            {["DHA Licensed Nurses", "Results in 30–60 min", "All Dubai Areas", "No Clinic Visit Needed"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span className="text-white/70 text-xs font-medium">{t}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* IV CATEGORY CARDS */}
      <section className="py-16 bg-[#F7F4EE]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <FadeIn className="mb-10">
            <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Our Drips</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1a2e28] leading-tight max-w-lg">IV therapy for every need.</h2>
            <p className="text-[#6B7280] mt-3 text-base">Clinically-formulated drips, administered at home by DHA-licensed nurses.</p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {IV_CATEGORIES.map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.07}>
                <motion.div whileHover={{ scale: 1.02 }} className="relative rounded-2xl overflow-hidden flex flex-col group cursor-pointer" style={{ minHeight: "380px" }}>
                  <div className="absolute inset-0">
                    <Image src={card.img} alt={card.title} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-500" unoptimized />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0.85) 100%)" }} />
                  </div>
                  <div className="relative z-10 flex flex-col justify-between h-full p-5" style={{ minHeight: "380px" }}>
                    <span className="self-start text-[9px] text-white/60 uppercase tracking-widest font-medium bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15">{card.tag}</span>
                    <div className="mt-auto">
                      <h3 className="text-white font-semibold text-lg leading-snug mb-3">{card.title}</h3>
                      <p className="text-white/55 text-xs leading-relaxed mb-5">{card.desc}</p>
                      <motion.a href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent(`Hi! I'd like to book a ${card.title} IV drip at home.`)}`} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04 }} className="inline-flex items-center bg-white text-[#1F3C34] text-xs font-semibold px-5 py-2.5 rounded-full">Book now</motion.a>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES — grouped by category from admin */}
      <CategoryServicesSection />

      {/* FAQ */}
      <section className="bg-[#F7F4EE] py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 items-start">
            <FadeIn>
              <h2 className="font-semibold text-[#1a2e28] leading-[1.1] sticky top-24" style={{ fontSize: "clamp(28px, 3vw, 42px)" }}>
                Questions?<br />Answers.
              </h2>
            </FadeIn>
            <div className="divide-y divide-[#1a2e28]/10">
              {[
                { q: "What is IV therapy?", a: "IV therapy delivers vitamins, minerals, electrolytes, and medications directly into your bloodstream via a sterile drip — bypassing digestion for maximum absorption and faster results." },
                { q: "Is IV therapy safe at home?", a: "Absolutely. All sessions are administered by DHA-licensed nurses with sterile, medical-grade equipment. Your vitals are monitored throughout the entire session." },
                { q: "How long does an IV drip session take?", a: "Most sessions take 30–60 minutes depending on the drip type. The nurse stays with you the entire time to monitor comfort and progress." },
                { q: "Do I need a prescription?", a: "No prescription is required for our wellness drips (hydration, immunity, energy, beauty, detox). If a medically-specific drip is needed, our visiting doctor can issue a prescription." },
                { q: "What areas in Dubai do you cover?", a: "We cover all Dubai areas — Marina, Downtown, JBR, Palm Jumeirah, DIFC, Business Bay, JLT, and more. A nurse arrives at your door at your scheduled time." },
                { q: "How much does IV therapy cost?", a: "Prices vary by drip type. Visit our services section above for transparent pricing, or message us on WhatsApp for a personalised recommendation." },
                { q: "Can I book same-day?", a: "Yes. Most bookings are confirmed within 15 minutes and a nurse can arrive within 60 minutes for urgent requests." },
                { q: "What drips are available?", a: "We offer Hydration, Immunity Boost, Energy & Recovery, Beauty & Glow, Detox & Wellness, and custom-formulated drips based on your specific health goals." },
              ].map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F7F4EE] py-12 px-6">
        <div className="max-w-[860px] mx-auto">
          <div className="bg-white rounded-3xl px-8 sm:px-16 py-12 text-center shadow-sm border border-black/5">
            <div className="inline-flex items-center gap-2 mb-5">
              <svg className="w-4 h-4 text-[#543826]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span className="text-[#543826] text-xs font-semibold">DHA-licensed nurses · All Dubai · At your doorstep</span>
            </div>
            <h2 className="font-bold text-[#1a2e28] mb-4" style={{ fontSize: "clamp(22px, 3vw, 38px)" }}>Book your IV drip at home today.</h2>
            <p className="text-[#6B7280] text-sm mb-7 max-w-sm mx-auto">No clinic. No waiting. A DHA-licensed nurse arrives at your door with everything needed for your session.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#543826] text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-[#3e2a1c] transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                Book on WhatsApp
              </a>
              <a href={CALL_NUM} className="inline-flex items-center justify-center gap-2 border border-[#1a2e28]/20 text-[#1a2e28] font-semibold px-7 py-3.5 rounded-full text-sm hover:border-[#1a2e28]/50 transition">
                Call us, toll-free
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}