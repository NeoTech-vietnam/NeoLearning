# World Review design

## Architecture

- Add review to Atlas route modes. Keep AtlasPage as data/mode coordinator and
  preserve Explore and Quest branches.
- Use the indexed ContentNode tree for topology. A pure selector enumerates
  terminal folders, maps progress to cells and parent markers, and computes
  world/country counts. Derive from existing Atlas learning and Quest progress
  payloads; add no progress store or migration.
- Render in the world map's 3840×2160 SVG frame, clipped by authored country
  shapes. Terminal folders remain model/count units, not all drawn cells.

## State contract

- A terminal folder has no indexed child folders; Markdown lessons are not
  cells. A visit at the terminal path or descendant lesson marks that terminal
  visited. An ancestor-only visit does not fan out.
- Completed lesson activities map to their containing terminal folder. A
  completed Quest milestone maps exact terminal knowledgeLinks to completed
  cells and nonterminal links to separate parent markers. Ignore unresolved
  paths safely and deduplicate links by path.
- Cell priority: completed > visited > unvisited. Counts use visitedOrCompleted
  and completed, so legacy completed Quest data lacking a visit remains
  consistent without creating a fake visit record.
- Parent markers are keyed by parent path and excluded from terminal totals.
  Detail text lists matching Quest milestones.

## Layout and interaction

- Reuse the deterministic territory partition on each country's normalized
  silhouette for folder children at depth 1, then partition each visible
  depth-1 polygon for its folder children at depth 2. Convert polygons back
  to world coordinates; clip against the authored SVG country mask. Draw
  level-1 boundaries thicker than level-2 boundaries.
- Aggregate descendant terminal-folder counts into each region. A visited
  fill reflects any visit, with intensity based on visited share; a small
  gold mark reflects partial completion. Full gold fill requires every
  terminal folder beneath the region to be completed.
- Position separate Quest parent markers at the matching visible region or
  nearest visible ancestor; group collisions accessibly. Country selection
  enters the detailed Atlas, without hundreds of world-scale labels.
- Defer level-3+ boundaries. The panel keeps exact terminal counts so deeper
  coverage remains visible without pretending the coarse regions are mastery.
- Visible region paths are pointer and keyboard targets. Hover/focus brightens
  the exact region and updates a persistent, fixed-height inspector at the top
  of the adjacent World Review panel (below the map on mobile), never over the
  SVG. Touch first selects a region for inspection and a second tap opens it.
  Country labels and Quest parent markers retain their own navigation targets.

## Compatibility and rollback

- Existing save files remain valid; changed folder trees update denominators
  on refresh. The two-level subdivision is an overview, not replacement nested geography
  or a mastery score.
- Isolate the overlay behind Review mode so it can be disabled without
  changing Explore, Quest, or persisted progress. Risks: Software level-2 density,
  SVG hit-target layering, overlapping parent markers.
