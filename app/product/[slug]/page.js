import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, RotateCcw, Shield, Truck } from "lucide-react";
import { getProductBySlug, getAllProductSlugs, getRelatedProducts } from "@/lib/api/products";
import { getCategoryBySlug } from "@/lib/api/categories";
import ProductGallery from "@/components/product/ProductGallery";
import VariantSelector from "@/components/product/VariantSelector";
import ProductGrid from "@/components/product/ProductGrid";
import Reveal from "@/components/ui/Reveal";

export async function generateStaticParams() {
  return getAllProductSlugs();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.title} — AIE Fashionz`,
    description: product.description.slice(0, 160),
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

  return (
    <>
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

              {/* Delivery & returns */}
              <Reveal delay={3}>
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
              <Reveal delay={4}>
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
                <Reveal delay={5}>
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
