import { describe, it, expect } from "vitest";
import { formatPrice, productCount, discountPercent } from "./format";

describe("formatPrice", () => {
  it("uses the same grouping as the client scripts", () => {
    expect(formatPrice(2900)).toBe((2900).toLocaleString("ar-DZ"));
  });
});

describe("productCount", () => {
  it("picks the singular template for one product", () => {
    expect(productCount(1, "{n} soin", "{n} soins")).toBe("1 soin");
  });
  it("picks the plural template otherwise", () => {
    expect(productCount(0, "{n} soin", "{n} soins")).toBe("0 soins");
    expect(productCount(8, "{n} soin", "{n} soins")).toBe("8 soins");
  });
});

describe("discountPercent", () => {
  it("is zero without a higher compare-at price", () => {
    expect(discountPercent(2900, null)).toBe(0);
    expect(discountPercent(2900, 2900)).toBe(0);
    expect(discountPercent(2900, 2000)).toBe(0);
  });
  it("rounds a real discount", () => {
    expect(discountPercent(2900, 3500)).toBe(17);
  });
});
