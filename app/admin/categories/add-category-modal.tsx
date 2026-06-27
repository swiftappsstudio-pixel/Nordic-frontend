"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface AddCategoryModalProps {
  onSubmit: (data: { name: string; description: string; link: string; viewHome: boolean; imageFile?: File; existingSliderUrls?: string[]; sliderFiles?: File[] }) => Promise<void>;
  onCancel: () => void;
  editData?: { name: string; description: string; link?: string; viewHome?: boolean; image?: string; slider?: string[] } | null;
}

export default function AddCategoryModal({ onSubmit, onCancel, editData }: AddCategoryModalProps) {
  const [name, setName] = useState(editData?.name ?? "");
  const [description, setDescription] = useState(editData?.description ?? "");
  const [link, setLink] = useState(editData?.link ?? "");
  const [viewHome, setViewHome] = useState(editData?.viewHome ?? false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editData?.image ?? null);
  const [existingSliderUrls, setExistingSliderUrls] = useState<string[]>(editData?.slider ?? []);
  const [newSliderFiles, setNewSliderFiles] = useState<File[]>([]);
  const [newSliderPreviews, setNewSliderPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const newFiles = Array.from(files);
    setNewSliderFiles((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setNewSliderPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeExistingSlider = (index: number) => {
    setExistingSliderUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewSlider = (index: number) => {
    setNewSliderFiles((prev) => prev.filter((_, i) => i !== index));
    setNewSliderPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        link: link.trim(),
        viewHome,
        ...(imageFile && { imageFile }),
        existingSliderUrls,
        ...(newSliderFiles.length > 0 && { sliderFiles: newSliderFiles }),
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
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl my-auto max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 scrollbar-thin scrollbar-thumb-gray-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {editData ? "Edit Category" : "Add Category"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition"
            title="Close"
          >
            ✖
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              disabled={loading}
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Link</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              disabled={loading}
              placeholder="e.g. /services/category/123 or https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Show on Home Page</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="viewHome"
                  checked={viewHome === true}
                  onChange={() => setViewHome(true)}
                  disabled={loading}
                  className="w-4 h-4 text-green-600 accent-green-600"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="viewHome"
                  checked={viewHome === false}
                  onChange={() => setViewHome(false)}
                  disabled={loading}
                  className="w-4 h-4 text-red-600 accent-red-600"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-1">Only categories set to "Yes" will appear on the Home page.</p>
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition resize-none"
              rows={3}
              disabled={loading}
              placeholder="Enter category description (optional)"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">Image</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-orange-400 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full h-32">
                  <Image
                    src={imagePreview}
                    alt="Category preview"
                    fill
                    className="object-cover rounded-md"
                  />
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

          {/* Slider Images Upload */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Slider Images <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-orange-400 transition"
              onClick={() => sliderInputRef.current?.click()}
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              <span className="text-xs text-gray-400">Click to upload slider images</span>
              <span className="text-[10px] text-gray-400">PNG, JPG — you can select multiple</span>
            </div>
            <input
              ref={sliderInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleSliderChange}
              disabled={loading}
            />
            {(existingSliderUrls.length > 0 || newSliderPreviews.length > 0) && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {existingSliderUrls.map((src, i) => (
                  <div key={`existing-${i}`} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group">
                    <Image src={src} alt={`Slider ${i + 1}`} fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => removeExistingSlider(i)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {newSliderPreviews.map((src, i) => (
                  <div key={`new-${i}`} className="relative aspect-square rounded-md overflow-hidden border border-green-300 group">
                    <Image src={src} alt={`New slider ${i + 1}`} fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => removeNewSlider(i)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-gray-400 mt-1">You can upload multiple slider images for banners or carousels.</p>
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
