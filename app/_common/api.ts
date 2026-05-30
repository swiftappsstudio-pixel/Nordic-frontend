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
  Category,
  ServiceWithVariants,
  Slot,
  BookingRequest,
  BookingResponse,
  DashboardStats,
  AddOn,
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

// =========================================== Password API CALLS ===========================================//

export const forgotPassword = async (
  email: string,
): Promise<MessageResponse> => {
  const res = await fetch(`${API_BASE_URL}/users/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to send reset OTP");
  }

  return result;
};

export const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<MessageResponse> => {
  const res = await fetch(`${API_BASE_URL}/users/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Password reset failed");
  }

  return result;
};

export const changePassword = async (
  data: { currentPassword: string; newPassword: string },
  token: string,
): Promise<MessageResponse> => {
  const res = await fetch(`${API_BASE_URL}/users/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Password change failed");
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

// =========================================== featured services API CALLS ===========================================//

export const getFeaturedServices = async (): Promise<Service[]> => {
  const res = await fetch(`${API_BASE_URL}/services/featured`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch featured services");
  }

  const data = await res.json();
  return data.data;
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

// =========================================== Catalog API CALLS ===========================================//

export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${API_BASE_URL}/catalog/categories`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch categories");

  const data = await res.json();
  return data.data;
};

export const getServicesByCategory = async (
  categoryId: string,
): Promise<Service[]> => {
  const res = await fetch(
    `${API_BASE_URL}/catalog/categories/${categoryId}/services`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch services for category");

  const data = await res.json();
  return data.data;
};

export const getServiceDetail = async (
  id: string,
): Promise<ServiceWithVariants> => {
  const res = await fetch(`${API_BASE_URL}/catalog/services/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch service detail");

  const data = await res.json();
  return data.data;
};

// =========================================== Slots API CALLS ===========================================//

export const getAvailableSlots = async (
  serviceId: string,
  date: string,
): Promise<Slot[]> => {
  const res = await fetch(
    `${API_BASE_URL}/slots/service/${serviceId}?date=${date}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch available slots");

  const data = await res.json();
  return data.data;
};

// =========================================== Booking API CALLS ===========================================//

export const createBooking = async (
  data: BookingRequest,
  token?: string,
): Promise<BookingResponse> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Booking failed");

  return result.data;
};

export const getMyBookings = async (
  token: string,
): Promise<BookingResponse[]> => {
  const res = await fetch(`${API_BASE_URL}/bookings/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch bookings");

  const data = await res.json();
  return data.data;
};

// =========================================== Admin Booking API CALLS ===========================================//

export const getAdminBookings = async (
  token: string,
): Promise<BookingResponse[]> => {
  const res = await fetch(`${API_BASE_URL}/admin/bookings?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch bookings");
  }

  // Admin endpoint responds with { success, data, pagination }
  return result.data;
};

// =========================================== Add-on API CALLS ===========================================//

export const getAddOnsByService = async (serviceId: string): Promise<AddOn[]> => {
  const res = await fetch(`${API_BASE_URL}/addons/service/${serviceId}`, {
    cache: "no-store",
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch add-ons");
  }
  return result.data;
};

export const getAdminDashboardStats = async (
  token: string,
): Promise<DashboardStats> => {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch dashboard stats");
  }

  return result.data;
};
