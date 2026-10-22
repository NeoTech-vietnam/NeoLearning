# Learning Web quality gates

## Goal

Add deterministic unit, integration, and browser quality gates using isolated temporary fixtures.

## Requirements

- Add a `npm run check` aggregate for typecheck, unit/integration tests, build,
  and browser tests.
- Configure Playwright to start the local application on temporary ports.
- Test core Atlas navigation, safe file route rejection, quest progress, and
  an isolated Markdown read/diff/save journey.
- Keep fixtures under a temporary repository path; browser tests must not write
  to the real curriculum or local progress file.
- Capture traces and screenshots only on failure.

## Acceptance Criteria

- [ ] Browser tests run without internet access against an isolated fixture.
- [ ] A failing save or unsafe path produces a meaningful assertion failure.
- [ ] `npm run check` is one documented command for all quality gates.

## Notes

- Keep `prd.md` focused on requirements, constraints, and acceptance criteria.
- Lightweight tasks can remain PRD-only.
- For complex tasks, add `design.md` for technical design and `implement.md` for execution planning before `task.py start`.
