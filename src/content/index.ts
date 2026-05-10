import { analyzeProductColors } from "../core/scoring";
import type { ProductColorAnalysis, SeasonId } from "../core/types";
import { extractGenericProductPage } from "../extractors/genericProductPage";
import { getSettings, onSelectedSeasonChanged } from "../shared/storage";

const BADGE_HOST_ID = "color-season-shopping-assistant-badge";

const stateTone: Record<ProductColorAnalysis["badgeState"], string> = {
  "great-match": "#166534",
  "possible-match": "#92400e",
  "less-ideal": "#991b1b",
  "color-unknown": "#475569"
};

function badgeEmoji(state: ProductColorAnalysis["badgeState"]): string {
  if (state === "great-match") {
    return "✓";
  }
  if (state === "less-ideal") {
    return "!";
  }
  if (state === "color-unknown") {
    return "?";
  }
  return "~";
}

function removeBadge() {
  document.getElementById(BADGE_HOST_ID)?.remove();
}

function ensureBadgeHost(): ShadowRoot {
  const existing = document.getElementById(BADGE_HOST_ID);
  if (existing?.shadowRoot) {
    return existing.shadowRoot;
  }

  existing?.remove();

  const host = document.createElement("aside");
  host.id = BADGE_HOST_ID;
  host.setAttribute("aria-live", "polite");
  document.documentElement.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

function renderBadge(analysis: ProductColorAnalysis, reasons: string[]) {
  const shadow = ensureBadgeHost();
  const tone = stateTone[analysis.badgeState];
  const detectedText = analysis.detectedColor
    ? `<div class="detected">Detected color: <strong>${analysis.detectedColor}</strong></div>`
    : "";
  const reasonText = reasons.length ? `<div class="source">Page signal: ${reasons[0]}</div>` : "";

  shadow.innerHTML = `
    <style>
      :host {
        all: initial;
      }

      .badge {
        background: #ffffff;
        border: 1px solid rgba(15, 23, 42, 0.16);
        border-left: 6px solid ${tone};
        border-radius: 14px;
        bottom: 18px;
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.22);
        color: #182230;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        max-width: 320px;
        padding: 12px 14px;
        position: fixed;
        right: 18px;
        width: min(320px, calc(100vw - 36px));
        z-index: 2147483647;
      }

      .badge-header {
        align-items: center;
        display: flex;
        gap: 9px;
      }

      .icon {
        align-items: center;
        background: ${tone};
        border-radius: 999px;
        color: #ffffff;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 0.9rem;
        font-weight: 800;
        height: 24px;
        justify-content: center;
        width: 24px;
      }

      .label {
        color: #0f172a;
        font-size: 0.95rem;
        font-weight: 800;
        line-height: 1.2;
      }

      .season {
        color: #475569;
        font-size: 0.78rem;
        line-height: 1.2;
        margin-top: 2px;
        text-transform: capitalize;
      }

      .explanation {
        color: #334155;
        font-size: 0.82rem;
        line-height: 1.42;
        margin-top: 9px;
      }

      .detected,
      .source {
        color: #64748b;
        font-size: 0.72rem;
        line-height: 1.35;
        margin-top: 7px;
      }
    </style>
    <div class="badge" role="status">
      <div class="badge-header">
        <span class="icon" aria-hidden="true">${badgeEmoji(analysis.badgeState)}</span>
        <div>
          <div class="label">${analysis.label}</div>
          <div class="season">${analysis.selectedSeason} palette</div>
        </div>
      </div>
      <div class="explanation">${analysis.explanation}</div>
      ${detectedText}
      ${reasonText}
    </div>
  `;
}

function analyzeCurrentPage(selectedSeason: SeasonId) {
  const extraction = extractGenericProductPage(document);
  const analysis = analyzeProductColors(selectedSeason, extraction.signals);

  if (!extraction.isLikelyProductPage) {
    removeBadge();
    return;
  }

  renderBadge(analysis, extraction.reasons);
}

async function boot() {
  const { selectedSeason } = await getSettings();
  analyzeCurrentPage(selectedSeason);

  window.setTimeout(() => analyzeCurrentPage(selectedSeason), 1200);
  onSelectedSeasonChanged((season) => analyzeCurrentPage(season));
}

void boot();
