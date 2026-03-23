import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, RotateCcw, Shield, Truck } from "lucide-react";
import { getProductBySlug, getAllProductSlugs, getRelatedProducts } from "@/lib/api/products";
import { getCategoryBySlug } from "@/lib/api/categories";
import ProductGallery from "@/components/product/ProductGallery";
import VariantSelector from "@/components/product/VariantSelector";
import ProductActions from "@/components/product/ProductActions";
import ProductGrid from "@/components/product/ProductGrid";
import Reveal from "@/components/ui/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import ReviewList from "@/components/reviews/ReviewList";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashion.com";

export async function generateStaticParams() {
  return getAllProductSlugs();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const primaryImage =
    product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url;
  const price = (product.base_price / 100).toFixed(2);
  const desc = `${product.description.slice(0, 130)} Free UK delivery. 14-day returns.`;

  return {
    title: `${product.title} | Aiefashion`,
    description: desc,
    keywords: [
      product.title,
      "luxury fashion UK",
      "women's clothing",
      product.category_slug.replace(/-/g, " "),
      "Aiefashion",
    ],
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      title: product.title,
      description: desc,
      url: `/product/${slug}`,
      type: "website",
      images: primaryImage
        ? [{ url: primaryImage, width: 800, height: 1067, alt: product.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: desc,
      images: primaryImage ? [primaryImage] : [],
    },
    other: {
      "product:price:amount": price,
      "product:price:currency": "GBP",
    },
  };
}

export const revalidate = 3600;

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategoryBySlug(product.category_slug),
    getRelatedProducts(product, 4),
  ]);

  const primaryImage =
    product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url;

  const inStock = product.variants?.some((v) => (v.stock_count ?? v.stock_quantity ?? 0) > 0);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.variants?.[0]?.sku ?? product.slug,
    brand: { "@type": "Brand", name: "Aiefashion" },
    category: category?.name ?? product.category_slug,
    image: product.images?.map((img) => img.url) ?? [],
    url: `${SITE_URL}/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: (product.base_price / 100).toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Aiefashion" },
      url: `${SITE_URL}/product/${product.slug}`,
      priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        .toISOString()
        .slice(0, 10),
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "GBP",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "GB",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
      },
    },
    ...(product.materials ? { material: product.materials } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
      ...(category
        ? [{ "@type": "ListItem", position: 3, name: category.name, item: `${SITE_URL}/shop/${category.slug}` }]
        : []),
      {
        "@type": "ListItem",
        position: category ? 4 : 3,
        name: product.title,
        item: `${SITE_URL}/product/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Breadcrumb */}
      <nav className="border-b border-border bg-surface" aria-label="Breadcrumb">
        <div className="container py-4 flex items-center gap-1.5 font-body text-xs text-muted">
          <Link href="/" className="hover:text-foreground transition-colors duration-200">
            Home
          </Link>
          <ChevronRight size={11} />
          <Link href="/shop" className="hover:text-foreground transition-colors duration-200">
            Shop
          </Link>
          {category && (
            <>
              <ChevronRight size={11} />
              <Link
                href={`/shop/${category.slug}`}
                className="hover:text-foreground transition-colors duration-200"
              >
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight size={11} />
          <span className="text-foreground truncate max-w-50">{product.title}</span>
        </div>
      </nav>

      {/* Main product layout */}
      <div className="bg-background py-12 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24">

            {/* Gallery */}
            <Reveal reveal="fade">
              <ProductGallery images={product.images} />
            </Reveal>

            {/* Product info */}
            <div className="lg:sticky lg:top-28 lg:self-start">

              {/* Category label */}
              {category && (
                <Reveal>
                  <Link
                    href={`/shop/${category.slug}`}
                    className="font-body text-[10px] tracking-[0.25em] uppercase text-subtle hover:text-muted transition-colors duration-200 mb-4 inline-block"
                  >
                    {category.name}
                  </Link>
                </Reveal>
              )}

              {/* Title */}
              <Reveal delay={1}>
                <h1
                  className="font-heading text-foreground mb-6 leading-snug"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
                >
                  {product.title}
                </h1>
              </Reveal>

              {/* Variant selector (includes price + add to cart) */}
              <Reveal delay={2}>
                <VariantSelector product={product} />
              </Reveal>

              {/* Wishlist + Share */}
              <Reveal delay={3}>
                <div className="mt-4">
                  <ProductActions product={product} />
                </div>
              </Reveal>

              {/* Delivery & returns */}
              <Reveal delay={4}>
                <div className="mt-8 space-y-3 border-t border-border pt-8">
                  {[
                    { icon: Truck, text: "Free UK delivery on orders over £150" },
                    { icon: RotateCcw, text: "Free returns within 14 days (UK Consumer Rights Act)" },
                    { icon: Shield, text: "Secure checkout — Stripe & Paystack" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3">
                      <Icon size={14} className="text-gold mt-0.5 shrink-0" />
                      <p className="font-body text-sm text-muted">{text}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Description */}
              <Reveal delay={5}>
                <div className="mt-8 border-t border-border pt-8">
                  <h2 className="font-body text-[10px] tracking-[0.2em] uppercase text-subtle mb-4">
                    Description
                  </h2>
                  <p className="font-body text-sm text-muted leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </Reveal>

              {/* Materials & Care */}
              {(product.materials || product.care_instructions) && (
                <Reveal delay={6}>
                  <div className="mt-6 border-t border-border pt-6 space-y-4">
                    {product.materials && (
                      <div>
                        <h3 className="font-body text-[10px] tracking-[0.2em] uppercase text-subtle mb-2">
                          Materials
                        </h3>
                        <p className="font-body text-sm text-muted">{product.materials}</p>
                      </div>
                    )}
                    {product.care_instructions && (
                      <div>
                        <h3 className="font-body text-[10px] tracking-[0.2em] uppercase text-subtle mb-2">
                          Care
                        </h3>
                        <p className="font-body text-sm text-muted">{product.care_instructions}</p>
                      </div>
                    )}
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="container" style={{ paddingBottom: "5rem" }}>
        <ReviewList productId={product.id} productTitle={product.title} />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-surface border-t border-border py-16 md:py-24">
          <div className="container">
            <div className="flex items-end justify-between mb-12">
              <Reveal>
                <h2
                  className="font-heading text-foreground"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
                >
                  You May Also Like
                </h2>
              </Reveal>
              {category && (
                <Reveal reveal="fade">
                  <Link
                    href={`/shop/${product.category_slug}`}
                    className="font-body text-xs tracking-[0.15em] uppercase text-muted hover:text-foreground transition-colors duration-200 underline underline-offset-4 hidden sm:block"
                  >
                    View all
                  </Link>
                </Reveal>
              )}
            </div>
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  );
}
