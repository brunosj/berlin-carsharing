<script lang="ts">
  export let time = '1h';
  export let distance = 0;
  import Range from '../Range.svelte';
  import AirportSelect from '../AirportSelect.svelte';
  import type { AirportLeg } from '../../lib/pricing/airport';
  import type { LongTripData } from '../../types/types';
  import { parseInputValue } from '../../lib/pricing/parseNumberInput';

  export let longTripData: LongTripData = {};
  export let airportLeg: AirportLeg = 'none';

  function onDistanceInput(event: Event) {
    const el = event.target as HTMLInputElement & { valueAsNumber: number };
    distance = parseInputValue(el.value, distance);
    el.value = String(distance);
  }

  $: packageKmHint = (() => {
    const examples: number[] = [];
    for (const provider of Object.keys(longTripData)) {
      const firstTier = Object.keys(longTripData[provider])[0];
      const slot = longTripData[provider][firstTier]?.[time];
      if (slot?.includedKms != null) examples.push(slot.includedKms);
    }
    if (examples.length === 0) return null;
    const min = Math.min(...examples);
    const max = Math.max(...examples);
    return min === max
      ? `Packages for ${time} often include about ${min} km (varies by provider/tier).`
      : `Included km for ${time} varies by tier (about ${min}–${max} km in this data). SIXT included km are estimates.`;
  })();
</script>

<div class="controls container">
  <div class="control">
    <div class="parameter">
      <span class="labelText" id="long-duration-label">Duration (hours)</span>
    </div>
    <div class="duration range-container" role="radiogroup" aria-labelledby="long-duration-label">
      <div class="unit">
        <input type="radio" id="one-hour" bind:group={time} value="1h" />
        <label for="one-hour" class="unitText"> 1 hr </label>
      </div>

      <div class="unit">
        <input type="radio" id="three-hours" bind:group={time} value="3hrs" />
        <label for="three-hours" class="unitText"> 3 hrs </label>
      </div>

      <div class="unit">
        <input type="radio" id="six-hours" bind:group={time} value="6hrs" />
        <label for="six-hours" class="unitText"> 6 hrs </label>
      </div>

      <div class="unit">
        <input type="radio" id="day" bind:group={time} value="day" />
        <label for="day" class="unitText"> 24 hrs </label>
      </div>
    </div>
    {#if packageKmHint}
      <p class="hint">{packageKmHint}</p>
    {/if}
  </div>

  <div class="control">
    <div class="parameter">
      <label for="longDistanceTextInput" class="labelText">Distance (km)</label>
      <div class="unit">
        <input
          type="number"
          id="longDistanceTextInput"
          min="0"
          max="300"
          step="1"
          value={distance}
          on:input={onDistanceInput}
        />
      </div>
    </div>
    <div class="range-container">
      <Range bind:value={distance} max={300} />
    </div>
  </div>

  <AirportSelect bind:value={airportLeg} idPrefix="long-airport" />
</div>

<style>
  .duration {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .hint {
    font-size: 0.7rem;
    font-family: monospace;
    opacity: 0.85;
    margin: 0.75rem 0 0;
    text-align: left;
  }

  .unitText {
    font-size: 0.8rem;
    font-family: 'BerlinTypeWeb-Bold';
    letter-spacing: 0.1rem;
  }

  .labelText {
    font-size: 0.9rem;
    font-family: 'BerlinTypeWeb-Bold';
    letter-spacing: 0.1rem;
  }

  .parameter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .control {
    background-color: #383838;
    border-radius: 15px;
    padding: 1rem;
    margin-top: 1rem;
  }

  .unit input[type='number'] {
    width: 3.5rem;
    height: 1.5rem;
    text-align: center;
    font-family: monospace;
    color: white;
    background-color: #242424;
    border: 1px solid #474747;
    border-radius: 4px;
  }

  :global(input[type='radio']) {
    appearance: none;
    -webkit-appearance: none;
    background-color: #242424;
    width: 1.5rem;
    height: 1.5rem;
    border: 1px solid #474747;
    border-radius: 4px;
    cursor: pointer;
  }

  :global(input[type='radio']:focus-visible) {
    outline: 2px solid #d39e00;
    outline-offset: 2px;
  }

  :global(input[type='radio']:checked) {
    background: linear-gradient(90deg, #d39e00, #bb2e23);
    border: 1px solid #fff;
  }

  @media (min-width: 768px) {
    .unitText {
      font-size: 0.9rem;
    }
  }
</style>
