import { ServiceForm } from "@/app/_components/service-form";
export default function AddServicePage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ServiceForm mode="add" />
    </div>
  );
}
