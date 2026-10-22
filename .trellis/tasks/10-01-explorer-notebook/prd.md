# Explorer notebook — Reader and Motion

## Goal

Upgrade every Markdown reader with navigation, reading controls, annotations and accessible motion.

## Background

User approved all seven proposed Reader/Motion improvements and consented to task creation. Current LessonReader offers sections, activities and server-backed resume only for authored lesson plans; ordinary Markdown uses a basic MarkdownPreview. Both use react-markdown with raw HTML disabled. Existing EXP and milestone state are authoritative server data.

## Requirements

- R1: Every Markdown document in Read mode gets section navigation, active-section indication, reading-position progress and resume. Scrolling is not mastery.
- R2: Focus mode hides secondary reading UI without hiding the exit; adjustable font size, page width and reading background.
- R3: Code blocks offer syntax colors, copy with success/failure feedback and collapse for long blocks. Unsupported languages remain readable plain text.
- R4: Images open an accessible enlargement dialog; tables scroll independently on narrow screens.
- R5: Selected text can become a quoted highlight with a note. Sections can be bookmarked; saved entries can be revisited and removed without changing Markdown source.
- R6: Short, consistent transitions for navigation and panels, without delaying actual navigation or hiding content until animation runs.
- R7: Smooth EXP display and brief checkpoint/activity completion feedback, without awarding new EXP or replaying rewards on reload.
- Preserve source editing, conflict/discard handling, lesson activities, Quest progress and existing access controls. Keyboard, mobile and reduced-motion support are required.

## Task Map

- `10-01-notebook-reader`: R1–R4, common reading surface and integration.
- `10-01-notebook-notes`: R5, depends on reader anchors.
- `10-01-notebook-motion`: R6–R7, integrates after reader/notes.
- Parent owns final full-suite integration review; no independent product code.

## Acceptance Criteria

- [x] Ordinary and authored lesson documents share reader controls; editing and activities retain existing behavior.
- [x] Resume handles duplicate/missing headings and source changes without jumping to unrelated content.
- [x] Code copy, collapse, image dialog and wide tables work with keyboard and phone layouts.
- [x] Notes/bookmarks and reading position persist on the private server and are visible on phone/desktop; persistence errors are visible, and changed-source highlights never silently attach to unrelated text.
- [x] Reduced motion disables decorative movement; content stays usable without animation.
- [x] Reader interactions do not increment mastery/EXP; tests assert this.
- [x] Typecheck, unit/integration tests, production build and E2E pass; inspect desktop/mobile screenshots.

## Out of Scope

AI summaries, generated quizzes, Markdown source rewrites, multiplayer accounts, new EXP rules, generated images, audio autoplay and arbitrary HTML execution.

## Decisions

User approved server persistence for personal highlights, notes and bookmarks. The deployment remains a single-owner private app, not a multi-user account system. No unresolved product decisions remain.
