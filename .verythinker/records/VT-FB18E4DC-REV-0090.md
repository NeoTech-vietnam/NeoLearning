---
schema_version: 1
id: VT-FB18E4DC-REV-0090
type: review
title: "Review: DSP bootstrap fresh read-only
  workspace/source/solution/collision before-after snapshot"
owner: reviewer
status: reviewed
revision: 1
created_at: 2026-10-14T01:23:27.067Z
updated_at: 2026-10-14T01:23:27.067Z
links:
  - type: reviews
    target: VT-FB18E4DC-CHK-0013
data:
  decision: fail
  findings:
    - "Location: VT-FB18E4DC-CHK-0013 `data.command[3]`, construction of
      `root`/`base`/`scopes` and `file_tree(directory)`'s `linked(directory)`
      guard. Severity: medium. Affected criteria: REQ-0010 BOOT-05 and BOOT-06,
      plus the check body promise of no out-of-scope traversal. The script
      checks only the final scope directory and descendants; it does not
      validate `root`, the DSP `base`, or intermediate ancestors. If one is a
      junction/symlink/reparse point, `Path.exists` and `os.walk` follow it and
      report external files under lexical NeoLearning paths, so the purported
      scoped source/workspace baseline can be false. Disposition: open; verifier
      should add fail-closed ancestor/containment checks in a legitimate new
      revision and obtain fresh review before execution."
    - 'Location: VT-FB18E4DC-CHK-0013 `data.command[3]`, `records = root /
      ".verythinker/records"` and `if records.is_dir() and not
      linked(records):`, before `core_record_changes`/`result["ok"]`. Severity:
      medium. Affected criterion: REQ-0010 BOOT-05. If the CORE record directory
      is absent, inaccessible, or itself linked, the script silently leaves
      `core_record_files` empty, records no error, and can still set `ok=true`;
      it therefore can omit the required CORE record/evidence change ledger
      while reporting success. Fail closed when the required ledger cannot be
      captured, and validate its path ancestors before hashing.'
  target_fingerprint: 0caf930d33085b16c78fee5c7b3498afb9d233b6cc6cb932e9f1dd8e52fd5ada
  baseline_hash: bfaed55d7bd7900edf7bb262c0e4d998fca1d977a626f53bd77ec0ebafc5d1b6
  review_baseline_version: 2
  invocation_id: 28ee752b-05be-4f02-8011-246438780297
  generalization_review: false
  routing_required: true
---
# Scope
VT-FB18E4DC-CHK-0013

# Decision
fail

# Findings
Location: VT-FB18E4DC-CHK-0013 `data.command[3]`, construction of `root`/`base`/`scopes` and `file_tree(directory)`'s `linked(directory)` guard. Severity: medium. Affected criteria: REQ-0010 BOOT-05 and BOOT-06, plus the check body promise of no out-of-scope traversal. The script checks only the final scope directory and descendants; it does not validate `root`, the DSP `base`, or intermediate ancestors. If one is a junction/symlink/reparse point, `Path.exists` and `os.walk` follow it and report external files under lexical NeoLearning paths, so the purported scoped source/workspace baseline can be false. Disposition: open; verifier should add fail-closed ancestor/containment checks in a legitimate new revision and obtain fresh review before execution.
Location: VT-FB18E4DC-CHK-0013 `data.command[3]`, `records = root / ".verythinker/records"` and `if records.is_dir() and not linked(records):`, before `core_record_changes`/`result["ok"]`. Severity: medium. Affected criterion: REQ-0010 BOOT-05. If the CORE record directory is absent, inaccessible, or itself linked, the script silently leaves `core_record_files` empty, records no error, and can still set `ok=true`; it therefore can omit the required CORE record/evidence change ledger while reporting success. Fail closed when the required ledger cannot be captured, and validate its path ancestors before hashing.
