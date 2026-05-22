"use client";

import { useState } from "react";
import { useAuth } from "@/app/_common/auth-context";
import { createBooking } from "@/app/_common/api";
import { BookingRequest } from "@/app/_common/interfaces";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  serviceName: string;
  price: number;
  /** Set when the customer picked a sub-service pricing tier instead of the base service */
  subServiceName?: string;
}

const BookingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  serviceId,
  serviceName,
  price,
  subServiceName,
}) => {
  const { user, token } = useAuth();

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const isGuest = !token;

  const handleConfirm = async () => {
    if (!date || !time) {
      alert("Please select date & time");
      return;
    }

    // Guest bookings require name, email and phone (the API rejects them otherwise)
    const fullName = customerName || user?.name || "";
    const guestEmail = email || user?.email || "";
    const guestPhone = phoneNumber || user?.phone || "";

    if (isGuest && (!fullName || !guestEmail || !guestPhone)) {
      alert("Please enter your name, email and phone number");
      return;
    }

    const payload: BookingRequest = {
      serviceId,
      preferredDate: date,
      preferredTime: time,
    };

    // Sub-service pricing tier, when one was selected
    if (subServiceName) {
      payload.subServiceName = subServiceName;
    }

    // Only guests send guestInfo — logged-in users are identified by their token
    if (isGuest) {
      payload.guestInfo = {
        fullName,
        email: guestEmail,
        phone: guestPhone,
      };
    }

    try {
      setSubmitting(true);
      await createBooking(payload, token || undefined);
      alert("Booking confirmed!");
      onClose();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          ✕
        </button>

        <p className="mb-2 font-medium text-black">{serviceName}</p>
        <p className="mb-4 text-amber-700 font-semibold">AED {price}</p>

        {/* Guest contact fields — only shown when not logged in */}
        {isGuest && (
          <>
            <label className="block text-sm mb-1 text-black">Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border rounded-md text-black p-2 mb-4"
            />

            <label className="block text-sm mb-1 text-black">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border rounded-md text-black p-2 mb-4"
            />

            <label className="block text-sm mb-1 text-black">
              Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full border rounded-md text-black p-2 mb-4"
            />
          </>
        )}

        {/* Date */}
        <label className="block text-sm mb-1 text-black">Preferred Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-md text-black p-2 mb-4"
        />

        {/* Time */}
        <label className="block text-sm mb-1 text-black">Preferred Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border text-black rounded-md p-2 mb-4"
        />

        <p className="text-sm text-gray-500 mb-6">
          Payment Method: <strong>Cash on Delivery</strong>
        </p>

        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white py-3 rounded-md"
        >
          {submitting ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
