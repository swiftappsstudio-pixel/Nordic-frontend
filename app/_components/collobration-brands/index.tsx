"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

type Brand = {
  id: number;
  name: string;
  logo: string;
};

const brands: Brand[] = [
  { id: 1, name: "Nike", logo: "/images/nextcare.webp" },
  { id: 2, name: "Adidas", logo: "/images/entertainer.webp" },
  { id: 3, name: "Adidas", logo: "/images/visa master.webp" },
  { id: 4, name: "Adidas", logo: "/images/dewa.webp" },
  { id: 5, name: "Adidas", logo: "/images/fazacard.webp" },
  { id: 6, name: "Adidas", logo: "/images/swest.webp" },
    { id: 7, name: "Adidas", logo: "/images/emirate platenium.webp" },

];

export default function BrandSlider() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl text-black font-bold mb-3">
          Collaborations & Discounts
        </h2>
        <p className="text-gray-500 mb-8">
          We partner with top brands to bring you exclusive deals
        </p>

        {/* Slider */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.id}>
              <div className="bg-white rounded-xl shadow-sm p-4 m-2 flex items-center justify-center h-24 hover:shadow-md transition">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}