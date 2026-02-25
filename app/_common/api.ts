// api.ts

const API_BASE_URL = "http://localhost:3100/api";
import { Service } from "@/app/_common/interfaces";


// =========================================== getallservices  API CALLS ===========================================//

export const getServices = async (): Promise<Service[]> => {
  const res = await fetch("http://localhost:3100/api/services", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  const data = await res.json();

  // Return array of services (adapt to your API)
  return data.data; // <- This should match your actual API structure
};

// =========================================== single service   API CALLS ===========================================//

export async function getService(id: string): Promise<Service> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100";
  const res = await fetch(`${baseUrl}/api/services/${id}`, { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to fetch service");

  const result = await res.json();
  console.log("Fetched Service:", result);

  // API returns data inside "data"
  return result.data ?? result;
}