---
schema_version: 1
id: VT-FB18E4DC-CHK-0002
type: check
title: Exact DSP reading edition, headings and dual page locator inspection
owner: verifier
status: draft
revision: 4
created_at: 2026-10-12T08:27:27.984Z
updated_at: 2026-10-12T17:09:15.855Z
links:
  - type: verifies
    target: VT-FB18E4DC-REQ-0001
  - type: references
    target: VT-FB18E4DC-CHK-0001
  - type: references
    target: VT-FB18E4DC-KNW-0002
  - type: verifies
    target: VT-FB18E4DC-REQ-0002
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  requirement_ids:
    - VT-FB18E4DC-REQ-0001
    - VT-FB18E4DC-REQ-0002
  invocation_id: b74cad1a-30d3-4c18-8304-0b4fd5841650
  definition_status: bounded-awaiting-source-inventory-and-independent-plan-review
  execution_status: not-run
  source_baseline:
    VT-FB18E4DC-REQ-0001:
      revision: 3
      fingerprint: 3910ed7d981d5434c94b104ad999ba322afd426430bf90983af15628f7ba7833
    VT-FB18E4DC-KNW-0002: 3d0cb3a3803c035acb47993d9052f503856ac988402af946cbc6ee402a295f04
    VT-FB18E4DC-REQ-0002:
      revision: 2
      fingerprint: ae9579bf290a21d4b900f9015f4e7b848584dda7b619c2005831479b71b74bc1
  verification_artifact_paths: []
  change_policy: Retain prior expectations, review and failure history. Any
    semantic oracle/rubric/script correction needs explicit reviewed change and
    fresh evidence; never loosen expectations to obtain a pass.
  evidence_requirements:
    - check ID and protected definition fingerprint
    - current requirement/design/deliverable/source hashes and revision
    - actual method, inspector/executor invocation, timestamp
    - environment and exact tool versions, raw logs/output and artifact hashes
    - item-by-item observations separated from expected values
    - limitations, failures and preserved history
    - archive evidence through authorized executor before independent final
      review
  no_pass_conditions:
    - source access absent
    - denominator or edition inferred rather than inspected
    - requirement refinement not reconciled
    - missing independent plan review
    - missing current evidence
    - only structural core validation or recovery receipt
  kind: inspection
  method: inspection
  verification_level: system
  inspection_items:
    - id: READ-01
      criterion: Edition and navigation identity
      expected: Confirm author, full title, edition, publisher/year from current
        title/copyright pages, not filename or search memory. Record observed
        printed page labels (including Roman/unnumbered labels) separately from
        1-based PDF indices; inspect mapping boundaries and do not assume a
        universal offset.
      inputs:
        - current book title/copyright/TOC renders and source hash
    - id: READ-02
      criterion: Exact assigned contents
      expected: Every assigned topic row cites exact section number and heading as
        found in the current book; specify printed page interval and 1-based PDF
        interval, inclusive endpoints, purpose/prerequisite/order, and actual
        start/end content page observations. TOC alone is insufficient proof of
        target contents.
      inputs:
        - reading map, current TOC and all assigned section endpoint/body pages
    - id: READ-03
      criterion: Mapping coverage and alternatives
      expected: Reconcile every 00_Intro topic with a verified book reading or
        explicitly stated not-covered/unverified status plus a genuinely
        inspected alternative primary/local source with locators. A claim of
        absence must identify inspected TOC/index/relevant sections; uninspected
        absence remains unverified. No fabricated section, inferred edition,
        empty row or whole-book substitute.
      inputs:
        - complete lecture topic inventory, inspected book scope, alternative
          sources
    - id: READ-04
      criterion: Reader navigation
      expected: A fresh reader can follow index -> topic -> source -> exact assigned
        page range and find the cited heading/content; check every reading row
        and source link. Broken/ambiguous navigation is a failure even if a
        structural locator field exists.
      inputs:
        - final index/reading map and current source reader
  oracle_rationale: Current title/copyright, TOC, index and actual section pages
    are independent of authored reading-map rows. Inspect every mapped range and
    endpoint, including pages with printed/PDF mapping discontinuities. No
    external edition can substitute for this local PDF.
  dependencies:
    - CHK-0001 current source baseline
    - complete lecture topic inventory
    - book title/copyright/TOC and target-page renders
    - requirements refinement
  author_invocation_id: b74cad1a-30d3-4c18-8304-0b4fd5841650
  invocation_role: verifier
  routing_required: true
  previous_definition:
    revision: 1
    fingerprint: 1f649a49762ba877e6728fd83632ae02e1be94f1aed52ffcfad89b653bc9491d
    body: >
      # Objective

      Exact DSP reading edition, headings and dual page locator inspection for
      REQ-0001. Definition authored by invocation
      d5d56ba9-4373-453d-bae5-c1c27ff413c0; bounded frozen rubric, not
      source-content evidence.


      # Protected inspection rubric

      ## READ-01

      Criterion: Edition and navigation identity

      Expected: Confirm author, full title, edition, publisher/year from current
      title/copyright pages, not filename or search memory. Record observed
      printed page labels (including Roman/unnumbered labels) separately from
      1-based PDF indices; inspect mapping boundaries and do not assume a
      universal offset.

      Referenced inputs: current book title/copyright/TOC renders and source
      hash


      ## READ-02

      Criterion: Exact assigned contents

      Expected: Every assigned topic row cites exact section number and heading
      as found in the current book; specify printed page interval and 1-based
      PDF interval, inclusive endpoints, purpose/prerequisite/order, and actual
      start/end content page observations. TOC alone is insufficient proof of
      target contents.

      Referenced inputs: reading map, current TOC and all assigned section
      endpoint/body pages


      ## READ-03

      Criterion: Mapping coverage and alternatives

      Expected: Reconcile every 00_Intro topic with a verified book reading or
      explicitly stated not-covered/unverified status plus a genuinely inspected
      alternative primary/local source with locators. A claim of absence must
      identify inspected TOC/index/relevant sections; uninspected absence
      remains unverified. No fabricated section, inferred edition, empty row or
      whole-book substitute.

      Referenced inputs: complete lecture topic inventory, inspected book scope,
      alternative sources


      ## READ-04

      Criterion: Reader navigation

      Expected: A fresh reader can follow index -> topic -> source -> exact
      assigned page range and find the cited heading/content; check every
      reading row and source link. Broken/ambiguous navigation is a failure even
      if a structural locator field exists.

      Referenced inputs: final index/reading map and current source reader


      # Independent oracle and method

      Current title/copyright, TOC, index and actual section pages are
      independent of authored reading-map rows. Inspect every mapped range and
      endpoint, including pages with printed/PDF mapping discontinuities. No
      external edition can substitute for this local PDF.

      Method: inspection; actual item-by-item observations must be recorded
      separately by authorized check_inspect. No executable result is claimed by
      this manual rubric.


      # Dependencies

      CHK-0001 current source baseline

      complete lecture topic inventory

      book title/copyright/TOC and target-page renders

      requirements refinement

      All observations NOT RUN. Final exact per-page/item/source locators await
      actual source inventory; no placeholder is a verified locator. Bind
      refined criterion IDs and source hashes by independently reviewed revision
      before execution. No verification script exists in this definition;
      verification_artifact_paths is empty intentionally.


      # Protected expectations and evidence

      Retain prior expectations, review and failure history. Any semantic
      oracle/rubric/script correction needs explicit reviewed change and fresh
      evidence; never loosen expectations to obtain a pass.

      Capture inspector invocation, current source/deliverable revision and
      hashes, timestamp/environment/tools, observations per unique item,
      failures and limitations, render references and archived logs. Require
      independent plan review and current final review; structural core verify
      or recovery receipt cannot pass this check.
    data:
      workflow_id: VT-FB18E4DC-KNW-0001
      requirement_ids:
        - VT-FB18E4DC-REQ-0001
      invocation_id: d5d56ba9-4373-453d-bae5-c1c27ff413c0
      definition_status: bounded-awaiting-source-inventory-and-independent-plan-review
      execution_status: not-run
      source_baseline:
        VT-FB18E4DC-REQ-0001: bbd07b4837f095b672c1caeeb9ac69b8e30dae5d0bd867338756fde5896c3b4d
        VT-FB18E4DC-KNW-0002: 3d0cb3a3803c035acb47993d9052f503856ac988402af946cbc6ee402a295f04
      verification_artifact_paths: []
      change_policy: Retain prior expectations, review and failure history. Any
        semantic oracle/rubric/script correction needs explicit reviewed change
        and fresh evidence; never loosen expectations to obtain a pass.
      evidence_requirements:
        - check ID and protected definition fingerprint
        - current requirement/design/deliverable/source hashes and revision
        - actual method, inspector/executor invocation, timestamp
        - environment and exact tool versions, raw logs/output and artifact
          hashes
        - item-by-item observations separated from expected values
        - limitations, failures and preserved history
        - archive evidence through authorized executor before independent final
          review
      no_pass_conditions:
        - source access absent
        - denominator or edition inferred rather than inspected
        - requirement refinement not reconciled
        - missing independent plan review
        - missing current evidence
        - only structural core validation or recovery receipt
      kind: inspection
      method: inspection
      verification_level: system
      inspection_items:
        - id: READ-01
          criterion: Edition and navigation identity
          expected: Confirm author, full title, edition, publisher/year from current
            title/copyright pages, not filename or search memory. Record
            observed printed page labels (including Roman/unnumbered labels)
            separately from 1-based PDF indices; inspect mapping boundaries and
            do not assume a universal offset.
          inputs:
            - current book title/copyright/TOC renders and source hash
        - id: READ-02
          criterion: Exact assigned contents
          expected: Every assigned topic row cites exact section number and heading as
            found in the current book; specify printed page interval and 1-based
            PDF interval, inclusive endpoints, purpose/prerequisite/order, and
            actual start/end content page observations. TOC alone is
            insufficient proof of target contents.
          inputs:
            - reading map, current TOC and all assigned section endpoint/body
              pages
        - id: READ-03
          criterion: Mapping coverage and alternatives
          expected: Reconcile every 00_Intro topic with a verified book reading or
            explicitly stated not-covered/unverified status plus a genuinely
            inspected alternative primary/local source with locators. A claim of
            absence must identify inspected TOC/index/relevant sections;
            uninspected absence remains unverified. No fabricated section,
            inferred edition, empty row or whole-book substitute.
          inputs:
            - complete lecture topic inventory, inspected book scope,
              alternative sources
        - id: READ-04
          criterion: Reader navigation
          expected: A fresh reader can follow index -> topic -> source -> exact assigned
            page range and find the cited heading/content; check every reading
            row and source link. Broken/ambiguous navigation is a failure even
            if a structural locator field exists.
          inputs:
            - final index/reading map and current source reader
      oracle_rationale: Current title/copyright, TOC, index and actual section pages
        are independent of authored reading-map rows. Inspect every mapped range
        and endpoint, including pages with printed/PDF mapping discontinuities.
        No external edition can substitute for this local PDF.
      dependencies:
        - CHK-0001 current source baseline
        - complete lecture topic inventory
        - book title/copyright/TOC and target-page renders
        - requirements refinement
      author_invocation_id: d5d56ba9-4373-453d-bae5-c1c27ff413c0
      invocation_role: verifier
      routing_required: true
  refinement_reason: Mapped current detailed criteria VT-FB18E4DC-REQ-0002 to this
    check after reading every refined requirement. Parent REQ-0001 revision 2
    supersedes empty acceptance criteria; no executed evidence/pass exists.
    Preserve initial definition in data.previous_definition. Source-dependent
    bounds are unchanged.
