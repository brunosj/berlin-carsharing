<!-- CarSharingComparison.svelte -->
<script>
  export let longTripData;
  import Range from '../Range.svelte';
  import { fade, fly } from 'svelte/transition';
  import { sineIn } from 'svelte/easing';
  import Controls from './Controls.svelte';
  import Results from './Results.svelte';

  let time = '1h';
  let distance = 0;

  let priceData = [];

  let minPriceProvider = null;
  let minPriceTier = null;
  let minPrices = [];

  $: {
    minPrices = [];
    let lowestPrice = Number.POSITIVE_INFINITY;
    let updatedPriceData = [];

    for (const provider in longTripData) {
      for (const tier in longTripData[provider]) {
        const tierData = longTripData[provider][tier][time];
        if (!tierData) continue;
        const includedKms = tierData.includedKms;
        const price = tierData.price;
        const pricePerKm = tierData.pricePerKm;
        const extraKms = tierData.extraKms || 0;

        let totalPrice;

        if (distance <= includedKms) {
          totalPrice = price;
        } else {
          const extraKmsPrice = extraKms > 0 ? extraKms : pricePerKm;
          const extraKmsAmount = distance - includedKms;
          totalPrice = price + extraKmsAmount * extraKmsPrice;
        }

        const formattedPrice = tierData.price
          ? parseFloat(totalPrice).toFixed(2)
          : 'N/A';

        updatedPriceData.push({
          provider,
          tier,
          price: formattedPrice,
        });

        if (formattedPrice === 'N/A') {
          continue;
        }

        if (totalPrice !== 'N/A') {
          if (totalPrice < lowestPrice) {
            lowestPrice = totalPrice;
            minPriceProvider = provider;
            minPriceTier = tier;
            minPrices = [{ provider, tier }];
          } else if (totalPrice === lowestPrice) {
            minPrices.push({ provider, tier });
          }
        }
      }
    }
    priceData = updatedPriceData;
  }
</script>

<section in:fly={{ y: 200, duration: 300, easing: sineIn }}>
  <Controls bind:distance bind:time />
  <Results {priceData} {minPrices} />
</section>
