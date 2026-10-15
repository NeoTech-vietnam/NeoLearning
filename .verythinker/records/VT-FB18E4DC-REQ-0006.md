---
schema_version: 1
id: VT-FB18E4DC-REQ-0006
type: requirement
title: Reproducible runnable practice where applicable
owner: requirements
status: draft
revision: 2
created_at: 2026-10-12T08:25:01.830Z
updated_at: 2026-10-12T15:39:03.443Z
links:
  - type: derives-from
    target: VT-FB18E4DC-REQ-0001
data:
  intake_workflow_id: VT-FB18E4DC-KNW-0001
  acceptance_criteria:
    - Before implementation, classify inventory topics as runnable or not
      applicable with a concrete pedagogical or technical reason; an unavailable
      tool is a blocker/limitation, not an automatic not-applicable
      classification.
    - Every runnable item supplies separate exercise and answer/reference
      implementation artifacts, exact executable/argument array, dependency
      versions/environment, deterministic inputs and predeclared expected
      outputs, assertions or numeric tolerances.
    - Execute every planned runnable item on the reviewed artifact revision and
      preserve observed output, command, environment/version, time,
      hashes/revision and check/evidence IDs. State expected behavior separately
      from observed results.
    - Document relevant boundary/failure cases and how to interpret outputs;
      preserve user-authored solution files. Failed/unexecuted practice remains
      explicitly unresolved and prevents an unqualified runnable-success claim.
  source: VT-FB18E4DC-REQ-0001
  verification_method: "VP05 / unit numerical checks and document-to-practice
    integration: check executor runs frozen commands against reviewed oracles;
    verifier inspects output and all topic dispositions. This is proposed
    coverage, not current execution evidence."
  verification_status: planned-not-executed
  requirements_invocation_id: 2956cea0-f83a-48ad-9df9-fd88e4de2011
  assumptions:
    - Local PDF contents and edition/page locators remain unverified at planning.
  priority: required
  invocation_id: 69c69765-fecb-4f3c-8355-71d7cf27fe0f
  author_invocation_id: 69c69765-fecb-4f3c-8355-71d7cf27fe0f
  invocation_role: requirements
  routing_required: true
  workflow_id: VT-FB18E4DC-KNW-0001
---
## Statement
Provide reproducible runnable demonstrations/practice for inventoried introductory topics that benefit from computational verification.

## Rationale and Source
Applicable computations should be directly usable and checked, rather than merely described.
Derived from VT-FB18E4DC-REQ-0001 revision 1, original stakeholder request and current resume steering. Workflow VT-FB18E4DC-KNW-0001. Authored by signed requirements invocation 2956cea0-f83a-48ad-9df9-fd88e4de2011 (bridge-confirmed gpt-6.1-sol/high).

## Acceptance Criteria
1. Before implementation, classify inventory topics as runnable or not applicable with a concrete pedagogical or technical reason; an unavailable tool is a blocker/limitation, not an automatic not-applicable classification.
2. Every runnable item supplies separate exercise and answer/reference implementation artifacts, exact executable/argument array, dependency versions/environment, deterministic inputs and predeclared expected outputs, assertions or numeric tolerances.
3. Execute every planned runnable item on the reviewed artifact revision and preserve observed output, command, environment/version, time, hashes/revision and check/evidence IDs. State expected behavior separately from observed results.
4. Document relevant boundary/failure cases and how to interpret outputs; preserve user-authored solution files. Failed/unexecuted practice remains explicitly unresolved and prevents an unqualified runnable-success claim.

## Verification Method
VP05 / unit numerical checks and document-to-practice integration: check executor runs frozen commands against reviewed oracles; verifier inspects output and all topic dispositions. This is proposed coverage, not current execution evidence.
Verification is planned; no PDF-content verification, execution, independent review or acceptance is claimed by this contribution.

## Assumptions and Constraints
All source edition/headings/page counts/locators and inventory counts remain unverified until direct local PDF inspection. Approved project_read retrieves bounded text only and rejected 00_Intro.pdf with 'project_read accepts text files up to 2 MiB.' Manager must assign authorized PDF extraction/rendering and source inspection before implementation. No external provider is applicable to this requirements refinement; no empty capability_resolve. English outputs; no Trellis/manager_run; only requirement records are authored in this assignment. Owner decisions and exceptions remain with manager. Existing original scope remains binding.
