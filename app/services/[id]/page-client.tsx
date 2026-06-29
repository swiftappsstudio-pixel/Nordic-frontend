"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getServiceDetail } from "@/app/_common/api";
import { ServiceWithVariants, Variant } from "@/app/_common/interfaces";
import { CTASection } from "@/app/_components/cta-section";

type Tab = "benefits" | "ingredients" | "disclaimer";

interface Props {
  id: string;
}

export default function ServiceDetailPage({ id }: Props) {
  const router = useRouter();
  const [service, setService] = useState<ServiceWithVariants | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [useBasePrice, setUseBasePrice] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("benefits");
  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getServiceDetail(id)
      .then((data) => {
        setService(data);
        const defaultVariant =
          data.variants?.find((v) => v.isDefault) || data.variants?.[0];
        if (defaultVariant) {
          setSelectedVariant(defaultVariant);
        } else {
          setUseBasePrice(true);
        }
        if ((data.keyBenefits?.length ?? 0) > 0) setActiveTab("benefits");
        else if ((data.keyIngredients?.length ?? 0) > 0) setActiveTab("ingredients");
        else if (data.disclaimer?.trim()) setActiveTab("disclaimer");
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
  const benefits = (service.keyBenefits || []).filter((b: string) => b.trim().length > 0);
  const BENEFITS_LIMIT = 4;
  const displayedBenefits = showAllBenefits ? benefits : benefits.slice(0, BENEFITS_LIMIT);
  const hasMoreBenefits = benefits.length > BENEFITS_LIMIT;
  const ingredients = (service.keyIngredients || []).filter((ing: string) => ing.trim().length > 0);
  const INGREDIENTS_LIMIT = 4;
  const displayedIngredients = showAllIngredients ? ingredients : ingredients.slice(0, INGREDIENTS_LIMIT);
  const hasMoreIngredients = ingredients.length > INGREDIENTS_LIMIT;

  const DISCLAIMER_LIMIT = 150;
  const disclaimerText = service.disclaimer || "";
  const truncatedDisclaimer = disclaimerText.length > DISCLAIMER_LIMIT
    ? disclaimerText.slice(0, DISCLAIMER_LIMIT) + "..."
    : disclaimerText;

  const tabs: { key: Tab; label: string }[] = [
    ...(benefits.length > 0 ? [{ key: "benefits" as Tab, label: "Key Benefits" }] : []),
    ...(ingredients.length > 0 ? [{ key: "ingredients" as Tab, label: "Key Ingredients" }] : []),
    ...(service.disclaimer?.trim() ? [{ key: "disclaimer" as Tab, label: "Disclaimer" }] : []),
  ];

  const hasAnyTabContent = tabs.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28">
      <div className="max-w-6xl mx-auto px-5">
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-gray-500 mb-6">
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
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow border border-gray-200">
                  <Image
                    src={images[activeImage]}
                    alt={service.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition ${activeImage === i
                          ? "border-orange-500"
                          : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                      >
                        <Image
                          src={img}
                          alt={`${service.title} ${i + 1}`}
                          fill
                          className="object-contain"
                          sizes="80px"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-[4/3] rounded-2xl bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* ====== Right — Info ====== */}
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#543826]">{service.title}</h1>
            {service.description && (
              <p className="text-gray-700 leading-relaxed text-[15px]">
                {service.description}
              </p>
            )}

             {hasAnyTabContent && (
             <div>
               <div className="flex gap-4 sm:gap-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                 {tabs.map((tab) => (
                   <button
                     key={tab.key}
                     onClick={() => setActiveTab(tab.key)}
                     className={`pb-2 text-sm font-medium transition ${activeTab === tab.key
                       ? "text-[#543826] border-b-2 border-[#543826]"
                       : "text-gray-400 hover:text-gray-600"
                       }`}
                   >
                     {tab.label}
                   </button>
                 ))}
               </div>
               <div className="mt-4 bg-white rounded-xl border border-gray-100 p-5 min-h-[160px]">
                 <AnimatePresence mode="wait">
                   {activeTab === "benefits" && (
                     <motion.div
                       key="benefits"
                       initial={{ opacity: 0, y: 12 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -12 }}
                       transition={{ duration: 0.25, ease: "easeInOut" }}
                     >
                        <h4 className="font-semibold text-gray-800 mb-3">Benefits:</h4>
                        <ul className="list-disc list-inside space-y-1.5 text-gray-600 text-sm">
                          {displayedBenefits.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                        {hasMoreBenefits && !showAllBenefits && (
                          <button
                            onClick={() => setShowAllBenefits(true)}
                            className="mt-3 text-[#543826] font-medium text-sm hover:underline"
                          >
                            +{benefits.length - BENEFITS_LIMIT} more — Learn More
                          </button>
                        )}
                        {showAllBenefits && (
                          <button
                            onClick={() => setShowAllBenefits(false)}
                            className="mt-3 text-[#543826] font-medium text-sm hover:underline"
                          >
                            Show less
                          </button>
                        )}
                     </motion.div>
                   )}
                   {activeTab === "ingredients" && (
                     <motion.div
                       key="ingredients"
                       initial={{ opacity: 0, y: 12 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -12 }}
                       transition={{ duration: 0.25, ease: "easeInOut" }}
                     >
                       <h4 className="font-semibold text-gray-800 mb-3">Key Ingredients:</h4>
                        <ul className="list-disc list-inside space-y-1.5 text-gray-600 text-sm">
                          {displayedIngredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                        {hasMoreIngredients && !showAllIngredients && (
                          <button
                            onClick={() => setShowAllIngredients(true)}
                            className="mt-3 text-[#543826] font-medium text-sm hover:underline"
                          >
                            +{ingredients.length - INGREDIENTS_LIMIT} more — Learn More
                          </button>
                        )}
                        {showAllIngredients && (
                          <button
                            onClick={() => setShowAllIngredients(false)}
                            className="mt-3 text-[#543826] font-medium text-sm hover:underline"
                          >
                            Show less
                          </button>
                        )}
                     </motion.div>
                   )}
                   {activeTab === "disclaimer" && (
                     <motion.div
                       key="disclaimer"
                       initial={{ opacity: 0, y: 12 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -12 }}
                       transition={{ duration: 0.25, ease: "easeInOut" }}
                     >
                        <h4 className="font-semibold text-gray-800 mb-3">Disclaimer:</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {showFullDisclaimer ? disclaimerText : truncatedDisclaimer}
                        </p>
                        {disclaimerText.length > DISCLAIMER_LIMIT && !showFullDisclaimer && (
                          <button
                            onClick={() => setShowFullDisclaimer(true)}
                            className="mt-3 text-[#543826] font-medium text-sm hover:underline"
                          >
                            Learn More
                          </button>
                        )}
                        {showFullDisclaimer && (
                          <button
                            onClick={() => setShowFullDisclaimer(false)}
                            className="mt-3 text-[#543826] font-medium text-sm hover:underline"
                          >
                            Show less
                          </button>
                        )}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             </div>
             )}

             {(service.discountPrice ?? service.actualPrice) != null || service.variants?.length > 0 ? (
               <div>
                 <h3 className="font-semibold text-[#543826] mb-3">Select Package</h3>
                 <div className="grid gap-3">

                   {(service.discountPrice ?? service.actualPrice) != null && (
                     <button
                       onClick={() => { setSelectedVariant(null); setUseBasePrice(true); }}
                       className={`w-full text-left p-4 rounded-xl border-2 transition ${useBasePrice && !selectedVariant ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
                     >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                          <div>
                             <p className="font-semibold text-[#543826] text-sm sm:text-base">
                              {service.title}
                            </p>
                          </div>
                          <span className="text-orange-600 font-bold text-base sm:text-lg">
                            AED {(service.discountPrice ?? service.actualPrice ?? 0).toFixed(2)}
                          </span>
                        </div>
                     </button>
                   )}

                   {service.variants?.map((variant: any) => (
                     <button
                       key={variant._id}
                       onClick={() => { setSelectedVariant(variant); setUseBasePrice(false); }}
                       className={`w-full text-left p-4 rounded-xl border-2 transition ${selectedVariant?._id === variant._id ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"
                         }`}
                     >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <p className="font-semibold text-[#543826] text-sm sm:text-base">
                              {variant.name.split(/(Get \d+ Free)/i).map((part: any, i: any) =>
                                /Get \d+ Free/i.test(part)
                                  ? <span key={i} className="font-bold underline text-[#543826]">{part}</span>
                                  : part
                              )}
                            </p>
                            {variant.description && <p className="text-gray-500 text-sm mt-1">{variant.description}</p>}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                              {service?.isProduct === false ? <>{variant.sessions > 0 && <span>{variant.sessions} sessions</span>}
                                {variant.freeSessions > 0 && <span className="text-[#543826] font-bold underline">+{variant.freeSessions} free</span>}</> : ""}

                              {variant?.discountPercent > 0 && (
                                <span className="text-green-600 font-semibold">
                                  {variant.discountPercent}% OFF
                                </span>
                              )}                          </div>
                          </div>
                          <span className="text-orange-600 font-bold text-lg sm:text-xl whitespace-nowrap">AED {variant.price}</span>
                        </div>
                     </button>
                   ))}
                 </div>
               </div>
             ) : null}

            <button
              onClick={() => {
                if (selectedVariant) {
                  router.push(`/services/${id}/book?variant=${selectedVariant._id}`);
                } else if (subServices.length > 0) {
                  router.push(`/services/${id}/book?sub=0`);
                } else {
                  router.push(`/services/${id}/book`);
                }
              }}
              className="w-full mt-4 bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold py-3.5 sm:py-4 rounded-xl text-base sm:text-lg transition"
            >
              Book Now
            </button>

            {subServices.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-gray-800 font-semibold mb-4">Available ~ {subServices.length} Services</h3>
                <div className="space-y-4">
                  {subServices.map((sub, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <span className="inline-block text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded mb-2">Service</span>
                          <p className="text-gray-800 font-medium text-sm sm:text-base">{sub.name}</p>
                        </div>
                        <span className="text-orange-600 font-bold whitespace-nowrap text-base sm:text-lg">AED {sub.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => router.push(`/services/${id}/book?sub=${i}`)}
                          className="w-full sm:w-auto bg-[#543826] hover:bg-[#3e2a1c] text-white text-sm font-medium px-5 py-2 rounded-lg transition"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CTASection
        title="Ready to get started?"
        phoneNumber="+971581649910"
        message="Hello! I'm interested in booking a service. Can you provide more details?"
        imageUrl="/images/CTA!.jpg"
        buttonText="Book Now"
      />
    </div>
  );
}
