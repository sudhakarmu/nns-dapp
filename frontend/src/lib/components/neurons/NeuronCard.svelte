<script lang="ts">
  import type { NeuronInfo } from "@dfinity/nns";
  import { NeuronState, ICP } from "@dfinity/nns";
  import { i18n } from "../../stores/i18n";
  import { secondsToDuration } from "../../utils/date.utils";
  import {
    getDissolvingTimeInSeconds,
    getSpawningTimeInSeconds,
    getStateInfo,
    hasJoinedCommunityFund,
    isHotKeyControllable,
    isSpawning,
    neuronStake,
  } from "../../utils/neuron.utils";
  import type { StateInfo } from "../../utils/neuron.utils";
  import ICPComponent from "../ic/ICP.svelte";
  import { replacePlaceholders } from "../../utils/i18n.utils";
  import { authStore } from "../../stores/auth.store";
  import type { CardType } from "../../types/card";
  import NeuronCardContainer from "./NeuronCardContainer.svelte";
  import IconStackedLineChart from "../../icons/IconStackedLineChart.svelte";
  import { valueSpan } from "../../utils/utils";
  import Value from "../ui/Value.svelte";

  export let neuron: NeuronInfo;
  export let proposerNeuron: boolean = false;
  // Setting default value avoids warning missing props during testing
  export let role: undefined | "link" | "button" | "checkbox" = undefined;
  export let ariaLabel: string | undefined = undefined;
  export let selected: boolean = false;
  export let disabled: boolean = false;

  // TODO: https://dfinity.atlassian.net/browse/L2-366
  let stateInfo: StateInfo | undefined;
  $: stateInfo = getStateInfo(neuron.state);
  let isCommunityFund: boolean;
  $: isCommunityFund = hasJoinedCommunityFund(neuron);
  let neuronICP: ICP;
  $: neuronICP = ICP.fromE8s(neuronStake(neuron));
  let isHotKeyControl: boolean;
  $: isHotKeyControl = isHotKeyControllable({
    neuron,
    identity: $authStore.identity,
  });
  let dissolvingTime: bigint | undefined;
  $: dissolvingTime = getDissolvingTimeInSeconds(neuron);

  let spawningTime: bigint | undefined;
  $: spawningTime = getSpawningTimeInSeconds(neuron);

  export let cardType: CardType = "card";

  let iconStyle: string;
  $: iconStyle =
    stateInfo?.color !== undefined ? `color: ${stateInfo.color};` : "";
</script>

<NeuronCardContainer
  {role}
  {selected}
  {disabled}
  {ariaLabel}
  on:click
  {cardType}
>
  <div slot="start" class="lock" data-tid="neuron-card-title">
    <h3 data-tid="neuron-id">{neuron.neuronId}</h3>

    {#if isCommunityFund}
      <span class="neuron-control">{$i18n.neurons.community_fund}</span>
    {/if}
    {#if isHotKeyControl}
      <span class="neuron-control">{$i18n.neurons.hotkey_control}</span>
    {/if}
  </div>

  <div slot="end" class="currency">
    {#if isSpawning(neuron)}
      <IconStackedLineChart />
    {:else if proposerNeuron}
      <ICPComponent
        label={$i18n.neurons.voting_power}
        icp={ICP.fromE8s(neuron.votingPower)}
        detailed
      />
    {:else if neuronICP}
      <ICPComponent icp={neuronICP} detailed />
    {/if}
  </div>

  {#if stateInfo !== undefined}
    <div class="info">
      <p style={iconStyle} class="status">
        {$i18n.neurons[`status_${stateInfo.textKey}`]}
        <svelte:component this={stateInfo.Icon} />
      </p>
    </div>
  {/if}

  {#if dissolvingTime !== undefined}
    <p class="duration">
      {@html replacePlaceholders($i18n.neurons.remaining, {
        $duration: valueSpan(secondsToDuration(dissolvingTime)),
      })}
    </p>
  {/if}

  {#if spawningTime !== undefined}
    <p class="duration">
      {@html replacePlaceholders($i18n.neurons.remaining, {
        $duration: valueSpan(secondsToDuration(spawningTime)),
      })}
    </p>
  {/if}

  {#if neuron.state === NeuronState.LOCKED && neuron.dissolveDelaySeconds}
    <p class="duration">
      <Value>{secondsToDuration(neuron.dissolveDelaySeconds)}</Value>
      - {$i18n.neurons.dissolve_delay_title}
    </p>
  {/if}

  <slot />
</NeuronCardContainer>

<style lang="scss">
  @use "../../themes/mixins/display";
  @use "../../themes/mixins/card";

  :global(div.modal article > div) {
    margin-bottom: 0;
  }

  h3 {
    line-height: var(--line-height-standard);
    margin-bottom: 0;
  }

  .lock {
    @include card.stacked-title;
  }

  .status {
    display: inline-flex;
    color: var(--value-color);

    :global {
      svg {
        margin-left: var(--padding-0_5x);
      }
    }
  }

  .currency {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .info {
    @include display.space-between;
    align-items: center;

    p {
      margin: 0;
    }
  }

  .duration {
    margin: 0;
  }
</style>
