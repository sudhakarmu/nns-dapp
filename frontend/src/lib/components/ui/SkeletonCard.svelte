<!-- adapted source: https://github.com/ionic-team/ionic-framework/tree/main/core/src/components/skeleton-text -->
<script lang="ts">
  import Card from "./Card.svelte";
  import CardInfo from "./CardInfo.svelte";
  import SkeletonParagraph from "./SkeletonParagraph.svelte";
  import type { SvelteComponent } from "svelte";
  import type { CardType } from "../../types/card";

  export let size: "medium" | "large" = "medium";
  export let cardType: CardType = "card";

  const cards: Record<CardType, typeof SvelteComponent> = {
    card: Card,
    info: CardInfo,
  };
</script>

<svelte:component this={cards[cardType]} testId="skeleton-card">
  <div class="small" slot="start">
    <SkeletonParagraph />
  </div>
  <div class="small" slot="end">
    <SkeletonParagraph />
  </div>
  <div class="content">
    <SkeletonParagraph />
    <SkeletonParagraph />
    {#if size === "large"}
      <SkeletonParagraph />
      <SkeletonParagraph />
      <SkeletonParagraph />
      <SkeletonParagraph />
    {/if}
  </div>
</svelte:component>

<style lang="scss">
  .small {
    width: 20%;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--padding_2x);
  }
</style>
