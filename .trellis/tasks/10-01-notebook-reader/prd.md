# Unified Markdown reader

## Goal

Accessible reading controls, navigation, code blocks and media for every Markdown document.

## Requirements

- Own parent requirements R1–R4: a common reader for ordinary Markdown and authored lessons; focus/font/width/background controls, navigation/resume, code copy/collapse/colors and accessible media.
- Preserve lesson activities, frontmatter stripping, safe rendering and all editing/conflict behavior. No automatic mastery from reading.
- Depends on parent final plan approval; persistence design follows the parent decision.

## Acceptance Criteria

- [ ] Parent R1–R4 observable outcomes pass in unit and phone/desktop browser tests.
- [ ] Existing editor/activity/safety tests remain green; reader does not load Monaco.

## Notes

- Keep `prd.md` focused on requirements, constraints, and acceptance criteria.
- Lightweight tasks can remain PRD-only.
- For complex tasks, add `design.md` for technical design and `implement.md` for execution planning before `task.py start`.
