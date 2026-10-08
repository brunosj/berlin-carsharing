import { describe, expect, it } from 'vitest';
import { aggregateDirectionsLegs } from './parseDirectionsRoute';

describe('aggregateDirectionsLegs', () => {
  it('sums distance and duration across legs', () => {
    const route = {
      legs: [
        {
          distance: { value: 5000, text: '5 km' },
          duration: { value: 600, text: '10 mins' },
        },
        {
          distance: { value: 3000, text: '3 km' },
          duration: { value: 480, text: '8 mins' },
        },
      ],
    } as google.maps.DirectionsRoute;

    const r = aggregateDirectionsLegs(route);
    expect(r).not.toBeNull();
    expect(r!.distanceKm).toBe(8);
    expect(r!.durationMinutes).toBe(18);
  });
});
