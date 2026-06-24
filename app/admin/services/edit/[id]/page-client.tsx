"use client";

import { ServiceWizard } from "@/app/_components/service-wizard";

interface Props {
  id: string;
}

export default function EditServicePage({ id }: Props) {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ServiceWizard serviceId={id} />
    </div>
  );
}
