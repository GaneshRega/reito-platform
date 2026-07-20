/**
 * All money formatting lives here. Import from this file only.
 * Never format rupees inline or in mockData.
 */

/** General purpose: ₹1.45Cr / ₹82L / ₹9,600 */
export function formatINR(rupees: number): string {
  if (rupees >= 10_000_000) {
    const cr = rupees / 10_000_000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2).replace(/0$/, "")}Cr`;
  }
  if (rupees >= 100_000) {
    const lakh = rupees / 100_000;
    return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(1)}L`;
  }
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/** Slider display: under ₹1Cr → ₹75L (no decimal); ₹1Cr+ → ₹1.2Cr (one decimal). */
export function formatBudget(rupees: number): string {
  if (rupees >= 10_000_000) {
    const cr = rupees / 10_000_000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(1)}Cr`;
  }
  const lakh = Math.round(rupees / 100_000);
  return `₹${lakh}L`;
}

/** "₹8,100/sqft" */
export function formatPerSqft(value: number): string {
  return `₹${value.toLocaleString("en-IN")}/sqft`;
}

/** 6 → "6mo", 12 → "1yr", 18 → "18mo", 48 → "4yr" */
export function formatTimeline(months: number): string {
  if (months % 12 === 0) return `${months / 12}yr`;
  return `${months}mo`;
}
