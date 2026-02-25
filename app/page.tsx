"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import ServiceCard from "@/app/_components/service-card";
import { getServices } from "./_common/api";
import { Service } from "@/app/_common/interfaces";
import {CTASection} from "@/app/_components/cta-section";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { Testimonials } from "./_components/testimonials";

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const slides = [
    "/images/hero banner 3.png",
    "/images/hero banner 4.png",
    "/images/banner2.png",
  ];

  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesData = await getServices();
        console.log("Fetched services:", servicesData);
        setServices(servicesData);
      } catch (err: unknown) {
        console.error("Service fetch error:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <>
      {/* Hero Slider */}
      <section className="relative h-screen w-full">
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
         
          <div className="grid  gap-6">
            <Testimonials/>
          </div>
      </section>
              
    </>
  );
}