---
# Objective
Exact DSP reading edition, headings and dual page locator inspection for REQ-0001. Definition authored by invocation d5d56ba9-4373-453d-bae5-c1c27ff413c0; bounded frozen rubric, not source-content evidence.

# Protected inspection rubric
## READ-01
Criterion: Edition and navigation identity
Expected: Confirm author, full title, edition, publisher/year from current title/copyright pages, not filename or search memory. Record observed printed page labels (including Roman/unnumbered labels) separately from 1-based PDF indices; inspect mapping boundaries and do not assume a universal offset.
Referenced inputs: current book title/copyright/TOC renders and source hash

## READ-02
Criterion: Exact assigned contents
Expected: Every assigned topic row cites exact section number and heading as found in the current book; specify printed page interval and 1-based PDF interval, inclusive endpoints, purpose/prerequisite/order, and actual start/end content page observations. TOC alone is insufficient proof of target contents.
Referenced inputs: reading map, current TOC and all assigned section endpoint/body pages

## READ-03
Criterion: Mapping coverage and alternatives
Expected: Reconcile every 00_Intro topic with a verified book reading or explicitly stated not-covered/unverified status plus a genuinely inspected alternative primary/local source with locators. A claim of absence must identify inspected TOC/index/relevant sections; uninspected absence remains unverified. No fabricated section, inferred edition, empty row or whole-book substitute.
Referenced inputs: complete lecture topic inventory, inspected book scope, alternative sources

