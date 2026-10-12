---
schema_version: 1
id: VT-EF6E07ED-KNW-0026
type: knowledge
title: "Discussion: requirements"
owner: requirements
status: draft
revision: 1
created_at: 2026-10-11T22:49:35.989Z
updated_at: 2026-10-11T22:49:35.989Z
links:
  - type: documents
    target: VT-EF6E07ED-KNW-0014
  - type: references
    target: VT-EF6E07ED-REQ-0003
  - type: references
    target: VT-EF6E07ED-DES-0003
  - type: references
    target: VT-EF6E07ED-KNW-0021
data:
  kind: manager-discussion
  workflow_id: VT-EF6E07ED-KNW-0014
  invocation_id: 9141d0a8-f61d-435b-ba92-748287dcda58
  round: 3
  source_baseline:
    VT-EF6E07ED-REQ-0003: de5e70d37e3dc79f604b618b3ec5096755ba607e7da4431cd19acc94d3bc6318
    VT-EF6E07ED-DES-0003: 3f8adc308734159f346f5c92de6d8bfc071479334eca9a792632d80d805bb106
    VT-EF6E07ED-KNW-0021: a46d5a0f2deff9c09969e88fe043eafcc0c0b8edd74f7c1e4d3e363236787641
  summary: "REQ-0003 is now revision 2, fingerprint
    de5e70d37e3dc79f604b618b3ec5096755ba607e7da4431cd19acc94d3bc6318: preferred
    160, exactly three exercise files, seven measurable criteria,
    official-source/local-hash ledger, verification/validation allocations and
    preservation/absence prerequisites. Design DES-0003 rev1 still references
    rev1 fingerprint: manager must have architect/verifier rebase current
    design/checks and review before implementation."
  rationale: Actual readback confirms persisted English criteria. DES-0003 matches
    selected 160, APIs, optimal pointer-switching, three-file layout and
    ownership; its 0..8 topology coverage subsumes required official 0..5 cases.
    Requirement adopts null-head robustness extension, so 1438 official-only
    fixture design needs additional labelled one/both-null fixtures and updated
    expected counts before executable checks freeze. Current impact includes
    DES-0003, CHK-0003/0004 and draft TASK-0003 plus discussions. None has been
    accepted or executed by this role. Do not treat newly linked draft records
    as evidence of full absence or workspace preservation.
  risks:
    - Full target inventory and dirty-state manifest remain unobserved;
      canonical ENOENT evidence is insufficient to authorize duplicate-sensitive
      writes
    - Rebase design/check expected counts for explicit null extension; preserve
      prior expected baseline instead of adjusting after a failure
    - Independent oracle must compare identity and all union node links/values;
      source analysis still needed for transient mutation, allocation and
      asymptotic claims
    - Legacy requirement baselines are outside requirements invocation context;
      authorized manager owns preservation evidence
  routing_required: true
---
# Contribution
REQ-0003 is now revision 2, fingerprint de5e70d37e3dc79f604b618b3ec5096755ba607e7da4431cd19acc94d3bc6318: preferred 160, exactly three exercise files, seven measurable criteria, official-source/local-hash ledger, verification/validation allocations and preservation/absence prerequisites. Design DES-0003 rev1 still references rev1 fingerprint: manager must have architect/verifier rebase current design/checks and review before implementation.

# Rationale
Actual readback confirms persisted English criteria. DES-0003 matches selected 160, APIs, optimal pointer-switching, three-file layout and ownership; its 0..8 topology coverage subsumes required official 0..5 cases. Requirement adopts null-head robustness extension, so 1438 official-only fixture design needs additional labelled one/both-null fixtures and updated expected counts before executable checks freeze. Current impact includes DES-0003, CHK-0003/0004 and draft TASK-0003 plus discussions. None has been accepted or executed by this role. Do not treat newly linked draft records as evidence of full absence or workspace preservation.

# Risks
Full target inventory and dirty-state manifest remain unobserved; canonical ENOENT evidence is insufficient to authorize duplicate-sensitive writes
Rebase design/check expected counts for explicit null extension; preserve prior expected baseline instead of adjusting after a failure
Independent oracle must compare identity and all union node links/values; source analysis still needed for transient mutation, allocation and asymptotic claims
Legacy requirement baselines are outside requirements invocation context; authorized manager owns preservation evidence

# Sources
VT-EF6E07ED-REQ-0003
VT-EF6E07ED-DES-0003
VT-EF6E07ED-KNW-0021
