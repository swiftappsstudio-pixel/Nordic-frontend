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
  CategoryWithServices,
  ServiceWithVariants,
  Slot,
  BookingRequest,
  BookingResponse,
  DashboardStats,
  AddOn,
  GuestInfo,
  Banner,
  Address,
  AddressRequest,
} from "@/app/_common/interfaces";
import { authFetch } from "@/app/_common/auth-fetch";

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
  const res = await authFetch(`${API_BASE_URL}/users/change-password`, {
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
  const res = await authFetch(`${API_BASE_URL}/users/me`, {
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
    next: { revalidate: 60 },
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
    next: { revalidate: 60 },
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
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch service");

  const result = await res.json();

  // API returns data inside "data"
  return result.data ?? result;
}

// =========================================== Catalog API CALLS ===========================================//

export const getCategories = async (viewHomeOnly?: boolean): Promise<Category[]> => {
  const url = viewHomeOnly
    ? `${API_BASE_URL}/catalog/categories?viewHome=true`
    : `${API_BASE_URL}/catalog/categories`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
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
      next: { revalidate: 60 },
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
    next: { revalidate: 60 },
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

  const res = await authFetch(`${API_BASE_URL}/bookings`, {
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
  const res = await authFetch(`${API_BASE_URL}/bookings/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch bookings");

  const data = await res.json();
  return data.data;
};

export const lookupGuestBookings = async (phone: string): Promise<BookingResponse[]> => {
  const res = await fetch(`${API_BASE_URL}/bookings/guest?phone=${encodeURIComponent(phone)}`);

  if (!res.ok) throw new Error("Failed to lookup bookings");

  const data = await res.json();
  return data.data;
};

// =========================================== Admin Booking API CALLS ===========================================//

export const getAdminBookings = async (
  token: string,
): Promise<BookingResponse[]> => {
  const res = await authFetch(`${API_BASE_URL}/admin/bookings?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch bookings");
  }

  return result.data;
};

export const getAdminBookingsByDateRange = async (
  token: string,
  startDate: string,
  endDate: string,
): Promise<BookingResponse[]> => {
  const res = await authFetch(
    `${API_BASE_URL}/admin/bookings/calendar?startDate=${startDate}&endDate=${endDate}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch bookings by date range");
  }

  return result.data;
};

export const adminCreateBooking = async (
  token: string,
  data: BookingRequest & { guestInfo: GuestInfo },
): Promise<BookingResponse> => {
  const res = await authFetch(`${API_BASE_URL}/admin/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create booking");
  }

  return result.data;
};

export const adminRescheduleBooking = async (
  token: string,
  bookingId: string,
  preferredDate: string,
  preferredTime: string,
): Promise<BookingResponse> => {
  const res = await authFetch(`${API_BASE_URL}/admin/bookings/${bookingId}/reschedule`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ preferredDate, preferredTime }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to reschedule booking");
  }

  return result.data;
};

export const adminUpdateBookingStatus = async (
  token: string,
  bookingId: string,
  status: "confirmed" | "cancelled" | "completed",
): Promise<BookingResponse> => {
  const res = await authFetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update booking status");
  }

  return result.data;
};

export const adminDeleteBooking = async (token: string, bookingId: string): Promise<void> => {
  const res = await authFetch(`${API_BASE_URL}/admin/bookings/${bookingId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete booking");
  }
};

// =========================================== Add-on API CALLS ===========================================//

export const getAddOnsByService = async (serviceId: string): Promise<AddOn[]> => {
  const res = await fetch(`${API_BASE_URL}/addons/service/${serviceId}`, {
    next: { revalidate: 60 },
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
  const res = await authFetch(`${API_BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch dashboard stats");
  }

  return result.data;
};

// =========================================== Banner API CALLS ===========================================//

export const getBanners = async (): Promise<Banner[]> => {
  const res = await fetch(`${API_BASE_URL}/banners`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch banners");

  const data = await res.json();
  return data.data;
};

export const getCategoryByLink = async (link: string): Promise<CategoryWithServices[]> => {
  const res = await fetch(`${API_BASE_URL}/categories/link/${link}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch categories by link");

  const data = await res.json();
  return data.data;
};

// =========================================== Address API CALLS ===========================================//

// Backend error/404 pages come back as HTML, not JSON — res.json() would throw
// an opaque "Unexpected token '<'" in that case, so parse defensively here.
const parseJsonOrThrow = async (res: Response, fallbackMessage: string) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      res.ok
        ? fallbackMessage
        : `${fallbackMessage} (server returned ${res.status} ${res.statusText})`,
    );
  }
};

export const getMyAddresses = async (token: string): Promise<Address[]> => {
  const res = await authFetch(`${API_BASE_URL}/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const result = await parseJsonOrThrow(res, "Failed to fetch addresses");

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch addresses");
  }

  return result.data;
};

export const createAddress = async (
  data: AddressRequest,
  token: string,
): Promise<{ _id: string }> => {
  const res = await authFetch(`${API_BASE_URL}/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await parseJsonOrThrow(res, "Failed to save address");

  if (!res.ok) {
    throw new Error(result.message || "Failed to save address");
  }

  return result.data;
};

export const updateAddress = async (
  id: string,
  data: AddressRequest,
  token: string,
): Promise<Address> => {
  const res = await authFetch(`${API_BASE_URL}/addresses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await parseJsonOrThrow(res, "Failed to update address");

  if (!res.ok) {
    throw new Error(result.message || "Failed to update address");
  }

  return result.data;
};

export const deleteAddress = async (id: string, token: string): Promise<void> => {
  const res = await authFetch(`${API_BASE_URL}/addresses/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await parseJsonOrThrow(res, "Failed to delete address");

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete address");
  }
};

export const setDefaultAddress = async (id: string, token: string): Promise<Address> => {
  const res = await authFetch(`${API_BASE_URL}/addresses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isDefault: true }),
  });

  const result = await parseJsonOrThrow(res, "Failed to set default address");

  if (!res.ok) {
    throw new Error(result.message || "Failed to set default address");
  }

  return result.data;
};
