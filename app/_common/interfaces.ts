import React from "react";

// =================================== services INTERFACES=========================================//


export interface SubService {
  name: string;
  price: number;
  discountPercent?: number;
}

export interface Service {
  _id: string;             // use _id because backend returns this
  title: string;
  description?: string;
  actualPrice?: number;
  discountPrice?: number;
  category?: string;
  keyBenefits?: string[];
  keyIngredients?: string[];
  disclaimer?: string;
  images?: string[];
  subServices?: SubService[];
}

// =================================== services Card interfaces=========================================//

export interface ServiceCardProps {
  id: string;
  image?: string;
  blob?: string;
  title: string;
  price: number;
  actualPrice?: number;
  description?: string;
}
//sign-up form data interface
export interface FormData {
  phone: string;
  otp: string;
  email: string;
  name: string;
  referral: string;
  password: string;
  confirmPassword: string;
}

//sign-in form data interface
export interface SignInFormData {
  phone: string;
  password: string;
}

//forget-password form data interface
export interface ForgetPasswordFormData {
  phone: string;
  otp: string;
}

//vendor form data interface


export interface UnavailableDate {
  date: string; // YYYY-MM-DD format
  reason: string;
}



//get order  interface
export interface GenericButtonProps {
  color: string;
  title: string;
  disabled: boolean;
  onPress: () => void;
  roundedClass?: string;
  height?: string;
  isLoader?: boolean;
  textSize?: string;
  paddinhHorizontal?: string;
  paddingVertical?: string;
  marginTop?: string;
  marginInlineEnd?: string;
  marginBottom?: string;
  textColor?: string;
  icon?: React.ReactNode;
  loaderColor?: string;
  btnTextSize?: string;
  btnTextColor?: string;
}
// ============================================================================
// TABLE INTERFACES
// ============================================================================




// ============================================================================
// FILTER INTERFACES
// ============================================================================




// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

export interface UserNavBarProps {
  logoText?: string;
  navigationItems?: {
    label: string;
    href: string;
    hasDropdown?: boolean;
  }[];
  showAuthButtons?: boolean;
  showLocationSelector?: boolean;
  locationText?: string;
  className?: string;
}



export interface PopularServiceCardProps {
  image: string;
  title: string;
  description?: string;
  price?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export interface FooterProps {
  logoText?: string;
  tagline?: string;
  phoneNumber?: string;
  email?: string;
  location?: string;
  companyName?: string;
  currentYear?: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ============================================================================
// AUTHENTICATION INTERFACES
// ============================================================================

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface ResendOTPRequest {
  email: string;
}

export interface MessageResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface GenericInputFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  endButton?: React.ReactNode;
  disabled?: boolean;
  inputClassName?: string;
  wrapperClassName?: string;
  prefix?: string;
  error?: string;
  showError?: boolean;
  errorClassName?: string;
}

// ============================================================================
// PROFILE INTERFACES
// ============================================================================

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
}



// ============================================================================
// CATEGORY INTERFACES
// ============================================================================

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

// ============================================================================
// VARIANT INTERFACES
// ============================================================================

export interface Variant {
  _id: string;
  serviceId: string;
  name: string;
  description?: string;
  price: number;
  sessions: number;
  freeSessions: number;
  validityInDays: number;
  isActive: boolean;
  isDefault: boolean;
}

// ============================================================================
// SLOT INTERFACES
// ============================================================================

export interface Slot {
  _id: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  isActive: boolean;
}

// ============================================================================
// BOOKING INTERFACES
// ============================================================================

export interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
}

export interface BookingRequest {
  serviceId?: string;
  preferredDate?: string;
  preferredTime?: string;
  variantId?: string;
  slotId?: string;
  subServiceName?: string;
  addOnIds?: string[];
  guestInfo?: GuestInfo;
}

export interface AddOn {
  _id: string;
  serviceId: string;
  name: string;
  description?: string;
  price: number;
  isRequired: boolean;
  isActive: boolean;
  sortOrder?: number;
}

export interface CartItem {
  serviceId: string;
  title: string;
  image?: string;
  price: number;
}

export interface BookingResponse {
  _id: string;
  userId?: string;
  guestInfo?: GuestInfo;
  serviceSnapshot: {
    _id: string;
    title: string;
    description?: string;
    category?: string;
    images?: string[];
  };
  variantSnapshot?: {
    _id: string;
    name: string;
    price: number;
    sessions: number;
    freeSessions: number;
    validityInDays: number;
  } | null;
  subServiceSnapshot?: {
    name: string;
    price: number;
  } | null;
  addOnsSnapshot?: {
    addOnId: string;
    name: string;
    price: number;
  }[];
  slotId?: {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
  } | null;
  preferredDate?: string;
  preferredTime?: string;
  totalSessions: number;
  remainingSessions: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

export interface ServiceWithVariants extends Service {
  variants: Variant[];
}

// ============================================================================
// ADMIN DASHBOARD INTERFACES
// ============================================================================

export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  pendingPayments: number;
  totalRevenue: number;
  recentBookings: BookingResponse[];
}





