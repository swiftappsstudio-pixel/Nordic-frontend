"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_common/auth-context";
import { getMyBookings, lookupGuestBookings } from "@/app/_common/api";
import { BookingResponse } from "@/app/_common/interfaces";
import Link from "next/link";
import { Clock, Calendar, ChevronRight, LogIn, Search } from "lucide-react";

const formatTime12 = (t: string) => {
  if (!t || !t.includes(":")) return t || "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

const statusColors: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700 border-blue-300",
  completed: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
};

export default function OrdersPage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestPhone, setGuestPhone] = useState("");
  const [guestLoading, setGuestLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setLoading(false);
      return;
    }
    getMyBookings(token)
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, authLoading]);

  const handleGuestLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestPhone.trim()) return;
    setGuestLoading(true);
    setError(null);
    try {
      const data = await lookupGuestBookings(guestPhone);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to lookup bookings");
    } finally {
      setGuestLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
        <p className="text-gray-500 mb-8">Track your bookings and service history</p>

        {!token ? (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Please log in to view your orders</h2>
              <p className="text-gray-500 mb-6">Sign in to see your booking history and upcoming appointments</p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 bg-[#543826] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#3e2a1c] transition"
              >
                Sign In
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Search size={18} /> Quick Lookup (Guest Users)
              </h3>
              <form onSubmit={handleGuestLookup} className="flex gap-3">
                <input
                  type="tel"
                  placeholder="+971 XX XXX XXXX"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  disabled={guestLoading}
                  className="px-5 py-2 bg-[#543826] text-white rounded-lg text-sm font-medium hover:bg-[#3e2a1c] disabled:opacity-50"
                >
                  {guestLoading ? "Searching..." : "Find"}
                </button>
              </form>
            </div>
          </div>
        ) : loading ? (
          <p className="text-gray-500">Loading your orders...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-8 text-center">
            <p className="text-gray-500">No orders found. Book a service to get started!</p>
            <Link
              href="/"
              className="inline-block mt-4 text-orange-600 hover:underline"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white rounded-2xl shadow-md p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[b.status]?.replace("border-", "") || "bg-gray-100 text-gray-700"}`}>
                    {b.status}
                  </span>
                  <span className="font-bold text-orange-600">AED {b.totalAmount}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} />
                    <span>{b.preferredDate || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={14} />
                    <span>{formatTime12(b.preferredTime || "")}</span>
                  </div>
                  <p className="font-medium text-gray-800">{b.serviceSnapshot?.title || "Service"}</p>
                  {b.variantSnapshot && (
                    <p className="text-gray-500">Package: {b.variantSnapshot.name}</p>
                  )}
                  <p className="text-gray-500">Sessions: {b.totalSessions} (remaining: {b.remainingSessions})</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}