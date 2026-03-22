import ProductCard from "./ProductCard";
import Reveal from "@/components/ui/Reveal";

export default function ProductGrid({
  products,
  emptyMessage = "No products found.",
}) {
  if (!products?.length) {
    return (
      <div
        className="py-28 flex flex-col items-center justify-center text-center"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        {/* Decorative empty state */}
        <div
          className="w-px h-12 mb-6 mx-auto"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        <p
          className="font-heading italic mb-3"
          style={{
            fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
            color: "var(--color-foreground)",
          }}
        >
          Nothing here yet.
        </p>
        <p
          className="font-body"
          style={{ fontSize: "14px", color: "var(--color-muted)" }}
        >
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-5 md:gap-y-14">
      {products.map((product, i) => (
        <Reveal key={product.id} delay={Math.min(i + 1, 6)}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
