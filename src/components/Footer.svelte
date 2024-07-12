<script lang="ts">
  import { fade } from 'svelte/transition';
  import landozoneLogo from '$assets/lz_logo_name.png';
</script>

<footer in:fade={{ duration: 700, delay: 600 }}>
  <p>latest update: 12.07.2024</p>
  <a href="https://github.com/brunosj/berlin-carsharing" target="_blank"
    >view code</a
  >
  <p></p>
  <div>
    <p>built by</p>
    <a href="https://landozone.net" target="_blank">
      <img
        src={landozoneLogo}
        class="logo"
        alt="Landozone Logo"
        style="width: 4rem;"
      />
    </a>
  </div>
</footer>

<style>
  footer {
    margin: 1.5rem 1.5rem;
    font-family: monospace;
    font-size: 0.7rem;
  }

  a {
    color: #fff;
    text-transform: underline;
  }
</style>
