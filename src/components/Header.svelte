<script lang="ts">
  import { fade } from 'svelte/transition';
  import berlinLogo from '$assets/berlin-logo.svg';
</script>

<header>
  <div class="title-container">
    <div class="title" in:fade={{ duration: 700 }}>
      <!-- <img
        src={berlinLogo}
        class="logo"
        alt="Berlin Logo"
        style="width: 8rem; background-color:white; "
      /> -->
      <div>
        <h3 style="text-align: left; font-family: 'BerlinTypeWeb-Bold';">
          BERLIN
        </h3>
      </div>
      <h3>Carsharing<br class="line-break" /> Price Calculator</h3>
    </div>
  </div>
</header>

<style>
  header {
    background-color: #bd2d1e;
    width: 100%;
    margin-bottom: 1.5rem;
  }

  .title-container {
    max-width: 800px;
    margin: auto;
  }

  .title {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: center;
    justify-content: center;
    margin: 0rem 1.5rem;
  }

  h3 {
    text-align: right;
    letter-spacing: 1.5px;
    /* font-family: 'BerlinTypeWeb-Bold'; */
  }

  @media (min-width: 768px) {
    .line-break {
      display: none;
    }

    h3 {
      white-space: pre-wrap;
      text-align: right;
    }
  }
</style>
