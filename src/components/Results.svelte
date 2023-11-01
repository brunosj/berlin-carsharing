<script>
  export let carsharingData;
  export let minPrices;
  export let minPriceProvider;
  export let minPriceTier;
  export let airport;
  export let prices;

  import { fly } from 'svelte/transition';
  import { sineIn } from 'svelte/easing';
</script>

<div
  class="results container"
  in:fly={{ y: 400, duration: 700, easing: sineIn }}
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
            {airport && provider === 'Bolt'
              ? 'N/A'
              : prices[provider][tier].toFixed(2)}
          </td>
        </tr>
      {/each}
    {/each}
  </table>
</div>

<style>
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
    letter-spacing: 0.1rem;
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
</style>
