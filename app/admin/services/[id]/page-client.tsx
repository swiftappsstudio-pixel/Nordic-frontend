"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Star } from "lucide-react";
import { useAuth } from "@/app/_common/auth-context";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface SubService {
  name: string;
  price: number;
  discountPercent?: number;
}

interface Service {
  _id: string;
  title: string;
  description?: string;
  actualPrice?: number;
  discountPrice?: number;
  category?: string;
  keyBenefits?: string[];
  keyIngredients?: string[];
  disclaimer?: string;
  images?: string[];
  subServices?: SubService[];
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  id: string;
}

export default function ServiceDetailPage({ id }: Props) {
  const router = useRouter();
  const { token } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/services/${id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setService(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin/services");
    } catch { alert("Failed to delete service"); }
  };

  const toggleFeatured = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}/featured`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setService((prev) => (prev ? { ...prev, isFeatured: data.data.isFeatured } : prev));
    } catch { alert("Failed to toggle featured status"); }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-[#543826] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!service) {
    return <div className="flex flex-col items-center justify-center min-h-screen"><p className="text-gray-500 text-lg">Service not found.</p><button onClick={() => router.push("/admin/services")} className="text-[#543826] hover:underline mt-2">Back to Services</button></div>;
  }

  const images = service.images || [];
  const subServices = service.subServices || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button onClick={() => router.push("/admin/services")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"><ArrowLeft size={18} /><span className="text-sm font-medium">Back to Services</span></button>
          <div className="flex gap-2">
            <button onClick={toggleFeatured} title={service.isFeatured ? "Remove from featured" : "Mark as featured"} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${service.isFeatured ? "bg-yellow-400 text-white hover:bg-yellow-500" : "bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600"}`}><Star size={16} fill={service.isFeatured ? "currentColor" : "none"} />{service.isFeatured ? "Featured" : "Feature"}</button>
            <button onClick={() => router.push(`/admin/services/edit/${id}`)} className="flex items-center gap-2 px-4 py-2 bg-[#543826] text-white rounded-lg text-sm font-medium hover:bg-[#3e2a1c] transition"><Pencil size={16} /> Edit</button>
            <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"><Trash2 size={16} /> Delete</button>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-6">
              {images.length > 0 ? (
                <div>
                  <div className="rounded-xl overflow-hidden mb-3 bg-gray-100"><img src={images[activeImage]} alt={service.title} className="w-full h-72 object-cover" /></div>
                  {images.length > 1 && <div className="flex gap-2">{images.map((img, i) => <button key={i} onClick={() => setActiveImage(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${activeImage === i ? "border-[#543826]" : "border-gray-200 hover:border-gray-300"}`}><img src={img} alt="" className="w-full h-full object-cover" /></button>)}</div>}
                </div>
              ) : <div className="w-full h-72 bg-gray-100 rounded-xl flex items-center justify-center"><span className="text-gray-400 text-sm">No images</span></div>}
            </div>
            <div className="p-6 flex flex-col justify-between">
              <div>
                {service.category && <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#543826]/10 text-[#543826] mb-3">{service.category}</span>}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h1>
                {service.description && <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>}
                <div className="flex items-baseline gap-3 mb-4">
                  {service.discountPrice ? (<><span className="text-2xl font-bold text-[#543826]">AED {service.discountPrice}</span>{service.actualPrice && service.actualPrice > service.discountPrice && <span className="text-gray-400 line-through text-lg">AED {service.actualPrice}</span>}</>) : service.actualPrice ? <span className="text-2xl font-bold text-[#543826]">AED {service.actualPrice}</span> : <span className="text-gray-400 text-sm">No price set</span>}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">{service.isFeatured && <span className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200"><Star size={12} fill="currentColor" /> Featured</span>}</div>
                <div className="text-xs text-gray-400 space-y-1">{service.createdAt && <p>Created: {new Date(service.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>}{service.updatedAt && <p>Updated: {new Date(service.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>}</div>
              </div>
            </div>
          </div>
          {(service.keyBenefits?.length || service.keyIngredients?.length || service.disclaimer) && <ServiceTabs service={service} />}
          {subServices.length > 0 && (
            <div className="border-t px-6 py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sub Services / Bundles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{subServices.map((sub, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 hover:border-[#543826]/30 transition">
                  <p className="font-medium text-gray-800">{sub.name}</p>
                  <div className="flex items-baseline gap-2 mt-1"><span className="text-[#543826] font-bold">AED {sub.price}</span>{sub.discountPercent && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{sub.discountPercent}% off</span>}</div>
                </div>
              ))}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceTabs({ service }: { service: Service }) {
  const tabs: { key: string; label: string }[] = [];
  if (service.keyBenefits?.length) tabs.push({ key: "benefits", label: "Key Benefits" });
  if (service.keyIngredients?.length) tabs.push({ key: "ingredients", label: "Key Ingredients" });
  if (service.disclaimer) tabs.push({ key: "disclaimer", label: "Disclaimer" });
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "");

  return (
    <div className="border-t px-6 py-6">
      <div className="flex gap-6 border-b mb-4">{tabs.map((tab) => <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`pb-3 text-sm font-medium transition border-b-2 -mb-px ${activeTab === tab.key ? "text-[#543826] border-[#543826]" : "text-gray-400 border-transparent hover:text-gray-600"}`}>{tab.label}</button>)}</div>
      {activeTab === "benefits" && service.keyBenefits && <ul className="space-y-2">{service.keyBenefits.map((b, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><span className="text-green-500 mt-0.5">&#10003;</span>{b}</li>)}</ul>}
      {activeTab === "ingredients" && service.keyIngredients && <ul className="space-y-2">{service.keyIngredients.map((ing, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><span className="text-[#543826] mt-0.5">&#8226;</span>{ing}</li>)}</ul>}
      {activeTab === "disclaimer" && service.disclaimer && <p className="text-sm text-gray-600 leading-relaxed">{service.disclaimer}</p>}
    </div>
  );
}
