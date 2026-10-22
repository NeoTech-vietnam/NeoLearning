# Execution plan

1. Finish artifact review and obtain explicit approval of final summary before starting children.
2. Implement notebook-reader: shared renderer, heading anchors/position store, reading controls, code/media, editor/lesson integration. Test ordinary and authored lessons plus legacy source-editing flows.
3. Implement notebook-notes using reader anchors: typed storage/API, highlight selection and contextual matching, note/bookmark CRUD, error handling and cross-client persistence tests.
4. Implement notebook-motion: shared motion CSS, navigation/panel hooks and existing EXP/checkpoint feedback; reduced-motion and cancellation tests.
5. Run `npm run check` from Learning Web; inspect desktop and phone reader/map/quest screenshots and verify no horizontal page overflow.
6. Document persistence/backup boundaries and completed acceptance criteria. Build and restart only the exact existing authenticated preview service for user review. Do not auto-commit or push.

## Review gates

- Reader: stable anchors, plain Markdown support, no duplicate position writes, code copy failure, table/image keyboard behavior, safe rendering and drafts unchanged.
- Notes: rejected traversal/oversized input, duplicate/repeated quote handling, concurrent mutations, restart, corrupt store, changed source, persistence retry and no mastery writes.
- Motion: no startup celebration, reduced-motion immediate display, no stale timers/focus loss and no new reward grants.
- Final: typecheck, unit/integration tests, build, all E2E, `git diff --check` and responsive visual inspection.

Rollback each child at its boundary; preserve new data and all original stores. Parent is not an implementation target.
