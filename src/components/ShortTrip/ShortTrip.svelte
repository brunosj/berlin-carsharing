<script>
  export let shortTripData;

  import Results from './Results.svelte';
  import Controls from './Controls.svelte';
  import { fade, fly } from 'svelte/transition';
  import { sineIn } from 'svelte/easing';

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

    for (const provider in shortTripData) {
      for (const tier in shortTripData[provider]) {
        const pricePerMinute = shortTripData[provider][tier].pricePerMinute;
        const pricePerKm = shortTripData[provider][tier].pricePerKm;
        const unlockFee = shortTripData[provider][tier].unlockFee;
        const airportFee = shortTripData[provider][tier].airportFee;
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

<section in:fly={{ y: 200, duration: 300, easing: sineIn }}>
  <Controls bind:distance bind:time bind:airport />
  <Results {shortTripData} {minPrices} {airport} {prices} />
</section>
