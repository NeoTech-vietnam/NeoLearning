# World Review implementation plan

## Ordered checklist

1. Read Learning Web conventions with trellis-before-dev; inspect routes,
   progress contracts, map styles, and tests before product changes.
2. Implement pure terminal-tree/progress selectors. Test path mapping,
   ancestor isolation, deduplication, missing paths, legacy completed Quest
   milestones without visits, and count invariants.
3. Replace the temporary microcell overlay with deterministic level-1/2/3
   polygons using existing territory geometry. Test one region per indexed
   folder, shared boundaries, stable layout, and country clipping.
4. Keep Review routing and exact leaf counts; update region aggregation,
   legend, parent-marker anchors, and responsive SVG styling. Preserve other
   modes.
5. Add browser checks for switching, persistence, phone viewport, keyboard
   navigation, and reduced motion; visually inspect all six countries,
   especially Software, with empty and mixed progress and three-level borders.
   Verify hover/focus highlight, detail text, exact-region opening, and two-tap
   touch inspection without masking country or Quest controls.
6. Run the quality gate and fix findings before marking the task complete.

## Validation

From Learning Web/: npm run typecheck, npm test, npm run build, and
npm run test:e2e (or npm run check when the full environment supports it).
Smoke-test the local app at desktop and phone sizes.

## Risky files and rollback

- src/atlas/WorldMap.tsx and Atlas styles: verify SVG clipping and hit
  targets do not obscure existing country selection.
- src/atlas/AtlasPage.tsx and src/app/routes.ts: preserve old hashes and
  selected-path behavior.
- Keep new selectors/layout pure and separately tested, so Review can be
  reverted without touching storage.

## Before start

Wait for explicit approval of the latest final planning summary in a
subsequent user message. Do not run task.py start or edit product code yet.
