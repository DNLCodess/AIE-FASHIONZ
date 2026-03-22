/**
 * VAT is charged at 20% for UK orders only (per UK HMRC rules).
 * All amounts in pence.
 */
const UK_VAT_RATE = 0.2;

/**
 * @param {number} subtotal - in pence (pre-VAT)
 * @param {string} countryCode - ISO 3166-1 alpha-2
 * @returns {number} VAT amount in pence (0 for non-UK)
 */
export function calculateVAT(subtotal, countryCode) {
  if (countryCode?.toUpperCase() !== "GB") return 0;
  return Math.round(subtotal * UK_VAT_RATE);
}

/**
 * @param {string} countryCode
 * @returns {boolean}
 */
export function isVATApplicable(countryCode) {
  return countryCode?.toUpperCase() === "GB";
}
