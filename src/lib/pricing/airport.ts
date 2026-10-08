export type AirportLeg = 'none' | 'pickup' | 'dropoff' | 'both';

export function airportFeeTotal(
  pickupFee: number | undefined,
  dropoffFee: number | undefined,
  leg: AirportLeg
): number {
  const pickup = pickupFee ?? 0;
  const dropoff = dropoffFee ?? pickup;

  switch (leg) {
    case 'pickup':
      return pickup;
    case 'dropoff':
      return dropoff;
    case 'both':
      return pickup + dropoff;
    default:
      return 0;
  }
}
