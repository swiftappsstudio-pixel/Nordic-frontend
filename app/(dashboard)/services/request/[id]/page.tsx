"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Service, SubService } from "@/app/_common/interfaces";
import { getService } from "@/app/_common/api";
import Spacer from "@/app/_components/spacer";
import BookingModal from "@/app/_components/booking-model";

const TABS = {
  BENEFITS: "benefits",
  INGREDIENTS: "ingredients",
  DISCLAIMER: "disclaimer",
};

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams();

  const [service, setService] = useState<Service | null>(null);

  // unified selection for service/subservice
  const [selectedOption, setSelectedOption] = useState<{
    name: string;
    price: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

const [bookingData, setBookingData] = useState<{
  serviceName: string;
  price: number;
} | null>(null);


  const [activeTab, setActiveTab] = useState(TABS.BENEFITS);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id || Array.isArray(id)) {
      setError("Invalid service ID");
      setLoading(false);
      return;
    }

    const loadService = async () => {
      try {
        const data = await getService(id);
        setService(data);
        setActiveImage(data.images?.[0] || null);

        // auto-select main service by default
        setSelectedOption({
          name: data.title,
          price: data.discountPrice || data.actualPrice || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading service...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!service) return <p className="text-center py-10">Service not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Spacer />

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT – IMAGE SECTION */}
        <div className="lg:w-[40%] w-full">
          <div className="rounded-3xl overflow-hidden bg-gray-100 shadow-lg">
            {activeImage && (
              <Image
                src={`http://localhost:3100${activeImage}`}
                alt={service.title}
                width={600}
                height={600}
                unoptimized
                className="w-full h-[420px] object-cover"
              />
            )}
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {service.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                className={`border rounded-xl overflow-hidden ${
                  activeImage === img
                    ? "border-amber-700"
                    : "border-gray-200"
                }`}
              >
                <Image
                  src={`http://localhost:3100${img}`}
                  alt={`thumb-${index}`}
                  width={80}
                  height={80}
                  unoptimized
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT – CONTENT */}
        <div className="lg:w-[60%] w-full">
<h1 className="text-4xl font-bold mb-4">{service.title}</h1>
          <p className="text-gray-700 mb-6">{service.description}</p>
{/* tabs */}
      <div className="flex gap-8 border-b mb-6">

        
            {Object.values(TABS).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-medium capitalize ${
                  activeTab === tab ? "border-b-2 border-black" : "text-gray-500"
                }`}
              >
                {tab.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="bg-white rounded-xl shadow p-6 mb-10">
            {activeTab === TABS.BENEFITS && (
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {service.keyBenefits?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {activeTab === TABS.INGREDIENTS && (
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {service.keyIngredients?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {activeTab === TABS.DISCLAIMER && (
              <p className="text-gray-700">{service.disclaimer}</p>
            )}
          </div>

          

          {/* SERVICE OPTIONS TABLE */}
          <div className="border rounded-xl overflow-hidden shadow bg-white mb-10">
            {/* HEADER */}
            <div className="grid grid-cols-3 bg-gray-100 px-6 py-3 text-sm font-semibold">
              <span>Service</span>
              <span>Price</span>
              <span className="text-right">Action</span>
            </div>

            {/* MAIN SERVICE ROW */}
            <div
              className={`grid grid-cols-3 px-6 py-4 items-center border-t cursor-pointer ${
                selectedOption?.name === service.title
                  ? "bg-amber-50"
                  : "bg-white"
              }`}
            >
              <span className="font-medium">{service.title}</span>
              <span className="font-semibold">
                AED {service.discountPrice || service.actualPrice}
              </span>
              <div className="text-right">
               <button
  onClick={() => {
    setBookingData({
      serviceName: service.title,
      price: service.discountPrice || service.actualPrice || 0,
    });
    setIsModalOpen(true);
  }}
  className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md"
>
  Book Now
</button>

              </div>
            </div>

            {/* SUB SERVICES ROWS */}
            {service.subServices &&
              service.subServices.map((sub, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 px-6 py-4 items-center border-t cursor-pointer ${
                    selectedOption?.name === sub.name ? "bg-amber-50" : "bg-white"
                  }`}
                >
                  <div>
                    <p className="font-medium">{sub.name}</p>
                    {sub.discountPercent && (
                      <p className="text-xs text-green-600">
                        {sub.discountPercent}% OFF
                      </p>
                    )}
                  </div>
                  <span className="font-semibold">AED {sub.price}</span>
                  <div className="text-right">
                 <button
  onClick={() => {
    setBookingData({
      serviceName: sub.name,
      price: sub.price,
    });
    setIsModalOpen(true);
  }}
  className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-md"
>
  Book Now
</button>

                  </div>
                </div>
              ))}
          </div>

          {/* SELECTED SUMMARY */}
          {selectedOption && (
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-10">
              <p className="font-medium">Selected: {selectedOption.name}</p>
              <p className="text-sm text-gray-700">
                Price: AED {selectedOption.price}
              </p>
            </div>
          )}

          {/* TABS */}
    
        </div>
      </div>
      {bookingData && (
  <BookingModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    serviceName={bookingData.serviceName}
    price={bookingData.price}
  />
)}

    </div>
  );
};

export default ServiceDetailPage;
