---
schema_version: 1
id: VT-EF6E07ED-KNW-0020
type: knowledge
title: "Manager coordination: bounded core preflight route"
owner: manager
status: draft
revision: 1
created_at: 2026-10-11T22:46:08.067Z
updated_at: 2026-10-11T22:46:08.067Z
links:
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
# Decision for planning coordination
Manager invocation 36735cc4-1b0b-474f-bcd1-2b49eac9be17: optional CodeGraph inventory failed and direct shell helper unavailable. Use a bounded approved core check_run discovery check through separate check-executor to gather folder inventory/current Git status/HEAD and existing-file hashes, before selecting final problem. Verifier: define read-only discovery command arguments and expected exit 0 in a new check, owned verifier. Manager will create bounded preflight task and separate Sol reviewer reviews that diagnostic definition before execution. No product code writes. Target 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures. Candidate 24 from requirements vs 160 architect are both provisional; choose based on actual inventory. 203 already exists (actual source hash 07b1a7f7d1e0ec864b31fb391928f868655729dee51506b1551d81a5765fe068). 24 canonical source returned ENOENT but this does NOT prove problem absence under alternate naming. Preflight may run PowerShell Get-ChildItem/Get-FileHash plus git -c safe.directory=D:/workspace/NeoLearning status --porcelain=v1 and rev-parse HEAD through approved check runner only. No edits/output artifacts except recorded evidence; no provider retry with broader permissions. Check template .verythinker/templates/check.md exists; verifier role explicitly distinguishes executable command args from inspection rubric. Need actual supported data schema from core validation/context. Architecture/requirements should await preflight evidence and use file-only reads for remaining contract work.
