"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface AddCategoryModalProps {
  onSubmit: (data: { name: string; description: string; link: string; viewHome: boolean; imageFile?: File }) => Promise<void>;
  onCancel: () => void;
  editData?: { name: string; description: string; link?: string; viewHome?: boolean; image?: string } | null;
}

export default function AddCategoryModal({ onSubmit, onCancel, editData }: AddCategoryModalProps) {
  const [name, setName] = useState(editData?.name ?? "");
  const [description, setDescription] = useState(editData?.description ?? "");
  const [link, setLink] = useState(editData?.link ?? "");
  const [viewHome, setViewHome] = useState(editData?.viewHome ?? false);
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl transform transition-all scale-100">
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
