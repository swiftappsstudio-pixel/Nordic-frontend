// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { UploadCloud, X } from "lucide-react";

// interface Category {
//   _id: string;
//   name: string;
// }

// interface ServiceFormProps {
//   mode: "add" | "edit";
//   serviceId?: string;
// }

// export function ServiceForm({ mode, serviceId }: ServiceFormProps) {
//   const router = useRouter();
//   const isEdit = mode === "edit";
//   const fileRef = useRef<HTMLInputElement>(null);

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [images, setImages] = useState<File[]>([]);
//   const [previews, setPreviews] = useState<string[]>([]);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     actualPrice: "",
//     discountPrice: "",
//     category: "",
//     keyBenefits: "",
//     keyIngredients: "",
//     disclaimer: "",
//   });

//   /* ================= LOAD DATA ================= */

//   const loadCategories = async () => {
//     const res = await fetch("http://localhost:3100/api/categories");
//     const data = await res.json();
//     setCategories(data.data || []);
//   };

//   const loadService = async () => {
//     if (!isEdit || !serviceId) return;

//     const res = await fetch(
//       `http://localhost:3100/api/services/${serviceId}`
//     );
//     const data = await res.json();
//     const s = data.data;

//     setForm({
//       title: s.title || "",
//       description: s.description || "",
//       actualPrice: s.actualPrice?.toString() || "",
//       discountPrice: s.discountPrice?.toString() || "",
//       category: s.category || "",
//       keyBenefits: s.keyBenefits?.join(", ") || "",
//       keyIngredients: s.keyIngredients?.join(", ") || "",
//       disclaimer: s.disclaimer || "",
//     });

//     // Existing images (edit mode)
//     if (s.images?.length) {
//       setPreviews(s.images);
//     }
//   };

//   useEffect(() => {
//     loadCategories();
//     loadService();
//   }, []);

