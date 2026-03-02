"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ServiceCard from "@/app/_components/service-card";
import { getServices, getFeaturedServices } from "./_common/api";
import { Service } from "@/app/_common/interfaces";
import { CTASection } from "@/app/_components/cta-section";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
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

  return (
    <>
      {/* ==================== FEATURED SERVICES HERO SLIDER ==================== */}
      <section className="w-full bg-[#543826] pt-24 pb-16">
        {featuredServices.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={featuredServices.length > 1}
            pagination={{ clickable: true }}
            navigation
            className="w-full featured-slider"
          >
            {featuredServices.map((service) => {
              const images = (service.images || []).slice(0, 3);
              return (
                <SwiperSlide key={service._id}>
                  <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      {/* Left — Title, Description, CTA */}
                      <div className="md:w-2/5 flex flex-col justify-center">
                        <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                          Most Popular Service
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                          {service.title}
                        </h1>
                        {service.description && (
                          <p className="text-white/80 text-base mb-5 line-clamp-3">
                            {service.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mb-5">
                          {service.discountPrice &&
                          service.actualPrice &&
                          service.discountPrice < service.actualPrice ? (
                            <>
                              <span className="text-2xl font-bold text-orange-400">
                                AED {service.discountPrice}
                              </span>
                              <span className="text-lg text-white/50 line-through">
                                AED {service.actualPrice}
                              </span>
                            </>
                          ) : (
                            service.actualPrice && (
                              <span className="text-2xl font-bold text-orange-400">
                                AED {service.actualPrice}
                              </span>
                            )
                          )}
                        </div>
                        <Link
                          href={`/services/${service._id}`}
                          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition w-fit"
                        >
                          Book Now
                        </Link>
                      </div>

                      {/* Right — 3 Images with border radius */}
                      <div className="md:w-3/5 grid grid-cols-3 gap-4">
                        {images.length > 0
                          ? images.map((img, i) => (
                              <div
                                key={i}
                                className="relative aspect-[3/4] overflow-hidden rounded-2xl"
                              >
                                <Image
                                  src={img}
                                  alt={`${service.title} ${i + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 33vw, 20vw"
                                  priority={i === 0}
                                  unoptimized
                                />
                              </div>
                            ))
                          : /* Placeholder if no images */
                            Array.from({ length: 3 }).map((_, i) => (
                              <div
                                key={i}
                                className="aspect-[3/4] rounded-2xl bg-white/10 flex items-center justify-center"
                              >
                                <span className="text-white/30 text-sm">
                                  No image
                                </span>
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          /* Fallback — show a static hero if no featured services yet */
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

      {/* ==================== OLD STATIC HERO SLIDER (COMMENTED OUT) ==================== */}
      {/* <section className="relative h-screen w-full">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {slides.map((src, index) => (
            <SwiperSlide key={index} className="relative h-full w-full">
              <Image
                src={src}
                alt={`Hero Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section> */}

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
