const CURRENCY_LOCALES = {
  GBP: "en-GB",
  USD: "en-US",
  EUR: "de-DE",
  NGN: "en-NG",
};

/**
 * Format a monetary value for display.
 * @param {number} amountInSmallestUnit - pence (GBP/EUR/USD) or kobo (NGN)
 * @param {"GBP"|"USD"|"EUR"|"NGN"} currency
 */
export function formatCurrency(amountInSmallestUnit, currency = "GBP") {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency] || "en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountInSmallestUnit / 100);
}

export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function truncate(str, length = 100) {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}