## READ-04
Criterion: Reader navigation
Expected: A fresh reader can follow index -> topic -> source -> exact assigned page range and find the cited heading/content; check every reading row and source link. Broken/ambiguous navigation is a failure even if a structural locator field exists.
Referenced inputs: final index/reading map and current source reader

# Independent oracle and method
Current title/copyright, TOC, index and actual section pages are independent of authored reading-map rows. Inspect every mapped range and endpoint, including pages with printed/PDF mapping discontinuities. No external edition can substitute for this local PDF.
Method: inspection; actual item-by-item observations must be recorded separately by authorized check_inspect. No executable result is claimed by this manual rubric.

# Dependencies
CHK-0001 current source baseline
complete lecture topic inventory
book title/copyright/TOC and target-page renders
requirements refinement
All observations NOT RUN. Final exact per-page/item/source locators await actual source inventory; no placeholder is a verified locator. Bind refined criterion IDs and source hashes by independently reviewed revision before execution. No verification script exists in this definition; verification_artifact_paths is empty intentionally.

# Protected expectations and evidence
Retain prior expectations, review and failure history. Any semantic oracle/rubric/script correction needs explicit reviewed change and fresh evidence; never loosen expectations to obtain a pass.
Capture inspector invocation, current source/deliverable revision and hashes, timestamp/environment/tools, observations per unique item, failures and limitations, render references and archived logs. Require independent plan review and current final review; structural core verify or recovery receipt cannot pass this check.


