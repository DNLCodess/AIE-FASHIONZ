/**
 * Shipping zones and rates (in cents / USD).
 * Rates are per-order flat fees.
 */
const SHIPPING_ZONES = [
  { countries: ["US"], rate: 0, label: "US Standard (3–5 days)", freeThreshold: 7500 },
  { countries: ["NG"], rate: 2500, label: "Nigeria (7–14 days)" },
  {
    countries: ["CA", "MX"],
    rate: 1299,
    label: "Canada & Mexico (5–10 days)",
  },
  {
    countries: ["GB", "DE", "FR", "IE", "NL", "IT", "ES", "PT", "BE", "AT", "CH", "SE", "NO", "DK", "FI", "PL", "AU", "NZ"],
    rate: 1999,
    label: "International (7–14 days)",
  },
];

const DEFAULT_RATE = { rate: 2499, label: "International (10–21 days)" };

/**
 * @param {string} countryCode - ISO 3166-1 alpha-2
 * @returns {{ rate: number, label: string, freeThreshold?: number }}
 */
export function getShippingOption(countryCode) {
  const zone = SHIPPING_ZONES.find((z) => z.countries.includes(countryCode?.toUpperCase()));
  return zone ?? DEFAULT_RATE;
}

/**
 * @param {string} countryCode
 * @param {number} subtotal - in cents
 * @returns {number} shipping cost in cents
 */
export function calculateShipping(countryCode, subtotal = 0) {
  const option = getShippingOption(countryCode);
  if (option.freeThreshold !== undefined && subtotal >= option.freeThreshold) return 0;
  return option.rate;
}
