"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getServices } from "@/app/_common/api";
import { Service } from "@/app/_common/interfaces";

interface ServicesSectionProps {
  // category name to match against (partial, case-insensitive)
  categoryFilter?: string;
  heading: string;
  subheading?: string;
  label?: string;
  accentColor?: string;
  bgColor?: string;
}

export default function ServicesSection({
  categoryFilter = "",
  heading,
  subheading,
  label = "Our Services",
  accentColor = "#2D5B4F",
  bgColor = "bg-white",
}: ServicesSectionProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getServices()
      .then((all) => {
        if (!categoryFilter) {
          setServices(all);
        } else {
          const kw = categoryFilter.toLowerCase();
          const filtered = all.filter((s) => {
            const cat = (s.category || "").toLowerCase();
            return cat.includes(kw);
          });
          setServices(filtered);
        }
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [categoryFilter]);

  const categories = ["All", ...Array.from(new Set(services.map((s) => s.category).filter(Boolean) as string[]))];
  const filtered = activeCategory === "All" ? services : services.filter((s) => s.category === activeCategory);

  if (!loading && services.length === 0) return null;

  return (
    <section className={`py-20 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: accentColor }}>
              {label}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{heading}</h2>
            {subheading && <p className="text-gray-400 text-sm mt-2">{subheading}</p>}
          </div>
          <Link
            href="/services"
            className="shrink-0 text-sm font-semibold flex items-center gap-1 transition-colors hover:opacity-70"
            style={{ color: accentColor }}
          >
            View all services
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: `${accentColor}30`, borderTopColor: accentColor }} />
          </div>
        ) : (
          <>
            {/* Category filter */}
            {categories.length > 2 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                    style={
                      activeCategory === cat
                        ? { backgroundColor: accentColor, color: "#fff" }
                        : { backgroundColor: `${accentColor}15`, color: accentColor }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((svc) => (
                <div
                  key={svc._id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
                    {svc.images?.[0] ? (
                      <Image
                        src={svc.images[0]}
                        alt={svc.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}30)` }}
                      >
                        <svg className="w-10 h-10 opacity-30" fill="none" stroke={accentColor} strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    {svc.discountPrice && svc.actualPrice && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                        {Math.round(((svc.actualPrice - svc.discountPrice) / svc.actualPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    {svc.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: accentColor }}>
                        {svc.category}
                      </span>
                    )}
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{svc.title}</h3>
                    {svc.description && (
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">{svc.description}</p>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      {svc.discountPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-gray-900">AED {svc.discountPrice}</span>
                          <span className="text-sm text-gray-300 line-through">AED {svc.actualPrice}</span>
                        </div>
                      ) : svc.actualPrice ? (
                        <span className="text-xl font-bold text-gray-900">AED {svc.actualPrice}</span>
                      ) : null}
                    </div>

                    <button
                      onClick={() => router.push(`/services/${svc._id}/book`)}
                      className="w-full text-white font-semibold py-2.5 rounded-xl transition text-sm hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
