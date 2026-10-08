<script lang="ts">
  import { pricingMeta } from '../data/providerDisplayName';

  function formatDate(iso: string): string {
    const [y, m, d] = iso.split('-');
    return `${d}.${m}.${y}`;
  }
</script>

<section class="sources">
  <h2>Data Privacy</h2>
  <ul>
    <li>
      When you use geolocation or address search, origin and destination are sent
      to Google Maps (Distance Matrix, Places, Geocoding) to estimate route
      length and duration. Google’s privacy policy applies to that processing.
    </li>
    <li>
      This app does not store your addresses on a server; calculations run in
      your browser.
    </li>
  </ul>

  <h2>Pricing data</h2>
  <p>
    Tariffs last reviewed on <strong>{formatDate(pricingMeta.lastUpdated)}</strong>.
    Free2move replaced Share Now in Berlin; the app label matches the current operator.
    {pricingMeta.notes}
    {#if pricingMeta.assumptions?.sixtPackageIncludedKm}
      &nbsp;{pricingMeta.assumptions.sixtPackageIncludedKm}
    {/if}
  </p>
  <ul>
    {#each Object.entries(pricingMeta.providers) as [key, provider] (key)}
      <li>
        <strong>{provider.displayName}</strong>
        {#if 'formerly' in provider && provider.formerly}
          <span class="formerly">(formerly {provider.formerly})</span>
        {/if}
        <ul>
          {#each provider.sources as source (source.url)}
            <li>
              <a href={source.url} target="_blank" rel="noopener noreferrer"
                >{source.label}</a
              >
            </li>
          {/each}
        </ul>
      </li>
    {/each}
  </ul>
  <p class="hint">
    Long-trip estimates include each provider’s unlock/base fee where published.
    Bolt Drive rates are not listed online — those rows stay manual.
  </p>
</section>

<style>
  .sources {
    margin: 0;
    font-family: monospace;
    text-align: left;
    font-size: 0.85rem;
  }

  h2 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    color: #d39e00;
  }

  h2 + ul,
  h2 + p {
    margin-top: 0;
  }

  h2:not(:first-child) {
    margin-top: 1.5rem;
  }

  ul {
    padding-left: 1.2rem;
  }

  li {
    margin: 0.5rem 0;
  }

  a {
    color: #fff;
  }

  .formerly {
    opacity: 0.75;
    font-size: 0.8rem;
  }

  .hint {
    margin-top: 1rem;
    font-size: 0.7rem;
    opacity: 0.85;
  }
</style>
