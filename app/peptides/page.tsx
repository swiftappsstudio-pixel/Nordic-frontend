"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { getServices } from "@/app/_common/api";
import { Service } from "@/app/_common/interfaces";

const WA_NUM = "971555828945";
const WA_MSG = encodeURIComponent("Hi Nordic! I'd like to learn more about Peptide Therapy.");
const CALL_NUM = "tel:+971555828945";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

// Single peptide card — DarDoc style
function PeptideCard({ svc, delay = 0 }: { svc: Service; delay?: number }) {
  const router = useRouter();
  return (
    <FadeIn delay={delay}>
      <div className="bg-[#F2EDE6] rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group">
        {/* Image area */}
        <div className="relative flex items-center justify-center bg-[#EDE8E0] p-4" style={{ minHeight: "140px" }}>
          {svc.images?.[0] ? (
            <div className="relative w-full h-28">
              <Image
                src={svc.images[0]}
                alt={svc.title}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-20 h-28 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#2D5B4F]/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-3 flex flex-col flex-1">
          <p className="text-[#1a2e28] font-semibold text-sm leading-snug mb-2">{svc.title}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[#1a2e28] text-xs font-medium">
              {svc.discountPrice
                ? <>₿ {svc.discountPrice}</>
                : svc.actualPrice
                ? <>₿ {svc.actualPrice}</>
                : null}
            </span>
            <button
              onClick={() => router.push(`/services/${svc._id}/book`)}
              className="text-[11px] font-semibold text-white bg-[#1a2e28] px-3 py-1.5 rounded-full hover:bg-[#2D5B4F] transition"
            >
              Learn more
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export default function PeptidesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getServices()
      .then((all) => {
        // Filter: category contains "peptide" (case-insensitive)
        // Admin just needs to set category to anything containing "peptide"
        const peptides = all.filter((s) => {
          const cat = (s.category || "").toLowerCase();
          const title = (s.title || "").toLowerCase();
          return cat.includes("peptide") || title.includes("peptide");
        });
        setServices(peptides.length > 0 ? peptides : []);
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  // Group by category
  const categories = Array.from(new Set(services.map((s) => s.category).filter(Boolean) as string[]));
  const grouped: Record<string, Service[]> = {};
  categories.forEach((cat) => { grouped[cat] = services.filter((s) => s.category === cat); });
  const uncategorised = services.filter((s) => !s.category);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F4EE" }}>

      {/* HERO */}
      <section className="relative min-h-[55vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e28] via-[#2D5B4F] to-[#1a2e28]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #fff 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full pb-12 pt-28">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-white/60 text-[11px] font-medium uppercase tracking-[0.18em] mb-4">
            Peptide Therapy · Anti-Aging · Recovery · Dubai
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-semibold text-white leading-[1.05] mb-4 max-w-2xl" style={{ fontSize: "clamp(28px, 5vw, 60px)" }}>
            Peptide Therapy<br />
            <span className="text-white/60" style={{ fontSize: "clamp(18px, 3vw, 34px)", fontWeight: 400 }}>at Home in Dubai</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/70 text-base mb-7 max-w-lg">
            Pharmaceutical-grade peptide protocols delivered at home by DHA-licensed nurses. Anti-aging, recovery, performance and longevity.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-3">
            <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-[#1a2e28] font-semibold px-6 py-3 rounded-full text-sm shadow-md hover:bg-[#F7F4EE] transition">
              <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
              Talk to us now
            </a>
            <button onClick={() => servicesRef.current?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 bg-white/15 border border-white/40 text-white font-semibold px-6 py-3 rounded-full text-sm backdrop-blur-sm hover:bg-white/20 transition">
              Find your protocol
            </button>
          </motion.div>
        </div>
      </section>

      {/* PROTOCOLS */}
      <section ref={servicesRef} className="py-16 px-6">
        <div className="max-w-[1280px] mx-auto">

          <FadeIn className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1a2e28]">Find your personalised protocol</h2>
          </FadeIn>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#2D5B4F]/20 border-t-[#2D5B4F] rounded-full animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-[#6B7280]">
              <p className="text-lg font-medium mb-2">No peptide protocols available yet.</p>
              <p className="text-sm">Our team is adding protocols. Message us for personalised recommendations.</p>
            </div>
          ) : (
            <>
              {/* Grouped by category */}
              {categories.map((cat) => (
                <div key={cat} className="mb-12">
                  <FadeIn>
                    <h3 className="text-base font-semibold text-[#1a2e28] mb-5">{cat}</h3>
                  </FadeIn>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {grouped[cat].map((svc, i) => (
                      <PeptideCard key={svc._id} svc={svc} delay={i * 0.04} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Uncategorised */}
              {uncategorised.length > 0 && (
                <div className="mb-12">
                  <FadeIn>
                    <h3 className="text-base font-semibold text-[#1a2e28] mb-5">Other Protocols</h3>
                  </FadeIn>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {uncategorised.map((svc, i) => (
                      <PeptideCard key={svc._id} svc={svc} delay={i * 0.04} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6">
        <div className="max-w-[860px] mx-auto">
          <div className="bg-white rounded-3xl px-8 sm:px-16 py-12 text-center shadow-sm border border-black/5">
            <div className="inline-flex items-center gap-2 mb-5">
              <svg className="w-4 h-4 text-[#2D5B4F]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[#2D5B4F] text-xs font-semibold">DHA-licensed · Pharmaceutical-grade · Home delivery</span>
            </div>
            <h2 className="font-bold text-[#1a2e28] mb-4" style={{ fontSize: "clamp(20px, 3vw, 36px)" }}>
              Not sure which protocol is right for you?
            </h2>
            <p className="text-[#6B7280] text-sm mb-7 max-w-sm mx-auto">
              Message our team and we will recommend the right peptide protocol based on your health goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#1a2e28] text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-[#2D5B4F] transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                Ask on WhatsApp
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
