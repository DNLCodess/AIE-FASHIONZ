import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const label = ISSUE_LABELS[issueType] ?? "General Enquiry";
    const subject = orderRef
      ? `[${label}] Order ${orderRef} — ${name}`
      : `[${label}] ${name}`;

    await resend.emails.send({
      from: "AIE Fashionz Support <noreply@aiefashionz.com>",
      to: "support@aiefashionz.com",
      replyTo: email,
      subject,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#1C1C1A;margin-bottom:4px">${label}</h2>
          <p style="color:#6B6A66;font-size:13px;margin-top:0">New message via aiefashionz.com</p>
          <hr style="border:none;border-top:1px solid #E8E5E0;margin:20px 0"/>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#6B6A66;width:130px">Name</td><td style="padding:6px 0;color:#1C1C1A">${name}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6A66">Email</td><td style="padding:6px 0;color:#1C1C1A"><a href="mailto:${email}" style="color:#8B6C14">${email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#6B6A66">Issue type</td><td style="padding:6px 0;color:#1C1C1A">${label}</td></tr>
            ${orderRef ? `<tr><td style="padding:6px 0;color:#6B6A66">Order ref</td><td style="padding:6px 0;color:#1C1C1A;font-weight:600">${orderRef}</td></tr>` : ""}
          </table>
          <hr style="border:none;border-top:1px solid #E8E5E0;margin:20px 0"/>
          <h3 style="color:#1C1C1A;font-size:14px;margin-bottom:8px">Message</h3>
          <p style="color:#6B6A66;font-size:14px;line-height:1.7;white-space:pre-wrap">${message}</p>
          <hr style="border:none;border-top:1px solid #E8E5E0;margin:24px 0"/>
          <p style="font-size:12px;color:#A8A7A3">Reply directly to this email to respond to the customer.</p>
        </div>
      `,
    });

    // Auto-reply to customer
    await resend.emails.send({
      from: "AIE Fashionz <noreply@aiefashionz.com>",
      to: email,
      subject: `We've received your message — ${label}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#1C1C1A">Thank you, ${name}.</h2>
          <p style="color:#6B6A66;line-height:1.7">We've received your message and our team will respond within <strong style="color:#1C1C1A">24 hours</strong> (Monday–Friday, 9am–5pm GMT).</p>
          ${orderRef ? `<p style="color:#6B6A66">Your enquiry references order <strong style="color:#1C1C1A">${orderRef}</strong>.</p>` : ""}
          <p style="color:#6B6A66;line-height:1.7">If your issue is urgent, you can also reach us directly on WhatsApp.</p>
          <hr style="border:none;border-top:1px solid #E8E5E0;margin:20px 0"/>
          <p style="font-size:12px;color:#A8A7A3">AIE Fashionz · support@aiefashionz.com</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
