"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { KIDS_HEALTH_SERVICES } from "./kids-health-services";
import { PARENTS_WELLNESS_SERVICES } from "./parents-wellness-services";

const WA_NUM = "971581649910";
const CALL_NUM = "tel:+971581649910";
const waLink = (msg: string) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

type Offer = {
  title: string;
  desc: string;
  image?: string;
  gradient?: string;
  icon: string;
  href?: string;
  price?: number;
  originalPrice?: number;
  offBadge?: string;
};

const KIDS_HEALTH: Offer[] = KIDS_HEALTH_SERVICES.map((s) => ({
  title: s.title,
  desc: s.subtitle,
  image: s.image,
  gradient: s.gradient,
  icon: s.icon,
  href: `/back-to-school-sale/kids-health/${s.slug}`,
  price: s.price,
  originalPrice: s.originalPrice,
  offBadge: s.offBadge,
}));

const PARENTS_WELLNESS: Offer[] = PARENTS_WELLNESS_SERVICES.map((s) => ({
  title: s.title,
  desc: s.subtitle,
  image: s.image,
  gradient: s.gradient,
  icon: s.icon,
  href: `/back-to-school-sale/parents-wellness/${s.slug}`,
}));

function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  const cardBody = (
    <>
      {offer.gradient ? (
        <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient}`}>
          <svg className="absolute w-40 h-40 -right-8 -bottom-8 text-white/10" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={offer.icon} />
          </svg>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.65) 100%)" }} />
        </div>
      ) : (
        <div className="absolute inset-0">
          <Image src={offer.image!} alt={offer.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.8) 100%)" }} />
        </div>
      )}

      <div className="relative z-10 flex items-start justify-between p-4">
        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
          {offer.offBadge ?? "40% OFF"}
        </span>
        <span className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={offer.icon} />
          </svg>
        </span>
      </div>

      <div className="relative z-10 mt-auto flex flex-col gap-3 p-5">
        <div>
          <h3 className="text-white font-semibold text-base leading-snug">{offer.title}</h3>
          <p className="text-white/65 text-xs leading-relaxed line-clamp-2 mt-1.5">{offer.desc}</p>
          {offer.price != null && (
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-white font-bold text-base">AED {offer.price}</span>
              {offer.originalPrice != null && (
                <span className="text-white/50 text-xs line-through">AED {offer.originalPrice}</span>
              )}
            </div>
          )}
        </div>
        <span className="inline-flex items-center justify-center gap-1.5 bg-[#543826] text-white text-xs font-semibold px-5 py-2.5 rounded-full group-hover:bg-[#3e2a1c] transition w-fit">
          {offer.href ? "View Details" : "Book Now"}
        </span>
      </div>
    </>
  );

  const className = "group relative rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl";

  return (
    <FadeIn delay={0.04 * index} className="h-full">
      {offer.href ? (
        <Link href={offer.href} className={className} style={{ minHeight: "320px" }}>
          {cardBody}
        </Link>
      ) : (
        <a
          href={waLink(`Hi Nordic! I'd like to book the "${offer.title}" — Back to School Sale (up to 40% off).`)}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          style={{ minHeight: "320px" }}
        >
          {cardBody}
        </a>
      )}
    </FadeIn>
  );
}

