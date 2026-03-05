"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/_common/api";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

function useDebounce(callback: (value: string) => void, delay: number) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounced = useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callback(value), delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return debounced;
}

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Field-level errors and checking spinners
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fieldChecking, setFieldChecking] = useState<Record<string, boolean>>({});

  const setFieldError = (field: string, msg: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: msg }));
  };

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // Email: format check + API uniqueness check
  const validateEmail = useCallback(async (value: string) => {
    if (!value) { clearFieldError("email"); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setFieldError("email", "Invalid email format");
      return;
    }
    setFieldChecking((prev) => ({ ...prev, email: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/users/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await res.json();
      if (data.exists) {
        setFieldError("email", "This email is already registered");
      } else {
        clearFieldError("email");
      }
    } catch {
      clearFieldError("email");
    } finally {
      setFieldChecking((prev) => ({ ...prev, email: false }));
    }
  }, []);

  // Phone: length check + API uniqueness check
  const validatePhone = useCallback(async (value: string) => {
    if (!value) { clearFieldError("phone"); return; }
    if (value.length < 7) {
      setFieldError("phone", "Phone number is too short");
      return;
    }
    setFieldChecking((prev) => ({ ...prev, phone: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/users/check-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: value }),
      });
      const data = await res.json();
      if (data.exists) {
        setFieldError("phone", "This phone number is already registered");
      } else {
        clearFieldError("phone");
      }
    } catch {
      clearFieldError("phone");
    } finally {
      setFieldChecking((prev) => ({ ...prev, phone: false }));
    }
  }, []);

  // Password: local-only validation
  const validatePassword = useCallback((value: string) => {
    if (!value) { clearFieldError("password"); return; }
    if (value.length < 6) {
      setFieldError("password", "Password must be at least 6 characters");
    } else {
      clearFieldError("password");
    }
  }, []);

  // Confirm password: match check
  const validateConfirmPassword = useCallback(
    (value: string) => {
      if (!value) { clearFieldError("confirmPassword"); return; }
      if (value !== password) {
        setFieldError("confirmPassword", "Passwords do not match");
      } else {
        clearFieldError("confirmPassword");
      }
    },
    [password]
  );

  const debouncedCheckEmail = useDebounce(validateEmail, 500);
  const debouncedCheckPhone = useDebounce(validatePhone, 500);
  const debouncedCheckPassword = useDebounce(validatePassword, 300);
  const debouncedCheckConfirm = useDebounce(validateConfirmPassword, 300);

  // Re-validate confirm when password changes
  useEffect(() => {
    if (confirmPassword) {
      if (confirmPassword !== password) {
        setFieldError("confirmPassword", "Passwords do not match");
      } else {
        clearFieldError("confirmPassword");
      }
    }
  }, [password, confirmPassword]);

  const hasFieldErrors = Object.values(fieldErrors).some((e) => e);

  const handleSubmit = async () => {
    setError("");

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (hasFieldErrors) {
      setError("Please fix the errors above before submitting");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, phone, password });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 transition ${
      fieldErrors[field]
        ? "border-red-400 focus:ring-red-400"
        : "border-gray-300 focus:ring-[#543826]"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#543826] text-center mb-2">
          Create Account
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Join Nordic Home Healthcare
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          {/* Name */}
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#543826]"
          />

          {/* Email */}
          <label className="text-sm font-medium text-gray-700 mt-3">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                debouncedCheckEmail(e.target.value);
              }}
              placeholder="john@example.com"
              className={inputClass("email")}
            />
            {fieldChecking.email && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {fieldErrors.email && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
          )}

          {/* Phone */}
          <label className="text-sm font-medium text-gray-700 mt-3">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                debouncedCheckPhone(e.target.value);
              }}
              placeholder="1234567890"
              className={inputClass("phone")}
            />
            {fieldChecking.phone && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {fieldErrors.phone && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
          )}

          {/* Password */}
          <label className="text-sm font-medium text-gray-700 mt-3">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              debouncedCheckPassword(e.target.value);
            }}
            placeholder="Min 6 characters"
            className={inputClass("password")}
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
          )}

          {/* Confirm Password */}
          <label className="text-sm font-medium text-gray-700 mt-3">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              debouncedCheckConfirm(e.target.value);
            }}
            placeholder="Re-enter password"
            className={inputClass("confirmPassword")}
          />
          {fieldErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || hasFieldErrors}
          className="w-full mt-6 bg-[#543826] hover:bg-[#3e2a1c] text-white py-3 rounded-lg font-medium disabled:bg-gray-400 transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="border-4 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
            </div>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-[#543826] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
