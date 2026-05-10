# Color Season Shopping Assistant

A gender-neutral Chrome extension concept for online clothing shopping. The extension will help shoppers badge products based on how closely a detected product color matches the shopper's selected color season palette.

The goal is to act as a lightweight shopping assistant. It should describe whether an item appears to fit a selected palette, not make claims about whether the item will objectively look good on a person.

## Project status

This repository now contains the first implementation slice for the MVP:

- Manifest V3 Chrome extension shell.
- TypeScript, Vite, and React popup UI.
- Local selected-season storage with `chrome.storage.local`.
- Platform-agnostic color season data, color alias extraction, scoring, badge states, and explanations.
- Generic ecommerce product-page content script that uses page text and metadata.
- Internal fixture coverage for product color extraction.

Start with the MVP plan:

- [MVP plan](docs/mvp-plan.md)

## MVP direction

The initial product direction is:

- Build a platform-agnostic color detection and scoring engine.
- Support generic English-language ecommerce product pages where enough text or metadata is available.
- Treat Shopify as the first optimized compatibility target for product pages and collection badges.
- Let users choose Spring, Summer, Autumn, or Winter.
- Detect product detail pages across ecommerce sites when possible.
- Detect Shopify product cards and product detail pages as an enhanced MVP path.
- Extract likely product colors from text and available page metadata.
- Badge products as `Great match`, `Possible match`, `Less ideal`, or `Color unknown`.
- Keep settings local to the browser extension.
- Avoid backend services, user accounts, and external databases for the MVP.

## Planned technical direction

The current recommended stack is:

- Manifest V3 Chrome extension.
- TypeScript.
- Vite.
- React for popup/options UI.
- Content scripts for page scanning and badge injection.
- A platform-agnostic extraction and scoring core.
- Shopify-specific helpers as the first site/platform adapter.
- `chrome.storage.local` for local settings.

These choices should continue to be revisited as the MVP expands.

## Local development

Install dependencies:

```sh
npm install
```

Run checks:

```sh
npm test
npm run build
```

Load the built extension from `dist/` in Chrome's extension developer mode.

## Privacy principles

For the MVP:

- Store the selected color season locally.
- Do not send browsing data to a server.
- Do not store product browsing history.
- Do not require accounts.
- Do not use a database.

## Language principles

Product language should stay gender-neutral and palette-focused.

Preferred style:

- "Matches your selected Winter palette."
- "Rust is commonly recommended for Autumn palettes."
- "Color unknown: we could not confidently detect a color."

Avoid language that makes claims about the user's body, complexion, gender, or inherent appearance.
