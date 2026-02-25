"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

interface Testimonial {
  id: number;
  name: string;
  feedback: string;
  avatarUrl: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "John Doe",
    feedback: "Amazing service! Highly recommended.",
    avatarUrl: "/avatar1.jpg",
  },
  {
    id: 2,
    name: "Sarah Khan",
    feedback: "Very professional and fast delivery.",
    avatarUrl: "/avatar2.jpg",
  },
  {
    id: 3,
    name: "Ali Ahmed",
    feedback: "Excellent experience from start to finish.",
    avatarUrl: "/avatar3.jpg",
  },
  {
    id: 4,
    name: "Maria Ali",
    feedback: "Outstanding support and quality work.",
    avatarUrl: "/avatar4.jpg",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-black text-center mb-10">
          What Our Clients Say
        </h2>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          loop={true}
          navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
          }}
        >
          {testimonialsData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition h-full">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={item.avatarUrl}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <h3 className="font-semibold text-lg text-[#593E30]">
                    {item.name}
                  </h3>
                </div>

                <p className="text-black text-sm leading-relaxed">
                  &quot;{item.feedback}&quot;
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};