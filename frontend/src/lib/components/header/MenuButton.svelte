<script lang="ts">
  import { i18n } from "../../stores/i18n";
  import IconMenu from "../../icons/IconMenu.svelte";

  export let open: boolean = false;
</script>

<button
  data-tid="menu"
  class="icon-only"
  on:click={() => (open = true)}
  aria-label={$i18n.header.menu}
>
  <IconMenu />
</button>

<style lang="scss">
  @use "../../themes/mixins/effect";
  @use "../../themes/mixins/header";
  @use "../../themes/mixins/media";

  button {
    @include media.min-width(xlarge) {
      display: none;
    }

    @include header.button(--primary-tint);
  }
</style>
