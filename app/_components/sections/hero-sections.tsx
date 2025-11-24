"use client";

import { useEffect, useState } from "react";

const images = [
  "/images/hero-1.jpeg",
  "/images/hero-1.jpeg",
  "/images/hero-1.jpeg",
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[90vh] overflow-hidden">

      {/* Images */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`
            absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms]
            ${current === index ? "opacity-100" : "opacity-0"}
          `}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-5">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeIn">
          Book Your Appointment Today
        </h1>

        <p className="text-lg md:text-xl mb-6 opacity-90 animate-fadeIn delay-200">
          Premium home healthcare at your doorstep.
        </p>

        <a
          href="/booking"
          className="bg-[#FF5E00] hover:bg-[#e45500] transition-all duration-300 px-8 py-4 rounded-lg text-lg font-semibold shadow-xl animate-fadeIn delay-300"
        >
          Book Now
        </a>
      </div>
    </section>
  );
}
