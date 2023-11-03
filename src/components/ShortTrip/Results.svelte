<script>
  export let shortTripData;
  export let minPrices;
  export let airport;
  export let prices;
</script>

<div class="results container">
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
    {#each Object.keys(shortTripData) as provider}
      {#each Object.keys(shortTripData[provider]) as tier}
        <tr
          class:lowest-price={minPrices.find(
            (mp) => mp.provider === provider && mp.tier === tier
          )}
        >
          <td>{provider}</td>
          <td>{tier}</td>
          <td style="font-family:monospace;">
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
  :global(.lowest-price) {
    color: #d39e00;
    transition: all 300ms;
    box-shadow: 0px 0px 2px 0px #d39e00;
    -webkit-appearance: none;
  }

  :global(.results) {
    background-color: #383838;
    border-radius: 15px;
    padding: 1rem;
  }

  :global(.results table) {
    width: 100%;
    border-collapse: collapse;
  }

  :global(.results th) {
    text-align: center;
    padding: 4px;
  }

  :global(.results td) {
    padding: 4px;
  }

  :global(.results td),
  :global(.results th) {
    width: 25%;
  }

  :global(.results td) {
    font-size: 0.9rem;
    letter-spacing: 0.1rem;
  }

  :global(h4) {
    font-family: 'BerlinTypeWeb-Bold';
    text-underline-offset: 6px;
    line-height: normal;
    margin: 0rem 0rem 0.5rem 0rem;
    font-family: monospace;
    letter-spacing: 0rem;
  }

  :global(table) {
    margin: auto;
  }
</style>
