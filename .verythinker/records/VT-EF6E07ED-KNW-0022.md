---
schema_version: 1
id: VT-EF6E07ED-KNW-0022
type: knowledge
title: Preflight task coordination and discovered command schema
owner: manager
status: draft
revision: 1
created_at: 2026-10-11T22:47:22.931Z
updated_at: 2026-10-11T22:47:22.931Z
links:
  - type: references
    target: VT-EF6E07ED-TASK-0003
  - type: references
    target: VT-EF6E07ED-REQ-0003
data:
  workflow_id: VT-EF6E07ED-KNW-0014
  kind: coordination
  invocation_id: 36735cc4-1b0b-474f-bcd1-2b49eac9be17
  author_invocation_id: 36735cc4-1b0b-474f-bcd1-2b49eac9be17
  invocation_role: manager
  routing_required: true
---
# Current next action
Manager invocation 36735cc4-1b0b-474f-bcd1-2b49eac9be17 created read-only preflight TASK-0003. Verifier CHK-0003 demonstrates core check schema: data.method automated-test, level integration, command executable-argument array, cwd '.', expected_exit 0, expected_stdout/expected_stderr, acceptance_criteria, oracle_rationale, verification_artifact_paths. Define INVENTORY diagnostic with node -e fs.readdirSync recursive traversal and child_process.spawnSync('git',['-c','safe.directory=D:/workspace/NeoLearning','status','--porcelain=v1']) / rev-parse HEAD. Print JSON actual directory/file inventory and hashes, current commit/dirty state, versions/compiler existence, verify target exists and execution success; do NOT fix exact variable Git stdout expectation. Link diagnostic verifies TASK-0003 explicitly, NOT REQ-0003 (avoid new exercise acceptance dependency cycles). Requirements can adopt measurable original criteria conditionally: selection must be confirmed absent by preflight before execution. Design may remain proposed until preflight. Complete current invocations/reports so independent reviewer can approve diagnostic plan; manager resumes specialists with resulting evidence. Check executor owns no source editing regardless allowed read paths. No codegraph retries needed.