# Pre-review requirements reconciliation
Mapped current detailed criteria VT-FB18E4DC-REQ-0002 to this check after reading every refined requirement. Parent REQ-0001 revision 2 supersedes empty acceptance criteria; no executed evidence/pass exists. Preserve initial definition in data.previous_definition. Source-dependent bounds are unchanged.

# Current complete rubric (supersedes provisional wording where clarified)
READ-01: Edition and navigation identity
Expected: Confirm author, full title, edition, publisher/year from current title/copyright pages, not filename or search memory. Record observed printed page labels (including Roman/unnumbered labels) separately from 1-based PDF indices; inspect mapping boundaries and do not assume a universal offset.
Inputs: current book title/copyright/TOC renders and source hash

READ-02: Exact assigned contents
Expected: Every assigned topic row cites exact section number and heading as found in the current book; specify printed page interval and 1-based PDF interval, inclusive endpoints, purpose/prerequisite/order, and actual start/end content page observations. TOC alone is insufficient proof of target contents.
Inputs: reading map, current TOC and all assigned section endpoint/body pages

READ-03: Mapping coverage and alternatives
Expected: Reconcile every 00_Intro topic with a verified book reading or explicitly stated not-covered/unverified status plus a genuinely inspected alternative primary/local source with locators. A claim of absence must identify inspected TOC/index/relevant sections; uninspected absence remains unverified. No fabricated section, inferred edition, empty row or whole-book substitute.
Inputs: complete lecture topic inventory, inspected book scope, alternative sources

READ-04: Reader navigation
Expected: A fresh reader can follow index -> topic -> source -> exact assigned page range and find the cited heading/content; check every reading row and source link. Broken/ambiguous navigation is a failure even if a structural locator field exists.
Inputs: final index/reading map and current source reader
