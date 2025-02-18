<script lang="ts">
  import type { ProposalInfo, NeuronId } from "@dfinity/nns";
  import { Vote } from "@dfinity/nns";
  import CardInfo from "../ui/CardInfo.svelte";
  import { i18n } from "../../stores/i18n";
  import { E8S_PER_ICP } from "../../constants/icp.constants";
  import { formatNumber } from "../../utils/format.utils";
  import IconThumbDown from "../../icons/IconThumbDown.svelte";
  import IconThumbUp from "../../icons/IconThumbUp.svelte";
  import { definedNeuronsStore } from "../../stores/neurons.store";
  import { replacePlaceholders } from "../../utils/i18n.utils";
  import {
    formatVotingPower,
    votedNeuronDetails,
    type CompactNeuronInfo,
  } from "../../utils/neuron.utils";
  import Value from "../ui/Value.svelte";

  export let proposalInfo: ProposalInfo;

  let yes: number;
  let no: number;
  let sum: number;

  $: yes = Number(proposalInfo?.latestTally?.yes ?? 0) / E8S_PER_ICP;
  $: no = Number(proposalInfo?.latestTally?.no ?? 0) / E8S_PER_ICP;
  $: sum = yes + no;

  const voteIconMapper = {
    [Vote.NO]: IconThumbDown,
    [Vote.YES]: IconThumbUp,
    [Vote.UNSPECIFIED]: undefined,
  };

  const voteMapper = ({ neuron, vote }: { neuron: NeuronId; vote: Vote }) => {
    const stringMapper = {
      [Vote.NO]: $i18n.core.no,
      [Vote.YES]: $i18n.core.yes,
      [Vote.UNSPECIFIED]: "",
    };

    return replacePlaceholders($i18n.proposal_detail__vote.vote_status, {
      $neuronId: neuron.toString(),
      $vote: stringMapper[vote],
    });
  };

  let neuronsVotedForProposal: CompactNeuronInfo[];
  $: {
    neuronsVotedForProposal = votedNeuronDetails({
      neurons: $definedNeuronsStore,
      proposal: proposalInfo,
    });
  }
</script>

<CardInfo>
  <h3 slot="start" class="title">Voting Results</h3>
  <div class="latest-tally">
    <h4 class="label yes">
      {$i18n.proposal_detail.adopt}<span>{formatNumber(yes)}</span>
    </h4>
    <div
      class="progressbar"
      role="progressbar"
      aria-label={$i18n.proposal_detail__vote.vote_progress}
      aria-valuenow={yes}
      aria-valuemin={0}
      aria-valuemax={sum}
    >
      <div class="progressbar-value" style="width: {(yes / sum) * 100}%" />
    </div>
    <h4 class="label no">
      {$i18n.proposal_detail.reject}<span>{formatNumber(no)}</span>
    </h4>
  </div>

  {#if neuronsVotedForProposal.length}
    <h4 class="my-votes">{$i18n.proposal_detail.my_votes}</h4>
    <ul>
      {#each neuronsVotedForProposal as neuron}
        <li
          data-tid="neuron-data"
          aria-label={voteMapper({ neuron: neuron.id, vote: neuron.vote })}
          title={voteMapper({ neuron: neuron.id, vote: neuron.vote })}
        >
          <p class="value">{neuron.id}</p>
          <p class="vote-details">
            <Value>{formatVotingPower(neuron.votingPower)}</Value>
            {#if voteIconMapper[neuron.vote]}
              <svelte:component this={voteIconMapper[neuron.vote]} />
            {/if}
          </p>
        </li>
      {/each}
    </ul>
  {/if}
</CardInfo>

<style lang="scss">
  @use "../../themes/mixins/media";

  .latest-tally {
    display: grid;

    grid-template-columns: 110px 1fr 110px;
    align-items: center;
    height: var(--header-height);

    @include media.min-width(medium) {
      grid-template-columns: 130px 1fr 130px;
    }

    h4 {
      line-height: var(--line-height-standard);
      text-align: center;

      &.yes {
        color: var(--primary-shade);
      }

      &.no {
        color: var(--negative-emphasis-light);
      }

      span {
        display: block;
        text-align: center;
        font-size: var(--font-size-small);
        font-weight: initial;

        @include media.min-width(medium) {
          font-size: var(--font-size-h5);
        }
      }
    }

    .progressbar {
      position: relative;
      height: 10px;
      background: var(--negative-emphasis-light);

      border-radius: var(--border-radius);
      overflow: hidden;

      .progressbar-value {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;

        background: var(--primary-gradient-fallback);
        background: var(--primary-gradient);
      }
    }
  }

  .my-votes {
    padding-top: var(--padding-3x);
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;

    .vote-details {
      display: flex;
      align-items: center;
      gap: var(--padding);
    }
  }

  .title {
    padding-bottom: var(--padding);
  }
</style>
