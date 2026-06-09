"use client";

import { useEffect, useState, useRef } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCategories(true)
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="our-services" className="py-16">
        <div className="max-w-7xl mx-auto pl-6">
          <div className="mb-10">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-[#D4A373] mb-2">What We Offer</span>
            <h2 className="text-4xl font-semibold text-[#543826]">
              Browse Our Categories
            </h2>
            <div className="w-20 h-1 bg-[#543826] rounded-full mt-3" />
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
    <section id="our-services" className="py-16">
      <div className="max-w-7xl mx-auto pl-6">
        <div className="mb-10">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-[#D4A373] mb-2">What We Offer</span>
          <h2 className="text-4xl font-semibold text-[#543826]">
            Browse Our Categories
          </h2>
          <div className="w-20 h-1 bg-[#543826] rounded-full mt-3" />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-4 pl-6"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((category) => (
          <Link
            key={category._id}
            href={category.link || `/${slugify(category.name)}`}
            className="group shrink-0 w-[340px]"
          >
            <div className="relative w-[340px] h-[260px] rounded-xl overflow-hidden">
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
              <div className="absolute inset-0 bg-[#543826]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                <span className="font-brand text-2xl text-white font-semibold leading-tight">
                  {category.name}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-[#543826] mt-3 truncate">
              {category.name}
            </h3>

            {category.description && (
              <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                {category.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}