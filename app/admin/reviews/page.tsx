"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2, Plus, Star, ImageIcon, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import AddReviewModal from "./add-review-modal";
import { useAuth } from "@/app/_common/auth-context";
import { authFetch } from "@/app/_common/auth-fetch";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface Review {
  _id: string;
  description: string;
  value: number;
  reviewBy: string;
  media?: string;
  mediaType?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

function SortableRow({ review, onEdit, onDelete }: { review: Review; onEdit: (r: Review) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: review._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-t transition ${isDragging ? "bg-orange-50 shadow-lg opacity-90 z-50" : "hover:bg-gray-50"}`}
    >
      <td className="px-2 py-4">
        <button
          {...attributes}
          {...listeners}
          className={`p-1 rounded cursor-grab active:cursor-grabbing transition ${isDragging ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
        >
          <GripVertical size={18} />
        </button>
      </td>
      <td className="px-5 py-4">
        {review.media ? (
          review.mediaType === "video" ? (
            <div className="w-44 h-28 rounded-lg overflow-hidden shadow-sm bg-black">
              <video src={review.media} className="w-full h-full object-cover" controls preload="metadata" muted />
            </div>
          ) : (
            <div className="relative w-44 h-28 rounded-lg overflow-hidden shadow-sm bg-gray-100">
              <Image src={review.media} alt="review" fill className="object-cover" unoptimized />
            </div>
          )
        ) : (
          <div className="w-44 h-28 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
            <ImageIcon size={28} />
          </div>
        )}
      </td>
      <td className="px-5 py-4 text-gray-600 max-w-[250px]">
        <p className="line-clamp-3 leading-snug">{review.description}</p>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              fill={star <= review.value ? "currentColor" : "none"}
              className={star <= review.value ? "text-orange-500" : "text-gray-300"}
            />
          ))}
          <span className="ml-1.5 text-xs font-semibold text-gray-500">{review.value}/5</span>
        </div>
      </td>
      <td className="px-5 py-4 font-medium text-gray-800">{review.reviewBy}</td>
      <td className="px-5 py-4 text-gray-600">{review.sortOrder ?? 0}</td>
      <td className="px-5 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          review.isActive
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-red-100 text-red-700 border border-red-200"
        }`}>
          {review.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex justify-center gap-3">
          <button className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition" onClick={() => onEdit(review)}>
            <Pencil size={16} />
          </button>
          <button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition" onClick={() => onDelete(review._id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const { token } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const nextSortOrder = reviews.length > 0
    ? Math.max(...reviews.map((r) => r.sortOrder ?? 0)) + 1
    : 0;

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load reviews");
      const data = await res.json();
      setReviews(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const saveReview = async (formData: {
    description: string;
    value: number;
    reviewBy: string;
    isActive: boolean;
    sortOrder: number;
    mediaFile?: File;
  }) => {
    const fd = new FormData();
    fd.append("description", formData.description);
    fd.append("value", formData.value.toString());
    fd.append("reviewBy", formData.reviewBy);
    fd.append("isActive", formData.isActive.toString());
    fd.append("sortOrder", formData.sortOrder.toString());
    if (formData.mediaFile) fd.append("media", formData.mediaFile);

    const url = editReview
      ? `${API_BASE_URL}/admin/reviews/${editReview._id}`
      : `${API_BASE_URL}/admin/reviews`;

    const res = await authFetch(url, {
      method: editReview ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error("Failed to save review");
    await loadReviews();
    setShowModal(false);
    setEditReview(null);
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await authFetch(`${API_BASE_URL}/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      await loadReviews();
    } catch (err) {
      console.error(err);
      alert("Failed to delete review");
    }
  };

  const handleDragEnd = async (event: { active: { id: string | number }; over: { id: string | number } | null }) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const oldIndex = reviews.findIndex((r) => r._id === activeId);
    const newIndex = reviews.findIndex((r) => r._id === overId);

    const reordered = arrayMove(reviews, oldIndex, newIndex);
    const items = reordered.map((r, i) => ({ id: r._id, sortOrder: i }));
    setReviews(reordered.map((r, i) => ({ ...r, sortOrder: i })));

    try {
      const res = await authFetch(`${API_BASE_URL}/admin/reviews/reorder`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error("Reorder failed");
      toast.success("Order updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order");
    }
    await loadReviews();
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
        <button
          onClick={() => { setEditReview(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition"
        >
          <Plus size={18} /> Add Review
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#593e30] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading reviews...</p>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">No reviews found. Click "Add Review" to create one.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={reviews.map((r) => r._id)} strategy={verticalListSortingStrategy}>
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-2 py-4 w-10"></th>
                    <th className="px-5 py-4 text-left">Media</th>
                    <th className="px-5 py-4 text-left">Description</th>
                    <th className="px-5 py-4 text-left">Rating</th>
                    <th className="px-5 py-4 text-left">Review By</th>
                    <th className="px-5 py-4 text-left">Sort Order</th>
                    <th className="px-5 py-4 text-left">Status</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <SortableRow
                      key={review._id}
                      review={review}
                      onEdit={(r) => { setEditReview(r); setShowModal(true); }}
                      onDelete={deleteReview}
                    />
                  ))}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {showModal && (
        <AddReviewModal
          onSubmit={saveReview}
          onCancel={() => { setShowModal(false); setEditReview(null); }}
          nextSortOrder={nextSortOrder}
          editData={editReview ? {
            description: editReview.description,
            value: editReview.value,
            reviewBy: editReview.reviewBy,
            isActive: editReview.isActive ?? true,
            sortOrder: editReview.sortOrder ?? 0,
            media: editReview.media,
            mediaType: editReview.mediaType,
          } : null}
        />
      )}
    </div>
  );
}
