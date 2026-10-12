---
schema_version: 1
id: VT-EF6E07ED-TASK-0003
type: task
title: Read-only exercise inventory and preservation baseline
owner: check-executor
status: draft
revision: 5
created_at: 2026-10-11T22:46:25.505Z
updated_at: 2026-10-11T23:23:25.450Z
links:
  - type: satisfies
    target: VT-EF6E07ED-REQ-0004
  - type: references
    target: VT-EF6E07ED-CHK-0004
data:
  workflow_id: VT-EF6E07ED-KNW-0014
  requirement_ids:
    - VT-EF6E07ED-REQ-0004
  acceptance_criteria:
    - Capture actual target directory inventory, current Git HEAD and dirty
      status plus hashes of existing target exercise files through approved
      prescribed core execution.
    - No source or preexisting-file edits; preserve evidence and report
      tool/permission limits.
  allowed_paths:
    - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures
    - .verythinker/records
  documentation_required: true
  documentation_paths:
    - .verythinker/records
  dependencies: []
  verification_method: Read-only discovery command reviewed by independent Sol
    reviewer; actual result evidence.
  baseline: Read-only diagnostic subrequirementREQ0004; immutable original CHK0004
    command/expected schema; existing extensive dirty working tree.
  escalation_conditions:
    - Required prescribed execution unavailable or rejected; do not bypass.
  author_invocation_id: 26caa8e8-9c38-443e-8010-c64f8a560aa9
  invocation_role: manager
  routing_required: true
  required_tools: []
  outputs:
    - Read-only inventory/Git/file-hash evidence and seven-section work record
  assumptions:
    - This task's paths permit reads and managed records only; it owns no source
      writes.
  check_ids:
    - VT-EF6E07ED-CHK-0004
  tools:
    - engineering-core
    - prescribed-execution
  tool_contract_rationale: Core/native capability names describe role
    requirements; required_tools accepts approved external provider IDs only. No
    external provider applicable to prescribed diagnostic. Correct metadata
    without changing check expectations.
  traceability_revision_reason: Separate diagnostic requirement avoids global
    product-check gating before prerequisite inventory. ProductREQ0003
    unchanged; diagnostic still must be independently reviewed and actually
    executed.
---
# Objective
Establish actual preimplementation inventory and preservation baseline for one additional exercise. Manager invocation 36735cc4-1b0b-474f-bcd1-2b49eac9be17.
# Scope
Read-only target inventory, Git HEAD/status and file hashes. No source writing; no Trellis; no legacy lifecycle changes. Verifier defines command check and independent reviewer reviews before executor dispatch. Actual evidence and seven-section report required. 60 second check timeout, at most one repair.
