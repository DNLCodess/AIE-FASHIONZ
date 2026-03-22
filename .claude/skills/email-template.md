# Skill: Email Template

Read before creating any Resend/React Email template.

## Setup

```js
// lib/email/send.js
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  template: EmailTemplate,
  props,
}) {
  const { error } = await resend.emails.send({
    from: "AIE Fashionz <hello@aiefashionz.com>",
    to,
    subject,
    react: <EmailTemplate {...props} />,
  });
  if (error) throw new Error(`Email failed: ${error.message}`);
}
```

## Brand Token Reference (for email — inline styles only, CSS variables don't work in email)

```
Background:    #FDFBF7
Surface:       #FFFFFF
Text primary:  #1C1C1A
Text secondary:#6B6A66
Border:        #E8E5E0
Gold:          #D4AF37
Gold hover:    #BF9B2F
Error:         #C0392B
Success:       #2D7A47
Heading font:  Georgia, serif  (Instrument Serif won't load in email — Georgia is the safe serif fallback)
Body font:     Arial, sans-serif
```

## Base Template Structure

```jsx
// lib/email/components/BaseEmail.jsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
  Preview,
} from "@react-email/components";

export function BaseEmail({ preview, children }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.logo}>AIE FASHIONZ</Text>
          </Section>

          {/* Content */}
          {children}

          {/* Footer */}
          <Hr style={styles.divider} />
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              AIE Fashionz Ltd · [Registered Address] · Company No: [XXXXXXXX]
            </Text>
            <Text style={styles.footerText}>
              <Link
                href="https://www.aiefashionz.com/privacy-policy"
                style={styles.footerLink}
              >
                Privacy Policy
              </Link>
              {" · "}
              <Link
                href="https://www.aiefashionz.com/shipping-returns"
                style={styles.footerLink}
              >
                Returns Policy
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#FDFBF7",
    margin: 0,
    padding: 0,
    fontFamily: "Arial, sans-serif",
  },
  container: { maxWidth: "600px", margin: "0 auto", padding: "40px 24px" },
  header: { textAlign: "center", marginBottom: "32px" },
  logo: {
    fontFamily: "Georgia, serif",
    fontSize: "24px",
    fontWeight: "400",
    color: "#1C1C1A",
    letterSpacing: "4px",
    margin: 0,
  },
  divider: { borderTop: "1px solid #E8E5E0", margin: "32px 0" },
  footer: { textAlign: "center" },
  footerText: {
    fontSize: "12px",
    color: "#A8A7A3",
    lineHeight: "1.6",
    margin: "4px 0",
  },
  footerLink: { color: "#6B6A66", textDecoration: "underline" },
};
```

## Order Confirmation Template

