"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  X,
  Plus,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useForm, useFieldArray, Controller, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/app/_common/auth-context";
import { authFetch } from "@/app/_common/auth-fetch";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

/* ================= TYPES ================= */

interface Category {
  _id: string;
  name: string;
}

const STEPS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "SEO" },
  { id: 3, label: "Variants" },
  { id: 4, label: "Add-ons" },
  { id: 5, label: "Publish" },
] as const;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* ================= ZOD SCHEMA ================= */

// HTML number inputs always return strings — model the form state as strings
// and validate by parsing on the fly.

const requiredNumber = (min: number, label = "Required") =>
  z
    .string()
    .min(1, label)
    .refine(
      (s) => !Number.isNaN(Number(s)) && Number(s) >= min,
      `Must be a number ≥ ${min}`
    );

const optionalNumber = (min: number) =>
  z
    .string()
    .optional()
    .refine(
      (s) => !s || (!Number.isNaN(Number(s)) && Number(s) >= min),
      `Must be a number ≥ ${min}`
    );

const variantSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  price: requiredNumber(0),
  sessions: optionalNumber(0),
  freeSessions: optionalNumber(0),
  validityInDays: requiredNumber(1, "Required (≥ 1)"),
  isDefault: z.boolean(),
});

const addonSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().optional(),
  price: requiredNumber(0),
  isRequired: z.boolean(),
});

const wizardSchema = z
  .object({
    // Step 1 — Basics
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().optional(),
    actualPrice: requiredNumber(0, "Actual price is required"),
    discountPrice: optionalNumber(0),
    category: z.string().min(1, "Category is required"),
    keyBenefits: z.string().optional(),
    keyIngredients: z.string().optional(),
    disclaimer: z.string().optional(),

    // Step 2 — SEO
    slug: z
      .string()
      .regex(/^[a-z0-9-]*$/, "Only lowercase letters, numbers, and hyphens")
      .optional(),
    metaTitle: z.string().max(70, "Should be 70 characters or fewer").optional(),
    metaDescription: z
      .string()
      .max(160, "Should be 160 characters or fewer")
      .optional(),
    metaKeywords: z.string().optional(),

    // Step 3 — Variants
    variants: z.array(variantSchema),

    // Step 4 — Add-ons
    addons: z.array(addonSchema),

    // Step 5 — Publish
    isActive: z.boolean(),
    isFeatured: z.boolean(),
  })
  .refine(
    (d) =>
      !d.discountPrice ||
      Number(d.discountPrice) < Number(d.actualPrice),
    {
      message: "Discount price must be lower than the actual price",
      path: ["discountPrice"],
    }
  )
  .refine(
    (d) => d.variants.filter((v) => v.isDefault).length <= 1,
    {
      message: "Only one variant can be marked as default",
      path: ["variants"],
    }
  );

type WizardForm = z.infer<typeof wizardSchema>;

// Fields to validate per step (passed to form.trigger)
const STEP_FIELDS: Record<number, FieldPath<WizardForm>[]> = {
  1: [
    "title",
    "description",
    "actualPrice",
    "discountPrice",
    "category",
    "keyBenefits",
    "keyIngredients",
    "disclaimer",
  ],
  2: ["slug", "metaTitle", "metaDescription", "metaKeywords"],
  3: ["variants"],
  4: ["addons"],
  5: ["isActive", "isFeatured"],
};

/* ================= COMPONENT ================= */

