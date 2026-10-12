---
schema_version: 1
id: VT-EF6E07ED-CHK-0009
type: check
title: LeetCode 160 exact exercise structure and relative links
owner: verifier
status: draft
revision: 1
created_at: 2026-10-11T23:16:47.741Z
updated_at: 2026-10-11T23:16:47.741Z
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
  verification_artifact_paths: []
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
  title: LeetCode 160 exact exercise structure and relative links
  command:
    - node
    - -e
    - |-
      const fs=require('node:fs'),path=require('node:path');const base=path.resolve("02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists");const expected=["160_intersection_of_two_linked_lists.c","160_intersection_of_two_linked_lists.cpp","160_note.md"];
      if(!fs.lstatSync(base).isDirectory()||fs.lstatSync(base).isSymbolicLink())throw new Error('exercise must be a real directory');
      const actual=fs.readdirSync(base).sort();if(JSON.stringify(actual)!==JSON.stringify(expected))throw new Error('exact three files required');
      for(const name of expected){const s=fs.lstatSync(path.join(base,name));if(!s.isFile()||s.isSymbolicLink()||s.size===0)throw new Error('nonempty regular file required '+name);}
      const note=fs.readFileSync(path.join(base,'160_note.md'),'utf8');const links=[...note.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map(m=>m[1]);
      for(const name of expected.filter(n=>n!=='160_note.md'))if(!links.includes(name)&&!links.includes('./'+name))throw new Error('missing relative source link '+name);
      const root=path.resolve('.');
      for(const link of links){if(/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(link)||link.startsWith('#'))continue;const relative=decodeURIComponent(link.split('#')[0]);const target=path.resolve(base,relative);const bound=path.relative(root,target);if(bound.startsWith('..'+path.sep)||bound==='..'||path.isAbsolute(bound))throw new Error('link escapes workspace');if(!fs.existsSync(target))throw new Error('broken local link '+link);}
      process.stdout.write('STRUCTURE: exactly 3 files; relative source links and local links resolve\n');
  expected_stdout: |
    STRUCTURE: exactly 3 files; relative source links and local links resolve
  level: system-learning-layout
  coverage_classes:
    - AC1 exact three files
    - AC6 nonempty regular artifacts
    - relative C and C++ source links
    - local link existence/bounds
  limits:
    - Folder structure alone does not prove only three incremental files across
      workspace; immutable manifest and dirty state comparison remain required.
    - Markdown parser accepts simple inline local links; semantic reviewer must
      inspect reference-style links, anchors and source attribution.
  limitations:
    - Folder structure alone does not prove only three incremental files across
      workspace; immutable manifest and dirty state comparison remain required.
    - Markdown parser accepts simple inline local links; semantic reviewer must
      inspect reference-style links, anchors and source attribution.
  oracle_rationale: Exact sorted directory entries, regular nonempty files/no
    symlinks, relative C/C++ links and bounded existing local targets.
  protected_acceptance:
    review_required: true
    implementation_must_wait: true
    inline_command:
      - node
      - -e
      - |-
        const fs=require('node:fs'),path=require('node:path');const base=path.resolve("02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists");const expected=["160_intersection_of_two_linked_lists.c","160_intersection_of_two_linked_lists.cpp","160_note.md"];
        if(!fs.lstatSync(base).isDirectory()||fs.lstatSync(base).isSymbolicLink())throw new Error('exercise must be a real directory');
        const actual=fs.readdirSync(base).sort();if(JSON.stringify(actual)!==JSON.stringify(expected))throw new Error('exact three files required');
        for(const name of expected){const s=fs.lstatSync(path.join(base,name));if(!s.isFile()||s.isSymbolicLink()||s.size===0)throw new Error('nonempty regular file required '+name);}
        const note=fs.readFileSync(path.join(base,'160_note.md'),'utf8');const links=[...note.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map(m=>m[1]);
        for(const name of expected.filter(n=>n!=='160_note.md'))if(!links.includes(name)&&!links.includes('./'+name))throw new Error('missing relative source link '+name);
        const root=path.resolve('.');
        for(const link of links){if(/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(link)||link.startsWith('#'))continue;const relative=decodeURIComponent(link.split('#')[0]);const target=path.resolve(base,relative);const bound=path.relative(root,target);if(bound.startsWith('..'+path.sep)||bound==='..'||path.isAbsolute(bound))throw new Error('link escapes workspace');if(!fs.existsSync(target))throw new Error('broken local link '+link);}
        process.stdout.write('STRUCTURE: exactly 3 files; relative source links and local links resolve\n');
    expected_exit: 0
    expected_stdout: |
      STRUCTURE: exactly 3 files; relative source links and local links resolve
    expected_stderr: ""
    timeout_ms: 30000
    validator_sha256: null
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
Automated system-learning-layout; separate executor through check_run after frozen plan review and preflight prerequisites.

## Procedure and Configuration
Complete data.command argv from cwd '.'. Node reads only exercise artifacts. No source writes or repository bytecode/build outputs.

## Expected Results
Exit0, stderr empty, exact stdout "STRUCTURE: exactly 3 files; relative source links and local links resolve\n". Exact sorted directory entries, regular nonempty files/no symlinks, relative C/C++ links and bounded existing local targets.

## Evidence to Capture
Actual logs, command/check fingerprints, current source/note/validator hashes, environment versions/UTC/executor identity. Archive via core before final review. Expected pass remains unobserved.

## Limitations
Folder structure alone does not prove only three incremental files across workspace; immutable manifest and dirty state comparison remain required. Markdown parser accepts simple inline local links; semantic reviewer must inspect reference-style links, anchors and source attribution. Semantic rubric required separately. CHK-0003/0004 unchanged; no inventory/preservation completion claimed.
