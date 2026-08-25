import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PARENTS_WELLNESS_SERVICES, getParentsWellnessService } from "../../parents-wellness-services";

const WA_NUM = "971581649910";
const CALL_NUM = "tel:+971581649910";
const waLink = (msg: string) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;

export function generateStaticParams() {
  return PARENTS_WELLNESS_SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getParentsWellnessService(slug);
  if (!service) return {};
  return {
    title: `${service.title} | Nordic Home Healthcare`,
    description: service.description,
  };
}

export default async function ParentsWellnessServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getParentsWellnessService(slug);
  if (!service) notFound();

  const otherServices = PARENTS_WELLNESS_SERVICES.filter((s) => s.slug !== slug).slice(0, 3);
  const waMsg = waLink(`Hi Nordic! I'd like to book "${service.title}" — Back to School Sale.`);

  return (
    <div className="bg-[#F7F4EE] min-h-screen font-sans">

      {/* ── HERO ── */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden bg-[#1a2e28]">
        {service.gradient ? (
          <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient}`}>
            <svg className="absolute w-96 h-96 -right-16 -bottom-16 text-white/10" fill="none" stroke="currentColor" strokeWidth={0.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e28]/80 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0">
            <Image src={service.image!} alt={service.title} fill className="object-cover object-center" priority unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e28]/95 via-[#1a2e28]/60 to-[#1a2e28]/20" />
          </div>
        )}

        <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-8 w-full pt-32 pb-10">
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-5">
            <Link href="/back-to-school-sale" className="hover:text-white transition">Back to School Sale</Link>
            <span>/</span>
            <Link href="/back-to-school-sale#parents-wellness" className="hover:text-white transition">Parent&rsquo;s Wellness</Link>
            <span>/</span>
            <span className="text-white/90">{service.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
              40% OFF
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/80 text-[11px] font-medium px-3 py-1 rounded-full">
              Parent&rsquo;s Wellness · At Home
            </span>
          </div>

          <h1 className="font-bold text-white leading-[1.1] mb-3" style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
            {service.title}
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl">{service.subtitle}</p>
        </div>
      </section>

      {/* ── DETAILS ── */}
      <section className="py-12 sm:py-16 px-6 lg:px-8">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          <div>
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">About This Service</p>
            <p className="text-[#1a2e28] text-base sm:text-lg leading-relaxed mb-8">{service.description}</p>

            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-4">What&rsquo;s Included</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {service.highlights.map((h) => (
                <div key={h} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#543826]/10">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#543826]/10 flex items-center justify-center mt-0.5">
                    <svg className="w-3.5 h-3.5 text-[#543826]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span className="text-[#1a2e28] text-sm leading-snug">{h}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#543826]/10 flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#543826]/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#543826]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-[#1a2e28] text-sm mb-1">DHA-Licensed &amp; At Your Doorstep</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">Delivered at home in Dubai by DHA-licensed nurses and clinicians — no clinic visit required.</p>
              </div>
            </div>
          </div>

          {/* ── BOOKING CARD ── */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl p-6 border border-[#543826]/10 shadow-lg">
              <p className="text-[#6B7280] text-xs font-semibold uppercase tracking-widest mb-3">Offer</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[#1a2e28] text-3xl font-bold">40% OFF</span>
              </div>
              <p className="text-[#2D5B4F] text-xs font-semibold mb-5">Back to School Sale — message us for your discounted price</p>

              <a href={waMsg} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3.5 rounded-full text-sm transition-all duration-300 shadow-md mb-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/></svg>
                Book on WhatsApp
              </a>
              <a href={CALL_NUM} className="w-full inline-flex items-center justify-center gap-2 border border-[#543826]/25 text-[#543826] font-semibold py-3.5 rounded-full text-sm hover:bg-[#543826]/5 transition-all duration-300">
                Call us, toll-free
              </a>

              <div className="mt-5 pt-5 border-t border-[#543826]/10 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#6B7280] text-xs">
                  <svg className="w-3.5 h-3.5 text-[#2D5B4F] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" /></svg>
                  At-home service, all Dubai
                </div>
                <div className="flex items-center gap-2 text-[#6B7280] text-xs">
                  <svg className="w-3.5 h-3.5 text-[#2D5B4F] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                  Same-day booking available
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MORE FROM PARENT'S WELLNESS ── */}
      {otherServices.length > 0 && (
        <section className="py-12 sm:py-16 px-6 lg:px-8 bg-white">
          <div className="max-w-[1000px] mx-auto">
            <p className="text-[#2D5B4F] text-xs font-semibold uppercase tracking-widest mb-3">More From Parent&rsquo;s Wellness</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2e28] mb-8">Other services in this sale</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {otherServices.map((s) => (
                <Link key={s.slug} href={`/back-to-school-sale/parents-wellness/${s.slug}`} className="group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl" style={{ minHeight: "220px" }}>
                  {s.gradient ? (
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`}>
                      <svg className="absolute w-28 h-28 -right-6 -bottom-6 text-white/10" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                      </svg>
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 100%)" }} />
                    </div>
                  ) : (
                    <div className="absolute inset-0">
                      <Image src={s.image!} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.8) 100%)" }} />
                    </div>
                  )}
                  <div className="relative z-10 mt-auto p-4">
                    <h3 className="text-white font-semibold text-sm leading-snug">{s.title}</h3>
                    <p className="text-white/70 text-xs font-semibold mt-1.5">40% OFF</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BACK LINK ── */}
      <section className="py-10 px-6 text-center">
        <Link href="/back-to-school-sale" className="inline-flex items-center gap-2 text-[#543826] font-semibold text-sm hover:gap-3 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Back to School Sale
        </Link>
      </section>

    </div>
  );
}
