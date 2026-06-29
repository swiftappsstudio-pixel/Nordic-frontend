"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Category, CategoryWithServices, Service } from "@/app/_common/interfaces";
import { getCategories } from "@/app/_common/api";

const WA_NUM = "971581649910";
const CALL_NUM = "tel:+971581649910";

const FAQS_DEFAULT = [
  { q: "How do I book a service?", a: "Simply click 'Book Now' on any service, or reach out to us via WhatsApp. Our team responds within minutes and guides you through the booking process." },
  { q: "Are the nurses and caregivers licensed?", a: "Yes. All our nurses are DHA-licensed and clinically trained. Every caregiver undergoes thorough background checks, skill assessments, and licence verification." },
  { q: "Can I book for same-day?", a: "Yes, subject to availability. WhatsApp us for the fastest booking confirmation." },
  { q: "What areas of Dubai do you cover?", a: "We cover all areas including Dubai Marina, JBR, Downtown, Palm Jumeirah, DIFC, Business Bay, JLT, and more." },
  { q: "What payment methods do accepted?", a: "We accept cash on delivery. No prepayment required — pay when the service is completed at your home." },
  { q: "Can I cancel or reschedule?", a: "Absolutely. Contact us at 24 hours before your appointment to cancel or reschedule with no penalty." },
  { q: "Is there a subscription plan?", a: "We offer flexible hourly, daily, overnight, and monthly plans with full flexibility to suit your schedule and budget." },
  { q: "Do you provide emergency support?", a: "Our team is available 24/7. Your caregiver is trained for emergencies and our coordination team can be reached any time for urgent support." },
];

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

function WaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511" />
    </svg>
  );
}

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

function CategorySection({ cat }: { cat: CategoryWithServices }) {
  return (
    <div className="mb-16 last:mb-0">
      <div className="mb-6">
        <h3 className="text-black font-brand text-[clamp(22px,2.4vw,36px)] leading-[1.2] font-normal tracking-[-0.3px] lg:tracking-[-0.6px]">Services in &ldquo;<span className="font-bold underline" style={{ textDecorationColor: "#543826" }}>{cat.name}</span>&rdquo;</h3>
        {cat.description && (
          <p className="text-gray-500 text-sm leading-relaxed mt-1">{cat.description}</p>
        )}
      </div>

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
  );
}

interface CategoryPageClientProps {
  categories: CategoryWithServices[];
}

