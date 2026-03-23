"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Package, CreditCard, RotateCcw, HelpCircle, Send, CheckCircle, AlertCircle } from "lucide-react";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "13014335307";

const ISSUE_TYPES = [
  { value: "payment",  label: "Payment issue",          icon: CreditCard,     desc: "Charge problems, failed payments, refund status" },
  { value: "order",    label: "Order / delivery",        icon: Package,        desc: "Missing parcels, delays, tracking, wrong items" },
  { value: "returns",  label: "Returns & refunds",       icon: RotateCcw,      desc: "Start a return, exchange, or check refund status" },
  { value: "product",  label: "Product question",        icon: HelpCircle,     desc: "Sizing, materials, availability, styling advice" },
  { value: "general",  label: "General enquiry",         icon: MessageCircle,  desc: "Anything else — we're happy to help" },
];

const ORDER_ISSUE_TYPES = ["payment", "order", "returns"];

const inputStyle = {
  padding: "12px 14px",
  border: "1px solid var(--color-border)",
  backgroundColor: "var(--color-surface)",
  fontFamily: "var(--font-body)",
  fontSize: "14px",
  color: "var(--color-foreground)",
  outline: "none",
  width: "100%",
  transition: "border-color 200ms ease",
};

const labelStyle = {
  fontFamily: "var(--font-body)",
  fontSize: "11px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-muted)",
  display: "block",
  marginBottom: "6px",
};

