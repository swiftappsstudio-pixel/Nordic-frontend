"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { getServicesByCategory } from "@/app/_common/api";
import { Service } from "@/app/_common/interfaces";

const WA_NUM = "971581649910";
const CALL_NUM = "tel:+971581649910";
const waLink = (msg: string) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;

type TaggedService = Service & { categoryName: string };

// Real Nordic IV categories — the ones most associated with women's beauty,
// skin & anti-aging goals are surfaced first as "Recommended for Women".
const WOMEN_IV_CATEGORIES = [
  { id: "6a2853d495f7cf77b71840a7", name: "Glutathione Boosting Therapy" },
  { id: "6a2851ba95f7cf77b718409f", name: "NAD+ Anti-Aging Therapy" },
  { id: "6a400bad68a7cdda77c897e0", name: "IV Glutathione" },
];

const MORE_IV_CATEGORIES = [
  { id: "6a2854fd95f7cf77b71840ab", name: "Immune Support Therapy" },
  { id: "6a2855fe95f7cf77b71840af", name: "Everyday Wellness Therapy" },
  { id: "6a28562c95f7cf77b71840b4", name: "Vitamin Boosting Therapy" },
  { id: "6a28567495f7cf77b71840b8", name: "Hangover & Recovery Therapy" },
  { id: "6a2856da95f7cf77b71840bc", name: "Fitness & Slimming Therapy" },
];

