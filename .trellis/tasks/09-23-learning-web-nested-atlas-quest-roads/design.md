# Nested atlas and quest roads — design

## Architecture

`ContentNode` and quest milestone links remain authoritative. Keep `WorldMap` at root; add a focused map component for the selected hierarchy level. One pure projection maps immediate children to visual territories, anchors, and hit targets. Art, labels, route overlay, and interactions consume that same projection so coordinates cannot drift.

Use canonical `relativePath` for identity and stable layout. Optional hand-tuned coordinates live in a small visual metadata layer keyed by path, never a second taxonomy. Unknown children get a deterministic readable fallback. Lesson leaves retain panel/editor navigation.

## Route and navigation

Keep the existing `#/atlas?path=...&mode=quest&quest=...` contract. Project the ordered `questRouteStops` itinerary onto the current level's ancestor territories; do not deduplicate repeated stops. World view shows cross-country legs. Focused views show relevant local legs and entry/exit indicators. The sidebar remains the full accessible itinerary; unresolved paths stay explicit.

## Visual and compatibility

Preserve parchment/cartographic palette and current world asset. Use intentional territory boundaries and roads, no AI imagery or random landmass generation. Make zoom a restrained transition with a no-motion equivalent. No API/Markdown schema or progress-model changes. Keep world map and list as fallback/rollback.
