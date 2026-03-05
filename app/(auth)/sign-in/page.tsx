"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/_common/api";
import { useAuth } from "@/app/_common/auth-context";

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

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Field-level errors and checking state
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

  // Email: format check + existence check (for login, email should exist)
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
      if (!data.exists) {
        setFieldError("email", "No account found with this email");
      } else {
        clearFieldError("email");
      }
    } catch {
      clearFieldError("email");
    } finally {
      setFieldChecking((prev) => ({ ...prev, email: false }));
    }
  }, []);

  const debouncedCheckEmail = useDebounce(validateEmail, 500);

  const hasFieldErrors = Object.values(fieldErrors).some((e) => e);

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (hasFieldErrors) {
      setError("Please fix the errors above");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.token, res.user);
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      if (message.includes("verify your email")) {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        return;
      }
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
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Sign in to Nordic Home Healthcare
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          {/* Email */}
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
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

          {/* Password */}
          <label className="text-sm font-medium text-gray-700 mt-3">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Enter your password"
            className={inputClass("password")}
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
          )}
        </div>

        <div className="flex justify-end mt-2">
          <Link
            href="/forgot-password"
            className="text-sm text-[#543826] font-medium hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || hasFieldErrors}
          className="w-full mt-4 bg-[#543826] hover:bg-[#3e2a1c] text-white py-3 rounded-lg font-medium disabled:bg-gray-400 transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="border-4 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-[#543826] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
