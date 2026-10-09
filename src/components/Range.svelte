<script lang="ts">
  // @ts-nocheck

  import { createEventDispatcher, onDestroy } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  // Props
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let initialValue = 0;
  export let id = null;
  export let value =
    typeof initialValue === 'string' ? parseInt(initialValue) : initialValue;

  // Node Bindings
  let container = null;
  let thumb = null;
  let progressBar = null;
  let element = null;

  // Internal State
  let elementX = null;
  let currentThumb = null;
  let holding = false;
  let thumbHover = false;
  let keydownAcceleration = 0;
  let accelerationTimer = null;
  let resizeObserver: ResizeObserver | null = null;

  // Dispatch 'change' events
  const dispatch = createEventDispatcher();

  /** Per-slider shield so two ranges on one page do not share one overlay. */
  let mouseEventShield: HTMLDivElement | null = null;

  function getMouseEventShield(): HTMLDivElement {
    if (!mouseEventShield) {
      mouseEventShield = document.createElement('div');
      mouseEventShield.setAttribute('class', 'mouse-over-shield');
      mouseEventShield.addEventListener('mouseover', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    }
    return mouseEventShield;
  }

  /**
   * Remeasure layout. Required because panels can mount while `display: none`
   * (elementX/width are 0) and only become visible later without remounting.
   */
  function refreshElementMetrics() {
    if (!element) return;
    elementX = element.getBoundingClientRect().left;
    updateThumbPosition();
  }

  function clampToStep(raw) {
    const stepped =
      step > 0 ? Math.round((raw - min) / step) * step + min : raw;
    const clamped = Math.min(max, Math.max(min, stepped));
    // Avoid float noise for fractional steps (e.g. 0.1)
    const decimals = String(step).includes('.')
      ? String(step).split('.')[1].length
      : 0;
    return decimals > 0
      ? Number(clamped.toFixed(decimals))
      : Math.round(clamped);
  }

  function updateThumbPosition() {
    if (!progressBar || !thumb || !container) return;
    const trackWidth = container.clientWidth;
    if (trackWidth <= 0) return;

    const clamped = Math.min(max, Math.max(min, value));
    const percent = ((clamped - min) * 100) / (max - min);
    const offsetLeft = (trackWidth - 10) * (percent / 100) + 5;

    thumb.style.left = `${offsetLeft}px`;
    progressBar.style.width = `${offsetLeft}px`;
  }

  function resizeWindow() {
    refreshElementMetrics();
  }

  // Allows both bind:value and on:change for parent value retrieval
  function setValue(val) {
    value = val;
    dispatch('change', { value });
  }

  function onTrackEvent(e) {
    refreshElementMetrics();
    // Update value immediately before beginning drag
    updateValueOnEvent(e);
    onDragStart(e);
  }

  function onHover(e) {
    thumbHover = thumbHover ? false : true;
  }

  function onDragStart(e) {
    refreshElementMetrics();
    // If mouse event add a pointer events shield
    if (e.type === 'mousedown') document.body.append(getMouseEventShield());
    currentThumb = thumb;
  }

  function onDragEnd(e) {
    // If using mouse - remove pointer event shield
    if (e.type === 'mouseup') {
      const shield = mouseEventShield;
      if (shield && document.body.contains(shield))
        document.body.removeChild(shield);
      // Needed to check whether thumb and mouse overlap after shield removed
      if (isMouseInElement(e, thumb)) thumbHover = true;
    }
    currentThumb = null;
  }

  // Check if mouse event cords overlay with an element's area
  function isMouseInElement(event, element) {
    let rect = element.getBoundingClientRect();
    let { clientX: x, clientY: y } = event;
    if (x < rect.left || x >= rect.right) return false;
    if (y < rect.top || y >= rect.bottom) return false;
    return true;
  }

  // Accessible keypress handling
  function onKeyPress(e) {
    // Max out at +/- 10 to value per event (50 events / 5)
    // 100 below is to increase the amount of events required to reach max velocity
    if (keydownAcceleration < 50) keydownAcceleration++;
    let throttled = Math.ceil(keydownAcceleration / 5) * step;

    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      if (value + throttled > max || value >= max) {
        setValue(max);
      } else {
        setValue(clampToStep(value + throttled));
      }
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      if (value - throttled < min || value <= min) {
        setValue(min);
      } else {
        setValue(clampToStep(value - throttled));
      }
    }

    // Reset acceleration after 100ms of no events
    clearTimeout(accelerationTimer);
    accelerationTimer = setTimeout(() => (keydownAcceleration = 1), 100);
  }

  function calculateNewValue(clientX) {
    refreshElementMetrics();
    if (!container || container.clientWidth <= 0) return;

    // Find distance between cursor and element's left cord (20px / 2 = 10px) - Center of thumb
    let delta = clientX - (elementX + 10);

    // Use width of the container minus (5px * 2 sides) offset for percent calc
    let percent = (delta * 100) / (container.clientWidth - 10);

    // Limit percent 0 -> 100
    percent = percent < 0 ? 0 : percent > 100 ? 100 : percent;

    const raw = (percent * (max - min)) / 100 + min;
    setValue(clampToStep(raw));
  }

  // Handles both dragging of touch/mouse as well as simple one-off click/touches
  function updateValueOnEvent(e) {
    // touchstart && mousedown are one-off updates, otherwise expect a currentPointer node
    if (!currentThumb && e.type !== 'touchstart' && e.type !== 'mousedown')
      return false;

    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();

    // Get client's x cord either touch or mouse
    const clientX =
      e.type === 'touchmove' || e.type === 'touchstart'
        ? e.touches[0].clientX
        : e.clientX;

    calculateNewValue(clientX);
  }

  // React to left position of element relative to window
  $: if (element) refreshElementMetrics();

  // When a parent panel toggles from display:none → visible, width goes 0 → N
  $: if (container && typeof ResizeObserver !== 'undefined') {
    resizeObserver?.disconnect();
    resizeObserver = new ResizeObserver(() => refreshElementMetrics());
    resizeObserver.observe(container);
  }

  onDestroy(() => {
    resizeObserver?.disconnect();
    clearTimeout(accelerationTimer);
  });

  // Set a class based on if dragging
  $: holding = Boolean(currentThumb);

  // Update progressbar and thumb styles to represent value
  $: if (progressBar && thumb && container) {
    value;
    min;
    max;
    updateThumbPosition();
  }
