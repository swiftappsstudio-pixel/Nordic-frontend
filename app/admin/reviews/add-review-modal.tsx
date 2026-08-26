"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

interface AddReviewModalProps {
  onSubmit: (data: {
    description: string;
    value: number;
    reviewBy: string;
    isActive: boolean;
    sortOrder: number;
    mediaFile?: File;
  }) => Promise<void>;
  onCancel: () => void;
  nextSortOrder: number;
  editData?: {
    description: string;
    value: number;
    reviewBy: string;
    isActive: boolean;
    sortOrder: number;
    media?: string;
    mediaType?: string;
  } | null;
}

export default function AddReviewModal({ onSubmit, onCancel, nextSortOrder, editData }: AddReviewModalProps) {
  const [description, setDescription] = useState(editData?.description ?? "");
  const [value, setValue] = useState(editData?.value ?? 5);
  const [reviewBy, setReviewBy] = useState(editData?.reviewBy ?? "");
  const [isActive, setIsActive] = useState(editData?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(editData ? (editData.sortOrder?.toString() ?? "0") : nextSortOrder.toString());

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(editData?.media ?? null);
  const [mediaType, setMediaType] = useState<"image" | "video">((editData?.mediaType as "image" | "video") ?? "image");
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setMediaFile(file);
    setMediaPreview(preview);
    const mime = file.type || "";
    setMediaType(mime.startsWith("video/") ? "video" : "image");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) { setError("Description is required"); return; }
    if (!reviewBy.trim()) { setError("Review By is required"); return; }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        description: description.trim(),
        value,
        reviewBy: reviewBy.trim(),
        isActive,
        sortOrder: parseInt(sortOrder) || 0,
        ...(mediaFile && { mediaFile }),
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
          <h2 className="text-xl font-semibold text-gray-800">{editData ? "Edit Review" : "Add Review"}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition">✖</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-black mb-1">Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass + " resize-none"} rows={3} disabled={loading} placeholder="Enter review description" />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Rating *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue(star)}
                  className={`transition-all duration-150 ${star <= value ? "text-orange-500 hover:text-orange-600 scale-110" : "text-gray-300 hover:text-gray-400"}`}
                  disabled={loading}
                >
                  <Star size={28} fill={star <= value ? "currentColor" : "none"} />
                </button>
              ))}
              <span className="ml-3 text-sm font-semibold text-gray-700">{value}/5</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Review By *</label>
            <input value={reviewBy} onChange={(e) => setReviewBy(e.target.value)} className={inputClass} disabled={loading} placeholder="Enter reviewer name" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Sort Order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputClass} disabled={loading} />
              <p className="text-xs text-gray-400 mt-1">Lower number = shows first</p>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={loading} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm font-medium text-black">Active</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Video / Image</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-orange-400 transition"
              onClick={() => mediaInputRef.current?.click()}
            >
              {mediaPreview ? (
                mediaType === "video" ? (
                  <video src={mediaPreview} className="w-full h-32 object-cover rounded-md" controls preload="metadata" />
                ) : (
                  <div className="relative w-full h-32">
                    <Image src={mediaPreview} alt="Media preview" fill sizes="(max-width: 640px) 100vw, 500px" className="object-cover rounded-md" />
                  </div>
                )
              ) : (
                <div className="text-sm text-gray-400 py-4">Click to upload video or image</div>
              )}
              <span className="text-xs text-gray-400">{mediaFile ? mediaFile.name : "PNG, JPG, MP4 up to 100MB"}</span>
            </div>
            <input ref={mediaInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleMediaChange} disabled={loading} />
            {mediaPreview && (
              <button type="button" onClick={() => { setMediaFile(null); setMediaPreview(null); }} className="mt-1 text-xs text-red-500 hover:text-red-700" disabled={loading}>
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
