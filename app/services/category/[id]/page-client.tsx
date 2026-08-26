"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getServicesByCategory, getCategories } from "@/app/_common/api";
import { Service, Category } from "@/app/_common/interfaces";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface Props {
  slug: string;
}

export default function CategoryServicesPage({ slug }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        const categories = await getCategories();
        const found = categories.find((c) => {
          if (c.link) {
            const linkSlug = c.link.replace(/^\/+|\/+$/g, "").split("/").pop();
            return linkSlug === slug;
          }
          return slugify(c.name) === slug;
        });

        if (!found) {
          router.replace("/");
          return;
        }

        setCategory(found);
        const servicesData = await getServicesByCategory(found._id);
        setServices(servicesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, router]);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-5">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#543826]">Home</Link>
          <span>/</span>
          <span className="text-[#543826] font-medium">
            {category?.name || "Category"}
          </span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#543826]">
            {category?.name || "Services"}
          </h1>
          {category?.description && (
            <p className="text-gray-600 mt-2">{category.description}</p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No services found in this category.</p>
            <Link href="/" className="text-orange-500 hover:underline mt-2 inline-block">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service._id}
                href={`/services/${service._id}`}
                className="block"
              >
                <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition p-4 cursor-pointer">
                  {service.images?.[0] && (
                    <div className="w-full h-48 relative">
                      <Image
                        src={service.images[0]}
                        alt={service.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <h3 className="text-lg text-[#543826] font-semibold mt-3">
                    {service.title}
                  </h3>
                  {service.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3">
                    {service.discountPrice && service.actualPrice && service.discountPrice < service.actualPrice ? (
                      <>
                        <span className="text-orange-600 font-bold text-xl">
                          AED {service.discountPrice}
                        </span>
                        <span className="text-gray-400 line-through text-md">
                          AED {service.actualPrice}
                        </span>
                      </>
                    ) : (
                      service.actualPrice && (
                        <span className="text-orange-600 font-bold text-xl">
                          AED {service.actualPrice}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}