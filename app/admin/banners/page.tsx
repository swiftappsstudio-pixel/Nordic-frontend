"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";
import AddBannerModal from "./add-banner-modal";
import { useAuth } from "@/app/_common/auth-context";
import { authFetch } from "@/app/_common/auth-fetch";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface Banner {
  _id: string;
  title: string;
  description?: string;
  bookNowButtonText?: string;
  image?: string;
  mobileImage?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const { token } = useAuth();

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/admin/banners`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load banners");
      const data = await res.json();
      setBanners(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBanners(); }, []);

  const saveBanner = async (formData: {
    title: string;
    description: string;
    bookNowButtonText: string;
    sortOrder: number;
    isActive: boolean;
    imageFile?: File;
    mobileImageFile?: File;
  }) => {
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("bookNowButtonText", formData.bookNowButtonText);
    fd.append("sortOrder", formData.sortOrder.toString());
    fd.append("isActive", formData.isActive.toString());
    if (formData.imageFile) fd.append("image", formData.imageFile);
    if (formData.mobileImageFile) fd.append("mobileImage", formData.mobileImageFile);

    const url = editBanner
      ? `${API_BASE_URL}/admin/banners/${editBanner._id}`
      : `${API_BASE_URL}/admin/banners`;

    const res = await authFetch(url, {
      method: editBanner ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error("Failed to save banner");
    await loadBanners();
    setShowModal(false);
    setEditBanner(null);
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const res = await authFetch(`${API_BASE_URL}/admin/banners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      await loadBanners();
    } catch (err) {
      console.error(err);
      alert("Failed to delete banner");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Banner Management</h1>
        <button
          onClick={() => { setEditBanner(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          <Plus size={18} /> Add Banner
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#593e30] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading banners...</p>
          </div>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white border rounded p-6 text-center text-gray-500">No banners found</div>
      ) : (
        <div className="bg-white border rounded overflow-x-auto shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Desktop</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mobile</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Button</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Active</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Sort</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    {banner.image ? (
                      <div className="relative w-20 h-12 rounded overflow-hidden">
                        <Image src={banner.image} alt="desktop" fill sizes="80px" className="object-cover" />
                      </div>
                    ) : <div className="w-20 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">None</div>}
                  </td>
                  <td className="px-4 py-3">
                    {banner.mobileImage ? (
                      <div className="relative w-10 h-14 rounded overflow-hidden">
                        <Image src={banner.mobileImage} alt="mobile" fill sizes="40px" className="object-cover" />
                      </div>
                    ) : <div className="w-10 h-14 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">None</div>}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{banner.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[180px] truncate">{banner.description || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{banner.bookNowButtonText || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${banner.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{banner.sortOrder ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-4">
                      <button className="text-blue-600 hover:text-blue-800" onClick={() => { setEditBanner(banner); setShowModal(true); }}>
                        <Pencil size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800" onClick={() => deleteBanner(banner._id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <AddBannerModal
          onSubmit={saveBanner}
          onCancel={() => { setShowModal(false); setEditBanner(null); }}
          editData={editBanner ? {
            title: editBanner.title,
            description: editBanner.description || "",
            bookNowButtonText: editBanner.bookNowButtonText || "Book Now",
            sortOrder: editBanner.sortOrder || 0,
            isActive: editBanner.isActive ?? true,
            image: editBanner.image,
            mobileImage: editBanner.mobileImage,
          } : null}
        />
      )}
    </div>
  );
}
