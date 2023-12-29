<script lang="ts">
  export let longTripData: LongTripData = {};

  import type { LongTripData, PriceData, MinPrices } from '../../types/types';
  import Range from '../Range.svelte';
  import { fade, fly } from 'svelte/transition';
  import { sineIn } from 'svelte/easing';
  import Controls from './Controls.svelte';
  import Results from './Results.svelte';

  let time = '1h';
  let distance: number;

  let priceData: PriceData[] = [];

  let minPriceProvider = null;
  let minPriceTier = null;
  let minPrices: MinPrices[] = [];

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

        let totalPrice: number | string = 'N/A';

        if (includedKms && distance <= includedKms) {
          totalPrice = price !== null ? price : 'N/A';
        } else {
          const extraKmsPrice = extraKms > 0 ? extraKms : pricePerKm;
          const extraKmsAmount = includedKms ? distance - includedKms : 0;
          totalPrice =
            price !== null ? price + extraKmsAmount * extraKmsPrice : 'N/A';
        }

        const formattedPrice = tierData.price
          ? parseFloat(totalPrice.toString()).toFixed(2)
          : 'N/A';

        updatedPriceData.push({
          provider,
          tier,
          price: formattedPrice,
        });

        if (formattedPrice === 'N/A') {
          continue;
        }

        if (totalPrice.toString() !== 'N/A') {
          if (Number(totalPrice) < lowestPrice) {
            lowestPrice = Number(totalPrice);
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
