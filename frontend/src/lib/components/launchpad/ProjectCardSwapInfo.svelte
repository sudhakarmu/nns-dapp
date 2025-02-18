<script lang="ts">
  import type { SnsFullProject } from "../../stores/projects.store";
  import type {
    SnsSummary,
    SnsSwapCommitment,
    SnsSummarySwap,
  } from "../../types/sns";
  import {
    durationTillSwapDeadline,
    openTimeWindow,
  } from "../../utils/projects.utils";
  import { ICP } from "@dfinity/nns";
  import { i18n } from "../../stores/i18n";
  import { secondsToDuration } from "../../utils/date.utils";
  import Icp from "../ic/ICP.svelte";
  import DateSeconds from "../ui/DateSeconds.svelte";
  import {
    SnsSwapLifecycle,
    type SnsSwapState,
    type SnsSwapTimeWindow,
  } from "@dfinity/sns";

  export let project: SnsFullProject;

  let summary: SnsSummary;
  let swapCommitment: SnsSwapCommitment | undefined;
  $: ({ summary, swapCommitment } = project);

  let swap: SnsSummarySwap;
  $: ({ swap } = summary);

  let state: SnsSwapState;
  $: ({ state } = swap);

  let lifecycle: number;
  $: lifecycle = state.lifecycle;

  let durationTillDeadline: bigint | undefined;
  $: durationTillDeadline = durationTillSwapDeadline(swap);

  let timeWindow: SnsSwapTimeWindow | undefined;
  $: timeWindow = openTimeWindow(swap);

  let start_timestamp_seconds: bigint | undefined;
  $: ({ start_timestamp_seconds } = timeWindow ?? {
    start_timestamp_seconds: undefined,
    end_timestamp_seconds: undefined,
  });

  export let myCommitment: ICP | undefined = undefined;
  $: myCommitment =
    swapCommitment?.myCommitment === undefined
      ? undefined
      : ICP.fromE8s(swapCommitment.myCommitment.amount_icp_e8s);
</script>

<dl>
  <!-- Sale is committed -->
  {#if lifecycle === SnsSwapLifecycle.Committed}
    <dt>{$i18n.sns_project_detail.status_completed}</dt>
    <dd>{$i18n.sns_project_detail.completed}</dd>
  {/if}

  <!-- Sale is open -->
  {#if lifecycle === SnsSwapLifecycle.Open && durationTillDeadline !== undefined}
    <dt>{$i18n.sns_project_detail.deadline}</dt>
    <dd>{secondsToDuration(durationTillDeadline)}</dd>
  {/if}

  <!-- Sale starts soon -->
  {#if lifecycle === SnsSwapLifecycle.Pending && start_timestamp_seconds !== undefined}
    <dt>{$i18n.sns_project_detail.sale_start}</dt>
    <DateSeconds tagName="dd" seconds={Number(start_timestamp_seconds)} />
  {/if}

  {#if myCommitment !== undefined}
    <dt>{$i18n.sns_project_detail.user_commitment}</dt>
    <dd><Icp icp={myCommitment} singleLine inheritSize /></dd>
  {/if}
</dl>

<style lang="scss">
  dl {
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--padding-1_5x);

    dt {
    }

    dd {
      text-align: right;
      color: var(--value-color);
    }
  }
</style>
