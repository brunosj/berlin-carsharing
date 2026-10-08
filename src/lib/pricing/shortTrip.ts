import { airportFeeTotal, type AirportLeg } from './airport';

export interface ShortTripTierRates {
  pricePerMinute: number;
  pricePerKm: number;
  unlockFee?: number;
  /** Included km on minute tariff; km beyond this uses pricePerKm */
  includedKm?: number | null;
  airportPickupFee?: number;
  airportDropoffFee?: number;
  /** Legacy single fee when pickup/dropoff not split */
  airportFee?: number;
  minTripPrice?: number;
  parkingPerMinute?: number;
}

export interface ShortTripInput {
  minutes: number;
  distanceKm: number;
  airportLeg: AirportLeg;
  milesParkingMinutes?: number;
}

export interface ShortTripBreakdown {
  timeCost: number;
  kmCost: number;
  unlock: number;
  airport: number;
  parking: number;
  total: number;
  totalCents: number;
}

export function hasShortTripInput(input: ShortTripInput): boolean {
  const parking = input.milesParkingMinutes ?? 0;
  return (
    input.minutes > 0 ||
    input.distanceKm > 0 ||
    input.airportLeg !== 'none' ||
    parking > 0
  );
}

export function computeShortTripPrice(
  tier: ShortTripTierRates,
  input: ShortTripInput
): ShortTripBreakdown | null {
  const minutes = sanitizeNumber(input.minutes);
  const distanceKm = sanitizeNumber(input.distanceKm);
  const parkingMinutes = sanitizeNumber(input.milesParkingMinutes ?? 0);

  if (!hasShortTripInput({ ...input, minutes, distanceKm, milesParkingMinutes: parkingMinutes })) {
    return null;
  }

  const included = tier.includedKm;
  const kmBillable =
    included != null && included >= 0
      ? Math.max(0, distanceKm - included)
      : distanceKm;

  const timeCost = tier.pricePerMinute * minutes;
  const kmCost = tier.pricePerKm * kmBillable;
  const unlock = tier.unlockFee ?? 0;
  const pickup = tier.airportPickupFee ?? tier.airportFee;
  const dropoff = tier.airportDropoffFee ?? tier.airportFee;
  const airport = airportFeeTotal(pickup, dropoff, input.airportLeg);
  const parking = (tier.parkingPerMinute ?? 0) * parkingMinutes;

  let total = timeCost + kmCost + unlock + airport + parking;
  if (tier.minTripPrice != null && total < tier.minTripPrice) {
    total = tier.minTripPrice;
  }

  const totalCents = Math.round(total * 100);

  return {
    timeCost,
    kmCost,
    unlock,
    airport,
    parking,
    total,
    totalCents,
  };
}

function sanitizeNumber(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}
