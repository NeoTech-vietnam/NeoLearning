export type AppRoute =
  | { name: "home" }
  | { name: "atlas"; path?: string; mode?: AtlasViewMode; questId?: string }
  | { name: "editor"; path?: string }
  | { name: "quests"; questId?: string }
  | { name: "map-preview" }
  | { name: "design-system" };

export type AtlasViewMode = "explore" | "quest" | "review";

export function parseHashRoute(hash: string): AppRoute {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  const [pathname, query = ""] = value.split("?", 2);
  if (pathname === "/atlas") {
    const parameters = new URLSearchParams(query);
    const path = parameters.get("path")?.trim();
    const modeValue = parameters.get("mode");
    const mode = modeValue === "quest" || modeValue === "review" ? modeValue : undefined;
    const questId = parameters.get("quest")?.trim();
    return {
      name: "atlas",
      ...(path ? { path } : {}),
      ...(mode ? { mode } : {}),
      ...(questId ? { questId } : {})
    };
  }
  if (pathname === "/quests") {
    const questId = new URLSearchParams(query).get("quest")?.trim();
    return { name: "quests", ...(questId ? { questId } : {}) };
  }
  if (pathname === "/editor") {
    const path = new URLSearchParams(query).get("path")?.trim();
    return { name: "editor", ...(path ? { path } : {}) };
  }
  if (pathname === "/map-preview") return { name: "map-preview" };
  if (pathname === "/design-system") return { name: "design-system" };
  return { name: "home" };
}

export function editorHash(path: string): string {
  return `#/editor?${new URLSearchParams({ path }).toString()}`;
}

export function atlasHash(
  path?: string,
  options: { mode?: AtlasViewMode; questId?: string } = {}
): string {
  const parameters = new URLSearchParams();
  if (path) parameters.set("path", path);
  if (options.mode === "quest" || options.mode === "review") parameters.set("mode", options.mode);
  if (options.questId) parameters.set("quest", options.questId);
  const query = parameters.toString();
  return query ? `#/atlas?${query}` : "#/atlas";
}
