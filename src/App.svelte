<script lang="ts">
  import berlinLogo from './assets/berlin-logo.svg';
  import landozoneLogo from './assets/lz_logo_name.png';
  import { carsharingData } from './data/data';
  import { onMount } from 'svelte';
  import Range from './components/Range.svelte';
  import { fade, fly } from 'svelte/transition';
  import { circIn, cubicIn, elasticIn, expoIn, sineIn } from 'svelte/easing';

  let ready = false;
  onMount(() => (ready = true));

  let jsonData = null;

  // Will implement fetching from Dropbox at a later stage

  // onMount(async () => {
  //   const dropboxToken = import.meta.env.DROPBOX_ACCESS_TOKEN;
  //   const dropboxPath = import.meta.env.DROPBOX_PATH;

  //   const dropboxURL = `https://content.dropboxapi.com/2/files/download`;
  //   const headers = new Headers({
  //     Authorization: `Bearer ${dropboxToken}`,
  //     'Dropbox-API-Arg': JSON.stringify({ path: dropboxPath }),
  //   });

  //   try {
  //     const response = await fetch(dropboxURL, { method: 'POST', headers });
  //     if (response.status === 200) {
  //       jsonData = await response.json();
  //     } else {
  //       console.error(
  //         'Failed to fetch data from Dropbox:',
  //         response.statusText
  //       );
  //     }
  //   } catch (error) {
  //     console.error('An error occurred while fetching data:', error);
  //   }
  // });

  let distance = 0;
  let time = 0;

  let prices = {};
  let minPriceProvider = null;
  let minPriceTier = null;
  let minPrices = [];

  $: {
    minPrices = [];
    let lowestPrice = Number.POSITIVE_INFINITY;

    for (const provider in carsharingData) {
      for (const tier in carsharingData[provider]) {
        const pricePerMinute = carsharingData[provider][tier].pricePerMinute;
        const pricePerKm = carsharingData[provider][tier].pricePerKm;
        const unlockFee = carsharingData[provider][tier].unlockFee;
        prices[provider] = prices[provider] || {};
        prices[provider][tier] =
          pricePerMinute * time + pricePerKm * distance + unlockFee;

        const price = prices[provider][tier];

        if (price < lowestPrice) {
          lowestPrice = price;
          minPrices = [{ provider, tier }];
        } else if (price === lowestPrice) {
          minPrices.push({ provider, tier });
        }
      }
    }
  }

  function updateDistanceFromInput(event) {
    distance = parseFloat(event.target.value);
  }

  function updateTimeFromInput(event) {
    time = parseFloat(event.target.value);
  }
</script>

<header>
  <div class="title">
    <img
      src={berlinLogo}
      class="logo"
      alt="Berlin Logo"
      style="width: 8rem; background-color:white"
    />

    <h3>Carsharing Price Calculator</h3>
  </div>
</header>

<main>
  {#if ready}
    <div
      class="results container"
      in:fly={{ x: -200, duration: 700, easing: sineIn }}
    >
      <table>
        <tr>
          <th>
            <h4>Provider</h4>
          </th>
          <th>
            <h4>Tier</h4>
          </th>
          <th>
            <h4>Price (EUR)</h4>
          </th>
        </tr>
        {#each Object.keys(carsharingData) as provider}
          {#each Object.keys(carsharingData[provider]) as tier}
            <tr
              class:lowest-price={minPrices.find(
                (mp) => mp.provider === provider && mp.tier === tier
              )}
            >
              <td>{provider}</td>
              <td>{tier}</td>
              <td
                class:lowest-price={provider === minPriceProvider &&
                  tier === minPriceTier}
                style="font-family:monospace;"
              >
                {prices[provider][tier].toFixed(2)}</td
              >
            </tr>
          {/each}
        {/each}
      </table>
    </div>

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
    </div>

    <footer in:fade={{ duration: 700, delay: 600 }}>
      <p>latest update: 01.11.2023</p>
      <div>
        <p>built by</p>
        <a href="https://landozone.net" target="_blank">
          <img
            src={landozoneLogo}
            class="logo"
            alt="Landozone Logo"
            style="width: 4rem;"
          />
        </a>
      </div>
    </footer>
  {/if}
</main>

<style>
  header {
    background-color: #bd2d1e;
    width: 100%;
    margin-bottom: 2rem;
  }

  main {
    max-width: 1200;
  }

  footer {
    margin: 2rem 1.5rem;
    font-family: monospace;
    font-size: 0.7rem;
  }

  h3 {
    text-align: left;
    font-family: 'BerlinTypeWeb-Bold';
  }

  h4 {
    font-family: 'BerlinTypeWeb-Bold';
    text-underline-offset: 6px;
    line-height: normal;
    margin: 0rem 0rem 0.5rem 0rem;
    font-family: monospace;
    letter-spacing: 0rem;
  }

  table {
    margin: auto;
  }

  .title {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;
    margin: auto;
  }

  .container {
    margin: 2rem 1.5rem;
  }

  .title {
    margin: 0rem 1.5rem;
  }

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

  .unit {
    display: flex;
    flex-direction: row;
    gap: 10px;
    border-radius: 12px;
  }

  .lowest-price {
    color: #d39e00;
    transition: all 300ms;
    font-size: 2rem;
    box-shadow: 0px 0px 2px 0px #d39e00;
    -webkit-appearance: none;
  }

  .lowest-price td {
    font-size: 1.1rem;
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

  .results {
    background-color: #383838;
    border-radius: 15px;
    padding: 1rem;
  }

  .results table {
    width: 100%;
    border-collapse: collapse;
  }

  .results th {
    text-align: center;
    padding: 4px;
  }

  .results td {
    padding: 4px;
  }

  .results td,
  .results th {
    width: 25%;
  }

  .results td {
    font-size: 0.9rem;
  }

  input[type='number'] {
    background-color: #242424;
    border: 1px solid #474747;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    background-color: #242424;
    border: 1px solid #474747;
  }
</style>
