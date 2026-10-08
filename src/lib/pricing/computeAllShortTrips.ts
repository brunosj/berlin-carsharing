import type { ShortTripData, ShortTripResultRow, MinPrices } from '../../types/types';
import {
  computeShortTripPrice,
  hasShortTripInput,
  type ShortTripInput,
} from './shortTrip';

export function computeAllShortTrips(
  data: ShortTripData,
  input: ShortTripInput
): { rows: ShortTripResultRow[]; minPrices: MinPrices[]; empty: boolean } {
  const empty = !hasShortTripInput(input);
  const rows: ShortTripResultRow[] = [];

  for (const provider of Object.keys(data)) {
    for (const tier of Object.keys(data[provider])) {
      const breakdown = computeShortTripPrice(data[provider][tier], input);
      if (!breakdown) continue;
      rows.push({
        provider,
        tier,
        price: breakdown.total,
        totalCents: breakdown.totalCents,
        breakdown,
      });
    }
  }

  rows.sort((a, b) => a.totalCents - b.totalCents || a.provider.localeCompare(b.provider));

  const minPrices: MinPrices[] = [];
  if (rows.length > 0) {
    const best = rows[0].totalCents;
    for (const row of rows) {
      if (row.totalCents === best) {
        minPrices.push({ provider: row.provider, tier: row.tier });
      }
    }
  }

  return { rows, minPrices, empty };
}
