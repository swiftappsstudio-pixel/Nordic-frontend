"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { getServices } from "@/app/_common/api";
import { Service } from "@/app/_common/interfaces";

const WA_NUM = "971555828945";
const WA_MSG = encodeURIComponent("Hi Nordic! I'd like to book a blood test at home in Dubai.");
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

export default function BloodTestPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getServices()
      .then((all) => {
        // Filter: category contains "blood" or "test" (case-insensitive)
        // Admin just needs to set category to e.g. "Blood Test" or "Blood Panel"
        const blood = all.filter((s) => {
          const cat = (s.category || "").toLowerCase();
          const title = (s.title || "").toLowerCase();
          return cat.includes("blood") || cat.includes("test") || cat.includes("panel") || title.includes("blood test");
        });
        setServices(blood.length > 0 ? blood : []);
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
    <div className="bg-[#F7F4EE] min-h-screen">

      {/* HERO */}
      <section className="relative min-h-[60vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/health.png" alt="Blood test at home Dubai" fill className="object-cover object-center" priority unoptimized />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.72) 80%)" }} />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full pb-12 pt-32">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-white/60 text-[11px] font-medium uppercase tracking-[0.18em] mb-4">
            Blood Tests at Home · Dubai · Results in 24–48 Hours
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-medium text-white leading-[1.05] mb-4 max-w-2xl" style={{ fontSize: "clamp(28px, 5vw, 62px)" }}>
            Blood Tests<br />
            <span className="text-white/60" style={{ fontSize: "clamp(18px, 3vw, 36px)", fontWeight: 400 }}>at Home in Dubai</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/70 text-base mb-7 max-w-lg">
            Comprehensive blood panels collected at home by DHA-licensed nurses. Fast, accurate results with full follow-up support.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-3 mb-6">
            <a href={`https://wa.me/${WA_NUM}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-[#1a2e28] font-semibold px-6 py-3 rounded-full text-sm shadow-md">
              <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
              Book a blood test
            </a>
            <button onClick={() => servicesRef.current?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 bg-white/15 border border-white/40 text-white font-semibold px-6 py-3 rounded-full text-sm backdrop-blur-sm">
              View all panels
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-x-5 gap-y-2">
            {["DHA Licensed Nurses", "Results in 24–48h", "All Dubai Areas", "No Fasting Required for Most Tests"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span className="text-white/70 text-xs font-medium">{t}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SERVICES — grouped by category with image cards */}
      <section ref={servicesRef} className="py-16 px-6">
        <div className="max-w-[1280px] mx-auto">

          <FadeIn className="mb-12">
            <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Our Panels</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28]">Most popular blood panels</h2>
            <p className="text-[#6B7280] text-sm mt-2">The first choice of thousands of Nordic customers across Dubai</p>
          </FadeIn>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#543826]/20 border-t-[#543826] rounded-full animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-[#6B7280]">No blood test panels available yet. Check back soon.</div>
          ) : (
            <>
              {/* Grouped by category — horizontal scroll per group */}
              {categories.map((cat) => (
                <div key={cat} className="mb-12">
                  <FadeIn>
                    <h3 className="text-lg font-semibold text-[#1a2e28] mb-5">{cat}</h3>
                  </FadeIn>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {grouped[cat].map((svc, i) => (
                      <FadeIn key={svc._id} delay={i * 0.05}>
                        <div className="group relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300" style={{ minHeight: "200px" }}>
                          {/* Background image */}
                          <div className="absolute inset-0">
                            {svc.images?.[0] ? (
                              <Image src={svc.images[0]} alt={svc.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#543826]/20 to-[#1a2e28]/30" />
                            )}
                            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.85) 100%)" }} />
                          </div>

                          {/* Content */}
                          <div className="relative z-10 flex flex-col justify-end h-full p-4" style={{ minHeight: "200px" }}>
                            <div className="mt-auto">
                              <h4 className="text-white font-semibold text-base leading-snug mb-1">{svc.title}</h4>
                              {svc.description && (
                                <p className="text-white/60 text-xs leading-relaxed line-clamp-1 mb-3">{svc.description}</p>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-white font-bold text-sm">
                                  {svc.discountPrice ? `AED ${svc.discountPrice}` : svc.actualPrice ? `AED ${svc.actualPrice}` : ""}
                                </span>
                                <button
                                  onClick={() => router.push(`/services/${svc._id}/book`)}
                                  className="text-xs font-semibold text-[#1a2e28] bg-white px-4 py-1.5 rounded-full hover:bg-[#F7F4EE] transition"
                                >
                                  Book now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              ))}

              {/* Uncategorised */}
              {uncategorised.length > 0 && (
                <div className="mb-12">
                  <FadeIn><h3 className="text-lg font-semibold text-[#1a2e28] mb-5">Other Tests</h3></FadeIn>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {uncategorised.map((svc, i) => (
                      <FadeIn key={svc._id} delay={i * 0.05}>
                        <div className="group relative rounded-2xl overflow-hidden" style={{ minHeight: "200px" }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-[#543826]/20 to-[#1a2e28]/30" />
                          <div className="relative z-10 flex flex-col justify-end h-full p-4" style={{ minHeight: "200px" }}>
                            <h4 className="text-white font-semibold text-base mb-1">{svc.title}</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold text-sm">{svc.discountPrice ? `AED ${svc.discountPrice}` : svc.actualPrice ? `AED ${svc.actualPrice}` : ""}</span>
                              <button onClick={() => router.push(`/services/${svc._id}/book`)} className="text-xs font-semibold text-[#1a2e28] bg-white px-4 py-1.5 rounded-full hover:bg-[#F7F4EE] transition">Book now</button>
                            </div>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F7F4EE] py-12 px-6">
        <div className="max-w-[860px] mx-auto">
          <div className="bg-white rounded-3xl px-8 sm:px-16 py-12 text-center shadow-sm border border-black/5">
            <div className="inline-flex items-center gap-2 mb-5">
              <svg className="w-4 h-4 text-[#543826]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span className="text-[#543826] text-xs font-semibold">DHA-licensed nurses · Results in 24–48h · All Dubai</span>
            </div>
            <h2 className="font-bold text-[#1a2e28] mb-4" style={{ fontSize: "clamp(22px, 3vw, 38px)" }}>Book your blood test at home today.</h2>
            <p className="text-[#6B7280] text-sm mb-7 max-w-sm mx-auto">No clinic. No waiting. A DHA-licensed nurse collects your sample at home and results are delivered digitally.</p>
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
