"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServiceDetail } from "@/app/_common/api";
import { ServiceWithVariants, Variant } from "@/app/_common/interfaces";
import { CTASection } from "@/app/_components/cta-section";

type Tab = "benefits" | "ingredients" | "disclaimer";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [service, setService] = useState<ServiceWithVariants | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("benefits");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getServiceDetail(id)
      .then((data) => {
        setService(data);
        const defaultVariant =
          data.variants?.find((v) => v.isDefault) || data.variants?.[0];
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
        <Link href="/" className="text-orange-500 hover:underline mt-2">
          Back to Home
        </Link>
      </div>
    );
  }

  const images = service.images || [];
  const subServices = service.subServices || [];
  const benefits = service.keyBenefits || [];
  const ingredients = service.keyIngredients || [];

  const tabs: { key: Tab; label: string }[] = [
    { key: "benefits", label: "Key Benefits" },
    { key: "ingredients", label: "Key Ingredients" },
    { key: "disclaimer", label: "Disclaimer" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#543826]">
            Home
          </Link>
          <span>/</span>
          {service.category && (
            <>
              <span className="hover:text-[#543826]">{service.category}</span>
              <span>/</span>
            </>
          )}
          <span className="text-[#543826] font-medium">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ====== Left — Images ====== */}
          <div>
            {images.length > 0 ? (
              <>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow">
                  <Image
                    src={images[activeImage]}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
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
                          activeImage === i
                            ? "border-orange-500"
                            : "border-transparent opacity-70 hover:opacity-100"
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
              <div className="aspect-[4/5] rounded-2xl bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* ====== Right — Info ====== */}
          <div className="space-y-6">
            {/* Description */}
            {service.description && (
              <p className="text-gray-700 leading-relaxed text-[15px]">
                {service.description}
              </p>
            )}

            {/* Tabs: Key Benefits | Key Ingredients | Disclaimer */}
            <div>
              <div className="flex gap-6 border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-2 text-sm font-medium transition ${
                      activeTab === tab.key
                        ? "text-[#543826] border-b-2 border-[#543826]"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="mt-4 bg-white rounded-xl border border-gray-100 p-5 min-h-[160px]">
                {activeTab === "benefits" && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Benefits:</h4>
                    {benefits.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1.5 text-gray-600 text-sm">
                        {benefits.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm">No benefits listed.</p>
                    )}
                  </div>
                )}

                {activeTab === "ingredients" && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Key Ingredients:
                    </h4>
                    {ingredients.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1.5 text-gray-600 text-sm">
                        {ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No ingredients listed.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "disclaimer" && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Disclaimer:
                    </h4>
                    {service.disclaimer ? (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service.disclaimer}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No disclaimer provided.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ====== Available Sub-Services ====== */}
            {subServices.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-gray-800 font-semibold mb-4">
                  Available ~ {subServices.length} Services
                </h3>

                <div className="space-y-4">
                  {subServices.map((sub, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="inline-block text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded mb-2">
                            Service
                          </span>
                          <p className="text-gray-800 font-medium">
                            {sub.name}
                          </p>
                        </div>
                        <span className="text-orange-600 font-bold whitespace-nowrap">
                          AED {sub.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() =>
                            router.push(`/services/${id}/book?sub=${i}`)
                          }
                          className="bg-[#543826] hover:bg-[#3e2a1c] text-white text-sm font-medium px-5 py-2 rounded-lg transition"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ====== Variant Selection (if no sub-services) ====== */}
            {subServices.length === 0 &&
              service.variants &&
              service.variants.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#543826] mb-3">
                    Select Package
                  </h3>
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
                            <p className="font-semibold text-[#543826]">
                              {variant.name}
                            </p>
                            {variant.description && (
                              <p className="text-gray-500 text-sm mt-1">
                                {variant.description}
                              </p>
                            )}
                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                              <span>{variant.sessions} sessions</span>
                              {variant.freeSessions > 0 && (
                                <span className="text-green-600">
                                  +{variant.freeSessions} free
                                </span>
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

                  {/* Book Now Button */}
                  <button
                    onClick={() => {
                      if (selectedVariant) {
                        router.push(
                          `/services/${id}/book?variant=${selectedVariant._id}`
                        );
                      } else {
                        router.push(`/services/${id}/book`);
                      }
                    }}
                    className="w-full mt-4 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold py-4 rounded-xl text-lg transition"
                  >
                    Book Now
                  </button>
                </div>
              )}

            {/* ====== Base Price Only (no sub-services, no variants) ====== */}
            {subServices.length === 0 &&
              (!service.variants || service.variants.length === 0) && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-800 font-semibold">
                      {service.title}
                    </h3>
                    <span className="text-orange-600 font-bold text-xl">
                      AED{" "}
                      {(
                        service.discountPrice ??
                        service.actualPrice ??
                        0
                      ).toFixed(2)}
                    </span>
                  </div>
                  {service.actualPrice &&
                    service.discountPrice &&
                    service.discountPrice < service.actualPrice && (
                      <p className="text-sm text-gray-400 line-through mb-4">
                        AED {service.actualPrice.toFixed(2)}
                      </p>
                    )}
                  <button
                    onClick={() => router.push(`/services/${id}/book`)}
                    className="w-full bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold py-4 rounded-xl text-lg transition"
                  >
                    Book Now
                  </button>
                </div>
                
              )}
              
          </div>
        
        </div>
          
      </div>
       <CTASection
                      title="Ready to get started?"
                      phoneNumber="+923414415384"
                      message="Hello! I'm interested in booking a service. Can you provide more details?"
                      imageUrl="/images/CTA!.jpg"
                      buttonText="Book Now"
                    />
    </div>
  );
}
