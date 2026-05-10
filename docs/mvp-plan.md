# Color Season Shopping Assistant Chrome Extension MVP Plan

## Product summary

Build a gender-neutral Chrome extension that helps shoppers identify clothing on ecommerce sites that matches their selected color season palette.

The extension should act as a lightweight shopping assistant. It should say whether a product appears to fit the user's selected palette, not whether the item will objectively look good on the user.

The core product should be platform-agnostic. Shopify should be treated as the first optimized compatibility target for the MVP, not as the long-term product boundary.

## Current MVP goals

- Build a platform-agnostic color detection, scoring, and explanation engine.
- Support generic English-language ecommerce product pages where enough text or metadata is available.
- Treat Shopify as the first optimized target for product pages and collection/search page badging.
- Let users choose one of four color seasons:
  - Spring
  - Summer
  - Autumn
  - Winter
- Detect product detail pages across ecommerce sites where possible.
- Detect product cards and product pages on Shopify storefronts as the first enhanced compatibility path.
- Extract likely product color information as best as possible from page data.
- Badge products based on how well the detected color fits the selected palette.
- Keep all user settings local to the browser extension.
- Avoid backend services, user accounts, and external databases for the MVP.
- Keep the product gender-neutral in language, design, and assumptions.

## Out of scope for the MVP

- Body type recommendations.
- Color season quiz or "help me choose" flow.
- User accounts.
- Backend API.
- Remote database.
- Hiding or filtering products.
- User overrides such as "I like this color anyway."
- Non-English color extraction.
- Guaranteed support for every ecommerce platform or heavily customized storefront.
- Strong claims about what looks best on a user.

## Recommended initial tech direction

The current recommendation is:

- Manifest V3 Chrome extension.
- TypeScript.
- Vite.
- React for popup/options UI.
- Content script for page scanning and badge injection.
- Platform-agnostic color extraction and scoring core.
- Shopify-specific helper logic as the first adapter.
- `chrome.storage.local` for local extension settings.

This can be revisited before implementation, but it is a standard modern stack for a Chrome extension MVP. The important architectural decision is to keep color detection and scoring independent from Shopify-specific page parsing.

## User experience

### Initial setup

The user opens the extension popup and selects one color season:

- Spring
- Summer
- Autumn
- Winter

The MVP should not include a quiz. The user is responsible for choosing their season.

### On generic ecommerce product pages

When the user visits a supported product detail page:

1. The content script looks for generic product signals such as page title, headings, JSON-LD product data, Open Graph metadata, selected options, visible color labels, URL slugs, and image alt text.
2. The extension extracts likely product colors from available text and metadata.
3. The extension scores the product against the selected palette.
4. The extension displays a badge or product-level indicator when the signal is strong enough.

This is the lower-friction platform-agnostic MVP surface. It should work on non-Shopify sites when their product metadata and page text expose useful color information.

### On Shopify collection pages

When the user visits a supported Shopify collection/search page:

1. The content script detects product cards.
2. The extension extracts likely product colors from available text and metadata.
3. The extension compares the detected color against the selected palette.
4. The extension displays a badge on or near each product card.

Shopify collection badging is the first enhanced compatibility target because Shopify provides useful signals and a large set of stores to validate against, even though themes vary.

### On Shopify product pages

When the user visits a product detail page:

1. The extension extracts product title, available variant names, visible color labels, alt text, and other metadata where available.
2. The extension scores the product against the selected palette.
3. The extension displays a badge or product-level indicator.

Shopify-specific product extraction should build on the generic product-page analyzer rather than bypass it.

## Badge states

The MVP should support these badge states:

| State | Meaning |
| --- | --- |
| Great match | The detected dominant color is a best color or key neutral for the selected season. |
| Possible match | The color signal is partial, ambiguous, mixed, or not strong enough for a confident great match. |
| Less ideal | The detected dominant color is commonly outside or discouraged for the selected season. |
| Color unknown | The extension could not confidently detect a product color. |

Open UI idea:

- Good matches could use a happy-face style indicator.
- Less ideal matches could use a sad-face style indicator.
- Badges could be color-coded using the detected color or a corresponding palette color.

This should be handled carefully so the badge remains readable and accessible.

## Language guidelines

Use language tied to the selected palette, not to the user's body, gender, or inherent appearance.

