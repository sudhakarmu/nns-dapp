<div class="toolbar" role="toolbar">
  <slot name="start" />

  <div class="main">
    <slot />
  </div>

  <slot name="end" />
</div>

<style lang="scss">
  @use "../../themes/mixins/display";

  .toolbar {
    position: absolute;
    @include display.inset;

    display: grid;
    grid-template-columns: 25% 50% 25%;

    justify-content: center;
    align-items: center;

    // enable scrolling
    pointer-events: var(--toolbar-pointer-events, none);

    --tooltip-width: fit-content;

    // buttons
    :global(button),
    :global(.tooltip-wrapper) {
      pointer-events: all;
    }
  }

  .main {
    grid-column: 2 / 3;

    display: flex;
    justify-content: center;
    align-items: stretch;

    justify-self: center;

    gap: var(--padding);
  }
</style>
