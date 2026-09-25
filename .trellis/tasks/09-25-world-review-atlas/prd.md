# World Review atlas

## Goal

Show visited and completed coverage across the six-country Embedded world
using stable country subdivisions rather than a uniform microcell grid.
Opening a document is not mastery.

## Background

- The Atlas content tree is generated from real folders and Markdown files;
  `Examples` branches are excluded by the content index.
- There are currently 456 terminal learning folders, including 380 in Software.
  The number may change as the repository grows and must be computed from the
  current tree, not hard-coded.
- Atlas visits are persisted in `learning-progress.json`. Interactive activity
  completion is recorded per lesson; Quest milestone completion is persisted
  separately in `progress.json`.
- Of the current 17 milestone knowledge links, five point at terminal folders
  and twelve point at folders with child learning regions.
- Terminal folders remain the counting unit. The user rejected equal-looking
  leaf microcells: this pass draws fixed contiguous boundaries for immediate
  country child folders (level 1) and their child folders (level 2). Deeper
  folder borders are deferred. Opening only counts as a visit; completion
  needs an activity or directly linked Quest milestone.
- A completed Quest milestone linked to a parent folder gets its own marker;
  it does not complete or count any of its terminal descendants.

## Requirements

1. Add a World Review view on the existing Atlas world map. Preserve the
   authored six-country coastline and existing Explore and Quest modes.
2. Partition each country into stable level-1 folder regions and subdivide
   each into stable level-2 folder regions where children exist. Borders must
   meet with no intentional gaps or overlapping land and follow the authored
   country boundary. Do not draw equal-size hexes for all leaves.
3. Aggregate terminal-folder coverage into visible regions: visited if any
   descendant was visited; fully completed only if every descendant terminal
   folder was completed. Mark partial completion separately; never imply a
   whole region is complete from one deeper activity.
4. Derive completed activity state from persisted activity completion and Quest
   state from persisted milestone status. Do not create a second manually edited
   progress ledger.
5. Show world and per-country counts with denominators based on current terminal
   folders. Label them as coverage of learning regions, not percentage of
   knowledge mastered.
6. Keep the map keyboard/mobile usable, provide a color-independent legend, and
   respect reduced-motion preference.
7. Show a distinct, named marker for each completed Quest-linked nonterminal
   folder, grouping overlapping markers accessibly. Parent markers do not
   contribute to terminal-folder totals.
8. An ancestor visit alone must not visit all descendants. Completed cells take
   precedence; count them as visited-or-completed even without a visit record.
9. Hovering or focusing a visible level-1/2 region highlights its exact border
   and reveals its name, parent context, and terminal-folder coverage. Touch
   users can inspect a region before opening it. Keep the detail card in a
   fixed place outside the map so it never obscures territory boundaries.

## Acceptance Criteria

- [ ] World Review is reachable from the Atlas toolbar without disrupting
      Explore or Quest navigation.
- [ ] Every indexed country child folder has exactly one level-1 region;
      each folder child thereof has exactly one level-2 region. Their fixed
      boundaries meet inside the parent and stay within the authored country.
- [ ] Visiting a terminal folder or descendant lesson updates its visible
      level-1/2 ancestor coverage after reload; a visit alone never completes
      a region.
- [ ] Completing an activity or qualifying Quest milestone updates exact
      terminal counts and a partial-completion cue on visible ancestors; a
      region shines fully only when all its terminal folders are complete.
- [ ] Counts for all six countries sum to the world count, and no folder is
      double-counted through ancestor folders.
- [ ] A completed Quest-linked parent shows its own navigable marker without
      changing descendant cells or completed-cell count.
- [ ] An ancestor-only visit does not light children; a completed cell without
      a stored visit still contributes to visited-or-completed coverage.
- [ ] Software's 20 level-1 and 63 level-2 folder boundaries remain legible
      on a phone by panning; country navigation still opens the detailed Atlas.
- [ ] Automated unit and browser tests cover status mapping, count invariants,
      persistence, mode switching, parent-marker isolation, and reduced motion.
- [ ] Mouse hover, keyboard focus, and touch inspection show the correct region
      details in a stable side-panel card outside the map on desktop and mobile;
      opening a region and country-level navigation both still work.

## Out of Scope

- XP, streaks, leaderboards, or a numerical mastery score.
- Marking a folder complete merely because it was opened.
- Adding a manual completion button or a second source of progress truth.
- Replacing the authored map art or changing nested-map geometry.
- Drawing separate world-map borders for level-3+ folders in this pass.
