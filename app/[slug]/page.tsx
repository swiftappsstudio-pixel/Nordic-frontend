import { notFound } from "next/navigation";
import { getCategories, getServicesByCategory } from "@/app/_common/api";
import CategoryPageClient from "./category-page-client";

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const categories = await getCategories();
  const category = categories.find(
    (c) => c.link?.replace(/^\/+/, "") === slug
  );

  if (!category) return notFound();

  const services = await getServicesByCategory(category._id);

  return <CategoryPageClient category={category} services={services} />;
}