import { seasons } from "./seasonData";
import { extractColorCandidates, uniqueSignals } from "./textSignals";
import type {
  BadgeState,
  ColorCandidate,
  ColorMatchCategory,
  ProductColorAnalysis,
  SeasonId,
  TextSignal
} from "./types";

const BADGE_LABELS: Record<BadgeState, string> = {
  "great-match": "Great match",
  "possible-match": "Possible match",
  "less-ideal": "Less ideal",
  "color-unknown": "Color unknown"
};

const seasonColorRules: Record<
  SeasonId,
  Record<"best" | "neutral" | "avoid", Set<string>>
> = {
  spring: {
    best: new Set([
      "warm yellow",
      "coral",
      "bright coral",
      "peach",
      "camel",
      "warm aqua",
      "apple green",
      "bright blue"
    ]),
    neutral: new Set(["warm beige", "ivory", "light warm gray", "clear navy", "deep navy"]),
    avoid: new Set(["harsh black", "true black", "muted cool tones"])
  },
  summer: {
    best: new Set([
      "lavender",
      "sky blue",
      "sage green",
      "pale pink",
      "powdery blue",
      "mauve"
    ]),
    neutral: new Set(["soft white", "cool beige", "light gray", "soft navy", "deep navy"]),
    avoid: new Set(["earthy browns", "chocolate brown", "dark chocolate", "harsh bright orange"])
  },
  autumn: {
    best: new Set([
      "rust",
      "olive green",
      "pumpkin",
      "mustard yellow",
      "camel",
      "chocolate brown",
      "deep teal"
    ]),
    neutral: new Set(["dark chocolate", "khaki", "olive", "cream"]),
    avoid: new Set(["pastel shades", "cool-toned purples", "lavender", "icy pink"])
  },
  winter: {
    best: new Set([
      "emerald green",
      "royal blue",
      "deep purple",
      "fuchsia",
      "bright red",
      "icy pink"
    ]),
    neutral: new Set(["true black", "crisp white", "cool gray", "deep navy"]),
    avoid: new Set(["earthy orange", "rust", "beige", "warm beige", "mustard yellow", "mustard"])
  }
};

function titleCaseColor(color: string): string {
  return color.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function categoryForColor(seasonId: SeasonId, color: string): ColorMatchCategory {
  const rules = seasonColorRules[seasonId];
  if (rules.best.has(color)) {
    return "best";
  }
  if (rules.neutral.has(color)) {
    return "neutral";
  }
  if (rules.avoid.has(color)) {
    return "avoid";
  }
  return "unknown";
}

function confidenceForCandidates(candidates: ColorCandidate[]): ProductColorAnalysis["confidence"] {
  if (candidates.length === 0) {
    return "none";
  }
  const [top, second] = candidates;
  if (top.score < 2) {
    return "weak";
  }
  if (second && second.score >= top.score * 0.75) {
    return "weak";
  }
  if (top.score >= 5) {
    return "strong";
  }
  return "moderate";
}

function explanationForResult(
  seasonId: SeasonId,
  candidate: ColorCandidate | undefined,
  category: ColorMatchCategory,
  badgeState: BadgeState,
  confidence: ProductColorAnalysis["confidence"]
): string {
  const seasonName = seasons[seasonId].name;

  if (!candidate) {
    return "Color unknown: we could not confidently detect a product color from page text or metadata.";
  }

  const color = titleCaseColor(candidate.canonicalName);
  const sourceList = candidate.sources.slice(0, 3).join(", ");
  const detected = `Detected: ${candidate.canonicalName}`;
  const sourcePhrase = sourceList ? ` from ${sourceList}` : "";

  if (confidence === "weak") {
    return `${detected}${sourcePhrase}. The color signal is mixed or weak, so this is a possible match for your selected ${seasonName} palette.`;
  }

  if (category === "best") {
    return `${detected}${sourcePhrase}. ${color} is commonly recommended for ${seasonName} palettes.`;
  }

  if (category === "neutral") {
    return `${detected}${sourcePhrase}. ${color} is a key neutral for your selected ${seasonName} palette.`;
  }

  if (category === "avoid") {
    return `${detected}${sourcePhrase}. This color appears less ideal for your selected ${seasonName} palette.`;
  }

  if (badgeState === "less-ideal") {
    return `${detected}${sourcePhrase}. This color is not a listed match for your selected ${seasonName} palette.`;
  }

  return `${detected}${sourcePhrase}. This color is not clearly categorized for your selected ${seasonName} palette.`;
}

export function analyzeProductColors(
  selectedSeason: SeasonId,
  signals: TextSignal[]
): ProductColorAnalysis {
  const productSignals = uniqueSignals(signals);
  const candidates = extractColorCandidates(productSignals);
  const dominant = candidates[0];
  const confidence = confidenceForCandidates(candidates);

  if (!dominant) {
    return {
      selectedSeason,
      badgeState: "color-unknown",
      label: BADGE_LABELS["color-unknown"],
      explanation: explanationForResult(
        selectedSeason,
        undefined,
        "unknown",
        "color-unknown",
        confidence
      ),
      candidates,
      confidence,
      productSignals
    };
  }

  const category = categoryForColor(selectedSeason, dominant.canonicalName);
  let badgeState: BadgeState;

  if (confidence === "weak") {
    badgeState = "possible-match";
  } else if (category === "best" || category === "neutral") {
    badgeState = "great-match";
  } else if (category === "avoid") {
    badgeState = "less-ideal";
  } else {
    badgeState = "possible-match";
  }

  return {
    selectedSeason,
    badgeState,
    label: BADGE_LABELS[badgeState],
    explanation: explanationForResult(
      selectedSeason,
      dominant,
      category,
      badgeState,
      confidence
    ),
    detectedColor: dominant.canonicalName,
    matchedAlias: dominant.matchedAlias,
    candidates,
    confidence,
    productSignals
  };
}
