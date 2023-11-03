<script>
  import { fade } from 'svelte/transition';
</script>

<section in:fade={{ duration: 700, delay: 600 }}>
  <p>
    Prices are indicative as some providers present price fluctuations according
    to fuel levels and time of rental. Drive safe!
  </p>
</section>

<style>
  section {
    margin: 1.5rem 1.5rem;
    font-family: monospace;
    font-size: 0.7rem;
  }
</style>
