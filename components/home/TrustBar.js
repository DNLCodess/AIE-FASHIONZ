import { Truck, RotateCcw, Globe, Shield } from "lucide-react";

const TRUST = [
  { Icon: Truck,     title: "Free US Shipping",  desc: "On orders over $75" },
  { Icon: Globe,     title: "Worldwide Delivery", desc: "We ship everywhere" },
  { Icon: RotateCcw, title: "30-Day Returns",     desc: "Hassle-free policy" },
  { Icon: Shield,    title: "Secure Checkout",    desc: "SSL encrypted"      },
];

/**
 * Gap-px technique: grid gap is 1px, section bg is --color-border.
 * Each cell has --color-surface bg — the 1px gap becomes the divider line.
 * Works correctly at any breakpoint without per-item border logic.
 */
export default function TrustBar() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-border)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="container" style={{ padding: 0 }}>
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: "1px" }}
        >
          {TRUST.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left"
              style={{
                padding: "24px 20px",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <Icon
                size={22}
                strokeWidth={1.5}
                style={{ color: "var(--color-gold)", flexShrink: 0 }}
              />
              <div>
                <p
                  className="font-body"
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--color-foreground)",
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </p>
                <p
                  className="font-body"
                  style={{
                    fontSize: "14px",
                    color: "var(--color-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
