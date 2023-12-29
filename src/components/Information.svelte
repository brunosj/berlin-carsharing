<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<section in:fade={{ duration: 700, delay: 600 }}>
  <h2 style="margin-top:2rem">How to Use the App</h2>

  <ol>
    <li>
      <strong>Toggle Trip Duration</strong>
      <p>
        Use the switch at the top to toggle between short trips (less than 1
        hour) and long trips (more than 1 hour)
      </p>
    </li>

    <li>
      <strong>Short Trip (Less Than 1 Hour)</strong>
      <ul>
        <li>Enter your origin and destination</li>
        <li>
          The app automatically calculates distance and duration, considering
          real-time traffic data
        </li>
        <li>Optionally, add airport pick-up/drop-off</li>
        <li>The cheapest provider and its price are highlighted in yellow</li>
      </ul>
    </li>

    <li>
      <strong>Long Trip (1h, 3h, 6h, or 24h)</strong>
      <ul>
        <li>Select your preferred trip duration</li>
        <li>Enter the number of kilometers you plan to travel</li>
        <li>The cheapest provider and its price are highlighted in yellow</li>
      </ul>
    </li>
  </ol>

  <h2 style="margin-top:2rem">Data Privacy</h2>
  <ul>
    <li>
      The app collects and processes the origin and destination locations you
      provide for trip planning purposes (for short trips)
    </li>
    <li>
      The app uses Google-powered APIs to enhance location accuracy and
      efficiency
    </li>
    <li>
      Your location data is used solely for trip planning and is immediately
      deleted. It is not shared with third parties for any purposes.
    </li>
  </ul>

  <p
    style="margin-top:2rem; margin-bottom:0rem;text-align:center; font-size: 0.7rem;"
  >
    Please note that prices are indicative as some providers present price
    fluctuations according to fuel levels and time of rental. Drive safe!
  </p>
</section>

<style>
  section {
    margin: 1.5rem 1.5rem;
    font-family: monospace;
    text-align: left;
  }

  ol {
    padding: 0rem 0rem 0rem 1.7rem;
  }

  ol > li {
    margin: 1rem 0rem;
  }

  ul {
    padding: 0rem 0.5rem;
  }

  li {
    margin: 0.5rem 0rem;
  }
</style>
