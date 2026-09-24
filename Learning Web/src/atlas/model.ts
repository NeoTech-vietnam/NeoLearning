import type { ContentNode, Quest } from "../shared";

const COUNTRY_ROOTS = [
  "01_Hardware",
  "02_Software",
  "03_Interfaces-and-Protocols",
  "04_Soft-Skills",
  "05_Advanced-Topics",
  "06_Product_Concepts"
] as const;

export function canonicalCountries(root: ContentNode): ContentNode[] {
  return COUNTRY_ROOTS.map((relativePath) =>
    root.children.find((node) => node.relativePath === relativePath)
  ).filter((node): node is ContentNode => Boolean(node));
}

export function findNodeTrail(root: ContentNode, relativePath?: string): ContentNode[] {
  if (!relativePath) return [root];
  const visit = (node: ContentNode, trail: ContentNode[]): ContentNode[] | undefined => {
    const nextTrail = [...trail, node];
    if (node.relativePath === relativePath) return nextTrail;
    for (const child of node.children) {
      const found = visit(child, nextTrail);
      if (found) return found;
    }
    return undefined;
  };
  return visit(root, []) ?? [root];
}

export function descendantCount(node: ContentNode): number {
  return node.children.reduce((count, child) => count + 1 + descendantCount(child), 0);
}

export interface QuestRouteStop {
  key: string;
  milestoneId: string;
  milestoneTitle: string;
  relativePath: string;
  node?: ContentNode;
  trail: ContentNode[];
  countryPath?: string;
}

export function questRouteStops(root: ContentNode, quest: Quest): QuestRouteStop[] {
  return quest.milestones.flatMap((milestone) => milestone.knowledgeLinks.map((relativePath, index) => ({
    key: `${milestone.id}:${index}:${relativePath}`,
    milestoneId: milestone.id,
    milestoneTitle: milestone.title,
    relativePath,
    trail: findNodeTrail(root, relativePath)
  }))).map((stop) => {
    const node = stop.trail.at(-1);
    return {
      ...stop,
      node: node === root ? undefined : node,
      countryPath: stop.trail.find((entry) => entry.kind === "country")?.relativePath
    };
  });
}

export { countryOutlineFromMask, territoryLayout, territoryLayoutAtFocus, territoryLayoutInCountry } from "./territory-layout";
export type { TerritoryPosition } from "./territory-layout";

export interface ProjectedQuestStop {
  stop: QuestRouteStop;
  territoryPath?: string;
}

export function questStopsAtFocus(focus: ContentNode, stops: QuestRouteStop[]): ProjectedQuestStop[] {
  return stops.flatMap((stop) => {
    if (!stop.node) return [];
    const focusIndex = stop.trail.findIndex((entry) => entry.id === focus.id);
    if (focusIndex < 0) return [];
    const territory = stop.trail[focusIndex + 1] ?? focus;
    return [{ stop, territoryPath: territory.relativePath }];
  });
}
