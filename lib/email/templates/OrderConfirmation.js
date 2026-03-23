import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import { formatCurrency } from "@/lib/utils";

export default function OrderConfirmation({ order }) {
  const currency = order.currency ?? "USD";

  return (
    <Html lang="en">
      <Head />
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={brand}>AIEFASHION</Heading>
            <Text style={tagline}>Premium Fashion</Text>
          </Section>

          <Hr style={divider} />

          {/* Title */}
          <Section style={{ padding: "32px 0 16px" }}>
            <Heading as="h2" style={h2}>
              Order Confirmed
            </Heading>
            <Text style={body_text}>
              Thank you, {order.first_name}. We&apos;ve received your order and will have it on its
              way shortly.
            </Text>
            <Text style={{ ...body_text, color: "#6B6A66", fontSize: "13px" }}>
              Order reference: <strong style={{ color: "#1C1C1A" }}>{order.reference}</strong>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Items */}
          <Section style={{ padding: "24px 0" }}>
            <Heading as="h3" style={h3}>
              Your Items
            </Heading>
            {order.order_items?.map((item) => (
              <Row key={item.id} style={{ marginBottom: "12px" }}>
                <Column style={{ flex: 1 }}>
                  <Text style={item_title}>{item.title}</Text>
                  {(item.size || item.colour) && (
                    <Text style={item_meta}>
                      {[item.size, item.colour].filter(Boolean).join(" · ")}
                    </Text>
                  )}
                </Column>
                <Column style={{ textAlign: "right", width: "80px" }}>
                  <Text style={item_price}>
                    {formatCurrency(item.price * item.quantity, currency)}
                  </Text>
                  <Text style={item_meta}>Qty: {item.quantity}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Totals */}
          <Section style={{ padding: "16px 0 24px" }}>
            <Row style={{ marginBottom: "8px" }}>
              <Column><Text style={total_label}>Subtotal</Text></Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={total_value}>{formatCurrency(order.subtotal, currency)}</Text>
              </Column>
            </Row>
            <Row style={{ marginBottom: "8px" }}>
              <Column><Text style={total_label}>Shipping</Text></Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={total_value}>{formatCurrency(order.shipping, currency)}</Text>
              </Column>
            </Row>
            {/* Tax row omitted — US store, no VAT */}
            <Hr style={{ ...divider, margin: "12px 0" }} />
            <Row>
              <Column><Text style={{ ...total_label, fontWeight: "600", color: "#1C1C1A" }}>Total</Text></Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ ...total_value, fontSize: "18px", color: "#D4AF37" }}>
                  {formatCurrency(order.total, currency)}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Delivery address */}
          <Section style={{ padding: "24px 0 32px" }}>
            <Heading as="h3" style={h3}>
              Delivery Address
            </Heading>
            <Text style={body_text}>
              {order.first_name} {order.last_name}
              <br />
              {order.address_line1}
              {order.address_line2 ? <><br />{order.address_line2}</> : null}
              <br />
              {order.city}{order.state ? `, ${order.state}` : ""} {order.postcode}
              <br />
              {order.country}
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={{ padding: "24px 0", textAlign: "center" }}>
            <Text style={footer_text}>
              Questions? Contact us at{" "}
              <Link href="mailto:aiefashionllc@gmail.com" style={{ color: "#D4AF37" }}>
                aiefashionllc@gmail.com
              </Link>
            </Text>
            <Text style={footer_text}>
              14-day returns policy applies.
            </Text>
            <Text style={{ ...footer_text, marginTop: "16px", color: "#A8A7A3" }}>
              Aiefashion · Lanham, Maryland, USA
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ── Styles ─────────────────────────────────────────────── */
const body = { backgroundColor: "#FDFBF7", fontFamily: "Instrument Sans, Arial, sans-serif" };
const container = { maxWidth: "600px", margin: "0 auto", backgroundColor: "#FFFFFF", border: "1px solid #E8E5E0" };
const header = { backgroundColor: "#1C1C1A", padding: "32px 40px", textAlign: "center" };
const brand = { color: "#FFFFFF", fontSize: "22px", letterSpacing: "6px", fontWeight: "400", margin: "0 0 4px" };
const tagline = { color: "#A8A7A3", fontSize: "11px", letterSpacing: "3px", margin: 0 };
const divider = { border: "none", borderTop: "1px solid #E8E5E0", margin: "0 40px" };
const h2 = { fontSize: "24px", color: "#1C1C1A", fontWeight: "400", margin: "0 0 12px", padding: "0 40px" };
const h3 = { fontSize: "13px", color: "#1C1C1A", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 16px", padding: "0 40px" };
const body_text = { fontSize: "14px", color: "#1C1C1A", lineHeight: "1.6", margin: "0 0 8px", padding: "0 40px" };
const item_title = { fontSize: "13px", color: "#1C1C1A", margin: "0 0 2px", padding: "0 40px" };
const item_meta = { fontSize: "12px", color: "#6B6A66", margin: 0, padding: "0 40px" };
const item_price = { fontSize: "13px", color: "#1C1C1A", margin: "0 0 2px", padding: "0 40px" };
const total_label = { fontSize: "13px", color: "#6B6A66", margin: 0, padding: "0 40px" };
const total_value = { fontSize: "14px", color: "#1C1C1A", margin: 0, padding: "0 40px" };
const footer_text = { fontSize: "12px", color: "#6B6A66", textAlign: "center", margin: "4px 0", padding: "0 40px" };
