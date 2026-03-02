"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

import ServiceCard from "@/app/_components/service-card";
import { getServices, getFeaturedServices } from "./_common/api";
import { Service } from "@/app/_common/interfaces";
import { CTASection } from "@/app/_components/cta-section";
import { Testimonials } from "./_components/testimonials";

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // const slides = [
  //   "/images/hero banner 3.png",
  //   "/images/hero banner 4.png",
  //   "/images/banner2.png",
  // ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, featured] = await Promise.all([
          getServices(),
          getFeaturedServices(),
        ]);
        setServices(servicesData);
        setFeaturedServices(featured);
      } catch (err: unknown) {
        console.error("Fetch error:", err);
        setServices([]);
        setFeaturedServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const itemsPerView = 3;
  const totalSlides = featuredServices.length;
  const maxIndex = Math.max(0, totalSlides - itemsPerView);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-scroll right to left
  useEffect(() => {
    if (totalSlides <= itemsPerView) return;
    intervalRef.current = setInterval(goNext, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext, totalSlides]);

  // Pause auto-scroll on hover
  const pauseAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  const resumeAutoScroll = () => {
    if (totalSlides <= itemsPerView) return;
    intervalRef.current = setInterval(goNext, 3000);
  };

  return (
    <>
      {/* ==================== FEATURED SERVICES CAROUSEL ==================== */}
      <section className="w-full bg-[#543826] pt-24 pb-16 mt-24">
        {featuredServices.length > 0 ? (
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              Most Popular Services
            </h2>

            <div
              className="relative"
              onMouseEnter={pauseAutoScroll}
              onMouseLeave={resumeAutoScroll}
            >
              {/* Left Arrow */}
              {totalSlides > itemsPerView && (
                <button
                  onClick={goPrev}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition backdrop-blur-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {/* Carousel Track */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                  }}
                >
                  {featuredServices.map((service) => {
                    const img = service.images?.[0];
                    return (
                      <div
                        key={service._id}
                        className="shrink-0 px-3"
                        style={{ width: `${100 / itemsPerView}%` }}
                      >
                        <Link
                          href={`/services/${service._id}`}
                          className="block group"
                        >
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition">
                            {/* Image */}
                            <div className="relative aspect-4/3 overflow-hidden">
                              {img ? (
                                <Image
                                  src={img}
                                  alt={service.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                  <span className="text-white/30 text-sm">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                                {service.title}
                              </h3>
                              {service.description && (
                                <p className="text-white/60 text-sm mb-3 line-clamp-2">
                                  {service.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2">
                                {service.discountPrice &&
                                service.actualPrice &&
                                service.discountPrice < service.actualPrice ? (
                                  <>
                                    <span className="text-lg font-bold text-orange-400">
                                      AED {service.discountPrice}
                                    </span>
                                    <span className="text-sm text-white/40 line-through">
                                      AED {service.actualPrice}
                                    </span>
                                  </>
                                ) : (
                                  service.actualPrice && (
                                    <span className="text-lg font-bold text-orange-400">
                                      AED {service.actualPrice}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Arrow */}
              {totalSlides > itemsPerView && (
                <button
                  onClick={goNext}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition backdrop-blur-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}

              {/* Dots */}
              {totalSlides > itemsPerView && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition ${
                        i === currentIndex ? "bg-orange-500 w-6" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nordic Home Healthcare
            </h1>
            <p className="text-white/80 text-lg">
              Quality healthcare at your doorstep
            </p>
          </div>
        )}
      </section>

      {/* Services Section */}
      <section className="max-w-6xl mx-auto py-10 px-5 md:px-0">
        <h2 className="text-2xl font-bold mb-6">Our Services</h2>

        {loading && <p className="text-gray-500">Loading services...</p>}

        {!loading && services.length === 0 && (
          <p className="text-gray-500">No services available.</p>
        )}

        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                id={service._id}
                image={service.images?.[0]}
                title={service.title}
                price={service.discountPrice ?? service.actualPrice ?? 0}
                actualPrice={service.actualPrice}
                description={service.description}
              />
            ))}
          </div>
        )}
      </section>
      <CTASection
        title="Ready to get started?"
        phoneNumber="+923414415384"
        message="Hello! I'm interested in booking a service. Can you provide more details?"
        imageUrl="images/hero banner 4.png"
        buttonText="Book Now"
      />

      {/* Testimonials */}
      <section className="py-12 bg-gray-50">
        <div className="grid gap-6">
          <Testimonials />
        </div>
      </section>
    </>
  );
}
