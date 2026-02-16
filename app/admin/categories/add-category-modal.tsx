"use client";

import React, { useState } from "react";

interface AddCategoryModalProps {
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  onCancel: () => void;
}

export default function AddCategoryModal({ onSubmit, onCancel }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
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
          <h2 className="text-xl font-semibold text-gray-800">Add Category</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              disabled={loading}
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition resize-none"
              rows={3}
              disabled={loading}
              placeholder="Enter category description (optional)"
            />
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
