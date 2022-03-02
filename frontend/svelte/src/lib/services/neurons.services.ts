// API calls with a scope wider than one canister:
// - calls that require multiple canisters.
// - calls that require additional systems such as hardware wallets.

import { GovernanceCanister, ICP, LedgerCanister } from "@dfinity/nns";
import { get } from "svelte/store";
import {
  GOVERNANCE_CANISTER_ID,
  LEDGER_CANISTER_ID,
} from "../constants/canister-ids.constants";
import { E8S_PER_ICP } from "../constants/icp.constants";
import { AuthStore, authStore } from "../stores/auth.store";
import { neuronsStore } from "../stores/neurons.store";
import { createAgent } from "../utils/agent.utils";

/**
 * Uses governance and ledger canisters to create a neuron and adds it to the store
 *
 * TODO: L2-322 Create neurons from subaccount
 */
export const stakeNeuron = async ({ stake }: { stake: ICP }): Promise<void> => {
  if (stake.toE8s() < E8S_PER_ICP) {
    throw new Error("Need a minimum of 1 ICP to stake a neuron");
  }
  const { identity }: AuthStore = get(authStore);
  const agent = await createAgent({ identity, host: process.env.HOST });
  const governanceCanister: GovernanceCanister = GovernanceCanister.create({
    agent,
    canisterId: GOVERNANCE_CANISTER_ID,
  });
  const ledgerCanister: LedgerCanister = LedgerCanister.create({
    agent,
    canisterId: LEDGER_CANISTER_ID,
  });

  // TODO: L2-332 Get neuron information and add to store
  await governanceCanister.stakeNeuron({
    stake,
    principal: identity.getPrincipal(),
    ledgerCanister,
  });

  // TODO: Remove after L2-332
  await listNeurons();
};

// Gets neurons and adds them to the store
export const listNeurons = async (): Promise<void> => {
  const { identity }: AuthStore = get(authStore);
  const agent = await createAgent({ identity, host: process.env.HOST });
  const governanceCanister: GovernanceCanister = GovernanceCanister.create({
    agent,
    canisterId: GOVERNANCE_CANISTER_ID,
  });
  const neurons = await governanceCanister.getNeurons({
    certified: true,
    principal: identity.getPrincipal(),
  });
  neuronsStore.setNeurons(neurons);
};
