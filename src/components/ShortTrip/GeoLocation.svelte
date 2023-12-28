<script>
  import { onMount, afterUpdate } from 'svelte';
  import { Loader } from '@googlemaps/js-api-loader';
  import Location from '../../assets/Location.svelte';
  import Circle from '../../assets/Circle.svelte';

  let originAutocomplete;
  let destinationAutocomplete;

  let originAddress;
  let destinationAddress;

  let distance;
  let duration;

  export let distanceRounded = 0;
  export let durationRounded = 0;

  const options = {
    componentRestrictions: { country: 'de' },
    strictBounds: false,
  };

  onMount(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.loadCallback((e) => {
      if (e) {
        console.log(e);
      } else {
        // @ts-ignore
        originAutocomplete = new google.maps.places.Autocomplete(
          document.getElementById('originAutocomplete'),
          options
        );
        originAutocomplete.addListener('place_changed', onOriginPlaceChanged);
        // @ts-ignore
        destinationAutocomplete = new google.maps.places.Autocomplete(
          document.getElementById('destinationAutocomplete'),
          options
        );
        destinationAutocomplete.addListener(
          'place_changed',
          onDestinationPlaceChanged
        );
      }
    });

    function onOriginPlaceChanged() {
      originAddress = originAutocomplete.getPlace();
      calculateDistanceAndDuration();
    }

    function onDestinationPlaceChanged() {
      destinationAddress = destinationAutocomplete.getPlace();
      calculateDistanceAndDuration();
    }

    async function calculateDistanceAndDuration() {
      try {
        if (originAddress && destinationAddress) {
          const originLocation = originAddress.geometry.location;
          const destinationLocation = destinationAddress.geometry.location;
          // @ts-ignore
          const service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix(
            {
              origins: [originLocation],
              destinations: [destinationLocation],
              travelMode: 'DRIVING',
              drivingOptions: {
                departureTime: new Date(Date.now()),
                trafficModel: 'bestguess',
              },
            },
            (response, status) => {
              if (status === 'OK') {
                distance = response.rows[0].elements[0].distance.text;
                duration =
                  response.rows[0].elements[0].duration_in_traffic.text;
              } else {
                console.error(
                  'Error calculating distance and duration:',
                  status
                );
              }
            }
          );
        }
      } catch (error) {
        console.error('Error calculating distance and duration:', error);
      }
    }
  });

  async function getCurrentLocation() {
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      // @ts-ignore
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            originAddress = results[0];
          }
        }
      );
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  }

  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
      });
    });
  }

  $: distanceRounded = distance
    ? Math.round(
        parseFloat(distance.replace(',', '.').replace(' km', '')) * 10
      ) / 10
    : 0;

  $: durationRounded = duration
    ? Math.round(
        parseFloat(duration.replace(',', '.').replace(' min', '')) * 10
      ) / 10
    : 0;

  $: console.log(originAddress);
</script>

<div class="control">
  <div class="parameterInput">
    <div>
      <Circle />
      <!-- <label for="originAutocomplete" class="labelText"></label> -->
    </div>
    <input
      type="text"
      id="originAutocomplete"
      autocomplete="off"
      placeholder="Enter origin"
      class="input"
      value={originAddress ? originAddress?.formatted_address : ''}
    />
  </div>
  <div class="parameterInput destination">
    <div>
      <Location />
      <!-- <label for="destinationAutocomplete" class="labelText"></label> -->
    </div>
    <input
      type="text"
      id="destinationAutocomplete"
      placeholder="Enter destination"
      autocomplete="off"
      class="input"
    />
  </div>
  <div class="currentLocation">
    <label for="airportInput" class="smallLabelText"
      >Use current location as origin</label
    >
    <input
      type="checkbox"
      id="airportCheckbox"
      on:click={getCurrentLocation}
      style="text-align: center; font-family:monospace;"
    />
  </div>
  {#if distance && duration}
    <div class="results">
      <p>{distance} - {duration}</p>
      <!-- <span>2.7 km - 8 mins</span> -->
    </div>
  {/if}
</div>

<style>
  .parameterInput {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  .input {
    width: 100%;
  }

  .currentLocation {
    margin-top: 0.3rem;
    display: flex;
    gap: 0.5rem;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .destination {
    margin-top: 0.5rem;
  }

  .results {
    position: relative;
    align-items: center;
    margin: auto;
    font-size: 1.1rem;
    font-family: 'BerlinTypeWeb-Bold';
    letter-spacing: 0.1rem;
    margin-bottom: 0;
    color: #d39e00;
    font-weight: 700;
  }

  .numbers {
    display: flex;
    flex-direction: row;
    gap: 0.2rem;
    align-items: center;
    justify-content: space-between;
  }

  .result {
    margin: 0 0 0.5rem auto;
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

  .arrow {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform: rotate(270deg);
    cursor: pointer;
  }

  .arrow span {
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    border-bottom: 2px solid white;
    border-right: 2px solid white;
    transform: rotate(180deg);
    margin: -10px;
    animation: animate 2s infinite;
  }

  .arrow span:nth-child(2) {
    animation-delay: -0.2s;
  }

  .arrow span:nth-child(3) {
    animation-delay: -0.4s;
  }

  @keyframes animate {
    0% {
      opacity: 0;
      transform: rotate(45deg) translate(-20px, -20px);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: rotate(45deg) translate(20px, 20px);
    }
  }

  @media (min-width: 768px) {
    :global(.smallLabelText) {
      font-size: 0.9rem;
    }
  }
</style>