export function ServiceWizard() {
  const router = useRouter();
  const { token } = useAuth();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Image state (kept outside RHF — uploads are handled separately)
  const fileRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [slugTouched, setSlugTouched] = useState(false);

  const form = useForm<WizardForm>({
    resolver: zodResolver(wizardSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      actualPrice: "",
      discountPrice: "",
      category: "",
      keyBenefits: "",
      keyIngredients: "",
      disclaimer: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      variants: [],
      addons: [],
      isActive: true,
      isFeatured: false,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const variantArray = useFieldArray({ control, name: "variants" });
  const addonArray = useFieldArray({ control, name: "addons" });

  const watchedTitle = watch("title");
  const watchedCategory = watch("category");

  /* ================= LOAD CATEGORIES ================= */

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  // Keep slug auto-synced with title until the user edits the slug manually
  useEffect(() => {
    if (!slugTouched) {
      const parts = [watchedCategory, watchedTitle].filter(Boolean).map(slugify);
      setValue("slug", parts.join("-"));
    }
  }, [watchedTitle, watchedCategory, slugTouched, setValue]);

  /* ================= IMAGE HELPERS ================= */

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [
      ...prev,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadSingleFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await authFetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to upload image");
    }
    const data = await res.json();
    return data.url;
  };

  /* ================= STEP HANDLERS ================= */

  const saveStep1 = async (): Promise<string> => {
    const v = getValues();

    const uploadedUrls =
      images.length > 0
        ? await Promise.all(images.map((img) => uploadSingleFile(img)))
        : [];
    const allImageUrls = [...imageUrls, ...uploadedUrls];

    const body = {
      title: v.title,
      description: v.description,
      actualPrice: Number(v.actualPrice),
      discountPrice:
        v.discountPrice === "" || v.discountPrice === undefined
          ? undefined
          : Number(v.discountPrice),
      category: v.category,
      keyBenefits: v.keyBenefits
        ? v.keyBenefits.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      keyIngredients: v.keyIngredients
        ? v.keyIngredients.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      disclaimer: v.disclaimer,
      images: allImageUrls,
      isActive: false,
    };

    let id = serviceId;
    if (!id) {
      const res = await authFetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create service");
      id = data.data._id;
      setServiceId(id);
    } else {
      const res = await authFetch(`${API_BASE_URL}/services/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update service");
      }
    }

    setImageUrls(allImageUrls);
    setImages([]);
    setPreviews(allImageUrls);

    return id!;
  };

  const saveStep2 = async () => {
    if (!serviceId) throw new Error("Service has not been created yet");
    const v = getValues();

    const res = await authFetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: v.slug || undefined,
        metaTitle: v.metaTitle || undefined,
        metaDescription: v.metaDescription || undefined,
        metaKeywords: v.metaKeywords
          ? v.metaKeywords.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to save SEO");
    }
  };

  const saveStep3 = async () => {
    if (!serviceId) throw new Error("Service has not been created yet");
    const { variants } = getValues();

    for (const v of variants) {
      const res = await authFetch(`${API_BASE_URL}/admin/variants`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          name: v.name,
          price: Number(v.price),
          sessions: v.sessions ? Number(v.sessions) : undefined,
          freeSessions: Number(v.freeSessions || 0),
          validityInDays: Number(v.validityInDays),
          isDefault: v.isDefault,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to save variant "${v.name}"`);
      }
    }
    // Reset the field array so re-clicking Next doesn't double-post
    variantArray.replace([]);
  };

  const saveStep4 = async () => {
    if (!serviceId) throw new Error("Service has not been created yet");
    const { addons } = getValues();

    const addOnsPayload = addons.map((a) => ({
      name: a.name,
      description: a.description || undefined,
      price: Number(a.price),
      isRequired: a.isRequired,
    }));

    const res = await authFetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ addOns: addOnsPayload }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to save add-ons");
    }
    addonArray.replace([]);
  };

  const saveStep5 = async () => {
    if (!serviceId) throw new Error("Service has not been created yet");
    const { isActive, isFeatured } = getValues();

    const res = await authFetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive, isFeatured }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to publish");
    }
  };

  /* ================= NAVIGATION ================= */

  const handleNext = async () => {
    setSaveError(null);
    const valid = await trigger(STEP_FIELDS[currentStep]);
    if (!valid) return;

    setBusy(true);
    try {
      if (currentStep === 1) await saveStep1();
      else if (currentStep === 2) await saveStep2();
      else if (currentStep === 3) await saveStep3();
      else if (currentStep === 4) await saveStep4();
      setCurrentStep((s) => (s < 5 ? ((s + 1) as 1 | 2 | 3 | 4 | 5) : s));
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleBack = () => {
    setSaveError(null);
    if (currentStep > 1) setCurrentStep((s) => (s - 1) as 1 | 2 | 3 | 4 | 5);
  };

  const onPublishSubmit = handleSubmit(async () => {
    setSaveError(null);
    setBusy(true);
    try {
      await saveStep5();
      router.push("/admin/services");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  });

  const handleSaveDraftAndExit = async () => {
    setBusy(true);
    try {
      if (serviceId) {
        await authFetch(`${API_BASE_URL}/services/${serviceId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: false }),
        });
      }
      router.push("/admin/services");
    } catch {
      router.push("/admin/services");
    } finally {
      setBusy(false);
    }
  };

  /* ================= UI HELPERS ================= */

  // Field error message renderer
  const Err = ({ message }: { message?: string }) =>
    message ? (
      <p className="text-xs text-red-600 mt-1">{message}</p>
    ) : null;

  const inputClass = (hasErr: boolean) =>
    `w-full border ${
      hasErr ? "border-red-400" : "border-gray-300"
    } px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 ${
      hasErr ? "focus:ring-red-300" : "focus:ring-orange-500"
    }`;

  /* ================= RENDER ================= */

  return (
    <div className="max-w-5xl mx-auto">
      {/* ------------ Stepper header ------------ */}
      <div className="mb-8">
        <div className="flex items-center">
          {STEPS.map((step, i) => {
            const reached = currentStep >= step.id;
            const completed = currentStep > step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (step.id < currentStep) {
                      setSaveError(null);
                      setCurrentStep(step.id);
                    }
                  }}
                  disabled={step.id > currentStep}
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition flex-shrink-0 ${
                    completed
                      ? "bg-green-600 text-white"
                      : reached
                        ? "bg-[#543826] text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {completed ? <Check size={18} /> : step.id}
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                      currentStep > step.id ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="flex justify-between mt-3">
          {STEPS.map((step) => {
            const reached = currentStep >= step.id;
            return (
              <span
                key={step.id}
                className={`text-xs font-medium w-10 text-center ${
                  reached ? "text-[#543826]" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* ------------ Step card ------------ */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white shadow-md border border-gray-200 rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900">
          {STEPS[currentStep - 1].label}
        </h2>

        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
            {saveError}
          </div>
        )}

        {/* ============ STEP 1 — BASICS ============ */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                placeholder="e.g. Immunity Boost IV"
                className={inputClass(!!errors.title)}
              />
              <Err message={errors.title?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="What does this service do?"
                rows={3}
                className={inputClass(!!errors.description)}
              />
              <Err message={errors.description?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Price (AED) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("actualPrice")}
                  placeholder="539"
                  className={inputClass(!!errors.actualPrice)}
                />
                <Err message={errors.actualPrice?.message} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price (optional)
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("discountPrice")}
                  placeholder="lower than actual price"
                  className={inputClass(!!errors.discountPrice)}
                />
                <Err
                  message={
                    (errors.discountPrice as { message?: string })?.message
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category")}
                className={`${inputClass(!!errors.category)} bg-white`}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Err message={errors.category?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Benefits (comma separated)
              </label>
              <input
                {...register("keyBenefits")}
                placeholder="boosts immunity, increases hydration, fights fatigue"
                className={inputClass(!!errors.keyBenefits)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Ingredients (comma separated)
              </label>
              <input
                {...register("keyIngredients")}
                placeholder="vitamin C, zinc, magnesium"
                className={inputClass(!!errors.keyIngredients)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disclaimer
              </label>
              <textarea
                {...register("disclaimer")}
                rows={2}
                className={inputClass(!!errors.disclaimer)}
              />
            </div>

            {/* Image picker */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition"
            >
              <UploadCloud className="mx-auto text-orange-500" size={36} />
              <p className="text-gray-700 mt-2">Click to upload images</p>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={(e) =>
                  e.target.files && handleFiles(e.target.files)
                }
              />
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative rounded overflow-hidden border border-gray-200"
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-24 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============ STEP 2 — SEO ============ */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              These fields drive how the service appears in search engines and
              social previews.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <Controller
                control={control}
                name="slug"
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      setSlugTouched(true);
                      field.onChange(slugify(e.target.value));
                    }}
                    placeholder="e.g. immunity-boost-iv"
                    className={inputClass(!!errors.slug)}
                  />
                )}
              />
              <p className="text-xs text-gray-400 mt-1">
                Auto-generated from the title. Edit to override.
              </p>
              <Err message={errors.slug?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                {...register("metaTitle")}
                placeholder="Shown in browser tab + search results"
                className={inputClass(!!errors.metaTitle)}
              />
              <Err message={errors.metaTitle?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                {...register("metaDescription")}
                placeholder="Short blurb shown under the title in search results (~155 chars)"
                rows={3}
                className={inputClass(!!errors.metaDescription)}
              />
              <Err message={errors.metaDescription?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Keywords
              </label>
              <input
                {...register("metaKeywords")}
                placeholder="comma, separated, keywords"
                className={inputClass(!!errors.metaKeywords)}
              />
            </div>
          </div>
        )}

        {/* ============ STEP 3 — VARIANTS ============ */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Session packs (e.g. Pack of 3, Pack of 5). Skip if single-session.
              </p>
              <button
                type="button"
                onClick={() =>
                  variantArray.append({
                    name: "",
                    price: "",
                    sessions: "",
                    freeSessions: "",
                    validityInDays: "90",
                    isDefault: false,
                  })
                }
                className="flex items-center gap-1 text-sm bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-600 transition"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>

            {/* Array-level error (e.g. multiple defaults) */}
            {errors.variants?.root?.message && (
              <p className="text-sm text-red-600">
                {errors.variants.root.message}
              </p>
            )}

            {variantArray.fields.length === 0 && (
              <p className="text-center py-6 text-gray-400 text-sm">
                No variants yet — click <strong>Add Variant</strong> to create
                one.
              </p>
            )}

            {variantArray.fields.map((field, i) => {
              const e = errors.variants?.[i];
              return (
                <div
                  key={field.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <input
                        {...register(`variants.${i}.name`)}
                        placeholder='Name (e.g. "Buy Pack of 3 & Get 1 Free")'
                        className={inputClass(!!e?.name)}
                      />
                      <Err message={e?.name?.message} />
                    </div>
                    <button
                      type="button"
                      onClick={() => variantArray.remove(i)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <input
                        type="number"
                        {...register(`variants.${i}.price`)}
                        placeholder="Price"
                        className={inputClass(!!e?.price)}
                      />
                      <Err message={e?.price?.message} />
                    </div>
                    <div>
                      <input
                        type="number"
                        {...register(`variants.${i}.sessions`)}
                        min={0}
                        placeholder="Sessions"
                        className={inputClass(!!e?.sessions)}
                      />
                      <Err message={e?.sessions?.message} />
                    </div>
                    <div>
                      <input
                        type="number"
                        {...register(`variants.${i}.freeSessions`)}
                        min={0}
                        placeholder="Free Sessions"
                        className={inputClass(!!e?.freeSessions)}
                      />
                      <Err message={e?.freeSessions?.message} />
                    </div>
                    <div>
                      <input
                        type="number"
                        {...register(`variants.${i}.validityInDays`)}
                        placeholder="Validity (days)"
                        className={inputClass(!!e?.validityInDays)}
                      />
                      <Err message={e?.validityInDays?.message} />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      {...register(`variants.${i}.isDefault`)}
                    />
                    Mark as default variant
                  </label>
                </div>
              );
            })}
          </div>
        )}

        {/* ============ STEP 4 — ADD-ONS ============ */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Optional extras a customer can choose with this service (e.g.
                vitamin shot, premium oil).
              </p>
              <button
                type="button"
                onClick={() =>
                  addonArray.append({
                    name: "",
                    description: "",
                    price: "",
                    isRequired: false,
                  })
                }
                className="flex items-center gap-1 text-sm bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-600 transition"
              >
                <Plus size={16} /> Add Add-on
              </button>
            </div>

            {addonArray.fields.length === 0 && (
              <p className="text-center py-6 text-gray-400 text-sm">
                No add-ons yet — click <strong>Add Add-on</strong> to create
                one.
              </p>
            )}

            {addonArray.fields.map((field, i) => {
              const e = errors.addons?.[i];
              return (
                <div
                  key={field.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <input
                        {...register(`addons.${i}.name`)}
                        placeholder="Name (e.g. Vitamin C Boost)"
                        className={inputClass(!!e?.name)}
                      />
                      <Err message={e?.name?.message} />
                    </div>
                    <button
                      type="button"
                      onClick={() => addonArray.remove(i)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <textarea
                    {...register(`addons.${i}.description`)}
                    placeholder="Short description (optional)"
                    rows={2}
                    className={inputClass(false)}
                  />

                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div>
                      <input
                        type="number"
                        {...register(`addons.${i}.price`)}
                        placeholder="Price (AED)"
                        className={inputClass(!!e?.price)}
                      />
                      <Err message={e?.price?.message} />
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============ STEP 5 — PUBLISH ============ */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Almost done. Choose whether the service is live and whether it
              should appear in the featured slider.
            </p>

            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition">
              <input
                type="checkbox"
                {...register("isActive")}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-gray-900">Active</p>
                <p className="text-sm text-gray-500">
                  Visible to customers and bookable. Uncheck to save as a draft.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition">
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-gray-900">Featured</p>
                <p className="text-sm text-gray-500">
                  Highlight on the home page hero / featured slider.
                </p>
              </div>
            </label>
          </div>
        )}
      </form>

      {/* ------------ Footer nav ------------ */}
      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1 || busy}
          className="flex items-center gap-1 px-4 py-2 text-gray-600 disabled:opacity-40 hover:text-gray-900 transition"
        >
          <ChevronLeft size={18} /> Back
        </button>

        <div className="flex items-center gap-3">
          {serviceId && currentStep < 5 && (
            <button
              type="button"
              onClick={handleSaveDraftAndExit}
              disabled={busy}
              className="text-sm text-gray-500 hover:text-gray-800 transition"
            >
              Save draft & exit
            </button>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={busy}
              className="flex items-center gap-1 px-6 py-2.5 bg-[#543826] text-white rounded-lg font-medium hover:bg-[#3e2a1c] disabled:opacity-60 transition"
            >
              {busy ? "Saving..." : "Next"} <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onPublishSubmit}
              disabled={busy}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-60 transition"
            >
              {busy ? "Publishing..." : "Publish & Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
