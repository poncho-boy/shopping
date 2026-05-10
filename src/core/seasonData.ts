import type { SeasonId, SeasonPalette } from "./types";

export const seasons: Record<SeasonId, SeasonPalette> = {
  spring: {
    id: "spring",
    name: "Spring",
    traits: ["Warm", "Bright", "Clear"],
    bestColors: [
      "warm yellow",
      "coral",
      "bright coral",
      "peach",
      "camel",
      "warm aqua",
      "apple green",
      "bright blue"
    ],
    keyNeutrals: ["warm beige", "ivory", "light warm gray", "clear navy"],
    avoidColors: ["harsh black", "muted cool tones"]
  },
  summer: {
    id: "summer",
    name: "Summer",
    traits: ["Cool", "Muted", "Soft"],
    bestColors: [
      "lavender",
      "sky blue",
      "sage green",
      "pale pink",
      "powdery blue",
      "mauve"
    ],
    keyNeutrals: ["soft white", "cool beige", "light gray", "soft navy"],
    avoidColors: ["earthy browns", "harsh bright orange"]
  },
  autumn: {
    id: "autumn",
    name: "Autumn",
    traits: ["Warm", "Muted", "Earthy", "Rich"],
    bestColors: [
      "rust",
      "olive green",
      "pumpkin",
      "mustard yellow",
      "camel",
      "chocolate brown",
      "deep teal"
    ],
    keyNeutrals: ["dark chocolate", "khaki", "olive", "cream"],
    avoidColors: ["pastel shades", "cool-toned purples"]
  },
  winter: {
    id: "winter",
    name: "Winter",
    traits: ["Cool", "Bright", "High contrast", "Bold"],
    bestColors: [
      "emerald green",
      "royal blue",
      "deep purple",
      "fuchsia",
      "bright red",
      "icy pink"
    ],
    keyNeutrals: ["true black", "crisp white", "cool gray", "deep navy"],
    avoidColors: ["earthy orange", "beige", "mustard"]
  }
};

export const seasonList = Object.values(seasons);

export function getSeason(seasonId: SeasonId): SeasonPalette {
  return seasons[seasonId];
}

export function isSeasonId(value: unknown): value is SeasonId {
  return (
    value === "spring" ||
    value === "summer" ||
    value === "autumn" ||
    value === "winter"
  );
}
