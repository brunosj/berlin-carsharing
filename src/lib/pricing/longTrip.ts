import { airportFeeTotal, type AirportLeg } from './airport';

export interface LongTripSlotRates {
  includedKms: number | null;
  price: number | null;
  pricePerKm: number;
  extraKms?: number;
  /** Shown when price is null */
  unavailableReason?: string;
}

export interface LongTripInput {
  distanceKm: number;
  airportLeg: AirportLeg;
  airportPickupFee?: number;
  airportDropoffFee?: number;
  unlockFee: number;
}

export type LongTripPriceResult =
  | { kind: 'price'; total: number; totalCents: number; breakdown: LongTripBreakdown }
  | { kind: 'unavailable'; reason: string };

export interface LongTripBreakdown {
  package: number;
  extraKmCost: number;
  unlock: number;
  airport: number;
}

export function computeLongTripPrice(
  slot: LongTripSlotRates,
  input: LongTripInput
): LongTripPriceResult {
  const distanceKm = sanitizeNumber(input.distanceKm);

  if (slot.price === null) {
    return {
      kind: 'unavailable',
      reason: slot.unavailableReason ?? 'No package for this duration',
    };
  }

  const includedKms = slot.includedKms;
  const price = slot.price;
  const extraKmsPrice = (slot.extraKms ?? 0) > 0 ? slot.extraKms! : slot.pricePerKm;

  let packageTotal: number;
  let extraKmCost = 0;

  if (includedKms != null && distanceKm <= includedKms) {
    packageTotal = price;
  } else {
    const extraKmsAmount =
      includedKms != null ? Math.max(0, distanceKm - includedKms) : distanceKm;
    extraKmCost = extraKmsAmount * extraKmsPrice;
    packageTotal = price + extraKmCost;
  }

  const airport = airportFeeTotal(
    input.airportPickupFee,
    input.airportDropoffFee,
    input.airportLeg
  );
  const unlock = input.unlockFee;
  const total = packageTotal + unlock + airport;
  const totalCents = Math.round(total * 100);

  return {
    kind: 'price',
    total,
    totalCents,
    breakdown: {
      package: price,
      extraKmCost,
      unlock,
      airport,
    },
  };
}

export function maxIncludedKmForProviderSlots(
  slots: Record<string, LongTripSlotRates>
): number | null {
  let max: number | null = null;
  for (const slot of Object.values(slots)) {
    if (slot.includedKms != null) {
      max = max == null ? slot.includedKms : Math.max(max, slot.includedKms);
    }
  }
  return max;
}

function sanitizeNumber(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}
