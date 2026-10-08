<script lang="ts">
  import type { AirportLeg } from '../lib/pricing/airport';
  import MdiPlaneCar from '../assets/MdiPlaneCar.svelte';

  export let value: AirportLeg = 'none';
  export let idPrefix = 'airport';
</script>

<div class="control airport-control">
  <div class="parameter">
    <div class="airport">
      <span class="labelText" id="{idPrefix}-label">Airport (BER)</span>
      <MdiPlaneCar />
    </div>
    <select
      id="{idPrefix}-select"
      aria-labelledby="{idPrefix}-label"
      bind:value
      class="select"
    >
      <option value="none">None</option>
      <option value="pickup">Pick-up only</option>
      <option value="dropoff">Drop-off only</option>
      <option value="both">Pick-up and drop-off</option>
    </select>
  </div>
</div>

<style>
  .airport-control {
    background-color: #383838;
    border-radius: 15px;
    padding: 1rem;
    margin-top: 1rem;
  }

  .parameter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .airport {
    display: flex;
    flex-direction: row;
    gap: 0.7rem;
    align-items: center;
  }

  .labelText {
    font-size: 0.9rem;
    font-family: 'BerlinTypeWeb-Bold';
    letter-spacing: 0.1rem;
  }

  .select {
    background-color: #242424;
    border: 1px solid #474747;
    border-radius: 4px;
    color: white;
    font-family: monospace;
    padding: 0.35rem 0.5rem;
    max-width: 12rem;
  }

  .select:focus-visible {
    outline: 2px solid #d39e00;
    outline-offset: 2px;
  }
</style>
