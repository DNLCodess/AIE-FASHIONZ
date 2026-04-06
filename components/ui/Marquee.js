const ITEMS = [
  "Luxury Fabrics",
  "Bags & Shoes",
  "Jewellery",
  "Party & Dinner Wear",
  "Children's Wear",
  "Body Shapers",
  "Free US Shipping Over $75",
  "Worldwide Delivery",
  "30-Day Returns",
];

const DOT = <span style={{ margin: "0 1.75rem", color: "var(--color-gold)", fontSize: "8px", opacity: 0.7 }}>◆</span>;

/**
 * Infinite horizontal marquee ticker — pure CSS animation, no JS.
 * Items duplicated so the strip loops seamlessly at -50% translateX.
 */
export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      className="overflow-hidden select-none"
      style={{
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface-raised)",
        paddingBlock: "14px",
      }}
    >
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center shrink-0">
            <span
              className="font-body uppercase"
              style={{
                fontSize: "14px",
                letterSpacing: "0.25em",
                color: "var(--color-muted)",
              }}
            >
              {item}
            </span>
            {DOT}
          </span>
        ))}
      </div>
    </div>
  );
}
