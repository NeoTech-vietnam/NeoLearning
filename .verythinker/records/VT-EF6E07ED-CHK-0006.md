---
schema_version: 1
id: VT-EF6E07ED-CHK-0006
type: check
title: LeetCode 160 C11 strict judge-mode independent identity oracle
owner: verifier
status: draft
revision: 1
created_at: 2026-10-11T23:16:17.275Z
updated_at: 2026-10-11T23:16:17.275Z
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
  timeout_ms: 90000
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
  level: interface-integration-independent-unit
  command:
    - node
    - -e
    - |
      const fs=require('node:fs'), os=require('node:os'), path=require('node:path'), cp=require('node:child_process'), crypto=require('node:crypto');
      const source=path.resolve("02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c");
      const compilerDir='C:/msys64/mingw64/bin';
      const compiler=path.join(compilerDir,"gcc.exe");
      const temp=fs.mkdtempSync(path.join(os.tmpdir(),"vt-lc160-c-judge-"));
      const env={...process.env}; for(const key of Object.keys(env)) if(key.toLowerCase()==='path') delete env[key]; env.PATH=compilerDir+path.delimiter+(process.env.PATH||process.env.Path||'');
      const metadata={schema:1,source,source_sha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),utc:new Date().toISOString(),node:process.version,platform:process.platform,arch:process.arch,temp,compiler,mode:"judge"};
      function save(){fs.writeFileSync(path.join(temp,'metadata.json'),JSON.stringify(metadata,null,2));}
      function run(exe,args,name,timeout){
       const result=cp.spawnSync(exe,args,{cwd:temp,env,encoding:'utf8',shell:false,timeout,maxBuffer:16*1024*1024});
       fs.writeFileSync(path.join(temp,name+'.stdout'),result.stdout||''); fs.writeFileSync(path.join(temp,name+'.stderr'),result.stderr||'');
       metadata[name]={argv:[exe,...args],status:result.status,signal:result.signal,error:result.error?String(result.error):null}; save();
       if(result.error||result.signal||result.status!==0) throw new Error(name+' failed; artifacts '+temp+'; '+(result.stderr||result.error||result.signal||result.status));
       return {stdout:(result.stdout||'').replace(/\r\n/g,'\n'),stderr:result.stderr||''};
      }
      try {
       const version=run(compiler,['--version'],'compiler-version',10000); metadata.compiler_version=version.stdout; save();
       const wrapper="#include <stdio.h>\n#include <stdlib.h>\n#include <stddef.h>\n\nstruct ListNode { int val; struct ListNode *next; };\ntypedef struct ListNode HostNode;\n#ifdef LOCAL_TEST\n#error LOCAL_TEST must be absent in judge wrapper\n#endif\n#include \"@@SOURCE@@\"\ntypedef struct { int val; HostNode *next; } Snapshot;\nstatic size_t completed = 0;\nstatic void fail(const char *reason, size_t a, size_t b, size_t c) {\n    fprintf(stderr, \"JUDGE failure case=%zu a=%zu b=%zu c=%zu: %s\\n\", completed + 1, a, b, c, reason);\n    exit(EXIT_FAILURE);\n}\nstatic HostNode *logical(HostNode **owners, size_t n, size_t i, int scatter) {\n    size_t half = (n + 1) / 2;\n    size_t slot = scatter ? (i < half ? 2 * i : 2 * (i - half) + 1) : i;\n    return owners[slot];\n}\nstatic void fixture(size_t a, size_t b, size_t c, int scatter, int boundary, const int *explicit_values) {\n    size_t n = a + b + c;\n    HostNode **owners = n ? (HostNode **)calloc(n, sizeof(*owners)) : NULL;\n    Snapshot *before = n ? (Snapshot *)calloc(n, sizeof(*before)) : NULL;\n    if (n && (!owners || !before)) fail(\"owner allocation\", a, b, c);\n    for (size_t i = 0; i < n; ++i) {\n        owners[i] = (HostNode *)calloc(1, sizeof(*owners[i]));\n        if (!owners[i]) fail(\"node allocation\", a, b, c);\n    }\n    for (size_t i = 0; i < n; ++i) {\n        HostNode *node = logical(owners, n, i, scatter);\n        node->val = explicit_values ? explicit_values[i] : (boundary ? (i % 2 ? 100000 : 1) : 7);\n        node->next = NULL;\n    }\n    HostNode *expected = c ? logical(owners, n, a + b, scatter) : NULL;\n    for (size_t i = 0; i < a; ++i)\n        logical(owners, n, i, scatter)->next = i + 1 < a ? logical(owners, n, i + 1, scatter) : expected;\n    for (size_t i = 0; i < b; ++i)\n        logical(owners, n, a + i, scatter)->next = i + 1 < b ? logical(owners, n, a + i + 1, scatter) : expected;\n    for (size_t i = 0; i < c; ++i)\n        logical(owners, n, a + b + i, scatter)->next = i + 1 < c ? logical(owners, n, a + b + i + 1, scatter) : NULL;\n    HostNode *head_a = a ? logical(owners, n, 0, scatter) : expected;\n    HostNode *head_b = b ? logical(owners, n, a, scatter) : expected;\n    for (size_t i = 0; i < n; ++i) {\n        before[i].val = owners[i]->val;\n        before[i].next = owners[i]->next;\n    }\n    HostNode *(*api)(HostNode *, HostNode *) = &getIntersectionNode;\n    HostNode *actual = api(head_a, head_b);\n    if (actual != expected) fail(\"address mismatch\", a, b, c);\n    for (size_t i = 0; i < n; ++i)\n        if (owners[i]->val != before[i].val || owners[i]->next != before[i].next)\n            fail(\"value/next mutation\", a, b, c);\n    for (size_t i = 0; i < n; ++i) free(owners[i]);\n    free(before);\n    free(owners);\n    ++completed;\n}\nint main(void) {\n    const int ex1[] = {4, 1, 5, 6, 1, 8, 4, 5};\n    const int ex2[] = {1, 9, 1, 3, 2, 4};\n    const int ex3[] = {2, 6, 4, 1, 5};\n    fixture(2, 3, 3, 1, 0, ex1);\n    fixture(3, 1, 2, 1, 0, ex2);\n    fixture(3, 2, 0, 1, 0, ex3);\n    const size_t named[7][3] = {{0,0,1},{1,1,0},{0,3,2},{3,0,2},{2,2,1},{2,5,0},{1,4,3}};\n    for (size_t i = 0; i < 7; ++i)\n        fixture(named[i][0], named[i][1], named[i][2], 1, i == 6, NULL);\n    for (size_t a = 0; a <= 5; ++a)\n        for (size_t b = 0; b <= 5; ++b)\n            for (size_t c = 0; c <= 5; ++c) {\n                fixture(a, b, c, 0, 0, NULL);\n                fixture(a, b, c, 1, 1, NULL);\n            }\n    const size_t maximum[4][3] = {{30000,30000,0},{0,0,30000},{29999,29999,1},{29999,0,1}};\n    for (size_t i = 0; i < 4; ++i)\n        fixture(maximum[i][0], maximum[i][1], maximum[i][2], 1, 1, NULL);\n    if (completed != 446) fail(\"case count mismatch\", 0, 0, 0);\n    printf(\"C JUDGE: %zu cases, 0 failures\\n\", completed);\n    return EXIT_SUCCESS;\n}\n".replace('@@SOURCE@@',source.replace(/\\/g,'/'));
       const input=path.join(temp,'judge.c'); fs.writeFileSync(input,wrapper); metadata.wrapper_sha256=crypto.createHash('sha256').update(wrapper).digest('hex'); save();
       const exe=path.join(temp,'exercise.exe');
       const build=run(compiler,["-std=c11",'-Wall','-Wextra','-Werror','-pedantic',input,'-o',exe],'compile',30000);
       if(build.stdout!==''||build.stderr!=='') throw new Error('compiler diagnostics; artifacts '+temp);
       const result=run(exe,[],'runtime',20000);
       const expected="C JUDGE: 446 cases, 0 failures\n";
       if(result.stdout!==expected||result.stderr!=='') throw new Error('runtime output mismatch; artifacts '+temp);
       process.stdout.write(expected);
      } catch(error) { save(); console.error(String(error)); process.exitCode=1; }
  expected_stdout: |
    C JUDGE: 446 cases, 0 failures
  expected_case_count: 446
  coverage_classes:
    - 3 official examples
    - 7 identity/topology cases
    - 216 tuples x2 families
    - 22 labelled null extensions
    - 424 official-domain cases
    - repeated values
    - boundary values1/100000
    - noncontiguous logical owner order
    - asymmetric max and30000-node lists
    - every owned val/next unchanged
  case_allocation:
    official_examples: 3
    named: 7
    exhaustive:
      range:
        - 0
        - 5
      tuples: 216
      physical_value_families: 2
      official_per_family: 205
      null_extension_per_family: 11
      total: 432
    maximum: 4
    total: 446
    official_total: 424
    null_extension_total: 22
    named_tuples:
      - - 0
        - 0
        - 1
      - - 1
        - 1
        - 0
      - - 0
        - 3
        - 2
      - - 3
        - 0
        - 2
      - - 2
        - 2
        - 1
      - - 2
        - 5
        - 0
      - - 1
        - 4
        - 3
    maximum_tuples:
      - - 30000
        - 30000
        - 0
      - - 0
        - 0
        - 30000
      - - 29999
        - 29999
        - 1
      - - 29999
        - 0
        - 1
  oracle_rationale: Verifier independently authored host node allocations and
    odd/even owner-index permutation, built private A/B prefixes plus shared
    suffix by construction. Expected pointer is allocated logical[a+b] when c>0,
    else NULL, never computed by pointer-switching/alignment/traversal/set
    intersection; snapshots every unique owner val/next before actual public API
    call and checks all afterward. Caller destroys owners directly once; never
    dereferences returned foreign pointer. Includes actual absolute source
    without LOCAL_TEST and binds exact API; runtime failure/timeout rejects. No
    imported/copied LOCAL_TEST helpers.
  failure_cases:
    - compiler or Node absent
    - strict compiler diagnostics
    - duplicate judge type/main or missing API
    - wrong identity/null
    - value/next mutation
    - wrong/missing actual count
    - nonempty stderr or wrong stdout
    - signal/nonzero
    - 20-second runtime timeout
  limitations:
    - No external LeetCode judge submission; host wrapper interface and runtime
      evidence only.
    - Snapshots detect persistent mutation, not transient write/restore,
      freeing/retaining or asymptotic space; source/rubric review required.
    - Crash/nonzero/timeout fails; allocation failures are environment failures,
      not contract robustness tests; failed wrapper process may terminate before
      cleanup.
  protected_acceptance:
    review_required: true
    implementation_must_wait: true
    inline_command:
      - node
      - -e
      - |
        const fs=require('node:fs'), os=require('node:os'), path=require('node:path'), cp=require('node:child_process'), crypto=require('node:crypto');
        const source=path.resolve("02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.c");
        const compilerDir='C:/msys64/mingw64/bin';
        const compiler=path.join(compilerDir,"gcc.exe");
        const temp=fs.mkdtempSync(path.join(os.tmpdir(),"vt-lc160-c-judge-"));
        const env={...process.env}; for(const key of Object.keys(env)) if(key.toLowerCase()==='path') delete env[key]; env.PATH=compilerDir+path.delimiter+(process.env.PATH||process.env.Path||'');
        const metadata={schema:1,source,source_sha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),utc:new Date().toISOString(),node:process.version,platform:process.platform,arch:process.arch,temp,compiler,mode:"judge"};
        function save(){fs.writeFileSync(path.join(temp,'metadata.json'),JSON.stringify(metadata,null,2));}
        function run(exe,args,name,timeout){
         const result=cp.spawnSync(exe,args,{cwd:temp,env,encoding:'utf8',shell:false,timeout,maxBuffer:16*1024*1024});
         fs.writeFileSync(path.join(temp,name+'.stdout'),result.stdout||''); fs.writeFileSync(path.join(temp,name+'.stderr'),result.stderr||'');
         metadata[name]={argv:[exe,...args],status:result.status,signal:result.signal,error:result.error?String(result.error):null}; save();
         if(result.error||result.signal||result.status!==0) throw new Error(name+' failed; artifacts '+temp+'; '+(result.stderr||result.error||result.signal||result.status));
         return {stdout:(result.stdout||'').replace(/\r\n/g,'\n'),stderr:result.stderr||''};
        }
        try {
         const version=run(compiler,['--version'],'compiler-version',10000); metadata.compiler_version=version.stdout; save();
         const wrapper="#include <stdio.h>\n#include <stdlib.h>\n#include <stddef.h>\n\nstruct ListNode { int val; struct ListNode *next; };\ntypedef struct ListNode HostNode;\n#ifdef LOCAL_TEST\n#error LOCAL_TEST must be absent in judge wrapper\n#endif\n#include \"@@SOURCE@@\"\ntypedef struct { int val; HostNode *next; } Snapshot;\nstatic size_t completed = 0;\nstatic void fail(const char *reason, size_t a, size_t b, size_t c) {\n    fprintf(stderr, \"JUDGE failure case=%zu a=%zu b=%zu c=%zu: %s\\n\", completed + 1, a, b, c, reason);\n    exit(EXIT_FAILURE);\n}\nstatic HostNode *logical(HostNode **owners, size_t n, size_t i, int scatter) {\n    size_t half = (n + 1) / 2;\n    size_t slot = scatter ? (i < half ? 2 * i : 2 * (i - half) + 1) : i;\n    return owners[slot];\n}\nstatic void fixture(size_t a, size_t b, size_t c, int scatter, int boundary, const int *explicit_values) {\n    size_t n = a + b + c;\n    HostNode **owners = n ? (HostNode **)calloc(n, sizeof(*owners)) : NULL;\n    Snapshot *before = n ? (Snapshot *)calloc(n, sizeof(*before)) : NULL;\n    if (n && (!owners || !before)) fail(\"owner allocation\", a, b, c);\n    for (size_t i = 0; i < n; ++i) {\n        owners[i] = (HostNode *)calloc(1, sizeof(*owners[i]));\n        if (!owners[i]) fail(\"node allocation\", a, b, c);\n    }\n    for (size_t i = 0; i < n; ++i) {\n        HostNode *node = logical(owners, n, i, scatter);\n        node->val = explicit_values ? explicit_values[i] : (boundary ? (i % 2 ? 100000 : 1) : 7);\n        node->next = NULL;\n    }\n    HostNode *expected = c ? logical(owners, n, a + b, scatter) : NULL;\n    for (size_t i = 0; i < a; ++i)\n        logical(owners, n, i, scatter)->next = i + 1 < a ? logical(owners, n, i + 1, scatter) : expected;\n    for (size_t i = 0; i < b; ++i)\n        logical(owners, n, a + i, scatter)->next = i + 1 < b ? logical(owners, n, a + i + 1, scatter) : expected;\n    for (size_t i = 0; i < c; ++i)\n        logical(owners, n, a + b + i, scatter)->next = i + 1 < c ? logical(owners, n, a + b + i + 1, scatter) : NULL;\n    HostNode *head_a = a ? logical(owners, n, 0, scatter) : expected;\n    HostNode *head_b = b ? logical(owners, n, a, scatter) : expected;\n    for (size_t i = 0; i < n; ++i) {\n        before[i].val = owners[i]->val;\n        before[i].next = owners[i]->next;\n    }\n    HostNode *(*api)(HostNode *, HostNode *) = &getIntersectionNode;\n    HostNode *actual = api(head_a, head_b);\n    if (actual != expected) fail(\"address mismatch\", a, b, c);\n    for (size_t i = 0; i < n; ++i)\n        if (owners[i]->val != before[i].val || owners[i]->next != before[i].next)\n            fail(\"value/next mutation\", a, b, c);\n    for (size_t i = 0; i < n; ++i) free(owners[i]);\n    free(before);\n    free(owners);\n    ++completed;\n}\nint main(void) {\n    const int ex1[] = {4, 1, 5, 6, 1, 8, 4, 5};\n    const int ex2[] = {1, 9, 1, 3, 2, 4};\n    const int ex3[] = {2, 6, 4, 1, 5};\n    fixture(2, 3, 3, 1, 0, ex1);\n    fixture(3, 1, 2, 1, 0, ex2);\n    fixture(3, 2, 0, 1, 0, ex3);\n    const size_t named[7][3] = {{0,0,1},{1,1,0},{0,3,2},{3,0,2},{2,2,1},{2,5,0},{1,4,3}};\n    for (size_t i = 0; i < 7; ++i)\n        fixture(named[i][0], named[i][1], named[i][2], 1, i == 6, NULL);\n    for (size_t a = 0; a <= 5; ++a)\n        for (size_t b = 0; b <= 5; ++b)\n            for (size_t c = 0; c <= 5; ++c) {\n                fixture(a, b, c, 0, 0, NULL);\n                fixture(a, b, c, 1, 1, NULL);\n            }\n    const size_t maximum[4][3] = {{30000,30000,0},{0,0,30000},{29999,29999,1},{29999,0,1}};\n    for (size_t i = 0; i < 4; ++i)\n        fixture(maximum[i][0], maximum[i][1], maximum[i][2], 1, 1, NULL);\n    if (completed != 446) fail(\"case count mismatch\", 0, 0, 0);\n    printf(\"C JUDGE: %zu cases, 0 failures\\n\", completed);\n    return EXIT_SUCCESS;\n}\n".replace('@@SOURCE@@',source.replace(/\\/g,'/'));
         const input=path.join(temp,'judge.c'); fs.writeFileSync(input,wrapper); metadata.wrapper_sha256=crypto.createHash('sha256').update(wrapper).digest('hex'); save();
         const exe=path.join(temp,'exercise.exe');
         const build=run(compiler,["-std=c11",'-Wall','-Wextra','-Werror','-pedantic',input,'-o',exe],'compile',30000);
         if(build.stdout!==''||build.stderr!=='') throw new Error('compiler diagnostics; artifacts '+temp);
         const result=run(exe,[],'runtime',20000);
         const expected="C JUDGE: 446 cases, 0 failures\n";
         if(result.stdout!==expected||result.stderr!=='') throw new Error('runtime output mismatch; artifacts '+temp);
         process.stdout.write(expected);
        } catch(error) { save(); console.error(String(error)); process.exitCode=1; }
    expected_exit: 0
    expected_stdout: |
      C JUDGE: 446 cases, 0 failures
    expected_stderr: ""
    timeout_ms: 90000
    case_allocation:
      official_examples: 3
      named: 7
      exhaustive:
        range:
          - 0
          - 5
        tuples: 216
        physical_value_families: 2
        official_per_family: 205
        null_extension_per_family: 11
        total: 432
      maximum: 4
      total: 446
      official_total: 424
      null_extension_total: 22
      named_tuples:
        - - 0
          - 0
          - 1
        - - 1
          - 1
          - 0
        - - 0
          - 3
          - 2
        - - 3
          - 0
          - 2
        - - 2
          - 2
          - 1
        - - 2
          - 5
          - 0
        - - 1
          - 4
          - 3
      maximum_tuples:
        - - 30000
          - 30000
          - 0
        - - 0
          - 0
          - 30000
        - - 29999
          - 29999
          - 1
        - - 29999
          - 0
          - 1
    oracle_rationale: Verifier independently authored host node allocations and
      odd/even owner-index permutation, built private A/B prefixes plus shared
      suffix by construction. Expected pointer is allocated logical[a+b] when
      c>0, else NULL, never computed by
      pointer-switching/alignment/traversal/set intersection; snapshots every
      unique owner val/next before actual public API call and checks all
      afterward. Caller destroys owners directly once; never dereferences
      returned foreign pointer. Includes actual absolute source without
      LOCAL_TEST and binds exact API; runtime failure/timeout rejects. No
      imported/copied LOCAL_TEST helpers.
    comparison_tolerance: exact integer/address equality; CRLF->LF transport normalization only
  protected_fields:
    - command
    - expected_exit
    - expected_stdout
    - expected_stderr
    - timeout_ms
    - oracle_rationale
    - case_allocation
    - protected_acceptance
  invocation_id: b7469ce2-96d8-440f-9e2b-e0e573da8390
  invocation_role: verifier
  routing_required: true
