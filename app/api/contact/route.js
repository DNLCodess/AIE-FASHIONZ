import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Escape HTML special characters to prevent XSS in email templates */
function escHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const ISSUE_LABELS = {
  payment: "Payment Issue",
  order: "Order / Delivery Issue",
  returns: "Returns & Refunds",
  product: "Product Question",
  general: "General Enquiry",
  other: "Other",
};

export async function POST(req) {
  try {
    const { name, email, issueType, orderRef, message } = await req.json();

    // Server-side length caps to prevent abuse
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const label = ISSUE_LABELS[issueType] ?? "General Enquiry";

    // Escape all user-supplied values before interpolating into HTML
    const safeName = escHtml(name.trim().slice(0, 200));
    const safeEmail = escHtml(email.trim().slice(0, 254));
    const safeOrderRef = escHtml((orderRef ?? "").trim().slice(0, 50));
    const safeMessage = escHtml(message.trim().slice(0, 2000));
    const safeLabel = escHtml(label);

    const subject = safeOrderRef
      ? `[${safeLabel}] Order ${safeOrderRef} — ${safeName}`
      : `[${safeLabel}] ${safeName}`;

    await resend.emails.send({
      from: "Aiefashion Support <noreply@aiefashion.com>",
      to: "aiefashionllc@gmail.com",
      replyTo: email.trim(),
      subject,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#1C1C1A;margin-bottom:4px">${safeLabel}</h2>
          <p style="color:#6B6A66;font-size:13px;margin-top:0">New message via aiefashion.com</p>
          <hr style="border:none;border-top:1px solid #E8E5E0;margin:20px 0"/>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#6B6A66;width:130px">Name</td><td style="padding:6px 0;color:#1C1C1A">${safeName}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6A66">Email</td><td style="padding:6px 0;color:#1C1C1A"><a href="mailto:${safeEmail}" style="color:#8B6C14">${safeEmail}</a></td></tr>
            <tr><td style="padding:6px 0;color:#6B6A66">Issue type</td><td style="padding:6px 0;color:#1C1C1A">${safeLabel}</td></tr>
            ${safeOrderRef ? `<tr><td style="padding:6px 0;color:#6B6A66">Order ref</td><td style="padding:6px 0;color:#1C1C1A;font-weight:600">${safeOrderRef}</td></tr>` : ""}
          </table>
          <hr style="border:none;border-top:1px solid #E8E5E0;margin:20px 0"/>
          <h3 style="color:#1C1C1A;font-size:14px;margin-bottom:8px">Message</h3>
          <p style="color:#6B6A66;font-size:14px;line-height:1.7;white-space:pre-wrap">${safeMessage}</p>
          <hr style="border:none;border-top:1px solid #E8E5E0;margin:24px 0"/>
          <p style="font-size:12px;color:#A8A7A3">Reply directly to this email to respond to the customer.</p>
        </div>
      `,
    });

    // Auto-reply to customer
    await resend.emails.send({
      from: "Aiefashion <noreply@aiefashion.com>",
      to: email.trim(),
      subject: `We've received your message — ${safeLabel}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#1C1C1A">Thank you, ${safeName}.</h2>
          <p style="color:#6B6A66;line-height:1.7">We've received your message and our team will respond within <strong style="color:#1C1C1A">24 hours</strong> (Monday–Friday, 9am–5pm EST).</p>
          ${safeOrderRef ? `<p style="color:#6B6A66">Your enquiry references order <strong style="color:#1C1C1A">${safeOrderRef}</strong>.</p>` : ""}
          <p style="color:#6B6A66;line-height:1.7">If your issue is urgent, you can also reach us directly on WhatsApp.</p>
          <hr style="border:none;border-top:1px solid #E8E5E0;margin:20px 0"/>
          <p style="font-size:12px;color:#A8A7A3">Aiefashion · aiefashionllc@gmail.com</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
