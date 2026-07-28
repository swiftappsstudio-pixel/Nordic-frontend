"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/_common/auth-context";
import {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/app/_common/api";
import { Address, AddressLabel, AddressRequest } from "@/app/_common/interfaces";
import { MapPin, Plus, Pencil, Trash2, Star, Home, Building2 } from "lucide-react";

const LABELS: AddressLabel[] = ["Home", "Office", "Other"];

const labelIcon = (label: AddressLabel) => {
  if (label === "Home") return <Home size={14} />;
  if (label === "Office") return <Building2 size={14} />;
  return <MapPin size={14} />;
};

const emptyForm: AddressRequest = {
  label: "Home",
  flatNumber: "",
  streetName: "",
  city: "",
  country: "United Arab Emirates",
  formattedAddress: "",
  isDefault: false,
};

const buildFormattedAddress = (data: AddressRequest): string => {
  return [data.flatNumber, data.streetName, data.city, data.country]
    .filter(Boolean)
    .join(", ");
};

export default function ManageAddressPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressRequest>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/sign-in");
    }
  }, [user, authLoading, router]);

  const loadAddresses = () => {
    if (!token) return;
    setLoading(true);
    getMyAddresses(token)
      .then(setAddresses)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load addresses"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) loadAddresses();
  }, [token]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (address: Address) => {
    setEditingId(address._id);
    setForm({
      label: address.label,
      flatNumber: address.flatNumber || "",
      streetName: address.streetName || "",
      city: address.city,
      country: address.country || "United Arab Emirates",
      formattedAddress: address.formattedAddress,
      isDefault: address.isDefault,
    });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleField = (field: keyof AddressRequest, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!form.streetName?.trim() || !form.flatNumber?.trim() || !form.city.trim()) {
      setError("Address, Street Address and City are required");
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    const payload: AddressRequest = {
      ...form,
      formattedAddress: buildFormattedAddress(form),
    };

    try {
      if (editingId) {
        await updateAddress(editingId, payload, token);
        setSuccess("Address updated successfully");
      } else {
        await createAddress(payload, token);
        setSuccess("Address added successfully");
      }
      closeForm();
      loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Delete this address?")) return;

    setDeletingId(id);
    setError("");
    setSuccess("");
    try {
      await deleteAddress(id, token);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      setSuccess("Address deleted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!token) return;
    setSettingDefaultId(id);
    setError("");
    setSuccess("");
    try {
      await setDefaultAddress(id, token);
      loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set default address");
    } finally {
      setSettingDefaultId(null);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="w-10 h-10 border-4 border-[#543826] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Manage Address</h1>
          {!showForm && (
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 bg-[#543826] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#3e2a1c] transition"
            >
              <Plus size={16} />
              Add Address
            </button>
          )}
        </div>
        <p className="text-gray-500 mb-8">View your saved addresses and update your delivery details</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg p-3 mb-4">
            {success}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-md p-6 md:p-8 mb-8 border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              {editingId ? "Update Address" : "Add New Address"}
            </h2>

            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Label</label>
              <div className="flex gap-2">
                {LABELS.map((l) => (
                  <button
                    type="button"
                    key={l}
                    onClick={() => handleField("label", l)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition ${
                      form.label === l
                        ? "bg-[#543826] text-white border-[#543826]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#543826]"
                    }`}
                  >
                    {labelIcon(l)}
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.flatNumber}
                  onChange={(e) => handleField("flatNumber", e.target.value)}
                  placeholder="e.g. Flat 204, Marina Towers"
                  required
                  className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#543826]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.streetName}
                  onChange={(e) => handleField("streetName", e.target.value)}
                  placeholder="e.g. Sheikh Zayed Road"
                  required
                  className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#543826]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.city}
                  onChange={(e) => handleField("city", e.target.value)}
                  placeholder="e.g. Dubai"
                  required
                  className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#543826]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Country</label>
                <input
                  value={form.country}
                  disabled
                  className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 mt-5 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={!!form.isDefault}
                onChange={(e) => handleField("isDefault", e.target.checked)}
                className="w-4 h-4 accent-[#543826]"
              />
              Set as default address
            </label>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#543826] hover:bg-[#3e2a1c] text-white py-3 rounded-xl font-medium disabled:bg-gray-400 transition-colors"
              >
                {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-6 py-3 rounded-xl font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-gray-500">Loading your addresses...</p>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No saved addresses yet</h2>
            <p className="text-gray-500 mb-6">Add an address to speed up your future bookings</p>
            {!showForm && (
              <button
                onClick={openAddForm}
                className="inline-flex items-center gap-2 bg-[#543826] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#3e2a1c] transition"
              >
                <Plus size={16} />
                Add Address
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="bg-white rounded-2xl shadow-md p-5 border border-gray-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#C9C3B3]/40 text-[#543826]">
                      {labelIcon(address.label)}
                      {address.label}
                    </span>
                    {address.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Star size={12} fill="currentColor" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditForm(address)}
                      className="p-2 text-gray-500 hover:text-[#543826] hover:bg-gray-100 rounded-lg transition"
                      aria-label="Edit address"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      disabled={deletingId === address._id}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      aria-label="Delete address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-800 mt-3 text-sm">{address.formattedAddress}</p>

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    disabled={settingDefaultId === address._id}
                    className="mt-3 text-sm text-[#543826] font-medium hover:underline disabled:opacity-50"
                  >
                    {settingDefaultId === address._id ? "Setting..." : "Set as default"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-8">
          <Link href="/" className="text-[#543826] font-semibold hover:underline">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
