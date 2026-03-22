const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashionz.com";

export const metadata = {
  title: "Size Guide | AIE Fashionz",
  description:
    "Find your perfect fit with the AIE Fashionz size guide. Women's and men's clothing sizes, shoe sizes, and jewellery sizing — UK, EU and US conversions.",
  alternates: { canonical: "/size-guide" },
  openGraph: {
    title: "Size Guide | AIE Fashionz",
    description:
      "Women's, men's and children's clothing size charts with UK, EU and US conversions, plus shoe and jewellery sizing guides.",
    url: `${SITE_URL}/size-guide`,
  },
};

// ── Women's clothing sizes ──────────────────────────────────────────────────
const WOMENS_SIZES = [
  { uk: "6",  eu: "34", us: "2",  bust: '31" / 79cm',  waist: '24" / 61cm',  hips: '34" / 86cm'  },
  { uk: "8",  eu: "36", us: "4",  bust: '32" / 81cm',  waist: '25" / 64cm',  hips: '35" / 89cm'  },
  { uk: "10", eu: "38", us: "6",  bust: '34" / 86cm',  waist: '27" / 69cm',  hips: '37" / 94cm'  },
  { uk: "12", eu: "40", us: "8",  bust: '36" / 91cm',  waist: '29" / 74cm',  hips: '39" / 99cm'  },
  { uk: "14", eu: "42", us: "10", bust: '38" / 97cm',  waist: '31" / 79cm',  hips: '41" / 104cm' },
  { uk: "16", eu: "44", us: "12", bust: '40" / 102cm', waist: '33" / 84cm',  hips: '43" / 109cm' },
  { uk: "18", eu: "46", us: "14", bust: '42" / 107cm', waist: '35" / 89cm',  hips: '45" / 114cm' },
  { uk: "20", eu: "48", us: "16", bust: '44" / 112cm', waist: '37" / 94cm',  hips: '47" / 119cm' },
  { uk: "22", eu: "50", us: "18", bust: '46" / 117cm', waist: '39" / 99cm',  hips: '49" / 124cm' },
];

// ── Men's clothing sizes ────────────────────────────────────────────────────
const MENS_SIZES = [
  { size: "XS",  chest: '34–36" / 86–91cm',  waist: '28–30" / 71–76cm'  },
  { size: "S",   chest: '36–38" / 91–97cm',  waist: '30–32" / 76–81cm'  },
  { size: "M",   chest: '38–40" / 97–102cm', waist: '32–34" / 81–86cm'  },
  { size: "L",   chest: '40–42" / 102–107cm',waist: '34–36" / 86–91cm'  },
  { size: "XL",  chest: '42–44" / 107–112cm',waist: '36–38" / 91–97cm'  },
  { size: "2XL", chest: '44–46" / 112–117cm',waist: '38–40" / 97–102cm' },
  { size: "3XL", chest: '46–48" / 117–122cm',waist: '40–42" / 102–107cm'},
];

// ── Women's shoe sizes ──────────────────────────────────────────────────────
const WOMENS_SHOES = [
  { uk: "3", eu: "36", us: "5.5" },
  { uk: "4", eu: "37", us: "6.5" },
  { uk: "5", eu: "38", us: "7.5" },
  { uk: "6", eu: "39", us: "8.5" },
  { uk: "7", eu: "40", us: "9.5" },
  { uk: "8", eu: "41", us: "10.5"},
  { uk: "9", eu: "42", us: "11.5"},
];

// ── Men's shoe sizes ────────────────────────────────────────────────────────
const MENS_SHOES = [
  { uk: "6",    eu: "39", us: "7"    },
  { uk: "7",    eu: "41", us: "8"    },
  { uk: "8",    eu: "42", us: "9"    },
  { uk: "9",    eu: "43", us: "10"   },
  { uk: "10",   eu: "44", us: "11"   },
  { uk: "11",   eu: "45", us: "12"   },
  { uk: "12",   eu: "46", us: "13"   },
  { uk: "13",   eu: "47", us: "14"   },
];

