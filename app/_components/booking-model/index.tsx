"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_common/auth-context";
import { createBooking, getAddOnsByService } from "@/app/_common/api";
import { AddOn, BookingRequest } from "@/app/_common/interfaces";

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

  // Add-ons for this service only
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<Set<string>>(
    new Set()
  );
  const [loadingAddOns, setLoadingAddOns] = useState(false);

  // Fetch this service's add-ons when the modal opens
  useEffect(() => {
    if (!isOpen || !serviceId) return;

    let cancelled = false;
    setLoadingAddOns(true);

    getAddOnsByService(serviceId)
      .then((list) => {
        if (cancelled) return;
        setAddOns(list);
        // Pre-select any required add-ons so the customer can't skip them
        const required = new Set(
          list.filter((a) => a.isRequired).map((a) => a._id)
        );
        setSelectedAddOnIds(required);
      })
      .catch((err) => {
        console.error("Failed to load add-ons", err);
        if (!cancelled) setAddOns([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingAddOns(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, serviceId]);

  if (!isOpen) return null;

  const isGuest = !token;

  const toggleAddOn = (id: string, isRequired: boolean) => {
    if (isRequired) return; // can't deselect required add-ons
    setSelectedAddOnIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addOnsTotal = addOns
    .filter((a) => selectedAddOnIds.has(a._id))
    .reduce((sum, a) => sum + a.price, 0);

  const grandTotal = price + addOnsTotal;

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

    if (subServiceName) {
      payload.subServiceName = subServiceName;
    }

    if (selectedAddOnIds.size > 0) {
      payload.addOnIds = Array.from(selectedAddOnIds);
    }

    if (isGuest) {
      payload.guestInfo = {
        fullName,
        email: guestEmail,
        phone: guestPhone,
      };
    }

    try {
      setSubmitting(true);
      const result = await createBooking(payload, token || undefined);
      const msg = encodeURIComponent(
        `New Booking Confirmed!\n\nBooking ID: ${result._id}\nService: ${serviceId}\nDate: ${date}\nTime: ${time}\n${isGuest ? `Guest: ${fullName} | ${guestPhone} | ${guestEmail}` : ""}`
      );
      window.open(`https://wa.me/923414415384?text=${msg}`, "_blank");
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative my-auto">
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

        {/* Add-ons specific to this service */}
        {loadingAddOns && (
          <p className="text-xs text-gray-400 mb-4">Loading add-ons…</p>
        )}

        {!loadingAddOns && addOns.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm mb-2 text-black font-medium">
              Add-ons
            </label>
            <div className="space-y-2">
              {addOns.map((a) => {
                const checked = selectedAddOnIds.has(a._id);
                return (
                  <label
                    key={a._id}
                    className={`flex items-start justify-between gap-2 border rounded-md p-2 cursor-pointer ${
                      checked ? "border-amber-700 bg-amber-50" : "border-gray-200"
                    } ${a.isRequired ? "opacity-90" : ""}`}
                  >
                    <div className="flex items-start gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={a.isRequired}
                        onChange={() => toggleAddOn(a._id, a.isRequired)}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-black">
                          {a.name}
                          {a.isRequired && (
                            <span className="ml-2 text-xs text-red-600">
                              Required
                            </span>
                          )}
                        </p>
                        {a.description && (
                          <p className="text-xs text-gray-500">
                            {a.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-amber-700 whitespace-nowrap">
                      + AED {a.price}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-lg font-bold text-amber-700">
            AED {grandTotal}
          </span>
        </div>

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
