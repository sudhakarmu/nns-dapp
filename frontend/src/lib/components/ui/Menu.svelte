<script lang="ts">
  import Backdrop from "./Backdrop.svelte";
  import { cubicOut } from "svelte/easing";

  // Type is not exposed by Svelte
  type SvelteTransitionConfig = {
    delay?: number;
    duration?: number;
    easing?: (t: number) => number;
    css?: (t: number, u: number) => string;
    tick?: (t: number, u: number) => void;
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const animateMenu = (
    _node: Element,
    _options: { delay?: number; duration?: number }
  ): SvelteTransitionConfig => ({
    easing: cubicOut,
    css: (t: number) => `transform: translate(${-100 * (1 - t)}%);`,
  });
  /* eslint-enable */

  export let open = false;
  export let sticky = false;

  let backdrop = true;
  $: backdrop = !sticky;

  let transition: (
    _node: Element,
    _options: { delay?: number; duration?: number }
  ) => SvelteTransitionConfig;
  $: transition = sticky ? () => ({ duration: 0 }) : animateMenu;
</script>

{#if open || sticky}
  <div role="menu" class:sticky class:open>
    {#if backdrop}
      <Backdrop on:nnsClose={() => (open = false)} />
    {/if}

    <div class="inner" transition:transition>
      <slot />
    </div>
  </div>
{/if}

<style lang="scss">
  @use "../../themes/mixins/interaction";
  @use "../../themes/mixins/display";

  div[role="menu"] {
    position: fixed;
    @include display.inset;

    @include interaction.initial;

    z-index: var(--menu-z-index);

    &.sticky {
      position: relative;
      width: var(--menu-width);
      min-width: var(--menu-width);
    }

    &.open:not(.sticky) {
      z-index: var(--overlay-z-index);
    }
  }

  .inner {
    position: absolute;
    top: 0;
    right: auto;
    bottom: 0;
    left: 0;

    display: flex;
    flex-direction: column;

    background: var(--menu-background);
    color: var(--menu-background-contrast);
    box-shadow: var(--menu-box-shadow);

    width: var(--menu-width);
    max-width: 100vw;

    padding: var(--padding-4x) 0 0;

    overflow-y: auto;
  }
</style>
