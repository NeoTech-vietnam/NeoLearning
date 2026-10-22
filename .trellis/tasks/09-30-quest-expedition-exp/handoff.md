# Handoff — 2026-09-30

Implemented guided quest stage briefing/trail, focused ordered journeys, nine graded Watchtower clues, completed/current map markers and glowing completed roads. Existing simulations, journals, evidence and navigation remain in place.

Explorer camp provides daily check-in, a 14-day calendar, separate check-in/learning streaks, levels/titles, reward history, compact header stats and EXP/level-up notification. Server owns rewards/date boundaries; atomic serialized explorer.json ledger preserves historical credit, deduplicates concurrent grants and never resets corrupt data.

## Validation
- npm run check: typecheck, 52 unit/integration tests, production build and 37 browser tests passed.
- Targeted browser suite: check-in idempotency, retry behavior, wrong/correct clues, ordered stage advancement, persistence and completed map roads.
- Inspected desktop/phone screenshots under /tmp/neolearning-*.png; phone horizontal-overflow assertion passes.
- git diff --check passed. Normal sandbox Node processes could not create stream descriptors; reran tests with approved process permissions.

## Limits
- EXP describes participation, not certified mastery. Field quizzes/simulations never certify physical hardware.
- Single-person, single-process app; do not run multiple servers against the same personal-data directory.
- Keep NEOLEARNING_TIME_ZONE stable after starting; historical calendar dates are not migrated across zones.
- Existing authored questions currently cover Watchtower only; other quests still have stage briefing, journals, evidence and rewards.
- Vite reports the existing large lazy-loaded Monaco chunk warning.
- Code deliberately remains uncommitted/unpushed pending user review. Task is implemented; archive after the approved work commit.
