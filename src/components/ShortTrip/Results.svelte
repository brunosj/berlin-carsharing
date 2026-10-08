<script lang="ts">
  import type { ShortTripResultRow, MinPrices } from '../../types/types';
  import { providerDisplayName } from '../../data/providerDisplayName';
  import { tierLabel } from '../../data/tierLabels';

  export let rows: ShortTripResultRow[] = [];
  export let minPrices: MinPrices[] = [];
  export let empty = true;

  let expandedKey: string | null = null;

  function rowKey(row: ShortTripResultRow) {
    return `${row.provider}-${row.tier}`;
  }

  function isCheapest(row: ShortTripResultRow) {
    return minPrices.some(
      (mp) => mp.provider === row.provider && mp.tier === row.tier
    );
  }

  function toggleExpand(row: ShortTripResultRow) {
    const key = rowKey(row);
    expandedKey = expandedKey === key ? null : key;
  }
</script>

<div class="results container">
  {#if empty}
    <p class="empty">Enter trip time, distance, or airport options to compare prices.</p>
  {/if}

  <p class="sr-only" aria-live="polite">
    {#if minPrices.length > 0}
      Cheapest: {providerDisplayName(minPrices[0].provider)}, tier
      {minPrices[0].tier}.
    {/if}
  </p>

  <table>
    <caption class="caption"
      >Short trip price estimates (baseline “from” rates; apps may differ)</caption
    >
    <thead>
      <tr>
        <th scope="col"><h4>Provider</h4></th>
        <th scope="col"><h4>Tier</h4></th>
        <th scope="col"><h4>Price (EUR)</h4></th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row (rowKey(row))}
        <tr class:lowest-price={isCheapest(row)}>
          <td>{providerDisplayName(row.provider)}</td>
          <td>
            <span class="tier-name">{row.tier}</span>
            <span class="tier-desc">{tierLabel(row.provider, row.tier)}</span>
          </td>
          <td class="price-cell">
            <button
              type="button"
              class="price-btn"
              on:click={() => toggleExpand(row)}
              aria-expanded={expandedKey === rowKey(row)}
            >
              {row.price.toFixed(2)}
            </button>
            {#if expandedKey === rowKey(row)}
              <ul class="breakdown">
                {#if row.breakdown.timeCost > 0}
                  <li>Time: {row.breakdown.timeCost.toFixed(2)} €</li>
                {/if}
                {#if row.breakdown.kmCost > 0}
                  <li>Distance: {row.breakdown.kmCost.toFixed(2)} €</li>
                {/if}
                {#if row.breakdown.parking > 0}
                  <li>Parking (MILES): {row.breakdown.parking.toFixed(2)} €</li>
                {/if}
                <li>Unlock: {row.breakdown.unlock.toFixed(2)} €</li>
                {#if row.breakdown.airport > 0}
                  <li>Airport: {row.breakdown.airport.toFixed(2)} €</li>
                {/if}
              </ul>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .empty {
    font-family: monospace;
    font-size: 0.85rem;
    margin-bottom: 1rem;
    opacity: 0.9;
  }

  .caption {
    caption-side: top;
    text-align: left;
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
    opacity: 0.85;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  :global(.lowest-price) {
    color: #d39e00;
    transition: color 300ms;
  }

  :global(.results) {
    background-color: #383838;
    padding: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: auto;
  }

  th {
    text-align: center;
    padding: 4px;
  }

  td {
    padding: 4px;
    font-size: 0.9rem;
    letter-spacing: 0.05rem;
    vertical-align: top;
  }

  .tier-desc {
    display: block;
    font-size: 0.65rem;
    opacity: 0.75;
    letter-spacing: 0;
  }

  .price-btn {
    background: none;
    border: none;
    color: inherit;
    font-family: monospace;
    cursor: pointer;
    padding: 0;
    text-decoration: underline dotted;
  }

  .price-btn:focus-visible {
    outline: 2px solid #d39e00;
  }

  .breakdown {
    list-style: none;
    padding: 0.25rem 0 0;
    margin: 0;
    font-size: 0.7rem;
    text-align: left;
    opacity: 0.9;
  }

  :global(h4) {
    font-family: monospace;
    margin: 0 0 0.5rem;
  }
</style>
