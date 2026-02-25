"use client";

import React, { useEffect, useState } from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Service {
  _id: string;
  title: string;
  description?: string;
  actualPrice?: number;
  discountPrice?: number;
  category?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3100/api/services", {
        cache: "no-store",
      });
      const data = await res.json();
      setServices(data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`http://localhost:3100/api/services/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete service");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Services</h1>
        <button
          onClick={() => router.push("/admin/services/add")}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="text-gray-500">No services found</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-5 py-4 text-left">Title</th>
                <th className="px-5 py-4 text-left">Description</th>
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
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {s.title}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {s.description || "-"}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {s.actualPrice || "-"}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {s.discountPrice || "-"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                      {s.category || "N/A"}
                    </span>
                    
                  </td>

                  {/* ACTION ICONS */}
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-3">
                      {/* View */}
                      <button
                        title="View"
                        onClick={() =>
                          router.push(`/admin/services/${s._id}`)
                        }
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit */}
                      <button
                        title="Edit"
                        onClick={() =>
                          router.push(`/admin/services/edit/${s._id}`)
                        }
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        title="Delete"
                        onClick={() => handleDelete(s._id)}
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
    </div>
  );
}
