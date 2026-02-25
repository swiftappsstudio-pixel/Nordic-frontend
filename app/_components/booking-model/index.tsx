"use client";

import { useState } from "react";
import { useAuth } from "@/app/_common/auth-context";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  price: number;
}

const BookingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  serviceName,
  price,
}) => {
  const { user, token } = useAuth();

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [phoneNumber, setPhoneNumber] = useState("");

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!date || !time) {
      alert("Please select date & time");
      return;
    }

    const payload = {
      customerName: customerName || user?.name || "",
      serviceName,
      price,
      address,
      date,
      time,
      paymentMethod,
      phoneNumber: phoneNumber || user?.phone || "",
    };

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Send auth token if user is logged in
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("http://localhost:3100/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      alert("Booking confirmed!");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Booking failed");
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
        <p className="mb-4 text-amber-700 font-semibold">
          AED {price}
        </p>

        {/* Name */}
        <label className="block text-sm mb-1 text-black">Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder={user?.name || "Enter your name"}
          className="w-full border rounded-md text-black p-2 mb-4"
        />

        {/* Address */}
        <label className="block text-sm mb-1 text-black">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border rounded-md text-black p-2 mb-4"
        />

        {/* Phone Number */}
        <label className="block text-sm mb-1 text-black">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder={user?.phone || "Enter phone number"}
          className="w-full border rounded-md text-black p-2 mb-4"
        />

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

        {/* Payment */}
        <label className="block text-sm mb-1 text-black">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border rounded-md text-black p-2 mb-6"
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="online">Online</option>
        </select>

        <button
          onClick={handleConfirm}
          className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-md"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
