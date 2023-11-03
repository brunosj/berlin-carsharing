<!-- Results.svelte -->
<script>
  export let priceData;
  export let minPrices;

  import { fade } from 'svelte/transition';
  import { sineIn } from 'svelte/easing';
</script>

<div class="results container" in:fade={{ duration: 300, easing: sineIn }}>
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
    {#each priceData as result (result.provider + result.tier)}
      <tr
        class:lowest-price={minPrices.find(
          (mp) => mp.provider === result.provider && mp.tier === result.tier
        )}
      >
        <td>{result.provider}</td>
        <td>{result.tier}</td>
        <td style="font-family: monospace;">{result.price}</td>
      </tr>
    {/each}
  </table>
</div>
