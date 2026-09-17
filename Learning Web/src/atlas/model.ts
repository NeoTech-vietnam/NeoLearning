import type { ContentNode } from "../shared";

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
