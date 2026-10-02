/**
 * Reads a wall-art product's variant options as the shopper thinks of them:
 * a size (two dimensions in cm) and a frame finish.
 *
 * Option names and values are merchant-typed text in any of the store's
 * languages, so nothing here depends on an exact string. A size is any value
 * that parses as "W×H"; a frame is any value naming a finish we can draw.
 * An option that is neither renders as plain chips.
 */

export type FrameKind = "none" | "black" | "white" | "wood" | "gold";
export type OptionKind = "size" | "frame" | "plain";

export interface ArtSize {
  w: number;
  h: number;
}

interface OptionValueLike {
  value: string;
  hexColor?: string;
}

interface OptionLike {
  name: string;
  values: OptionValueLike[];
}

const SIZE = /(\d+(?:[.,]\d+)?)\s*(?:×|x|X|\*|✕|✖)\s*(\d+(?:[.,]\d+)?)/;

const FRAME_PATTERNS: Array<[FrameKind, RegExp]> = [
  ["none", /بدون|بلا|sans|without|no\s*frame|frameless|none/i],
  ["black", /أسود|اسود|سوداء|noir|black/i],
  ["white", /أبيض|ابيض|بيضاء|blanc|white/i],
  ["gold", /ذهب|doré|dore|gold/i],
  ["wood", /خشب|bois|wood|ch[êe]ne|oak|noyer|walnut|naturel|natural/i],
];

const FRAME_NAME = /إطار|اطار|برواز|cadre|frame|finition|finish/i;
const SIZE_NAME = /مقاس|قياس|حجم|taille|format|dimension|size/i;

export function parseSize(value: string): ArtSize | null {
  const match = SIZE.exec(value);
  if (!match) return null;
  const w = Number(match[1].replace(",", "."));
  const h = Number(match[2].replace(",", "."));
  if (!(w > 0) || !(h > 0)) return null;
  return { w, h };
}

export function frameKindOf(value: string): FrameKind | null {
  for (const [kind, pattern] of FRAME_PATTERNS) {
    if (pattern.test(value)) return kind;
  }
  return null;
}

export function optionKind(option: OptionLike): OptionKind {
  if (option.values.length === 0) return "plain";
  if (option.values.every((v) => parseSize(v.value))) return "size";
  if (SIZE_NAME.test(option.name) && option.values.some((v) => parseSize(v.value))) return "size";
  const framed = option.values.filter((v) => frameKindOf(v.value) || v.hexColor);
  if (framed.length === option.values.length) return "frame";
  if (FRAME_NAME.test(option.name) && framed.length > 0) return "frame";
  return "plain";
}

/** The first size option of a product, with every parseable value. */
export function sizeOption(options: OptionLike[] | null | undefined) {
  const option = options?.find((o) => optionKind(o) === "size");
  if (!option) return null;
  const sizes = option.values
    .map((v) => ({ value: v.value, size: parseSize(v.value) }))
    .filter((v): v is { value: string; size: ArtSize } => v.size !== null);
  return sizes.length > 0 ? { name: option.name, sizes } : null;
}

/** The first frame option of a product, each value with the finish it names. */
export function frameOption(options: OptionLike[] | null | undefined) {
  const option = options?.find((o) => optionKind(o) === "frame");
  if (!option) return null;
  return {
    name: option.name,
    frames: option.values.map((v) => ({
      value: v.value,
      kind: frameKindOf(v.value),
      hexColor: v.hexColor ?? null,
    })),
  };
}

interface ImageLike {
  src: string;
  altText?: string | null;
}

/**
 * The flat artwork, as opposed to the room photo.
 *
 * Convention for this brand (THEME_GUIDE.md): the room mockup is uploaded
 * first — it is the cover used by ads, cards and the gallery — and the flat
 * artwork second. Frame and size previews draw the artwork, so they read the
 * second image, falling back to the only one there is.
 */
export function artworkImage<T extends ImageLike>(images: T[] | null | undefined): T | null {
  if (!images || images.length === 0) return null;
  return images[1] ?? images[0];
}

/** Lowest price a variant product sells at, or the product price. */
export function fromPrice(product: { price: number; variants?: Array<{ price: number }> | null }): number {
  const prices = (product.variants ?? []).map((v) => v.price).filter((p) => p > 0);
  return prices.length > 0 ? Math.min(...prices) : product.price;
}

export function formatPrice(n: number): string {
  return n.toLocaleString("ar-DZ");
}