//   /* ================= HANDLERS ================= */

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFiles = (files: FileList) => {
//     const newFiles = Array.from(files);
//     setImages((prev) => [...prev, ...newFiles]);

//     const newPreviews = newFiles.map((file) =>
//       URL.createObjectURL(file)
//     );
//     setPreviews((prev) => [...prev, ...newPreviews]);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     handleFiles(e.dataTransfer.files);
//   };

//   const removeImage = (index: number) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//     setPreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("title", form.title);
//       formData.append("description", form.description);
//       formData.append("actualPrice", form.actualPrice);
//       formData.append("discountPrice", form.discountPrice);
//       formData.append("category", form.category);
//       formData.append("keyBenefits", form.keyBenefits);
//       formData.append("keyIngredients", form.keyIngredients);
//       formData.append("disclaimer", form.disclaimer);

//       images.forEach((img) => formData.append("images", img));

//       const url =
//         mode === "add"
//           ? "http://localhost:3100/api/services"
//           : `http://localhost:3100/api/services/${serviceId}`;

//       const method = mode === "add" ? "POST" : "PUT";

//       const res = await fetch(url, {
//         method,
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Failed");

//       router.push("/admin/services");
//     } catch (err) {
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-5xl mx-auto bg-gray-100 border rounded-2xl p-8  space-y-6"
//     >
//       <h2 className="text-3xl font-bold text-gray-800">
//         {isEdit ? "Edit Service" : "Add New Service"}
//       </h2>

//       <input
//         name="title"
//         value={form.title}
//         onChange={handleChange}
//         placeholder="Service Title"
//         className="w-full border px-4 py-3 text-gray-800 rounded-lg"
//         required
//       />

//       <textarea
//         name="description"
//         value={form.description}
//         onChange={handleChange}
//         placeholder="Description"
//         className="w-full border px-4 text-gray-800 py-3 rounded-lg"
//       />

//       <div className="grid grid-cols-2 gap-4">
//         <input
//           type="number"
//           name="actualPrice"
//           value={form.actualPrice}
//           onChange={handleChange}
//           placeholder="Actual Price"
//           className="border px-4 py-3 text-gray-800 rounded-lg"
//         />
//         <input
//           type="number"
//           name="discountPrice"
//           value={form.discountPrice}
//           onChange={handleChange}
//           placeholder="Discount Price"
//           className="border px-4 py-3 text-gray-800 rounded-lg"
//         />
//       </div>

//       <select
//         name="category"
//         value={form.category}
//         onChange={handleChange}
//         className="w-full border px-4 py-3 text-gray-800 rounded-lg"
//       >
//         <option value="">Select Category</option>
//         {categories.map((c) => (
//           <option key={c._id} value={c.name}>
//             {c.name}
//           </option>
//         ))}
//       </select>

//       <input
//         name="keyBenefits"
//         value={form.keyBenefits}
//         onChange={handleChange}
//         placeholder="Key Benefits (comma separated)"
//         className="w-full border px-4 text-gray-800 py-3 rounded-lg"
//       />

//       <input
//         name="keyIngredients"
//         value={form.keyIngredients}
//         onChange={handleChange}
//         placeholder="Key Ingredients (comma separated)"
//         className="w-full border px-4 text-gray-800 py-3 rounded-lg"
//       />

//       <textarea
//         name="disclaimer"
//         value={form.disclaimer}
//         onChange={handleChange}
//         placeholder="Disclaimer"
//         className="w-full border px-4 text-gray-800 py-3 rounded-lg"
//       />

//       {/* ================= IMAGE UPLOAD ================= */}
//       <div
//         onDrop={handleDrop}
//         onDragOver={(e) => e.preventDefault()}
//         onClick={() => fileRef.current?.click()}
//         className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 transition"
//       >
//         <UploadCloud className="mx-auto text-orange-500" size={40} />
//         <p className="mt-2 font-medium text-gray-700">
//           Drag & drop images or click to upload
//         </p>
//         <input
//           ref={fileRef}
//           type="file"
//           multiple
//           accept="image/*"
//           hidden
//           onChange={(e) =>
//             e.target.files && handleFiles(e.target.files)
//           }
//         />
//       </div>

//       {previews.length > 0 && (
//         <div className="grid grid-cols-4 gap-4">
//           {previews.map((src, i) => (
//             <div
//               key={i}
//               className="relative border rounded-xl overflow-hidden"
//             >
//               <img
//                 src={src}
//                 className="w-full h-28 object-cover"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeImage(i)}
//                 className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
//               >
//                 <X size={14} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       <button
//         type="submit"
//         disabled={loading}
//         className={`w-full py-3 rounded-xl text-white font-semibold ${
//           isEdit
//             ? "bg-green-600 hover:bg-green-700"
//             : "bg-orange-500 hover:bg-orange-600"
//         }`}
//       >
//         {loading
//           ? isEdit
//             ? "Updating..."
//             : "Creating..."
//           : isEdit
//           ? "Update Service"
//           : "Create Service"}
//       </button>
//     </form>
//   );
// }
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/app/_common/auth-context";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface Category {
  _id: string;
  name: string;
}

interface SubServiceResponse {
  name: string;
  price: number;
}

interface SubService {
  name: string;
  price: string;
}

interface ServiceAddOnResponse {
  name: string;
  description?: string;
  price: number;
  isRequired?: boolean;
}

interface ServiceAddOnForm {
  name: string;
  description: string;
  price: string;
  isRequired: boolean;
}

interface ServiceFormProps {
  mode: "add" | "edit";
  serviceId?: string;
}

