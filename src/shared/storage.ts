import { isSeasonId } from "../core/seasonData";
import type { SeasonId } from "../core/types";

const SELECTED_SEASON_KEY = "selectedSeason";
export const DEFAULT_SEASON: SeasonId = "winter";

export interface ExtensionSettings {
  selectedSeason: SeasonId;
}

function hasChromeStorage(): boolean {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
}

export async function getSettings(): Promise<ExtensionSettings> {
  if (!hasChromeStorage()) {
    return { selectedSeason: DEFAULT_SEASON };
  }

  const stored = await chrome.storage.local.get(SELECTED_SEASON_KEY);
  const selectedSeason = isSeasonId(stored[SELECTED_SEASON_KEY])
    ? stored[SELECTED_SEASON_KEY]
    : DEFAULT_SEASON;

  return { selectedSeason };
}

export async function saveSelectedSeason(selectedSeason: SeasonId): Promise<void> {
  if (!hasChromeStorage()) {
    return;
  }

  await chrome.storage.local.set({ [SELECTED_SEASON_KEY]: selectedSeason });
}

export function onSelectedSeasonChanged(callback: (season: SeasonId) => void): () => void {
  if (typeof chrome === "undefined" || !chrome.storage?.onChanged) {
    return () => undefined;
  }

  const listener = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string
  ) => {
    if (areaName !== "local") {
      return;
    }
    const newValue = changes[SELECTED_SEASON_KEY]?.newValue;
    if (isSeasonId(newValue)) {
      callback(newValue);
    }
  };

  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
