"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServiceDetail } from "@/app/_common/api";
import { ServiceWithVariants, Variant } from "@/app/_common/interfaces";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [service, setService] = useState<ServiceWithVariants | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getServiceDetail(id)
      .then((data) => {
        setService(data);
        const defaultVariant = data.variants?.find((v) => v.isDefault) || data.variants?.[0];
        if (defaultVariant) setSelectedVariant(defaultVariant);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <p className="text-gray-500 text-lg">Service not found.</p>
        <Link href="/" className="text-orange-500 hover:underline mt-2">Back to Home</Link>
      </div>
    );
  }

  const images = service.images || [];
  const displayPrice = service.discountPrice ?? service.actualPrice;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#543826]">Home</Link>
          <span>/</span>
          {service.category && (
            <>
              <span className="hover:text-[#543826]">{service.category}</span>
              <span>/</span>
            </>
          )}
          <span className="text-[#543826] font-medium">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left — Images */}
          <div>
            {images.length > 0 ? (
              <>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow">
                  <Image
                    src={images[activeImage]}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-3 mt-4">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                          activeImage === i ? "border-orange-500" : "border-transparent"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${service.title} ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square rounded-2xl bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div>
            <h1 className="text-3xl font-bold text-[#543826] mb-2">{service.title}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              {service.discountPrice && service.actualPrice && service.discountPrice < service.actualPrice ? (
                <>
                  <span className="text-3xl font-bold text-orange-600">AED {service.discountPrice}</span>
                  <span className="text-xl text-gray-400 line-through">AED {service.actualPrice}</span>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                    {Math.round(((service.actualPrice - service.discountPrice) / service.actualPrice) * 100)}% OFF
                  </span>
                </>
              ) : (
                displayPrice && (
                  <span className="text-3xl font-bold text-orange-600">AED {displayPrice}</span>
                )
              )}
            </div>

            {/* Description */}
            {service.description && (
              <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
            )}

            {/* Key Benefits */}
            {service.keyBenefits && service.keyBenefits.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-[#543826] mb-2">Key Benefits</h3>
                <ul className="space-y-1">
                  {service.keyBenefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                      <span className="text-green-500 mt-0.5">&#10003;</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variant Selection */}
            {service.variants && service.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-[#543826] mb-3">Select Package</h3>
                <div className="grid gap-3">
                  {service.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition ${
                        selectedVariant?._id === variant._id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-[#543826]">{variant.name}</p>
                          {variant.description && (
                            <p className="text-gray-500 text-sm mt-1">{variant.description}</p>
                          )}
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            <span>{variant.sessions} sessions</span>
                            {variant.freeSessions > 0 && (
                              <span className="text-green-600">+{variant.freeSessions} free</span>
                            )}
                            <span>Valid {variant.validityInDays} days</span>
                          </div>
                        </div>
                        <span className="text-orange-600 font-bold text-lg">
                          AED {variant.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            {service.disclaimer && (
              <p className="text-xs text-gray-400 mb-6">{service.disclaimer}</p>
            )}

            {/* Book Now Button */}
            <button
              onClick={() => {
                if (selectedVariant) {
                  router.push(`/services/${id}/book?variant=${selectedVariant._id}`);
                } else {
                  router.push(`/services/${id}/book`);
                }
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl text-lg transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
