/**
 * Live artwork preview (theme layer).
 *
 * product.ts owns the order state: it prices the variant, fills the hidden
 * inputs and marks the chosen chips with aria-pressed. This module only reads
 * that state back and repaints what depends on it — the frame previews, the
 * size-guide wall, the "selected" captions and the per-variant compare-at
 * price. It never writes a form value, so it cannot break an order.
 *
 * Contract (data attributes rendered by the art components):
 *   .variant-opt[data-option][data-value][aria-pressed][data-kind][data-frame-kind]
 *   [data-art-frame]                 → gets data-frame="<kind>"
 *   [data-size-guide]                → .sg-art[data-size-value] / .wd-size-tab[data-size-value]
 *   [data-option-current="<name>"]   → text of the chosen value
 *   [data-variant-text]              → every chosen value, joined
 *   [data-pick-option][data-pick-value] → a proxy that taps the matching chip
 *   [data-compare-display] / [data-save-badge][data-template]
 */

interface VariantLite {
  id: string;
  price: number;
  compareAtPrice: number | null;
}

function chosenChips(): HTMLButtonElement[] {
  const seen = new Set<string>();
  const chosen: HTMLButtonElement[] = [];
  document.querySelectorAll<HTMLButtonElement>('.variant-opt[aria-pressed="true"]').forEach((chip) => {
    const option = chip.dataset.option ?? "";
    if (seen.has(option)) return;
    seen.add(option);
    chosen.push(chip);
  });
  return chosen;
}

function fmt(n: number): string {
  return n.toLocaleString("ar-DZ");
}

function setVariantText(el: HTMLElement, values: string[]): void {
  el.replaceChildren();
  values.forEach((value, i) => {
    if (i > 0) el.append(" · ");
    const bdi = document.createElement("bdi");
    bdi.textContent = value;
    el.append(bdi);
  });
}

function currentVariant(): VariantLite | null {
  const bridge = document.getElementById("page-data");
  const input = document.getElementById("variant-id-input") as HTMLInputElement | null;
  if (!bridge || !input?.value) return null;
  try {
    const variants = JSON.parse(bridge.dataset.variants || "[]") as VariantLite[];
    return variants.find((v) => v.id === input.value) ?? null;
  } catch {
    return null;
  }
}

export function syncArtPreview(): void {
  const chips = chosenChips();
  const frameChip = chips.find((c) => c.dataset.kind === "frame");
  const sizeChip = chips.find((c) => c.dataset.kind === "size");
  const frame = frameChip?.dataset.frameKind || "";

  if (frameChip) {
    document.querySelectorAll<HTMLElement>("[data-art-frame]").forEach((el) => {
      el.dataset.frame = frame || "none";
    });
  }

  document.querySelectorAll<HTMLElement>("[data-option-current]").forEach((el) => {
    const chip = chips.find((c) => c.dataset.option === el.dataset.optionCurrent);
    if (chip) el.textContent = chip.dataset.value ?? "";
  });

  const values = chips.map((c) => c.dataset.value ?? "").filter(Boolean);
  if (values.length > 0) {
    document.querySelectorAll<HTMLElement>("[data-variant-text]").forEach((el) => setVariantText(el, values));
  }

  if (sizeChip) {
    const size = sizeChip.dataset.value;
    document.querySelectorAll<HTMLElement>("[data-size-guide]").forEach((guide) => {
      guide.querySelectorAll<SVGElement>(".sg-art").forEach((art) => {
        art.classList.toggle("is-active", art.dataset.sizeValue === size);
      });
    });
  }

  document.querySelectorAll<HTMLElement>("[data-pick-option]").forEach((proxy) => {
    const chip = chips.find((c) => c.dataset.option === proxy.dataset.pickOption);
    if (chip) proxy.setAttribute("aria-pressed", String(chip.dataset.value === proxy.dataset.pickValue));
  });

  const variant = currentVariant();
  if (variant) {
    const cur = document.getElementById("page-data")?.dataset.cur ?? "";
    const discounted = variant.compareAtPrice != null && variant.compareAtPrice > variant.price;
    document.querySelectorAll<HTMLElement>("[data-compare-display]").forEach((el) => {
      el.hidden = !discounted;
      if (discounted) el.textContent = `${fmt(variant.compareAtPrice!)} ${cur}`;
    });
    document.querySelectorAll<HTMLElement>("[data-save-badge]").forEach((el) => {
      el.hidden = !discounted;
      if (discounted) {
        const pct = Math.round((1 - variant.price / variant.compareAtPrice!) * 100);
        el.textContent = (el.dataset.template ?? "{n}%").replace("{n}", String(pct));
      }
    });
  }
}

export function initArtPreview(): () => void {
  const onClick = (event: Event) => {
    const target = event.target as Element | null;
    const proxy = target?.closest<HTMLElement>("[data-pick-option]");
    if (proxy) {
      const chip = Array.from(document.querySelectorAll<HTMLButtonElement>(".variant-opt")).find(
        (c) => c.dataset.option === proxy.dataset.pickOption && c.dataset.value === proxy.dataset.pickValue,
      );
      if (chip && chip.getAttribute("aria-pressed") !== "true") chip.click();
    }
    if (proxy || target?.closest(".variant-opt")) syncArtPreview();
  };
  document.addEventListener("click", onClick);
  syncArtPreview();
  return () => document.removeEventListener("click", onClick);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initArtPreview(), { once: true });
  } else {
    initArtPreview();
  }
}
