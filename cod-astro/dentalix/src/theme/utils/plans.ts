/**
 * Plan helpers — turn catalogue data into pricing-card shapes.
 *
 * Products stay the single source of truth: a plan's tagline and feature
 * bullets come from its own description, and the duration toggle exists only
 * when every plan shares one variant option with the same values.
 */

/** Price formatting shared with product.ts, so server and script never disagree. */
export function fmt(n: number): string {
  return Math.round(n).toLocaleString("ar-DZ");
}

/** `{key}` template filling for content keys. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

function capitalise(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

/**
 * "Pour le cabinet de groupe : jusqu'à 3 praticiens, rappels SMS/WhatsApp, stock et statistiques."
 * → tagline "Pour le cabinet de groupe", points ["Jusqu'à 3 praticiens", "Rappels SMS/WhatsApp", "Stock", "Statistiques"].
 * A description without a colon stays a tagline with no points.
 */
export function planPoints(description: string | null | undefined): { tagline: string | null; points: string[] } {
  const text = (description ?? "").replace(/\s+/g, " ").trim();
  if (!text) return { tagline: null, points: [] };
  const colon = text.search(/\s?[:：]\s/);
  if (colon < 0) return { tagline: text, points: [] };
  const tagline = text.slice(0, colon).trim();
  const rest = text.slice(colon).replace(/^\s?[:：]\s/, "");
  const points = rest
    .split(/[,;،؛]|\.(?:\s|$)|\s+(?:et|and)\s+/i)
    .map((p) => p.trim().replace(/\.$/, ""))
    .filter((p) => p.length > 1)
    .map(capitalise);
  return { tagline: tagline || null, points };
}

export interface DurationOption {
  name: string;
  values: string[];
}

interface VariantLike {
  id: string;
  price: number;
  compareAtPrice: number | null;
  variations: Record<string, string>;
  isDefault?: boolean;
  inventory?: number;
}

interface ProductLike {
  hasVariants?: boolean;
  variantOptions?: Array<{ name: string; values: Array<{ value: string }> }> | string | null;
  variants?: VariantLike[];
  price: number;
  compareAtPrice: number | null;
}

function optionsOf(product: ProductLike): Array<{ name: string; values: Array<{ value: string }> }> {
  const raw = product.variantOptions;
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return raw;
}

/** The one option every plan shares (e.g. "Durée": ["1 an", "2 ans"]), or null. */
export function sharedDuration(products: ProductLike[]): DurationOption | null {
  if (products.length === 0) return null;
  let shared: DurationOption | null = null;
  for (const product of products) {
    const options = optionsOf(product);
    if (!product.hasVariants || options.length !== 1 || !product.variants?.length) return null;
    const option = { name: options[0].name, values: options[0].values.map((v) => v.value) };
    if (option.values.length < 2 || option.values.length > 4) return null;
    if (!shared) shared = option;
    else if (shared.name !== option.name || shared.values.join("|") !== option.values.join("|")) return null;
  }
  return shared;
}

export interface PlanPrice {
  value: string | null;
  price: number;
  compareAtPrice: number | null;
  saving: number;
}

/** Price per option value (or the single product price when there is no shared option). */
export function planPrices(product: ProductLike, duration: DurationOption | null): PlanPrice[] {
  const toPrice = (value: string | null, price: number, compare: number | null): PlanPrice => ({
    value,
    price,
    compareAtPrice: compare != null && compare > price ? compare : null,
    saving: compare != null && compare > price ? compare - price : 0,
  });
  if (!duration || !product.variants?.length) {
    const def = product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];
    return [toPrice(null, def?.price ?? product.price, def?.compareAtPrice ?? product.compareAtPrice)];
  }
  return duration.values.map((value) => {
    const variant = product.variants!.find((v) => v.variations?.[duration.name] === value);
    return toPrice(value, variant?.price ?? product.price, variant?.compareAtPrice ?? null);
  });
}
