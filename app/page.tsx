"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ServiceCard from "@/app/_components/service-card";
import { getFeaturedServices, getCategories, getServicesByCategory } from "./_common/api";
import { Service, Category } from "@/app/_common/interfaces";
import { CTASection } from "@/app/_components/cta-section";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { Testimonials } from "./_components/testimonials";

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryServices, setCategoryServices] = useState<Service[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryServicesLoading, setCategoryServicesLoading] = useState(false);

  const [featuredServicesLoading, setFeaturedServicesLoading] = useState(true);

  // const slides = [
  //   "/images/hero banner 3.png",
  //   "/images/hero banner 4.png",
  //   "/images/banner2.png",
  // ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setFeaturedServicesLoading(true);
        const [featured] = await Promise.all([
          getFeaturedServices(),
        ]);
        setFeaturedServices(featured);
      } catch (err: unknown) {
        console.error("Fetch error:", err);
        setFeaturedServices([]);
      } finally {
        setFeaturedServicesLoading(false);
      }
    };

    loadData();
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        const activeCategories = data.filter((cat) => cat.isActive);
        setCategories(activeCategories);
        if (activeCategories.length > 0) {
          setSelectedCategory(activeCategories[0].name);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Fetch services when a category is selected
  useEffect(() => {
    if (!selectedCategory) return;

    const loadCategoryServices = async () => {
      setCategoryServicesLoading(true);
      try {
        const cat = categories.find((c) => c.name === selectedCategory);
        if (!cat) {
          setCategoryServices([]);
          return;
        }
        const data = await getServicesByCategory(cat._id);
        setCategoryServices(data);
      } catch (err) {
        console.error("Failed to fetch services for category:", err);
        setCategoryServices([]);
      } finally {
        setCategoryServicesLoading(false);
      }
    };

    loadCategoryServices();
  }, [selectedCategory, categories]);

  return (
    <>
      {/* ==================== HERO SLIDER ==================== */}
      <section className="relative h-screen w-full">
        {featuredServicesLoading ? (
          <div className="flex items-center justify-center h-full bg-[#543826]">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : featuredServices.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            pagination={{ clickable: true }}
            className="h-full w-full"
          >
            {featuredServices.map((service, index) => (
              <SwiperSlide key={service._id} className="relative h-full w-full">
                {/* Background Image */}
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

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Text overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-6xl mx-auto px-6 w-full">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-2xl">
                      {service.title}
                    </h1>
                    {service.description && (
                      <p className="text-white/80 text-base md:text-lg mb-6 max-w-xl line-clamp-3">
                        {service.description}
                      </p>
                    )}
                    <Link
                      href={`/services/${service._id}`}
                      className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
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

        {/* Category Tabs */}
        {!categoriesLoading && categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.name
                    ? "bg-[#543826] text-white"
                    : "bg-[#F4F4F4] text-[#543826] hover:bg-[#e5e5e5]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Services Grid for Selected Category */}
        {categoryServicesLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#543826]/30 border-t-[#543826] rounded-full animate-spin" />
          </div>
        ) : categoryServices.length === 0 ? (
          <p className="text-gray-500">No services available in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryServices.map((service) => (
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
        imageUrl="/images/CTA!.jpg"
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
