import type { ContentNode } from "../shared";
import { canonicalCountries } from "./model";

export interface DiscoveryDestination { country: ContentNode; node: ContentNode; trail: ContentNode[]; lessons: ContentNode[] }
export interface DiscoveryPool { country: ContentNode; destinations: DiscoveryDestination[] }

/** Country-first sampling keeps large countries from swallowing the discovery pool. */
export function discoveryPools(root: ContentNode): DiscoveryPool[] {
  return canonicalCountries(root).flatMap((country) => {
    const destinations: DiscoveryDestination[] = [];
    const seen = new Set<string>();
    const visit = (node: ContentNode, trail: ContentNode[]) => {
      const folders = node.children.filter((child) => child.kind !== "lesson");
      const lessons = node.children.filter((child) => child.kind === "lesson" && child.relativePath);
      if (node !== country && node.relativePath && folders.length === 0 && lessons.length > 0 && !seen.has(node.relativePath)) {
        seen.add(node.relativePath); destinations.push({ country, node, trail, lessons });
      }
      for (const folder of folders) visit(folder, [...trail, folder]);
    };
    visit(country, [country]);
    return destinations.length ? [{ country, destinations }] : [];
  });
}

export function pickDiscovery(pools: DiscoveryPool[], previousPath?: string, random: () => number = Math.random): DiscoveryDestination | undefined {
  const eligible = pools.map((pool) => ({ ...pool, destinations: pool.destinations.filter((item) => item.node.relativePath !== previousPath) }))
    .filter((pool) => pool.destinations.length > 0);
  // A one-destination world must remain usable rather than spin indefinitely.
  const choices = eligible.length ? eligible : pools.filter((pool) => pool.destinations.length > 0);
  if (!choices.length) return undefined;
  const index = (count: number) => {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) throw new Error("Random value must be in [0, 1).");
    return Math.floor(value * count);
  };
  const country = choices[index(choices.length)];
  return country.destinations[index(country.destinations.length)];
}
