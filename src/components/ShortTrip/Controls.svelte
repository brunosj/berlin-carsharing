<script lang="ts">
  import Range from '../Range.svelte';
  import GeoLocation from './GeoLocation.svelte';
  import AirportSelect from '../AirportSelect.svelte';
  import type { AirportLeg } from '../../lib/pricing/airport';
  import { parseInputValue } from '../../lib/pricing/parseNumberInput';

  export let distance = 0;
  export let time = 0;
  export let airportLeg: AirportLeg = 'none';
  export let milesParkingMinutes = 0;
  export let inputSource: 'manual' | 'route' = 'manual';

  function onDistanceInput(event: Event) {
    inputSource = 'manual';
    const el = event.target as HTMLInputElement;
    distance = parseInputValue(el.value, distance);
    el.value = String(distance);
  }

  function onTimeInput(event: Event) {
    inputSource = 'manual';
    const el = event.target as HTMLInputElement;
    time = parseInputValue(el.value, time);
    el.value = String(time);
  }

  function onParkingInput(event: Event) {
    const el = event.target as HTMLInputElement;
    milesParkingMinutes = parseInputValue(el.value, milesParkingMinutes);
    el.value = String(milesParkingMinutes);
  }

  function onRouteApplied() {
    inputSource = 'route';
  }

  function onRangeChange() {
    inputSource = 'manual';
  }
</script>

<div class="container">
  <h3>Geolocation input</h3>
  <GeoLocation
    bind:distanceRounded={distance}
    bind:durationRounded={time}
    onRouteApplied={onRouteApplied}
  />

  <p class="source-hint">
    Distance & duration:
    <strong>{inputSource === 'route' ? 'from route' : 'manual'}</strong>
  </p>

  <h3>Manual input</h3>

  <div class="control">
    <div class="parameter">
      <label for="timeTextInput" class="labelText">Duration (minutes)</label>
      <div class="unit">
        <input
          type="number"
          id="timeTextInput"
          min="0"
          max="60"
          step="1"
          value={time}
          on:input={onTimeInput}
        />
      </div>
    </div>
    <div class="range-container">
      <Range
        bind:value={time}
        max={60}
        on:change={onRangeChange}
      />
    </div>
  </div>

  <div class="control">
    <div class="parameter">
      <label for="distanceTextInput" class="labelText">Distance (km)</label>
      <div class="unit">
        <input
          type="number"
          id="distanceTextInput"
          min="0"
          max="300"
          step="0.1"
          value={distance}
          on:input={onDistanceInput}
        />
      </div>
    </div>
    <div class="range-container">
      <Range
        bind:value={distance}
        max={300}
        on:change={onRangeChange}
      />
    </div>
  </div>

  <div class="control">
    <div class="parameter">
      <label for="milesParkingInput" class="labelText"
        >MILES: minutes parked (optional)</label
      >
      <div class="unit">
        <input
          type="number"
          id="milesParkingInput"
          min="0"
          max="120"
          step="1"
          value={milesParkingMinutes}
          on:input={onParkingInput}
        />
      </div>
    </div>
  </div>

  <AirportSelect bind:value={airportLeg} idPrefix="short-airport" />
</div>

<style>
  .parameter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .labelText {
    font-size: 0.9rem;
    font-family: 'BerlinTypeWeb-Bold';
    letter-spacing: 0.1rem;
  }

  h3 {
    letter-spacing: 0.1rem;
    font-family: 'BerlinTypeWeb-Bold';
  }

  .source-hint {
    font-size: 0.75rem;
    font-family: monospace;
    opacity: 0.9;
    margin: 0.5rem 0 0;
  }

  .unit {
    display: flex;
    flex-direction: row;
    gap: 4px;
    border-radius: 12px;
    align-items: center;
  }

  .control {
    background-color: #383838;
    border-radius: 15px;
    padding: 1rem;
    margin-top: 1rem;
  }

  .range-container {
    margin-top: 0.7rem;
  }

  input[type='number'] {
    width: 3.5rem;
    height: 1.5rem;
    text-align: center;
    font-family: monospace;
    color: white;
    background-color: #242424;
    border: 1px solid #474747;
    border-radius: 4px;
  }

  input[type='number']:focus-visible {
    outline: 2px solid #d39e00;
    outline-offset: 2px;
  }

  @media (min-width: 768px) {
    .labelText {
      font-size: 1rem;
    }
  }
</style>
