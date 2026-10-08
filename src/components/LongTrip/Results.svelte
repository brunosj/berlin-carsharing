<script lang="ts">
  import type { LongTripResultRow, MinPrices } from '../../types/types';
  import { providerDisplayName } from '../../data/providerDisplayName';
  import { tierLabel } from '../../data/tierLabels';
  import { fade } from 'svelte/transition';
  import { sineIn } from 'svelte/easing';

  export let rows: LongTripResultRow[] = [];
  export let minPrices: MinPrices[] = [];

  let expandedKey: string | null = null;

  function rowKey(row: LongTripResultRow) {
    return `${row.provider}-${row.tier}`;
  }

  function isCheapest(row: LongTripResultRow) {
    return minPrices.some(
      (mp) => mp.provider === row.provider && mp.tier === row.tier
    );
  }
</script>

<div class="results container" in:fade={{ duration: 300, easing: sineIn }}>
  <p class="sr-only" aria-live="polite">
    {#if minPrices.length > 0}
      Cheapest long trip: {providerDisplayName(minPrices[0].provider)}, tier
      {minPrices[0].tier}.
    {/if}
  </p>

  <table>
    <caption class="caption"
      >Long trip estimates (baseline packages; apps may differ)</caption
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
            {#if row.breakdown}
              <button
                type="button"
                class="price-btn"
                on:click={() =>
                  (expandedKey =
                    expandedKey === rowKey(row) ? null : rowKey(row))}
                aria-expanded={expandedKey === rowKey(row)}
              >
                {row.display}
              </button>
              {#if expandedKey === rowKey(row)}
                <ul class="breakdown">
                  <li>Package: {row.breakdown.package.toFixed(2)} €</li>
                  {#if row.breakdown.extraKmCost > 0}
                    <li>Extra km: {row.breakdown.extraKmCost.toFixed(2)} €</li>
                  {/if}
                  <li>Unlock: {row.breakdown.unlock.toFixed(2)} €</li>
                  {#if row.breakdown.airport > 0}
                    <li>Airport: {row.breakdown.airport.toFixed(2)} €</li>
                  {/if}
                </ul>
              {/if}
            {:else}
              <span class="na">{row.display}</span>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
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
  }

  :global(.results) {
    background-color: #383838;
    padding: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    text-align: center;
    padding: 4px;
  }

  td {
    padding: 4px;
    font-size: 0.9rem;
    vertical-align: top;
  }

  .tier-desc {
    display: block;
    font-size: 0.65rem;
    opacity: 0.75;
  }

  .price-btn {
    background: none;
    border: none;
    color: inherit;
    font-family: monospace;
    cursor: pointer;
    text-decoration: underline dotted;
  }

  .na {
    font-family: monospace;
    font-size: 0.75rem;
    opacity: 0.85;
  }

  .breakdown {
    list-style: none;
    padding: 0.25rem 0 0;
    margin: 0;
    font-size: 0.7rem;
    text-align: left;
  }

  :global(h4) {
    font-family: monospace;
    margin: 0 0 0.5rem;
  }
</style>
