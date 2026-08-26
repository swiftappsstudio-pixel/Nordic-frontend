"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { getCategoryByLink } from "@/app/_common/api";
import { CategoryWithServices, Service } from "@/app/_common/interfaces";

const WA_NUM = "971581649910";
const WA_MSG = encodeURIComponent("Hi Nordic! I'd like to book an IV therapy session at home in Dubai.");
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

function ServiceCard({ svc }: { svc: Service }) {
  const router = useRouter();
  return (
    <Link href={`/services/${svc._id}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {svc.images?.[0] ? (
          <Image src={svc.images[0]} alt={svc.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#543826]/10 to-[#543826]/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#543826]/30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        )}
        {svc.discountPrice && svc.actualPrice && (
          <div className="absolute top-3 right-3 bg-[#543826] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
            Get Best Offer
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
        {/* <FadeIn className="mb-12">
          <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Our Services</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Services in IV Therapy</h2>
          <p className="text-gray-400 text-sm mt-2">All IV drips delivered at home by DHA-licensed nurses across Dubai.</p>
        </FadeIn> */}

        {categories.map((cat) => (
          <div key={cat._id} className="mb-16">
             <FadeIn>
              <div className="mb-12">
               

                <h1
                  className="
        font-inter
        text-[#143D3D]
        text-[clamp(32px,4vw,56px)]
        leading-[1.1]
        font-medium
        tracking-[-0.03em]
      "
                >
                  {cat.name}
                </h1>

                {cat.description && (
                  <p className="mt-4 max-w-3xl text-lg text-[#6B7280] leading-relaxed">
                    {cat.description}
                  </p>
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

const IV_CATEGORIES = [
  {
    tag: "Hydration",
    title: "Hydration Drips",
    desc: "Replenish fluids and electrolytes fast. Ideal after travel, illness, or intense activity. Feel recharged within 30 minutes.",
    img: "/images/Immune-Boost-Hydration-B.webp",
    benefits: ["Fast dehydration relief", "Electrolyte balance", "30–60 min session"],
  },
  {
    tag: "Immunity",
    title: "Immunity Boosters",
    desc: "High-dose Vitamin C, Zinc & antioxidants to strengthen your immune system and fight seasonal infections.",
    img: "/images/nurse.png",
    benefits: ["Vitamin C + Zinc blend", "Fights seasonal bugs", "Strengthens defenses"],
  },
  {
    tag: "Energy",
    title: "Energy & Recovery",
    desc: "B-complex vitamins, amino acids & CoQ10 to restore energy, reduce burnout, and accelerate recovery.",
    img: "/images/health.png",
    benefits: ["Beat fatigue fast", "B-complex + CoQ10", "Post-workout recovery"],
  },
  {
    tag: "Beauty",
    title: "Beauty & Glow",
    desc: "Glutathione, collagen-boosters & biotin for radiant skin, stronger hair, and visible anti-aging results.",
    img: "/images/health2.png",
    benefits: ["Glutathione infusion", "Skin radiance boost", "Hair & nail strength"],
  },
  {
    tag: "Detox",
    title: "Detox & Wellness",
    desc: "Liver-supporting blends & antioxidant drips to cleanse, rebalance, and revitalise your body from within.",
    img: "/images/healthcare.png",
    benefits: ["Liver cleanse support", "Antioxidant flush", "Full-body reset"],
  },
];

export default function IVTherapyPage() {
  return (
    <div className="bg-[#F7F4EE] min-h-screen font-sans">

      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#1a2e28]">
        <div className="absolute inset-0">
          <Image src="/images/Immune-Boost-Hydration-B.webp" alt="IV Therapy at Home Dubai" fill sizes="100vw" className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e28]/95 via-[#1a2e28]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full pt-28 pb-16">
          <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-5">
                <span className="inline-flex items-center gap-2 bg-[#543826]/15 border border-[#543826]/20 text-[#C9C3B3] text-[11px] font-semibold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
                  <svg className="w-3.5 h-3.5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                  IV Drips at Home · Dubai · DHA-Licensed
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-bold text-white leading-[1.1] mb-3" style={{ fontSize: "clamp(32px, 5vw, 60px)" }}>
                Premium IV Drip Therapy in UAE<br />
                <span className="font-normal text-white/70" style={{ fontSize: "clamp(18px, 3vw, 36px)" }}>Doctor-Formulated, Home Delivered</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/60 text-base leading-relaxed mb-4 max-w-md">
                Hydration, Immunity & Recovery
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="text-white/80 text-lg font-medium mb-8 max-w-md">
                Get your customized wellness drip
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-3 mb-8">
                <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-black font-semibold px-7 py-3.5 rounded-full text-sm transition-all duration-300">
                  <WaIcon className="w-4 h-4" />
                  Book Your IV Drip
                </a>
              </motion.div>

              
            </div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: "480px" }}>
                <Image src="/images/Immune-Boost-Hydration-B.webp" alt="IV Therapy nurse at home" fill sizes="50vw" className="object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e28]/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4">
                    <p className="text-white font-semibold text-sm">Starting from AED 199</p>
                    <p className="text-white/60 text-xs mt-1">Home delivery · DHA-licensed · Same-day booking</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES — "Feel the difference from within" — commented out
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <FadeIn className="mb-14 text-center">
            <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Why IV Therapy</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight">Feel the difference from within</h2>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251-1.066-.78-1.778-1.75-1.778-1.25 0-2 1.104-2 2.5v4.632m5.75-8.354c.251-1.066.78-1.778 1.75-1.778 1.25 0 2 1.104 2 2.5v4.632M12 12.75V3.104M5 14.5l-1.43 1.43a2.25 2.25 0 01-3.182 0l-.067-.067a2.25 2.25 0 010-3.182l3.32-3.32A2.25 2.25 0 015 14.5z" /></svg>,
                title: "100% Absorption",
                desc: "Vitamins delivered directly into your bloodstream — no digestion loss, maximum effect.",
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                title: "Results in 30 Min",
                desc: "Feel hydration, energy, and clarity within 30–60 minutes of your session starting.",
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
                title: "DHA-Licensed Nurses",
                desc: "Every session is administered by a certified nurse with sterile, medical-grade equipment.",
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
                title: "At Your Doorstep",
                desc: "No clinic, no waiting room. A nurse arrives at your home with everything needed.",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="bg-[#F7F4EE] rounded-2xl p-6 border border-transparent hover:border-[#543826]/15 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#543826] flex items-center justify-center text-white mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-[#1a2e28] text-base leading-snug mb-2">{item.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      — end comment */}

      {/* SERVICES — grouped by category from admin */}
      <CategoryServicesSection />

      {/* FAQ */}
      <section className="bg-[#F7F4EE] py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <FadeIn className="mb-10 text-center">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28]">Questions? Answers.</h2>
          </FadeIn>
          <div className="space-y-2">
            {[
              { q: "What is IV therapy?", a: "IV therapy delivers vitamins, minerals, electrolytes, and medications directly into your bloodstream via a sterile drip — bypassing digestion for maximum absorption and faster results." },
              { q: "Is IV therapy safe at home?", a: "Absolutely. All sessions are administered by DHA-licensed nurses with sterile, medical-grade equipment. Your vitals are monitored throughout the entire session." },
              { q: "How long does an IV drip session take?", a: "Most sessions take 30–60 minutes depending on the drip type. The nurse stays with you the entire time to monitor comfort and progress." },
              { q: "Do I need a prescription?", a: "No prescription is required for our wellness drips (hydration, immunity, energy, beauty, detox). If a medically-specific drip is needed, our visiting doctor can issue a prescription." },
              { q: "What areas in Dubai do you cover?", a: "We cover all Dubai areas — Marina, Downtown, JBR, Palm Jumeirah, DIFC, Business Bay, JLT, and more. A nurse arrives at your door at your scheduled time." },
              { q: "How much does IV therapy cost?", a: "Prices vary by drip type. Visit our services section above for transparent pricing, or message us on WhatsApp for a personalised recommendation." },
              { q: "Can I book same-day?", a: "Yes. Most bookings are confirmed within 15 minutes and a nurse can arrive within 60 minutes for urgent requests." },
              { q: "What drips are available?", a: "We offer Hydration, Immunity Boost, Energy & Recovery, Beauty & Glow, Detox & Wellness, and custom-formulated drips based on your specific health goals." },
            ].map(({ q, a }, i) => <FaqItem key={q} q={q} a={a} idx={i} />)}
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