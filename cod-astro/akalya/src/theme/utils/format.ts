/**
 * Display formatting shared by every server-rendered price.
 *
 * "ar-DZ" on purpose, in every language: the client scripts (product.ts,
 * cart-render.ts) re-render prices with the same locale, so a price formatted
 * here never changes shape the moment a shopper taps a variant.
 */
export function formatPrice(n: number): string {
  return n.toLocaleString("ar-DZ");
}

/** "{n} products" with a distinct singular, both from the content pack. */
export function productCount(n: number, one: string, many: string): string {
  return (n === 1 ? one : many).replace("{n}", String(n));
}

/** Rounded discount percentage, or 0 when there is no real discount. */
export function discountPercent(price: number, compareAt: number | null | undefined): number {
  if (compareAt == null || compareAt <= price || compareAt <= 0) return 0;
  return Math.round((1 - price / compareAt) * 100);
}