async function fetchTaggedServices(cats: { id: string; name: string }[]): Promise<TaggedService[]> {
  const groups = await Promise.all(
    cats.map((c) =>
      getServicesByCategory(c.id)
        .then((services) => services.map((s) => ({ ...s, categoryName: c.name })))
        .catch(() => [] as TaggedService[])
    )
  );
  return groups.flat();
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

function ServiceCard({ svc, index }: { svc: TaggedService; index: number }) {
  const waMsg = waLink(`Hi Nordic! I'd like to book "${svc.title}" — Emirati Women's Day offer (40% off).`);
  return (
    <FadeIn delay={0.04 * index} className="h-full">
      <a href={waMsg} target="_blank" rel="noopener noreferrer" className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col h-full">
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
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow">
            40% OFF
          </div>
          {svc.actualPrice != null && (
            <div className="absolute bottom-3 right-3 bg-[#1a2e28]/85 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              AED {svc.actualPrice}
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-[#2D5B4F] text-[10px] font-semibold uppercase tracking-widest mb-1.5">{svc.categoryName}</p>
          <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{svc.title}</h3>
          {svc.description && (
            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">{svc.description}</p>
          )}
          {!svc.description && <div className="flex-1" />}
          {svc.keyBenefits && svc.keyBenefits.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {svc.keyBenefits.slice(0, 2).map((b) => (
                <span key={b} className="bg-[#543826]/5 text-[#543826]/80 text-[10px] font-medium px-2 py-1 rounded-md">{b}</span>
              ))}
            </div>
          )}
          <span className="w-full bg-[#543826] group-hover:bg-[#3e2a1c] text-white font-semibold py-2.5 rounded-xl transition text-sm text-center mt-1">
            Book Now
          </span>
        </div>
      </a>
    </FadeIn>
  );
}

function ServiceGrid({ services }: { services: TaggedService[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {services.map((svc, i) => (
        <ServiceCard key={svc._id} svc={svc} index={i} />
      ))}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-10 h-10 border-4 border-[#543826]/20 border-t-[#543826] rounded-full animate-spin" />
    </div>
  );
}

function IVOffersSection() {
  const [women, setWomen] = useState<TaggedService[]>([]);
  const [more, setMore] = useState<TaggedService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTaggedServices(WOMEN_IV_CATEGORIES), fetchTaggedServices(MORE_IV_CATEGORIES)])
      .then(([w, m]) => {
        setWomen(w);
        setMore(m);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!women.length && !more.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl">
        <p className="text-gray-400 text-base mb-4">Our IV services are being updated — message us directly for this offer.</p>
        <a href={waLink("Hi Nordic! I'd like to know more about your Emirati Women's Day IV offer (40% off).")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-6 py-3 rounded-full text-sm transition">
          Ask on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {women.length > 0 && (
        <div>
          <FadeIn className="mb-8">
            <span className="inline-flex items-center gap-1.5 bg-[#543826]/10 text-[#543826] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
              Recommended for Women
            </span>
            <h3 className="font-bold text-[#1a2e28] text-2xl sm:text-3xl leading-tight">Skin, Glow &amp; Anti-Aging IVs</h3>
            <p className="text-[#6B7280] text-sm mt-2 max-w-2xl">Glutathione, NAD+ and radiance-boosting drips — Nordic&rsquo;s most-loved IV therapies among women.</p>
          </FadeIn>
          <ServiceGrid services={women} />
        </div>
      )}
      {more.length > 0 && (
        <div>
          <FadeIn className="mb-8">
            <h3 className="font-bold text-[#1a2e28] text-2xl sm:text-3xl leading-tight">More IV Therapies</h3>
            <p className="text-[#6B7280] text-sm mt-2 max-w-2xl">Immunity, everyday wellness, vitamins, recovery &amp; fitness drips — all included in the offer.</p>
          </FadeIn>
          <ServiceGrid services={more} />
        </div>
      )}
    </div>
  );
}

const FAQS = [
  { q: "What is the Emirati Women's Day offer?", a: "For a limited time, we're offering 40% off our IV Therapy and IV Glutathione services in celebration of Emirati Women's Day — delivered at home in Dubai by DHA-licensed nurses." },
  { q: "Is the 40% off applied automatically?", a: "Message us on WhatsApp with the IV service you'd like and our team will confirm your discounted price and booking slot directly." },
  { q: "Who can book this offer?", a: "This offer is open to everyone booking an IV Therapy or IV Glutathione session through this page during the promotion period." },
  { q: "Is IV therapy safe at home?", a: "Yes. Every session is administered by a DHA-licensed nurse with sterile, medical-grade equipment, and your vitals are monitored throughout." },
  { q: "How long is the offer valid for?", a: "This is a limited-time promotion around Emirati Women's Day. We recommend booking early on WhatsApp to lock in your discounted price." },
];

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

export default function EmiratiWomensDayPage() {
  return (
    <div className="bg-[#F7F4EE] min-h-screen font-sans">

      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-[#1a2e28]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
        >
          <Image src="/images/Immune-Boost-Hydration-B.webp" alt="IV Therapy at home in Dubai — Nordic Home Healthcare" fill className="object-cover object-center" priority unoptimized />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e28]/95 via-[#1a2e28]/78 to-[#1a2e28]/40 lg:to-[#1a2e28]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e28]/80 via-transparent to-transparent" />

        {/* UAE flag-color accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-[#EF3340]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#00732F]" />
          <div className="flex-1 bg-black" />
        </div>

        <motion.div
          className="hidden lg:flex absolute top-[24%] right-[10%] items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        >
          <svg className="w-4 h-4 text-[#D4A373]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          <span className="text-white text-xs font-semibold">DHA-Licensed Nurses</span>
        </motion.div>
        <motion.div
          className="hidden lg:flex absolute bottom-[28%] right-[16%] items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
        >
          <svg className="w-4 h-4 text-[#D4A373]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" /></svg>
          <span className="text-white text-xs font-semibold">At Your Doorstep</span>
        </motion.div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full pt-28 pb-16">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-5">
              <span className="inline-flex items-center gap-2 bg-[#2D5B4F]/15 border border-[#2D5B4F]/20 text-[#C9C3B3] text-[11px] font-semibold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
                Celebrating Emirati Women&rsquo;s Day · August 28
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-bold text-white leading-[1.1] mb-4" style={{ fontSize: "clamp(34px, 5.2vw, 64px)" }}>
              Emirati Women&rsquo;s Day
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="flex flex-wrap items-center gap-3 mb-5">
              <motion.span
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full shadow-md"
              >
                40% OFF IV Services
              </motion.span>
              <span className="text-white/70 text-sm">IV Therapy &amp; IV Glutathione, at home</span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }} className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              In honor of the women who shape our nation, we&rsquo;re offering 40% off IV wellness therapy — hydration, immunity, energy and glow, delivered at home in Dubai by DHA-licensed nurses.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap items-center gap-3">
              <a href={waLink("Hi Nordic! I'd like to book an IV service for the Emirati Women's Day offer (40% off).")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-md hover:scale-[1.03]">
                Book An Appointment
              </a>
              <a href="#iv-offers" className="inline-flex items-center gap-2 border border-white/25 bg-white/5 text-white font-semibold px-8 py-3.5 rounded-full text-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                View Offers
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CELEBRATING EMIRATI WOMEN ── */}
      <section className="relative py-16 sm:py-20 px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn>
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">August 28</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-5">In Celebration of Emirati Women</h2>
            <p className="text-[#6B7280] text-base leading-relaxed mb-4">
              Every year, Emirati Women&rsquo;s Day honors the strength, ambition and care of the women shaping the UAE — as leaders, mothers, professionals and pillars of every family.
            </p>
            <p className="text-[#6B7280] text-base leading-relaxed">
              This season, Nordic is giving back with 40% off IV wellness therapy — a small way to help you feel as radiant as the nation you help build.
            </p>
          </FadeIn>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              className="relative"
            >
              <Image
                src="/images/promos/emirati-women-illustration.png"
                alt="Celebrating Emirati Women — Nordic Home Healthcare"
                width={1080}
                height={615}
                unoptimized
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── IV OFFERS ── */}
      <section id="iv-offers" className="py-16 sm:py-20 px-6 lg:px-8 bg-[#F7F4EE]">
        <div className="max-w-[1200px] mx-auto">
          <FadeIn className="mb-10">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">Limited-Time Offer</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-3">40% Off IV Services</h2>
            <p className="text-[#6B7280] text-base max-w-2xl leading-relaxed">Every IV Therapy and IV Glutathione session, delivered at home by DHA-licensed nurses across Dubai — including the drips women love most for skin, glow and anti-aging.</p>
          </FadeIn>
          <IVOffersSection />
        </div>
      </section>

      {/* ── WHY CHOOSE NORDIC ── */}
      <section className="relative py-14 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e28] via-[#20362f] to-[#543826]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4A373]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#543826]/30 rounded-full blur-3xl" />

        <div className="relative max-w-[800px] mx-auto text-center">
          <FadeIn>
            <p className="text-[#D4A373] text-xs font-semibold uppercase tracking-widest mb-3">Why Choose Nordic</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8">At-Home IV Wellness</h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "M3 12l2-2m0 0l7-7 7 7m-7-7v14", label: "At Your Doorstep" },
              { icon: "M12 6v6l4 2", label: "Same-Day Booking" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "DHA-Licensed Nurses" },
              { icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Comfort-Driven Care" },
            ].map((f, i) => (
              <FadeIn key={f.label} delay={0.05 * i}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 h-full flex flex-col items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D4A373] to-[#543826] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                  </div>
                  <span className="text-white text-xs font-semibold leading-snug">{f.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
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

      {/* ── FINAL CTA ── */}
      <section className="bg-[#F7F4EE] py-12 px-4 sm:px-6 pb-20 sm:pb-24">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl px-5 sm:px-10 lg:px-16 py-12 sm:py-16 text-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e28] via-[#20362f] to-[#543826]" />
              <div className="absolute -top-32 -left-20 w-80 h-80 bg-[#D4A373]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[#543826]/40 rounded-full blur-3xl" />
              <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

              <div className="relative">
                <div className="inline-flex items-center gap-2 mb-6 bg-white/10 border border-white/15 rounded-full px-4 py-1.5">
                  <svg className="w-4 h-4 text-[#D4A373]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-xs font-semibold">DHA-licensed nurses · All Dubai · At your doorstep</span>
                </div>

                <h2 className="font-bold text-white mb-4 leading-tight" style={{ fontSize: "clamp(24px, 3.4vw, 42px)" }}>
                  Celebrate Emirati Women&rsquo;s Day — save 40% on IV therapy.
                </h2>
                <p className="text-white/60 text-base mb-9 max-w-lg mx-auto leading-relaxed">
                  Message us with the IV service you&rsquo;d like and we&rsquo;ll confirm your discounted booking.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href={waLink("Hi Nordic! I'd like to book an IV service for the Emirati Women's Day offer (40% off).")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-lg shadow-[#25D366]/20 hover:scale-[1.03]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                    Book on WhatsApp
                  </a>
                  <a href={CALL_NUM} className="inline-flex items-center justify-center gap-2 border border-white/25 bg-white/5 text-white font-semibold px-8 py-3.5 rounded-full text-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300">
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