Preferred wording:

- "Matches your selected Winter palette."
- "Rust is commonly recommended for Autumn palettes."
- "This color appears less ideal for your selected Summer palette."
- "Color unknown: we could not confidently detect a color."

Avoid wording:

- "This will look good on you."
- "This is flattering for your complexion."
- "You should not wear this."
- Gendered fashion assumptions.

## Architecture direction

Keep the MVP architecture split between platform-independent product logic and site/platform extraction logic.

Platform-independent core:

- Color season data model.
- Color alias normalization.
- Dominant color candidate ranking.
- Scoring and badge classification.
- Explanation generation.

Generic page extraction:

- Product page title and headings.
- URL slug parsing.
- JSON-LD `Product` data.
- Open Graph metadata.
- Visible selected option text.
- Image alt text.

Platform adapters:

- Start with a Shopify adapter for Shopify-specific product JSON, route detection, collection grids, and common product card patterns.
- Add other ecommerce adapters later only when generic extraction is not enough.

The generic extractor and scoring engine should be useful even when no platform adapter matches.

## Color season model

Each season should include:

- Traits.
- Best colors.
- Key neutrals.
- Avoid colors.

Important scoring rule:

- Best colors and key neutrals are both good matches.
- In this product, "neutral" means a wardrobe neutral that works well for the selected season. It does not mean the app has a neutral opinion.

### Spring

Traits:

- Warm.
- Bright.
- Clear.

Best colors:

- Warm yellow.
- Coral.
- Bright coral.
- Peach.
- Camel.
- Warm aqua.
- Apple green.
- Bright blue.

Key neutrals:

- Warm beige.
- Ivory.
- Light warm gray.
- Clear navy.

Avoid:

- Harsh black.
- Muted cool tones.

### Summer

Traits:

- Cool.
- Muted.
- Soft.

Best colors:

- Lavender.
- Sky blue.
- Sage green.
- Pale pink.
- Powdery blue.
- Mauve.

Key neutrals:

- Soft white.
- Cool beige.
- Light gray.
- Soft navy.

Avoid:

- Earthy browns.
- Harsh bright orange.

### Autumn

Traits:

- Warm.
- Muted.
- Earthy.
- Rich.

Best colors:

- Rust.
- Olive green.
- Pumpkin.
- Mustard yellow.
- Camel.
- Chocolate brown.
- Deep teal.

Key neutrals:

- Dark chocolate.
- Khaki.
- Olive.
- Cream.

Avoid:

- Pastel shades.
- Cool-toned purples.

### Winter

Traits:

- Cool.
- Bright.
- High contrast.
- Bold.

Best colors:

- Emerald green.
- Royal blue.
- Deep purple.
- Fuchsia.
- Bright red.
- Icy pink.

Key neutrals:

- True black.
- Crisp white.
- Cool gray.
- Deep navy.

Avoid:

- Earthy orange.
- Beige.
- Mustard.

## Color extraction strategy

For the MVP, prioritize text-based extraction before image analysis.

Potential sources:

1. Product title.
2. Product page headings.
3. Product card visible text.
4. Product URL slug.
5. Variant option names.
6. Selected option labels.
7. Color selector labels.
8. Image alt text.
9. JSON-LD `Product` structured data.
10. Open Graph metadata.
11. Shopify product JSON where available.

The extension should identify known color names and aliases. Example:

- "navy", "deep navy", and "clear navy" should map to season-specific navy concepts where possible.
- "chocolate", "dark chocolate", and "chocolate brown" should map to brown.
- Store-specific names like "espresso" or "moonstone" may require future alias expansion.

Extraction should be layered:

1. Run generic ecommerce extraction first.
2. Add Shopify-specific extraction when Shopify signals are present.
3. Merge and rank detected color candidates.
4. Return `Color unknown` or `Possible match` when the signal is too weak or mixed.

## Dominant color approach

For the MVP, score products based on the dominant detected color where possible.

If dominant color detection is too unreliable, introduce or use a `mixed`/ambiguous handling path and return `Possible match` or `Color unknown` rather than pretending confidence.

Initial decision:

- Do not over-optimize multi-color products for v0.1.
- Preserve mixed-color handling as an area to refine later.

## Scoring and classification

