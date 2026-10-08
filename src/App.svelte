<script lang="ts">
  import { shortTripData } from './data/shortTripData';
  import { longTripData } from './data/longTripData';
  import { onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import ShortTrip from './components/ShortTrip/ShortTrip.svelte';
  import LongTrip from './components/LongTrip/LongTrip.svelte';
  import Information from './components/Information.svelte';
  import PricingSources from './components/PricingSources.svelte';
  import SidePanel from './components/SidePanel.svelte';
  import Footer from './components/Footer.svelte';

  import { fade } from 'svelte/transition';
  import Switch from './components/Switch.svelte';

  let ready = false;
  onMount(() => (ready = true));

  let multiValue = 'Short trip';

  let privacyOpen = false;
  let howToOpen = false;

  $: isShortTrip = multiValue === 'Short trip';

  function openPrivacy() {
    howToOpen = false;
    privacyOpen = true;
  }

  function openHowTo() {
    privacyOpen = false;
    howToOpen = true;
  }
</script>

{#if ready}
  <Header />

  <main>
    <div in:fade={{ duration: 700 }}>
      <Switch
        bind:value={multiValue}
        label=""
        design="multi"
        options={['Short trip', 'Long trip']}
        fontSize={16}
      />
    </div>

    <div class="trip-panels">
      <div class="panel" class:hidden={!isShortTrip} aria-hidden={!isShortTrip}>
        <ShortTrip {shortTripData} />
      </div>
      <div class="panel" class:hidden={isShortTrip} aria-hidden={isShortTrip}>
        <LongTrip {longTripData} />
      </div>
    </div>

    <div class="info-bar">
      <button type="button" class="info-btn" on:click={openPrivacy}>
        Pricing &amp; privacy
      </button>
      <button type="button" class="info-btn" on:click={openHowTo}>
        How to use
      </button>
    </div>
  </main>
  <Footer />

  <SidePanel bind:open={privacyOpen} side="left" title="Pricing & privacy">
    <PricingSources />
  </SidePanel>

  <SidePanel bind:open={howToOpen} side="right" title="How to use">
    <Information />
  </SidePanel>
{/if}

<style>
  main {
    max-width: 800px;
    margin: auto;
  }

  .trip-panels {
    position: relative;
  }

  .panel.hidden {
    display: none;
  }

  .info-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    margin: 1.5rem 1.5rem 0;
  }

  .info-btn {
    appearance: none;
    font-family: 'BerlinTypeWeb-Bold', monospace;
    font-size: 0.85rem;
    color: #fff;
    background: #242424;
    border: 1px solid #383838;
    padding: 0.55rem 1rem;
    cursor: pointer;
  }

  .info-btn:hover,
  .info-btn:focus-visible {
    outline: 2px solid #d39e00;
    border-color: #d39e00;
    color: #d39e00;
  }

  :global(.container) {
    margin: 1.5rem 1.5rem;
  }
</style>
