"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getServices } from "@/app/_common/api";
import { Service } from "@/app/_common/interfaces";

export default function ExploreOurServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getServices()
      .then((data) => setServices(data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="our-services" className="py-16">
        <div className="max-w-7xl mx-auto pl-6">
          <h2 className="text-4xl font-semibold text-[#543826] mb-10">
            Explore our services
          </h2>
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#543826]/30 border-t-[#543826] rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) return null;

  return (
    <section id="our-services" className="py-16">
      <div className="max-w-7xl mx-auto pl-6">
        <h2 className="text-4xl font-semibold text-[#543826] mb-10">
          Explore our services
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-4 pl-6"
        style={{ scrollbarWidth: "none" }}
      >
        {services.map((service) => (
          <Link
            key={service._id}
            href={`/services/${service._id}`}
            className="group shrink-0 w-[340px]"
          >
            <div className="relative w-[340px] h-[260px] rounded-xl overflow-hidden">
              <Image
                src={service.images?.[0] || "/images/placeholder.png"}
                alt={service.title}
                fill
                className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                unoptimized
              />
              <Image
                src={service.images?.[1] || service.images?.[0] || "/images/placeholder.png"}
                alt={service.title}
                fill
                className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                unoptimized
              />
              <div className="absolute inset-0 bg-[#543826]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                <span className="font-brand text-2xl text-white font-semibold leading-tight">
                  {service.title}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-[#543826] mt-3 truncate">
              {service.title}
            </h3>

            {service.description && (
              <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                {service.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}