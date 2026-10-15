---
schema_version: 1
id: VT-FB18E4DC-REV-0092
type: review
title: "Review: Run the reviewed DSP bootstrap on a task-local preserved baseline"
owner: reviewer
status: reviewed
revision: 1
created_at: 2026-10-14T05:56:48.349Z
updated_at: 2026-10-14T05:56:48.349Z
links:
  - type: reviews
    target: VT-FB18E4DC-TASK-0004
data:
  decision: fail
  findings:
    - "Location: REQ-0010 BOOT-01; EVD-0004/0005/0006 archived receipts and
      EVD-0005 output. Severity: medium. The required actual execution working
      directory is not recorded. The check definition's configured
      working_directory/cwd value is D:/workspace/NeoLearning, but the receipts
      contain no cwd/working_directory field and EVD-0005's environment contains
      only OS and Node version. A configured directory is not an observation.
      Disposition status: open; check-executor/manager to provide current
      reviewable execution evidence with the actual cwd."
    - "Location: REQ-0010 BOOT-05/06; CHK-0013 revision 7 full-operation
      requirement; EVD-0004/0006 output logs; KNW-0143/0145/0146. Severity:
      medium. CHK-0013 requires comparing the first run's before snapshot with
      the last run's after snapshot across protected
      scope/status/index/Examples/collisions and independently attributing CORE
      record/evidence changes. KNW-0143 reports per-invocation comparisons and
      accumulating CORE records, while KNW-0145 and KNW-0146 state the
      full-sequence comparison/attribution is not evidenced. The EVD-0004 and
      EVD-0006 logs could not be inspected through project_read because each
      exceeds its 2 MiB limit. Per-run pass/exit 0 results and plan reviews do
      not establish the required sequence-level comparison. Disposition status:
      open; check-executor/manager to provide reviewable full-sequence
      comparison and CORE attribution evidence."
    - "Location: EVD-0004/0005/0006 record_baseline and current task gate for
      VT-FB18E4DC-TASK-0004. Severity: medium. All three archived evidence
      records pin TASK-0004 revision 8 fingerprint
      f5aa9378c074a2dbfae7a82ee5e68cf937f176f5f0a61fe553df9aade3a5270d, while
      the reviewed current task is revision 10 fingerprint
      143d3854c3ba57dcc00b5794b09c48cb58df5dac995047b6834c2e5e8535fc24. The
      current accepted gate reports CHK-0012 and CHK-0013 as requiring
      reassessment against TASK-0004, so the evidence is not currently validated
      for this task revision. Disposition status: open; manager/check-executor
      to resolve through the supported reassessment path."
  target_fingerprint: 143d3854c3ba57dcc00b5794b09c48cb58df5dac995047b6834c2e5e8535fc24
  baseline_hash: 9a0d9acd90df91359c7857e84b6906df396f76b70565f7cad71e6be5d5a26c90
  review_baseline_version: 2
  invocation_id: 6e81a004-cb95-4e66-b543-da5dd8edee3c
  generalization_review: false
  routing_required: true
---
# Scope
VT-FB18E4DC-TASK-0004

# Decision
fail

# Findings
Location: REQ-0010 BOOT-01; EVD-0004/0005/0006 archived receipts and EVD-0005 output. Severity: medium. The required actual execution working directory is not recorded. The check definition's configured working_directory/cwd value is D:/workspace/NeoLearning, but the receipts contain no cwd/working_directory field and EVD-0005's environment contains only OS and Node version. A configured directory is not an observation. Disposition status: open; check-executor/manager to provide current reviewable execution evidence with the actual cwd.
Location: REQ-0010 BOOT-05/06; CHK-0013 revision 7 full-operation requirement; EVD-0004/0006 output logs; KNW-0143/0145/0146. Severity: medium. CHK-0013 requires comparing the first run's before snapshot with the last run's after snapshot across protected scope/status/index/Examples/collisions and independently attributing CORE record/evidence changes. KNW-0143 reports per-invocation comparisons and accumulating CORE records, while KNW-0145 and KNW-0146 state the full-sequence comparison/attribution is not evidenced. The EVD-0004 and EVD-0006 logs could not be inspected through project_read because each exceeds its 2 MiB limit. Per-run pass/exit 0 results and plan reviews do not establish the required sequence-level comparison. Disposition status: open; check-executor/manager to provide reviewable full-sequence comparison and CORE attribution evidence.
Location: EVD-0004/0005/0006 record_baseline and current task gate for VT-FB18E4DC-TASK-0004. Severity: medium. All three archived evidence records pin TASK-0004 revision 8 fingerprint f5aa9378c074a2dbfae7a82ee5e68cf937f176f5f0a61fe553df9aade3a5270d, while the reviewed current task is revision 10 fingerprint 143d3854c3ba57dcc00b5794b09c48cb58df5dac995047b6834c2e5e8535fc24. The current accepted gate reports CHK-0012 and CHK-0013 as requiring reassessment against TASK-0004, so the evidence is not currently validated for this task revision. Disposition status: open; manager/check-executor to resolve through the supported reassessment path.
