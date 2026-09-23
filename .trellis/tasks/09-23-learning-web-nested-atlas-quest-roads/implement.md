# Nested atlas and quest roads — implementation plan

1. Read Trellis coding specs, inspect current Atlas/map/quest files and tests, and record dirty-worktree baseline.
2. Define and test pure hierarchy/itinerary projections, covering repeated, unresolved, cross-country and newly added paths.
3. Build one representative country pilot; verify art, clickable geometry and route overlay alignment. Seek visual review before rollout if the style diverges.
4. Generalize to all six countries and deeper available levels, with clear list fallback for crowded maps and lesson leaves.
5. Wire navigation to existing hash/breadcrumb/quest mode/editor links; add restrained transition and reduced-motion behavior.
6. Add unit and Playwright tests for drill-down, reload/back, multi-country road, repeat/missing stops, responsive hit areas and keyboard focus.
7. Run `npm run check` from `Learning Web`, inspect desktop/mobile views and report limitations.

Risk/rollback: isolate local map from `WorldMap`; preserve all uncommitted edits. This is planning only. Await the user's approval of the latest planning summary before `task.py start` or product-code edits.
