import { describe, expect, it } from 'vitest';
import { aggregateRouteLegs } from './parseDirectionsRoute';

describe('aggregateRouteLegs', () => {
  it('sums distance and duration across legs', () => {
    const r = aggregateRouteLegs([
      {
        distanceKm: 5,
        durationMinutes: 10,
        distanceText: '5 km',
        durationText: '10 min',
      },
      {
        distanceKm: 3,
        durationMinutes: 8,
        distanceText: '3 km',
        durationText: '8 min',
      },
    ]);
    expect(r).not.toBeNull();
    expect(r!.distanceKm).toBe(8);
    expect(r!.durationMinutes).toBe(18);
  });
});
