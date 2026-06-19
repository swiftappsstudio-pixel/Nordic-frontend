"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getServiceDetail, createBooking, getCategories, getServicesByCategory, getServices } from "@/app/_common/api";
import {
  ServiceWithVariants,
  Variant,
  GuestInfo,
  BookingResponse,
  CartItem,
  Category,
  Service,
} from "@/app/_common/interfaces";
import { useAuth } from "@/app/_common/auth-context";

type Step = "addons" | "datetime" | "summary";

interface Props {
  id: string;
}

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

function BookingContent({ id }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const [step, setStep] = useState<Step>("addons");
  const stepRef = useRef<HTMLDivElement>(null);
  const [service, setService] = useState<ServiceWithVariants | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("__all__");
  const [catalogServices, setCatalogServices] = useState<Service[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({ fullName: "", email: "", phone: "" });
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
        if (!data.addOns?.length) {
          setStep("datetime");
        }
        const subIndex = searchParams.get("sub");
        if (subIndex !== null && data.subServices?.[parseInt(subIndex)]) {
          const sub = data.subServices[parseInt(subIndex)];
          setCartItems([{ serviceId: id as string, title: sub.name, price: sub.price }]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, searchParams]);

  useEffect(() => { getCategories().then(setCategories).catch(console.error); }, []);

  useEffect(() => {
    setCatalogLoading(true);
    const fetch = activeCategoryId === "__all__" ? getServices() : getServicesByCategory(activeCategoryId);
    fetch.then(setCatalogServices).catch(console.error).finally(() => setCatalogLoading(false));
  }, [activeCategoryId]);

  useEffect(() => {
    if (user) {
      setGuestInfo({ fullName: user.name || "", email: user.email || "", phone: user.phone || "" });
    }
  }, [user]);

  useEffect(() => {
    if (stepRef.current) {
      stepRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => { const day = new Date(year, month, 1).getDay(); return day === 0 ? 6 : day - 1; };
  const isDateDisabled = (day: number) => { const date = new Date(calendarYear, calendarMonth, day); const today = new Date(); today.setHours(0, 0, 0, 0); return date < today; };
  const formatDateStr = (day: number) => { const m = String(calendarMonth + 1).padStart(2, "0"); return `${calendarYear}-${m}-${String(day).padStart(2, "0")}`; };
  const prevMonth = () => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); } else { setCalendarMonth(calendarMonth - 1); } };
  const nextMonth = () => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); } else { setCalendarMonth(calendarMonth + 1); } };

  const toggleCartItem = (item: CartItem) => {
    setCartItems((prev) => { const exists = prev.find((a) => a.serviceId === item.serviceId && a.title === item.title); if (exists) return prev.filter((a) => !(a.serviceId === item.serviceId && a.title === item.title)); return [...prev, item]; });
  };

  const basePrice = selectedVariant?.price ?? service?.discountPrice ?? service?.actualPrice ?? 0;
  const addonsTotal = cartItems.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = basePrice + addonsTotal;
  const hasAddOns = (service?.addOns?.length ?? 0) > 0;
  const activeSteps = hasAddOns ? ALL_STEPS : ALL_STEPS.filter(s => s.key !== "addons");
  const currentStepIndex = activeSteps.findIndex((s) => s.key === step);

  const canProceed = () => {
    if (step === "datetime") return !!(selectedDate && selectedTime);
    if (step === "summary") { if (user) return true; return !!(guestInfo.fullName && guestInfo.email && guestInfo.phone); }
    return true;
  };

  const goNext = () => { const idx = currentStepIndex; if (idx < activeSteps.length - 1) setStep(activeSteps[idx + 1].key); };
  const goBack = () => { const idx = currentStepIndex; if (idx > 0) setStep(activeSteps[idx - 1].key); };

  const handleConfirmBooking = async () => {
    setSubmitting(true); setBookingError("");
    try {
      const payload = { serviceId: id, preferredDate: selectedDate, preferredTime: selectedTime, ...(selectedVariant ? { variantId: selectedVariant._id } : {}), ...(user ? {} : { guestInfo }) };
      const result = await createBooking(payload, token || undefined);
      setBookings([result]); setShowSuccess(true);
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-24"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!service) {
    return <div className="min-h-screen flex flex-col items-center justify-center pt-24"><p className="text-gray-500 text-lg">Service not found.</p><Link href="/" className="text-orange-500 hover:underline mt-2">Back to Home</Link></div>;
  }

  const subServices = service.subServices || [];
  const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
  const firstDay = getFirstDayOfMonth(calendarMonth, calendarYear);
  const prevMonthDays = getDaysInMonth(calendarMonth === 0 ? 11 : calendarMonth - 1, calendarMonth === 0 ? calendarYear - 1 : calendarYear);

  if (showSuccess && bookings[0]) {
    const booking = bookings[0];
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="max-w-lg mx-auto px-5">
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-green-600 text-3xl">&#10003;</span></div>
            <h2 className="text-2xl font-bold text-[#543826] mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-6">Your booking has been successfully created.</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Booking ID</span><span className="font-mono text-[#543826]">{booking._id}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Service</span><span className="text-[#543826]">{booking.serviceSnapshot?.title}</span></div>
              {booking.variantSnapshot && <div className="flex justify-between text-sm"><span className="text-gray-500">Package</span><span className="text-[#543826]">{booking.variantSnapshot.name}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-bold text-orange-600">AED {booking.totalAmount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span><span className="text-green-600 font-medium capitalize">{booking.status}</span></div>
            </div>
            <button
              onClick={() => {
                const msg = encodeURIComponent(
                  `New Booking Confirmed!\n\nBooking ID: ${booking._id}\nService: ${booking.serviceSnapshot?.title}\n${booking.variantSnapshot ? `Package: ${booking.variantSnapshot.name}\n` : ""}Date: ${booking.preferredDate}\nTime: ${booking.preferredTime}\nAmount: AED ${booking.totalAmount}\nStatus: ${booking.status}\n${booking.guestInfo ? `Guest: ${booking.guestInfo.fullName} | ${booking.guestInfo.phone} | ${booking.guestInfo.email}` : ""}`
                );
                window.open(`https://wa.me/971555828945?text=${msg}`, "_blank");
              }}
              className="w-full inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1eb954] text-white font-semibold py-5 rounded-xl text-lg transition-all duration-300 hover:shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/>
              </svg>
              Send Booking Receipt via WhatsApp
            </button>
            <p className="text-xs text-gray-400 mt-4">Share your booking details with us on WhatsApp for quick follow-up</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 pt-28">
      <div className="max-w-5xl mx-auto px-5 h-full pb-8">
        <div className="flex flex-col gap-6 h-full">
        <div className="rounded-3xl bg-[#f9f7f3] p-6 shadow-sm border border-transparent hover:border-gray-200 transition-all duration-300">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-500">{hasAddOns ? "Streamlined booking in three clear steps" : "Book your service — select date, review & confirm"}</p>
              <h1 className="text-2xl md:text-3xl font-semibold text-[#1f2937]">{hasAddOns ? "Book your service with confidence" : "Complete your booking"}</h1>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Step {currentStepIndex + 1} of {activeSteps.length}</p>
              <p className="text-base font-semibold text-[#543826]">{activeSteps[currentStepIndex].label}</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-linear-to-r from-green-500 to-[#543826] transition-all duration-500 ease-out" style={{ width: `${(currentStepIndex / (activeSteps.length - 1)) * 100}%` }} />
            </div>
            <div className="relative mt-4 flex items-center justify-between gap-3">
              {activeSteps.map((s, i) => {
                const isCompleted = i < currentStepIndex;
                const isActive = i === currentStepIndex;
                return (
                  <button
                    key={s.key}
                    type="button"
                    disabled={i > currentStepIndex}
                    onClick={() => { if (i <= currentStepIndex) setStep(s.key); }}
                    className="group flex min-w-[70px] flex-col items-center text-center focus:outline-none"
                  >
                    <span className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${isCompleted ? "bg-green-500 border-green-500 text-white shadow-lg" : isActive ? "bg-white border-[#543826] text-[#543826] shadow-sm scale-105" : "bg-white border-gray-200 text-gray-400"}`}>
                      {isCompleted ? "✓" : s.icon}
                    </span>
                    <span className={`mt-2 text-[11px] leading-4 font-semibold ${isCompleted ? "text-green-700" : isActive ? "text-[#543826]" : "text-gray-400"}`}>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div ref={stepRef} className="flex-1 bg-white rounded-3xl shadow-xl p-6 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {currentStepIndex > 0 && <button onClick={goBack} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500">&#8249;</button>}
                <h2 className="text-xl font-semibold text-gray-400">{activeSteps[currentStepIndex]?.label}</h2>
              </div>
              <button onClick={() => router.push(`/services/${id}`)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {step === "addons" && hasAddOns && (
                <div>
                  {(service.variants && service.variants.length > 0) || (service.discountPrice ?? service.actualPrice) != null ? (
                    <div className="mb-5"><label className="block text-sm font-medium text-gray-700 mb-2">Select Package</label>
                      <select value={selectedVariant?._id || "__base__"} onChange={(e) => { if (e.target.value === "__base__") { setSelectedVariant(null); } else { const v = service.variants?.find((v2) => v2._id === e.target.value); if (v) setSelectedVariant(v); } }} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        {(service.discountPrice ?? service.actualPrice) != null && <option value="__base__">1 Session — AED {(service.discountPrice ?? service.actualPrice ?? 0).toFixed(2)}</option>}
                        {service.variants?.map((v) => <option key={v._id} value={v._id}>{v.name} — AED {v.price} ({v.sessions} sessions)</option>)}
                      </select>
                    </div>
                  ) : null}
                  <p className="text-sm font-medium text-gray-700 mb-3">Add other services</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                    <button onClick={() => setActiveCategoryId("__all__")} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition ${activeCategoryId === "__all__" ? "bg-[#543826] text-white border-[#543826]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>All</button>
                    {categories.map((cat) => <button key={cat._id} onClick={() => setActiveCategoryId(cat._id)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition ${activeCategoryId === cat._id ? "bg-[#543826] text-white border-[#543826]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>{cat.name}</button>)}
                  </div>
                  {catalogLoading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div> : (
                    <div className="space-y-2 pr-1">
                      {catalogServices.filter((s) => s._id !== id).map((svc) => {
                        const price = svc.discountPrice ?? svc.actualPrice ?? 0;
                        const inCart = cartItems.some((a) => a.serviceId === svc._id);
                        return (
                          <div key={svc._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                            <div><p className="text-sm font-medium text-gray-800">{svc.title}</p><p className="text-xs text-orange-600 font-semibold mt-0.5">AED {price.toFixed(2)}</p></div>
                            <button onClick={() => inCart ? setCartItems((prev) => prev.filter((a) => a.serviceId !== svc._id)) : setCartItems((prev) => [...prev, { serviceId: svc._id, title: svc.title, image: svc.images?.[0], price }])} className={`shrink-0 ml-3 px-3 py-1.5 rounded-lg text-xs font-medium transition ${inCart ? "bg-green-100 text-green-700 border border-green-300" : "bg-[#543826] text-white hover:bg-[#3e2a1c]"}`}>{inCart ? "✓ Added" : "+ Add"}</button>
                          </div>
                        );
                      })}
                      {catalogServices.filter((s) => s._id !== id).length === 0 && <p className="text-center text-gray-400 text-sm py-6">No services found.</p>}
                    </div>
                  )}
                </div>
              )}
              {step === "datetime" && (
                <div>
                  {!hasAddOns && ((service.variants && service.variants.length > 0) || (service.discountPrice ?? service.actualPrice) != null) && (
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Package</label>
                      <select value={selectedVariant?._id || "__base__"} onChange={(e) => { if (e.target.value === "__base__") { setSelectedVariant(null); } else { const v = service.variants?.find((v2) => v2._id === e.target.value); if (v) setSelectedVariant(v); } }} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        {(service.discountPrice ?? service.actualPrice) != null && <option value="__base__">1 Session — AED {(service.discountPrice ?? service.actualPrice ?? 0).toFixed(2)}</option>}
                        {service.variants?.map((v) => <option key={v._id} value={v._id}>{v.name} — AED {v.price} ({v.sessions} sessions)</option>)}
                      </select>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-6">
                    <select value={calendarMonth} onChange={(e) => setCalendarMonth(parseInt(e.target.value))} className="bg-[#8a7060] text-white px-4 py-2.5 rounded-lg text-sm font-medium appearance-none cursor-pointer pr-8" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 20 20'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: "16px" }}>
                      {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                    </select>
                    <select value={calendarYear} onChange={(e) => setCalendarYear(parseInt(e.target.value))} className="bg-[#8a7060] text-white px-4 py-2.5 rounded-lg text-sm font-medium appearance-none cursor-pointer pr-8" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 20 20'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: "16px" }}>
                      {[2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <div className="ml-auto flex gap-1">
                      <button onClick={prevMonth} className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-600">&#8249;</button>
                      <button onClick={nextMonth} className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-600">&#8250;</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {DAYS.map((d) => <div key={d} className="py-2 text-sm font-medium text-gray-500">{d}</div>)}
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`prev-${i}`} className="py-3 text-sm text-gray-300">{prevMonthDays - firstDay + 1 + i}</div>)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1; const dateStr = formatDateStr(day); const disabled = isDateDisabled(day); const isSelected = selectedDate === dateStr; const isToday = dateStr === new Date().toISOString().split("T")[0];
                      return (
                        <button key={day} disabled={disabled} onClick={() => setSelectedDate(dateStr)} className={`py-3 text-sm rounded-lg transition relative ${isSelected ? "bg-[#543826] text-white font-bold" : disabled ? "text-gray-300 bg-red-50 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}>
                          {day}{isToday && !isSelected && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-gray-400 rounded-full" />}
                        </button>
                      );
                    })}
                    {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }).map((_, i) => <div key={`next-${i}`} className="py-3 text-sm text-gray-300">{i + 1}</div>)}
                  </div>
                  {selectedDate && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Select Time</label>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"].map((t) => {
                          const [h, m] = t.split(":"); const hour = parseInt(h); const ampm = hour >= 12 ? "PM" : "AM"; const h12 = hour % 12 || 12; const label = `${h12}:${m} ${ampm}`;
                          return <button key={t} onClick={() => setSelectedTime(t)} className={`py-2.5 px-2 rounded-lg border text-xs font-medium transition ${selectedTime === t ? "border-[#543826] bg-[#543826] text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>{label}</button>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {step === "summary" && (
                <div>
                  <p className="text-gray-500 text-sm mb-6">Review your booking, provide your information, and confirm payment.</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"><div><p className="font-semibold text-gray-800">{service.title}</p>{selectedVariant ? <p className="text-sm text-gray-500">{selectedVariant.name} — {selectedVariant.sessions} sessions</p> : !selectedVariant && (service.discountPrice ?? service.actualPrice) != null ? <p className="text-sm text-gray-500">1 Session</p> : null}{selectedDate && <p className="text-xs text-gray-400 mt-1">{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}{selectedTime && ` • ${(() => { const [h, m] = selectedTime.split(":"); const hour = parseInt(h); const ampm = hour >= 12 ? "PM" : "AM"; const h12 = hour % 12 || 12; return `${h12}:${m} ${ampm}`; })()}`}</p>}</div><span className="text-orange-600 font-bold text-lg">AED {basePrice.toFixed(2)}</span></div>
                    {cartItems.map((addon, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3"><span className="inline-block text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">Add-on</span><p className="font-medium text-gray-800">{addon.title}</p></div>
                        <div className="flex items-center gap-3"><span className="text-orange-600 font-bold">AED {addon.price.toFixed(2)}</span><button onClick={() => setCartItems((prev) => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 text-lg">&times;</button></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 space-y-4">
                      <p className="text-sm font-medium text-gray-700">Your Information</p>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={guestInfo.fullName} onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter your full name" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={guestInfo.email} onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter your email" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input type="tel" value={guestInfo.phone} onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="+971 XX XXX XXXX" /></div>
                    </div>
                  <div className="space-y-3 mt-6">
                    <div className="flex justify-between py-2 border-b"><span className="text-gray-500 text-sm">Payment Method</span><span className="font-medium text-gray-800 text-sm">Cash on Delivery</span></div>
                    <div className="flex justify-between items-center py-3 bg-orange-50 rounded-xl px-4"><span className="font-bold text-[#543826]">Total</span><span className="font-bold text-orange-600 text-lg">AED {totalPrice.toFixed(2)}</span></div>
                  </div>
                  {bookingError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mt-4">{bookingError}</div>}
                </div>
              )}
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-100 mt-2">
              {step === "summary" ? (
                <button disabled={submitting} onClick={handleConfirmBooking} className="bg-[#543826] hover:bg-[#3e2a1c] disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition">{submitting ? "Booking..." : "Confirm Booking"}</button>
              ) : (
                <button disabled={!canProceed()} onClick={goNext} className="border border-gray-300 text-gray-700 font-medium px-8 py-3 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">Continue</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage({ id }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-24"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <BookingContent id={id} />
    </Suspense>
  );
}
