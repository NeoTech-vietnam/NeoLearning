# Accessible journey motion

## Goal

Consistent short transitions and achievement feedback with reduced-motion support.

## Requirements

- Own parent R6–R7: short navigation/panel transitions and achievement feedback using existing reward/progress state.
- Integrate after reader/notes. No continuous distracting motion, navigation delays or new reward grants.
- Respect reduced motion and preserve focus, interaction and scroll position.

## Acceptance Criteria

- [ ] Navigation and reward feedback render with and without reduced motion.
- [ ] Reload does not replay reward celebrations; rapid navigation cancels stale effects.
- [ ] Keyboard/mobile usability and existing map/EXP tests remain green.

## Notes

- Keep `prd.md` focused on requirements, constraints, and acceptance criteria.
- Lightweight tasks can remain PRD-only.
- For complex tasks, add `design.md` for technical design and `implement.md` for execution planning before `task.py start`.
