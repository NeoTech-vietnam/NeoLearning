# Execution

1. Start only after explicit parent final-plan approval and this child's task.py start.
2. Implement quote matching and storage/API tests, note/bookmark mutations, selection UI and detached-note behavior; verify two-client persistence and failures.
3. Run targeted tests/typecheck, then parent integration quality gate; record results in handoff.md.
4. No automatic commit/push. Preserve original data on rollback.

Validation: parent implement.md review gates and relevant existing editor/map/EXP suites, followed by npm run check.
