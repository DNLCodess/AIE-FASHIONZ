import { Suspense } from "react";
import { getProducts } from "@/lib/api/products";
import ProductGrid from "@/components/product/ProductGrid";
import FilterBar from "@/components/shop/FilterBar";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "Shop — Aiefashion",
  description:
    "Browse the full Aiefashion collection — luxury fabrics, bags, jewellery, party wear, children's wear and body shapers.",
};

export default async function ShopPage({ searchParams }) {
  const { sort, size, colour, category, price, onSale, inStock } = await searchParams;
  const products = await getProducts({ sort, size, colour, category, price, onSale, inStock });

  return (
    <>
      {/* ── Page header ───────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--color-background)",
          borderBottom: "1px solid var(--color-border)",
          paddingTop: "7rem",
          paddingBottom: "2.5rem",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <Reveal>
                <p
                  className="font-body uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.35em",
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  All Collections
                </p>
              </Reveal>
              <Reveal delay={1}>
                <h1
                  className="font-heading leading-none"
                  style={{
                    color: "var(--color-foreground)",
                    fontSize: "clamp(2.2rem, 5vw, 4rem)",
                  }}
                >
                  Shop
                </h1>
              </Reveal>
            </div>
            <Reveal reveal="fade" delay={2}>
              <p
                className="font-body"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  paddingBottom: "0.35rem",
                }}
              >
                {products.length} {products.length === 1 ? "piece" : "pieces"}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Filter bar ────────────────────────────────────── */}
      <Suspense
        fallback={
          <div
            style={{
              height: "52px",
              backgroundColor: "var(--color-surface)",
              borderBottom: "1px solid var(--color-border)",
            }}
          />
        }
      >
        <FilterBar totalCount={products.length} />
      </Suspense>

      {/* ── Product grid ──────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "var(--color-background)",
          paddingTop: "3rem",
          paddingBottom: "5rem",
        }}
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
