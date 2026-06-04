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
//         phoneNumber="+971555828945"
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

import { getFeaturedServices } from "./_common/api";
import { Service } from "@/app/_common/interfaces";
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

const SLIDE_DURATION = 4000;

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [featuredServicesLoading, setFeaturedServicesLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getFeaturedServices()
      .then((data) => setFeaturedServices(data))
      .catch(() => setFeaturedServices([]))
      .finally(() => setFeaturedServicesLoading(false));
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

  const nextSlide = useCallback(() => {
    if (featuredServices.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % featuredServices.length);
    startProgress();
  }, [featuredServices.length, startProgress]);

  useEffect(() => {
    if (featuredServices.length === 0) return;
    startProgress();
    intervalRef.current = setInterval(nextSlide, SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [featuredServices.length, nextSlide, startProgress]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startProgress();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, SLIDE_DURATION);
  };

  return (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        {featuredServicesLoading ? (
          <div className="flex items-center justify-center h-full bg-[#543826]">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : featuredServices.length > 0 ? (
          <>
            {featuredServices.map((service, index) => (
              <div
                key={service._id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
              >
                {service.images?.[0] ? (
                  <Image
                    src={service.images[0]}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[#543826]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-6xl mx-auto px-6 w-full">
                    <div className="max-w-lg">
                      <p className="font-brand text-sm text-[#C9C3B3] tracking-widest uppercase mb-3">
                        {service.category}
                      </p>
                      <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
                        {service.title}
                      </h1>
                      {service.description && (
                        <p className="text-white/70 text-base md:text-lg mb-8 line-clamp-3 leading-relaxed">
                          {service.description}
                        </p>
                      )}
                      {service.actualPrice && (
                        <p className="text-[#C9C3B3] font-brand text-2xl font-semibold mb-6">
                          AED {service.actualPrice}
                        </p>
                      )}
                      <Link
                        href={`/services/${service._id}`}
                        className="inline-flex items-center gap-2 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:gap-4"
                      >
                        Book Now
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>

                      {/* Mini timeline below Book Now */}
                      <div className="flex gap-3 mt-6 max-w-[280px]">
                        {featuredServices.map((_, i) => (
                          <button
                            key={i}
                            className={`flex-1 rounded-full overflow-hidden cursor-pointer transition-all duration-300 ${
                              i === currentSlide ? "h-[6px]" : "h-[3px]"
                            }`}
                            style={{ background: i === currentSlide ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)" }}
                            onClick={() => goToSlide(i)}
                          >
                            <div
                              className="h-full bg-[#C9C3B3] rounded-full"
                              style={{
                                width: i === currentSlide ? `${progress}%` : i < currentSlide ? "100%" : "0%",
                                transition: i === currentSlide ? "none" : "all 0.3s",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="absolute bottom-10 right-6 z-20 font-brand text-white/50 text-sm">
              {currentSlide + 1} / {featuredServices.length}
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-[#543826] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Nordic Home Healthcare
              </h1>
              <p className="text-white/80 text-lg">
                Quality healthcare at your doorstep
              </p>
            </div>
          </div>
        )}
      </section>

      <StatsSection />

      <ExploreOurServices />

      <PressMarquee />

      <ReviewsSection />

      <TeamSection />

      <FaqSection />

      <AppDownloadSection />

      <FooterInfoSection />

      <CTASection
        title="Ready to get started?"
        phoneNumber="+971555828945"
        message="Hello! I'm interested in booking a service. Can you provide more details?"
        imageUrl="/images/CTA!.jpg"
        buttonText="Book Now"
      />

      {/* <section className="py-12 bg-gray-50">
        <div className="grid gap-6">
          <Testimonials />
        </div>
      </section> */}
    </>
  );
}