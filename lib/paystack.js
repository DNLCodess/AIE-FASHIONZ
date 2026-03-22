/**
 * Paystack integration via native fetch (no SDK needed).
 * Server-side only — never call from Client Components.
 */

const PAYSTACK_BASE = "https://api.paystack.co";

const headers = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  "Content-Type": "application/json",
});

/**
 * Initialize a Paystack transaction.
 * @param {{ email: string, amountInKobo: number, reference: string, callbackUrl: string, metadata?: object }} params
 * @returns {Promise<{ authorization_url: string, access_code: string, reference: string }>}
 */
export async function initializeTransaction({ email, amountInKobo, reference, callbackUrl, metadata = {} }) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      email,
      amount: amountInKobo,
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });

  const json = await res.json();
  if (!json.status) throw new Error(`Paystack init failed: ${json.message}`);
  return json.data;
}

/**
 * Verify a Paystack transaction by reference.
 * @param {string} reference
 * @returns {Promise<object>} Paystack transaction data
 */
export async function verifyTransaction(reference) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: headers(),
  });

  const json = await res.json();
  if (!json.status) throw new Error(`Paystack verify failed: ${json.message}`);
  return json.data;
}
