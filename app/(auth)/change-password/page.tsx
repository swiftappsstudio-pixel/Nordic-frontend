"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { changePassword } from "@/app/_common/api";
import { useAuth } from "@/app/_common/auth-context";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/sign-in");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);
    try {
      const res = await changePassword({ currentPassword, newPassword }, token!);
      setSuccess(res.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Password change failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="border-4 border-[#543826] border-t-transparent rounded-full w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#543826] text-center mb-2">
          Change Password
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Update your account password
        </p>

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

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#543826]"
          />

          <label className="text-sm font-medium text-gray-700 mt-3">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#543826]"
          />

          <label className="text-sm font-medium text-gray-700 mt-3">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Re-enter new password"
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#543826]"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-[#543826] hover:bg-[#3e2a1c] text-white py-3 rounded-lg font-medium disabled:bg-gray-400 transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="border-4 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
            </div>
          ) : (
            "Change Password"
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/" className="text-[#543826] font-semibold hover:underline">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
