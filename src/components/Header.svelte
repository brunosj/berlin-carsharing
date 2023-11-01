<script>
  import { fade } from 'svelte/transition';
  import berlinLogo from '$assets/berlin-logo.svg';
</script>

<header>
  <div class="title" in:fade={{ duration: 700 }}>
    <img
      src={berlinLogo}
      class="logo"
      alt="Berlin Logo"
      style="width: 8rem; background-color:white; margin: auto;"
    />

    <h3>Carsharing<br class="line-break" /> Price Calculator</h3>
  </div>
</header>

<style>
  header {
    background-color: #bd2d1e;
    width: 100%;
    margin-bottom: 2rem;
  }

  .title {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: center;
    justify-content: space-around;
    margin: 0rem 1.5rem;
  }

  h3 {
    text-align: left;
    font-family: 'BerlinTypeWeb-Bold';
  }

  @media (min-width: 768px) {
    .line-break {
      display: none;
    }

    h3 {
      white-space: pre-wrap;
    }
  }
</style>
