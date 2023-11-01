<script>
  export let distance = 0;
  export let time = 0;
  export let airport = false;

  import { fly } from 'svelte/transition';
  import { sineIn } from 'svelte/easing';
  import MdiPlaneCar from '../assets/MdiPlaneCar.svelte';
  import Range from './Range.svelte';

  function updateDistanceFromInput(event) {
    distance = parseFloat(event.target.value);
  }

  function updateTimeFromInput(event) {
    time = parseFloat(event.target.value);
  }
</script>

<div class="controls container">
  <div class="control" in:fly={{ y: 200, duration: 700, easing: sineIn }}>
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
          style="width: 3.5rem; height:1.5rem;text-align: center; font-family:monospace;"
        />
        <!-- <span>km</span> -->
      </div>
    </div>
    <div class="range-container">
      <Range bind:value={distance} id="basic-slider" max={50} />
    </div>
  </div>

  <div class="control" in:fly={{ y: 400, duration: 700, easing: sineIn }}>
    <div class="parameter">
      <label for="timeInput" class="labelText">Time (minutes)</label>
      <div class="unit">
        <input
          type="number"
          id="timeTextInput"
          min="0"
          max="60"
          step="1"
          bind:value={time}
          on:input={updateTimeFromInput}
          style="width: 3.5rem; height:1.5rem;text-align: center; font-family:monospace;"
        />
      </div>
    </div>
    <div class="range-container">
      <Range bind:value={time} id="basic-slider" max={60} />
    </div>
  </div>

  <div class="control" in:fly={{ y: 600, duration: 700, easing: sineIn }}>
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

  .airport {
    display: flex;
    flex-direction: row;
    gap: 0.7rem;
    align-items: center;
  }

  .unit {
    display: flex;
    flex-direction: row;
    gap: 10px;
    border-radius: 12px;
  }

  .control {
    background-color: #383838;
    border-radius: 15px;
    padding: 1rem;
    margin-top: 2rem;
  }

  .range-container {
    margin-top: 1rem;
  }

  input[type='number'] {
    background-color: #242424;
    border: 1px solid #474747;
    border-radius: 4px;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    background-color: #242424;
    border: 1px solid #474747;
    border-radius: 4px;
  }

  input[type='checkbox'] {
    /* Styles for the default checkbox */
    appearance: none;
    -webkit-appearance: none;
    background-color: #242424;
    width: 1.5rem;
    height: 1.5rem;
    border: 1px solid #474747;
    border-radius: 4px;
    position: relative;
    transition: background 0.3s, border 0.3s;
    cursor: pointer;
  }

  input[type='checkbox']:checked {
    /* Styles for the checked checkbox */
    background: linear-gradient(90deg, #d39e00, #bb2e23);
    border: 1px solid #fff;
  }

  input[type='checkbox']:focus {
    /* Styles for the checkbox when focused */
    outline: none;
  }
</style>
