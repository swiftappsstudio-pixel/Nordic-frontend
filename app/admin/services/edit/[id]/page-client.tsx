"use client";

import { ServiceForm } from "@/app/_components/service-form";

interface Props {
  id: string;
}

export default function EditServicePage({ id }: Props) {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ServiceForm mode="edit" serviceId={id} />
    </div>
  );
}