export default function ContactPage() {
  const [step, setStep] = useState("type"); // "type" | "form" | "success"
  const [issueType, setIssueType] = useState("");
  const [form, setForm] = useState({ name: "", email: "", orderRef: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedIssue = ISSUE_TYPES.find((t) => t.value === issueType);
  const needsOrderRef = ORDER_ISSUE_TYPES.includes(issueType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, issueType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStep("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>

      {/* Page header */}
      <div style={{ maxWidth: "680px", marginBottom: "3rem" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: "0.75rem" }}>
          Customer care
        </p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--color-foreground)", lineHeight: 1.1, marginBottom: "1rem" }}>
          We&apos;re here to help.
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-muted)", lineHeight: 1.8 }}>
          Monday–Friday, 9am–5pm GMT. We respond to all messages within 24 hours.
          For urgent issues, use the WhatsApp button below.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem", maxWidth: "1000px" }} className="lg:grid-cols-[1fr_340px]">

        {/* ── LEFT: form flow ─────────────────────────────────── */}
        <div>

          {/* Step 1 — choose issue type */}
          {step === "type" && (
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-muted)", marginBottom: "1.5rem" }}>
                What can we help you with today?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {ISSUE_TYPES.map(({ value, label, icon: Icon, desc }) => (
                  <button
                    key={value}
                    onClick={() => { setIssueType(value); setStep("form"); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "18px 20px",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "border-color 150ms ease, background-color 150ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-gold)";
                      e.currentTarget.style.backgroundColor = "var(--color-surface-raised)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.backgroundColor = "var(--color-surface)";
                    }}
                  >
                    <span style={{ width: "36px", height: "36px", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--color-gold)" }}>
                      <Icon size={16} />
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: "var(--color-foreground)", display: "block", marginBottom: "3px" }}>
                        {label}
                      </span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-muted)" }}>
                        {desc}
                      </span>
                    </span>
                    <span style={{ color: "var(--color-muted)", fontSize: "18px" }}>›</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — form */}
          {step === "form" && (
            <div>
              {/* Back + current issue label */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
                <button
                  onClick={() => setStep("type")}
                  style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  ← Back
                </button>
                {selectedIssue && (
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-gold)", border: "1px solid var(--color-gold)", padding: "3px 10px" }}>
                    {selectedIssue.label}
                  </span>
                )}
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Name + Email row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="grid-cols-1 sm:grid-cols-2">
                  <div>
                    <label style={labelStyle}>Full name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                    />
                  </div>
                </div>

                {/* Order reference */}
                <div>
                  <label style={labelStyle}>
                    Order reference {needsOrderRef ? "*" : "(optional)"}
                  </label>
                  <input
                    type="text"
                    required={needsOrderRef}
                    placeholder="e.g. AIE-XXXXXXXXXX"
                    value={form.orderRef}
                    onChange={(e) => setForm((f) => ({ ...f, orderRef: e.target.value }))}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                  />
                  {needsOrderRef && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-muted)", marginTop: "5px" }}>
                      Find your reference in your confirmation email or{" "}
                      <Link href="/account/orders" style={{ color: "var(--color-gold)" }}>your orders</Link>.
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea
                    required
                    rows={6}
                    placeholder={
                      issueType === "payment" ? "Describe the payment issue — include the amount charged and when it occurred…" :
                      issueType === "order"   ? "Describe the issue with your order — what happened, when did you place it…" :
                      issueType === "returns" ? "Tell us which item(s) you'd like to return and why…" :
                      "How can we help you today?"
                    }
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 14px", backgroundColor: "rgba(192,57,43,0.06)", border: "1px solid var(--color-error)" }}>
                    <AlertCircle size={15} style={{ color: "var(--color-error)", flexShrink: 0, marginTop: "1px" }} />
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-error)" }}>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "14px",
                    backgroundColor: loading ? "var(--color-border)" : "var(--color-gold)",
                    color: "var(--color-foreground)",
                    border: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background-color 200ms ease",
                  }}
                >
                  <Send size={14} />
                  {loading ? "Sending…" : "Send message"}
                </button>

                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-subtle)", lineHeight: 1.6 }}>
                  You&apos;ll receive a confirmation email and we&apos;ll reply within 24 hours.
                </p>
              </form>
            </div>
          )}

          {/* Step 3 — success */}
          {step === "success" && (
            <div style={{ padding: "3rem 2rem", border: "1px solid var(--color-border)", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "9999px", border: "1px solid var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <CheckCircle size={22} style={{ color: "var(--color-success)" }} />
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--color-foreground)", marginBottom: "0.75rem" }}>
                Message sent.
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-muted)", lineHeight: 1.8, marginBottom: "2rem", maxWidth: "380px", margin: "0 auto 2rem" }}>
                We&apos;ve received your message and sent a confirmation to <strong>{form.email}</strong>. Our team will reply within 24 hours.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => { setStep("type"); setForm({ name: "", email: "", orderRef: "", message: "" }); setIssueType(""); }}
                  style={{ padding: "11px 24px", border: "1px solid var(--color-border)", backgroundColor: "transparent", fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", color: "var(--color-muted)" }}
                >
                  New message
                </button>
                <Link
                  href="/account/orders"
                  style={{ padding: "11px 24px", backgroundColor: "var(--color-gold)", color: "var(--color-foreground)", fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
                >
                  View my orders
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: contact info sidebar ─────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hello Aiefashion! I need help with my order.")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "18px 20px",
              backgroundColor: "#25D366",
              textDecoration: "none",
              transition: "background-color 200ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1DA851")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#25D366")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "14px", color: "white", marginBottom: "2px" }}>Chat on WhatsApp</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>Fastest response — usually within minutes</p>
            </div>
          </a>

          {/* Contact info */}
          <div style={{ border: "1px solid var(--color-border)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-subtle)" }}>
              Other ways to reach us
            </p>
            {[
              { label: "General support", email: "aiefashionllc@gmail.com" },
              { label: "Returns & refunds", email: "aiefashionllc@gmail.com" },
              { label: "Phone / WhatsApp", email: "+1 (301) 433-5307", href: "tel:+13014335307" },
            ].map(({ label, email, href }) => (
              <div key={email} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-subtle)", marginBottom: "4px" }}>{label}</p>
                <a href={href || `mailto:${email}`} style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gold)", textDecoration: "none" }}>{email}</a>
              </div>
            ))}
          </div>

          {/* Hours */}
          <div style={{ border: "1px solid var(--color-border)", padding: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-subtle)", marginBottom: "0.75rem" }}>
              Support hours
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-foreground)", marginBottom: "4px" }}>Mon – Fri, 9am – 5pm GMT</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-muted)" }}>We aim to reply within 24 hours.<br />WhatsApp is monitored 7 days a week.</p>
          </div>

          {/* Quick links */}
          <div style={{ border: "1px solid var(--color-border)", padding: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-subtle)", marginBottom: "0.75rem" }}>
              Quick help
            </p>
            {[
              { href: "/faq", label: "Frequently asked questions" },
              { href: "/returns", label: "Returns & refund policy" },
              { href: "/account/orders", label: "Track my order" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-gold)", textDecoration: "none", padding: "7px 0", borderTop: "1px solid var(--color-border)" }}>
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
