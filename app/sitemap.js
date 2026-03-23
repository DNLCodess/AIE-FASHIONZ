import { getAllProductSlugs } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashion.com";

export default async function sitemap() {
  const [slugs, categories] = await Promise.all([
    getAllProductSlugs(),
    getCategories(),
  ]);

  const now = new Date();

  /** @type {import('next').MetadataRoute.Sitemap} */
  const staticRoutes = [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE}/shop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/returns`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const categoryRoutes = categories.map((cat) => ({
    url: `${BASE}/shop/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const productRoutes = slugs.map(({ slug }) => ({
    url: `${BASE}/product/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
