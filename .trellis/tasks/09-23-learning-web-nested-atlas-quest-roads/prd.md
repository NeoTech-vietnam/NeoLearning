# Learning Web nested atlas and quest roads

## Goal

Turn the six-country Atlas into a navigable learning world: zoom into a country to discover child topics as smaller territories, and follow a quest as one ordered road crossing country borders. The Markdown curriculum tree remains authoritative.

## Requirements

1. Selecting a country shows a distinct zoomed-in view with clickable immediate children; selecting a territory continues down the hierarchy. Breadcrumb, zoom-out and hash URL remain authoritative.
2. Layout and hit regions are stable for a given content tree and consistent with the current cartographic art. Child territories form one connected landmass with varied shared borders rather than repeated isolated diamonds. No AI imagery or duplicate topic text.
3. Quest mode spatially shows ordered stops and cross-country legs at world level, plus relevant local legs/stops in focused views. Preserve repeated stops and explain unresolved links.
4. Route stops navigate to Atlas nodes. Quest mode, selection and location survive reload and browser history.
5. Keyboard, focus, mobile and reduced-motion behavior remain usable; list navigation remains for crowded maps and lesson leaves.
6. Every deeper map inherits the selected parent territory silhouette, then recursively subdivides it using the current content tree and stable file-count weighting.

## Acceptance Criteria

- [ ] All six countries open distinct child-territory views; immediate children, including unindexed ones, are selectable.
- [ ] Deeper navigation, zoom-out, refresh and browser back/forward restore the correct view and the same inherited coastline.
- [ ] A multi-country quest shows an ordered cross-border road and matching local route segments.
- [ ] Repeated and unresolved knowledge links are represented without route failure.
- [ ] Art, labels, hit targets and roads align at desktop/mobile widths; keyboard and reduced-motion checks pass.
- [ ] Existing world map, Quest Board and editor links do not regress; `npm run check` passes.

## Notes

Current evidence: `src/atlas/AtlasPage.tsx` already loads the content tree/quest APIs, stores nested selection in the URL, and renders breadcrumbs and a quest itinerary. `WorldMap.tsx` renders only six top-level countries. `model.ts` already resolves ordered milestone links to content nodes. Current map art/masks are in `assets/maps/`; user prefers the existing open/vector cartographic direction and no AI-generated imagery.

Scope: prototype one representative country, visually review it, then reuse the approved design across the six countries and available child levels. Reuse current APIs and Markdown taxonomy. Out of scope: new content, quest authoring, GIS accuracy, fully hand-painted maps at every level, 3D/game-state systems.

Primary risk: nested maps may look artificial. Use seeded geometry so any procedural variation is stable across reloads and route overlays remain aligned. The existing list is a fallback; no content node may disappear because layout metadata is missing. Preserve unrelated uncommitted changes.
