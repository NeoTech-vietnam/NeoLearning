---
schema_version: 1
id: VT-EF6E07ED-CHK-0010
type: check
title: LeetCode 160 Cornell structural validation
owner: verifier
status: draft
revision: 1
created_at: 2026-10-11T23:16:59.146Z
updated_at: 2026-10-11T23:16:59.146Z
links:
  - type: verifies
    target: VT-EF6E07ED-REQ-0003
  - type: verifies
    target: VT-EF6E07ED-TASK-0004
  - type: references
    target: VT-EF6E07ED-DES-0003
  - type: references
    target: VT-EF6E07ED-KNW-0024
data:
  workflow_id: VT-EF6E07ED-KNW-0014
  task_id: VT-EF6E07ED-TASK-0004
  requirement_ids:
    - VT-EF6E07ED-REQ-0003
  design_ids:
    - VT-EF6E07ED-DES-0003
  baseline:
    requirement:
      id: VT-EF6E07ED-REQ-0003
      revision: 2
      fingerprint: de5e70d37e3dc79f604b618b3ec5096755ba607e7da4431cd19acc94d3bc6318
    design:
      id: VT-EF6E07ED-DES-0003
      revision: 2
      fingerprint: 948711169f3c8241d2dd208a15c92be5e400f36169ef2fe6dd01ec2b44d91549
  method: automated-test
  cwd: .
  expected_exit: 0
  expected_exit_code: 0
  expected_stderr: ""
  timeout_ms: 30000
  verification_artifact_paths:
    - .agents/skills/leetcode-notes/scripts/validate_notes.py
  implementation_input_paths:
    - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c
    - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp
    - 02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_note.md
  prerequisites:
    - Independent Sol planning review of REQrev2/DESrev2 and frozen product
      checks
    - TASK-0003 actual task-bound preflight after capability review confirms
      full absence and immutable preservation baseline; definitions do not
      authorize writes
    - Separate authorized check-executor invocation and approved core check_run
  evidence_policy: Capture exact command/check fingerprints, actual
    stdout/stderr/status and UTC/native executor identity; current source byte
    hashes and working revision plus dirty baseline; OS/architecture,
    Node/compiler/Python versions as applicable. Runtime Node runner retains
    unique system-temp directory vt-lc160-<c|cpp>-<local|judge>-*, metadata.json
    (source hash, UTC, tool versions, actual argv/status/signal) and raw
    compiler/runtime stdout/stderr. Executor archives the metadata/logs and
    generated judge wrapper from the newly created temp directory under
    authorized core evidence, identifies its path in the report, and preserves
    failures. Runtime stdout comparison normalizes CRLF to LF only. No warnings
    suppressed. Missing tools/timeouts/diagnostics/mismatched counts fail. This
    invocation defines commands without execution; no expected result is
    observed evidence.
  no_execution_in_definition: true
  author_invocation_id: b7469ce2-96d8-440f-9e2b-e0e573da8390
  title: LeetCode 160 Cornell structural validation
  command:
    - node
    - -e
    - "const
      fs=require('node:fs'),crypto=require('node:crypto'),cp=require('node:chil\
      d_process');const
      script=\".agents/skills/leetcode-notes/scripts/validate_notes.py\",note=\
      \"02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structur\
      es/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_\
      intersection_of_two_linked_lists/160_note.md\";if(crypto.createHash('sha2\
      56').update(fs.readFileSync(script)).digest('hex')!==\"052b08835e19d17fd0\
      6dc7450251926400dff960c0893ef9113cd07cf5e8b5e0\")throw new Error('frozen
      Cornell validator changed');const
      r=cp.spawnSync('python',['-B',script,note],{cwd:'.',encoding:'utf8',shell\
      :false,timeout:20000,maxBuffer:1024*1024});if(r.error||r.signal||r.status\
      !==0||r.stderr||r.stdout.replace(/\\r\\n/g,'\\n').replace(/\\\\/g,'/')!==\
      'PASS '+note+'\\n')throw new Error('Cornell validator failure
      '+(r.error||r.stderr||r.stdout||r.status));process.stdout.write('CORNELL:
      structural validator passed for 160_note.md\\n');"
  expected_stdout: |
    CORNELL: structural validator passed for 160_note.md
  level: learning-document-structure
  coverage_classes:
    - AC6 Cornell topic/date/headings
    - balanced code fences
    - paired generic/worked flows for documented strategies
    - Mermaid classDef presence
    - no raw HTML style
  limits:
    - Validator does not enforce A/B presence, correct English statement, actual
      Mermaid syntax/rendering, branch/state semantics, complexity or
      pedagogical completeness; frozen semantic rubric required.
    - Python executable availability/version must be captured at execution;
      unavailable environment fails, never skipped.
  limitations:
    - Validator does not enforce A/B presence, correct English statement, actual
      Mermaid syntax/rendering, branch/state semantics, complexity or
      pedagogical completeness; frozen semantic rubric required.
    - Python executable availability/version must be captured at execution;
      unavailable environment fails, never skipped.
  oracle_rationale: Frozen validator hash and structural checks from inspected
    validate_notes.py; failure status/diagnostics cannot be hidden. Structural
    validator is not semantic oracle.
  protected_acceptance:
    review_required: true
    implementation_must_wait: true
    inline_command:
      - node
      - -e
      - "const
        fs=require('node:fs'),crypto=require('node:crypto'),cp=require('node:ch\
        ild_process');const
        script=\".agents/skills/leetcode-notes/scripts/validate_notes.py\",note=\
        \"02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Struct\
        ures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/\
        160_intersection_of_two_linked_lists/160_note.md\";if(crypto.createHash\
        ('sha256').update(fs.readFileSync(script)).digest('hex')!==\"052b08835e\
        19d17fd06dc7450251926400dff960c0893ef9113cd07cf5e8b5e0\")throw new
        Error('frozen Cornell validator changed');const
        r=cp.spawnSync('python',['-B',script,note],{cwd:'.',encoding:'utf8',she\
        ll:false,timeout:20000,maxBuffer:1024*1024});if(r.error||r.signal||r.st\
        atus!==0||r.stderr||r.stdout.replace(/\\r\\n/g,'\\n').replace(/\\\\/g,'\
        /')!=='PASS '+note+'\\n')throw new Error('Cornell validator failure
        '+(r.error||r.stderr||r.stdout||r.status));process.stdout.write('CORNEL\
        L: structural validator passed for 160_note.md\\n');"
    expected_exit: 0
    expected_stdout: |
      CORNELL: structural validator passed for 160_note.md
    expected_stderr: ""
    timeout_ms: 30000
    validator_sha256: 052b08835e19d17fd06dc7450251926400dff960c0893ef9113cd07cf5e8b5e0
  protected_fields:
    - command
    - expected_exit
    - expected_stdout
    - expected_stderr
    - timeout_ms
    - verification_artifact_paths
    - protected_acceptance
  invocation_id: b7469ce2-96d8-440f-9e2b-e0e573da8390
  invocation_role: verifier
  routing_required: true
---
## Criterion and Linked Requirements
REQ-0003rev2 AC1/AC6 and DES-0003rev2 exact3 layout; TASK-0004. Verifier invocation b7469ce2-96d8-440f-9e2b-e0e573da8390.

## Method and Verification Level
Automated learning-document-structure; separate executor through check_run after frozen plan review and preflight prerequisites.

## Procedure and Configuration
Complete data.command argv from cwd '.'. Node reads only exercise artifacts and frozen validator SHA256 052b08835e19d17fd06dc7450251926400dff960c0893ef9113cd07cf5e8b5e0, launches python -B with20s timeout; Python PASS path output CRLF/backslashes normalized before internal equality. No source writes or repository bytecode/build outputs.

## Expected Results
Exit0, stderr empty, exact stdout "CORNELL: structural validator passed for 160_note.md\n". Frozen validator hash and structural checks from inspected validate_notes.py; failure status/diagnostics cannot be hidden. Structural validator is not semantic oracle.

## Evidence to Capture
Actual logs, command/check fingerprints, current source/note/validator hashes, environment versions/UTC/executor identity. Archive via core before final review. Expected pass remains unobserved.

## Limitations
Validator does not enforce A/B presence, correct English statement, actual Mermaid syntax/rendering, branch/state semantics, complexity or pedagogical completeness; frozen semantic rubric required. Python executable availability/version must be captured at execution; unavailable environment fails, never skipped. Semantic rubric required separately. CHK-0003/0004 unchanged; no inventory/preservation completion claimed.
