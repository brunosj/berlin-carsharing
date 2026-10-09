<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { Loader } from '@googlemaps/js-api-loader';
  import Location from '../../assets/Location.svelte';
  import Circle from '../../assets/Circle.svelte';
  import { aggregateRouteLegs } from '../../lib/pricing/parseDirectionsRoute';
  import { fetchConsecutiveDrivingLegs } from '../../lib/pricing/fetchRouteLegs';

  type PlaceLike =
    | google.maps.places.PlaceResult
    | google.maps.GeocoderResult;

  interface RouteStop {
    id: string;
    place: PlaceLike | null;
    inputEl?: HTMLInputElement;
    autocomplete?: google.maps.places.Autocomplete;
  }

  const MAX_MIDDLE_STOPS = 8;

  let originAutocomplete: google.maps.places.Autocomplete | undefined;
  let originAddress: PlaceLike | null = null;

  /** Stops between origin and final destination (Google Maps “Add stop”). */
  let middleStops: RouteStop[] = [];
  let destination: RouteStop = { id: 'destination', place: null };

  let routeSummary = '';
  let legCount = 0;
  let errorMessage = '';
  let mapsStatus: 'idle' | 'loading' | 'ready' | 'unavailable' = 'idle';
  let isCurrentLocationChecked = false;

  export let distanceRounded = 0;
  export let durationRounded = 0;
  export let onRouteApplied: (() => void) | undefined = undefined;

  let originInputEl: HTMLInputElement;
  let destinationInputEl: HTMLInputElement;
  let sectionEl: HTMLElement;

  const options: google.maps.places.AutocompleteOptions = {
    componentRestrictions: { country: 'de' },
    strictBounds: false,
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  function newStopId() {
    return `stop-${crypto.randomUUID()}`;
  }

  function locationFromPlace(place: PlaceLike | null) {
    if (!place || !('geometry' in place)) return undefined;
    return place.geometry?.location;
  }

  function ensureMapsLoaded(): Promise<boolean> {
    if (mapsStatus === 'ready') return Promise.resolve(true);
    if (mapsStatus === 'unavailable') return Promise.resolve(false);
    if (mapsStatus === 'loading') {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (mapsStatus === 'ready') {
            clearInterval(interval);
            resolve(true);
          }
          if (mapsStatus === 'unavailable') {
            clearInterval(interval);
            resolve(false);
          }
        }, 100);
      });
    }

    if (!apiKey) {
      mapsStatus = 'unavailable';
      errorMessage = 'Maps unavailable — use manual input (missing API key).';
      return Promise.resolve(false);
    }

    mapsStatus = 'loading';
    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    });

    return new Promise((resolve) => {
      loader.loadCallback((e) => {
        if (e) {
          mapsStatus = 'unavailable';
          errorMessage = 'Maps unavailable — use manual input.';
          resolve(false);
          return;
        }

        mapsStatus = 'ready';

        originAutocomplete = new google.maps.places.Autocomplete(
          originInputEl,
          options
        );
        originAutocomplete.addListener('place_changed', onOriginPlaceChanged);

        void bindDestinationAutocomplete();
        void bindAllMiddleStops();
        resolve(true);
      });
    });
  }

  function mapsApiAvailable(): boolean {
    return (
      mapsStatus === 'ready' &&
      typeof google !== 'undefined' &&
      !!google?.maps?.places
    );
  }

  function bindAutocompleteToStop(
    stop: RouteStop,
    onUpdate: (place: google.maps.places.PlaceResult) => void
  ) {
    if (!mapsApiAvailable() || !stop.inputEl || stop.autocomplete) return;
    stop.autocomplete = new google.maps.places.Autocomplete(
      stop.inputEl,
      options
    );
    stop.autocomplete.addListener('place_changed', () => {
      onUpdate(stop.autocomplete!.getPlace());
    });
  }

  async function bindDestinationAutocomplete() {
    await tick();
    if (!mapsApiAvailable() || !destinationInputEl) return;
    if (destination.autocomplete) return;
    destination.inputEl = destinationInputEl;
    bindAutocompleteToStop(destination, (place) => {
      destination = { ...destination, place };
      void calculateRoute();
    });
  }

  async function bindAllMiddleStops() {
    for (const stop of middleStops) {
      await bindMiddleStopAutocomplete(stop);
    }
  }

  async function bindMiddleStopAutocomplete(stop: RouteStop) {
    await tick();
    if (!stop.inputEl) return;
    bindAutocompleteToStop(stop, (place) => {
      middleStops = middleStops.map((s) =>
        s.id === stop.id ? { ...s, place } : s
      );
      void calculateRoute();
    });
  }

  function onSectionFocusIn() {
    void ensureMapsLoaded();
  }

  function onOriginPlaceChanged() {
    if (!originAutocomplete) return;
    originAddress = originAutocomplete.getPlace();
    void calculateRoute();
  }

  async function addMiddleStop() {
    if (middleStops.length >= MAX_MIDDLE_STOPS) return;
    const stop: RouteStop = { id: newStopId(), place: null };
    middleStops = [...middleStops, stop];
    await ensureMapsLoaded();
    await bindMiddleStopAutocomplete(stop);
  }

  function removeMiddleStop(id: string) {
    const removed = middleStops.find((s) => s.id === id);
    if (removed?.autocomplete && typeof google !== 'undefined') {
      google.maps.event.clearInstanceListeners(removed.autocomplete);
    }
    middleStops = middleStops.filter((s) => s.id !== id);
    void calculateRoute();
  }

  async function calculateRoute() {
    errorMessage = '';
    routeSummary = '';
    legCount = 0;

    const ready = await ensureMapsLoaded();
    if (!ready) return;

    const origin = locationFromPlace(originAddress);
    const dest = locationFromPlace(destination.place);

    if (!origin || !dest) return;

    const waypointPlaces = middleStops
      .map((s) => locationFromPlace(s.place))
      .filter((loc): loc is google.maps.LatLng => loc != null);

    if (waypointPlaces.length !== middleStops.filter((s) => s.place).length) {
      if (middleStops.some((s) => s.inputEl?.value && !s.place)) {
        errorMessage = 'Select each stop from the address suggestions.';
      }
      return;
    }

    // Distance Matrix between consecutive stops — avoids legacy Directions API
    // (often disabled / not activated on newer Google Cloud projects).
    const points = [origin, ...waypointPlaces, dest];
    const result = await fetchConsecutiveDrivingLegs(points);
    if ('error' in result) {
      errorMessage = result.error;
      return;
    }

    const aggregated = aggregateRouteLegs(result.legs);
    if (!aggregated) {
      errorMessage = 'Could not read route distance or duration.';
      return;
    }

    legCount = result.legs.length;
    const stopsLabel = legCount > 1 ? ` (${legCount} legs)` : '';
    routeSummary = `${aggregated.distanceText} — ${aggregated.durationText}${stopsLabel}`;
    distanceRounded = aggregated.distanceKm;
    durationRounded = aggregated.durationMinutes;
    onRouteApplied?.();
  }

  async function onCurrentLocationChange() {
    if (!isCurrentLocationChecked) {
      originAddress = null;
      routeSummary = '';
      legCount = 0;
      if (originInputEl) originInputEl.value = '';
      return;
    }

    const ready = await ensureMapsLoaded();
    if (!ready) {
      isCurrentLocationChecked = false;
      return;
    }

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results, status) => {
          if (status === 'OK' && results?.[0]) {
            originAddress = results[0];
            errorMessage = '';
            if (originInputEl) {
              originInputEl.value = results[0].formatted_address ?? '';
            }
            void calculateRoute();
          } else {
            errorMessage = 'Could not resolve your location to an address.';
            isCurrentLocationChecked = false;
          }
        }
      );
    } catch {
      errorMessage =
        'Error retrieving current location — check privacy settings or enter origin manually.';
      isCurrentLocationChecked = false;
    }
  }

  function getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
      });
    });
  }

  function middleStopInputMount(node: HTMLInputElement, stop: RouteStop) {
    stop.inputEl = node;
    if (mapsApiAvailable()) {
      void bindMiddleStopAutocomplete(stop);
    }
    return {
      destroy() {
        if (stop.autocomplete && typeof google !== 'undefined') {
          google.maps.event.clearInstanceListeners(stop.autocomplete);
        }
      },
    };
  }

  onMount(() => {
    if (!apiKey) {
      mapsStatus = 'unavailable';
      errorMessage = 'Maps unavailable — use manual input (missing API key).';
    }
    // Autocomplete is attached after Maps loads (ensureMapsLoaded → bindDestinationAutocomplete)
  });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<section
  class="control geo-section"
  bind:this={sectionEl}
  on:focusin={onSectionFocusIn}
  aria-label="Route geolocation"
