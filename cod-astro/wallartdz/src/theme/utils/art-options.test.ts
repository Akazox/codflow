import { describe, it, expect } from "vitest";
import {
  parseSize,
  frameKindOf,
  optionKind,
  sizeOption,
  frameOption,
  artworkImage,
  fromPrice,
} from "./art-options";

describe("parseSize", () => {
  it("reads W×H in every separator merchants type", () => {
    expect(parseSize("30×40")).toEqual({ w: 30, h: 40 });
    expect(parseSize("40 x 60 cm")).toEqual({ w: 40, h: 60 });
    expect(parseSize("60X90")).toEqual({ w: 60, h: 90 });
    expect(parseSize("50*70 سم")).toEqual({ w: 50, h: 70 });
    expect(parseSize("21,5×29,7")).toEqual({ w: 21.5, h: 29.7 });
  });

  it("rejects anything that is not two dimensions", () => {
    expect(parseSize("كبير")).toBeNull();
    expect(parseSize("M")).toBeNull();
    expect(parseSize("0×40")).toBeNull();
  });
});

describe("frameKindOf", () => {
  it("recognises finishes in Arabic, French and English", () => {
    expect(frameKindOf("بدون إطار")).toBe("none");
    expect(frameKindOf("إطار أسود")).toBe("black");
    expect(frameKindOf("إطار خشبي")).toBe("wood");
    expect(frameKindOf("Sans cadre")).toBe("none");
    expect(frameKindOf("Cadre noir")).toBe("black");
    expect(frameKindOf("Cadre bois")).toBe("wood");
    expect(frameKindOf("White frame")).toBe("white");
    expect(frameKindOf("Gold frame")).toBe("gold");
  });

  it("returns null for a value it cannot draw", () => {
    expect(frameKindOf("إطار فاخر")).toBeNull();
  });
});

describe("optionKind", () => {
  const size = { name: "المقاس", values: [{ value: "30×40" }, { value: "40×60" }] };
  const frame = { name: "الإطار", values: [{ value: "بدون إطار" }, { value: "إطار أسود" }] };
  const plain = { name: "Finition", values: [{ value: "Mat" }, { value: "Brillant" }] };

  it("classifies size, frame and anything else", () => {
    expect(optionKind(size)).toBe("size");
    expect(optionKind(frame)).toBe("frame");
    expect(optionKind(plain)).toBe("plain");
  });

  it("treats a frame option with a merchant colour as a frame", () => {
    expect(optionKind({ name: "Cadre", values: [{ value: "Bleu nuit", hexColor: "#1f2a44" }] })).toBe("frame");
  });

  it("finds the size and frame options of a product", () => {
    expect(sizeOption([frame, size])?.sizes.map((s) => s.value)).toEqual(["30×40", "40×60"]);
    expect(frameOption([size, frame])?.frames.map((f) => f.kind)).toEqual(["none", "black"]);
    expect(sizeOption([plain])).toBeNull();
    expect(frameOption(null)).toBeNull();
  });
});

describe("artworkImage", () => {
  it("prefers the second image (the flat artwork) and falls back to the first", () => {
    expect(artworkImage([{ src: "room" }, { src: "flat" }])?.src).toBe("flat");
    expect(artworkImage([{ src: "only" }])?.src).toBe("only");
    expect(artworkImage([])).toBeNull();
  });
});

describe("fromPrice", () => {
  it("is the cheapest variant, or the product price without variants", () => {
    expect(fromPrice({ price: 5000, variants: [{ price: 5900 }, { price: 3900 }] })).toBe(3900);
    expect(fromPrice({ price: 5000, variants: [] })).toBe(5000);
  });
});
