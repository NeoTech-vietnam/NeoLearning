---
schema_version: 1
id: VT-EF6E07ED-KNW-0015
type: knowledge
title: "Discussion: verifier"
owner: verifier
status: draft
revision: 1
created_at: 2026-10-11T22:42:38.819Z
updated_at: 2026-10-11T22:42:38.819Z
links:
  - type: documents
    target: VT-EF6E07ED-KNW-0014
  - type: references
    target: VT-EF6E07ED-REQ-0003
data:
  kind: manager-discussion
  workflow_id: VT-EF6E07ED-KNW-0014
  invocation_id: b5c8a338-0129-487b-9b2d-789ec7bd786a
  round: 1
  source_baseline:
    VT-EF6E07ED-REQ-0003: e039f36c96a276dd24574ecd67dd1e864a0a25b6dcd5344b4e048738c8557529
  summary: "Verifier planning active. Require authoritative folder inventory and
    neighbor paths through saved records: project_read accepts files only.
    Proposed check suite: strict C/C++ local builds; independent address-order
    runtime oracle; no-LOCAL_TEST judge wrapper build with host ListNode; note
    semantic rubric plus structural/demo/practice checks; immutable preservation
    manifest."
  rationale: No C/C++ recipe applies. Need exact source filenames, strategy method
    signatures/counts, local test output contract and available compiler paths
    before freezing directly executable check_run commands. Requirements/design
    currently draft/absent.
  risks:
    - Do not implement before check definitions and protected runner artifacts
      are independently reviewed.
    - Please provide directory inventory, preexisting byte/hash baseline and
      check schema/API source pointers; verifier will author check definitions
      only, with no source edits or execution.
  routing_required: true
---
# Contribution
Verifier planning active. Require authoritative folder inventory and neighbor paths through saved records: project_read accepts files only. Proposed check suite: strict C/C++ local builds; independent address-order runtime oracle; no-LOCAL_TEST judge wrapper build with host ListNode; note semantic rubric plus structural/demo/practice checks; immutable preservation manifest.

# Rationale
No C/C++ recipe applies. Need exact source filenames, strategy method signatures/counts, local test output contract and available compiler paths before freezing directly executable check_run commands. Requirements/design currently draft/absent.

# Risks
Do not implement before check definitions and protected runner artifacts are independently reviewed.
Please provide directory inventory, preexisting byte/hash baseline and check schema/API source pointers; verifier will author check definitions only, with no source edits or execution.

# Sources
VT-EF6E07ED-REQ-0003
