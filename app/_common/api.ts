// api.ts

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
import {
  Service,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOTPRequest,
  ResendOTPRequest,
  MessageResponse,
} from "@/app/_common/interfaces";

// =========================================== Auth API CALLS ===========================================//

export const registerUser = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const res = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

export const verifyOTP = async (
  data: VerifyOTPRequest,
): Promise<MessageResponse> => {
  const res = await fetch(`${API_BASE_URL}/users/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "OTP verification failed");
  }

  return result;
};

export const resendOTP = async (
  data: ResendOTPRequest,
): Promise<MessageResponse> => {
  const res = await fetch(`${API_BASE_URL}/users/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to resend OTP");
  }

  return result;
};

export const getUserProfile = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json();
};

// =========================================== getallservices  API CALLS ===========================================//

export const getServices = async (): Promise<Service[]> => {
  const res = await fetch(`${API_BASE_URL}/services`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  const data = await res.json();

  // Return array of services (adapt to your API)
  return data.data; // <- This should match your actual API structure
};

// =========================================== single service   API CALLS ===========================================//

export async function getService(id: string): Promise<Service> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100";
  const res = await fetch(`${baseUrl}/api/services/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch service");

  const result = await res.json();
  console.log("Fetched Service:", result);

  // API returns data inside "data"
  return result.data ?? result;
}
