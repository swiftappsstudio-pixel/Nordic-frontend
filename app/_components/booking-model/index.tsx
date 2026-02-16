"use client";

import { useState } from "react";

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
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  if (!isOpen) return null;

 const handleConfirm = async () => {
  if (!date || !time) {
    alert("Please select date & time");
    return;
  }

  const payload = {
    serviceName,
    price,
    date,
    time,
    paymentMethod,
  };

  try {
    const res = await fetch("http://localhost:3100/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Failed to create order");
    }

    alert("Booking confirmed 🎉");
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

        <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>

        <p className="mb-2 font-medium">{serviceName}</p>
        <p className="mb-4 text-amber-700 font-semibold">
          AED {price}
        </p>

        {/* Date */}
        <label className="block text-sm mb-1">Preferred Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-md p-2 mb-4"
        />

        {/* Time */}
        <label className="block text-sm mb-1">Preferred Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border rounded-md p-2 mb-4"
        />

        {/* Payment */}
        <label className="block text-sm mb-1">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border rounded-md p-2 mb-6"
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
