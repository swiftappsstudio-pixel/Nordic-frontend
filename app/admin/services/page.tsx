"use client";

import React, { useEffect, useState } from "react";
import { Plus, Eye, Pencil, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/_common/auth-context";
import { authFetch } from "@/app/_common/auth-fetch";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface Service {
  _id: string;
  title: string;
  description?: string;
  actualPrice?: number;
  discountPrice?: number;
  category?: string;
  isFeatured?: boolean;
  images?: string[];
}

interface Category {
  _id: string;
  name: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const router = useRouter();
  const { token } = useAuth();

  const uniqueCategories = categories.filter((cat, i, arr) => arr.findIndex((c) => c.name === cat.name) === i);

  const resolveCategoryName = (raw: string | undefined) => {
    if (!raw) return "N/A";
    const match = categories.find((c) => c.name.toLowerCase() === raw.toLowerCase());
    return match ? match.name : raw;
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/services`;
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (search.trim()) params.set("search", search.trim());
      if (params.toString()) url += `?${params.toString()}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      setServices(data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, { cache: "no-store" });
      const data = await res.json();
      setCategories(data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await authFetch(`${API_BASE_URL}/services/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setServices((prev) => prev.filter((s) => s._id !== deleteTarget._id));
    } catch {
      alert("Failed to delete service");
    } finally {
      setDeleteTarget(null);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/services/${id}/featured`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setServices((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isFeatured: data.data.isFeatured } : s))
      );
    } catch {
      alert("Failed to toggle featured status");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadServices();
  }, [categoryFilter, search]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <h1 className="text-2xl font-bold text-gray-800">Services</h1>
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm placeholder:text-black focus:outline-none focus:ring-2 focus:ring-[#593e30]/20 focus:border-[#593e30] transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#593e30]/20 focus:border-[#593e30] transition-all appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <button
            onClick={() => router.push("/admin/services/add")}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition"
          >
            <Plus size={18} /> Add Service
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#593e30] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading services...</p>
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 font-medium">No services found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-5 py-4 text-left">Image</th>
                <th className="px-5 py-4 text-left">Title</th>
                <th className="px-5 py-4 text-left">Price</th>
                <th className="px-5 py-4 text-left">Discount</th>
                <th className="px-5 py-4 text-left">Category</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.map((s) => (
                <tr
                  key={s._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {s.images?.[0] ? (
                        <Image src={s.images[0]} alt={s.title} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159a2.25 2.25 0 013.182 0l5.159 5.159a2.25 2.25 0 013.182 0l2.909 2.909m-1.5-1.5 1.409m-2.909m-2.909m-1.5 1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022 18.75V5.25A2.25 2.25 0 0019.75 3H4.25A2.25 2.25 0 002 5.25v13.5A2.25 2.25 0 004.25 21z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {s.title}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {s.actualPrice || "-"}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {s.discountPrice || "-"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                      {resolveCategoryName(s.category)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        title="View"
                        onClick={() =>
                          router.push(`/admin/services/${s._id}`)
                        }
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        title="Edit"
                        onClick={() =>
                          router.push(`/admin/services/edit/${s._id}`)
                        }
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => setDeleteTarget(s)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Delete Service</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-800">{deleteTarget.title}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
