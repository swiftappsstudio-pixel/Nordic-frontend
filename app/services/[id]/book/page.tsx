"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getServiceDetail, createBooking } from "@/app/_common/api";
import {
  ServiceWithVariants,
  Variant,
  GuestInfo,
  BookingResponse,
} from "@/app/_common/interfaces";
import { useAuth } from "@/app/_common/auth-context";

type Step = "datetime" | "info" | "confirm" | "success";

// Time slots for the picker
const TIME_OPTIONS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00",
];

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const [step, setStep] = useState<Step>("datetime");
  const [service, setService] = useState<ServiceWithVariants | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);

  // Date & Time selection
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Patient info
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    fullName: "",
    email: "",
    phone: "",
    gender: undefined,
    dateOfBirth: "",
  });

  // Booking result
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load service detail
  useEffect(() => {
    if (!id) return;
    getServiceDetail(id)
      .then((data) => {
        setService(data);
        const variantId = searchParams.get("variant");
        const found = data.variants?.find((v) => v._id === variantId);
        setSelectedVariant(found || data.variants?.find((v) => v.isDefault) || data.variants?.[0] || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, searchParams]);

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  // Pre-fill from user profile
  useEffect(() => {
    if (user) {
      setGuestInfo({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: undefined,
        dateOfBirth: "",
      });
    }
  }, [user]);

  // Generate next 14 dates
  const dates: string[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  const formatTime = (t: string) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    setBookingError("");

    try {
      const payload = {
        serviceId: id,
        preferredDate: selectedDate,
        preferredTime: selectedTime,
        ...(selectedVariant ? { variantId: selectedVariant._id } : {}),
        ...(user ? {} : { guestInfo }),
      };
      const result = await createBooking(payload, token || undefined);
      setBooking(result);
      setStep("success");
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <p className="text-gray-500 text-lg">Service not found.</p>
        <Link href="/" className="text-orange-500 hover:underline mt-2">Back to Home</Link>
      </div>
    );
  }

  const totalPrice = selectedVariant?.price ?? service.discountPrice ?? service.actualPrice ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#543826]">Home</Link>
          <span>/</span>
          <Link href={`/services/${id}`} className="hover:text-[#543826]">{service.title}</Link>
          <span>/</span>
          <span className="text-[#543826] font-medium">Book</span>
        </nav>

        {/* Progress Steps */}
        <div className="flex items-center gap-0 mb-8">
          {(["datetime", "info", "confirm"] as Step[]).map((s, i) => {
            const labels = ["Date & Time", "Your Info", "Confirm"];
            const stepIndex = ["datetime", "info", "confirm"].indexOf(step);
            const isActive = i <= stepIndex;
            return (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  isActive ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  {i + 1}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:inline ${
                  isActive ? "text-[#543826]" : "text-gray-400"
                }`}>
                  {labels[i]}
                </span>
                {i < 2 && <div className={`flex-1 h-0.5 mx-3 ${isActive && i < stepIndex ? "bg-orange-500" : "bg-gray-200"}`} />}
              </div>
            );
          })}
        </div>

        {/* ======================= STEP 1: Select Date & Time ======================= */}
        {step === "datetime" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#543826] mb-1">Select Date & Time</h2>
            <p className="text-gray-500 text-sm mb-6">
              {service.title}
              {selectedVariant && ` — ${selectedVariant.name} (AED ${selectedVariant.price})`}
            </p>

            {/* Variant change */}
            {service.variants && service.variants.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Package</label>
                <select
                  value={selectedVariant?._id || ""}
                  onChange={(e) => {
                    const v = service.variants?.find((v) => v._id === e.target.value);
                    if (v) setSelectedVariant(v);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {service.variants.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name} — AED {v.price} ({v.sessions} sessions)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Picker */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Date</label>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
              {dates.map((d) => {
                const dateObj = new Date(d + "T00:00:00");
                const day = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                const num = dateObj.getDate();
                const month = dateObj.toLocaleDateString("en-US", { month: "short" });
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`flex flex-col items-center px-4 py-3 rounded-xl border-2 shrink-0 transition ${
                      selectedDate === d
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xs font-medium">{day}</span>
                    <span className="text-lg font-bold">{num}</span>
                    <span className="text-xs">{month}</span>
                  </button>
                );
              })}
            </div>

            {/* Time Picker */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Time</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition ${
                    selectedTime === t
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {formatTime(t)}
                </button>
              ))}
            </div>

            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(user ? "confirm" : "info")}
              className="w-full mt-8 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl text-lg transition"
            >
              {user ? "Review & Confirm" : "Next: Your Info"}
            </button>
          </div>
        )}

        {/* ======================= STEP 2: Patient Info ======================= */}
        {step === "info" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#543826] mb-1">Your Information</h2>
            <p className="text-gray-500 text-sm mb-6">Please provide your details to complete the booking.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={guestInfo.fullName}
                  onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+971 XX XXX XXXX"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={guestInfo.gender || ""}
                    onChange={(e) => setGuestInfo({ ...guestInfo, gender: e.target.value as GuestInfo["gender"] })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={guestInfo.dateOfBirth || ""}
                    onChange={(e) => setGuestInfo({ ...guestInfo, dateOfBirth: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep("datetime")}
                className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-4 rounded-xl text-lg hover:border-gray-400 transition"
              >
                Back
              </button>
              <button
                disabled={!guestInfo.fullName || !guestInfo.email || !guestInfo.phone}
                onClick={() => setStep("confirm")}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl text-lg transition"
              >
                Review Booking
              </button>
            </div>
          </div>
        )}

        {/* ======================= STEP 3: Confirm ======================= */}
        {step === "confirm" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#543826] mb-6">Review & Confirm</h2>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-500">Service</span>
                <span className="font-medium text-[#543826]">{service.title}</span>
              </div>

              {selectedVariant && (
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Package</span>
                  <span className="font-medium text-[#543826]">{selectedVariant.name}</span>
                </div>
              )}

              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-[#543826]">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-500">Time</span>
                <span className="font-medium text-[#543826]">{formatTime(selectedTime)}</span>
              </div>

              {selectedVariant && (
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Sessions</span>
                  <span className="font-medium text-[#543826]">
                    {selectedVariant.sessions}
                    {selectedVariant.freeSessions > 0 && ` + ${selectedVariant.freeSessions} free`}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-500">Patient</span>
                <span className="font-medium text-[#543826]">
                  {user ? user.name : guestInfo.fullName}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-500">Payment</span>
                <span className="font-medium text-[#543826]">Cash on Delivery</span>
              </div>

              <div className="flex justify-between py-4 bg-orange-50 rounded-xl px-4">
                <span className="font-bold text-[#543826] text-lg">Total</span>
                <span className="font-bold text-orange-600 text-lg">AED {totalPrice}</span>
              </div>
            </div>

            {bookingError && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
                {bookingError}
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(user ? "datetime" : "info")}
                className="flex-1 border-2 border-gray-300 text-gray-600 font-semibold py-4 rounded-xl text-lg hover:border-gray-400 transition"
              >
                Back
              </button>
              <button
                disabled={submitting}
                onClick={handleConfirmBooking}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-4 rounded-xl text-lg transition"
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}

        {/* ======================= STEP 4: Success ======================= */}
        {step === "success" && booking && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-3xl">&#10003;</span>
            </div>
            <h2 className="text-2xl font-bold text-[#543826] mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-6">
              Your booking has been successfully created. You will receive a confirmation shortly.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-mono text-[#543826]">{booking._id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service</span>
                <span className="text-[#543826]">{booking.serviceSnapshot?.title}</span>
              </div>
              {booking.variantSnapshot && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Package</span>
                  <span className="text-[#543826]">{booking.variantSnapshot.name}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date & Time</span>
                <span className="text-[#543826]">
                  {booking.preferredDate} at {booking.preferredTime && formatTime(booking.preferredTime)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-orange-600">AED {booking.totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium capitalize">{booking.status}</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold py-4 rounded-xl text-lg transition"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
