# Nested atlas and quest roads — design

## Architecture

`ContentNode` and quest milestone links remain authoritative. Keep `WorldMap` at root; add a focused map component for the selected hierarchy level. One pure projection maps immediate children to visual territories, anchors, and hit targets. Art, labels, route overlay, and interactions consume that same projection so coordinates cannot drift.

Use canonical `relativePath` for identity and stable layout. Optional hand-tuned coordinates live in a small visual metadata layer keyed by path, never a second taxonomy. Unknown children get a deterministic readable fallback. Lesson leaves retain panel/editor navigation.

## Route and navigation

Keep the existing `#/atlas?path=...&mode=quest&quest=...` contract. Project the ordered `questRouteStops` itinerary onto the current level's ancestor territories; do not deduplicate repeated stops. World view shows cross-country legs. Focused views show relevant local legs and entry/exit indicators. The sidebar remains the full accessible itinerary; unresolved paths stay explicit.

## Visual and compatibility

Preserve parchment/cartographic palette and current world asset. Derive a deterministic, irregular landmass from the focused path and partition it into adjoining child polygons with shared boundaries. Use the same geometry for region fills, click areas, labels, and quest roads. Increase map height with territory row count for crowded branches; the list remains the readable fallback. Keep native label buttons for keyboard navigation and mark the current location with `aria-current`. Make zoom a restrained transition with a no-motion equivalent. No API/Markdown schema or progress-model changes. Keep world map and list as fallback/rollback.

## Software country pilot (2026-09-24)

The initial `02_Software` pilot parsed `country-02` from the authored interaction mask and normalized that exact path into the focused map viewport. The same path was the SVG clip and visible coastline, so topic fills and click areas could not extend beyond the country's silhouette. The pilot was visually reviewed before the all-country rollout below.

Partition the Software interior with deterministic power cells. Count descendant Markdown lesson nodes from the content tree, then target each topic's sampled area with 35% equal baseline and 65% square-root-of-file-count share; iteratively adjust cell weights. This makes large branches visibly larger without erasing tiny topics. Choose each label/quest anchor from samples that belong to its clipped cell. The current pilot does not solve label crowding at narrow peninsulas or exact mobile aspect preservation.

## Recursive country rollout (2026-09-24)

All six focused country maps now read their authored SVG mask path, preserving its on-screen aspect ratio. A deeper focus walks the actual `ContentNode` parent chain (including virtual `__uncharted` groups), recomputes each deterministic parent partition, intersects the selected convex cell with the visible parent coastline, and uniformly fits the resulting outline into the next viewport. The next subdivision, clip, hit area, labels and quest anchors consume that inherited outline. Direct URLs, reload and browser history therefore reconstruct the same coastline without stored layout state.

Sites are distributed within the current outline's bounds, snapped to interior samples and kept apart where possible. The existing 35% equal / 65% square-root lesson-count target still sizes child regions. Thin regions remain visually crowded; the list remains the accessible fallback. Polygon clipping currently represents one connected ring. The six authored root masks and sampled Software second-level regions were checked for clipping disagreement; disconnected island intersections are not a supported art contract yet.
