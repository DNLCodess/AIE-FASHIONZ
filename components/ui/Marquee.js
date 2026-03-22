const ITEMS = [
  "Luxury Fabrics",
  "Bags & Shoes",
  "Jewellery",
  "Party & Dinner Wear",
  "Children's Wear",
  "Body Shapers",
];

const DOT = <span className="mx-7 text-gold text-[8px] opacity-60">◆</span>;

/**
 * Infinite horizontal marquee ticker — pure CSS animation, no JS.
 * Items are duplicated so the strip seamlessly loops at -50% translateX.
 */
export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden border-y border-border py-3.5 bg-surface-raised select-none">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center shrink-0">
            <span className="font-body text-[11px] tracking-[0.28em] uppercase text-muted">
              {item}
            </span>
            {DOT}
          </span>
        ))}
      </div>
    </div>
  );
}
