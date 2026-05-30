"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_common/auth-context";
import { getAdminDashboardStats } from "@/app/_common/api";
import { DashboardStats } from "@/app/_common/interfaces";

/* -------------------- HELPERS -------------------- */

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (dateString?: string) =>
  dateString ? new Date(dateString).toLocaleDateString("en-US") : "—";

/* -------------------- COMPONENT -------------------- */

export default function AdminDashboard() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setError("You must be logged in as an admin to view the dashboard.");
      setLoading(false);
      return;
    }

    getAdminDashboardStats(token)
      .then((data) => setStats(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load stats"),
      )
      .finally(() => setLoading(false));
  }, [token, authLoading]);

  const cardStats = stats
    ? [
        { label: "Total Users", color: "#041F54", value: stats.totalUsers },
        { label: "Total Bookings", color: "#239800", value: stats.totalBookings },
        {
          label: "Pending Payments",
          color: "#9000FF",
          value: stats.pendingPayments,
        },
        {
          label: "Total Revenue",
          color: "#FF5D00",
          value: `AED ${stats.totalRevenue.toLocaleString()}`,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardStats.map((item) => (
          <div key={item.label} className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm font-medium" style={{ color: item.color }}>
              {item.label}
            </p>
            <p className="mt-4 text-2xl font-bold text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="mt-10 bg-white rounded-lg shadow-sm">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
          <button
            onClick={() => router.push("/admin/orders")}
            className="bg-primary text-white px-4 py-2 rounded-full text-sm"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-gray-500 text-sm">
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Service</th>
                <th className="px-6 py-4 text-center">Amount</th>
                <th className="px-6 py-4 text-center">Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats && stats.recentBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-center text-gray-400"
                  >
                    No bookings yet.
                  </td>
                </tr>
              )}
              {stats?.recentBookings.map((b) => (
                <tr key={b._id} className="border-b last:border-none">
                  <td className="px-6 py-4 capitalize">
                    {b.guestInfo?.fullName || "Registered user"}
                  </td>
                  <td className="px-6 py-4">
                    {b.serviceSnapshot?.title || "—"}
                    {b.subServiceSnapshot?.name && (
                      <span className="block text-xs text-gray-400">
                        {b.subServiceSnapshot.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    AED {b.totalAmount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {formatDate(b.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(
                        b.status,
                      )}`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
