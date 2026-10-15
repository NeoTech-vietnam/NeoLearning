---
schema_version: 1
id: VT-FB18E4DC-REQ-0007
type: requirement
title: Substantive linked Cornell study material inside assigned learning directory
owner: requirements
status: draft
revision: 2
created_at: 2026-10-12T08:25:04.137Z
updated_at: 2026-10-12T15:39:18.564Z
links:
  - type: derives-from
    target: VT-FB18E4DC-REQ-0001
data:
  intake_workflow_id: VT-FB18E4DC-KNW-0001
  acceptance_criteria:
    - Keep all new learning deliverables within
      07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/
      and approved descendants. Provide a substantive index linking the reading
      map, complete coverage ledger, Cornell notes, exercise prompts, separate
      answers and applicable runnable practice.
    - Every inventoried technical topic has a reachable substantive Cornell
      explanation containing cues/questions, source-cited main notes, summary,
      demonstration with expected result, assumptions/constraints and failure
      cases, and links to practice/answers or justified non-applicability. No
      blank template or heading-only note counts as coverage.
    - Notes connect formulas to concrete examples and explained diagrams where
      useful; classify assertions as observed, source-reported, inferred or
      expected. Record source locators, actual retrieval dates and source
      identities; never label planned inspection as observed.
    - "Resolve all local links and assets from the delivered index. Intended-use
      validation: an independent reviewer follows the index for every technical
      topic, navigates an actual source passage, reconstructs a representative
      example and reaches the prompt and separate answer/practice without
      needing historical notes or chat."
  source: VT-FB18E4DC-REQ-0001
  verification_method: "VP06 / document integration and intended-use validation:
    structural link/Cornell validation plus independent study walkthrough on
    actual artifacts. Structural validation alone cannot satisfy the
    walkthrough."
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
Deliver a coherent English study guide under the assigned 01_learning directory linking source navigation, explanations and practice.

## Rationale and Source
The intended outcome is usable learning documentation, not a bare coverage spreadsheet.
Derived from VT-FB18E4DC-REQ-0001 revision 1, original stakeholder request and current resume steering. Workflow VT-FB18E4DC-KNW-0001. Authored by signed requirements invocation 2956cea0-f83a-48ad-9df9-fd88e4de2011 (bridge-confirmed gpt-6.1-sol/high).

## Acceptance Criteria
1. Keep all new learning deliverables within 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/ and approved descendants. Provide a substantive index linking the reading map, complete coverage ledger, Cornell notes, exercise prompts, separate answers and applicable runnable practice.
2. Every inventoried technical topic has a reachable substantive Cornell explanation containing cues/questions, source-cited main notes, summary, demonstration with expected result, assumptions/constraints and failure cases, and links to practice/answers or justified non-applicability. No blank template or heading-only note counts as coverage.
3. Notes connect formulas to concrete examples and explained diagrams where useful; classify assertions as observed, source-reported, inferred or expected. Record source locators, actual retrieval dates and source identities; never label planned inspection as observed.
4. Resolve all local links and assets from the delivered index. Intended-use validation: an independent reviewer follows the index for every technical topic, navigates an actual source passage, reconstructs a representative example and reaches the prompt and separate answer/practice without needing historical notes or chat.

## Verification Method
VP06 / document integration and intended-use validation: structural link/Cornell validation plus independent study walkthrough on actual artifacts. Structural validation alone cannot satisfy the walkthrough.
Verification is planned; no PDF-content verification, execution, independent review or acceptance is claimed by this contribution.

## Assumptions and Constraints
All source edition/headings/page counts/locators and inventory counts remain unverified until direct local PDF inspection. Approved project_read retrieves bounded text only and rejected 00_Intro.pdf with 'project_read accepts text files up to 2 MiB.' Manager must assign authorized PDF extraction/rendering and source inspection before implementation. No external provider is applicable to this requirements refinement; no empty capability_resolve. English outputs; no Trellis/manager_run; only requirement records are authored in this assignment. Owner decisions and exceptions remain with manager. Existing original scope remains binding.