</script>

<svelte:window
  on:touchmove|nonpassive={updateValueOnEvent}
  on:touchcancel={onDragEnd}
  on:touchend={onDragEnd}
  on:mousemove={updateValueOnEvent}
  on:mouseup={onDragEnd}
  on:resize={resizeWindow}
/>
<div class="range">
  <div
    class="range__wrapper"
    tabindex="0"
    on:keydown={onKeyPress}
    bind:this={element}
    role="slider"
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    {id}
    on:mousedown={onTrackEvent}
    on:touchstart={onTrackEvent}
  >
    <div class="range__track" bind:this={container}>
      <div class="range__track--highlighted" bind:this={progressBar}></div>
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-mouse-events-have-key-events -->
      <div
        class="range__thumb"
        class:range__thumb--holding={holding}
        bind:this={thumb}
        on:touchstart={onDragStart}
        on:mousedown={onDragStart}
        on:mouseover={() => (thumbHover = true)}
        on:mouseout={() => (thumbHover = false)}
      >
        {#if holding || thumbHover}
          <div
            class="range__tooltip"
            in:fly={{ y: 7, duration: 200 }}
            out:fade={{ duration: 100 }}
          >
            {value}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<svelte:head>
  <style>
    .mouse-over-shield {
      position: fixed;
      top: 0px;
      left: 0px;
      height: 100%;
      width: 100%;
      background-color: rgba(255, 0, 0, 0);
      z-index: 10000;
      cursor: grabbing;
    }
  </style>
</svelte:head>

<style>
  .range {
    position: relative;
    flex: 1;
  }

  .range__wrapper {
    min-width: 100%;
    position: relative;
    padding: 0.5rem;
    box-sizing: border-box;
    outline: none;
  }

  .range__wrapper:focus-visible > .range__track {
    box-shadow:
      0 0 0 2px white,
      0 0 0 3px var(--track-focus, #d39e00);
  }

  .range__track {
    height: 6px;
    background-color: var(--track-bgcolor, #474747);
    border-radius: 999px;
  }

  .range__track--highlighted {
    background-color: var(--track-highlight-bgcolor, #d39e00);
    background: var(
      --track-highlight-bg,
      linear-gradient(90deg, #d39e00, #bb2e23)
    );
    width: 0;
    height: 6px;
    position: absolute;
    border-radius: 999px;
  }

  .range__thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: var(--thumb-bgcolor, white);
    cursor: pointer;
    border-radius: 999px;
    margin-top: -8px;
    transition: box-shadow 100ms;
    user-select: none;
    box-shadow: var(
      --thumb-boxshadow,
      0 1px 1px 0 rgba(0, 0, 0, 0.14),
      0 0px 2px 1px rgba(0, 0, 0, 0.2)
    );
  }

  .range__thumb--holding {
    box-shadow:
      0 1px 1px 0 rgba(0, 0, 0, 0.14),
      0 1px 2px 1px rgba(0, 0, 0, 0.2),
      0 0 0 6px var(--thumb-holding-outline, rgba(113, 119, 250, 0.3));
  }

  .range__tooltip {
    pointer-events: none;
    position: absolute;
    font-family: monospace;
    top: -33px;
    color: var(--tooltip-text, white);
    width: 38px;
    padding: 4px 0;
    border-radius: 4px;
    text-align: center;
    background-color: var(--tooltip-bgcolor, #d39e00);
    background: var(--tooltip-bg, linear-gradient(45deg, #d39e00, #bb2e23));
  }

  .range__tooltip::after {
    content: '';
    display: block;
    position: absolute;
    height: 7px;
    width: 7px;
    background-color: var(--tooltip-bgcolor, #d39e00);
    bottom: -3px;
    left: calc(50% - 3px);
    clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
    transform: rotate(-45deg);
    border-radius: 0 0 0 3px;
  }
</style>
