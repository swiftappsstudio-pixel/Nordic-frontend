import { notFound } from "next/navigation";
import { getCategoryByLink } from "@/app/_common/api";
import CategoryPageClient from "./category-page-client";

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const categories = await getCategoryByLink(slug);
    if (!categories.length) return notFound();
    return <CategoryPageClient categories={categories} />;
  } catch {
    return notFound();
  }
}