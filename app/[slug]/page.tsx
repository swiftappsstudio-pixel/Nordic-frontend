import { notFound } from "next/navigation";
import { getCategoryByLink } from "@/app/_common/api";
import CategoryPageClient from "./category-page-client";

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let categories: Awaited<ReturnType<typeof getCategoryByLink>> = [];
  try {
    categories = await getCategoryByLink(slug);
  } catch {
    notFound();
  }
  if (!categories.length) notFound();
  return <CategoryPageClient categories={categories} />;
}