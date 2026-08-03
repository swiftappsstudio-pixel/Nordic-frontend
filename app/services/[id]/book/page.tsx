"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getServiceDetail,
  createBooking,
  getMyAddresses,
} from "@/app/_common/api";
import {
  ServiceWithVariants,
  Variant,
  GuestInfo,
  BookingResponse,
  ServiceAddOn,
  Address,
} from "@/app/_common/interfaces";
import { useAuth } from "@/app/_common/auth-context";
import ReviewsSection from "@/app/_components/reviews-section";

type Step = "addons" | "datetime" | "summary";

const ALL_STEPS: { key: Step; label: string; icon: string }[] = [
  { key: "addons", label: "Add-ons", icon: "+" },
  { key: "datetime", label: "Date & Time", icon: "📅" },
  { key: "summary", label: "Summary", icon: "📋" },
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
  const stepRef = useRef<HTMLDivElement>(null);
  const [service, setService] = useState<ServiceWithVariants | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedAddOnNames, setSelectedAddOnNames] = useState<Set<string>>(new Set());

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
    address: "",
  });

  const [touched, setTouched] = useState<{ fullName: boolean; email: boolean; phone: boolean; address: boolean }>({
    fullName: false,
    email: false,
    phone: false,
    address: false,
  });

  // Saved addresses — logged-in users pick from these instead of typing
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  useEffect(() => {
    if (!token) return;
    getMyAddresses(token)
      .then((list) => {
        setSavedAddresses(list);
        const defaultAddress = list.find((a) => a.isDefault) || list[0];
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          setGuestInfo((prev) => ({ ...prev, address: defaultAddress.formattedAddress }));
        }
      })
      .catch(console.error);
  }, [token]);

  const getFieldError = (field: keyof typeof touched) => {
    if (!touched[field]) return null;
    if (field === "fullName" && !guestInfo.fullName.trim()) return "Full name is required";
    if (field === "email") {
      if (!guestInfo.email.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) return "Enter a valid email";
    }
    if (field === "phone") {
      if (!guestInfo.phone.trim()) return "Phone number is required";
      if (!/^\+?\d{7,15}$/.test(guestInfo.phone.replace(/[\s\-]/g, ""))) return "Enter a valid phone number";
    }
    return null;
  };

  // Booking results
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sub-service from URL (e.g., ?sub=0 for first sub-service)
  const [selectedSubService, setSelectedSubService] = useState<{ name: string; price: number } | null>(null);

  // Load service detail (incl. variants) and resolve which variant is selected
  useEffect(() => {
    if (!id) return;
    getServiceDetail(id)
      .then((data) => {
        setService(data);
        const variantId = searchParams.get("variant");
        if (variantId) {
          const found = data.variants?.find((v) => v._id === variantId);
          setSelectedVariant(found || data.variants?.find((v) => v.isDefault) || data.variants?.[0] || null);
        } else {
          setSelectedVariant(null);
        }
        if (!(data.addOns?.length && data.addOns.length > 0)) {
          setStep("datetime");
        }
        // Handle sub-service param (e.g., ?sub=0 for first sub-service)
        const subIdx = searchParams.get("sub");
        if (subIdx !== null && data.subServices) {
          const idx = parseInt(subIdx);
          if (!isNaN(idx) && data.subServices[idx]) {
            setSelectedSubService({ name: data.subServices[idx].name, price: data.subServices[idx].price });
          }
        }
        // Pre-select required add-ons (from embedded service.addOns)
        if (data.addOns) {
          setSelectedAddOnNames(
            new Set(data.addOns.filter((a) => a.isRequired).map((a) => a.name))
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, searchParams]);

  useEffect(() => {
    if (user) {
      setGuestInfo((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    } else {
      setGuestInfo((prev) => ({
        ...prev,
        fullName: "",
        email: "",
        phone: "",
      }));
    }
  }, [user]);

  // Dynamic steps based on addOns - skip addons step when no addOns

  useEffect(() => {
    if (showSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showSuccess]);

  useEffect(() => {
    if (stepRef.current) {
      stepRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

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

  // Toggle add-on selection (required ones can't be un-selected)
  const toggleAddOn = (addOnName: string, isRequired: boolean) => {
    if (isRequired) return;
    setSelectedAddOnNames((prev) => {
      const next = new Set(prev);
      if (next.has(addOnName)) next.delete(addOnName);
      else next.add(addOnName);
      return next;
    });
  };

  // Price calculation
  const addOns = service?.addOns || [];
  const basePrice =
    selectedVariant?.price ??
    service?.discountPrice ??
    service?.actualPrice ??
    0;
  const subServicePrice = selectedSubService?.price ?? 0;
  const selectedAddOns = addOns.filter((a) => selectedAddOnNames.has(a.name));
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = selectedSubService ? subServicePrice + addOnsTotal : basePrice + addOnsTotal;

  const hasAddOns = (addOns.length ?? 0) > 0;
  const activeSteps = hasAddOns ? ALL_STEPS : ALL_STEPS.filter(s => s.key !== "addons");

  // Step navigation
  const currentStepIndex = activeSteps.findIndex((s) => s.key === step);

  const canProceed = () => {
    if (step === "datetime") return !!(selectedDate && selectedTime);
    if (step === "summary") {
      if (user) return true;
      return !!(
        guestInfo.fullName.trim() &&
        guestInfo.email.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email) &&
        guestInfo.phone.trim() &&
        /^\+?\d{7,15}$/.test(guestInfo.phone.replace(/[\s\-]/g, ""))
      );
    }
    return true;
  };

  const goNext = () => {
    const idx = currentStepIndex;
    if (idx < activeSteps.length - 1) {
      setStep(activeSteps[idx + 1].key);
    }
  };

  const goBack = () => {
    const idx = currentStepIndex;
    if (idx > 0) {
      setStep(activeSteps[idx - 1].key);
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
        ...(selectedSubService ? { subServiceName: selectedSubService.name } : {}),
        ...(selectedAddOnNames.size > 0
          ? { addOnNames: Array.from(selectedAddOnNames) }
          : {}),
        ...(selectedAddressId ? { addressId: selectedAddressId } : {}),
        guestInfo,
      };
      const result = await createBooking(payload, token || undefined);
      setBookings([result]);
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
  const booking = bookings[0] ?? null;

   if (showSuccess && booking) {
     return (
       <div className="min-h-screen bg-gray-50 pt-20 sm:pt-28 pb-10 sm:pb-16">
        <div className="max-w-lg mx-auto px-3 sm:px-5">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-4 sm:p-8 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-green-600 text-2xl sm:text-3xl">&#10003;</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#543826] mb-1 sm:mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
              Your booking has been successfully created.
            </p>

            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 text-left space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-0.5 sm:gap-0">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-mono text-[#543826] break-all">{booking._id}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-0.5 sm:gap-0">
                <span className="text-gray-500">Service</span>
                <span className="text-[#543826] break-words">
                  {booking.serviceSnapshot?.title}
                </span>
              </div>
              {booking.variantSnapshot && (
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-0.5 sm:gap-0">
                  <span className="text-gray-500">Package</span>
                  <span className="text-[#543826]">
                    {booking.variantSnapshot.name}
                  </span>
                </div>
              )}
              {booking.subServiceSnapshot && (
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-0.5 sm:gap-0">
                  <span className="text-gray-500">Sub-service</span>
                  <span className="text-[#543826]">
                    {booking.subServiceSnapshot.name} — AED {booking.subServiceSnapshot.price}
                  </span>
                </div>
              )}
              {booking.addOnsSnapshot && booking.addOnsSnapshot.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-0.5 sm:gap-0">
                  <span className="text-gray-500">Add-ons</span>
                  <span className="text-[#543826] break-words">
                    {booking.addOnsSnapshot.map((a) => a.name).join(", ")}
                  </span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-0.5 sm:gap-0">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-orange-600">
                  AED {booking.totalAmount}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-0.5 sm:gap-0">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium capitalize">
                  {booking.status}
                </span>
              </div>
              {(booking.guestInfo?.address || guestInfo.address) && (
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-0.5 sm:gap-0">
                  <span className="text-gray-500">Address</span>
                  <span className="text-[#543826] break-words">
                    {booking.guestInfo?.address || guestInfo.address}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                const displayAddress = booking.guestInfo?.address || guestInfo.address;
                const msg = encodeURIComponent(
                  `New Booking Confirmed!\n\nBooking ID: ${booking._id}\nService: ${booking.serviceSnapshot?.title}\n${booking.variantSnapshot ? `Package: ${booking.variantSnapshot.name}\n` : ""}${booking.addOnsSnapshot?.length ? `Add-ons: ${booking.addOnsSnapshot.map((a) => a.name).join(", ")}\n` : ""}Date: ${booking.preferredDate}\nTime: ${booking.preferredTime}\nAmount: AED ${booking.totalAmount}\nStatus: ${booking.status}\n${booking.guestInfo ? `Guest: ${booking.guestInfo.fullName} | ${booking.guestInfo.phone} | ${booking.guestInfo.email}` : ""}${displayAddress ? `\nAddress: ${displayAddress}` : ""}`
                );
                window.open(`https://wa.me/971581649910?text=${msg}`, "_blank");
              }}
              className="w-full inline-flex items-center justify-center gap-2 sm:gap-3 bg-[#25D366] hover:bg-[#1eb954] text-white font-brand font-semibold py-4 sm:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-lg transition-all duration-300 hover:shadow-lg"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/>
              </svg>
              Send Booking Receipt via WhatsApp
            </button>

            <Link href="/" className="mt-3 inline-flex items-center justify-center gap-2 w-full border border-gray-200 hover:border-[#543826] text-gray-500 hover:text-[#543826] font-medium py-3 rounded-xl text-sm transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>

            <p className="text-xs text-gray-400 mt-3 sm:mt-4 font-brand">
              Share your booking details with us on WhatsApp for quick follow-up
            </p>
          </div>
        </div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
  const firstDay = getFirstDayOfMonth(calendarMonth, calendarYear);
  const prevMonthDays = getDaysInMonth(
    calendarMonth === 0 ? 11 : calendarMonth - 1,
    calendarMonth === 0 ? calendarYear - 1 : calendarYear
  );

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-blue-50 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 lg:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 hover:text-[#543826] transition mb-3 sm:mb-4">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 sm:gap-6 lg:gap-8">
           {/* LEFT: Main Content */}
          {/* Mobile Service Summary Bar */}
          {service && (
            <div className="flex items-center gap-3 lg:hidden rounded-2xl bg-white border border-gray-200 shadow-sm p-3">
              {service.image && (
                <div className="w-10 h-10 bg-orange-100 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{service.title}</p>
                <p className="text-xs text-orange-600 font-bold">AED {totalPrice.toFixed(2)}</p>
              </div>
              {selectedDate && (
                <div className="text-xs text-gray-500 shrink-0">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {selectedTime && ` • ${(() => { const [h, m] = selectedTime.split(":"); const hr = parseInt(h); return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; })()}`}
                </div>
              )}
            </div>
          )}
           <div className="flex flex-col gap-4 sm:gap-6">
            {/* Header/Stepper Section */}
            <div className="rounded-2xl sm:rounded-3xl bg-white/95 border border-gray-200 shadow-sm p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Streamlined booking in three clear steps</p>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1f2937]">
                    Book your service with confidence
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                    Step {currentStepIndex + 1} of {activeSteps.length}
                  </p>
                  <p className="text-base font-semibold text-[#543826]">
                    {activeSteps[currentStepIndex]?.label}
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <div className="flex items-center gap-0 sm:gap-0">
                  {activeSteps.map((s, i) => {
                    const isCompleted = i < currentStepIndex;
                    const isActive = i === currentStepIndex;
                    return (
                      <React.Fragment key={s.key}>
                        <button
                          type="button"
                          disabled={i > currentStepIndex}
                          onClick={() => {
                            if (i <= currentStepIndex) setStep(s.key);
                          }}
                          className="group flex flex-col items-center gap-1 sm:gap-2 focus:outline-none disabled:cursor-not-allowed"
                        >
                          <span
                            className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 text-xs sm:text-sm transition-all duration-300 ${
                              isCompleted
                                ? "bg-green-500 border-green-500 text-white shadow-lg"
                                : isActive
                                  ? "bg-[#543826] border-[#543826] text-white shadow-sm scale-110"
                                  : "bg-white border-gray-200 text-gray-400"
                            }`}
                          >
                            {isCompleted ? "✓" : s.icon}
                          </span>
                          <span className={`text-[10px] sm:text-[11px] font-semibold whitespace-nowrap ${isCompleted ? "text-green-700" : isActive ? "text-[#543826]" : "text-gray-400"}`}>
                            {s.label}
                          </span>
                        </button>
                        {i < activeSteps.length - 1 && (
                          <div className={`flex-1 h-[2px] mx-0.5 sm:mx-1 rounded-full transition-all duration-500 ${i < currentStepIndex ? "bg-green-500" : "bg-gray-200"}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            
            </div>

            {/* Main Content Card */}
            <div ref={stepRef} className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-4 sm:p-6 md:p-8 flex flex-col">
              <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  {currentStepIndex > 0 && (
                    <button
                      onClick={goBack}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500"
                    >
                      &#8249;
                    </button>
                  )}
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-400">
                    {activeSteps[currentStepIndex]?.label}
                  </h2>
                </div>
                <button
                  onClick={() => router.push(`/services/${id}`)}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-lg sm:text-xl"
                >
                  &times;
                </button>
              </div>

               {/* ========== STEP CONTENT ========== */}
                  {/* ========== STEP: ADD-ONS ========== */}
                  {step === "addons" && hasAddOns && (
                   <div>
                    {/* Add-ons dropdown */}
                    {addOns.length > 0 && (
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-[#543826] uppercase tracking-wider mb-2">
                          Add-ons
                        </label>
                        <div className="relative">
                          <select
                            value="__placeholder__"
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "__placeholder__") return;
                              const a = addOns.find((ao) => ao.name === val);
                              if (a && !selectedAddOnNames.has(a.name)) {
                                setSelectedAddOnNames((prev) => new Set([...prev, a.name]));
                              }
                              e.target.value = "__placeholder__";
                            }}
                            className="w-full appearance-none border-2 border-[#543826]/20 rounded-xl sm:rounded-3xl px-4 sm:px-5 py-3 sm:py-4 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-[#faf9f6] cursor-pointer transition hover:border-[#543826]/40"
                          >
                            <option value="__placeholder__" disabled>Select an add-on to include…</option>
                            {addOns.map((a, i) => (
                              <option key={i} value={a.name} disabled={selectedAddOnNames.has(a.name)}>
                                {a.name} — AED {a.price.toFixed(2)}{selectedAddOnNames.has(a.name) ? " (selected)" : ""}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-[#543826]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                          </div>
                        </div>
                        {selectedAddOnNames.size > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {addOns.filter((a) => selectedAddOnNames.has(a.name)).map((a, i) => (
                              <button
                                key={i}
                                onClick={() => toggleAddOn(a.name, a.isRequired || false)}
                                className="group inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#543826]/10 border border-[#543826]/30 text-xs sm:text-sm text-[#543826] font-medium hover:bg-orange-100 hover:border-[#543826] transition"
                              >
                                {a.name}
                                <span className="text-orange-600 font-bold">AED {a.price.toFixed(2)}</span>
                                <span className="ml-1 text-gray-400 group-hover:text-red-500 transition">&times;</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedSubService && (
                      <div className="mb-4 rounded-2xl bg-orange-50 p-4 border border-orange-200">
                        <span className="inline-block text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded mb-2">Sub-service</span>
                        <p className="font-semibold text-gray-900">{selectedSubService.name}</p>
                        <p className="text-orange-600 font-bold mt-1">AED {selectedSubService.price.toFixed(2)}</p>
                      </div>
                    )}

                    {/* Select Package dropdown */}
                    {!selectedSubService && ((service.variants && service.variants.length > 0) ||
                      (service.discountPrice ?? service.actualPrice) != null) && (
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-[#543826] uppercase tracking-wider mb-2">
                          Select Package
                        </label>
                        <div className="relative">
                          <select
                            value={selectedVariant?._id || "__base__"}
                            onChange={(e) => {
                              if (e.target.value === "__base__") {
                                setSelectedVariant(null);
                              } else {
                                const v = service.variants?.find(
                                  (v:any) => v._id === e.target.value
                                );
                                if (v) setSelectedVariant(v);
                              }
                            }}
                             className="w-full appearance-none border-2 border-[#543826]/20 rounded-xl sm:rounded-3xl px-4 sm:px-5 py-3 sm:py-4 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-[#faf9f6] cursor-pointer transition hover:border-[#543826]/40"
                           >
                             {(service.discountPrice ?? service.actualPrice) != null && (
                               <option value="__base__">
                                {service?.isProduct === false ? "1 Session — " : ""}
                                  AED{" "}
                                {(
                                  service.discountPrice ??
                                  service.actualPrice ??
                                  0
                                ).toFixed(2)}
                              </option>
                            )}
                            {service.variants?.map((v:any) => (
                              <option key={v._id} value={v._id}>
                                {v.name} — AED {v.price} {service?.isProduct === false ? `(${v.sessions} sessions)` : ""}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-[#543826]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                       </div>
                     </div>
                    )}

                    {/* Empty state when no variants and no add-ons */}
                   {addOns.length === 0 && !service.variants?.length && (service.discountPrice ?? service.actualPrice) == null && !(service.subServices?.length) && (
                     <div className="text-center py-10">
                       <p className="text-gray-500">No options available for this service.</p>
                     </div>
                   )}
                 </div>
               )}

              {/* ========== STEP: DATE & TIME ========== */}
              {step === "datetime" && (
                 <div className="space-y-4 sm:space-y-6">
                  {!hasAddOns && !selectedSubService && ((service.variants && service.variants.length > 0) || (service.discountPrice ?? service.actualPrice) != null) && (
                     <div className="rounded-xl sm:rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                       <label className="block text-xs sm:text-sm font-semibold text-[#543826] uppercase tracking-wider mb-2">
                         Select Package
                       </label>
                       <div className="relative">
                         <select
                           value={selectedVariant?._id || "__base__"}
                           onChange={(e) => {
                             if (e.target.value === "__base__") {
                               setSelectedVariant(null);
                             } else {
                               const v = service.variants?.find(
                                 (v2: any) => v2._id === e.target.value
                               );
                               if (v) setSelectedVariant(v);
                             }
                           }}
                           className="w-full appearance-none border-2 border-[#543826]/20 rounded-xl sm:rounded-3xl px-4 sm:px-5 py-3 sm:py-4 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-[#faf9f6] cursor-pointer transition hover:border-[#543826]/40"
                        >
                          {(service.discountPrice ?? service.actualPrice) != null && (
                            <option value="__base__">
                             {service?.isProduct === false ? "1 Session — " : ""} AED {(service.discountPrice ?? service.actualPrice ?? 0).toFixed(2)}
                            </option>
                          )}
                          {service.variants?.map((v: any) => (
                            <option key={v._id} value={v._id}>
                              {v.name} — AED {v.price} {service?.isProduct === false ? `(${v.sessions} sessions)` : ""}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-[#543826]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#543826]">
                          {hasAddOns ? "Step 2" : "Step 1"}
                        </p>
                        <h3 className="mt-1 sm:mt-3 text-xl sm:text-2xl font-semibold text-gray-900">
                          Pick your date and time
                        </h3>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                          Select a convenient slot for your appointment.
                        </p>
                      </div>
                      <div className="rounded-3xl bg-[#f8f5f0] px-4 py-3 text-sm font-semibold text-[#543826]">
                        Booking window open daily
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          value={calendarMonth}
                          onChange={(e) => setCalendarMonth(parseInt(e.target.value))}
                          className="bg-[#543826] text-white rounded-3xl px-4 py-3 text-sm font-medium appearance-none pr-10"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 20 20'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 14px center",
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
                          className="bg-[#543826] text-white rounded-3xl px-4 py-3 text-sm font-medium appearance-none pr-10"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 20 20'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 14px center",
                            backgroundSize: "16px",
                          }}
                        >
                          {[2025, 2026, 2027].map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={prevMonth}
                          className="w-11 h-11 rounded-3xl border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300"
                        >
                          &#8249;
                        </button>
                        <button
                          onClick={nextMonth}
                          className="w-11 h-11 rounded-3xl border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300"
                        >
                          &#8250;
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-[#f8f5f0] p-3 sm:p-4 shadow-sm">
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm font-semibold text-gray-500">
                      {DAYS.map((d) => (
                        <div key={d} className="py-1.5 sm:py-2">
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mt-1 sm:mt-2">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`prev-${i}`} className="py-2 sm:py-3 text-xs sm:text-sm text-gray-300">
                          {prevMonthDays - firstDay + 1 + i}
                        </div>
                      ))}
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
                            className={`rounded-xl sm:rounded-3xl py-2 sm:py-3 text-xs sm:text-sm transition relative ${
                              isSelected
                                ? "bg-[#543826] text-white font-semibold"
                                : disabled
                                  ? "text-gray-300 bg-white/40 cursor-not-allowed"
                                  : "text-gray-700 bg-white hover:bg-gray-100"
                            }`}
                          >
                            {day}
                            {isToday && !isSelected && (
                              <span className="absolute top-1 right-1 sm:top-2 sm:right-2 h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-[#543826]" />
                            )}
                          </button>
                        );
                      })}
                      {Array.from({
                        length: (7 - ((firstDay + daysInMonth) % 7)) % 7,
                      }).map((_, i) => (
                        <div key={`next-${i}`} className="py-2 sm:py-3 text-xs sm:text-sm text-gray-300">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
                            Choose a time slot
                          </h4>
                          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                            Select the best time for your appointment on the chosen date.
                          </p>
                        </div>
                        <div className="rounded-full bg-[#f8f5f0] px-4 py-2 text-sm font-semibold text-[#543826]">
                          {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                        {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"].map((t) => {
                          const [h, m] = t.split(":");
                          const hour = parseInt(h);
                          const ampm = hour >= 12 ? "PM" : "AM";
                          const h12 = hour % 12 || 12;
                          const label = `${h12}:${m} ${ampm}`;
                          return (
                            <button
                              key={t}
                              onClick={() => setSelectedTime(t)}
                              className={`rounded-xl sm:rounded-3xl border px-2 sm:px-3 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition ${
                                selectedTime === t
                                  ? "border-[#543826] bg-[#543826] text-white"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========== STEP: SUMMARY ========== */}
              {step === "summary" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#543826]">
                          {hasAddOns ? "Step 3" : "Step 2"}
                        </p>
                        <h3 className="mt-1 sm:mt-3 text-xl sm:text-2xl font-semibold text-gray-900">
                          Summary
                        </h3>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                          Review your booking, provide your information, and confirm payment.
                        </p>
                      </div>
                      <span className="rounded-full bg-[#f8f5f0] px-4 py-2 text-sm font-semibold text-[#543826]">
                        Cash on Delivery
                      </span>
                    </div>
                  </div>

                  {/* Booking Review */}
                  <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">Your Booking</h4>
                    {!selectedSubService && (
                      <div className="grid gap-3 sm:gap-4 items-center rounded-2xl sm:rounded-3xl border border-gray-100 bg-[#faf9f6] p-4 sm:p-5">
                        <div>
                          <p className="font-semibold text-gray-900">{service.title}</p>
                          {selectedVariant ? (
                            <p className="text-sm text-gray-500 mt-1">
                              {selectedVariant.name} — {selectedVariant.sessions} sessions
                            </p>
                          ) : !selectedVariant && (service.discountPrice ?? service.actualPrice) != null ? (
                            <p className="text-sm text-gray-500 mt-1">1 Session</p>
                          ) : null}
                          {selectedDate && (
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          )}
                          {selectedTime && (
                            <p className="text-sm text-gray-500 mt-1">
                              {(() => {
                                const [h, m] = selectedTime.split(":");
                                const hour = parseInt(h);
                                const ampm = hour >= 12 ? "PM" : "AM";
                                const h12 = hour % 12 || 12;
                                return `${h12}:${m} ${ampm}`;
                              })()}
                            </p>
                          )}
                        </div>
                        <span className="text-orange-600 font-bold text-xl sm:text-2xl">
                          AED {basePrice.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {selectedSubService && (
                       <div className="flex flex-col gap-3 rounded-2xl sm:rounded-3xl border border-gray-100 bg-[#fbfaf7] p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <span className="inline-block text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded mb-2">Sub-service</span>
                          <p className="font-semibold text-gray-900">{selectedSubService.name}</p>
                          <p className="text-sm text-gray-500 mt-1">{service.title}</p>
                          {selectedDate && (
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          )}
                          {selectedTime && (
                            <p className="text-sm text-gray-500 mt-1">
                              {(() => {
                                const [h, m] = selectedTime.split(":");
                                const hour = parseInt(h);
                                const ampm = hour >= 12 ? "PM" : "AM";
                                const h12 = hour % 12 || 12;
                                return `${h12}:${m} ${ampm}`;
                              })()}
                            </p>
                          )}
                        </div>
                        <span className="text-orange-600 font-bold">AED {selectedSubService.price.toFixed(2)}</span>
                      </div>
                    )}

                    {selectedAddOns.length > 0 && (
                      <div className="space-y-3">
                        {selectedAddOns.map((addon, i) => (
                          <div
                            key={i}
                             className="flex flex-col gap-3 rounded-2xl sm:rounded-3xl border border-gray-100 bg-[#fbfaf7] p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <p className="font-semibold text-gray-900">
                                {addon.name}
                              </p>
                              {addon.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {addon.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-orange-600 font-bold">
                                AED {addon.price.toFixed(2)}
                              </span>
                              <button
                                onClick={() => toggleAddOn(addon.name, addon.isRequired || false)}
                                disabled={addon.isRequired}
                                className="text-red-400 hover:text-red-600 text-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                title={
                                  addon.isRequired
                                    ? "Required — can't remove"
                                    : "Remove"
                                }
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col gap-2 sm:gap-3 rounded-2xl sm:rounded-3xl bg-orange-50 p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-[#543826]">Total payable</p>
                        <p className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-bold text-[#543826]">
                          AED {totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Payment method</p>
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      </div>
                    </div>
                  </div>

                  {/* Your Information */}
                  <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#543826]">
                          Your Information
                        </p>
                        <h4 className="mt-1 sm:mt-3 text-base sm:text-lg font-semibold text-gray-900">
                          Contact details
                        </h4>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                          Provide the details we need to confirm your booking quickly.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={guestInfo.fullName}
                            onChange={(e) =>
                              setGuestInfo({
                                ...guestInfo,
                                fullName: e.target.value,
                              })
                            }
                            onBlur={() => setTouched({ ...touched, fullName: true })}
                            className={`w-full border rounded-xl sm:rounded-3xl px-3 sm:px-4 py-3 sm:py-4 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              getFieldError("fullName") ? "border-red-400 bg-red-50/30" : "border-gray-300"
                            }`}
                            placeholder="Enter your full name"
                          />
                          {getFieldError("fullName") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldError("fullName")}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={guestInfo.email}
                            onChange={(e) =>
                              setGuestInfo({ ...guestInfo, email: e.target.value })
                            }
                            onBlur={() => setTouched({ ...touched, email: true })}
                            className={`w-full border rounded-xl sm:rounded-3xl px-3 sm:px-4 py-3 sm:py-4 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              getFieldError("email") ? "border-red-400 bg-red-50/30" : "border-gray-300"
                            }`}
                            placeholder="Enter your email"
                          />
                          {getFieldError("email") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldError("email")}</p>
                          )}
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            value={guestInfo.phone}
                            onChange={(e) =>
                              setGuestInfo({ ...guestInfo, phone: e.target.value })
                            }
                            onBlur={() => setTouched({ ...touched, phone: true })}
                            className={`w-full border rounded-xl sm:rounded-3xl px-3 sm:px-4 py-3 sm:py-4 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              getFieldError("phone") ? "border-red-400 bg-red-50/30" : "border-gray-300"
                            }`}
                            placeholder="+971 XX XXX XXXX"
                          />
                          {getFieldError("phone") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldError("phone")}</p>
                          )}
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Address (optional)
                          </label>
                          {savedAddresses.length > 0 ? (
                            <select
                              value={selectedAddressId}
                              onChange={(e) => {
                                const addr = savedAddresses.find((a) => a._id === e.target.value);
                                setSelectedAddressId(e.target.value);
                                setGuestInfo({ ...guestInfo, address: addr?.formattedAddress || "" });
                              }}
                              className="w-full border rounded-xl sm:rounded-3xl px-3 sm:px-4 py-3 sm:py-4 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300"
                            >
                              {savedAddresses.map((a) => (
                                <option key={a._id} value={a._id}>
                                  {a.label} — {a.formattedAddress}
                                  {a.isDefault ? " (Default)" : ""}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={guestInfo.address ?? ""}
                              onChange={(e) =>
                                setGuestInfo({ ...guestInfo, address: e.target.value })
                              }
                              onBlur={() => setTouched({ ...touched, address: true })}
                              className={`w-full border rounded-xl sm:rounded-3xl px-3 sm:px-4 py-3 sm:py-4 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                getFieldError("address") ? "border-red-400 bg-red-50/30" : "border-gray-300"
                              }`}
                              placeholder="Enter your address"
                            />
                          )}
                          {getFieldError("address") && (
                            <p className="text-xs text-red-500 mt-1">{getFieldError("address")}</p>
                          )}
                        </div>
                       </div>
                     </div>

                  {bookingError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl sm:rounded-3xl p-4">
                      {bookingError}
                    </div>
                  )}
                </div>
              )}

             {/* ====== BOTTOM: Continue / Confirm ====== */}
             <div className="flex flex-col sm:flex-row sm:justify-end pt-4 sm:pt-6 md:pt-8 border-t border-gray-200 mt-4 sm:mt-6 md:mt-8 gap-3 sm:gap-0">
               {step === "summary" ? (
                 <button
                   disabled={submitting}
                   onClick={handleConfirmBooking}
                   className="w-full sm:w-auto bg-[#543826] hover:bg-[#3e2a1c] disabled:opacity-50 text-white font-semibold px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-3xl transition text-base sm:text-lg"
                 >
                   {submitting ? "Booking..." : "Confirm Booking"}
                 </button>
               ) : (
                 <button
                   disabled={!canProceed()}
                   onClick={goNext}
                   className="w-full sm:w-auto border border-gray-300 text-gray-700 font-semibold px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-3xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-base sm:text-lg"
                 >
                   Continue
                 </button>
               )}
             </div>
            </div>
          </div>
          {/* END LEFT COLUMN */}

          {/* RIGHT COLUMN: Service Card */}
          {service && (
            <div className="block lg:block">
              <div className="lg:sticky lg:top-28 rounded-2xl sm:rounded-3xl border border-gray-200 bg-white shadow-md p-4 sm:p-6 transition-all duration-300 ease-out transform hover:shadow-lg">
                <div className="space-y-3 sm:space-y-4">
                  {/* Service Image */}
                  {service.image && (
                    <div className="w-full h-32 sm:h-40 bg-orange-100 rounded-xl sm:rounded-2xl overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Service Details */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#543826]">
                      Selected Service
                    </p>
                    <h3 className="mt-1 sm:mt-2 text-sm sm:text-lg font-bold text-gray-900 line-clamp-2">
                      {service.title}
                    </h3>
                  </div>

                  {/* Package Info */}
                  {selectedSubService ? (
                    <div className="rounded-xl sm:rounded-2xl bg-orange-50 p-3">
                      <p className="text-xs text-gray-600">Sub-service</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedSubService.name}
                      </p>
                      <p className="text-xs text-orange-600 font-semibold mt-1">
                        AED {selectedSubService.price.toFixed(2)}
                      </p>
                    </div>
                  ) : selectedVariant ? (
                    <div className="rounded-xl sm:rounded-2xl bg-orange-50 p-3">
                      <p className="text-xs text-gray-600">Package</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedVariant.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedVariant.sessions} sessions
                      </p>
                    </div>
                  ) : !selectedVariant && (service.discountPrice ?? service.actualPrice) != null ? (
                    <div className="rounded-xl sm:rounded-2xl bg-orange-50 p-3">
                      <p className="text-xs text-gray-600">Package</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        Single Session
                      </p>
                    </div>
                  ) : null}

                  {/* Selected Add-ons Counter */}
                  {selectedAddOns.length > 0 && (
                    <div className="rounded-xl sm:rounded-2xl bg-blue-50 p-3">
                      <p className="text-xs text-gray-600">Add-ons</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedAddOns.length} selected
                      </p>
                    </div>
                  )}

                  {/* Date & Time Display */}
                  {selectedDate && (
                    <div className="rounded-xl sm:rounded-2xl bg-green-50 p-3">
                      <p className="text-xs text-gray-600">Date & Time</p>
                      <p className="mt-1 font-semibold text-gray-900 text-xs sm:text-sm">
                        {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                        {selectedTime && ` • ${selectedTime}`}
                      </p>
                    </div>
                  )}

                  {/* Price Summary */}
                  <div className="rounded-xl sm:rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 p-3 sm:p-4 border border-orange-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wider">Total Price</p>
                    <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-orange-600">
                      AED {totalPrice.toFixed(2)}
                    </p>
                    <p className="mt-0.5 sm:mt-1 text-xs text-gray-600">
                        {selectedSubService ? `Sub-service: AED ${subServicePrice.toFixed(2)}` : `Base: AED ${basePrice.toFixed(2)}`}
                        {addOnsTotal > 0 && ` + Add-ons: AED ${addOnsTotal.toFixed(2)}`}
                    </p>
                  </div>

                  {/* Step Indicator */}
                  <div className="rounded-xl sm:rounded-2xl bg-gray-50 p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wider">Progress</p>
                    <div className="mt-2 flex gap-1">
                      {activeSteps.map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                            i < currentStepIndex
                              ? "bg-green-500"
                              : i === currentStepIndex
                                ? "bg-[#543826]"
                                : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[#543826]">
                      Step {currentStepIndex + 1} of {activeSteps.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* END RIGHT COLUMN */}
        </div>
        {/* END GRID */}
      </div>
      {/* END MAX-WIDTH CONTAINER */}
    </div>
    <ReviewsSection />
    </>
  );
}
