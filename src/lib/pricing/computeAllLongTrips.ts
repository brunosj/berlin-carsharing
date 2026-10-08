import type { LongTripData, LongTripResultRow, MinPrices } from '../../types/types';
import type { AirportLeg } from './airport';
import { computeLongTripPrice } from './longTrip';
import { getUnlockFee } from '../../data/unlockFee';
import { shortTripData } from '../../data/shortTripData';

function airportFeesFor(provider: string, tier: string) {
  const tiers = shortTripData[provider as keyof typeof shortTripData] as
    | Record<
        string,
        { airportPickupFee?: number; airportDropoffFee?: number; airportFee?: number }
      >
    | undefined;
  if (!tiers) return {};
  const t =
    tiers[tier] ??
    (provider === 'SIXT' ? tiers['Share'] : undefined) ??
    tiers[Object.keys(tiers)[0]];
  return {
    airportPickupFee: t?.airportPickupFee ?? t?.airportFee,
    airportDropoffFee: t?.airportDropoffFee ?? t?.airportFee,
  };
}

export function computeAllLongTrips(
  data: LongTripData,
  time: string,
  distanceKm: number,
  airportLeg: AirportLeg
): { rows: LongTripResultRow[]; minPrices: MinPrices[] } {
  const rows: LongTripResultRow[] = [];

  for (const provider of Object.keys(data)) {
    for (const tier of Object.keys(data[provider])) {
      const slot = data[provider][tier][time];
      if (!slot) continue;

      const fees = airportFeesFor(provider, tier);
      const result = computeLongTripPrice(slot, {
        distanceKm,
        airportLeg,
        unlockFee: getUnlockFee(provider, tier),
        ...fees,
      });

      if (result.kind === 'unavailable') {
        rows.push({
          provider,
          tier,
          price: null,
          totalCents: null,
          display: result.reason,
        });
        continue;
      }

      rows.push({
        provider,
        tier,
        price: result.total,
        totalCents: result.totalCents,
        display: result.total.toFixed(2),
        breakdown: result.breakdown,
      });
    }
  }

  const priced = rows.filter((r) => r.totalCents != null) as (LongTripResultRow & {
    totalCents: number;
  })[];
  priced.sort(
    (a, b) => a.totalCents - b.totalCents || a.provider.localeCompare(b.provider)
  );

  const unpriced = rows.filter((r) => r.totalCents == null);
  const sorted = [...priced, ...unpriced];

  const minPrices: MinPrices[] = [];
  if (priced.length > 0) {
    const best = priced[0].totalCents;
    for (const row of priced) {
      if (row.totalCents === best) {
        minPrices.push({ provider: row.provider, tier: row.tier });
      }
    }
  }

  return { rows: sorted, minPrices };
}
