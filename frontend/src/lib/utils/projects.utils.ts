import { SnsSwapLifecycle, type SnsSwapTimeWindow } from "@dfinity/sns";
import type { SnsFullProject } from "../stores/projects.store";
import type { SnsSummarySwap } from "../types/sns";
import { nowInSeconds } from "./date.utils";
import { fromNullable } from "./did.utils";

const filterProjectsStatus = ({
  swapLifecycle,
  projects,
}: {
  swapLifecycle: SnsSwapLifecycle;
  projects: SnsFullProject[] | undefined;
}) =>
  projects?.filter(
    ({
      summary: {
        swap: {
          state: { lifecycle },
        },
      },
    }) => swapLifecycle === lifecycle
  );

export const filterCommittedProjects = (
  projects: SnsFullProject[] | undefined
) =>
  filterProjectsStatus({
    swapLifecycle: SnsSwapLifecycle.Committed,
    projects,
  });

/**
 * Projects displayed in the launchpad are displayed according status if:
 * - status is Pending and time window is defined - i.e. related proposal has been accepted (if not accepted, time window is undefined)
 * - open
 * - complete - we display completed project for a while to make the screen user-friendly
 * @param projects
 */
export const filterActiveProjects = (projects: SnsFullProject[] | undefined) =>
  projects?.filter(
    ({
      summary: {
        swap: {
          state: { lifecycle, open_time_window },
        },
      },
    }) =>
      [SnsSwapLifecycle.Committed, SnsSwapLifecycle.Open].includes(lifecycle) ||
      (SnsSwapLifecycle.Pending === lifecycle && open_time_window.length)
  );

export const openTimeWindow = ({
  state: { open_time_window },
}: SnsSummarySwap): SnsSwapTimeWindow | undefined =>
  fromNullable(open_time_window);

/**
 * Duration in seconds until the end of the swap if defined.
 * @param swap
 */
export const durationTillSwapDeadline = (
  swap: SnsSummarySwap
): bigint | undefined => {
  const timeWindow: SnsSwapTimeWindow | undefined = openTimeWindow(swap);

  // e.g. proposal to start swap has not been accepted yet
  if (timeWindow === undefined) {
    return undefined;
  }

  const { end_timestamp_seconds } = timeWindow;
  return end_timestamp_seconds - BigInt(nowInSeconds());
};

/**
 * If defined the duration of the swap in seconds - i.e. the duration from start till end
 * @param swap
 */
export const swapDuration = (swap: SnsSummarySwap): bigint | undefined => {
  const timeWindow: SnsSwapTimeWindow | undefined = openTimeWindow(swap);

  // e.g. proposal to start swap has not been accepted yet
  if (timeWindow === undefined) {
    return undefined;
  }

  const { start_timestamp_seconds, end_timestamp_seconds } = timeWindow;
  return end_timestamp_seconds - start_timestamp_seconds;
};

/**
 * If defined the duration until the swap start in seconds
 * @param swap
 */
export const durationTillSwapStart = (
  swap: SnsSummarySwap
): bigint | undefined => {
  const timeWindow: SnsSwapTimeWindow | undefined = openTimeWindow(swap);

  // e.g. proposal to start swap has not been accepted yet
  if (timeWindow === undefined) {
    return undefined;
  }

  const { start_timestamp_seconds } = timeWindow;
  return BigInt(nowInSeconds()) - start_timestamp_seconds;
};
