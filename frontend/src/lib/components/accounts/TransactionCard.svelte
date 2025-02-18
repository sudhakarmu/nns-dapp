<script lang="ts">
  import type { Account } from "../../types/account";
  import CardInfo from "../ui/CardInfo.svelte";
  import DateSeconds from "../ui/DateSeconds.svelte";
  import ICP from "../ic/ICP.svelte";
  import Identifier from "../ui/Identifier.svelte";
  import type { ICP as ICPType } from "@dfinity/nns";
  import type {
    AccountIdentifierString,
    Transaction,
  } from "../../canisters/nns-dapp/nns-dapp.types";
  import { i18n } from "../../stores/i18n";
  import {
    AccountTransactionType,
    mapTransaction,
    transactionName,
  } from "../../utils/transactions.utils";
  import { toastsStore } from "../../stores/toasts.store";

  export let account: Account;
  export let transaction: Transaction;
  export let toSelfTransaction: boolean = false;

  let type: AccountTransactionType;
  let isReceive: boolean;
  let isSend: boolean;
  let from: AccountIdentifierString | undefined;
  let to: AccountIdentifierString | undefined;
  let displayAmount: ICPType;
  let date: Date;

  $: account,
    transaction,
    (() => {
      try {
        ({ type, isReceive, isSend, from, to, displayAmount, date } =
          mapTransaction({
            transaction,
            toSelfTransaction,
            account,
          }));
      } catch (err: unknown) {
        toastsStore.error(
          err instanceof Error
            ? { labelKey: err.message }
            : { labelKey: "error.unknown", err }
        );
      }
    })();

  let headline: string;
  $: headline = transactionName({
    type,
    isReceive: isReceive || toSelfTransaction,
    labels: $i18n.transaction_names,
  });

  let label: string | undefined;
  $: label =
    isReceive || toSelfTransaction
      ? $i18n.wallet.direction_from
      : isSend
      ? $i18n.wallet.direction_to
      : undefined;
  let identifier: string | undefined;
  $: identifier = isReceive ? from : to;
  let seconds: number;
  $: seconds = date.getTime() / 1000;
</script>

<hr />

<CardInfo testId="transaction-card">
  <div slot="start" class="title">
    <h3>{headline}</h3>
  </div>

  <ICP
    slot="end"
    icp={displayAmount}
    sign={isReceive || toSelfTransaction ? "+" : "-"}
    detailed
  />

  <DateSeconds {seconds} />

  {#if identifier !== undefined}
    <Identifier size="medium" {label} {identifier} />
  {/if}
</CardInfo>

<style lang="scss">
  @use "../../themes/mixins/card";

  .title {
    @include card.stacked-title;
    @include card.title;
  }
</style>
