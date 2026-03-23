import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug, getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import ProductGrid from "@/components/product/ProductGrid";
import FilterBar from "@/components/shop/FilterBar";
import Reveal from "@/components/ui/Reveal";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashion.com";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return {};

  const desc = `Shop ${cat.name} at Aiefashion — ${cat.description ?? "premium luxury fashion for women"}. Free US shipping on orders over $75. Worldwide delivery.`;

  return {
    title: `${cat.name} | Aiefashion`,
    description: desc,
    keywords: [cat.name, "luxury fashion", "women's clothing", "Aiefashion", "buy online"],
    alternates: { canonical: `/shop/${category}` },
    openGraph: {
      title: `${cat.name} | Aiefashion`,
      description: desc,
      url: `/shop/${category}`,
      images: cat.hero_image_url
        ? [{ url: cat.hero_image_url, width: 1200, height: 630, alt: cat.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.name} | Aiefashion`,
      description: desc,
      images: cat.hero_image_url ? [cat.hero_image_url] : [],
    },
  };
}

export const revalidate = 3600;

export default async function CategoryPage({ params, searchParams }) {
  const { category } = await params;
  const { sort, size, colour } = await searchParams;

  const [cat, products] = await Promise.all([
    getCategoryBySlug(category),
    getProducts({ category, sort, size, colour }),
  ]);

  if (!cat) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
      { "@type": "ListItem", position: 3, name: cat.name, item: `${SITE_URL}/shop/${category}` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.name,
    description: cat.description,
    url: `${SITE_URL}/shop/${category}`,
    breadcrumb: breadcrumbSchema,
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionSchema} />
      {/* Hero */}
      <section className="relative -mt-16 md:-mt-20 h-[65vh] min-h-[25rem] max-h-[40rem] overflow-hidden">
        <Image
          src={cat.hero_image_url}
          alt={cat.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />

        <div className="absolute bottom-0 left-0 right-0 container pb-12 md:pb-16">
          <nav
            className="flex items-center gap-1.5 mb-6"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "rgba(255,255,255,0.5)",
            }}
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-white/80 transition-colors">
              Home
            </Link>
            <ChevronRight size={11} />
            <Link
              href="/shop"
              className="hover:text-white/80 transition-colors"
            >
              Shop
            </Link>
            <ChevronRight size={11} />
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{cat.name}</span>
          </nav>

          <div
            className="w-10 h-px mb-5"
            style={{ backgroundColor: "var(--color-gold)" }}
          />

          <h1
            className="font-heading text-white leading-none mb-2"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
          >
            {cat.name}
          </h1>
          <p
            className="hidden md:block mt-3 max-w-md"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            {cat.description}
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <Suspense fallback={null}>
        <FilterBar totalCount={products.length} />
      </Suspense>

      {/* Product grid */}
      <div
        style={{ backgroundColor: "var(--color-background)" }}
        className="py-14 md:py-20"
      >
        <div className="container">
          <ProductGrid
            products={products}
            emptyMessage={`No products found in ${cat.name}.`}
          />
        </div>
      </div>

      {/* Other categories */}
      <section
        style={{
          backgroundColor: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
        }}
        className="py-16 md:py-20"
      >
        <div className="container">
          <Reveal className="mb-8">
            <h2
              className="font-heading"
              style={{
                color: "var(--color-foreground)",
                fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              }}
            >
              Browse Other Collections
            </h2>
          </Reveal>
          <OtherCategories currentSlug={category} />
        </div>
      </section>
    </>
  );
}

async function OtherCategories({ currentSlug }) {
  const all = await getCategories();
  const others = all.filter((c) => c.slug !== currentSlug).slice(0, 5);

  return (
    <div className="flex flex-wrap gap-3">
      {others.map((cat, i) => (
        <Reveal key={cat.slug} delay={i + 1} as="span">
          <Link
            href={`/shop/${cat.slug}`}
            className="inline-block font-body text-sm text-muted hover:text-foreground border border-border hover:border-foreground px-5 py-2.5 transition-colors duration-200"
          >
            {cat.name}
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
