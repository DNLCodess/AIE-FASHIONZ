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

/**
 * Full-text search across title, description, and category_slug.
 * Supports multi-word queries (each word scored independently) + relevance ranking.
 * @param {string} query
 * @param {{ category?: string, sort?: string, page?: number, limit?: number }} options
 * @returns {{ results: any[], total: number }}
 */
export async function searchProducts(query, { category, sort, page = 1, limit = 20 } = {}) {
  await delay();

  const q = query?.trim().toLowerCase() ?? "";
  const words = q.split(/\s+/).filter((w) => w.length >= 2);

  let result = products.filter((p) => p.is_active);

  if (category) result = result.filter((p) => p.category_slug === category);

  if (q) {
    const scored = result.map((p) => {
      let score = 0;
      const title = p.title.toLowerCase();
      const desc = (p.description ?? "").toLowerCase();
      const cat = p.category_slug.replace(/-/g, " ");

      // Exact phrase matches (highest weight)
      if (title.includes(q)) score += 4;
      if (cat.includes(q)) score += 2;
      if (desc.includes(q)) score += 1;

      // Start-of-title bonus
      if (title.startsWith(q)) score += 3;

      // Multi-word: award points per word found, so "blue dress" matches "Blue Silk Dress"
      if (words.length > 1) {
        const titleWordMatches = words.filter((w) => title.includes(w)).length;
        const descWordMatches = words.filter((w) => desc.includes(w)).length;
        score += titleWordMatches * 2;
        score += descWordMatches * 0.5;
      }

      // Fuzzy: single-word query — check if query chars appear in order (trigram-like)
      if (words.length === 1 && q.length >= 3 && score === 0) {
        let charIdx = 0;
        for (const ch of title) {
          if (ch === q[charIdx]) charIdx++;
          if (charIdx === q.length) { score += 0.5; break; }
        }
      }

      return { product: p, score };
    });

    result = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.product);
  }

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.base_price - b.base_price);
      break;
    case "price-desc":
      result.sort((a, b) => b.base_price - a.base_price);
      break;
    case "newest":
      result.reverse();
      break;
    // default: relevance order from scoring above
  }

  const total = result.length;
  const start = (page - 1) * limit;
  return { results: result.slice(start, start + limit), total };
}

const CATEGORY_NAMES = [
  { slug: "luxury-fabrics", label: "Luxury Fabrics" },
  { slug: "bags-shoes", label: "Bags & Shoes" },
  { slug: "jewellery", label: "Jewellery" },
  { slug: "party-dinner-wear", label: "Party Wear" },
  { slug: "childrens-wear", label: "Children's Wear" },
  { slug: "body-shapers", label: "Body Shapers" },
];

/**
 * Generate autocomplete query suggestions from product titles + categories.
 * Synchronous — no DB call needed (real impl: use pg_trgm / Supabase full-text).
 * @param {string} query
 * @returns {{ queries: string[], categories: { slug: string, label: string }[] }}
 */
export function getSuggestions(query) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return { queries: [], categories: [] };

  // Category hits
  const categories = CATEGORY_NAMES.filter(({ label }) =>
    label.toLowerCase().includes(q)
  ).slice(0, 2);

  // Query suggestions: extract word-group phrases from matching product titles
  const seen = new Set();
  const queries = [];

  for (const p of products) {
    if (!p.is_active) continue;
    const { title } = p;
    const titleLower = title.toLowerCase();
    if (!titleLower.includes(q)) continue;

    // Slide a 3-word window over the title to find natural suggestion phrases
    const words = title.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      for (let len = 1; len <= Math.min(3, words.length - i); len++) {
        const phrase = words.slice(i, i + len).join(" ");
        const phraseLower = phrase.toLowerCase();
        if (phraseLower.includes(q) && !seen.has(phraseLower) && phrase.length > q.length) {
          seen.add(phraseLower);
          queries.push(phrase);
          if (queries.length >= 5) break;
        }
      }
      if (queries.length >= 5) break;
    }
    if (queries.length >= 5) break;
  }

  return { queries: queries.slice(0, 5), categories };
}
