"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  feedback: string;
  avatarUrl: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Salim Kammalayil",
    feedback: "It was really good, They came to my office and spend hours to complete the procedure.",
    avatarUrl: "/images/team1.JPG",
  },
  {
    id: 2,
    name: "Sarah Khan",
    feedback: "Very professional and fast delivery.",
    avatarUrl: "/images/team2.JPG",
  },
  {
    id: 3,
    name: "Reza daryaeei",
    feedback: "Thank you Nordic Home care center. Thanks to Dr. Ali and Dr. Shakila for good service and the nurses are so kind and helpful \u2014 highly recommended this centre for treatment.",
    avatarUrl: "/images/team2.JPG",
  },
  {
    id: 4,
    name: "Hanin rash",
    feedback: "Excellent home healthcare centre for IV drips and nursing care. Very professional nurses and European standard. Highly recommended.",
    avatarUrl: "/images/team2.JPG",
  },
];

export const Testimonials = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3);
      } else if (window.innerWidth >= 640) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const maxSlide = Math.max(0, testimonialsData.length - slidesPerView);
  const gap = 20;
  const cardFlexBasis = `calc((100% - ${(slidesPerView - 1) * gap}px) / ${slidesPerView})`;

  const goTo = useCallback(
    (index: number) => {
      setCurrentSlide(index);
      if (trackRef.current && slidesPerView > 0) {
        trackRef.current.style.transition = "transform 500ms ease-in-out";
        trackRef.current.style.transform = `translateX(-${index * (100 / slidesPerView)}%)`;
      }
    },
    [slidesPerView]
  );

  const prev = () => goTo(Math.max(currentSlide - 1, 0));
  const next = () => goTo(Math.min(currentSlide + 1, maxSlide));

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-black text-center mb-10">
          What Our Clients Say
        </h2>

        {/* Card Track */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex"
          >
            {testimonialsData.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 pr-5 last:pr-0"
                style={{ flexBasis: cardFlexBasis }}
              >
                <div className="group">
                  <span className="block -mb-5 -ml-1 text-7xl text-[#543826]/10 leading-none font-serif select-none pointer-events-none">
                    {"\u201c"}
                  </span>

                  <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 p-6 pt-8 transition-all duration-300 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#543826]/15 ring-offset-2 ring-offset-white shrink-0">
                        <Image
                          src={item.avatarUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-[#593E30] tracking-wide">
                          {item.name}
                        </h3>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 text-amber-400 fill-current"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M10 15l-5.878 3.09 1.121-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.755 4.535 1.121 6.545z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed">{`"${item.feedback}"`}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            disabled={currentSlide === 0}
            className="group w-12 h-12 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:shadow-lg hover:bg-[#543826] hover:border-[#543826] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-5 h-5 transition-colors group-hover:stroke-white"
              fill="none"
              stroke="#5B3C2A"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="flex items-center gap-2">
            {Array.from({ length: maxSlide + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-6 h-2.5 bg-[#543826]" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={currentSlide >= maxSlide}
            className="group w-12 h-12 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:shadow-lg hover:bg-[#543826] hover:border-[#543826] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
            aria-label="Next testimonial"
          >
            <svg
              className="w-5 h-5 transition-colors group-hover:stroke-white"
              fill="none"
              stroke="#5B3C2A"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
