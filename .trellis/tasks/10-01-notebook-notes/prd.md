# Reader highlights and notes

## Goal

Persist quoted highlights, notes and section bookmarks without modifying Markdown sources.

## Requirements

- Own parent R5: quoted text highlights with notes and section bookmarks; create, revisit and delete without source edits.
- Depends on reader anchor contract. User approved private server persistence shared between phone and desktop.
- Changed-source anchors must be validated; unmatched saved quotes remain available as detached notes rather than incorrectly highlighted text.

## Acceptance Criteria

- [ ] Notes/bookmarks survive reload using approved persistence scope.
- [ ] Repeated text, duplicate headings, changed source, save failure and keyboard/mobile operation are tested.
- [ ] No Markdown writes or EXP/mastery changes result from note actions.

## Notes

- Keep `prd.md` focused on requirements, constraints, and acceptance criteria.
- Lightweight tasks can remain PRD-only.
- For complex tasks, add `design.md` for technical design and `implement.md` for execution planning before `task.py start`.
