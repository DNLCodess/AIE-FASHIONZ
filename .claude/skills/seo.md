# Skill: SEO

Read before adding metadata, structured data, or any SEO-related implementation.

## Metadata — Next.js 15 Pattern

### Static pages

```js
// app/(storefront)/about/page.js
export const metadata = {
  title: "About AIE Fashionz | UK Luxury Fashion",
  description:
    "Discover AIE Fashionz — a UK-based luxury fashion brand offering premium fabrics, bags, jewellery, party wear, and more. Shipping worldwide.",
  openGraph: {
    title: "About AIE Fashionz",
    description: "...",
    url: "https://www.aiefashionz.com/about",
    images: [
      {
        url: "https://www.aiefashionz.com/og/about.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};
```

### Dynamic pages (products, categories)

```js
// app/(storefront)/product/[slug]/page.js
export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Not Found" };

  const primaryImage = product.product_images.find((i) => i.is_primary);

  return {
    title: `${product.title} | AIE Fashionz`,
    description: product.description?.slice(0, 155) + "...",
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 155),
      url: `https://www.aiefashionz.com/product/${product.slug}`,
      images: primaryImage
        ? [
            {
              url: primaryImage.url,
              width: 800,
              height: 1067, // 3:4 ratio
              alt: primaryImage.alt_text,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      images: primaryImage ? [primaryImage.url] : [],
    },
  };
}
```

### Root layout metadata

```js
// app/layout.js
export const metadata = {
  metadataBase: new URL("https://www.aiefashionz.com"),
  title: {
    default: "AIE Fashionz | Luxury Fashion — UK",
    template: "%s | AIE Fashionz",
  },
  description:
    "UK luxury fashion brand. Shop premium fabrics, bags, shoes, jewellery, party wear, childrens wear and shapewear. Worldwide shipping.",
  keywords: [
    "luxury fashion UK",
    "African diaspora fashion",
    "luxury fabrics",
    "party wear UK",
    "shapewear",
  ],
  authors: [{ name: "AIE Fashionz" }],
  creator: "AIE Fashionz",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "AIE Fashionz",
  },
  twitter: { card: "summary_large_image", creator: "@aiefashionz" },
  robots: { index: true, follow: true },
};
```

## Structured Data (JSON-LD)

### Product page

```jsx
// components/product/ProductStructuredData.js
export default function ProductStructuredData({ product }) {
  const primaryImage = product.product_images.find((i) => i.is_primary);
  const avgRating =
    product.reviews?.reduce((s, r) => s + r.rating, 0) /
    (product.reviews?.length || 1);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.product_images.map((i) => i.url),
    sku: product.product_variants?.[0]?.sku,
    brand: { "@type": "Brand", name: "AIE Fashionz" },
    offers: {
      "@type": "Offer",
      url: `https://www.aiefashionz.com/product/${product.slug}`,
      priceCurrency: "GBP",
      price: (product.base_price / 100).toFixed(2),
      availability: product.product_variants?.some((v) => v.stock_count > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "AIE Fashionz" },
    },
    ...(product.reviews?.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: product.reviews.length,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Breadcrumb (on category and product pages)

```jsx
function BreadcrumbStructuredData({ items }) {
  // items: [{ name, url }, ...]
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Organisation (in root layout)

```js
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AIE Fashionz",
  url: "https://www.aiefashionz.com",
  logo: "https://www.aiefashionz.com/images/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hello@aiefashionz.com",
  },
};
```

## Sitemap

```js
// app/sitemap.js
export default async function sitemap() {
  const products = await getAllProductSlugs();
  const categories = [
    "luxury-fabrics",
    "bags-shoes",
    "jewellery",
    "party-dinner-wear",
    "childrens-wear",
    "body-shapers",
  ];

  return [
    {
      url: "https://www.aiefashionz.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categories.map((cat) => ({
      url: `https://www.aiefashionz.com/shop/${cat}`,
      changeFrequency: "daily",
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `https://www.aiefashionz.com/product/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly",
      priority: 0.6,
    })),
  ];
}
```

## robots.txt

```js
// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/account/", "/checkout/", "/api/"],
      },
    ],
    sitemap: "https://www.aiefashionz.com/sitemap.xml",
  };
}
```

## On-Demand ISR Revalidation (product edits)

```js
// app/api/products/revalidate/route.js
import { revalidatePath } from "next/cache";

export async function POST(request) {
  const token = request.headers.get("x-revalidate-token");
  if (token !== process.env.REVALIDATE_TOKEN) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const { slug } = await request.json();
  revalidatePath(`/product/${slug}`);
  revalidatePath("/shop"); // also revalidate shop listings

  return Response.json({ revalidated: true, slug });
}
```

## SEO Checklist (before shipping any page)

- [ ] `<title>` unique and under 60 characters
- [ ] `<meta description>` unique and 140–155 characters
- [ ] OpenGraph image 1200×630px
- [ ] Canonical URL set (Next.js handles via metadataBase)
- [ ] Structured data valid (test at schema.org/validator)
- [ ] Page indexed by robots (not accidentally noindexed)
- [ ] Breadcrumbs present on category and product pages
- [ ] Heading hierarchy correct (one H1, logical H2/H3 structure)
- [ ] All images have descriptive alt text
- [ ] Internal links use descriptive anchor text
