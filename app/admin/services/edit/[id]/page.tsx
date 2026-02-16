"use client";
import { useParams } from "next/navigation";
import { ServiceForm } from "@/app/_components/service-form";

export default function EditServicePage() {
  const params = useParams();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ServiceForm mode="edit" serviceId={params.id as string} />
    </div>
  );
}
