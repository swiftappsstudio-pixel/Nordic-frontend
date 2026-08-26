import { getServices } from "@/app/_common/api";
import { Service } from "@/app/_common/interfaces";
import ServiceCard from "@/app/_components/service-card";

export default async function ServicesPage() {
  const services = await getServices().catch(() => [] as Service[]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#543826] mb-2">Services</h1>
        <p className="text-gray-500 mb-8">Browse all our services and book the one that fits your needs</p>

        {services.length === 0 ? (
          <p className="text-gray-500">No services available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                id={service._id}
                image={service.images?.[0]}
                title={service.title}
                price={service.discountPrice ?? service.actualPrice ?? 0}
                actualPrice={service.actualPrice}
                description={service.description}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