export function ServiceForm({ mode, serviceId }: ServiceFormProps) {
  const router = useRouter();
  const { token } = useAuth();
  const isEdit = mode === "edit";
  const fileRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [addOns, setAddOns] = useState<ServiceAddOnForm[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    actualPrice: "",
    category: "",
    keyBenefits: "",
    keyIngredients: "",
    disclaimer: "",
  });

  /* ================= LOAD DATA ================= */

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const loadService = async () => {
    if (!isEdit || !serviceId) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/services/${serviceId}`
      );
      const data = await res.json();
      const s = data.data;

      setForm({
        title: s.title || "",
        description: s.description || "",
        actualPrice: s.actualPrice?.toString() || "",
        category: s.category || "",
        keyBenefits: s.keyBenefits?.join(", ") || "",
        keyIngredients: s.keyIngredients?.join(", ") || "",
        disclaimer: s.disclaimer || "",
      });

      if (s.subServices?.length) {
        setSubServices(
          (s.subServices as SubServiceResponse[]).map((ss) => ({
            name: ss.name,
            price: ss.price.toString(),
          }))
        );
      }

      if (s.addOns?.length) {
        setAddOns(
          (s.addOns as ServiceAddOnResponse[]).map((a) => ({
            name: a.name,
            description: a.description || "",
            price: a.price.toString(),
            isRequired: a.isRequired || false,
          }))
        );
      }

      if (s.images?.length) {
        setExistingImages(s.images);
        setPreviews(s.images);
      }
    } catch (err) {
      console.error("Failed to load service", err);
    }
  };

  useEffect(() => {
    loadCategories();
    loadService();
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const removedPreview = previews[index];
    setPreviews((prev) => prev.filter((_, i) => i !== index));

    if (existingImages.includes(removedPreview)) {
      setExistingImages((prev) => prev.filter((url) => url !== removedPreview));
    } else {
      const newFileIndex = index - existingImages.length;
      setImages((prev) => prev.filter((_, i) => i !== newFileIndex));
    }
  };

  /* ================= SUB SERVICES ================= */

  const addSubService = () => {
    setSubServices([...subServices, { name: "", price: "" }]);
  };

  const updateSubService = (
    index: number,
    field: keyof SubService,
    value: string
  ) => {
    const updated = [...subServices];
    updated[index][field] = value;
    setSubServices(updated);
  };

  const removeSubService = (index: number) => {
    setSubServices(subServices.filter((_, i) => i !== index));
  };

  /* ================= ADD ONS ================= */

  const addAddOn = () => {
    setAddOns([...addOns, { name: "", description: "", price: "", isRequired: false }]);
  };

  const updateAddOn = (
    index: number,
    field: keyof ServiceAddOnForm,
    value: string | boolean
  ) => {
    const updated = [...addOns];
    (updated[index] as any)[field] = value;
    setAddOns(updated);
  };

  const removeAddOn = (index: number) => {
    setAddOns(addOns.filter((_, i) => i !== index));
  };

  /* ================= UPLOAD HELPER ================= */

  const uploadSingleFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to upload image");
    }

    const data = await res.json();
    return data.url;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Upload new images individually to get Cloudinary URLs
      const uploadedUrls = await Promise.all(
        images.map((img) => uploadSingleFile(img))
      );

      // Step 2: Combine existing image URLs with newly uploaded URLs
      const allImageUrls = [...existingImages, ...uploadedUrls];

      // Step 3: Send service data as JSON (no file blobs)
      const url =
        mode === "add"
          ? `${API_BASE_URL}/services`
          : `${API_BASE_URL}/services/${serviceId}`;

      const method = mode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          actualPrice: form.actualPrice,
          category: form.category,
          keyBenefits: form.keyBenefits,
          keyIngredients: form.keyIngredients,
          disclaimer: form.disclaimer,
          subServices: subServices.filter((s) => s.name && s.price),
          addOns: addOns.filter((a) => a.name && a.price).map((a) => ({
            name: a.name,
            description: a.description || undefined,
            price: Number(a.price),
            isRequired: a.isRequired,
          })),
          images: allImageUrls,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      router.push("/admin/services");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto bg-white shadow-lg border border-gray-200 rounded-2xl p-8 space-y-6"
    >
      <h2 className="text-3xl font-bold text-gray-900">
        {isEdit ? "Edit Service" : "Add New Service"}
      </h2>

      {/* TITLE */}
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Service Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Service Title"
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* BASE PRICE */}
      <div className="space-y-1">
        <label htmlFor="actualPrice" className="block text-sm font-medium text-gray-700">Base Price</label>
        <input
          id="actualPrice"
          type="number"
          name="actualPrice"
          value={form.actualPrice}
          onChange={handleChange}
          placeholder="Base Price"
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* CATEGORY */}
      <div className="space-y-1">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* KEY BENEFITS */}
      <div className="space-y-1">
        <label htmlFor="keyBenefits" className="block text-sm font-medium text-gray-700">Key Benefits (comma separated)</label>
        <input
          id="keyBenefits"
          name="keyBenefits"
          value={form.keyBenefits}
          onChange={handleChange}
          placeholder="Key Benefits (comma separated)"
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* KEY INGREDIENTS */}
      <div className="space-y-1">
        <label htmlFor="keyIngredients" className="block text-sm font-medium text-gray-700">Key Ingredients (comma separated)</label>
        <input
          id="keyIngredients"
          name="keyIngredients"
          value={form.keyIngredients}
          onChange={handleChange}
          placeholder="Key Ingredients (comma separated)"
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* DISCLAIMER */}
      <div className="space-y-1">
        <label htmlFor="disclaimer" className="block text-sm font-medium text-gray-700">Disclaimer</label>
        <textarea
          id="disclaimer"
          name="disclaimer"
          value={form.disclaimer}
          onChange={handleChange}
          placeholder="Disclaimer"
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* ================= SUB SERVICES ================= */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Sub Services / Bundles
          </h3>
          <button
            type="button"
            onClick={addSubService}
            className="flex items-center gap-1 text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {subServices.map((ss, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-3 items-center"
          >
            <div className="col-span-3 space-y-1">
              <label className="block text-xs font-medium text-gray-600">Bundle Name</label>
              <input
                value={ss.name}
                onChange={(e) =>
                  updateSubService(index, "name", e.target.value)
                }
                placeholder="Bundle name (Buy 3 Get 1)"
                className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Price</label>
              <input
                type="number"
                value={ss.price}
                onChange={(e) =>
                  updateSubService(index, "price", e.target.value)
                }
                placeholder="Price"
                className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="button"
              onClick={() => removeSubService(index)}
              className="text-red-600 hover:text-red-800 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* ================= ADD ONS ================= */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Add-ons
          </h3>
          <button
            type="button"
            onClick={addAddOn}
            className="flex items-center gap-1 text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {addOns.map((ao, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-medium text-gray-600">Add-on Name</label>
                <input
                  value={ao.name}
                  onChange={(e) => updateAddOn(index, "name", e.target.value)}
                  placeholder="Add-on name (e.g. Vitamin C Boost)"
                  className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="button"
                onClick={() => removeAddOn(index)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">Description</label>
              <textarea
                value={ao.description}
                onChange={(e) => updateAddOn(index, "description", e.target.value)}
                placeholder="Short description (optional)"
                rows={2}
                className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 items-center">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">Price (AED)</label>
                <input
                  type="number"
                  value={ao.price}
                  onChange={(e) => updateAddOn(index, "price", e.target.value)}
                  placeholder="Price"
                  className="w-full border border-gray-300 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
            </div>
          </div>
        ))}
      </div>

      {/* ================= IMAGES ================= */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition"
      >
        <UploadCloud className="mx-auto text-orange-500" size={36} />
        <p className="text-gray-700 mt-2">Click or drag images</p>
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {previews.map((src, i) => (
            <div key={i} className="relative rounded overflow-hidden">
              <img src={src} className="h-24 w-full object-cover rounded" />
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

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl text-white font-semibold ${
          isEdit ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"
        } transition`}
      >
        {loading ? "Saving..." : isEdit ? "Update Service" : "Create Service"}
      </button>
    </form>
  );
}
