import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Selects product columns + variants as a nested array.
// stock_count aliases the DB column stock_quantity to match what components expect.
const PRODUCT_SELECT = `
  id, title, slug, description, category_slug,
  base_price, compare_price, images, is_active, is_featured, created_at,
  variants:product_variants(id, size, colour, additional_price, stock_count:stock_quantity, sku)
`;

const PRICE_RANGE_MAP = {
  "under-50":  { min: 0,     max: 4999 },
  "50-150":    { min: 5000,  max: 14999 },
  "150-300":   { min: 15000, max: 29999 },
  "over-300":  { min: 30000, max: Infinity },
};

export async function getProducts({
  category, sort, size, colour, price, onSale, inStock, limit, featured, ids,
} = {}) {
  const supabase = getSupabase();
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true);

  if (category) query = query.eq("category_slug", category);
  if (featured) query = query.eq("is_featured", true);
  if (ids?.length) query = query.in("id", ids);

  if (price && PRICE_RANGE_MAP[price]) {
    const { min, max } = PRICE_RANGE_MAP[price];
    query = query.gte("base_price", min);
    if (max !== Infinity) query = query.lte("base_price", max);
  }

  if (onSale) query = query.not("compare_price", "is", null);

  switch (sort) {
    case "price-asc":  query = query.order("base_price", { ascending: true }); break;
    case "price-desc": query = query.order("base_price", { ascending: false }); break;
    default:           query = query.order("created_at", { ascending: false }); break;
  }

  if (limit && !size && !colour && !inStock && !onSale) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;

  let result = data ?? [];

  // Variant-level filters need JS post-processing
  if (size)    result = result.filter((p) => p.variants?.some((v) => v.size === size));
  if (colour)  result = result.filter((p) => p.variants?.some((v) => v.colour === colour));
  if (inStock) result = result.filter((p) => p.variants?.some((v) => v.stock_count > 0));
  // onSale: compare_price may be non-null but still <= base_price in edge cases
  if (onSale)  result = result.filter((p) => p.compare_price > p.base_price);

  if (limit) result = result.slice(0, limit);

  return result;
}

export async function getProductBySlug(slug) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

export async function getAllProductSlugs() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);
  if (error) throw error;
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export async function getFeaturedProducts(limit = 4) {
  return getProducts({ featured: true, limit });
}

export async function getRelatedProducts(product, limit = 4) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("category_slug", product.category_slug)
    .eq("is_active", true)
    .neq("id", product.id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/**
 * Full-text search across title and description.
 * @param {string} query
 * @param {{ category?: string, sort?: string, page?: number, limit?: number }} options
 * @returns {{ results: any[], total: number }}
 */
export async function searchProducts(query, { category, sort, page = 1, limit = 20 } = {}) {
  const supabase = getSupabase();
  const q = query?.trim() ?? "";

  let dbQuery = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true);

  if (category) dbQuery = dbQuery.eq("category_slug", category);

  if (q) {
    dbQuery = dbQuery.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  switch (sort) {
    case "price-asc":  dbQuery = dbQuery.order("base_price", { ascending: true }); break;
    case "price-desc": dbQuery = dbQuery.order("base_price", { ascending: false }); break;
    default:           dbQuery = dbQuery.order("created_at", { ascending: false }); break;
  }

  const { data, error } = await dbQuery;
  if (error) throw error;

  const all = data ?? [];
  const total = all.length;
  const start = (page - 1) * limit;
  return { results: all.slice(start, start + limit), total };
}

const CATEGORY_NAMES = [
  { slug: "luxury-fabrics",    label: "Luxury Fabrics" },
  { slug: "bags-shoes",        label: "Bags & Shoes" },
  { slug: "jewellery",         label: "Jewellery" },
  { slug: "party-dinner-wear", label: "Party Wear" },
  { slug: "childrens-wear",    label: "Children's Wear" },
  { slug: "body-shapers",      label: "Body Shapers" },
];

/**
 * Autocomplete suggestions — product title phrases + category matches.
 * @param {string} query
 * @returns {{ queries: string[], categories: { slug: string, label: string }[] }}
 */
export async function getSuggestions(query) {
  const q = query?.trim().toLowerCase() ?? "";
  if (q.length < 2) return { queries: [], categories: [] };

  const categories = CATEGORY_NAMES.filter(({ label }) =>
    label.toLowerCase().includes(q)
  ).slice(0, 2);

  const supabase = getSupabase();
  const { data } = await supabase
    .from("products")
    .select("title")
    .eq("is_active", true)
    .ilike("title", `%${q}%`)
    .limit(10);

  const seen = new Set();
  const queries = [];

  for (const { title } of data ?? []) {
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
