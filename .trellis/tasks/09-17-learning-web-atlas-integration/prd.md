# Learning Web atlas integration

## Goal

Mount existing APIs and deliver a data-driven Atlas and Quest navigation shell for the Learning Web MVP.

## Requirements

- Mount the existing safe-file, quest-catalog, and progress routers below `/api`.
- Refresh the in-memory content index after a successful Markdown write.
- Provide public hash routes for Home, Atlas, and Quests without adding a router dependency.
- Render Atlas hierarchy from `/api/content/tree`; do not duplicate curriculum prose in components.
- Preserve the approved six-country SVG world view and allow country selection with keyboard and pointer input.
- Keep nested country/region/topic/lesson selection in the URL so refresh restores the view.
- Distinguish `Uncharted` content and expose loading, empty, and API-error states.
- Render the existing Quest Board against `/api/quests` and `/api/progress`.
- Keep the Markdown editor, full quest-route overlay, and procedural map geometry outside this increment.

## Acceptance Criteria

- [ ] `/api/files`, `/api/quests`, and `/api/progress` respond through the main Express app.
- [ ] Successful file writes refresh the content index while failed/conflicting writes do not.
- [ ] Atlas displays exactly six canonical top-level countries in numeric order from the API.
- [ ] Country and nested selections update breadcrumb, detail content, back navigation, and URL state.
- [ ] A nested Atlas URL restores the same selected node after reload.
- [ ] Quest Board loads real quest/progress data and links back to Atlas content.
- [ ] Loading, empty, API-error, keyboard-focus, and reduced-motion behavior are covered.
- [ ] Unit tests, typecheck, and production build pass.

## Notes

- Tracker: NEL.15. Existing prerequisite implementations are NEL.11, NEL.12,
  NEL.13, NEL.14, and NEL.19.
