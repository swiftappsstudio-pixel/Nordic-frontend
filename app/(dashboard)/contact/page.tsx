"use client";

import React, { useState } from "react";
import { PrimaryButton } from "@/app/_components/generic-button";
import { GenericInputField } from "@/app/_components/generic-inputfield";

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

  // ✅ FIXED: handleChange OUTSIDE
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
    // submit logic here
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-8 my-28">
        <h2 className="text-3xl font-bold mb-6 text-center bg-primary text-white">
          Contact Us
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <GenericInputField
            label="First Name"
            value={form.firstName}
            onChange={(val) => handleChange("firstName", val)}
            error={errors.firstName}
            showError={!!errors.firstName}
          />

          <GenericInputField
            label="Last Name"
            value={form.lastName}
            onChange={(val) => handleChange("lastName", val)}
            error={errors.lastName}
            showError={!!errors.lastName}
          />

          <GenericInputField
            label="Email"
            value={form.email}
            onChange={(val) => handleChange("email", val)}
            error={errors.email}
            showError={!!errors.email}
            type="email"
          />

          <GenericInputField
            label="Phone"
            value={form.phone}
            onChange={(val) => handleChange("phone", val)}
            error={errors.phone}
            showError={!!errors.phone}
          />

          <GenericInputField
            label="Subject"
            value={form.subject}
            onChange={(val) => handleChange("subject", val)}
            error={errors.subject}
            showError={!!errors.subject}
          />

          <GenericInputField
            label="Message"
            value={form.message}
            onChange={(val) => handleChange("message", val)}
            error={errors.message}
            showError={!!errors.message}
          />

          <PrimaryButton
            title={isLoading ? "Sending..." : "Send Message"}
            color="bg-primary"
            height="h-12"
            roundedClass="rounded-md"
            disabled={isLoading}
            onPress={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
}
