"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_common/auth-context";
import { getAdminBookings, adminUpdateBookingStatus } from "@/app/_common/api";
import { BookingResponse } from "@/app/_common/interfaces";
import { Search, Filter, CalendarCheck, CheckCircle, XCircle, Clock, ArrowUpDown, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const statusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const paymentColor = (status: string) => {
  if (status === "paid") return "bg-green-50 text-green-700 border-green-200";
  if (status === "refunded") return "bg-gray-50 text-gray-600 border-gray-200";
  return "bg-orange-50 text-orange-700 border-orange-200";
};

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

type StatusFilter = "all" | "confirmed" | "completed" | "cancelled";

export default function OrdersPage() {
  const { token, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setError("You must be logged in as an admin to view bookings.");
      setLoading(false);
      return;
    }

    getAdminBookings(token)
      .then((data) => setBookings(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load bookings"),
      )
      .finally(() => setLoading(false));
  }, [token, authLoading]);

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = (b.guestInfo?.fullName || "").toLowerCase();
      const phone = (b.guestInfo?.phone || "").toLowerCase();
      const service = (b.serviceSnapshot?.title || "").toLowerCase();
      if (!name.includes(q) && !phone.includes(q) && !service.includes(q)) return false;
    }
    return true;
  });

  const counts = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: "confirmed" | "completed" | "cancelled") => {
    if (!token) return;
    setUpdating(bookingId);
    try {
      const updated = await adminUpdateBookingStatus(token, bookingId, newStatus);
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? updated : b)));
      toast.success(`Booking status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const refreshBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAdminBookings(token);
      setBookings(data);
    } catch {
      toast.error("Failed to refresh bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#593e30] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all customer bookings</p>
        </div>
        <button
          onClick={refreshBookings}
          className="flex items-center gap-2 bg-[#593e30] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#4a3225] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CalendarCheck className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{counts.total}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-blue-600">Confirmed</p>
          </div>
          <p className="text-xl font-bold text-blue-700">{counts.confirmed}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-sm text-green-600">Completed</p>
          </div>
          <p className="text-xl font-bold text-green-700">{counts.completed}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600">Cancelled</p>
          </div>
          <p className="text-xl font-bold text-red-700">{counts.cancelled}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#593e30]/20 focus:border-[#593e30] transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {(["all", "confirmed", "completed", "cancelled"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === s
                  ? "bg-[#593e30] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No bookings found</p>
          <p className="text-gray-400 text-sm mt-1">
            {search || statusFilter !== "all" ? "Try adjusting your search or filters" : "Bookings will appear here when customers make reservations"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Sessions</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {b.guestInfo?.fullName || "Registered user"}
                      </p>
                      {b.guestInfo?.email && (
                        <p className="text-xs text-gray-400 mt-0.5">{b.guestInfo.email}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {b.guestInfo?.phone || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-900">{b.serviceSnapshot?.title || "—"}</p>
                      {b.subServiceSnapshot?.name && (
                        <p className="text-xs text-gray-400 mt-0.5">{b.subServiceSnapshot.name}</p>
                      )}
                      {b.variantSnapshot?.name && (
                        <p className="text-xs text-purple-400 mt-0.5">{b.variantSnapshot.name}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 text-center">
                      {formatDate(b.preferredDate || b.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 text-center">
                      {b.preferredTime || "—"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-sm text-gray-900">{b.totalSessions}</span>
                      <span className="text-xs text-gray-400 ml-1">({b.remainingSessions} left)</span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900 text-center">
                      AED {b.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${paymentColor(b.paymentStatus)}`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${statusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {b.status === "confirmed" && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStatusUpdate(b._id, "completed")}
                            disabled={updating === b._id}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            {updating === b._id ? "..." : "Complete"}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(b._id, "cancelled")}
                            disabled={updating === b._id}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {b.status === "completed" && (
                        <span className="text-xs text-green-600 font-medium">Done</span>
                      )}
                      {b.status === "cancelled" && (
                        <span className="text-xs text-red-600 font-medium">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
            Showing {filtered.length} of {bookings.length} bookings
          </div>
        </div>
      )}
    </div>
  );
}