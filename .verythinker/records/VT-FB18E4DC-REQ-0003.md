---
schema_version: 1
id: VT-FB18E4DC-REQ-0003
type: requirement
title: Exhaustive introductory lecture coverage ledger
owner: requirements
status: draft
revision: 2
created_at: 2026-10-12T08:24:54.419Z
updated_at: 2026-10-12T15:38:06.415Z
links:
  - type: derives-from
    target: VT-FB18E4DC-REQ-0001
data:
  intake_workflow_id: VT-FB18E4DC-KNW-0001
  acceptance_criteria:
    - Freeze source hash and page count N after local inspection. Include every
      1-based PDF page 1..N exactly once in a page inventory, recording visible
      slide labels separately from PDF ordinals.
    - Assign stable item IDs and locators to every topic, worked or partially
      worked example, question/exercise, formula, table and explanatory diagram,
      including unlabeled, figure-only and multi-page items. A page may contain
      multiple items; capture their separate locations and relations.
    - Every substantive item links to its explanation, exercise/answer or
      demonstration as applicable. Title/admin/blank/repeated pages still have
      explicit disposition and reason; repetitions link to the first occurrence.
      No substantive example or diagram is disposed as administrative.
    - Compare extracted text against visual pages where formulas/figures/text
      are missing or ambiguous; visually audit all pages for unlabeled or
      diagram-dependent items. Require 100% page dispositions and 100%
      inventoried substantive-item dispositions with zero unexplained omissions.
  source: VT-FB18E4DC-REQ-0001
  verification_method: "VP02 / system manual source inspection: independent
    page-by-page comparison of the frozen PDF and ledger; reconcile N, unique
    page ordinals, item IDs and linked destinations. Automated row counts alone
    cannot establish exhaustive coverage."
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
Account for every page and every substantive item of the frozen local 00_Intro.pdf in an auditable coverage ledger.

## Rationale and Source
Named-example searches alone omit unlabeled teaching content.
Derived from VT-FB18E4DC-REQ-0001 revision 1, original stakeholder request and current resume steering. Workflow VT-FB18E4DC-KNW-0001. Authored by signed requirements invocation 2956cea0-f83a-48ad-9df9-fd88e4de2011 (bridge-confirmed gpt-6.1-sol/high).

## Acceptance Criteria
1. Freeze source hash and page count N after local inspection. Include every 1-based PDF page 1..N exactly once in a page inventory, recording visible slide labels separately from PDF ordinals.
2. Assign stable item IDs and locators to every topic, worked or partially worked example, question/exercise, formula, table and explanatory diagram, including unlabeled, figure-only and multi-page items. A page may contain multiple items; capture their separate locations and relations.
3. Every substantive item links to its explanation, exercise/answer or demonstration as applicable. Title/admin/blank/repeated pages still have explicit disposition and reason; repetitions link to the first occurrence. No substantive example or diagram is disposed as administrative.
4. Compare extracted text against visual pages where formulas/figures/text are missing or ambiguous; visually audit all pages for unlabeled or diagram-dependent items. Require 100% page dispositions and 100% inventoried substantive-item dispositions with zero unexplained omissions.

## Verification Method
VP02 / system manual source inspection: independent page-by-page comparison of the frozen PDF and ledger; reconcile N, unique page ordinals, item IDs and linked destinations. Automated row counts alone cannot establish exhaustive coverage.
Verification is planned; no PDF-content verification, execution, independent review or acceptance is claimed by this contribution.

## Assumptions and Constraints
All source edition/headings/page counts/locators and inventory counts remain unverified until direct local PDF inspection. Approved project_read retrieves bounded text only and rejected 00_Intro.pdf with 'project_read accepts text files up to 2 MiB.' Manager must assign authorized PDF extraction/rendering and source inspection before implementation. No external provider is applicable to this requirements refinement; no empty capability_resolve. English outputs; no Trellis/manager_run; only requirement records are authored in this assignment. Owner decisions and exceptions remain with manager. Existing original scope remains binding.
