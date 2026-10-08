<script lang="ts">
  export let longTripData: LongTripData = {};

  import type { LongTripData } from '../../types/types';
  import { fly } from 'svelte/transition';
  import { sineIn } from 'svelte/easing';
  import Controls from './Controls.svelte';
  import Results from './Results.svelte';
  import type { AirportLeg } from '../../lib/pricing/airport';
  import { computeAllLongTrips } from '../../lib/pricing/computeAllLongTrips';
  import { finiteNumber } from '../../lib/pricing/parseNumberInput';

  let time = '1h';
  let distance = 0;
  let airportLeg: AirportLeg = 'none';

  $: ({ rows, minPrices } = computeAllLongTrips(
    longTripData,
    time,
    finiteNumber(distance),
    airportLeg
  ));
</script>

<section in:fly={{ y: 200, duration: 300, easing: sineIn }}>
  <Controls bind:distance bind:time bind:airportLeg {longTripData} />
  <Results {rows} {minPrices} />
</section>
