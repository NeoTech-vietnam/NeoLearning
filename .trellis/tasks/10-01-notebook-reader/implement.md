# Execution

1. Start only after explicit parent final-plan approval and this child's task.py start.
2. Implement heading/rendering tests, common Read shell, reading settings, server position persistence, code/media controls; preserve split preview and authored activities.
3. Run targeted tests/typecheck, then parent integration quality gate; record results in handoff.md.
4. No automatic commit/push. Preserve original data on rollback.

Validation: parent implement.md review gates and relevant existing editor/map/EXP suites, followed by npm run check.
