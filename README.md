# Shopify Color Season Shopping Assistant

A gender-neutral Chrome extension concept for Shopify clothing stores. The extension will help shoppers badge products based on how closely a detected product color matches the shopper's selected color season palette.

The goal is to act as a lightweight shopping assistant. It should describe whether an item appears to fit a selected palette, not make claims about whether the item will objectively look good on a person.

## Project status

This repository is currently in MVP planning. No implementation code has been added yet.

Start with the MVP plan:

- [MVP plan](docs/mvp-plan.md)

## MVP direction

The initial product direction is:

- Support generic English-language Shopify clothing stores.
- Let users choose Spring, Summer, Autumn, or Winter.
- Detect Shopify product cards and product detail pages.
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
- Content scripts for Shopify page scanning and badge injection.
- `chrome.storage.local` for local settings.

These choices can be revisited before implementation starts.

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
