/**
 * Mock category API — replace with Supabase queries when ready.
 */
import { categories } from "@/data/categories";

export async function getCategories() {
  return categories.filter((c) => c.is_active).sort((a, b) => a.display_order - b.display_order);
}

export async function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug && c.is_active) ?? null;
}
