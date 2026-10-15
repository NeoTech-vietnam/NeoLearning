---
schema_version: 1
id: VT-FB18E4DC-REQ-0002
type: requirement
title: Locally verified textbook navigation for introductory DSP topics
owner: requirements
status: draft
revision: 2
created_at: 2026-10-12T08:24:50.706Z
updated_at: 2026-10-12T15:37:46.662Z
links:
  - type: derives-from
    target: VT-FB18E4DC-REQ-0001
data:
  intake_workflow_id: VT-FB18E4DC-KNW-0001
  acceptance_criteria:
    - Record canonical local source path, SHA-256, PDF page count, author/title
      and exact edition using inspected title/copyright pages; edition remains
      unverified until those pages are inspected.
    - Every recommended book entry contains the section number when present,
      exact printed heading, inclusive printed page range with its actual
      labels, inclusive 1-based PDF page range, topic association, and usable
      source navigation. Verify both range endpoints directly; do not assume a
      constant page offset.
    - For each introductory topic, record either verified relevant book coverage
      or an explicit gap with the searched local contents/index/sections and a
      cited relevant alternative local or primary source. Mark unprinted pages
      as unnumbered and Roman-numbered pages faithfully; never fabricate a
      printed number.
    - Retain extraction and necessary page-image inspection evidence supporting
      edition, headings, page labels and selected passages; historical notes are
      candidates only.
  source: VT-FB18E4DC-REQ-0001
  verification_method: "VP01 / system document inspection: independent reviewer
    opens title/copyright pages and both endpoints of every mapping using frozen
    local PDF hashes; compare exact headings/labels and topic relevance.
    Denominator is the VP02 topic inventory; require 100% topic dispositions and
    zero unsupported mappings."
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
Provide a reading map from every technical topic identified in the complete 00_Intro source inventory to locally inspected book sections or an explicitly justified alternative.

## Rationale and Source
The user needs real passages to read directly in the actual local edition.
Derived from VT-FB18E4DC-REQ-0001 revision 1, original stakeholder request and current resume steering. Workflow VT-FB18E4DC-KNW-0001. Authored by signed requirements invocation 2956cea0-f83a-48ad-9df9-fd88e4de2011 (bridge-confirmed gpt-6.1-sol/high).

## Acceptance Criteria
1. Record canonical local source path, SHA-256, PDF page count, author/title and exact edition using inspected title/copyright pages; edition remains unverified until those pages are inspected.
2. Every recommended book entry contains the section number when present, exact printed heading, inclusive printed page range with its actual labels, inclusive 1-based PDF page range, topic association, and usable source navigation. Verify both range endpoints directly; do not assume a constant page offset.
3. For each introductory topic, record either verified relevant book coverage or an explicit gap with the searched local contents/index/sections and a cited relevant alternative local or primary source. Mark unprinted pages as unnumbered and Roman-numbered pages faithfully; never fabricate a printed number.
4. Retain extraction and necessary page-image inspection evidence supporting edition, headings, page labels and selected passages; historical notes are candidates only.

## Verification Method
VP01 / system document inspection: independent reviewer opens title/copyright pages and both endpoints of every mapping using frozen local PDF hashes; compare exact headings/labels and topic relevance. Denominator is the VP02 topic inventory; require 100% topic dispositions and zero unsupported mappings.
Verification is planned; no PDF-content verification, execution, independent review or acceptance is claimed by this contribution.

## Assumptions and Constraints
All source edition/headings/page counts/locators and inventory counts remain unverified until direct local PDF inspection. Approved project_read retrieves bounded text only and rejected 00_Intro.pdf with 'project_read accepts text files up to 2 MiB.' Manager must assign authorized PDF extraction/rendering and source inspection before implementation. No external provider is applicable to this requirements refinement; no empty capability_resolve. English outputs; no Trellis/manager_run; only requirement records are authored in this assignment. Owner decisions and exceptions remain with manager. Existing original scope remains binding.
