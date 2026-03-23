/**
 * US-based store — no VAT.
 * Sales tax is not collected at checkout (handled separately if required by state law).
 * These stubs keep call-sites unchanged.
 */

/** @returns {number} always 0 */
export function calculateVAT(_subtotal, _countryCode) {
  return 0;
}

/** @returns {boolean} always false */
export function isVATApplicable(_countryCode) {
  return false;
}
