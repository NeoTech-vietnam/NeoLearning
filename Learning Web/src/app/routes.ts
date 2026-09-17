export type AppRoute =
  | { name: "home" }
  | { name: "atlas"; path?: string }
  | { name: "quests" }
  | { name: "map-preview" }
  | { name: "design-system" };

export function parseHashRoute(hash: string): AppRoute {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  const [pathname, query = ""] = value.split("?", 2);
  if (pathname === "/atlas") {
    const path = new URLSearchParams(query).get("path")?.trim();
    return { name: "atlas", ...(path ? { path } : {}) };
  }
  if (pathname === "/quests") return { name: "quests" };
  if (pathname === "/map-preview") return { name: "map-preview" };
  if (pathname === "/design-system") return { name: "design-system" };
  return { name: "home" };
}

export function atlasHash(path?: string): string {
  return path ? `#/atlas?${new URLSearchParams({ path }).toString()}` : "#/atlas";
}
