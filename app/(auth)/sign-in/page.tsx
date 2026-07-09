"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

  const [loginMode, setLoginMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const validatePhone = useCallback(async (value: string) => {
    if (!value) { clearFieldError("phone"); return; }
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!phoneRegex.test(value)) {
      setFieldError("phone", "Invalid phone number");
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
      if (!data.exists) {
        setFieldError("phone", "No account found with this phone number");
      } else {
        clearFieldError("phone");
      }
    } catch {
      clearFieldError("phone");
    } finally {
      setFieldChecking((prev) => ({ ...prev, phone: false }));
    }
  }, []);

  const debouncedCheckEmail = useDebounce(validateEmail, 500);
  const debouncedCheckPhone = useDebounce(validatePhone, 500);

  const hasFieldErrors = Object.values(fieldErrors).some((e) => e);

  const handleSubmit = async () => {
    setError("");

    if (loginMode === "email") {
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }
    } else {
      if (!phone || !password) {
        setError("Phone and password are required");
        return;
      }
    }

    if (hasFieldErrors) {
      setError("Please fix the errors above");
      return;
    }

    setLoading(true);
    try {
      const payload = loginMode === "email"
        ? { email, password }
        : { phone, password };
      const res = await loginUser(payload);
      login(res.token, res.user);
      router.push(res.user?.role === "admin" ? "/admin" : "/");
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
    `w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
      fieldErrors[field]
        ? "border-red-300 focus:ring-red-400/50 bg-red-50/50"
        : "border-gray-200 focus:ring-[#543826]/30 focus:border-[#543826]"
    }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#faf8f6] via-white to-[#f0ece6] px-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#543826]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1a2e28]/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 sm:p-10">
          {/* Logo / Brand */}
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#543826] to-[#3e2a1c] flex items-center justify-center shadow-lg shadow-[#543826]/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
              </svg>
            </div>
          </div>

          <h1 className="text-xl font-semibold text-gray-900 text-center tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-400 text-sm text-center mt-1 mb-8">
            Sign in to your Nordic account
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3.5 mb-5"
            >
              {error}
            </motion.div>
          )}

          {/* Login Mode Toggle */}
          <div className="relative flex bg-gray-100/80 rounded-xl p-1 mb-6">
            <motion.div
              layout
              layoutId="active-tab"
              className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm border border-gray-100"
              style={{ width: "calc(50% - 0.25rem)", left: loginMode === "email" ? "0.25rem" : "calc(50% + 0.125rem)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <button
              onClick={() => { setLoginMode("email"); setError(""); clearFieldError("phone"); }}
              className="relative z-10 flex-1 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ color: loginMode === "email" ? "#543826" : "#9CA3AF" }}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Email
              </span>
            </button>
            <button
              onClick={() => { setLoginMode("phone"); setError(""); clearFieldError("email"); }}
              className="relative z-10 flex-1 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ color: loginMode === "phone" ? "#543826" : "#9CA3AF" }}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Phone
              </span>
            </button>
          </div>

          <div className="space-y-4">
            {loginMode === "email" ? (
              <motion.div
                key="email-field"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
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
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {fieldErrors.email && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1.5">{fieldErrors.email}</motion.p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="phone-field"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError("");
                      debouncedCheckPhone(e.target.value);
                    }}
                    placeholder="+971 55 123 4567"
                    className={inputClass("phone")}
                  />
                  {fieldChecking.phone && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {fieldErrors.phone && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1.5">{fieldErrors.phone}</motion.p>
                )}
              </motion.div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  className={inputClass("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1.5">{fieldErrors.password}</motion.p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end mt-4">
            <Link
              href="/forgot-password"
              className="text-xs text-[#543826] font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || hasFieldErrors}
            className="w-full mt-5 bg-gradient-to-r from-[#543826] to-[#3e2a1c] hover:from-[#3e2a1c] hover:to-[#2a1a10] text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#543826]/20"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm">Signing in...</span>
              </div>
            ) : (
              <span className="text-sm font-semibold">Sign In</span>
            )}
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full mt-3 border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-medium text-sm transition-colors"
          >
            Skip for now
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-[#543826] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
