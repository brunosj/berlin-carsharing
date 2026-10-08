/** Coerce slider/text input; empty or invalid becomes fallback (default 0). */
export function finiteNumber(value: number, fallback = 0): number {
  if (!Number.isFinite(value) || value < 0) return fallback;
  return value;
}

export function parseInputValue(raw: string, fallback: number): number {
  if (raw.trim() === '') return fallback;
  const n = parseFloat(raw);
  return finiteNumber(n, fallback);
}
