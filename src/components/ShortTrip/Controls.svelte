<script lang="ts">
  export let distance = 0;
  export let time = 0;
  export let airport = false;
  import MdiPlaneCar from '../../assets/MdiPlaneCar.svelte';
  import Range from '../Range.svelte';
  import GeoLocation from './GeoLocation.svelte';
</script>

<div class="container">
  <GeoLocation bind:distanceRounded={distance} bind:durationRounded={time} />
  <!-- <div class="control">
    <div class="parameter">
      <label for="timeInput" class="labelText">Duration (minutes)</label>
      <div class="unit">
        <input
          type="number"
          id="timeTextInput"
          min="0"
          max="60"
          step="1"
          bind:value={time}
          on:input={updateTimeFromInput}
          style="width: 3.5rem; height:1.5rem;text-align: center; font-family:monospace; color:white;"
        />
      </div>
    </div>
    <div class="range-container">
      <Range bind:value={time} max={60} />
    </div>
  </div> -->

  <!-- <div class="control">
    <div class="parameter">
      <label for="distanceInput" class="labelText">Distance (km)</label>
      <div class="unit">
        <input
          type="number"
          id="distanceTextInput"
          min="0"
          max="50"
          step="1"
          bind:value={distance}
          on:input={updateDistanceFromInput}
          style="width: 3.5rem; height:1.5rem;text-align: center; font-family:monospace; color:white;"
        />
      </div>
    </div>
    <div class="range-container">
      <Range bind:value={distance} id="basic-slider" max={50} />
    </div>
  </div> -->

  <div class="control">
    <div class="parameter">
      <div class="airport">
        <label for="airportInput" class="labelText"
          >Airport pick-up/drop-off</label
        >
        <MdiPlaneCar />
      </div>

      <input
        type="checkbox"
        id="airportCheckbox"
        bind:checked={airport}
        style="text-align: center; font-family:monospace;"
      />
    </div>
  </div>
</div>

<style>
  :global(.parameter) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  :global(.labelText) {
    font-size: 0.9rem;
    font-family: 'BerlinTypeWeb-Bold';
    letter-spacing: 0.1rem;
  }

  .airport {
    display: flex;
    flex-direction: row;
    gap: 0.7rem;
    align-items: center;
  }

  :global(.unit) {
    display: flex;
    flex-direction: row;
    gap: 4px;
    border-radius: 12px;
    align-items: center;
  }

  :global(.control) {
    background-color: #383838;
    border-radius: 15px;
    padding: 1rem;
    margin-top: 1rem;
  }

  :global(.range-container) {
    margin-top: 0.7rem;
  }

  :global(input[type='number']) {
    background-color: #242424;
    border: 1px solid #474747;
    border-radius: 4px;
  }

  :global(input[type='number'])::-webkit-inner-spin-button,
  :global(input[type='number'])::-webkit-outer-spin-button {
    background-color: #242424;
    border: 1px solid #474747;
    border-radius: 4px;
  }

  :global(input[type='checkbox']) {
    /* Styles for the default checkbox */
    appearance: none;
    -webkit-appearance: none;
    background-color: #242424;
    width: 1.5rem;
    height: 1.5rem;
    border: 1px solid #474747;
    border-radius: 4px;
    position: relative;
    transition:
      background 0.3s,
      border 0.3s;
    cursor: pointer;
  }

  :global(input[type='checkbox']):checked {
    /* Styles for the checked checkbox */
    background: linear-gradient(90deg, #d39e00, #bb2e23);
    border: 1px solid #fff;
  }

  :global(input[type='checkbox']):focus {
    /* Styles for the checkbox when focused */
    outline: none;
  }

  @media (min-width: 768px) {
    :global(.unit) {
      gap: 8px;
    }
    :global(.labelText) {
      font-size: 1rem;
    }
  }
</style>