>
  <div class="currentLocation">
    <div class="currentLocationChild">
      <input
        type="checkbox"
        id="currentLocationCheckbox"
        bind:checked={isCurrentLocationChecked}
        on:change={onCurrentLocationChange}
      />
      <label for="currentLocationCheckbox" class="smallLabelText"
        >Use current location as origin</label
      >
    </div>
  </div>

  <div class="parameterInput">
    <div aria-hidden="true">
      <Circle />
    </div>
    <input
      type="text"
      id="originAutocomplete"
      bind:this={originInputEl}
      autocomplete="off"
      placeholder="Origin"
      class="input"
    />
  </div>

  {#each middleStops as stop, index (stop.id)}
    <div class="parameterInput stop-row">
      <div class="stop-label" aria-hidden="true">{index + 1}</div>
      <input
        type="text"
        use:middleStopInputMount={stop}
        autocomplete="off"
        placeholder="Stop {index + 1}"
        class="input"
      />
      <button
        type="button"
        class="remove-stop"
        on:click={() => removeMiddleStop(stop.id)}
        aria-label="Remove stop {index + 1}"
      >
        ×
      </button>
    </div>
  {/each}

  <div class="add-stop-row">
    <button
      type="button"
      class="add-stop"
      on:click={addMiddleStop}
      disabled={middleStops.length >= MAX_MIDDLE_STOPS}
    >
      + Add stop
    </button>
    {#if middleStops.length >= MAX_MIDDLE_STOPS}
      <span class="limit-hint">Maximum {MAX_MIDDLE_STOPS} intermediate stops.</span>
    {/if}
  </div>

  <div class="parameterInput destination">
    <div aria-hidden="true">
      <Location />
    </div>
    <input
      type="text"
      id="destinationAutocomplete"
      bind:this={destinationInputEl}
      autocomplete="off"
      placeholder="Final destination"
      class="input"
    />
  </div>

  {#if mapsStatus === 'loading'}
    <p class="status">Loading maps…</p>
  {/if}

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
  {#if routeSummary}
    <div class="results">
      <p>{routeSummary}</p>
    </div>
  {/if}
</section>

<style>
  .geo-section {
    outline: none;
  }

  .parameterInput {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  .stop-row {
    margin-top: 0.5rem;
  }

  .stop-label {
    width: 1.25rem;
    text-align: center;
    font-family: monospace;
    font-size: 0.85rem;
    opacity: 0.8;
  }

  .input {
    width: 100%;
    font-size: 1rem;
  }

  .currentLocation {
    margin-bottom: 0.3rem;
    display: flex;
  }

  .currentLocationChild {
    margin: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  .destination {
    margin-top: 0.5rem;
  }

  .add-stop-row {
    margin-top: 0.65rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .add-stop {
    font-family: 'BerlinTypeWeb-Bold';
    font-size: 0.75rem;
    letter-spacing: 0.05rem;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    border: 1px solid #474747;
    background: #242424;
    color: #fff;
    cursor: pointer;
  }

  .add-stop:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .add-stop:focus-visible,
  .remove-stop:focus-visible {
    outline: 2px solid #d39e00;
    outline-offset: 2px;
  }

  .remove-stop {
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 4px;
    border: 1px solid #474747;
    background: #242424;
    color: #fff;
    cursor: pointer;
    font-size: 1.1rem;
    line-height: 1;
  }

  .limit-hint {
    font-size: 0.65rem;
    font-family: monospace;
    opacity: 0.75;
  }

  .results {
    margin: auto;
    font-size: 1.1rem;
    font-family: 'BerlinTypeWeb-Bold';
    letter-spacing: 0.1rem;
    color: #d39e00;
    font-weight: 500;
    margin-top: 0.5rem;
  }

  .error {
    color: #ff6b6b;
    font-size: 0.9rem;
  }

  .status {
    font-size: 0.85rem;
    opacity: 0.85;
  }

  :global(input[type='text']) {
    background-color: #242424;
    border: 1px solid #474747;
    border-radius: 4px;
    padding: 0.3rem;
  }

  :global(.smallLabelText) {
    font-size: 0.7rem;
    font-family: 'BerlinTypeWeb-Bold';
    letter-spacing: 0.1rem;
    margin-left: auto;
  }

  :global(input[type='checkbox']) {
    appearance: none;
    -webkit-appearance: none;
    background-color: #242424;
    width: 1.5rem;
    height: 1.5rem;
    border: 1px solid #474747;
    border-radius: 4px;
    cursor: pointer;
  }

  :global(input[type='checkbox']:focus-visible) {
    outline: 2px solid #d39e00;
    outline-offset: 2px;
  }

  :global(input[type='checkbox']:checked) {
    background: linear-gradient(90deg, #d39e00, #bb2e23);
    border: 1px solid #fff;
  }

  @media (min-width: 768px) {
    :global(.smallLabelText) {
      font-size: 0.9rem;
    }

    .currentLocation {
      margin-bottom: 1rem;
    }
  }
</style>
