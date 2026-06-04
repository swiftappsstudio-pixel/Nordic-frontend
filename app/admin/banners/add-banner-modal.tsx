"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface AddBannerModalProps {
  onSubmit: (data: {
    title: string;
    description: string;
    bookNowLink: string;
    bookNowButtonText: string;
    price: number;
    sortOrder: number;
    isActive: boolean;
    imageFile?: File;
  }) => Promise<void>;
  onCancel: () => void;
  editData?: {
    title: string;
    description: string;
    bookNowLink: string;
    bookNowButtonText: string;
    price: number;
    sortOrder: number;
    isActive: boolean;
    image?: string;
  } | null;
}

export default function AddBannerModal({ onSubmit, onCancel, editData }: AddBannerModalProps) {
  const [title, setTitle] = useState(editData?.title ?? "");
  const [description, setDescription] = useState(editData?.description ?? "");
  const [bookNowLink, setBookNowLink] = useState(editData?.bookNowLink ?? "");
  const [bookNowButtonText, setBookNowButtonText] = useState(editData?.bookNowButtonText ?? "Book Now");
  const [price, setPrice] = useState(editData?.price?.toString() ?? "");
  const [sortOrder, setSortOrder] = useState(editData?.sortOrder?.toString() ?? "0");
  const [isActive, setIsActive] = useState(editData?.isActive ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editData?.image ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        bookNowLink: bookNowLink.trim(),
        bookNowButtonText: bookNowButtonText.trim(),
        price: parseFloat(price) || 0,
        sortOrder: parseInt(sortOrder) || 0,
        isActive,
        ...(imageFile && { imageFile }),
      });
      onCancel();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 py-8 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl my-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {editData ? "Edit Banner" : "Add Banner"}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition">✖</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              disabled={loading}
              placeholder="Enter banner title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition resize-none"
              rows={3}
              disabled={loading}
              placeholder="Enter banner description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Book Now Link</label>
            <input
              value={bookNowLink}
              onChange={(e) => setBookNowLink(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              disabled={loading}
              placeholder="e.g. /services/123 or https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Book Now Button Text</label>
            <input
              value={bookNowButtonText}
              onChange={(e) => setBookNowButtonText(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              disabled={loading}
              placeholder="Book Now"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Price (AED)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              disabled={loading}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              disabled={loading}
              placeholder="0"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={loading}
            />
            <label className="text-sm font-medium text-black">Active</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Image</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-orange-400 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full h-32">
                  <Image src={imagePreview} alt="Banner preview" fill className="object-cover rounded-md" unoptimized />
                </div>
              ) : (
                <div className="text-sm text-gray-400 py-4">Click to upload an image</div>
              )}
              <span className="text-xs text-gray-400">
                {imageFile ? imageFile.name : "PNG, JPG up to 4MB"}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={loading}
            />
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="mt-1 text-xs text-red-500 hover:text-red-700"
                disabled={loading}
              >
                Remove image
              </button>
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}