export default function CategoryPageClient({ categories }: CategoryPageClientProps) {
  const mainCategory = categories[0];
  const waMsg = encodeURIComponent(`Hi Nordic! I'd like to learn more about ${mainCategory?.name || "IV Therapy"} services.`);
  const [otherCategories, setOtherCategories] = useState<Category[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollToCta = () => ctaRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    getCategories().then((cats) => {
      const ids = categories.map((c) => c._id);
      setOtherCategories(cats.filter((c) => !ids.includes(c._id)));
    }).catch(() => {});
  }, [categories]);

  return (
    <div className="bg-[#F7F4EE] min-h-screen font-sans">
      {/* HERO */}
      <section className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          {mainCategory?.image ? (
            <Image src={mainCategory.image} alt={mainCategory.name} fill className="object-cover object-center" priority unoptimized />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1F3C34] to-[#2D5B4F]" />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.72) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full pb-10 pt-32">
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-medium text-white leading-[1.05] tracking-tight mb-4 max-w-2xl" style={{ fontSize: "clamp(38px, 5.5vw, 68px)" }}>
            Lose weight in 4 weeks with
            <br />
            <span className="text-white/70" style={{ fontWeight: 400, fontSize: "clamp(28px, 4vw, 52px)" }}>
              our online weight loss clinic
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/80 text-base leading-relaxed mb-6 max-w-lg">
            Personalized for each individual with long lasting results
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }} className="flex flex-col gap-3 mb-8">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              <span className="text-white/80 text-sm font-medium">Prescription treatments proven by science</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              <span className="text-white/80 text-sm font-medium">24x7 access to care and doctors, 100% online, and over 1000+ satisfied users</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-3">
            <motion.a href={`https://wa.me/${WA_NUM}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2 bg-white text-[#222222] font-semibold px-6 py-3 rounded-full text-sm shadow-md">
              <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
              Talk to us now
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-[#543826]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-2">
            {["DHA Licensed Nurses", "Available 24 / 7", "All Dubai Areas", "Pharmaceutical-Grade", "Cash on Delivery"].map((t) => (
              <span key={t} className="text-white/70 text-xs font-medium whitespace-nowrap">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* OUR SERVICES - Multiple Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Our Services</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Services in {mainCategory?.name || "Weight Loss"}</h2>
            <p className="text-gray-400 text-sm mt-2">All services delivered at home by DHA-licensed professionals across Dubai.</p>
          </motion.div>

          {categories.map((cat) => (
            <CategorySection key={cat._id} cat={cat} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#543826] text-xs font-semibold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How it works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Book in Seconds", desc: "Select your service, choose a date and time that works for you — online or via WhatsApp." },
              { num: "02", title: "Quick Assessment", desc: "Our team does a brief health check to ensure the right service for your needs." },
              { num: "03", title: "Caregiver Arrives", desc: "A DHA-licensed nurse or caregiver comes to your home within 30–60 minutes." },
              { num: "04", title: "Feel the Difference", desc: "Sit back and let our professional team care for you. Most clients feel results quickly." },
            ].map((s) => (
              <div key={s.num} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow h-full">
                <div className="w-12 h-12 bg-[#543826] text-white rounded-2xl flex items-center justify-center font-bold text-base mb-5 shadow-sm shadow-[#543826]/20">{s.num}</div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#F7F4EE]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-16 items-start">
            <div>
              <h2 className="font-semibold text-[#1a2e28] leading-[1.1]" style={{ fontSize: "clamp(28px, 3vw, 42px)" }}>
                Questions?<br />Answers.
              </h2>
            </div>
            <div className="divide-y divide-[#1a2e28]/10">
              {FAQS_DEFAULT.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
            </div>
          </div>
        </div>
      </section>

      {/* OTHER CATEGORIES */}
      {otherCategories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="font-semibold text-[#1a2e28]" style={{ fontSize: "clamp(24px, 2.8vw, 36px)" }}>We also serve</h2>
              <p className="text-[#6B7280] text-sm mt-2">More ways Nordic cares for your family at home.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherCategories.slice(0, 3).map((cat) => (
                <Link key={cat._id} href={cat.link || `/${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="group block bg-white rounded-2xl overflow-hidden border border-black/6 hover:shadow-md transition-all duration-300">
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-500" unoptimized />
                    ) : (
                      <div className="w-full h-full bg-[#e8e4dc] flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#543826]/30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-[#1a2e28] text-base mb-1.5">{cat.name}</h3>
                    {cat.description && <p className="text-[#6B7280] text-xs leading-relaxed mb-4">{cat.description}</p>}
                    <span className="inline-flex items-center gap-1 text-[#1a2e28] text-xs font-semibold group-hover:gap-2 transition-all">
                      Learn more
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="py-16 px-6 bg-[#F7F4EE]" ref={ctaRef}>
        <div className="max-w-[860px] mx-auto">
          <div className="bg-white rounded-3xl px-8 sm:px-16 py-14 text-center shadow-sm border border-black/5">
            <div className="inline-flex items-center gap-2 mb-6">
              <svg className="w-4 h-4 text-[#543826]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[#543826] text-xs font-semibold">UAE&apos;s trusted home healthcare provider.</span>
            </div>
            <h2 className="font-bold text-[#1a2e28] leading-[1.12] mb-4" style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
              Book your first<br />IV Therapy visit today.
            </h2>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              DHA-licensed nurses and caregivers, Nordic-employed and never freelance. Flexible plans from AED 33/hr.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`https://wa.me/${WA_NUM}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#1a2e28] text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-[#23463D] transition-all">
                <WaIcon className="w-4 h-4" /> Book on WhatsApp
              </a>
              <a href={CALL_NUM} className="inline-flex items-center justify-center gap-2 border border-[#1a2e28]/20 text-[#1a2e28] font-semibold px-7 py-3.5 rounded-full text-sm hover:border-[#1a2e28]/50 transition-all">
                Call us, toll-free
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}