# Learning Web atlas integration — design

## Boundaries

The server remains the single HTTP boundary. Existing content, file, quest,
and progress modules own validation and persistence; `server/index.ts` only
mounts routers and normalizes final API errors.

The frontend consumes shared response contracts. Hash routing is intentionally
small and dependency-free: `#/atlas?path=<relativePath>` is the canonical Atlas
state, while `#/quests` selects the Quest Board.

## Data flow

```text
Markdown tree -> content index -> /api/content/tree -> AtlasPage -> selection URL
Quest Markdown -> quest catalog -> /api/quests -------> QuestPage
Local JSON ----> progress store -> /api/progress -----> QuestPage
PUT /api/files -> atomic file store -> refresh content index
```

`AtlasPage` searches the returned tree by canonical `relativePath`, derives the
breadcrumb from ancestor nodes, and renders only immediate children at each
level. Geometry knows stable country IDs and anchor positions, but country text
comes from the API tree.

Quest-route mode derives an ordered, non-deduplicated itinerary from milestone
knowledge links. Each path is resolved against the same content tree used by
the Atlas. The URL carries `mode=quest` and the selected quest ID; no parallel
route store is introduced.

## Compatibility and rollback

Existing `/#/design-system` and `/#/map-preview` development routes remain
available. Each router mount and frontend page is independently removable;
no content file format or stored progress schema changes in this increment.
