import type { AtlasLearningState } from "../shared/learning";
import type { ContentNode, Quest, QuestProgress } from "../shared";
import { canonicalCountries } from "./model";

export type ReviewState = "unvisited" | "visited" | "completed";

export interface ReviewCell {
  node: ContentNode;
  countryPath: string;
  state: ReviewState;
}

export interface ReviewRegion {
  node: ContentNode;
  countryPath: string;
  depth: 1 | 2 | 3;
  counts: ReviewCounts;
  state: ReviewState;
}

export interface ReviewParent {
  node: ContentNode;
  countryPath: string;
  milestones: string[];
}

export interface ReviewCounts {
  total: number;
  visited: number;
  completed: number;
}

export interface WorldReview {
  cells: ReviewCell[];
  parents: ReviewParent[];
  regions: ReviewRegion[];
  world: ReviewCounts;
  countries: Record<string, ReviewCounts>;
}

function emptyCounts(): ReviewCounts {
  return { total: 0, visited: 0, completed: 0 };
}

export function buildWorldReview(
  root: ContentNode,
  learning: AtlasLearningState,
  quests: Quest[],
  progress: Record<string, QuestProgress | undefined>
): WorldReview {
  const countries = canonicalCountries(root);
  const nodes = new Map<string, ContentNode>();
  const countryOf = new Map<string, string>();
  const terminals = new Map<string, ContentNode>();
  const countryCounts: Record<string, ReviewCounts> = {};
  const visit = (node: ContentNode, countryPath: string) => {
    if (!node.relativePath) return;
    nodes.set(node.relativePath, node);
    countryOf.set(node.relativePath, countryPath);
    const folders = node.children.filter((child) => child.kind !== "lesson");
    if (folders.length === 0 && node.kind !== "lesson") terminals.set(node.relativePath, node);
    for (const child of node.children) visit(child, countryPath);
  };
  for (const country of countries) {
    if (!country.relativePath) continue;
    countryCounts[country.relativePath] = emptyCounts();
    visit(country, country.relativePath);
  }
  const terminalFor = (path: string): string | undefined => {
    let candidate = path;
    while (candidate) {
      if (terminals.has(candidate)) return candidate;
      const lastSlash = candidate.lastIndexOf("/");
      if (lastSlash < 0) break;
      candidate = candidate.slice(0, lastSlash);
    }
    return undefined;
  };
  const visited = new Set<string>();
  const completed = new Set<string>();
  for (const path of Object.keys(learning.visits)) {
    const terminal = terminalFor(path);
    if (terminal) visited.add(terminal);
  }
  for (const path of Object.keys(learning.practiced)) {
    const terminal = terminalFor(path);
    if (terminal) completed.add(terminal);
  }
  const parents = new Map<string, ReviewParent>();
  for (const quest of quests) {
    for (const milestone of quest.milestones) {
      if (progress[quest.id]?.milestones[milestone.id]?.status !== "complete") continue;
      for (const path of milestone.knowledgeLinks) {
        const node = nodes.get(path);
        if (!node) continue;
        const terminal = node.kind === "lesson" ? terminalFor(path) : terminals.has(path) ? path : undefined;
        if (terminal) {
          completed.add(terminal);
        } else if (node.kind !== "lesson") {
          const existing = parents.get(path);
          if (existing) {
            if (!existing.milestones.includes(quest.title + ": " + milestone.title)) {
              existing.milestones.push(quest.title + ": " + milestone.title);
            }
          } else {
            parents.set(path, {
              node,
              countryPath: countryOf.get(path)!,
              milestones: [quest.title + ": " + milestone.title]
            });
          }
        }
      }
    }
  }
  const world = emptyCounts();
  const cells = [...terminals.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([path, node]) => {
    const countryPath = countryOf.get(path)!;
    const state: ReviewState = completed.has(path) ? "completed" : visited.has(path) ? "visited" : "unvisited";
    const counts = countryCounts[countryPath];
    counts.total += 1;
    world.total += 1;
    if (state !== "unvisited") {
      counts.visited += 1;
      world.visited += 1;
    }
    if (state === "completed") {
      counts.completed += 1;
      world.completed += 1;
    }
    return { node, countryPath, state };
  });
  const regions: ReviewRegion[] = [];
  const addRegion = (node: ContentNode, countryPath: string, depth: 1 | 2 | 3) => {
    const path = node.relativePath;
    if (!path) return;
    const matching = cells.filter((cell) =>
      cell.countryPath === countryPath &&
      (cell.node.relativePath === path || cell.node.relativePath?.startsWith(path + "/")));
    const counts = matching.reduce<ReviewCounts>((result, cell) => {
      result.total += 1;
      if (cell.state !== "unvisited") result.visited += 1;
      if (cell.state === "completed") result.completed += 1;
      return result;
    }, emptyCounts());
    const state: ReviewState = counts.total > 0 && counts.completed === counts.total
      ? "completed" : counts.visited > 0 ? "visited" : "unvisited";
    regions.push({ node, countryPath, depth, counts, state });
  };
  for (const country of countries) {
    if (!country.relativePath) continue;
    const firstLevel = country.children.filter((node) => node.kind !== "lesson");
    for (const first of firstLevel.length ? firstLevel : [country]) {
      addRegion(first, country.relativePath, 1);
      for (const second of first.children.filter((node) => node.kind !== "lesson")) {
        addRegion(second, country.relativePath, 2);
        for (const third of second.children.filter((node) => node.kind !== "lesson")) {
          addRegion(third, country.relativePath, 3);
        }
      }
    }
  }
  return {
    cells,
    regions,
    parents: [...parents.values()].sort((a, b) => (a.node.relativePath ?? "").localeCompare(b.node.relativePath ?? "")),
    world,
    countries: countryCounts
  };
}
