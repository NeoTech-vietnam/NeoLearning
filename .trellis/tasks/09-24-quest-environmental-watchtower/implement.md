# Environmental Watchtower quest road — implementation plan

1. Record the dirty-worktree baseline and read the active Trellis shared guides plus the Quest/Atlas code and tests. Do not touch the unrelated uncommitted Atlas optimization files except where this feature requires a narrow edit.
2. Extend shared Quest types, the Markdown frontmatter parser, and the quest schema README for optional destination/challenge text. Test existing quests and invalid new fields.
3. Author `quests/environmental-watchtower.md` with nine ordered real region links, one actionable challenge at every stop, and evidence-required checkpoints at 3, 6, and 9. Validate it through the catalogue, not by duplicating parser logic.
4. Show destination/challenges in Board, Detail, and Atlas quest itinerary; keep the route geometry derived from milestone links. Add a visible, recoverable milestone-save error state.
5. Add tests for 3+3+3 stop projection, cross-country/local route navigation, data reload/history, checkpoint evidence/completion, and compatibility with Environmental Sentinel. Cover keyboard/mobile at the relevant controls.
6. Run `npm run check` from `Learning Web`, inspect the new road at root and within all three countries, compare changed files against scope, and document any remaining limitations.

Risk points: `server/quests/index.ts` parses a deliberately strict YAML subset; keep new fields scalar and optional. `src/atlas/AtlasPage.tsx` already has uncommitted optimization edits; patch only the quest presentation and preserve those edits. Progress persistence is already implemented, so do not change its schema or stored data. The rollback is removal of the new quest and optional presentation fields, leaving the existing route machinery intact.