// ============================================================================
// SERVICE INTERFACES
// ============================================================================



export interface EnhancedService {
  _id?: string;
  name: string;
  description: string;
  category_id?: {
    _id: string;
    name: string;
    description: string;
  };
  service_Icon?: string; // S3 URL for uploaded icon
  thumbnailUri?: string;
  imageUri?: string; // S3 URL for uploaded image
  min_time_required: number; // in minutes
  minAdvanceHours: number; //min advance time
  availability: string[]; // Array of days: ['Sun', 'Mon', 'Tue', etc.]
  job_service_type: "OnTime" | "Scheduled" | "Quotation";
  orderName?: string; // Required only if jobServiceType is 'Quotation'
  price_type?: "Units (30 Minutes)" | "1 Hour" | "1 Day" | "Fixed"; // Hidden if Quotation
  subservice_type?: "Single" | "Multiple"; // Hidden if Quotation
  basePrice?: number; // For non-quotation services
  unitType: "per_unit" | "per_hour";
  timeBasedPricing?: TimeBasedPricingTier[];
  isSubservice?: boolean;
  subServices?: SubService[];
  isActive: boolean;
  termsCondition?: string;
  badgeType?: "text" | "icon";
  badge?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ServiceFormData {
  name: string;
  description: string;
  basePrice: number;
  unitType: "per_unit" | "per_hour";
  imageUri?: string;
  isActive: boolean;
  isFeatured?: boolean;
}

export interface SubService {
  _id?: string;
  name: string;
  items: number;
  rate: number;
  max: number;
}

export interface TimeBasedPricingTier {
  hours: number;
  price: number;
}

export interface EnhancedServiceFormData {
  name: string;
  description: string;
  category: string;
  serviceType?: "residential" | "commercial";
  serviceIcon?: string;
  thumbnailUri?: string;
  minimumTimeRequired: number;
  minAdvanceHours: number;
  availability: string[];
  jobServiceType: "OnTime" | "Scheduled" | "Quotation";
  orderName?: string;
  priceType?: "30min" | "1hr" | "1day" | "fixed";
  subserviceType?: "Single" | "Multiple";
  basePrice?: number;
  unitType: "per_unit" | "per_hour";
  timeBasedPricing?: TimeBasedPricingTier[];
  isSubservice?: boolean;
  subServices?: SubService[];
  isActive: boolean;
  termsCondition?: string;
  badgeType?: "text" | "icon";
  badge?: string;
}




export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  basePrice?: number;
  unitType?: "per_unit" | "per_hour";
  imageUri?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateFeaturedServicesRequest {
  serviceIds: string[];
  isFeatured: boolean;
  featureIds: string[];
  unfeatureIds: string[];
}

export interface UpdateFeaturedServicesResponse {
  success: boolean;
  exception: string | null;
  description: string;
  content?: {
    updatedServices?: Service[];
    updatedIds?: string[];
  } | null;
}

export interface ServiceResponse {
  success: boolean;
  exception: string | null;
  description: string;
  content: {
    service: Service;
  };
}

export interface EnhancedServiceResponse {
  success: boolean;
  exception: string | null;
  description: string;
  content: {
    service: EnhancedService;
  };
}

export interface ServicesListResponse {
  success: boolean;
  exception: string | null;
  description: string;
  content: {
    services: {
      services: Service[];
    };
    total: number;
    page: number;
    limit: number;
  };
}

// ============================================================================
// UPLOAD INTERFACES
// ============================================================================

export interface UploadResponse {
  success: boolean;
  exception: string | null;
  description: string;
  content: {
    url: string;
    filename: string;
  };
}

// ============================================================================
// ROUTE PROTECTION INTERFACES
// ============================================================================

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

// Service Request Submission Interfaces
export interface SelectedSubService {
  name: string;
  items: number;
  rate: number;
  quantity: number;
}

export interface ServiceRequestSubmission {
  user_name: string;
  user_phone: string;
  user_email: string;
  address: string;
  service_id: string;
  service_name: string;
  category_id: string;
  category_name: string;
  request_type: "OnTime" | "Scheduled" | "Quotation";
  requested_date: string;
  message: string;
  number_of_units: number;
  payment_method?: string;
  selectedSubServices?: SelectedSubService[];
  unit_type?: "per_unit" | "per_hour";
  unit_price?: number;
  total_price?: number;
  time_based_hours?: number;
  time_based_price?: number;
}

