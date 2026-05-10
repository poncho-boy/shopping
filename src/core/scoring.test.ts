import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { extractGenericProductPage } from "../extractors/genericProductPage";
import { analyzeProductColors } from "./scoring";

describe("product color scoring", () => {
  it("scores a rust product as an Autumn great match", () => {
    const html = readFileSync("fixtures/generic-product-rust-dress.html", "utf8");
    const dom = new JSDOM(html, {
      url: "https://example.test/products/rust-linen-shirt-dress"
    });
    const extraction = extractGenericProductPage(dom.window.document);
    const analysis = analyzeProductColors("autumn", extraction.signals);

    expect(extraction.isLikelyProductPage).toBe(true);
    expect(analysis.badgeState).toBe("great-match");
    expect(analysis.detectedColor).toBe("rust");
    expect(analysis.explanation).toContain("Autumn");
  });

  it("scores the same rust product as less ideal for Winter", () => {
    const html = readFileSync("fixtures/generic-product-rust-dress.html", "utf8");
    const dom = new JSDOM(html, {
      url: "https://example.test/products/rust-linen-shirt-dress"
    });
    const extraction = extractGenericProductPage(dom.window.document);
    const analysis = analyzeProductColors("winter", extraction.signals);

    expect(analysis.badgeState).toBe("less-ideal");
    expect(analysis.explanation).toContain("less ideal");
  });

  it("returns color unknown when no color signals are detected", () => {
    const analysis = analyzeProductColors("summer", [
      { source: "page title", text: "Classic Button Down Shirt", weight: 3 },
      { source: "heading", text: "Classic Button Down Shirt", weight: 4 }
    ]);

    expect(analysis.badgeState).toBe("color-unknown");
    expect(analysis.confidence).toBe("none");
  });

  it("uses possible match for mixed or ambiguous color signals", () => {
    const analysis = analyzeProductColors("spring", [
      { source: "page title", text: "Lavender and Coral Scarf", weight: 3 },
      { source: "heading", text: "Lavender and Coral Scarf", weight: 3 }
    ]);

    expect(analysis.badgeState).toBe("possible-match");
    expect(analysis.confidence).toBe("weak");
  });
});
