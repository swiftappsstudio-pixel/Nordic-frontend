"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/app/_common/auth-context";
import {
  getAdminBookingsByDateRange,
  adminCreateBooking,
  adminRescheduleBooking,
  adminUpdateBookingStatus,
  adminDeleteBooking,
  getServices,
} from "@/app/_common/api";
import { BookingResponse, Service, GuestInfo } from "@/app/_common/interfaces";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Plus, X, Clock, User, Calendar } from "lucide-react";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const formatHour = (h: number) => {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
};

const formatDateStr = (d: Date) => d.toISOString().split("T")[0];

const formatDisplayDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const getWeekDays = (baseDate: Date): Date[] => {
  const start = new Date(baseDate);
  const day = start.getDay();
  start.setDate(start.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

const statusColors: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700 border-blue-300",
  completed: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
};

const slotCellBg: Record<string, string> = {
  confirmed: "bg-blue-50",
  completed: "bg-green-50",
  cancelled: "",
};

const getBookingHour = (time: string): number => {
  if (!time || !time.includes(":")) return 0;
  return parseInt(time.split(":")[0]);
};

const formatTimeRange = (time: string) => {
  if (!time || !time.includes(":")) return "—";
  const h = parseInt(time.split(":")[0]);
  return `${formatHour(h)} – ${formatHour(h + 1)}`;
};

const isPastDate = (dateStr: string) => {
  const today = formatDateStr(new Date());
  return dateStr < today;
};

const isPastDateTime = (dateStr: string, hour: number) => {
  const now = new Date();
  const cellDate = new Date(dateStr + "T00:00:00");
  if (cellDate < new Date(formatDateStr(now) + "T00:00:00")) return true;
  if (dateStr === formatDateStr(now) && hour < now.getHours()) return true;
  return false;
};

export default function BookingsCalendarPage() {
  const { token, isLoading: authLoading } = useAuth();

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay();
    now.setDate(now.getDate() - day);
    return now;
  });

  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<BookingResponse | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState<BookingResponse | null>(null);

  const [selectedDate, setSelectedDate] = useState(formatDateStr(new Date()));
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [guestFullName, setGuestFullName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const [hoveredBooking, setHoveredBooking] = useState<BookingResponse | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const [draggingBooking, setDraggingBooking] = useState<BookingResponse | null>(null);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);
  const dragCounterRef = useRef<Record<string, number>>({});

  const weekDays = getWeekDays(currentWeekStart);
  const weekStartStr = formatDateStr(weekDays[0]);
  const weekEndStr = formatDateStr(weekDays[6]);

  const fetchBookings = useCallback(async () => {
    if (!token || authLoading) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminBookingsByDateRange(token, weekStartStr, weekEndStr);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [token, authLoading, weekStartStr, weekEndStr]);

  const fetchServices = useCallback(async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const goPrevWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  };

  const goNextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  };

  const goToday = () => {
    const now = new Date();
    const day = now.getDay();
    now.setDate(now.getDate() - day);
    setCurrentWeekStart(now);
  };

  const getBookingsForCell = (dateStr: string, hour: number) =>
    bookings.filter((b) => {
      if (b.status === "cancelled") return false;
      if (b.preferredDate !== dateStr) return false;
      return getBookingHour(b.preferredTime || "") === hour;
    });

  const handleCreateBooking = async () => {
    if (!token) return;
    if (!selectedServiceId || !selectedDate || !selectedTime) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!guestFullName || !guestEmail || !guestPhone) {
      toast.error("Please fill guest information");
      return;
    }
    if (isPastDate(selectedDate)) {
      toast.error("Cannot create bookings on past dates");
      return;
    }

    try {
      const guestInfo: GuestInfo = {
        fullName: guestFullName,
        email: guestEmail,
        phone: guestPhone,
      };

      await adminCreateBooking(token, {
        serviceId: selectedServiceId,
        preferredDate: selectedDate,
        preferredTime: selectedTime,
        guestInfo,
      });

      toast.success("Booking created successfully");
      setShowCreateModal(false);
      setGuestFullName("");
      setGuestEmail("");
      setGuestPhone("");
      setSelectedServiceId("");
      setSelectedTime("10:00");
      fetchBookings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create booking");
    }
  };

  const handleReschedule = async () => {
    if (!token || !showRescheduleModal) return;
    try {
      await adminRescheduleBooking(token, showRescheduleModal._id, rescheduleDate, rescheduleTime);
      toast.success("Booking rescheduled successfully");
      setShowRescheduleModal(null);
      fetchBookings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reschedule");
    }
  };

  const handleDragDropReschedule = async (booking: BookingResponse, newDate: string, newHour: number) => {
    if (!token) return;
    if (isPastDate(newDate)) {
      toast.error("Cannot reschedule to a past date");
      return;
    }
    const newTime = `${newHour.toString().padStart(2, "0")}:00`;
    try {
      await adminRescheduleBooking(token, booking._id, newDate, newTime);
      toast.success("Booking rescheduled via drag & drop");
      fetchBookings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reschedule");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!token) return;
    try {
      await adminUpdateBookingStatus(token, bookingId, "cancelled");
      toast.success("Booking cancelled");
      setShowDetailModal(null);
      fetchBookings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel");
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    if (!token) return;
    try {
      await adminUpdateBookingStatus(token, bookingId, "completed");
      toast.success("Booking marked as completed");
      setShowDetailModal(null);
      fetchBookings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to permanently delete this booking?")) return;
    try {
      await adminDeleteBooking(token, bookingId);
      toast.success("Booking deleted");
      setShowDetailModal(null);
      fetchBookings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete booking");
    }
  };

  const openCreateModal = (dateStr: string, hour: number) => {
    if (isPastDateTime(dateStr, hour)) {
      toast.error("Cannot create bookings on past dates/times");
      return;
    }
    setSelectedDate(dateStr);
    setSelectedTime(`${hour.toString().padStart(2, "0")}:00`);
    setShowCreateModal(true);
  };

  const openRescheduleModal = (booking: BookingResponse) => {
    setRescheduleDate(booking.preferredDate || "");
    setRescheduleTime(booking.preferredTime || "");
    setShowRescheduleModal(booking);
    setShowDetailModal(null);
  };

  const isToday = (dateStr: string) => dateStr === formatDateStr(new Date());

  const handleBookingHover = (b: BookingResponse, e: React.MouseEvent) => {
    setHoveredBooking(b);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleBookingLeave = () => {
    setHoveredBooking(null);
    setTooltipPos(null);
  };

  const handleDragStart = (b: BookingResponse, e: React.DragEvent) => {
    setDraggingBooking(b);
    e.dataTransfer.setData("text/plain", b._id);
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggingBooking(null);
    setDragOverCell(null);
    dragCounterRef.current = {};
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
  };

  const handleDragEnterCell = (cellKey: string) => {
    if (!dragCounterRef.current[cellKey]) {
      dragCounterRef.current[cellKey] = 0;
    }
    dragCounterRef.current[cellKey]++;
    setDragOverCell(cellKey);
  };

  const handleDragLeaveCell = (cellKey: string) => {
    if (!dragCounterRef.current[cellKey]) {
      dragCounterRef.current[cellKey] = 0;
    }
    dragCounterRef.current[cellKey]--;
    if (dragCounterRef.current[cellKey] === 0) {
      setDragOverCell((prev) => prev === cellKey ? null : prev);
    }
  };

  const handleDropOnCell = (dateStr: string, hour: number) => {
    if (!draggingBooking) return;
    if (isPastDate(dateStr)) {
      toast.error("Cannot reschedule to a past date");
      return;
    }
    handleDragDropReschedule(draggingBooking, dateStr, hour);
    setDraggingBooking(null);
    setDragOverCell(null);
    dragCounterRef.current = {};
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="border-4 border-[#543826] border-t-transparent rounded-full w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Bookings Calendar</h1>
          <div className="flex items-center gap-2">
            <button onClick={goPrevWeek} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button onClick={goToday} className="px-4 py-1.5 bg-[#543826] text-white rounded-lg text-sm font-medium hover:bg-[#6d4c3a] transition-colors">
              Today
            </button>
            <button onClick={goNextWeek} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-600 ml-2">
              {formatDisplayDate(weekStartStr)} — {formatDisplayDate(weekEndStr)}
            </span>
          </div>
        </div>
        <button
          onClick={() => openCreateModal(formatDateStr(new Date()), new Date().getHours() + 1)}
          className="flex items-center gap-2 px-4 py-2 bg-[#543826] text-white rounded-lg text-sm font-medium hover:bg-[#6d4c3a] transition-colors"
        >
          <Plus size={16} />
          New Booking
        </button>
      </div>

      {loading && <p className="text-gray-500 py-4">Loading bookings...</p>}
      {!loading && error && <p className="text-red-500 py-4">{error}</p>}

      {!loading && !error && (
        <div className="flex-1 overflow-auto border rounded-lg bg-white">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] min-w-[900px]">
            {/* Header row */}
            <div className="sticky top-0 z-10 bg-gray-50 border-b border-r p-2 text-xs text-gray-400 font-medium text-center">
              Time
            </div>
            {weekDays.map((day) => {
              const ds = formatDateStr(day);
              const pastHeader = isPastDate(ds) ? "text-gray-400" : "";
              const todayClass = isToday(ds) ? "bg-orange-50 text-orange-700 font-bold" : `text-gray-700 ${pastHeader}`;
              const headerBg = isToday(ds) ? "bg-orange-50" : isPastDate(ds) ? "bg-gray-100" : "bg-gray-50";
              return (
                <div
                  key={ds}
                  className={`sticky top-0 z-10 border-b border-r p-2 text-center ${headerBg} ${todayClass}`}
                >
                  <div className="text-xs font-medium">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                  <div className="text-sm">{day.getDate()}</div>
                  {isPastDate(ds) && !isToday(ds) && (
                    <div className="text-[10px] text-gray-400 mt-0.5">Past</div>
                  )}
                </div>
              );
            })}

            {/* Time rows */}
            {HOURS.map((hour) => (
              <>
                {/* Time label cell */}
                <div className="border-b border-r p-2 text-xs text-gray-500 text-center h-14 flex items-center justify-center">
                  {formatHour(hour)}
                </div>
                {/* Day cells */}
                {weekDays.map((day) => {
                  const ds = formatDateStr(day);
                  const cellKey = `${ds}-${hour}`;
                  const cellBookings = getBookingsForCell(ds, hour);
                  const past = isPastDateTime(ds, hour);
                  const todayBg = !past && isToday(ds) ? "bg-orange-50/30" : "";
                  const bookingBg = !past && cellBookings.length > 0 ? slotCellBg[cellBookings[0].status] || "bg-blue-50" : "";
                  const pastBg = past ? "bg-gray-50 opacity-60" : "";
                  const isDragOver = dragOverCell === cellKey && !past;

                  return (
                    <div
                      key={cellKey}
                      className={`border-b border-r p-1 h-14 relative transition-colors ${
                        past
                          ? `${pastBg} cursor-not-allowed`
                          : `cursor-pointer hover:bg-gray-100 ${todayBg} ${bookingBg}`
                      } ${isDragOver ? "ring-2 ring-blue-400 bg-blue-50" : ""}`}
                      onClick={() => {
                        if (!past && cellBookings.length === 0) {
                          openCreateModal(ds, hour);
                        }
                      }}
                      onDragOver={(e) => {
                        if (!past) {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                        }
                      }}
                      onDragEnter={() => {
                        if (!past) handleDragEnterCell(cellKey);
                      }}
                      onDragLeave={() => handleDragLeaveCell(cellKey)}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (!past) handleDropOnCell(ds, hour);
                      }}
                    >
                      {cellBookings.map((b) => (
                        <div
                          key={b._id}
                          draggable={!past}
                          onDragStart={(e) => handleDragStart(b, e)}
                          onDragEnd={handleDragEnd}
                          className={`absolute inset-x-1 top-0.5 rounded px-1.5 py-0.5 text-xs truncate cursor-pointer border ${
                            past ? "opacity-40 cursor-default" : ""
                          } ${statusColors[b.status] || "bg-gray-100 text-gray-700 border-gray-300"}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDetailModal(b);
                          }}
                          onMouseEnter={(e) => handleBookingHover(b, e)}
                          onMouseLeave={handleBookingLeave}
                        >
                          <span className="font-medium">{b.guestInfo?.fullName || "User"}</span>
                          <span className="mx-0.5">·</span>
                          <span>{b.serviceSnapshot?.title || "Service"}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoveredBooking && tooltipPos && (
        <div
          className="fixed z-[60] pointer-events-none"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 8,
          }}
        >
          <div className="bg-gray-900 text-white rounded-lg shadow-xl px-3 py-2 text-xs max-w-[260px]">
            <div className="font-semibold text-sm mb-1">{hoveredBooking.guestInfo?.fullName || "User"}</div>
            <div className="flex items-center gap-1 text-gray-300 mb-0.5">
              <Clock size={12} />
              {formatTimeRange(hoveredBooking.preferredTime || "")}
            </div>
            <div className="flex items-center gap-1 text-gray-300 mb-0.5">
              <Calendar size={12} />
              {hoveredBooking.preferredDate || "—"}
            </div>
            <div className="text-gray-300 mb-0.5">
              Service: {hoveredBooking.serviceSnapshot?.title || "—"}
            </div>
            <div className="text-gray-300">
              AED {hoveredBooking.totalAmount} · {hoveredBooking.totalSessions} sessions · <span className="capitalize">{hoveredBooking.status}</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Booking Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Plus size={18} className="text-[#543826]" />
                Create Booking
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#543826] text-gray-800"
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar size={14} /> Date *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={formatDateStr(new Date())}
                    onChange={(e) => {
                      if (isPastDate(e.target.value)) {
                        toast.error("Cannot select a past date");
                        return;
                      }
                      setSelectedDate(e.target.value);
                    }}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#543826] text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Clock size={14} /> Time *
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#543826] text-gray-800"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={`${h.toString().padStart(2, "0")}:00`}>
                        {formatHour(h)} — {formatHour(h + 1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="border-t pt-3 mt-2">
                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <User size={14} /> Guest Information *
                </p>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={guestFullName}
                    onChange={(e) => setGuestFullName(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#543826] text-gray-800"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#543826] text-gray-800"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#543826] text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBooking}
                className="px-4 py-2 text-sm bg-[#543826] text-white rounded-lg hover:bg-[#6d4c3a] transition-colors"
              >
                Create Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Booking Details</h2>
              <button onClick={() => setShowDetailModal(null)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[showDetailModal.status]?.replace("border-", "") || "bg-gray-100 text-gray-700"}`}>
                  {showDetailModal.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${showDetailModal.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                  {showDetailModal.paymentStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium text-gray-800">{showDetailModal.guestInfo?.fullName || "Registered user"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{showDetailModal.guestInfo?.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Service</p>
                  <p className="font-medium text-gray-800">{showDetailModal.serviceSnapshot?.title || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium text-gray-800">AED {showDetailModal.totalAmount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">{showDetailModal.preferredDate || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Time Slot</p>
                  <p className="font-medium text-gray-800">
                    {formatTimeRange(showDetailModal.preferredTime || "")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Sessions</p>
                  <p className="font-medium text-gray-800">{showDetailModal.totalSessions} (remaining: {showDetailModal.remainingSessions})</p>
                </div>
              </div>
              {showDetailModal.guestInfo?.email && (
                <div className="text-sm">
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{showDetailModal.guestInfo.email}</p>
                </div>
              )}
            </div>
<div className="flex items-center justify-between p-4 border-t">
               <div className="flex gap-2">
                 {showDetailModal.status === "confirmed" && (
                   <>
                     <button
                       onClick={() => openRescheduleModal(showDetailModal)}
                       className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                     >
                       Reschedule
                     </button>
                     <button
                       onClick={() => handleCancelBooking(showDetailModal._id)}
                       className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                     >
                       Cancel
                     </button>
                     <button
                       onClick={() => handleDeleteBooking(showDetailModal._id)}
                       className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                     >
                       Delete
                     </button>
                   </>
                 )}
                 {showDetailModal.status === "confirmed" && (
                   <button
                     onClick={() => handleCompleteBooking(showDetailModal._id)}
                     className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                   >
                     Complete
                   </button>
                 )}
               </div>
               <button
                 onClick={() => setShowDetailModal(null)}
                 className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
               >
                 Close
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                Reschedule Booking
              </h2>
              <button onClick={() => setShowRescheduleModal(null)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-600">
                Rescheduling <strong>{showRescheduleModal.guestInfo?.fullName || "User"}</strong>&apos;s booking for <strong>{showRescheduleModal.serviceSnapshot?.title || "Service"}</strong>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    min={formatDateStr(new Date())}
                    onChange={(e) => {
                      if (isPastDate(e.target.value)) {
                        toast.error("Cannot select a past date");
                        return;
                      }
                      setRescheduleDate(e.target.value);
                    }}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#543826] text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#543826] text-gray-800"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={`${h.toString().padStart(2, "0")}:00`}>
                        {formatHour(h)} — {formatHour(h + 1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setShowRescheduleModal(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="px-4 py-2 text-sm bg-[#543826] text-white rounded-lg hover:bg-[#6d4c3a] transition-colors"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}