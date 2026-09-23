# Learning Web Markdown editor

## Goal

Add a safe lazy-loaded Markdown reader, source editor, diff review, and conflict-aware save workflow.

## Requirements

- Provide rendered reading, split source/preview, and pre-save diff modes.
- Lazy-load the editor route and Monaco so the Atlas entry bundle excludes it.
- Render common Markdown and GFM without executing raw HTML.
- Load and save only through the existing safe File API.
- Keep the draft and base revision client-side until an explicit diff review and
  explicit save.
- Warn before leaving with unsaved changes.
- Preserve drafts after HTTP conflicts or server errors; offer reload-current
  and copy-draft actions instead of automatic merging.
- Link lesson nodes in the Atlas to the editor route.

## Acceptance Criteria

- [ ] A real Markdown lesson opens in rendered reading mode.
- [ ] Source changes update a safe preview and dirty indicator.
- [ ] Save requires a server-generated diff review before the write request.
- [ ] A successful save updates content and base revision.
- [ ] Conflict and failed saves never discard the draft.
- [ ] Browser close and in-app navigation warn while the draft is dirty.
- [ ] The production build emits Editor/Monaco separately from the Atlas entry.

## Notes

- Tracker: NEL.16. Automatic merge, asset upload, and collaborative editing are
  explicitly outside the MVP.
