"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import AddCategoryModal from "./add-category-modal";

interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  // Fetch categories
  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3100/api/categories", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Add or Update category
  const saveCategory = async (data: { name: string; description: string }) => {
    if (editCategory) {
      // Update
      const res = await fetch(`http://localhost:3100/api/categories/${editCategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update category");
    } else {
      // Add
      const res = await fetch("http://localhost:3100/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create category");
    }

    await loadCategories();
    setShowModal(false);
    setEditCategory(null);
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`http://localhost:3100/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      await loadCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // Open modal for edit
  const handleEdit = (cat: Category) => {
    setEditCategory(cat);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
        <button
          onClick={() => { setEditCategory(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : categories.length === 0 ? (
        <div className="bg-white border rounded p-6 text-center text-gray-500">
          No categories found
        </div>
      ) : (
        <div className="bg-white border rounded overflow-x-auto shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Created At
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {cat.name}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {cat.description || "-"}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {cat.createdAt
                      ? new Date(cat.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-4">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                        onClick={() => handleEdit(cat)}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                        onClick={() => deleteCategory(cat._id)}
                      >
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

      {/* Add / Edit Modal */}
      {showModal && (
        <AddCategoryModal
          onSubmit={saveCategory}
          onCancel={() => { setShowModal(false); setEditCategory(null); }}
        />
      )}
    </div>
  );
}
