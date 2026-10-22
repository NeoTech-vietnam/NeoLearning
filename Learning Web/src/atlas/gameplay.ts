import type { Quest, QuestProgress } from "../shared";
import type { AtlasLearningState } from "../shared/learning";
import type { QuestRouteStop } from "./model";

export type TerritoryState = "unvisited" | "visited" | "practiced" | "evidenced";

const rank: Record<TerritoryState, number> = { unvisited: 0, visited: 1, practiced: 2, evidenced: 3 };

/** A parent summarizes its descendants; it does not imply every child is complete. */
export function territoryState(path: string | undefined, learning: AtlasLearningState, quests: Quest[], progress: Record<string, QuestProgress | undefined>): TerritoryState {
  if (!path) return "unvisited";
  const includes = (child: string) => child === path || child.startsWith(`${path}/`);
  let state: TerritoryState = "unvisited";
  const raise = (candidate: TerritoryState) => { if (rank[candidate] > rank[state]) state = candidate; };
  if (Object.keys(learning.visits).some(includes)) raise("visited");
  if (Object.keys(learning.practiced).some(includes)) raise("practiced");
  for (const quest of quests) for (const milestone of quest.milestones) {
    const recorded = progress[quest.id]?.milestones[milestone.id];
    if (recorded?.status === "complete" && recorded.evidence?.trim() && milestone.knowledgeLinks.some(includes)) raise("evidenced");
  }
  return state;
}

/** Follow the active milestone in order; after its final stop, return to the gate. */
export function nextRouteStop(stops: QuestRouteStop[], quest: Quest, progress: QuestProgress | undefined, selectedPath?: string): QuestRouteStop | undefined {
  const milestone = quest.milestones.find((item) => progress?.milestones[item.id]?.status !== "complete");
  if (!milestone) return undefined;
  const legs = stops.filter((stop) => stop.milestoneId === milestone.id && stop.node);
  const current = legs.map((stop) => stop.relativePath).lastIndexOf(selectedPath ?? "");
  return current < 0 ? legs[0] : legs[current + 1];
}

export function activeMilestone(quest: Quest, progress: QuestProgress | undefined) {
  return quest.milestones.find((item) => progress?.milestones[item.id]?.status !== "complete");
}
