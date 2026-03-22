/**
 * Shipping zones and rates (in pence).
 * Rates are per-order flat fees.
 */
const SHIPPING_ZONES = [
  { countries: ["GB"], rate: 395, label: "UK Standard (3–5 days)" },
  { countries: ["NG"], rate: 2500, label: "Nigeria (7–14 days)" },
  {
    countries: ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"],
    rate: 995,
    label: "Europe (5–10 days)",
  },
];

const DEFAULT_RATE = { rate: 1495, label: "International (10–21 days)" };

/**
 * @param {string} countryCode - ISO 3166-1 alpha-2
 * @returns {{ rate: number, label: string }}
 */
export function getShippingOption(countryCode) {
  const zone = SHIPPING_ZONES.find((z) => z.countries.includes(countryCode?.toUpperCase()));
  return zone ?? DEFAULT_RATE;
}

/**
 * @param {string} countryCode
 * @returns {number} shipping cost in pence
 */
export function calculateShipping(countryCode) {
  return getShippingOption(countryCode).rate;
}
