<script lang="ts">
  import type { NeuronInfo } from "@dfinity/nns";
  import { makeDummyProposals } from "../../services/neurons.services";
  import CardInfo from "../ui/CardInfo.svelte";
  import Spinner from "../ui/Spinner.svelte";

  export let neuron: NeuronInfo;

  let loading: boolean = false;

  const makeProposals = async () => {
    loading = true;
    await makeDummyProposals(neuron.neuronId);
    loading = false;
  };
</script>

<!-- ONLY FOR TESTNET. NO UNIT TESTS -->
<CardInfo>
  <h3 slot="start">Proposals</h3>

  <div>
    <button
      on:click={makeProposals}
      class={`primary small ${loading ? "icon-only" : ""}`}
      disabled={loading}
    >
      {#if loading}
        <Spinner inline size="small" />
      {:else}
        Make Dummy Proposals
      {/if}
    </button>
  </div>
</CardInfo>

<style lang="scss">
  div {
    display: flex;
    justify-content: flex-start;
  }
</style>
