import type { TextSignal } from "../core/types";

export interface GenericProductPageExtraction {
  signals: TextSignal[];
  isLikelyProductPage: boolean;
  reasons: string[];
}

const PRODUCT_META_NAMES = [
  "og:title",
  "og:description",
  "twitter:title",
  "twitter:description",
  "product:color",
  "product:category"
];

const COLOR_ATTRIBUTE_SELECTORS = [
  "[data-color]",
  "[data-colour]",
  "[data-option-name*='color' i]",
  "[data-option-name*='colour' i]",
  "[aria-label*='color' i]",
  "[aria-label*='colour' i]",
  "[class*='color' i]",
  "[class*='colour' i]"
];

function compact(value: string | null | undefined): string | undefined {
  const normalized = value?.replace(/\s+/g, " ").trim();
  return normalized || undefined;
}

function pushSignal(
  signals: TextSignal[],
  source: string,
  text: string | null | undefined,
  weight: number
) {
  const normalized = compact(text);
  if (normalized) {
    signals.push({ source, text: normalized, weight });
  }
}

function metaContent(document: Document, name: string): string | undefined {
  const selector = `meta[property="${name}"], meta[name="${name}"]`;
  return compact(document.querySelector<HTMLMetaElement>(selector)?.content);
}

function textFromElements(
  document: Document,
  selector: string,
  source: string,
  weight: number,
  limit: number,
  signals: TextSignal[]
) {
  for (const element of Array.from(document.querySelectorAll(selector)).slice(0, limit)) {
    pushSignal(signals, source, element.textContent, weight);
  }
}

function collectJsonLdSignals(document: Document, signals: TextSignal[]): boolean {
  let foundProduct = false;

  for (const script of Array.from(
    document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')
  )) {
    if (!script.textContent) {
      continue;
    }

    try {
      const parsed = JSON.parse(script.textContent);
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      const flattened = nodes.flatMap((node) => {
        if (Array.isArray(node?.["@graph"])) {
          return node["@graph"];
        }
        return [node];
      });

      for (const node of flattened) {
        const type = node?.["@type"];
        const types = Array.isArray(type) ? type : [type];
        if (!types.some((item) => String(item).toLowerCase() === "product")) {
          continue;
        }

        foundProduct = true;
        pushSignal(signals, "structured data color", node.color, 5);
        pushSignal(signals, "structured data name", node.name, 4);
        pushSignal(signals, "structured data description", node.description, 2);

        const offers = Array.isArray(node.offers) ? node.offers : [node.offers];
        for (const offer of offers) {
          pushSignal(signals, "structured data sku", offer?.sku, 1);
        }
      }
    } catch {
      // Ignore invalid JSON-LD; many storefronts include multiple unrelated scripts.
    }
  }

  return foundProduct;
}

function collectSelectedOptionSignals(document: Document, signals: TextSignal[]) {
  for (const option of Array.from(document.querySelectorAll<HTMLOptionElement>("option:checked"))) {
    const label = option.closest("select")?.getAttribute("aria-label") ?? "";
    const selectName = option.closest("select")?.getAttribute("name") ?? "";
    const source = /colou?r/i.test(`${label} ${selectName}`)
      ? "selected color option"
      : "selected option";
    pushSignal(signals, source, option.textContent, source === "selected color option" ? 5 : 2);
  }

  for (const element of Array.from(
    document.querySelectorAll<HTMLElement>("[aria-checked='true'], [aria-selected='true']")
  ).slice(0, 20)) {
    const label = element.getAttribute("aria-label") ?? element.textContent;
    const source = /colou?r/i.test(label ?? "") ? "selected color option" : "selected option";
    pushSignal(signals, source, label, source === "selected color option" ? 5 : 2);
  }
}

function collectColorAttributeSignals(document: Document, signals: TextSignal[]) {
  for (const element of Array.from(
    document.querySelectorAll<HTMLElement>(COLOR_ATTRIBUTE_SELECTORS.join(","))
  ).slice(0, 30)) {
    pushSignal(signals, "color label", element.getAttribute("data-color"), 5);
    pushSignal(signals, "color label", element.getAttribute("data-colour"), 5);
    pushSignal(signals, "color label", element.getAttribute("aria-label"), 4);
    pushSignal(signals, "color label", element.textContent, 3);
  }
}

function collectUrlSignals(url: URL, signals: TextSignal[]) {
  const slug = decodeURIComponent(url.pathname)
    .split("/")
    .filter(Boolean)
    .slice(-3)
    .join(" ");

  pushSignal(signals, "url", slug.replace(/[-_]+/g, " "), 2);
}

export function extractGenericProductPage(
  document: Document,
  url = new URL(document.location.href)
): GenericProductPageExtraction {
  const signals: TextSignal[] = [];
  const reasons: string[] = [];

  pushSignal(signals, "page title", document.title, 3);
  textFromElements(document, "h1", "heading", 4, 3, signals);
  textFromElements(document, "h2, h3", "subheading", 2, 6, signals);

  for (const name of PRODUCT_META_NAMES) {
    pushSignal(signals, `metadata ${name}`, metaContent(document, name), 3);
  }

  const hasProductJsonLd = collectJsonLdSignals(document, signals);
  if (hasProductJsonLd) {
    reasons.push("structured Product data");
  }

  collectSelectedOptionSignals(document, signals);
  collectColorAttributeSignals(document, signals);
  collectUrlSignals(url, signals);

  for (const image of Array.from(document.images).slice(0, 20)) {
    pushSignal(signals, "image alt text", image.alt, 1);
  }

  const productUrl = /\/products?\//i.test(url.pathname);
  const hasProductMeta = PRODUCT_META_NAMES.some((name) => Boolean(metaContent(document, name)));
  const hasCommerceControl = Boolean(
    document.querySelector(
      "button[name='add'], button[type='submit'], form[action*='cart' i], [data-product-id], [itemtype*='Product']"
    )
  );

  if (productUrl) {
    reasons.push("product-like URL");
  }
  if (hasProductMeta) {
    reasons.push("product metadata");
  }
  if (hasCommerceControl) {
    reasons.push("commerce controls");
  }

  return {
    signals,
    isLikelyProductPage: reasons.length > 0,
    reasons
  };
}
