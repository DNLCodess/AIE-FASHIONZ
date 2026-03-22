import { Resend } from "resend";
import OrderConfirmation from "./templates/OrderConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an order confirmation email.
 * @param {object} order - Full order row with order_items joined
 */
export async function sendOrderConfirmation(order) {
  await resend.emails.send({
    from: "AIE Fashionz <orders@aiefashionz.com>",
    to: order.email,
    subject: `Order confirmed — ${order.reference}`,
    react: OrderConfirmation({ order }),
  });
}
