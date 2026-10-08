<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { onDestroy } from 'svelte';

  export let open = false;
  /** @type {'left' | 'right'} */
  export let side: 'left' | 'right' = 'right';
  export let title = '';

  let locked = false;

  function lockScroll() {
    if (typeof document === 'undefined' || locked) return;
    document.body.style.overflow = 'hidden';
    locked = true;
  }

  function unlockScroll() {
    if (typeof document === 'undefined' || !locked) return;
    document.body.style.overflow = '';
    locked = false;
  }

  function close() {
    open = false;
    // Clear focus so opener buttons do not keep :focus-visible after Esc/backdrop
    if (typeof document !== 'undefined') {
      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();
    }
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      close();
    }
  }

  $: if (open) {
    lockScroll();
  } else {
    unlockScroll();
  }

  onDestroy(unlockScroll);

  $: flyX = side === 'left' ? -320 : 320;
</script>

<svelte:window on:keydown={onKeydown} />

{#if open}
  <button
    type="button"
    class="backdrop"
    aria-label="Close panel"
    transition:fade={{ duration: 200 }}
    on:click={close}
  ></button>

  <div
    class="panel"
    class:left={side === 'left'}
    class:right={side === 'right'}
    role="dialog"
    aria-modal="true"
    aria-labelledby="side-panel-title"
    transition:fly={{ x: flyX, duration: 280 }}
  >
    <header class="header">
      <h2 id="side-panel-title">{title}</h2>
      <button type="button" class="close" aria-label="Close" on:click={close}>
        ×
      </button>
    </header>
    <div class="body">
      <slot />
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    margin: 0;
    padding: 0;
    border: none;
    background: rgba(0, 0, 0, 0.55);
    z-index: 900;
    cursor: pointer;
  }

  .panel {
    position: fixed;
    top: 0;
    bottom: 0;
    width: min(100vw, 28rem);
    max-width: 100vw;
    background: #242424;
    border-color: #383838;
    z-index: 901;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.45);
    font-family: monospace;
    color: #fff;
  }

  .panel.left {
    left: 0;
    border-right: 1px solid #383838;
  }

  .panel.right {
    right: 0;
    border-left: 1px solid #383838;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 1rem 1rem 0.75rem;
    border-bottom: 1px solid #383838;
    flex-shrink: 0;
  }

  .header h2 {
    margin: 0;
    font-family: 'BerlinTypeWeb-Bold', monospace;
    font-size: 1.1rem;
    color: #d39e00;
  }

  .close {
    appearance: none;
    border: 1px solid #383838;
    background: #242424;
    color: #fff;
    width: 2rem;
    height: 2rem;
    font-size: 1.4rem;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .close:hover,
  .close:focus-visible {
    outline: 2px solid #d39e00;
    border-color: #d39e00;
  }

  .body {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    text-align: left;
  }
</style>
