<script lang="ts">
  import { shortTripData } from './data/shortTripData';
  import { longTripData } from './data/longTripData';
  import { onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import ShortTrip from './components/ShortTrip/ShortTrip.svelte';
  import LongTrip from './components/LongTrip/LongTrip.svelte';
  import Information from './components/Information.svelte';
  import Footer from './components/Footer.svelte';

  import { fly, fade } from 'svelte/transition';
  import { sineIn } from 'svelte/easing';

  import Switch from './components/Switch.svelte';

  // Trigger animations
  let ready = false;
  onMount(() => (ready = true));

  let showShortTrip = true;
  let showLongTrip = false;
  let multiValue = 'short trip';

  $: {
    if (multiValue === 'short trip') {
      showShortTrip = true;
      showLongTrip = false;
    } else if (multiValue === 'long trip') {
      showShortTrip = false;
      showLongTrip = true;
    }
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
        options={['short trip', 'long trip']}
        fontSize={12}
      />
    </div>

    <div in:fly={{ y: 200, duration: 300, easing: sineIn }}>
      {#if showShortTrip}
        <ShortTrip {shortTripData} />
      {/if}

      {#if showLongTrip}
        <LongTrip {longTripData} />
      {/if}
    </div>

    <Information />
  </main>
  <Footer />
{/if}

<style>
  main {
    max-width: 800px;
    margin: auto;
  }

  :global(.container) {
    margin: 1.5rem 1.5rem;
  }
</style>
