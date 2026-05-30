"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_common/auth-context";
import { getAdminBookings } from "@/app/_common/api";
import { BookingResponse } from "@/app/_common/interfaces";

const statusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const paymentColor = (status: string) =>
  status === "paid"
    ? "bg-green-100 text-green-700"
    : status === "refunded"
      ? "bg-gray-100 text-gray-700"
      : "bg-orange-100 text-orange-700";

export default function OrdersPage() {
  const { token, isLoading: authLoading } = useAuth();

  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="p-6">
      <h1 className="text-2xl text-black font-bold mb-6">Bookings</h1>

      {loading && <p className="text-gray-500">Loading bookings...</p>}

      {!loading && error && <p className="text-red-500">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p className="text-gray-500">No bookings yet.</p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-black border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Customer</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Service</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Time</th>
                <th className="p-3 border">Sessions</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Payment</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="p-3 border">
                    {b.guestInfo?.fullName || "Registered user"}
                  </td>
                  <td className="p-3 border">{b.guestInfo?.phone || "—"}</td>
                  <td className="p-3 border">
                    {b.serviceSnapshot?.title || "—"}
                    {b.subServiceSnapshot?.name && (
                      <span className="block text-xs text-gray-400">
                        {b.subServiceSnapshot.name}
                      </span>
                    )}
                  </td>
                  <td className="p-3 border">{b.preferredDate || "—"}</td>
                  <td className="p-3 border">{b.preferredTime || "—"}</td>
                  <td className="p-3 border">{b.totalSessions}</td>
                  <td className="p-3 border">AED {b.totalAmount}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs capitalize ${paymentColor(
                        b.paymentStatus,
                      )}`}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs capitalize ${statusColor(
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
      )}
    </div>
  );
}
