<script lang="ts">
  import type { Account } from "../../types/account";
  import Card from "../ui/Card.svelte";
  import ICP from "../ic/ICP.svelte";
  import Identifier from "../ui/Identifier.svelte";
  import type { ICP as ICPType } from "@dfinity/nns";
  import AccountBadge from "./AccountBadge.svelte";

  export let account: Account;
  export let showCopy: boolean = false;
  export let role: "button" | "link" | undefined = undefined;

  let identifier: string;
  let balance: ICPType;

  $: ({ identifier, balance } = account);
</script>

<Card on:click {role} testId="account-card">
  <div slot="start" class="title">
    <h3 data-tid="account-name"><slot /></h3>
    <AccountBadge {account} />
  </div>
  <ICP slot="end" icp={balance} />
  <Identifier {identifier} {showCopy} />
</Card>

<style lang="scss">
  @use "../../themes/mixins/card";

  .title {
    @include card.stacked-title;
    @include card.title;
  }
</style>
