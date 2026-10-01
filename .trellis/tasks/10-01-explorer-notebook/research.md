# Evidence and boundaries

- `Learning Web/src/editor/EditorPage.tsx`: Read mode selects LessonReader only for a clean document with a lesson plan. Split mode keeps source editor lazy-loaded. Preserve unsaved draft and conflict protection.
- `Learning Web/src/editor/LessonReader.tsx`: wraps Markdown by heading, attaches activities and debounces position writes. Shared reader must preserve activity anchors and not duplicate observers/writes.
- `Learning Web/src/shared/learning.ts`: current heading parser only recognizes ATX headings and backtick fences; strengthen heading identity/fence handling with regression coverage before relying on persistent anchors.
- `Learning Web/src/editor/MarkdownPreview.tsx`: strips frontmatter and disables raw HTML. Shared renderers must preserve this safety boundary.
- `Learning Web/src/editor/editor.css`: tables have no independent scroll wrapper; code is unhighlighted; images only max-width constrained.
- `Learning Web/src/explorer/explorer.css`: EXP toast already animates and honors reduced motion. Extend it rather than adding another reward mechanism.
- `Learning Web/tests/e2e/learning-journey.spec.ts`: regression gates cover Markdown safety, file saves, conflicts, navigation and traversal.
- Learning Web has no registered package specs; shared reuse/cross-layer guides apply. Examples is unrelated and remains untouched.

Expected code boundary: shared reader/renderers and editor integration, optional notes store/router/contracts based on persistence decision, scoped motion CSS and existing reward components, isolated fixture tests/docs. No curriculum edits or public deployment changes. Any syntax dependency must be justified and lazy-loaded so map startup does not load a highlighter.
