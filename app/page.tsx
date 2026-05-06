// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// import ServiceCard from "@/app/_components/service-card";
// import { getServices, getFeaturedServices } from "./_common/api";
// import { Service } from "@/app/_common/interfaces";
// import { CTASection } from "@/app/_components/cta-section";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import BrandSlider from "./_components/collobration-brands";

// import "swiper/css";
// import "swiper/css/pagination";
// import { Testimonials } from "./_components/testimonials";

// export default function Home() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);

//   // const slides = [
//   //   "/images/hero banner 3.png",
//   //   "/images/hero banner 4.png",
//   //   "/images/banner2.png",
//   // ];

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [servicesData, featured] = await Promise.all([
//           getServices(),
//           getFeaturedServices(),
//         ]);
//         setServices(servicesData);
//         setFeaturedServices(featured);
//       } catch (err: unknown) {
//         console.error("Fetch error:", err);
//         setServices([]);
//         setFeaturedServices([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   return (
//     <>
//       {/* ==================== HERO SLIDER ==================== */}
//       <section className="relative h-screen w-full">
//         {featuredServices.length > 0 ? (
//           <Swiper
//             modules={[Autoplay, Pagination]}
//             autoplay={{ delay: 4000, disableOnInteraction: false }}
//             loop
//             pagination={{ clickable: true }}
//             className="h-full w-full"
//           >
//             {featuredServices.map((service, index) => (
//               <SwiperSlide key={service._id} className="relative h-full w-full">
//                 {/* Background Image */}
//                 {service.images?.[0] ? (
//                   <Image
//                     src={service.images[0]}
//                     alt={service.title}
//                     fill
//                     className="object-cover"
//                     priority={index === 0}
//                     unoptimized
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-[#543826]" />
//                 )}

//                 {/* Dark overlay */}
//                 <div className="absolute inset-0 bg-black/50" />

//                 {/* Text overlay */}
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="max-w-6xl mx-auto px-6 w-full">
//                     <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-2xl">
//                       {service.title}
//                     </h1>
//                     {service.description && (
//                       <p className="text-white/80 text-base md:text-lg mb-6 max-w-xl line-clamp-3">
//                         {service.description}
//                       </p>
//                     )}
//                     <Link
//                       href={`/services/${service._id}`}
//                       className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition"
//                     >
//                       Book Now
//                     </Link>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         ) : (
//           <div className="w-full h-full bg-[#543826] flex items-center justify-center">
//             <div className="text-center">
//               <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
//                 Nordic Home Healthcare
//               </h1>
//               <p className="text-white/80 text-lg">
//                 Quality healthcare at your doorstep
//               </p>
//             </div>
//           </div>
//         )}
//       </section>

//       {/* Services Section */}
//       <section className="max-w-6xl mx-auto py-10 px-5 md:px-0">
//         <h2 className="text-2xl font-bold mb-6">Our Services</h2>

//         {loading && <p className="text-gray-500">Loading services...</p>}

//         {!loading && services.length === 0 && (
//           <p className="text-gray-500">No services available.</p>
//         )}

//         {!loading && services.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {services.map((service) => (
//               <ServiceCard
//                 key={service._id}
//                 id={service._id}
//                 image={service.images?.[0]}
//                 title={service.title}
//                 price={service.discountPrice ?? service.actualPrice ?? 0}
//                 actualPrice={service.actualPrice}
//                 description={service.description}
//               />
//             ))}
//           </div>
//         )}
//       </section>
//       <CTASection
//         title="Ready to get started?"
//         phoneNumber="+923414415384"
//         message="Hello! I'm interested in booking a service. Can you provide more details?"
//         imageUrl="/images/CTA!.jpg"
//         buttonText="Book Now"
//       />

//       {/* Testimonials */}
//       <section className="py-2 bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4 text-center">
//           <Testimonials />
//         </div>
//       </section>

//       <section className="py-2 bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4 text-center">
// <BrandSlider />
//           </div>
//         </section>
//     </>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ServiceCard from "@/app/_components/service-card";
import { getServices, getFeaturedServices } from "./_common/api";
import { Service } from "@/app/_common/interfaces";
import { CTASection } from "@/app/_components/cta-section";
import { Swiper, SwiperSlide } from "swiper/react";
import BrandSlider from "./_components/collobration-brands";
import { Testimonials } from "./_components/testimonials";
import { Autoplay, Pagination, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, featured] = await Promise.all([
          getServices(),
          getFeaturedServices(),
        ]);

        setServices(servicesData);
        setFeaturedServices(featured);

        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...Array.from(new Set(servicesData.map((s) => s.category))),
        ];

        setCategories(uniqueCategories);
      } catch (err: unknown) {
        console.error("Fetch error:", err);
        setServices([]);
        setFeaturedServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter services
  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  // Handle click
  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);

    document.getElementById("services-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* ==================== HERO SLIDER ==================== */}
      <section className="relative h-screen w-full">
        {featuredServices.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            pagination={{ clickable: true }}
            className="h-full w-full"
          >
            {featuredServices.map((service, index) => (
              <SwiperSlide key={service._id} className="relative h-full w-full">
                {/* Background Image */}
                {service.images?.[0] ? (
                  <Image
                    src={service.images[0]}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[#543826]" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-6xl mx-auto px-6 w-full">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-2xl">
                      {service.title}
                    </h1>

                    {service.description && (
                      <p className="text-white/80 text-base md:text-lg mb-6 max-w-xl line-clamp-3">
                        {service.description}
                      </p>
                    )}

                    <Link
                      href={`/services/${service._id}`}
                      className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full bg-[#543826] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Nordic Home Healthcare
              </h1>
              <p className="text-white/80 text-lg">
                Quality healthcare at your doorstep
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ==================== CATEGORY SLIDER ==================== */}
    {/* ==================== CATEGORY SCROLL ==================== */}
<section className="py-4 bg-white">
  <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl text-black font-bold mb-6">Our Services</h2>

    <div className="flex gap-3 overflow-x-auto scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategoryClick(cat)}
          className={`px-4 py-2 rounded-full border whitespace-nowrap transition flex-shrink-0
            ${
              selectedCategory === cat
                ? "bg-[#593E30] text-white border-[#593E30]"
                : "bg-gray-100 text-gray-700"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>

  </div>
</section>

      {/* ==================== SERVICES ==================== */}
      <section
        id="services-section"
        className="max-w-6xl mx-auto py-10 px-5 md:px-0"
      >

        {loading && <p className="text-gray-500">Loading services...</p>}

        {!loading && filteredServices.length === 0 && (
          <p className="text-gray-500">No services available.</p>
        )}

        {!loading && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                id={service._id}
                image={service.images?.[0]}
                title={service.title}
                price={service.discountPrice ?? service.actualPrice ?? 0}
                actualPrice={service.actualPrice}
                description={service.description}
              />
            ))}
          </div>
        )}
      </section>

      {/* ==================== CTA ==================== */}
      <CTASection
        title="Ready to get started?"
        phoneNumber="+923414415384"
        message="Hello! I'm interested in booking a service. Can you provide more details?"
        imageUrl="/images/CTA!.jpg"
        buttonText="Book Now"
      />

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-2 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Testimonials />
        </div>
      </section>

      {/* ==================== BRANDS ==================== */}
      <section className="py-2 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <BrandSlider />
        </div>
      </section>
    </>
  );
}