```jsx
// lib/email/templates/OrderConfirmation.jsx
import {
  Section,
  Text,
  Row,
  Column,
  Img,
  Hr,
  Link,
} from "@react-email/components";
import { BaseEmail } from "../components/BaseEmail";

export function OrderConfirmationEmail({ order }) {
  const formattedTotal = `£${(order.total / 100).toFixed(2)}`;

  return (
    <BaseEmail
      preview={`Order confirmed — ${order.id.slice(0, 8).toUpperCase()}`}
    >
      {/* Hero */}
      <Section style={{ textAlign: "center", marginBottom: "32px" }}>
        <Text
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "28px",
            color: "#1C1C1A",
            margin: "0 0 8px",
          }}
        >
          Order Confirmed
        </Text>
        <Text style={{ fontSize: "14px", color: "#6B6A66", margin: 0 }}>
          Thank you. Your order is being prepared.
        </Text>
      </Section>

      {/* Order reference */}
      <Section
        style={{
          backgroundColor: "#F7F0D8",
          padding: "16px",
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        <Text
          style={{
            fontSize: "12px",
            color: "#6B6A66",
            margin: "0 0 4px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Order Reference
        </Text>
        <Text
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "20px",
            color: "#D4AF37",
            margin: 0,
          }}
        >
          #{order.id.slice(0, 8).toUpperCase()}
        </Text>
      </Section>

      {/* Order items */}
      {order.order_items.map((item) => (
        <Row key={item.id} style={{ marginBottom: "16px" }}>
          <Column style={{ width: "80px" }}>
            <Img
              src={item.product_images?.[0]?.url}
              width={72}
              height={96}
              style={{ borderRadius: "2px" }}
              alt={item.title}
            />
          </Column>
          <Column style={{ paddingLeft: "16px" }}>
            <Text
              style={{
                fontSize: "14px",
                color: "#1C1C1A",
                margin: "0 0 4px",
                fontWeight: "500",
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{ fontSize: "13px", color: "#6B6A66", margin: "0 0 4px" }}
            >
              {item.variant?.size && `Size: ${item.variant.size}`}
              {item.variant?.colour && ` · ${item.variant.colour}`}
              {` · Qty: ${item.quantity}`}
            </Text>
            <Text
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "14px",
                color: "#D4AF37",
                margin: 0,
              }}
            >
              £{(item.total_price / 100).toFixed(2)}
            </Text>
          </Column>
        </Row>
      ))}

      <Hr style={{ borderTop: "1px solid #E8E5E0", margin: "24px 0" }} />

      {/* Totals */}
      <Section>
        {[
          ["Subtotal", `£${(order.subtotal / 100).toFixed(2)}`],
          [
            "Shipping",
            order.shipping_cost === 0
              ? "Free"
              : `£${(order.shipping_cost / 100).toFixed(2)}`,
          ],
          order.vat_amount > 0 && [
            "VAT (20%)",
            `£${(order.vat_amount / 100).toFixed(2)}`,
          ],
          order.discount_amount > 0 && [
            "Discount",
            `-£${(order.discount_amount / 100).toFixed(2)}`,
          ],
        ]
          .filter(Boolean)
          .map(([label, value]) => (
            <Row key={label}>
              <Column>
                <Text style={{ fontSize: "14px", color: "#6B6A66" }}>
                  {label}
                </Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ fontSize: "14px", color: "#1C1C1A" }}>
                  {value}
                </Text>
              </Column>
            </Row>
          ))}
        <Row>
          <Column>
            <Text
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "16px",
                color: "#1C1C1A",
                fontWeight: "600",
              }}
            >
              Total
            </Text>
          </Column>
          <Column style={{ textAlign: "right" }}>
            <Text
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "16px",
                color: "#D4AF37",
              }}
            >
              {formattedTotal}
            </Text>
          </Column>
        </Row>
      </Section>

      <Hr style={{ borderTop: "1px solid #E8E5E0", margin: "24px 0" }} />

      {/* Shipping address */}
      <Section>
        <Text
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#6B6A66",
            marginBottom: "8px",
          }}
        >
          Delivering to
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: "#1C1C1A",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          {order.shipping_address.line1}
          <br />
          {order.shipping_address.line2 && (
            <>
              {order.shipping_address.line2}
              <br />
            </>
          )}
          {order.shipping_address.city}, {order.shipping_address.postcode}
          <br />
          {order.shipping_address.country}
        </Text>
      </Section>

      {/* CTA */}
      <Section style={{ textAlign: "center", marginTop: "32px" }}>
        <Link
          href={`https://www.aiefashionz.com/account/orders/${order.id}`}
          style={{
            backgroundColor: "#D4AF37",
            color: "#1C1C1A",
            padding: "14px 32px",
            fontSize: "14px",
            fontFamily: "Arial, sans-serif",
            textDecoration: "none",
            display: "inline-block",
            borderRadius: "2px",
          }}
        >
          Track Your Order
        </Link>
      </Section>
    </BaseEmail>
  );
}
```

## Other Required Templates

Create these using the same `BaseEmail` wrapper:

| Template file              | Trigger                  | Key content                                         |
| -------------------------- | ------------------------ | --------------------------------------------------- |
| `ShippingNotification.jsx` | Order status → shipped   | Tracking number, courier link, estimated delivery   |
| `PasswordReset.jsx`        | Forgot password          | Reset link (expires 1hr), security notice           |
| `WelcomeEmail.jsx`         | New account registration | Welcome message, first order CTA, optional discount |
| `OrderCancellation.jsx`    | Order cancelled          | Order ref, reason, refund timeline                  |

## Sending Emails (usage)

```js
import { sendEmail } from "@/lib/email/send";
import { OrderConfirmationEmail } from "@/lib/email/templates/OrderConfirmation";

await sendEmail({
  to: order.guest_email ?? order.profiles.email,
  subject: `Order confirmed — #${order.id.slice(0, 8).toUpperCase()}`,
  template: OrderConfirmationEmail,
  props: { order },
});
```

## Rules

- All styles must be inline — no external CSS, no CSS variables (email clients don't support them)
- Use Georgia/Arial as font fallbacks — custom fonts don't render in most email clients
- Test in Litmus or Email on Acid before launch — Gmail, Outlook, Apple Mail all render differently
- Never hardcode customer PII in template strings — always pass as props
- Keep email width max 600px
- All links must be absolute URLs
