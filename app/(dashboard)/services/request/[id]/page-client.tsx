"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Service, SubService } from "@/app/_common/interfaces";
import { getService } from "@/app/_common/api";
import Spacer from "@/app/_components/spacer";
import BookingModal from "@/app/_components/booking-model";
import { CTASection } from "@/app/_components/cta-section";

const TABS = {
  BENEFITS: "benefits",
  INGREDIENTS: "ingredients",
  DISCLAIMER: "disclaimer",
};

interface Props {
  id: string;
}

const ServiceDetailPage: React.FC<Props> = ({ id }) => {
  const [service, setService] = useState<Service | null>(null);
  const [selectedOption, setSelectedOption] = useState<{ name: string; price: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<{ serviceName: string; price: number } | null>(null);
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
        setSelectedOption({ name: data.title, price: data.discountPrice || data.actualPrice || 0 });
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
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Spacer />
        <div className="flex flex-col lg:flex-row gap-10">
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
            <div className="flex gap-3 mt-4 flex-wrap">
              {service.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`border rounded-xl overflow-hidden ${activeImage === img ? "border-amber-700" : "border-gray-200"}`}
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
          <div className="lg:w-[60%] w-full">
            <h1 className="text-4xl font-bold text-[#593E30] mb-4">{service.title}</h1>
            <p className="text-black mb-6">{service.description}</p>
            <div className="flex gap-8 border-b mb-6">
              {Object.values(TABS).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 font-medium text-[#593E30] capitalize ${activeTab === tab ? "border-b-2 border-black" : "text-black"}`}>
                  {tab.replace("_", " ")}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow p-6 mb-10">
              {activeTab === TABS.BENEFITS && (<ul className="list-disc pl-5 space-y-2 text-gray-700">{service.keyBenefits?.map((item, i) => <li key={i}>{item}</li>)}</ul>)}
              {activeTab === TABS.INGREDIENTS && (<ul className="list-disc pl-5 space-y-2 text-gray-700">{service.keyIngredients?.map((item, i) => <li key={i}>{item}</li>)}</ul>)}
              {activeTab === TABS.DISCLAIMER && <p className="text-gray-700">{service.disclaimer}</p>}
            </div>
            <div className="border rounded-xl overflow-hidden shadow bg-white mb-10">
              <div className="grid grid-cols-3 bg-gray-200 text-[#593E30] px-6 py-3 text-sm font-semibold">
                <span>Service</span><span>Price</span><span className="text-right">Action</span>
              </div>
              <div className={`grid grid-cols-3 px-6 py-4 items-center text-black border-t cursor-pointer ${selectedOption?.name === service.title ? "bg-amber-50" : "bg-white"}`}>
                <span className="font-medium text-black">{service.title}</span>
                <span className="font-semibold text-black">AED {service.discountPrice || service.actualPrice}</span>
                <div className="text-right">
                  <button onClick={() => { setBookingData({ serviceName: service.title, price: service.discountPrice || service.actualPrice || 0 }); setIsModalOpen(true); }} className="bg-[#593E30] hover:bg-[#593E30] text-white px-6 py-2 rounded-md">Book Now</button>
                </div>
              </div>
              {service.subServices && service.subServices.map((sub, index) => (
                <div key={index} className={`grid grid-cols-3 px-6 py-4 items-center border-t cursor-pointer ${selectedOption?.name === sub.name ? "bg-amber-50" : "bg-white"}`}>
                  <div><p className="font-medium text-black">{sub.name}</p>{sub.discountPercent && <p className="text-xs text-black">{sub.discountPercent}% OFF</p>}</div>
                  <span className="font-semibold text-black">AED {sub.price}</span>
                  <div className="text-right">
                    <button onClick={() => { setBookingData({ serviceName: sub.name, price: sub.price }); setIsModalOpen(true); }} className="bg-[#593E30] hover:bg-[#593E30] text-white px-6 py-2 rounded-md">Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {bookingData && (
          <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} serviceName={bookingData.serviceName} price={bookingData.price} />
        )}
      </div>
      <CTASection
        title="Ready to get started?"
        phoneNumber="+923414415384"
        message="Hello! I'm interested in booking a service. Can you provide more details?"
        imageUrl="images/hero banner 4.png"
        buttonText="Book Now"
      />
    </>
  );
};

export default ServiceDetailPage;
