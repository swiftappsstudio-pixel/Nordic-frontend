// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// import ServiceCard from "@/app/_components/service-card";
// import { getServices, getFeaturedServices } from "./_common/api";
// import { Service } from "@/app/_common/interfaces";
// import { CTASection } from "@/app/_components/cta-section";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import BrandSlider from "./_components/collobration-brands";

// import "swiper/css";
// import "swiper/css/pagination";
// import { Testimonials } from "./_components/testimonials";

// export default function Home() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);

//   // const slides = [
//   //   "/images/hero banner 3.png",
//   //   "/images/hero banner 4.png",
//   //   "/images/banner2.png",
//   // ];

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [servicesData, featured] = await Promise.all([
//           getServices(),
//           getFeaturedServices(),
//         ]);
//         setServices(servicesData);
//         setFeaturedServices(featured);
//       } catch (err: unknown) {
//         console.error("Fetch error:", err);
//         setServices([]);
//         setFeaturedServices([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   return (
//     <>
//       {/* ==================== HERO SLIDER ==================== */}
//       <section className="relative h-screen w-full">
//         {featuredServices.length > 0 ? (
//           <Swiper
//             modules={[Autoplay, Pagination]}
//             autoplay={{ delay: 4000, disableOnInteraction: false }}
//             loop
//             pagination={{ clickable: true }}
//             className="h-full w-full"
//           >
//             {featuredServices.map((service, index) => (
//               <SwiperSlide key={service._id} className="relative h-full w-full">
//                 {/* Background Image */}
//                 {service.images?.[0] ? (
//                   <Image
//                     src={service.images[0]}
//                     alt={service.title}
//                     fill
//                     className="object-cover"
//                     priority={index === 0}
//                     unoptimized
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-[#543826]" />
//                 )}

//                 {/* Dark overlay */}
//                 <div className="absolute inset-0 bg-black/50" />

//                 {/* Text overlay */}
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="max-w-6xl mx-auto px-6 w-full">
//                     <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-2xl">
//                       {service.title}
//                     </h1>
//                     {service.description && (
//                       <p className="text-white/80 text-base md:text-lg mb-6 max-w-xl line-clamp-3">
//                         {service.description}
//                       </p>
//                     )}
//                     <Link
//                       href={`/services/${service._id}`}
//                       className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition"
//                     >
//                       Book Now
//                     </Link>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         ) : (
//           <div className="w-full h-full bg-[#543826] flex items-center justify-center">
//             <div className="text-center">
//               <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
//                 Nordic Home Healthcare
//               </h1>
//               <p className="text-white/80 text-lg">
//                 Quality healthcare at your doorstep
//               </p>
//             </div>
//           </div>
//         )}
//       </section>

//       {/* Services Section */}
//       <section className="max-w-6xl mx-auto py-10 px-5 md:px-0">
//         <h2 className="text-2xl font-bold mb-6">Our Services</h2>

//         {loading && <p className="text-gray-500">Loading services...</p>}

//         {!loading && services.length === 0 && (
//           <p className="text-gray-500">No services available.</p>
//         )}

//         {!loading && services.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {services.map((service) => (
//               <ServiceCard
//                 key={service._id}
//                 id={service._id}
//                 image={service.images?.[0]}
//                 title={service.title}
//                 price={service.discountPrice ?? service.actualPrice ?? 0}
//                 actualPrice={service.actualPrice}
//                 description={service.description}
//               />
//             ))}
//           </div>
//         )}
//       </section>
//       <CTASection
//         title="Ready to get started?"
//         phoneNumber="+971581649910"
//         message="Hello! I'm interested in booking a service. Can you provide more details?"
//         imageUrl="/images/CTA!.jpg"
//         buttonText="Book Now"
//       />

//       {/* Testimonials */}
//       <section className="py-2 bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4 text-center">
//           <Testimonials />
//         </div>
//       </section>

//       <section className="py-2 bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4 text-center">
// <BrandSlider />
//           </div>
//         </section>
//     </>
//   );
// }



"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

import { getFeaturedServices, getBanners } from "./_common/api";
import { Service, Banner } from "@/app/_common/interfaces";
import { CTASection } from "@/app/_components/cta-section";
import { Testimonials } from "./_components/testimonials";
import ExploreOurServices from "@/app/_components/explore-services";
import StatsSection from "@/app/_components/stats-section";
import PressMarquee from "@/app/_components/press-marquee";
import ReviewsSection from "@/app/_components/reviews-section";
import TeamSection from "@/app/_components/team-section";
import FaqSection from "@/app/_components/faq-section";
import AppDownloadSection from "@/app/_components/app-download-section";
import FooterInfoSection from "@/app/_components/footer-info-section";

// ── Why Nordic Section ────────────────────────────────────────────────────
function WhyNordicSection() {
  const features = [
    {
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
      title: "DHA Licensed",
      desc: "Every nurse & caregiver fully licensed by Dubai Health Authority.",
    },
    {
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: "30–60 Min Arrival",
      desc: "From booking to your door — across all of Dubai in under an hour.",
    },
    {
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
      title: "Same Caregiver",
      desc: "Consistency matters. Your assigned nurse stays with you every visit.",
    },
    {
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
      title: "At Your Home",
      desc: "No waiting rooms. No travel. Premium care delivered to your door.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0d0a08] py-20 sm:py-28">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-20">
        <source src="/video/mother.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-[#543826]/60 via-transparent to-[#0d0a08]/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a08] via-transparent to-transparent" />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#543826]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-[#543826]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-10 bg-[#C9C3B3]" />
          <span className="text-[#C9C3B3] text-xs font-semibold uppercase tracking-[0.2em]">Why Nordic</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <h2 className="font-bold text-white leading-[1.08] max-w-xl" style={{ fontSize: "clamp(28px, 4vw, 56px)" }}>
            Healthcare that comes<br /><span className="text-[#C9C3B3]">to you.</span>
          </h2>
          <a
            href={`https://wa.me/971581649910?text=${encodeURIComponent("Hi Nordic! I'd like to book a home healthcare service.")}`}
            target="_blank" rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 border border-white/20 text-white/80 hover:text-white hover:border-white/50 text-sm font-semibold px-6 py-3 rounded-full transition-all"
          >
            Book now 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((f, i) => (
            <div key={i} className="group rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#543826]/50 border border-[#543826] flex items-center justify-center text-[#C9C3B3] mb-5 group-hover:bg-[#543826] transition-colors">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "260px" }}>
            <Image src="/images/mother.png" alt="Nordic nurse at home" fill className="object-cover object-center" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Available now · All Dubai</p>
              <p className="text-white font-semibold text-xl leading-snug">IV Therapy · Blood Tests<br />Mother & Baby · Elderly Care</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex-1 rounded-2xl bg-[#543826] p-8 flex flex-col justify-between min-h-[120px]">
              <p className="text-white/60 text-xs uppercase tracking-widest">Families served</p>
              <div className="mt-3">
                <p className="text-white font-bold leading-none" style={{ fontSize: "clamp(42px, 5vw, 64px)" }}>3,000<span className="text-[#C9C3B3]">+</span></p>
                <p className="text-white/50 text-sm mt-1">Across Dubai · Since 2020</p>
              </div>
            </div>
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between min-h-[120px]">
              <p className="text-white/60 text-xs uppercase tracking-widest">Average rating</p>
              <div className="flex items-end gap-3 mt-3">
                <p className="text-white font-bold leading-none" style={{ fontSize: "clamp(42px, 5vw, 64px)" }}>4.9<span className="text-[#C9C3B3]">★</span></p>
                <p className="text-white/50 text-sm mb-1">from 500+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SLIDE_DURATION = 4000;

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [featuredServicesLoading, setFeaturedServicesLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Promise.all([
      getFeaturedServices().then((data) => setFeaturedServices(data)).catch(() => setFeaturedServices([])),
      getBanners().then((data) => setBanners(data)).catch(() => setBanners([])),
    ]).finally(() => setFeaturedServicesLoading(false));
  }, []);

  const startProgress = useCallback(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const step = 100 / (SLIDE_DURATION / 50);
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          if (progressRef.current) clearInterval(progressRef.current);
          return 100;
        }
        return next;
      });
    }, 50);
  }, []);

  const heroSlides = banners.length > 0 ? banners : featuredServices;

  const nextSlide = useCallback(() => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    startProgress();
  }, [heroSlides.length, startProgress]);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    startProgress();
    intervalRef.current = setInterval(nextSlide, SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [heroSlides.length, nextSlide, startProgress]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startProgress();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, SLIDE_DURATION);
  };

  return (
    <>
      {/* ── HERO BANNER SLIDER ── */}
      <section className="relative min-h-[100dvh] h-[100dvh] w-full overflow-hidden">
        {heroSlides.length > 0 ? (
          <>
            {heroSlides.map((slide, index) => (
              <div
                key={slide._id}
                className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                style={{ opacity: currentSlide === index ? 1 : 0 }}
              >
                {(slide as Banner).image ? (
                  <>
                    <Image
                      src={(slide as Banner).image!}
                      alt={slide.title}
                      fill
                      className="object-cover object-center hidden sm:block"
                      priority={index === 0}
                      unoptimized
                    />
                    <Image
                      src={(slide as Banner).mobileImage || (slide as Banner).image!}
                      alt={slide.title}
                      fill
                      className="object-cover object-center block sm:hidden"
                      priority={index === 0}
                      unoptimized
                    />
                  </>
                ) : (slide as Service).images?.[0] ? (
                  <Image
                    src={(slide as Service).images![0]}
                    alt={slide.title}
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[#543826]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-6xl mx-auto px-6 w-full">
                    <div className="max-w-lg">
                      <p className="font-brand text-sm text-[#C9C3B3] tracking-widest uppercase mb-3">
                        Home Healthcare · Dubai
                      </p>
                      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
                        {slide.title}
                      </h1>
                      {slide.description && (
                        <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed max-w-md">
                          {slide.description}
                        </p>
                      )}
                      <a
                          href={`https://wa.me/971581649910?text=${encodeURIComponent("Hi Nordic! I'd like to book a home healthcare service.")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-6 py-3 sm:px-8 sm:py-3.5 rounded-full transition-all duration-300 hover:gap-4"
                        >
                          {(slide as Banner).bookNowButtonText || "Book Now"}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      {heroSlides.length > 1 && (
                        <div className="flex items-center gap-3 mt-6">
                          {heroSlides.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => goToSlide(index)}
                              className="group relative"
                            >
                              <div className={`w-8 h-1 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-white" : "bg-white/30 group-hover:bg-white/60"}`} />
                              {currentSlide === index && (
                                <div
                                  className="absolute inset-0 rounded-full bg-white/80 origin-left"
                                  style={{ width: `${progress}%` }}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : featuredServicesLoading ? (
          <div className="w-full h-full bg-[#543826]" />
        ) : (
          <>
            <Image
              src="/images/Immune-Boost-Hydration-B.webp"
              alt="Nordic Home Healthcare"
              fill
              className="object-cover object-center hidden sm:block"
              priority
              unoptimized
            />
            <Image
              src="/images/mother.png"
              alt="Nordic Home Healthcare"
              fill
              className="object-cover object-center block sm:hidden"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
          
          </>
        )}
      </section>

      <StatsSection />

      <ExploreOurServices />

      {/* ── WHY NORDIC SECTION ── */}
      <WhyNordicSection />

      {/* <PressMarquee /> */}

      <ReviewsSection />

      <TeamSection />

      <FaqSection />

      <AppDownloadSection />

      {/* <FooterInfoSection />

      <CTASection
        title="Ready to get started?"
        phoneNumber="+971581649910"
        message="Hello! I'm interested in booking a service. Can you provide more details?"
        imageUrl="/images/CTA!.jpg"
        buttonText="Book Now"
      /> */}

      {/* <section className="py-12 bg-gray-50">
        <div className="grid gap-6">
          <Testimonials />
        </div>
      </section> */}
    </>
  );
}