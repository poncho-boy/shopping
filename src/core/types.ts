export type SeasonId = "spring" | "summer" | "autumn" | "winter";

export type BadgeState =
  | "great-match"
  | "possible-match"
  | "less-ideal"
  | "color-unknown";

export type ColorMatchCategory = "best" | "neutral" | "avoid" | "unknown";

export interface SeasonPalette {
  id: SeasonId;
  name: string;
  traits: string[];
  bestColors: string[];
  keyNeutrals: string[];
  avoidColors: string[];
}

export interface TextSignal {
  source: string;
  text: string;
  weight?: number;
}

export interface ColorCandidate {
  canonicalName: string;
  matchedAlias: string;
  score: number;
  sources: string[];
}

export interface ProductColorAnalysis {
  selectedSeason: SeasonId;
  badgeState: BadgeState;
  label: string;
  explanation: string;
  detectedColor?: string;
  matchedAlias?: string;
  candidates: ColorCandidate[];
  confidence: "none" | "weak" | "moderate" | "strong";
  productSignals: TextSignal[];
}
