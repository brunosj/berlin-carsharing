import { describe, expect, it } from 'vitest';
import { computeShortTripPrice, hasShortTripInput } from './shortTrip';

describe('computeShortTripPrice', () => {
  it('returns null when trip is empty', () => {
    expect(
      computeShortTripPrice(
        { pricePerMinute: 0.2, pricePerKm: 0.1, unlockFee: 1 },
        { minutes: 0, distanceKm: 0, airportLeg: 'none' }
      )
    ).toBeNull();
    expect(hasShortTripInput({ minutes: 0, distanceKm: 0, airportLeg: 'none' })).toBe(
      false
    );
  });

  it('charges km only beyond included allowance', () => {
    const r = computeShortTripPrice(
      {
        pricePerMinute: 0.17,
        pricePerKm: 0.19,
        includedKm: 200,
        unlockFee: 0.99,
      },
      { minutes: 30, distanceKm: 250, airportLeg: 'none' }
    );
    expect(r).not.toBeNull();
    expect(r!.kmCost).toBeCloseTo(50 * 0.19);
    expect(r!.timeCost).toBeCloseTo(30 * 0.17);
  });

  it('applies airport both ways', () => {
    const r = computeShortTripPrice(
      {
        pricePerMinute: 0,
        pricePerKm: 0.79,
        unlockFee: 1,
        airportPickupFee: 8,
        airportDropoffFee: 8,
      },
      { minutes: 10, distanceKm: 5, airportLeg: 'both' }
    );
    expect(r!.airport).toBe(16);
  });

  it('applies MILES minimum trip price', () => {
    const r = computeShortTripPrice(
      {
        pricePerMinute: 0,
        pricePerKm: 1.29,
        unlockFee: 2,
        minTripPrice: 15,
      },
      { minutes: 0, distanceKm: 1, airportLeg: 'none' }
    );
    expect(r!.total).toBe(15);
  });

  it('adds MILES parking minutes only when set', () => {
    const r = computeShortTripPrice(
      {
        pricePerMinute: 0,
        pricePerKm: 0.79,
        unlockFee: 1,
        parkingPerMinute: 0.35,
      },
      { minutes: 5, distanceKm: 2, airportLeg: 'none', milesParkingMinutes: 10 }
    );
    expect(r!.parking).toBeCloseTo(3.5);
  });
});