Initial deterministic logic:

1. If no color can be detected:
   - Badge: `Color unknown`.
2. If the dominant detected color is in the selected season's best colors or key neutrals:
   - Badge: `Great match`.
3. If the dominant detected color is in the selected season's avoid colors:
   - Badge: `Less ideal`.
4. If the detected signal is mixed, weak, or ambiguous:
   - Badge: `Possible match`.
5. If a detected color does not clearly map to best, neutral, or avoid:
   - Badge: `Possible match` or `Less ideal`, depending on how conservative the first implementation feels after testing.

The scoring engine should return explanations alongside badge states so the UI can support hover/click details later.

Example explanation:

> Detected: rust. Rust is commonly recommended for Autumn palettes.

## Platform and Shopify support expectations

The MVP should not assume Shopify is the only supported path. The core analyzer should attempt to work on generic ecommerce product pages using structured data and visible product text.

Shopify remains the first optimized compatibility target because it offers useful detection signals and many clothing stores use it. Shopify theme variability is still a known risk.

Useful detection signals may include:

- JSON-LD `Product` structured data.
- Open Graph product metadata.
- Product-like URLs and page headings.
- `window.Shopify`.
- Shopify product URLs such as `/products/...`.
- Shopify collection URLs such as `/collections/...`.
- Shopify CDN image URLs.
- Embedded product JSON.
- Common product card selectors.

Large retailers may use Shopify in customized ways, may use Shopify only for part of their commerce stack, or may not use Shopify at all. Abercrombie can be investigated, but the MVP should be validated first against:

1. Standard Shopify clothing storefronts.
2. A small set of non-Shopify product pages with useful metadata.
3. A small set of low-signal pages where the expected result is `Color unknown` or `Possible match`.

## Privacy and data storage

For the MVP:

- Store the selected season locally with `chrome.storage.local`.
- Do not send browsing data to a server.
- Do not store product browsing history.
- Do not create accounts.
- Do not use a database.

## Later enhancements

### Product behavior

- Dim low-match products.
- Hide low-match products.
- Add a "show only matches" mode.
- Let users override recommendations.
- Let users save favorite products.
- Add shopping boards or collections.

### Color intelligence

- Add image-based color extraction.
- Improve support for patterned and multi-color garments.
- Learn store-specific color aliases.
- Add confidence levels.
- Add expanded color synonym handling.
- Support non-English color names.

### User education

- Add a "help me choose my season" quiz.
- Add onboarding education for color seasons.
- Add hover or click explanations for every badge.
- Add examples of best colors and key neutrals in the popup.

### Platform support

- Add platform adapters for more ecommerce platforms.
- Add custom adapters for high-value stores.
- Improve support for heavily customized Shopify themes.
- Improve generic product-page detection for non-Shopify stores.

### Personalization

- Add optional user preferences.
- Add feedback such as "this was accurate" or "not accurate."
- Add "I like this color anyway" overrides.
- Explore body/style preferences later, with careful language.

## Prompting and collaboration notes

Useful prompt pattern for this project:

1. State the goal.
2. State what should not be done yet.
3. Provide product decisions or constraints.
4. Ask for clarifying questions.
5. Ask for implementation only when ready.

Example:

> We are still in planning mode. Please update the MVP spec based on these decisions, list any open questions, and do not write implementation code yet.

If feedback on prompting is desired after every message, make that a standing instruction in the conversation, for example:

> For the rest of this project, after each of my prompts, include a short "Prompt feedback" section with one thing I did well and one way to make the prompt more actionable.

Persona prompts can help communicate the style of response desired, but they are less important than concrete instructions, constraints, examples, and success criteria. A prompt like "act as a senior software engineer" is useful for tone, but the best results usually come from specifying the task, tradeoffs, desired output, and what should be avoided.

## Open questions

1. What exact badge labels should be used in v0.1?
   - Current proposal: `Great match`, `Possible match`, `Less ideal`, `Color unknown`.
2. Should badges use emoji/happy-face UI, text labels, or both?
3. Should the MVP include hover/click explanations immediately, or should that wait until after the basic badges work?
4. Should the first implementation include small internal test fixture pages for generic product pages and Shopify product cards?
5. Which real Shopify and non-Shopify stores should be used as the first compatibility test set?
