import { Suspense } from "react";
import { getProducts } from "@/lib/api/products";
import ProductGrid from "@/components/product/ProductGrid";
import FilterBar from "@/components/shop/FilterBar";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "Shop — AIE Fashionz",
  description:
    "Browse the full AIE Fashionz collection — luxury fabrics, bags, jewellery, party wear, children's wear and body shapers.",
};

export default async function ShopPage({ searchParams }) {
  const { sort, size, colour } = await searchParams;
  const products = await getProducts({ sort, size, colour });

  return (
    <>
      <section
        style={{
          backgroundColor: "var(--color-background)",
          borderBottom: "1px solid var(--color-border)",
        }}
        className="pt-32 pb-16 md:pt-40 md:pb-20"
      >
        <div className="container">
          <Reveal>
            <p
              className="font-body text-[10px] tracking-[0.35em] uppercase mb-4"
              style={{ color: "var(--color-subtle)" }}
            >
              All Collections
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h1
              className="font-heading leading-none"
              style={{
                color: "var(--color-foreground)",
                fontSize: "clamp(2.8rem, 7vw, 6rem)",
              }}
            >
              Shop
            </h1>
          </Reveal>
        </div>
      </section>

      <Suspense fallback={null}>
        <FilterBar totalCount={products.length} />
      </Suspense>

      <div
        style={{ backgroundColor: "var(--color-background)" }}
        className="py-14 md:py-20"
      >
        <div className="container">
          <ProductGrid
            products={products}
            emptyMessage="No products match your filters."
          />
        </div>
      </div>
    </>
  );
}
