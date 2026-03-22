/**
 * Mock product API — mirrors the shape of real Supabase queries.
 * Replace each function body with a Supabase client call when ready.
 */
import { products } from "@/data/products";

// Simulate network latency in dev
const delay = () => new Promise((r) => setTimeout(r, 60));

export async function getProducts({ category, sort, size, colour, limit, featured } = {}) {
  await delay();

  let result = [...products].filter((p) => p.is_active);

  if (category) result = result.filter((p) => p.category_slug === category);
  if (featured) result = result.filter((p) => p.is_featured);
  if (size) result = result.filter((p) => p.variants.some((v) => v.size === size));
  if (colour) result = result.filter((p) => p.variants.some((v) => v.colour === colour));

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.base_price - b.base_price);
      break;
    case "price-desc":
      result.sort((a, b) => b.base_price - a.base_price);
      break;
    case "newest":
    default:
      // Mock: reverse insertion order = newest first
      result.reverse();
      break;
  }

  if (limit) result = result.slice(0, limit);

  return result;
}

export async function getProductBySlug(slug) {
  await delay();
  return products.find((p) => p.slug === slug && p.is_active) ?? null;
}

export async function getAllProductSlugs() {
  return products.filter((p) => p.is_active).map((p) => ({ slug: p.slug }));
}

export async function getFeaturedProducts(limit = 4) {
  return getProducts({ featured: true, limit });
}

export async function getRelatedProducts(product, limit = 4) {
  await delay();
  return products
    .filter((p) => p.category_slug === product.category_slug && p.id !== product.id && p.is_active)
    .slice(0, limit);
}
