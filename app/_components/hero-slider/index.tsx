"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Service, Banner } from "@/app/_common/interfaces";

const SLIDE_DURATION = 4000;

interface HeroSliderProps {
  heroSlides: (Banner | Service)[];
}

export default function HeroSlider({ heroSlides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

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
                    sizes="100vw"
                    className="object-cover object-center hidden sm:block"
                    priority={index === 0}
                  />
                  <Image
                    src={(slide as Banner).mobileImage || (slide as Banner).image!}
                    alt={slide.title}
                    fill
                    sizes="100vw"
                    className="object-cover object-center block sm:hidden"
                    priority={index === 0}
                  />
                </>
              ) : (slide as Service).images?.[0] ? (
                <Image
                  src={(slide as Service).images![0]}
                  alt={slide.title}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                  priority={index === 0}
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
      ) : (
        <>
          <Image
            src="/images/Immune-Boost-Hydration-B.webp"
            alt="Nordic Home Healthcare"
            fill
            sizes="100vw"
            className="object-cover object-center hidden sm:block"
            priority
          />
          <Image
            src="/images/mother.png"
            alt="Nordic Home Healthcare"
            fill
            sizes="100vw"
            className="object-cover object-center block sm:hidden"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        </>
      )}
    </section>
  );
}