export default function SizeGuidePage() {
  return (
    <div
      className="container"
      style={{ paddingTop: "3rem", paddingBottom: "5rem", maxWidth: "860px" }}
    >
      {/* Eyebrow */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          marginBottom: "1rem",
        }}
      >
        Customer Service
      </p>

      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          color: "var(--color-foreground)",
          marginBottom: "0.75rem",
        }}
      >
        Size Guide
      </h1>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--color-muted)",
          marginBottom: "3rem",
          lineHeight: 1.8,
          maxWidth: "60ch",
        }}
      >
        Use the charts below to find your perfect fit. Measurements are given in
        both inches and centimetres. If you are between sizes, we recommend
        sizing up for a relaxed fit.
      </p>

      {/* ── Women's Clothing ── */}
      <SizeSection title="Women's Clothing" id="womens-clothing">
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--color-muted)",
            marginBottom: "1rem",
            lineHeight: 1.7,
          }}
        >
          Measure your bust, waist, and hips at the fullest point. Keep the
          tape measure snug but not tight.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {["UK", "EU", "US", "Bust", "Waist", "Hips"].map((h) => (
                  <Th key={h}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WOMENS_SIZES.map((row, i) => (
                <tr key={row.uk}>
                  <Td i={i} bold>{row.uk}</Td>
                  <Td i={i}>{row.eu}</Td>
                  <Td i={i}>{row.us}</Td>
                  <Td i={i}>{row.bust}</Td>
                  <Td i={i}>{row.waist}</Td>
                  <Td i={i}>{row.hips}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SizeSection>

      {/* ── Men's Clothing ── */}
      <SizeSection title="Men's Clothing" id="mens-clothing">
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--color-muted)",
            marginBottom: "1rem",
            lineHeight: 1.7,
          }}
        >
          Measure your chest at the widest point and your natural waist.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {["Size", "Chest", "Waist"].map((h) => (
                  <Th key={h}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MENS_SIZES.map((row, i) => (
                <tr key={row.size}>
                  <Td i={i} bold>{row.size}</Td>
                  <Td i={i}>{row.chest}</Td>
                  <Td i={i}>{row.waist}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SizeSection>

      {/* ── Shoe Sizes ── */}
      <SizeSection title="Shoe Sizes" id="shoe-sizes">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                fontWeight: 500,
                marginBottom: "0.875rem",
              }}
            >
              Women&apos;s Shoes
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {["UK", "EU", "US"].map((h) => (
                      <Th key={h}>{h}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WOMENS_SHOES.map((row, i) => (
                    <tr key={row.uk}>
                      <Td i={i} bold>{row.uk}</Td>
                      <Td i={i}>{row.eu}</Td>
                      <Td i={i}>{row.us}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                fontWeight: 500,
                marginBottom: "0.875rem",
              }}
            >
              Men&apos;s Shoes
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {["UK", "EU", "US"].map((h) => (
                      <Th key={h}>{h}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MENS_SHOES.map((row, i) => (
                    <tr key={row.uk}>
                      <Td i={i} bold>{row.uk}</Td>
                      <Td i={i}>{row.eu}</Td>
                      <Td i={i}>{row.us}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SizeSection>

      {/* ── Jewellery ── */}
      <SizeSection title="Jewellery Sizing" id="jewellery">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <JewelleryNote title="Ring sizes">
            Our rings are sized in UK standard letters (J–T). To find your
            size, wrap a thin strip of paper around your finger, mark where it
            overlaps, and measure the length in millimetres. Compare to a UK
            ring size chart. If between sizes, choose the larger size.
          </JewelleryNote>
          <JewelleryNote title="Bracelets">
            Standard bangle/bracelet internal diameter is 58–60mm (fits most
            wrists). Adjustable bracelets typically fit wrists from 15–20cm.
            Measure your wrist with a tape measure and add 1–2cm for comfort.
          </JewelleryNote>
          <JewelleryNote title="Necklaces">
            Choker: 36–38cm · Princess: 43–48cm · Matinée: 50–60cm ·
            Opera: 70–90cm. Lengths are the total chain length.
          </JewelleryNote>
        </div>
      </SizeSection>

      {/* ── Fabrics note ── */}
      <SizeSection title="Fabric Buying Guide" id="fabrics">
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--color-muted)",
            lineHeight: 1.85,
          }}
        >
          Fabrics are sold by the metre.{" "}
          <strong style={{ color: "var(--color-foreground)" }}>
            1 metre = approximately 100cm
          </strong>
          . Fabric widths vary by material — please check the individual product
          listing for the exact width. For tailored garments, we recommend
          purchasing an additional 10–15% to account for pattern matching and
          seam allowances. If you are unsure how much to order, contact us and
          our team will be happy to advise.
        </p>
      </SizeSection>

      {/* Tip box */}
      <div
        style={{
          marginTop: "1rem",
          padding: "1.5rem 2rem",
          backgroundColor: "var(--color-gold-light)",
          border: "1px solid var(--color-border)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--color-foreground)",
            lineHeight: 1.8,
          }}
        >
          <strong>Tip:</strong> If you are between sizes, size up for a relaxed
          fit. Still unsure? Email{" "}
          <a
            href="mailto:support@aiefashionz.com"
            style={{ color: "var(--color-gold)" }}
          >
            support@aiefashionz.com
          </a>{" "}
          and our team will help.
        </p>
      </div>
    </div>
  );
}

// ── Shared sub-components ───────────────────────────────────────────────────

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: "var(--font-body)",
  fontSize: "14px",
};

function SizeSection({ title, id, children }) {
  return (
    <section id={id} style={{ marginBottom: "3.5rem" }}>
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.4rem",
          color: "var(--color-foreground)",
          marginBottom: "1.25rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Th({ children }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "0.75rem 1rem",
        backgroundColor: "var(--color-surface-raised)",
        color: "var(--color-muted)",
        fontSize: "11px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontWeight: 500,
        border: "1px solid var(--color-border)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, i, bold }) {
  return (
    <td
      style={{
        padding: "0.75rem 1rem",
        border: "1px solid var(--color-border)",
        color: bold ? "var(--color-foreground)" : "var(--color-muted)",
        fontWeight: bold ? 500 : 400,
        backgroundColor:
          i % 2 === 0 ? "var(--color-surface)" : "var(--color-background)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </td>
  );
}

function JewelleryNote({ title, children }) {
  return (
    <div>
      <h3
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--color-foreground)",
          marginBottom: "0.35rem",
          textTransform: "capitalize",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--color-muted)",
          lineHeight: 1.8,
        }}
      >
        {children}
      </p>
    </div>
  );
}
