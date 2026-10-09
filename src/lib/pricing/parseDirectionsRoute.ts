import type { ParsedRouteLeg } from './parseGoogleLeg';

/** Sum consecutive Distance Matrix legs (origin → stops → destination). */
export function aggregateRouteLegs(
  legs: ParsedRouteLeg[]
): ParsedRouteLeg | null {
  if (!legs.length) return null;

  let distanceKm = 0;
  let durationMinutes = 0;

  for (const leg of legs) {
    distanceKm += leg.distanceKm;
    durationMinutes += leg.durationMinutes;
  }

  if (distanceKm <= 0 || durationMinutes <= 0) return null;

  distanceKm = Math.round(distanceKm * 10) / 10;
  durationMinutes = Math.round(durationMinutes * 10) / 10;

  return {
    distanceKm,
    durationMinutes,
    distanceText: `${distanceKm} km`,
    durationText: formatDurationMinutes(durationMinutes),
  };
}

export function formatDurationMinutes(totalMinutes: number): string {
  const mins = Math.round(totalMinutes);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
}
