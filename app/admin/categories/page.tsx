"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";
import AddCategoryModal from "./add-category-modal";
import { useAuth } from "@/app/_common/auth-context";
import { authFetch } from "@/app/_common/auth-fetch";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface Category {
  _id: string;
  name: string;
  description: string;
  link?: string;
  viewHome?: boolean;
  image?: string;
  createdAt?: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const { token } = useAuth();

  // Fetch categories
  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
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
  const saveCategory = async (data: { name: string; description: string; link: string; viewHome: boolean; imageFile?: File }) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("link", data.link);
    formData.append("viewHome", String(data.viewHome));
    if (data.imageFile) formData.append("image", data.imageFile);

    if (editCategory) {
      const res = await authFetch(`${API_BASE_URL}/categories/${editCategory._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update category");
    } else {
      const res = await authFetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
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
      const res = await authFetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to delete category");
        return;
      }
      await loadCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#593e30] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading categories...</p>
          </div>
        </div>
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
                  Image
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Link
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                  View Home
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
                  <td className="px-4 py-3">
                    {cat.image ? (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {cat.name}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {cat.link || "-"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.viewHome ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {cat.viewHome ? "Yes" : "No"}
                    </span>
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
          editData={editCategory ? { name: editCategory.name, description: editCategory.description, link: editCategory.link, viewHome: editCategory.viewHome, image: editCategory.image } : null}
        />
      )}
    </div>
  );
}
