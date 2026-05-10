import { colorAliases } from "./colorAliases";
import type { ColorCandidate, TextSignal } from "./types";

const NON_WORD_BOUNDARY = /[.*+?^${}()|[\]\\]/g;

function escapeRegExp(value: string): string {
  return value.replace(NON_WORD_BOUNDARY, "\\$&");
}

function normalizeText(value: string): string {
  return value
    .replace(/[_/|+]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function aliasPattern(alias: string): RegExp {
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(alias)}([^a-z0-9]|$)`, "i");
}

function aliasSpecificity(alias: string): number {
  return Math.max(1, alias.split(/\s+/).length);
}

export function extractColorCandidates(signals: TextSignal[]): ColorCandidate[] {
  const candidateMap = new Map<string, ColorCandidate>();

  for (const signal of signals) {
    const text = normalizeText(signal.text);
    if (!text) {
      continue;
    }

    for (const color of colorAliases) {
      for (const alias of color.aliases) {
        if (!aliasPattern(alias).test(text)) {
          continue;
        }

        const existing = candidateMap.get(color.canonicalName);
        const signalWeight = signal.weight ?? 1;
        const matchScore = signalWeight * aliasSpecificity(alias);

        if (existing) {
          existing.score += matchScore;
          existing.sources = Array.from(new Set([...existing.sources, signal.source]));
          if (alias.length > existing.matchedAlias.length) {
            existing.matchedAlias = alias;
          }
        } else {
          candidateMap.set(color.canonicalName, {
            canonicalName: color.canonicalName,
            matchedAlias: alias,
            score: matchScore,
            sources: [signal.source]
          });
        }
      }
    }
  }

  return Array.from(candidateMap.values()).sort((a, b) => b.score - a.score);
}

export function uniqueSignals(signals: TextSignal[]): TextSignal[] {
  const seen = new Set<string>();
  const unique: TextSignal[] = [];

  for (const signal of signals) {
    const text = signal.text.trim();
    if (!text) {
      continue;
    }
    const key = `${signal.source}:${normalizeText(text)}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push({ ...signal, text });
  }

  return unique;
}
