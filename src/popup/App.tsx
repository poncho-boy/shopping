import { useEffect, useMemo, useState } from "react";
import { getSeason, seasonList } from "../core/seasonData";
import type { SeasonId } from "../core/types";
import { DEFAULT_SEASON, getSettings, saveSelectedSeason } from "../shared/storage";

export function App() {
  const [selectedSeason, setSelectedSeason] = useState<SeasonId>(DEFAULT_SEASON);
  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    let isMounted = true;

    getSettings()
      .then((settings) => {
        if (isMounted) {
          setSelectedSeason(settings.selectedSeason);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedPalette = useMemo(() => getSeason(selectedSeason), [selectedSeason]);

  async function handleSeasonChange(nextSeason: SeasonId) {
    setSelectedSeason(nextSeason);
    setSaveState("saving");
    await saveSelectedSeason(nextSeason);
    setSaveState("saved");
    window.setTimeout(() => setSaveState("idle"), 1400);
  }

  return (
    <main className="popup-shell">
      <header className="popup-header">
        <p className="eyebrow">Shopping palette assistant</p>
        <h1>Color Season</h1>
        <p>
          Choose a palette. Product page badges stay local to this browser and use page
          text or metadata only.
        </p>
      </header>

      <section aria-labelledby="season-picker-title" className="card">
        <div className="section-heading">
          <h2 id="season-picker-title">Selected season</h2>
          <span aria-live="polite" className="save-state">
            {isLoading ? "Loading" : saveState === "saving" ? "Saving" : saveState === "saved" ? "Saved" : ""}
          </span>
        </div>

        <div className="season-grid" role="radiogroup" aria-label="Color season">
          {seasonList.map((season) => (
            <button
              aria-checked={selectedSeason === season.id}
              className="season-button"
              data-active={selectedSeason === season.id}
              disabled={isLoading}
              key={season.id}
              onClick={() => handleSeasonChange(season.id)}
              role="radio"
              type="button"
            >
              <span>{season.name}</span>
              <small>{season.traits.join(" · ")}</small>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="palette-title" className="card palette-card">
        <h2 id="palette-title">{selectedPalette.name} palette cues</h2>
        <dl>
          <div>
            <dt>Best colors</dt>
            <dd>{selectedPalette.bestColors.join(", ")}</dd>
          </div>
          <div>
            <dt>Key neutrals</dt>
            <dd>{selectedPalette.keyNeutrals.join(", ")}</dd>
          </div>
          <div>
            <dt>Less ideal signals</dt>
            <dd>{selectedPalette.avoidColors.join(", ")}</dd>
          </div>
        </dl>
      </section>

      <footer>
        <strong>Badge states:</strong> Great match, Possible match, Less ideal, or Color
        unknown.
      </footer>
    </main>
  );
}
