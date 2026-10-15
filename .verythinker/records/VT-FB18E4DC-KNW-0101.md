---
schema_version: 1
id: VT-FB18E4DC-KNW-0101
type: knowledge
title: "Discussion: manager"
owner: manager
status: draft
revision: 1
created_at: 2026-10-13T03:30:52.223Z
updated_at: 2026-10-13T03:30:52.223Z
links:
  - type: documents
    target: VT-FB18E4DC-KNW-0001
  - type: references
    target: VT-FB18E4DC-CHK-0012
  - type: references
    target: VT-FB18E4DC-REQ-0010
  - type: references
    target: VT-FB18E4DC-KNW-0099
  - type: references
    target: VT-FB18E4DC-EVD-0002
  - type: references
    target: VT-FB18E4DC-REV-0081
data:
  kind: manager-discussion
  workflow_id: VT-FB18E4DC-KNW-0001
  invocation_id: e08f0fad-2078-4d57-bedc-ffea8ce4fda1
  round: 2
  source_baseline:
    VT-FB18E4DC-CHK-0012: 5f66014de3379a4eecb245374f1e0da81ba5b7bb8b6175b77a6ec6b2a2d6bbce
    VT-FB18E4DC-REQ-0010: 89a0bdc57a1165e60aeb24500c39084b7ee945dadc446d6f575bf7fb68506d5f
    VT-FB18E4DC-KNW-0099: 92d08b395d1d540d438b8f6f3a115b1474c2a2a90344cf84151e5c96f4544e45
    VT-FB18E4DC-EVD-0002: 675511fc70192d1ea32303ace9cb878eb245dfd39c663a1d200dab22bdce4dce
    VT-FB18E4DC-REV-0081: 704897041e368bccd94b2bbc98d9320c0cc6e54c13b3ac538dd97e6993060c5e
  summary: Produced CHK-0012 revision 6 after the submitted rev5 run failed
    because broad site.getsitepackages() roots included standard-library
    Lib/DLLs. New code validates canonical site-packages/dist-packages roots
    from site/sysconfig, fails on no roots, and preserves exact file
    ownership/version mapping and BOOT oracles.
  rationale: This corrects the observed false-positive scope without weakening
    requirements or expected values. Revision 6 remains not-run and needs a
    current independent review plus fresh bootstrap execution; TASK-0002 remains
    historical/submitted against rev5.
  risks:
    - The corrected root discovery has not yet been executed in CORE.
    - TASK-0002's earlier evidence and work-record inconsistency remain open;
      any successor must capture fresh CHK-0013 evidence against existing
      provenance files.
  routing_required: true
---
# Contribution
Produced CHK-0012 revision 6 after the submitted rev5 run failed because broad site.getsitepackages() roots included standard-library Lib/DLLs. New code validates canonical site-packages/dist-packages roots from site/sysconfig, fails on no roots, and preserves exact file ownership/version mapping and BOOT oracles.

# Rationale
This corrects the observed false-positive scope without weakening requirements or expected values. Revision 6 remains not-run and needs a current independent review plus fresh bootstrap execution; TASK-0002 remains historical/submitted against rev5.

# Risks
The corrected root discovery has not yet been executed in CORE.
TASK-0002's earlier evidence and work-record inconsistency remain open; any successor must capture fresh CHK-0013 evidence against existing provenance files.

# Sources
VT-FB18E4DC-CHK-0012
VT-FB18E4DC-REQ-0010
VT-FB18E4DC-KNW-0099
VT-FB18E4DC-EVD-0002
VT-FB18E4DC-REV-0081
