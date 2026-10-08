export interface ParsedRouteLeg {
  distanceKm: number;
  durationMinutes: number;
  distanceText: string;
  durationText: string;
}

export function legFromDistanceMatrixElement(
  element: google.maps.DistanceMatrixResponseElement
): ParsedRouteLeg | null {
  if (element.status !== 'OK') {
    return null;
  }

  const distanceM = element.distance?.value;
  const durationSec =
    element.duration_in_traffic?.value ?? element.duration?.value;

  if (distanceM == null || durationSec == null) {
    return null;
  }

  const distanceKm = Math.round((distanceM / 1000) * 10) / 10;
  const durationMinutes = Math.round((durationSec / 60) * 10) / 10;

  return {
    distanceKm,
    durationMinutes,
    distanceText: element.distance?.text ?? `${distanceKm} km`,
    durationText:
      element.duration_in_traffic?.text ??
      element.duration?.text ??
      `${durationMinutes} min`,
  };
}

export function matrixElementStatusMessage(
  status: google.maps.DistanceMatrixElementStatus
): string {
  switch (status) {
    case 'ZERO_RESULTS':
      return 'No driving route found between these places.';
    case 'NOT_FOUND':
      return 'Origin or destination could not be found.';
    default:
      return `Route lookup failed (${status}).`;
  }
}
