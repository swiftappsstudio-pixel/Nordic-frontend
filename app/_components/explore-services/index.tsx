"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/app/_common/api";
import { Category } from "@/app/_common/interfaces";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ExploreOurServices() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track || categories.length === 0) return;

    const containerWidth = container.clientWidth;
    const cardWidth = window.innerWidth >= 768 ? 340 + 20 : 260 + 12;
    const visibleCards = Math.floor(containerWidth / cardWidth);
    const totalTrackWidth = categories.length * cardWidth;
    const newMax = Math.max(0, totalTrackWidth - containerWidth);

    setMaxOffset(newMax);
    setOffset((prev) => Math.min(prev, newMax));
  }, [categories]);

  useEffect(() => {
    getCategories(true)
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    recalculate();
    window.addEventListener("resize", recalculate);
    return () => window.removeEventListener("resize", recalculate);
  }, [recalculate]);

  const slide = (dir: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    const cardWidth = window.innerWidth >= 768 ? 340 + 20 : 260 + 12;
    const visibleCards = Math.floor(container.clientWidth / cardWidth);
    const slideAmount = cardWidth * Math.max(visibleCards, 1);

    if (dir === "left") {
      setOffset((prev) => Math.max(0, prev - slideAmount));
    } else {
      setOffset((prev) => Math.min(maxOffset, prev + slideAmount));
    }
  };

  const canGoLeft = offset > 0;
  const canGoRight = offset < maxOffset;

  if (loading) {
    return (
      <section id="our-services" className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto pl-4 md:pl-6">
          <div className="mb-8 md:mb-10">
            <span className="inline-block text-xs md:text-sm font-semibold uppercase tracking-widest text-[#D4A373] mb-2">What We Offer</span>
            <h2 className="text-2xl md:text-4xl font-semibold text-[#543826]">
              Browse Our Categories
            </h2>
            <div className="w-16 md:w-20 h-1 bg-[#543826] rounded-full mt-3" />
          </div>
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#543826]/30 border-t-[#543826] rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section id="our-services" className="py-10 md:py-16">
      <div className="max-w-7xl mx-auto pl-4 md:pl-6">
        <div className="mb-6 md:mb-10 pr-4 md:pr-6">
          <div>
            <span className="inline-block text-xs md:text-sm font-semibold uppercase tracking-widest text-[#D4A373] mb-2">What We Offer</span>
            <h2 className="text-2xl md:text-4xl font-semibold text-[#543826]">
              Browse Our Categories
            </h2>
            <div className="w-16 md:w-20 h-1 bg-[#543826] rounded-full mt-3" />
          </div>
        </div>
      </div>

      <div ref={containerRef} className="relative max-w-7xl mx-auto overflow-hidden pl-4 md:pl-6 pr-4 md:pr-6">
        {canGoLeft && (
          <button
            onClick={() => slide("left")}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow-lg border border-[#543826]/20 flex items-center justify-center text-[#543826] transition-all duration-300 hover:bg-[#543826] hover:text-white hover:border-[#543826] hover:shadow-xl"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {canGoRight && (
          <button
            onClick={() => slide("right")}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow-lg border border-[#543826]/20 flex items-center justify-center text-[#543826] transition-all duration-300 hover:bg-[#543826] hover:text-white hover:border-[#543826] hover:shadow-xl"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <div
          ref={trackRef}
          className="flex gap-3 md:gap-5 pb-4"
          style={{ transform: `translateX(-${offset}px)`, transition: "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)" }}
        >
          {categories.map((category) => (
            <Link
              key={category._id}
              href={category.link || `/${slugify(category.name)}`}
              className="group shrink-0 w-[260px] md:w-[340px]"
            >
              <div className="relative w-[260px] md:w-[340px] h-[200px] md:h-[260px] rounded-xl overflow-hidden">
                <Image
                  src={category.image || "/images/placeholder.png"}
                  alt={category.name}
                  fill
                  className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                  unoptimized
                />
                <Image
                  src={category.image || "/images/placeholder.png"}
                  alt={category.name}
                  fill
                  className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  unoptimized
                />
                <div className="absolute inset-0 bg-[#543826]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4 md:p-6">
                  <span className="font-brand text-lg md:text-2xl text-white font-semibold leading-tight">
                    {category.name}
                  </span>
                </div>
              </div>

              <h3 className="text-sm md:text-lg font-semibold text-[#543826] mt-2 md:mt-3 truncate">
                {category.name}
              </h3>

              {category.description && (
                <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-1.5 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
