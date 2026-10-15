---
schema_version: 1
id: VT-FB18E4DC-REQ-0005
type: requirement
title: Provenance-separated exercise bank and answers
owner: requirements
status: draft
revision: 2
created_at: 2026-10-12T08:24:59.034Z
updated_at: 2026-10-12T15:38:48.624Z
links:
  - type: derives-from
    target: VT-FB18E4DC-REQ-0001
data:
  intake_workflow_id: VT-FB18E4DC-KNW-0001
  acceptance_criteria:
    - Collect 100% of exercises/questions and worked-example prompts identified
      by VP02 with stable IDs and source PDF page/item locators. Keep supplied
      exercises recognizable; explain any paraphrase.
    - Add at least two distinct relevant exercises from inspected
      official/primary sources, covering at least two introductory technical
      topics when the lecture contains two or more. Record title,
      author/institution, canonical URL or local path, section/problem/page
      locator, actual retrieval timestamp and content identity where available.
      Search results alone do not verify an exercise.
    - Label supplied/source-original exercises, additional externally sourced
      exercises, and any optional newly authored adaptations as distinct
      categories. Do not imply optional authored problems are quotations or
      require newly authored exercises as an expansion of scope.
    - Each exercise has a separate linked answer artifact with method,
      assumptions, intermediate steps and expected result; prompts do not reveal
      answers. Existing user solution files/content are preserved and linked
      separately where present.
    - Map practice to technical topics; justify non-practicable items
      explicitly. Prefer links and limited compliant excerpts/paraphrases rather
      than copying complete copyrighted exercise collections.
  source: VT-FB18E4DC-REQ-0001
  verification_method: "VP04 / system provenance and answer inspection: compare
    supplied prompt IDs with VP02, inspect every additional primary-source
    locator, classify all exercises, recompute every answer and verify
    exercise/answer/solution separation and preservation."
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
Deliver an exercise bank with separate answers that preserves supplied exercises and adds relevant primary-source practice.

## Rationale and Source
The user asked for existing exercises and more practice, with reliable provenance and independent answers.
Derived from VT-FB18E4DC-REQ-0001 revision 1, original stakeholder request and current resume steering. Workflow VT-FB18E4DC-KNW-0001. Authored by signed requirements invocation 2956cea0-f83a-48ad-9df9-fd88e4de2011 (bridge-confirmed gpt-6.1-sol/high).

## Acceptance Criteria
1. Collect 100% of exercises/questions and worked-example prompts identified by VP02 with stable IDs and source PDF page/item locators. Keep supplied exercises recognizable; explain any paraphrase.
2. Add at least two distinct relevant exercises from inspected official/primary sources, covering at least two introductory technical topics when the lecture contains two or more. Record title, author/institution, canonical URL or local path, section/problem/page locator, actual retrieval timestamp and content identity where available. Search results alone do not verify an exercise.
3. Label supplied/source-original exercises, additional externally sourced exercises, and any optional newly authored adaptations as distinct categories. Do not imply optional authored problems are quotations or require newly authored exercises as an expansion of scope.
4. Each exercise has a separate linked answer artifact with method, assumptions, intermediate steps and expected result; prompts do not reveal answers. Existing user solution files/content are preserved and linked separately where present.
5. Map practice to technical topics; justify non-practicable items explicitly. Prefer links and limited compliant excerpts/paraphrases rather than copying complete copyrighted exercise collections.

## Verification Method
VP04 / system provenance and answer inspection: compare supplied prompt IDs with VP02, inspect every additional primary-source locator, classify all exercises, recompute every answer and verify exercise/answer/solution separation and preservation.
Verification is planned; no PDF-content verification, execution, independent review or acceptance is claimed by this contribution.

## Assumptions and Constraints
All source edition/headings/page counts/locators and inventory counts remain unverified until direct local PDF inspection. Approved project_read retrieves bounded text only and rejected 00_Intro.pdf with 'project_read accepts text files up to 2 MiB.' Manager must assign authorized PDF extraction/rendering and source inspection before implementation. No external provider is applicable to this requirements refinement; no empty capability_resolve. English outputs; no Trellis/manager_run; only requirement records are authored in this assignment. Owner decisions and exceptions remain with manager. Existing original scope remains binding.
