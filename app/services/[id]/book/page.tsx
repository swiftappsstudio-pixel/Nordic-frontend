"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getServiceDetail, createBooking } from "@/app/_common/api";
import {
  ServiceWithVariants,
  Variant,
  SubService,
  GuestInfo,
  BookingResponse,
} from "@/app/_common/interfaces";
import { useAuth } from "@/app/_common/auth-context";

type Step = "addons" | "datetime" | "cart" | "info" | "payments";

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: "addons", label: "Add-ons", icon: "+" },
  { key: "datetime", label: "Date & Time", icon: "📅" },
  { key: "cart", label: "Cart", icon: "🛒" },
  { key: "info", label: "Your Information", icon: "👤" },
  { key: "payments", label: "Payments", icon: "💳" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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

  const [step, setStep] = useState<Step>("addons");
  const [service, setService] = useState<ServiceWithVariants | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);

  // Add-ons (sub-services)
  const [selectedAddons, setSelectedAddons] = useState<SubService[]>([]);

  // Date & Time
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

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
  const [showSuccess, setShowSuccess] = useState(false);

  // Sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load service
  useEffect(() => {
    if (!id) return;
    getServiceDetail(id)
      .then((data) => {
        setService(data);
        const variantId = searchParams.get("variant");
        const subIndex = searchParams.get("sub");
        const found = data.variants?.find((v) => v._id === variantId);
        setSelectedVariant(
          found ||
            data.variants?.find((v) => v.isDefault) ||
            data.variants?.[0] ||
            null
        );
        // Pre-select sub-service if passed via query
        if (subIndex !== null && data.subServices?.[parseInt(subIndex)]) {
          setSelectedAddons([data.subServices[parseInt(subIndex)]]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, searchParams]);

  // Pre-fill user info
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

  // Calendar helpers
  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(calendarYear, calendarMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDateStr = (day: number) => {
    const m = String(calendarMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${calendarYear}-${m}-${d}`;
  };

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  // Add-on toggle
  const toggleAddon = (sub: SubService) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.name === sub.name);
      if (exists) return prev.filter((a) => a.name !== sub.name);
      return [...prev, sub];
    });
  };

  // Price calculation
  const basePrice =
    selectedVariant?.price ??
    service?.discountPrice ??
    service?.actualPrice ??
    0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = basePrice + addonsTotal;

  // Step navigation
  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  const canProceed = () => {
    if (step === "addons") return true;
    if (step === "datetime") return !!selectedDate;
    if (step === "cart") return true;
    if (step === "info") {
      if (user) return true;
      return !!(guestInfo.fullName && guestInfo.email && guestInfo.phone);
    }
    return true;
  };

  const goNext = () => {
    const idx = currentStepIndex;
    if (step === "info" && user) {
      // Skip info for logged-in users, go to payments
      setStep("payments");
      return;
    }
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1].key);
    }
  };

  const goBack = () => {
    const idx = currentStepIndex;
    if (step === "payments" && user) {
      setStep("cart");
      return;
    }
    if (idx > 0) {
      setStep(STEPS[idx - 1].key);
    }
  };

  // Confirm booking
  const handleConfirmBooking = async () => {
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
      setShowSuccess(true);
    } catch (err: unknown) {
      setBookingError(
        err instanceof Error ? err.message : "Booking failed. Please try again."
      );
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
        <Link href="/" className="text-orange-500 hover:underline mt-2">
          Back to Home
        </Link>
      </div>
    );
  }

  // Success modal
  if (showSuccess && booking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="max-w-lg mx-auto px-5">
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-3xl">&#10003;</span>
            </div>
            <h2 className="text-2xl font-bold text-[#543826] mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-500 mb-6">
              Your booking has been successfully created.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-mono text-[#543826]">{booking._id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service</span>
                <span className="text-[#543826]">
                  {booking.serviceSnapshot?.title}
                </span>
              </div>
              {booking.variantSnapshot && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Package</span>
                  <span className="text-[#543826]">
                    {booking.variantSnapshot.name}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-orange-600">
                  AED {booking.totalAmount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium capitalize">
                  {booking.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full bg-[#543826] hover:bg-[#3e2a1c] text-white font-semibold py-4 rounded-xl text-lg transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subServices = service.subServices || [];
  const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
  const firstDay = getFirstDayOfMonth(calendarMonth, calendarYear);

  // Previous month trailing days
  const prevMonthDays = getDaysInMonth(
    calendarMonth === 0 ? 11 : calendarMonth - 1,
    calendarMonth === 0 ? calendarYear - 1 : calendarYear
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex gap-6">
          {/* ====== LEFT SIDEBAR ====== */}
          <div
            className={`bg-white rounded-2xl shadow-md p-5 shrink-0 flex flex-col justify-between transition-all ${
              sidebarCollapsed ? "w-16" : "w-64"
            }`}
          >
            <div>
              {!sidebarCollapsed && (
                <nav className="space-y-1">
                  {STEPS.map((s, i) => {
                    const isCompleted = i < currentStepIndex;
                    const isActive = s.key === step;
                    return (
                      <button
                        key={s.key}
                        onClick={() => {
                          if (i <= currentStepIndex) setStep(s.key);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition ${
                          isActive
                            ? "bg-gray-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition ${
                            isCompleted
                              ? "bg-green-500 border-green-500 text-white"
                              : isActive
                              ? "border-blue-500 bg-white text-blue-500"
                              : "border-gray-200 bg-white text-gray-400"
                          }`}
                        >
                          {isCompleted ? (
                            <span className="text-sm">&#10003;</span>
                          ) : (
                            <span className="text-xs">{s.icon}</span>
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isActive
                              ? "text-gray-900"
                              : isCompleted
                              ? "text-gray-700"
                              : "text-gray-400"
                          }`}
                        >
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Contact Info & Collapse */}
            <div className="mt-8 border-t pt-4">
              {!sidebarCollapsed && (
                <div className="text-center mb-4">
                  <p className="text-xs text-gray-400 font-medium">
                    Get in Touch
                  </p>
                  <p className="text-sm text-gray-700 font-medium mt-1">
                    +971581649910
                  </p>
                  <p className="text-sm text-gray-500">
                    operation@nordichc.ae
                  </p>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 w-full justify-center"
              >
                {sidebarCollapsed ? "Expand" : "Collapse menu"}
                <span
                  className={`transition-transform ${
                    sidebarCollapsed ? "rotate-180" : ""
                  }`}
                >
                  &#10132;
                </span>
              </button>
            </div>
          </div>

          {/* ====== RIGHT CONTENT ====== */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 min-h-[500px] relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {currentStepIndex > 0 && (
                  <button
                    onClick={goBack}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500"
                  >
                    &#8249;
                  </button>
                )}
                <h2 className="text-xl font-semibold text-gray-400">
                  {STEPS[currentStepIndex]?.label}
                </h2>
              </div>
              <button
                onClick={() => router.push(`/services/${id}`)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl"
              >
                &times;
              </button>
            </div>

            {/* ========== STEP: ADD-ONS ========== */}
            {step === "addons" && (
              <div>
                <p className="text-gray-500 text-sm mb-4">
                  Select additional services to add to your booking.
                </p>

                {/* Variant selection */}
                {service.variants && service.variants.length > 1 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Package
                    </label>
                    <select
                      value={selectedVariant?._id || ""}
                      onChange={(e) => {
                        const v = service.variants?.find(
                          (v) => v._id === e.target.value
                        );
                        if (v) setSelectedVariant(v);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {service.variants.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.name} — AED {v.price} ({v.sessions} sessions)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {subServices.length > 0 ? (
                  <div className="space-y-3">
                    {subServices.map((sub, i) => {
                      const isSelected = selectedAddons.some(
                        (a) => a.name === sub.name
                      );
                      return (
                        <button
                          key={i}
                          onClick={() => toggleAddon(sub)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition ${
                            isSelected
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                                  isSelected
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {isSelected && (
                                  <span className="text-xs">&#10003;</span>
                                )}
                              </div>
                              <span className="font-medium text-gray-800">
                                {sub.name}
                              </span>
                            </div>
                            <span className="text-orange-600 font-bold">
                              AED {sub.price.toFixed(2)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <p>No add-ons available for this service.</p>
                  </div>
                )}
              </div>
            )}

            {/* ========== STEP: DATE & TIME ========== */}
            {step === "datetime" && (
              <div>
                {/* Month/Year Selectors */}
                <div className="flex items-center gap-3 mb-6">
                  <select
                    value={calendarMonth}
                    onChange={(e) => setCalendarMonth(parseInt(e.target.value))}
                    className="bg-[#8a7060] text-white px-4 py-2.5 rounded-lg text-sm font-medium appearance-none cursor-pointer pr-8"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 20 20'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 8px center",
                      backgroundSize: "16px",
                    }}
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <select
                    value={calendarYear}
                    onChange={(e) => setCalendarYear(parseInt(e.target.value))}
                    className="bg-[#8a7060] text-white px-4 py-2.5 rounded-lg text-sm font-medium appearance-none cursor-pointer pr-8"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 20 20'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 8px center",
                      backgroundSize: "16px",
                    }}
                  >
                    {[2025, 2026, 2027].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>

                  <div className="ml-auto flex gap-1">
                    <button
                      onClick={prevMonth}
                      className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-600"
                    >
                      &#8249;
                    </button>
                    <button
                      onClick={nextMonth}
                      className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-600"
                    >
                      &#8250;
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {/* Day headers */}
                  {DAYS.map((d) => (
                    <div
                      key={d}
                      className="py-2 text-sm font-medium text-gray-500"
                    >
                      {d}
                    </div>
                  ))}

                  {/* Previous month trailing days */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div
                      key={`prev-${i}`}
                      className="py-3 text-sm text-gray-300"
                    >
                      {prevMonthDays - firstDay + 1 + i}
                    </div>
                  ))}

                  {/* Current month days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = formatDateStr(day);
                    const disabled = isDateDisabled(day);
                    const isSelected = selectedDate === dateStr;
                    const isToday =
                      dateStr === new Date().toISOString().split("T")[0];

                    return (
                      <button
                        key={day}
                        disabled={disabled}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`py-3 text-sm rounded-lg transition relative ${
                          isSelected
                            ? "bg-[#543826] text-white font-bold"
                            : disabled
                            ? "text-gray-300 bg-red-50 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {day}
                        {isToday && !isSelected && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        )}
                      </button>
                    );
                  })}

                  {/* Next month leading days */}
                  {Array.from({
                    length: (7 - ((firstDay + daysInMonth) % 7)) % 7,
                  }).map((_, i) => (
                    <div
                      key={`next-${i}`}
                      className="py-3 text-sm text-gray-300"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========== STEP: CART ========== */}
            {step === "cart" && (
              <div>
                <p className="text-gray-500 text-sm mb-6">
                  Review your selected services before proceeding.
                </p>

                <div className="space-y-4">
                  {/* Main service / variant */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {service.title}
                      </p>
                      {selectedVariant && (
                        <p className="text-sm text-gray-500">
                          {selectedVariant.name} — {selectedVariant.sessions}{" "}
                          sessions
                        </p>
                      )}
                      {selectedDate && (
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      )}
                    </div>
                    <span className="text-orange-600 font-bold text-lg">
                      AED {basePrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Add-ons */}
                  {selectedAddons.map((addon, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-block text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                          Add-on
                        </span>
                        <p className="font-medium text-gray-800">{addon.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-600 font-bold">
                          AED {addon.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() =>
                            setSelectedAddons((prev) =>
                              prev.filter((a) => a.name !== addon.name)
                            )
                          }
                          className="text-red-400 hover:text-red-600 text-lg"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl mt-4">
                    <span className="font-bold text-[#543826] text-lg">
                      Total
                    </span>
                    <span className="font-bold text-orange-600 text-lg">
                      AED {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ========== STEP: YOUR INFORMATION ========== */}
            {step === "info" && (
              <div>
                <p className="text-gray-500 text-sm mb-6">
                  Please provide your details to complete the booking.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestInfo.fullName}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, fullName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, email: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={guestInfo.phone}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, phone: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={guestInfo.gender || ""}
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            gender: e.target.value as GuestInfo["gender"],
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={guestInfo.dateOfBirth || ""}
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            dateOfBirth: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========== STEP: PAYMENTS ========== */}
            {step === "payments" && (
              <div>
                <p className="text-gray-500 text-sm mb-6">
                  Review your booking and confirm payment.
                </p>

                {/* Order summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500 text-sm">Service</span>
                    <span className="font-medium text-gray-800 text-sm">
                      {service.title}
                    </span>
                  </div>
                  {selectedVariant && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500 text-sm">Package</span>
                      <span className="font-medium text-gray-800 text-sm">
                        {selectedVariant.name}
                      </span>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500 text-sm">Date</span>
                      <span className="font-medium text-gray-800 text-sm">
                        {new Date(
                          selectedDate + "T00:00:00"
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {selectedAddons.length > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500 text-sm">Add-ons</span>
                      <span className="font-medium text-gray-800 text-sm">
                        {selectedAddons.length} item(s) — AED{" "}
                        {addonsTotal.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500 text-sm">Patient</span>
                    <span className="font-medium text-gray-800 text-sm">
                      {user ? user.name : guestInfo.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500 text-sm">Payment Method</span>
                    <span className="font-medium text-gray-800 text-sm">
                      Cash on Delivery
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-orange-50 rounded-xl px-4">
                    <span className="font-bold text-[#543826]">Total</span>
                    <span className="font-bold text-orange-600 text-lg">
                      AED {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {bookingError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
                    {bookingError}
                  </div>
                )}
              </div>
            )}

            {/* ====== BOTTOM: Continue / Confirm ====== */}
            <div className="flex justify-end mt-8">
              {step === "payments" ? (
                <button
                  disabled={submitting}
                  onClick={handleConfirmBooking}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-8 py-3 rounded-xl transition"
                >
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>
              ) : (
                <button
                  disabled={!canProceed()}
                  onClick={goNext}
                  className="border border-gray-300 text-gray-700 font-medium px-8 py-3 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
