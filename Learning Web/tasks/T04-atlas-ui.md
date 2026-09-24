---
taskId: LW-T04
title: Cartographic atlas interface
status: pending
priority: high
model: terra
wave: 2
dependencies: [LW-T02, LW-T04A]
ownership: [src/atlas, src/app/App.tsx, src/app/routes.tsx, tests/atlas]
---

# T04 — Cartographic atlas interface

## Goal

Build a zoomable, hierarchical cartographic atlas driven by the real content
tree and the shared visual foundations.

## Requirements

- Use `nimbalyst-local/mockups/cartographic-adventure.mockup.html` as country-map
  art direction, not as production code to copy wholesale.
- Use only tokens and primitives exported by T04A. Do not introduce a parallel
  component library or raw visual constants without documenting the gap.
- Implement hierarchy-aware navigation:
  `Embedded World → country → region → topic → lesson`.
- World view shows six countries. Country view shows its immediate regions;
  deeper views progressively reveal topics and lessons without flattening them.
- The relative visual area of a country may reflect descendant count. Apply a
  minimum size so small countries remain visible and selectable; Software must
  appear largest but must not monopolize the map.
- Implement breadcrumb, back/zoom-out, landmark selection, region card,
  expedition card, quest route, view modes, loading, empty and API error states.
- Quest routes contain canonical content-node IDs and may cross countries,
  revisit a country, or terminate in Product Realm.
- Render disk-only folders as ordinary selectable territories under their
  actual parent. Example branches are excluded by the content index.
- Keep game styling restrained: map, landmarks, route and progress are useful;
  decorative mechanics without learning value are excluded.
- Support keyboard navigation, visible focus, semantic buttons, reduced motion,
  and layouts down to 1024px desktop width.
- Isolate map geometry and layout calculation from content and quest data.

## Acceptance criteria

- Selecting a node updates the detail panel, breadcrumb and URL state.
- Refreshing a nested URL restores the same country/region/topic selection.
- World view contains exactly the six canonical countries in numeric order.
- Opening Software reveals its regions rather than showing them as world-level
  countries. Opening RTOS reveals its actual child topics.
- Disk-only curriculum folders are reachable without an intermediate
  `Uncharted` territory.
- The UI renders from content APIs without hard-coded curriculum prose in
  components.
- Component tests cover landmark selection, route mode, keyboard use, loading,
  zoom transitions, breadcrumb navigation, cross-country quest routes,
  disk-only folders, empty and error states.

## Validation

```bash
npm run test -- atlas
npm run typecheck
npm run build
```
