# Shopify Color Season Chrome Extension MVP Plan

## Product summary

Build a gender-neutral Chrome extension that helps shoppers identify clothing on Shopify-powered ecommerce sites that matches their selected color season palette.

The extension should act as a lightweight shopping assistant. It should say whether a product appears to fit the user's selected palette, not whether the item will objectively look good on the user.

## Current MVP goals

- Support generic English-language Shopify clothing stores.
- Let users choose one of four color seasons:
  - Spring
  - Summer
  - Autumn
  - Winter
- Detect product cards and product pages on Shopify storefronts.
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
- Non-Shopify ecommerce support.
- Strong claims about what looks best on a user.

## Recommended initial tech direction

The current recommendation is:

- Manifest V3 Chrome extension.
- TypeScript.
- Vite.
- React for popup/options UI.
- Content script for Shopify page scanning and badge injection.
- `chrome.storage.local` for local extension settings.

This can be revisited before implementation, but it is a standard modern stack for a Chrome extension MVP.

## User experience

### Initial setup

The user opens the extension popup and selects one color season:

- Spring
- Summer
- Autumn
- Winter

The MVP should not include a quiz. The user is responsible for choosing their season.

### On Shopify collection pages

When the user visits a supported Shopify collection/search page:

1. The content script detects product cards.
2. The extension extracts likely product colors from available text and metadata.
3. The extension compares the detected color against the selected palette.
4. The extension displays a badge on or near each product card.

### On Shopify product pages

When the user visits a product detail page:

1. The extension extracts product title, available variant names, visible color labels, alt text, and other metadata where available.
2. The extension scores the product against the selected palette.
3. The extension displays a badge or product-level indicator.

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
2. Product card visible text.
3. Product URL slug.
4. Variant option names.
5. Color selector labels.
6. Image alt text.
7. Shopify product JSON or embedded structured data where available.

The extension should identify known color names and aliases. Example:

- "navy", "deep navy", and "clear navy" should map to season-specific navy concepts where possible.
- "chocolate", "dark chocolate", and "chocolate brown" should map to brown.
- Store-specific names like "espresso" or "moonstone" may require future alias expansion.

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

## Shopify support expectations

The MVP should target generic Shopify stores, but Shopify theme variability is a known risk.

Useful detection signals may include:

- `window.Shopify`.
- Shopify product URLs such as `/products/...`.
- Shopify collection URLs such as `/collections/...`.
- Shopify CDN image URLs.
- Embedded product JSON.
- JSON-LD structured data.
- Common product card selectors.

Large retailers may use Shopify in customized ways, or may use Shopify only for part of their commerce stack. Abercrombie can be investigated, but the MVP should be validated first against more standard Shopify clothing storefronts.

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

- Add more ecommerce platforms.
- Add custom adapters for high-value stores.
- Improve support for heavily customized Shopify themes.

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
4. Should the first implementation include a small internal test fixture page for product cards?
5. Which real Shopify stores should be used as the first compatibility test set?