function CategorySection({ id, eyebrow, title, desc, offers }: { id: string; eyebrow: string; title: string; desc: string; offers: Offer[] }) {
  return (
    <section id={id} className="py-16 sm:py-20 px-6 lg:px-8 bg-[#F7F4EE]">
      <div className="max-w-[1200px] mx-auto">
        <FadeIn className="mb-10">
          <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">{eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2e28] leading-tight mb-3">{title}</h2>
          <p className="text-[#6B7280] text-base max-w-2xl leading-relaxed">{desc}</p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map((offer, i) => (
            <OfferCard key={offer.title} offer={offer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "What does the Back to School Sale include?", a: "The sale covers a curated selection of Kids' Health services (vaccines, checkups, screenings) and Parent's Wellness services (health checkups, IV drips, physiotherapy), plus our Exclusive Deal — all at up to 40% off for a limited time." },
  { q: "Is the 40% off applied automatically?", a: "Message us on WhatsApp with the service you'd like from this page and our team will confirm your discounted price and booking slot directly." },
  { q: "Are these services provided at home?", a: "Yes. Every service on this page is delivered at your home in Dubai by DHA-licensed nurses and clinicians — no clinic visit required." },
  { q: "How long is the offer valid for?", a: "This is a limited-time back-to-school promotion. We recommend booking early on WhatsApp to lock in your discounted price before slots fill up." },
  { q: "What is the Exclusive Deal?", a: "It's a specially featured offer available only through this campaign page. Tap through to view full details and book — the underlying service, pricing and booking process are unchanged." },
  { q: "How do I book more than one service?", a: "Just let us know on WhatsApp — you can bundle any combination of Kids' Health and Parent's Wellness services, or the Exclusive Deal, into a single home visit where possible." },
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

export default function BackToSchoolSalePage() {
  return (
    <div className="bg-[#F7F4EE] min-h-screen font-sans">

      {/* ── HERO ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#1a2e28]">
        {/* Background photo with a slow cinematic zoom */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
        >
          <Image src="/images/promos/child-checkup.jpg" alt="Child ready for their back-to-school vaccine — Nordic Home Healthcare" fill sizes="100vw" className="object-cover object-center" priority />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e28]/95 via-[#1a2e28]/75 to-[#1a2e28]/35 lg:to-[#1a2e28]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e28]/80 via-transparent to-transparent" />

        {/* Floating decorative chips */}
        <motion.div
          className="hidden lg:flex absolute top-[22%] right-[8%] items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        >
          <svg className="w-4 h-4 text-[#D4A373]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          <span className="text-white text-xs font-semibold">DHA-Licensed Nurses</span>
        </motion.div>
        <motion.div
          className="hidden lg:flex absolute bottom-[26%] right-[14%] items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
        >
          <svg className="w-4 h-4 text-[#D4A373]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-white text-xs font-semibold">100% Secure Booking</span>
        </motion.div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full pt-28 pb-16">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-5">
              <span className="inline-flex items-center gap-2 bg-[#2D5B4F]/15 border border-[#2D5B4F]/20 text-[#C9C3B3] text-[11px] font-semibold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
                Nordic Home Healthcare · Dubai · DHA-Licensed
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-bold text-white leading-[1.1] mb-4" style={{ fontSize: "clamp(34px, 5.2vw, 64px)" }}>
              Back to School Sale
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="flex flex-wrap items-center gap-3 mb-5">
              <motion.span
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded-full shadow-md"
              >
                Up to 40% OFF
              </motion.span>
              <span className="text-white/70 text-sm">on selected Kids&rsquo; Health &amp; Parent&rsquo;s Wellness services</span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }} className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              Routine checkups, vaccines, screenings and wellness care for the whole family — delivered at home in Dubai by DHA-licensed professionals, for a limited time only.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap items-center gap-3">
              <a href={waLink("Hi Nordic! I'd like to book a service from the Back to School Sale (up to 40% off).")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-md hover:scale-[1.03]">
                Book An Appointment
              </a>
              <a href="#kids-health" className="inline-flex items-center gap-2 border border-white/25 bg-white/5 text-white font-semibold px-8 py-3.5 rounded-full text-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                View Offers
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── KIDS' HEALTH ── */}
      <CategorySection
        id="kids-health"
        eyebrow="Category 01"
        title="Kids' Health"
        desc="Routine immunizations, checkups and screenings to keep your child healthy and ready for the school year — all delivered at home."
        offers={KIDS_HEALTH}
      />

      {/* ── EXCLUSIVE DEAL SPOTLIGHT ── */}
      <section className="py-4 px-6 lg:px-8 bg-[#F7F4EE]">
        <div className="max-w-[1200px] mx-auto">
          <FadeIn>
            <Link
              href="/iv-glutathione"
              className="group relative flex flex-col lg:flex-row items-stretch overflow-hidden rounded-3xl shadow-xl"
            >
              <div className="relative w-full lg:w-[42%] min-h-[240px]">
                <Image src="/images/Immune-Boost-Hydration-B.webp" alt="Exclusive Deal — Nordic Home Healthcare" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e28]/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#1a2e28]/10" />
              </div>
              <div className="relative flex-1 bg-gradient-to-br from-[#1a2e28] via-[#20362f] to-[#543826] px-6 sm:px-10 lg:px-12 py-10 flex flex-col justify-center">
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#D4A373]/20 rounded-full blur-3xl pointer-events-none" />
                <span className="relative inline-flex items-center gap-2 w-fit bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4 shadow">
                  Featured · Limited Time
                </span>
                <h2 className="relative font-bold text-white leading-tight mb-3" style={{ fontSize: "clamp(26px, 3vw, 40px)" }}>
                  Exclusive Deal
                </h2>
                <p className="relative text-white/65 text-sm sm:text-base leading-relaxed max-w-md mb-6">
                  A specially featured offer, available only through the Back to School Sale — see full details, pricing and book your session.
                </p>
                <span className="relative inline-flex items-center gap-2 bg-white text-[#1a2e28] font-semibold px-7 py-3 rounded-full text-sm w-fit group-hover:bg-white/90 transition">
                  View Offer
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── PARENT'S WELLNESS ── */}
      <CategorySection
        id="parents-wellness"
        eyebrow="Category 02"
        title="Parent's Wellness"
        desc="Because the school run doesn't run on empty. Checkups, IV drips and wellness care so parents stay just as healthy as the kids."
        offers={PARENTS_WELLNESS}
      />

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
                  Get ready for school — save up to 40% today.
                </h2>
                <p className="text-white/60 text-base mb-9 max-w-lg mx-auto leading-relaxed">
                  Message us with the service you&rsquo;d like from Kids&rsquo; Health, Parent&rsquo;s Wellness, or the Exclusive Deal, and we&rsquo;ll confirm your discounted booking.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href={waLink("Hi Nordic! I'd like to book a service from the Back to School Sale (up to 40% off).")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-lg shadow-[#25D366]/20 hover:scale-[1.03]">
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
