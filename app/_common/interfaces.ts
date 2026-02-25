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
  height?: number;

  isLoader?: boolean;
  textSize?: number;
  paddinhHorizontal?: number;
  paddingVertical?: number;
  marginTop?: number;
  marginInlineEnd?: number;
  marginBottom?: number;
  textColor?: string;
  icon?: React.ReactNode;
  loaderColor?: string;
  btnTextSize?: number;
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

export interface User {
  id: string;
  email: string;
  role: number;
  name: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: number;
}

export interface RegisterResponse {
  success: boolean;
  exception: string | null;
  description: string;
  content: {
    access_token: string;
    user: User;
  };
}

export interface LoginRequest {
  phoneNumber?: string;
  email?: string;
  password: string;
  role: number;
}

export interface LoginResponse {
  success: boolean;
  exception: string | null;
  description: string;
  content: {
    access_token: string;
    user: User;
  };
}

// ============================================================================
// PROFILE INTERFACES
// ============================================================================

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: number;
  isActive: boolean;
  isOTPVerified: boolean;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Additional fields for UI
  address?: string;
  dateOfBirth?: string;
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    smsUpdates: boolean;
  };
}

export interface GetProfileResponse {
  success: boolean;
  exception: string | null;
  description: string;
  content: {
    user: UserProfile;
  };
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  profilePic?: string;
  preferences?: {
    notifications?: boolean;
    emailUpdates?: boolean;
    smsUpdates?: boolean;
  };
}



// ============================================================================
// CATEGORY INTERFACES
// ============================================================================





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

