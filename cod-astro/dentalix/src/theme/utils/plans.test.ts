import { describe, it, expect } from "vitest";
import { planPoints, sharedDuration, planPrices, fill, fmt } from "./plans";

describe("planPoints", () => {
  it("splits a 'tagline: a, b et c.' description into bullets", () => {
    expect(
      planPoints("Pour le praticien seul : agenda, dossiers patients, schéma dentaire, ordonnances et factures. 1 praticien, 1 poste."),
    ).toEqual({
      tagline: "Pour le praticien seul",
      points: ["Agenda", "Dossiers patients", "Schéma dentaire", "Ordonnances", "Factures", "1 praticien", "1 poste"],
    });
  });

  it("keeps a plain sentence as a tagline", () => {
    expect(planPoints("Un formateur se déplace à votre cabinet.")).toEqual({
      tagline: "Un formateur se déplace à votre cabinet.",
      points: [],
    });
  });

  it("handles Arabic punctuation and empty input", () => {
    expect(planPoints("للعيادات: مواعيد، فواتير").points).toEqual(["مواعيد", "فواتير"]);
    expect(planPoints(null)).toEqual({ tagline: null, points: [] });
  });
});

const plan = (prices: Array<[string, number, number | null]>) => ({
  hasVariants: true,
  price: prices[0][1],
  compareAtPrice: null,
  variantOptions: [{ name: "Durée", values: prices.map(([v]) => ({ value: v })) }],
  variants: prices.map(([v, price, compareAtPrice], i) => ({
    id: `v${i}`,
    price,
    compareAtPrice,
    variations: { Durée: v },
    isDefault: i === 0,
  })),
});

describe("sharedDuration / planPrices", () => {
  it("finds the option every plan shares", () => {
    const a = plan([["1 an", 100, 120], ["2 ans", 180, 240]]);
    const b = plan([["1 an", 200, null], ["2 ans", 380, null]]);
    const duration = sharedDuration([a, b]);
    expect(duration).toEqual({ name: "Durée", values: ["1 an", "2 ans"] });
    expect(planPrices(a, duration)).toEqual([
      { value: "1 an", price: 100, compareAtPrice: 120, saving: 20 },
      { value: "2 ans", price: 180, compareAtPrice: 240, saving: 60 },
    ]);
  });

  it("gives up when plans disagree, and falls back to one price", () => {
    const a = plan([["1 an", 100, null], ["2 ans", 180, null]]);
    const b = plan([["Mensuel", 10, null], ["Annuel", 100, null]]);
    expect(sharedDuration([a, b])).toBeNull();
    expect(planPrices(a, null)).toEqual([{ value: null, price: 100, compareAtPrice: null, saving: 0 }]);
  });
});

describe("format helpers", () => {
  it("fills templates and formats prices like product.ts", () => {
    expect(fill("Choisir {plan} {x}", { plan: "Solo" })).toBe("Choisir Solo {x}");
    expect(fmt(59900)).toBe((59900).toLocaleString("ar-DZ"));
  });
});