---
## Criterion and Linked Requirements
REQ-0003rev2 AC2/AC4/AC5, DES-0003rev2; TASK-0004. Author recovery invocation b7469ce2-96d8-440f-9e2b-e0e573da8390, covering only orphan prior bf2b6da4-d151-453c-a40f-ff14a990d7a6.

## Method and Verification Level
interface-integration-independent-unit. Command argv is complete and inline, frozen before independent planning review. Compiler source operands are implementation inputs, not frozen artifacts.

## Procedure and Configuration
From repository root run exactly data.command via authorized check_run after prerequisites. Node creates unique system-temp build/log directory; uses gcc.exe C11 at C:/msys64/mingw64/bin with -Wall -Wextra -Werror -pedantic, LOCAL_TEST absent, verifier host ListNode defined before actual source include. All children get compiler directory in PATH; shell=false. GCC version child10s, compile30s, runtime20s; outer90s. Retain temp evidence; no repository build/write.

## Expected Results
Exit0, empty stderr, stdout exactly "C JUDGE: 446 cases, 0 failures\n" after CRLF normalization. Count446=3+7+432+4; exhaustive216 per family contains205 official/11 null extensions; totals424 official/22 extensions. Verifier independently authored host node allocations and odd/even owner-index permutation, built private A/B prefixes plus shared suffix by construction. Expected pointer is allocated logical[a+b] when c>0, else NULL, never computed by pointer-switching/alignment/traversal/set intersection; snapshots every unique owner val/next before actual public API call and checks all afterward. Caller destroys owners directly once; never dereferences returned foreign pointer. Includes actual absolute source without LOCAL_TEST and binds exact API; runtime failure/timeout rejects. No imported/copied LOCAL_TEST helpers.

