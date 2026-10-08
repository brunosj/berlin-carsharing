<script lang="ts">
  export let shortTripData: ShortTripData = {};

  import type { ShortTripData } from '../../types/types';
  import Results from './Results.svelte';
  import Controls from './Controls.svelte';
  import { fly } from 'svelte/transition';
  import { sineIn } from 'svelte/easing';
  import type { AirportLeg } from '../../lib/pricing/airport';
  import { computeAllShortTrips } from '../../lib/pricing/computeAllShortTrips';
  import { finiteNumber } from '../../lib/pricing/parseNumberInput';

  let distance = 0;
  let time = 0;
  let airportLeg: AirportLeg = 'none';
  let milesParkingMinutes = 0;
  let inputSource: 'manual' | 'route' = 'manual';

  $: tripInput = {
    minutes: finiteNumber(time),
    distanceKm: finiteNumber(distance),
    airportLeg,
    milesParkingMinutes: finiteNumber(milesParkingMinutes),
  };

  $: ({ rows, minPrices, empty } = computeAllShortTrips(shortTripData, tripInput));
</script>

<section in:fly={{ y: 200, duration: 300, easing: sineIn }}>
  <Controls
    bind:distance
    bind:time
    bind:airportLeg
    bind:milesParkingMinutes
    bind:inputSource
  />
  <Results {rows} {minPrices} {empty} />
</section>
