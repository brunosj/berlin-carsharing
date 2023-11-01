<script lang="ts">
  import { carsharingData } from './data/data';
  import { onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import Results from './components/Results.svelte';
  import Controls from './components/Controls.svelte';
  import Footer from './components/Footer.svelte';

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

  // Trigger animations
  let ready = false;
  onMount(() => (ready = true));

  // Variables
  let distance = 0;
  let time = 0;
  let airport = false;

  let prices = {};
  let minPriceProvider = null;
  let minPriceTier = null;
  let minPrices = [];

  // Reactive logic
  $: {
    minPrices = [];
    let lowestPrice = Number.POSITIVE_INFINITY;

    for (const provider in carsharingData) {
      for (const tier in carsharingData[provider]) {
        const pricePerMinute = carsharingData[provider][tier].pricePerMinute;
        const pricePerKm = carsharingData[provider][tier].pricePerKm;
        const unlockFee = carsharingData[provider][tier].unlockFee;
        const airportFee = carsharingData[provider][tier].airportFee;
        prices[provider] = prices[provider] || {};

        if (provider === 'Bolt' && airport) {
          prices[provider][tier] = 'N/A';
        } else {
          prices[provider][tier] =
            pricePerMinute * time +
            pricePerKm * distance +
            unlockFee +
            (airport ? airportFee : 0);
        }

        const price = prices[provider][tier];

        if (price === 'N/A') {
          continue;
        }

        if (provider === 'Bolt' && airport) {
          continue;
        }

        if (price < lowestPrice) {
          lowestPrice = price;
          minPrices = [{ provider, tier }];
        } else if (price === lowestPrice) {
          minPrices.push({ provider, tier });
        }
      }
    }
  }
</script>

{#if ready}
  <Header />
  <main>
    <Controls bind:distance bind:time bind:airport />
    <Results
      {carsharingData}
      {minPrices}
      {minPriceProvider}
      {minPriceTier}
      {airport}
      {prices}
    />
  </main>
  <Footer />
{/if}

<style>
  main {
    max-width: 800px;
    margin: auto;
  }

  :global(.container) {
    margin: 1.5rem 1.5rem;
  }
</style>
