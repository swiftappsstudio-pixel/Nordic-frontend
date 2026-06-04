"use client";

import React, { useState } from "react";
import { GenericInputField } from "@/app/_components/generic-inputfield";
import { PrimaryButton } from "@/app/_components/generic-button";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactUsPage() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: keyof typeof initialState,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F7EEE0] pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-brand text-4xl md:text-5xl font-semibold text-[#543826] text-center mb-3">
          Contact Us
        </h1>
        <p className="font-brand text-lg text-[#543826]/50 text-center mb-12">
          We&apos;d love to hear from you. Reach out and we&apos;ll get back to you shortly.
        </p>

        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-3 bg-white rounded-2xl shadow-md p-8">
            <h3 className="font-brand text-xl font-semibold text-[#543826] mb-6">
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-0">
              <div className="grid md:grid-cols-2 gap-x-6">
                <GenericInputField
                  label="First Name"
                  value={form.firstName}
                  onChange={(val) => handleChange("firstName", val)}
                  error={errors.firstName}
                  showError={!!errors.firstName}
                  wrapperClassName="mb-5"
                  inputClassName="!border-gray-200 !rounded-xl focus:!ring-[#543826]/20 focus:!border-[#543826]"
                />
                <GenericInputField
                  label="Last Name"
                  value={form.lastName}
                  onChange={(val) => handleChange("lastName", val)}
                  error={errors.lastName}
                  showError={!!errors.lastName}
                  wrapperClassName="mb-5"
                  inputClassName="!border-gray-200 !rounded-xl focus:!ring-[#543826]/20 focus:!border-[#543826]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-x-6">
                <GenericInputField
                  label="Email"
                  value={form.email}
                  onChange={(val) => handleChange("email", val)}
                  error={errors.email}
                  showError={!!errors.email}
                  type="email"
                  wrapperClassName="mb-5"
                  inputClassName="!border-gray-200 !rounded-xl focus:!ring-[#543826]/20 focus:!border-[#543826]"
                />
                <GenericInputField
                  label="Phone"
                  value={form.phone}
                  onChange={(val) => handleChange("phone", val)}
                  error={errors.phone}
                  showError={!!errors.phone}
                  wrapperClassName="mb-5"
                  inputClassName="!border-gray-200 !rounded-xl focus:!ring-[#543826]/20 focus:!border-[#543826]"
                />
              </div>

              <GenericInputField
                label="Subject"
                value={form.subject}
                onChange={(val) => handleChange("subject", val)}
                error={errors.subject}
                showError={!!errors.subject}
                wrapperClassName="mb-5"
                inputClassName="!border-gray-200 !rounded-xl focus:!ring-[#543826]/20 focus:!border-[#543826]"
              />

              <div className="mb-4">
                <label className="mb-1 text-sm font-medium text-gray-700 block">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.message
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:ring-[#543826]/20 focus:border-[#543826]"
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-[#543826] hover:bg-[#3e2a1c] text-white font-brand font-semibold py-4 rounded-xl text-lg transition disabled:bg-gray-400"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#543826] text-white rounded-2xl p-8">
              <h4 className="font-brand text-lg font-semibold mb-6">Get in touch</h4>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-brand text-sm text-white/60">Phone</p>
                    <p className="font-brand font-semibold">+971-800-DARDOCTOR</p>
                    <p className="font-brand text-xs text-white/50">Toll-Free</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-brand text-sm text-white/60">Email</p>
                    <p className="font-brand font-semibold">wecare@nordic.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-brand text-sm text-white/60">Dubai</p>
                    <p className="font-brand text-sm">701-13, Opal Tower, Business Bay</p>
                    <p className="font-brand text-sm text-white/60 mt-2">Abu Dhabi</p>
                    <p className="font-brand text-sm">Al Khatem Tower, Al Maryah Island</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8">
              <h4 className="font-brand text-lg font-semibold text-[#543826] mb-4">
                Quick WhatsApp
              </h4>
              <p className="font-brand text-sm text-[#543826]/50 mb-4">
                Need immediate help? Chat with us directly on WhatsApp.
              </p>
              <a
                href="https://wa.me/971555828945?text=Hello! I need help with a service."
                target="_blank"
                className="inline-flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1eb954] text-white font-brand font-semibold py-3.5 rounded-xl transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.79.227 1.496.194 2.068.119.632-.116 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.524-5.274c0-5.49 4.497-9.986 9.996-9.986 2.654 0 5.145 1.035 7.081 2.922a9.827 9.827 0 012.922 7.064c-.003 5.49-4.497 9.984-9.984 9.984m8.526-18.51C18.024 1.25 15.19 0 12.051 0 5.463 0 .095 5.368.095 11.958c0 2.104.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.584 0 11.955-5.368 11.955-11.958 0-3.176-1.24-6.165-3.495-8.511"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}