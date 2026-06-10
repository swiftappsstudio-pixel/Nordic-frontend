"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface AddBannerModalProps {
  onSubmit: (data: {
    title: string;
    description: string;
    bookNowButtonText: string;
    sortOrder: number;
    isActive: boolean;
    imageFile?: File;
    mobileImageFile?: File;
  }) => Promise<void>;
  onCancel: () => void;
  editData?: {
    title: string;
    description: string;
    bookNowButtonText: string;
    sortOrder: number;
    isActive: boolean;
    image?: string;
    mobileImage?: string;
  } | null;
}

export default function AddBannerModal({ onSubmit, onCancel, editData }: AddBannerModalProps) {
  const [title, setTitle] = useState(editData?.title ?? "");
  const [description, setDescription] = useState(editData?.description ?? "");
  const [bookNowButtonText, setBookNowButtonText] = useState(editData?.bookNowButtonText ?? "Book Now");
  const [sortOrder, setSortOrder] = useState(editData?.sortOrder?.toString() ?? "0");
  const [isActive, setIsActive] = useState(editData?.isActive ?? true);

  // Desktop image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editData?.image ?? null);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  // Mobile image
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);
  const [mobileImagePreview, setMobileImagePreview] = useState<string | null>(editData?.mobileImage ?? null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "desktop" | "mobile") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (type === "desktop") { setImageFile(file); setImagePreview(preview); }
    else { setMobileImageFile(file); setMobileImagePreview(preview); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        bookNowButtonText: bookNowButtonText.trim(),
        sortOrder: parseInt(sortOrder) || 0,
        isActive,
        ...(imageFile && { imageFile }),
        ...(mobileImageFile && { mobileImageFile }),
      });
      onCancel();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-md text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 py-8 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl my-auto max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 scrollbar-thin scrollbar-thumb-gray-300">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-xl font-semibold text-gray-800">{editData ? "Edit Banner" : "Add Banner"}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition">✖</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-black mb-1">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} disabled={loading} placeholder="Enter banner title" />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass + " resize-none"} rows={3} disabled={loading} placeholder="Enter banner description" />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Button Text</label>
            <input value={bookNowButtonText} onChange={(e) => setBookNowButtonText(e.target.value)} className={inputClass} disabled={loading} placeholder="Book Now" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Sort Order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputClass} disabled={loading} placeholder="0" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={loading} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm font-medium text-black">Active</span>
              </label>
            </div>
          </div>

          {/* Desktop Image */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              🖥️ Desktop Image
              <span className="text-gray-400 font-normal ml-1">(recommended: 1440×600px)</span>
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-orange-400 transition"
              onClick={() => desktopInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full h-32">
                  <Image src={imagePreview} alt="Desktop preview" fill className="object-cover rounded-md" unoptimized />
                </div>
              ) : (
                <div className="text-sm text-gray-400 py-4">Click to upload desktop banner</div>
              )}
              <span className="text-xs text-gray-400">{imageFile ? imageFile.name : "PNG, JPG up to 4MB"}</span>
            </div>
            <input ref={desktopInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "desktop")} disabled={loading} />
            {imagePreview && (
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="mt-1 text-xs text-red-500 hover:text-red-700" disabled={loading}>
                Remove
              </button>
            )}
          </div>

          {/* Mobile Image */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              📱 Mobile Image
              <span className="text-gray-400 font-normal ml-1">(recommended: 640×900px)</span>
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-orange-400 transition"
              onClick={() => mobileInputRef.current?.click()}
            >
              {mobileImagePreview ? (
                <div className="relative w-full h-32">
                  <Image src={mobileImagePreview} alt="Mobile preview" fill className="object-cover rounded-md" unoptimized />
                </div>
              ) : (
                <div className="text-sm text-gray-400 py-4">Click to upload mobile banner</div>
              )}
              <span className="text-xs text-gray-400">{mobileImageFile ? mobileImageFile.name : "PNG, JPG up to 4MB"}</span>
            </div>
            <input ref={mobileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "mobile")} disabled={loading} />
            {mobileImagePreview && (
              <button type="button" onClick={() => { setMobileImageFile(null); setMobileImagePreview(null); }} className="mt-1 text-xs text-red-500 hover:text-red-700" disabled={loading}>
                Remove
              </button>
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition" disabled={loading}>Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
