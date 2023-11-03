<!-- Controls.svelte -->
<script>
  export let time;
  export let distance;
  import Range from '../Range.svelte';

  function updateDistanceFromInput(event) {
    distance = parseFloat(event.target.value);
  }
</script>

<div class="controls container">
  <div class="control">
    <div class="parameter">
      <label for="timeInput" class="labelText">Duration (hours)</label>
    </div>
    <div class="duration range-container">
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
  </div>

  <div class="control">
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
          style="width: 3.5rem; height:1.5rem;text-align: center; font-family:monospace; color:white"
        />
      </div>
    </div>
    <div class="range-container">
      <Range bind:value={distance} max={200} />
    </div>
  </div>
</div>

<style>
  .duration {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .unitText {
    font-size: 0.8rem;
    font-family: 'BerlinTypeWeb-Bold';
    letter-spacing: 0.1rem;
  }
  :global(input[type='radio']) {
    /* Styles for the default radio */
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

  :global(input[type='radio']):checked {
    /* Styles for the checked radio */
    background: linear-gradient(90deg, #d39e00, #bb2e23);
    border: 1px solid #fff;
  }

  :global(input[type='radio']):focus {
    /* Styles for the checkbox when focused */
    outline: none;
  }

  @media (min-width: 768px) {
    .unitText {
      font-size: 0.9rem;
    }
  }
</style>
