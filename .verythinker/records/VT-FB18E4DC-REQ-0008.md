---
schema_version: 1
id: VT-FB18E4DC-REQ-0008
type: requirement
title: Preserve user deletions, solutions, sources and unrelated workspace state
owner: requirements
status: draft
revision: 2
created_at: 2026-10-12T08:25:06.774Z
updated_at: 2026-10-12T15:39:36.843Z
links:
  - type: derives-from
    target: VT-FB18E4DC-REQ-0001
data:
  intake_workflow_id: VT-FB18E4DC-KNW-0001
  acceptance_criteria:
    - Before any project-document edit, record current branch/revision and
      dirty/untracked/deleted path inventory, hashes of source PDFs and existing
      solutions, and explicit manager-approved new output paths. Intake
      observations are not a fresh working-tree baseline.
    - No source PDF changes, automatic restoration of deleted historical
      notes/templates/assets, overwritten existing solutions, unrelated
      config/submodule edits, or unrelated staged/committed/pushed changes
      occur.
    - If a desired new artifact collides with a deleted tracked path, document
      the collision and manager disposition before writing it; a fresh
      differently named artifact is preferred where it satisfies the need. Do
      not interpret a deletion as permission to restore prior bytes.
    - Compare final scope/diff and protected hashes with the pre-edit baseline;
      record authorized new files and verify protected state remains unchanged.
  source: VT-FB18E4DC-REQ-0001
  verification_method: "VP07 / configuration inspection: reviewer compares
    pre/post baseline, protected hashes, diff/status and path-collision
    dispositions; release owner scopes any archive/commit/publication
    separately."
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
Keep source PDFs, existing user-authored solutions, intentional deletions and unrelated state intact during delivery.

## Rationale and Source
The existing dirty workspace and user deletions are explicit preservation constraints.
Derived from VT-FB18E4DC-REQ-0001 revision 1, original stakeholder request and current resume steering. Workflow VT-FB18E4DC-KNW-0001. Authored by signed requirements invocation 2956cea0-f83a-48ad-9df9-fd88e4de2011 (bridge-confirmed gpt-6.1-sol/high).

## Acceptance Criteria
1. Before any project-document edit, record current branch/revision and dirty/untracked/deleted path inventory, hashes of source PDFs and existing solutions, and explicit manager-approved new output paths. Intake observations are not a fresh working-tree baseline.
2. No source PDF changes, automatic restoration of deleted historical notes/templates/assets, overwritten existing solutions, unrelated config/submodule edits, or unrelated staged/committed/pushed changes occur.
3. If a desired new artifact collides with a deleted tracked path, document the collision and manager disposition before writing it; a fresh differently named artifact is preferred where it satisfies the need. Do not interpret a deletion as permission to restore prior bytes.
4. Compare final scope/diff and protected hashes with the pre-edit baseline; record authorized new files and verify protected state remains unchanged.

## Verification Method
VP07 / configuration inspection: reviewer compares pre/post baseline, protected hashes, diff/status and path-collision dispositions; release owner scopes any archive/commit/publication separately.
Verification is planned; no PDF-content verification, execution, independent review or acceptance is claimed by this contribution.

## Assumptions and Constraints
All source edition/headings/page counts/locators and inventory counts remain unverified until direct local PDF inspection. Approved project_read retrieves bounded text only and rejected 00_Intro.pdf with 'project_read accepts text files up to 2 MiB.' Manager must assign authorized PDF extraction/rendering and source inspection before implementation. No external provider is applicable to this requirements refinement; no empty capability_resolve. English outputs; no Trellis/manager_run; only requirement records are authored in this assignment. Owner decisions and exceptions remain with manager. Existing original scope remains binding.
