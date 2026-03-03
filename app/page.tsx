"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import ServiceCard from "@/app/_components/service-card";
import { getServices, getFeaturedServices } from "./_common/api";
import { Service } from "@/app/_common/interfaces";
import { CTASection } from "@/app/_components/cta-section";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
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
      {/* ==================== HERO SLIDER ==================== */}
      <section className="relative h-screen w-full">
        {featuredServices.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            pagination={{ clickable: true }}
            className="h-full w-full"
          >
            {featuredServices.map((service, index) => (
              <SwiperSlide key={service._id} className="relative h-full w-full">
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
              </SwiperSlide>
            ))}
          </Swiper>
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
