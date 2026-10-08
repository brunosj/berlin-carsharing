import { describe, expect, it } from 'vitest';
import { computeLongTripPrice } from './longTrip';

describe('computeLongTripPrice', () => {
  it('returns unavailable when package price is null', () => {
    const r = computeLongTripPrice(
      {
        price: null,
        includedKms: null,
        pricePerKm: 0,
        unavailableReason: 'No 1h package',
      },
      { distanceKm: 10, airportLeg: 'none', unlockFee: 1 }
    );
    expect(r.kind).toBe('unavailable');
  });

  it('adds extra km beyond included package km', () => {
    const r = computeLongTripPrice(
      {
        price: 50,
        includedKms: 40,
        pricePerKm: 0,
        extraKms: 0.59,
      },
      { distanceKm: 50, airportLeg: 'none', unlockFee: 1 }
    );
    expect(r.kind).toBe('price');
    if (r.kind === 'price') {
      expect(r.total).toBeCloseTo(50 + 10 * 0.59 + 1);
    }
  });

  it('includes unlock and airport pickup', () => {
    const r = computeLongTripPrice(
      { price: 20, includedKms: 60, pricePerKm: 0.19, extraKms: 0 },
      {
        distanceKm: 10,
        airportLeg: 'pickup',
        unlockFee: 0.99,
        airportPickupFee: 8,
        airportDropoffFee: 8,
      }
    );
    expect(r.kind).toBe('price');
    if (r.kind === 'price') {
      expect(r.breakdown.airport).toBe(8);
      expect(r.total).toBeCloseTo(20 + 0.99 + 8);
    }
  });
});