## Evidence to Capture
Capture exact command/check fingerprints, actual stdout/stderr/status and UTC/native executor identity; current source byte hashes and working revision plus dirty baseline; OS/architecture, Node/compiler/Python versions as applicable. Runtime Node runner retains unique system-temp directory vt-lc160-<c|cpp>-<local|judge>-*, metadata.json (source hash, UTC, tool versions, actual argv/status/signal) and raw compiler/runtime stdout/stderr. Executor archives the metadata/logs and generated judge wrapper from the newly created temp directory under authorized core evidence, identifies its path in the report, and preserves failures. Runtime stdout comparison normalizes CRLF to LF only. No warnings suppressed. Missing tools/timeouts/diagnostics/mismatched counts fail. This invocation defines commands without execution; no expected result is observed evidence.

## Limitations
No external LeetCode judge submission; host wrapper interface and runtime evidence only. Snapshots detect persistent mutation, not transient write/restore, freeing/retaining or asymptotic space; source/rubric review required. Crash/nonzero/timeout fails; allocation failures are environment failures, not contract robustness tests; failed wrapper process may terminate before cleanup. Preimplementation absence/preservation still pending; CHK-0003/0004 untouched. No checks executed, no source writes, no acceptance or review pass claimed. Independent semantic inspection covers algorithm/harness honesty, and final manifest check remains to be bound from actual immutable baseline.
