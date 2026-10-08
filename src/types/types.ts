import type { AirportLeg } from '../lib/pricing/airport';
import type { ShortTripBreakdown } from '../lib/pricing/shortTrip';

export type { AirportLeg };

export interface ShortTripTier {
  pricePerMinute: number;
  pricePerKm: number;
  unlockFee?: number;
  includedKm?: number | null;
  airportPickupFee?: number;
  airportDropoffFee?: number;
  airportFee?: number;
  minTripPrice?: number;
  parkingPerMinute?: number;
}

export interface ShortTripData {
  [provider: string]: {
    [tier: string]: ShortTripTier;
  };
}

export interface LongTripSlot {
  includedKms: number | null;
  price: number | null;
  pricePerKm: number;
  extraKms?: number;
  unavailableReason?: string;
}

export interface LongTripData {
  [provider: string]: {
    [tier: string]: {
      [time: string]: LongTripSlot;
    };
  };
}

export interface ShortTripResultRow {
  provider: string;
  tier: string;
  price: number;
  totalCents: number;
  breakdown: ShortTripBreakdown;
}

export interface LongTripResultRow {
  provider: string;
  tier: string;
  price: number | null;
  totalCents: number | null;
  display: string;
  breakdown?: import('../lib/pricing/longTrip').LongTripBreakdown;
}

export interface MinPrices {
  provider: string;
  tier: string;
}

export interface Prices {
  [provider: string]: { [tier: string]: number | 'N/A' };
}
