import type { ParsedRouteLeg } from './parseGoogleLeg';

/** Sum all legs of a driving route (origin → stops → destination). */
export function aggregateDirectionsLegs(
  route: google.maps.DirectionsRoute | undefined
): ParsedRouteLeg | null {
  const legs = route?.legs;
  if (!legs?.length) return null;

  let distanceM = 0;
  let durationSec = 0;

  for (const leg of legs) {
    distanceM += leg.distance?.value ?? 0;
    durationSec += leg.duration_in_traffic?.value ?? leg.duration?.value ?? 0;
  }

  if (distanceM <= 0 || durationSec <= 0) return null;

  const distanceKm = Math.round((distanceM / 1000) * 10) / 10;
  const durationMinutes = Math.round((durationSec / 60) * 10) / 10;

  return {
    distanceKm,
    durationMinutes,
    distanceText: `${distanceKm} km`,
    durationText: formatDurationMinutes(durationMinutes),
  };
}

export function directionsStatusMessage(
  status: google.maps.DirectionsStatus
): string {
  switch (status) {
    case 'ZERO_RESULTS':
      return 'No driving route found for this trip.';
    case 'NOT_FOUND':
      return 'One or more stops could not be found.';
    case 'MAX_WAYPOINTS_EXCEEDED':
      return 'Too many stops (Google Maps limit). Remove a stop and try again.';
    case 'INVALID_REQUEST':
      return 'Invalid route request — check that every stop is selected from the list.';
    default:
      return `Route lookup failed (${status}).`;
  }
}

function formatDurationMinutes(totalMinutes: number): string {
  const mins = Math.round(totalMinutes);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
}
