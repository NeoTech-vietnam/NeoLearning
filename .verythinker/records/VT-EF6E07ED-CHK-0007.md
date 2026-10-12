---
schema_version: 1
id: VT-EF6E07ED-CHK-0007
type: check
title: LeetCode 160 C++17 strict LOCAL_TEST446 demonstration
owner: verifier
status: draft
revision: 1
created_at: 2026-10-11T23:16:24.791Z
updated_at: 2026-10-11T23:16:24.791Z
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
  level: unit-local-runtime-demonstration
  command:
    - node
    - -e
    - |
      const fs=require('node:fs'), os=require('node:os'), path=require('node:path'), cp=require('node:child_process'), crypto=require('node:crypto');
      const source=path.resolve("02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp");
      const compilerDir='C:/msys64/mingw64/bin';
      const compiler=path.join(compilerDir,"g++.exe");
      const temp=fs.mkdtempSync(path.join(os.tmpdir(),"vt-lc160-cpp-local-"));
      const env={...process.env}; for(const key of Object.keys(env)) if(key.toLowerCase()==='path') delete env[key]; env.PATH=compilerDir+path.delimiter+(process.env.PATH||process.env.Path||'');
      const metadata={schema:1,source,source_sha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),utc:new Date().toISOString(),node:process.version,platform:process.platform,arch:process.arch,temp,compiler,mode:"LOCAL_TEST"};
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
       const input=source;
       const exe=path.join(temp,'exercise.exe');
       const build=run(compiler,["-std=c++17",'-Wall','-Wextra','-Werror','-pedantic','-DLOCAL_TEST',input,'-o',exe],'compile',30000);
       if(build.stdout!==''||build.stderr!=='') throw new Error('compiler diagnostics; artifacts '+temp);
       const result=run(exe,[],'runtime',20000);
       const expected="C++ LOCAL_TEST: 446 cases, 0 failures\n";
       if(result.stdout!==expected||result.stderr!=='') throw new Error('runtime output mismatch; artifacts '+temp);
       process.stdout.write(expected);
      } catch(error) { save(); console.error(String(error)); process.exitCode=1; }
  expected_stdout: |
    C++ LOCAL_TEST: 446 cases, 0 failures
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
  oracle_rationale: Actual submitted LOCAL_TEST harness must call implemented
    routine and use metadata expected addresses + full unique-node snapshots and
    own original allocation ownership, assessed independently by semantic
    rubric. Exact successful446 marker and zero status must reflect actual
    counter after assertions. Runtime demonstration is this actual harness,
    requiring no extra exercise artifact.
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
    - Harness self-report can lie; independent judge wrapper plus source
      semantic inspection are required.
    - Passing max-size execution cannot prove O(m+n)/O(1) or transient
      nonmutation; source analysis required.
  protected_acceptance:
    review_required: true
    implementation_must_wait: true
    inline_command:
      - node
      - -e
      - |
        const fs=require('node:fs'), os=require('node:os'), path=require('node:path'), cp=require('node:child_process'), crypto=require('node:crypto');
        const source=path.resolve("02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/160_intersection_of_two_linked_lists/160_intersection_of_two_linked_lists.cpp");
        const compilerDir='C:/msys64/mingw64/bin';
        const compiler=path.join(compilerDir,"g++.exe");
        const temp=fs.mkdtempSync(path.join(os.tmpdir(),"vt-lc160-cpp-local-"));
        const env={...process.env}; for(const key of Object.keys(env)) if(key.toLowerCase()==='path') delete env[key]; env.PATH=compilerDir+path.delimiter+(process.env.PATH||process.env.Path||'');
        const metadata={schema:1,source,source_sha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),utc:new Date().toISOString(),node:process.version,platform:process.platform,arch:process.arch,temp,compiler,mode:"LOCAL_TEST"};
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
         const input=source;
         const exe=path.join(temp,'exercise.exe');
         const build=run(compiler,["-std=c++17",'-Wall','-Wextra','-Werror','-pedantic','-DLOCAL_TEST',input,'-o',exe],'compile',30000);
         if(build.stdout!==''||build.stderr!=='') throw new Error('compiler diagnostics; artifacts '+temp);
         const result=run(exe,[],'runtime',20000);
         const expected="C++ LOCAL_TEST: 446 cases, 0 failures\n";
         if(result.stdout!==expected||result.stderr!=='') throw new Error('runtime output mismatch; artifacts '+temp);
         process.stdout.write(expected);
        } catch(error) { save(); console.error(String(error)); process.exitCode=1; }
    expected_exit: 0
    expected_stdout: |
      C++ LOCAL_TEST: 446 cases, 0 failures
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
    oracle_rationale: Actual submitted LOCAL_TEST harness must call implemented
      routine and use metadata expected addresses + full unique-node snapshots
      and own original allocation ownership, assessed independently by semantic
      rubric. Exact successful446 marker and zero status must reflect actual
      counter after assertions. Runtime demonstration is this actual harness,
      requiring no extra exercise artifact.
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
REQ-0003rev2 AC2/AC4/AC5 and AC6 actual runtime demonstration, DES-0003rev2; TASK-0004. Author recovery invocation b7469ce2-96d8-440f-9e2b-e0e573da8390, covering only orphan prior bf2b6da4-d151-453c-a40f-ff14a990d7a6.

## Method and Verification Level
unit-local-runtime-demonstration. Command argv is complete and inline, frozen before independent planning review. Compiler source operands are implementation inputs, not frozen artifacts.

## Procedure and Configuration
From repository root run exactly data.command via authorized check_run after prerequisites. Node creates unique system-temp build/log directory; uses g++.exe C++17 at C:/msys64/mingw64/bin with -Wall -Wextra -Werror -pedantic, -DLOCAL_TEST, actual exercise source. All children get compiler directory in PATH; shell=false. GCC version child10s, compile30s, runtime20s; outer90s. Retain temp evidence; no repository build/write.

## Expected Results
Exit0, empty stderr, stdout exactly "C++ LOCAL_TEST: 446 cases, 0 failures\n" after CRLF normalization. Count446=3+7+432+4; exhaustive216 per family contains205 official/11 null extensions; totals424 official/22 extensions. Actual submitted LOCAL_TEST harness must call implemented routine and use metadata expected addresses + full unique-node snapshots and own original allocation ownership, assessed independently by semantic rubric. Exact successful446 marker and zero status must reflect actual counter after assertions. Runtime demonstration is this actual harness, requiring no extra exercise artifact.

## Evidence to Capture
Capture exact command/check fingerprints, actual stdout/stderr/status and UTC/native executor identity; current source byte hashes and working revision plus dirty baseline; OS/architecture, Node/compiler/Python versions as applicable. Runtime Node runner retains unique system-temp directory vt-lc160-<c|cpp>-<local|judge>-*, metadata.json (source hash, UTC, tool versions, actual argv/status/signal) and raw compiler/runtime stdout/stderr. Executor archives the metadata/logs and generated judge wrapper from the newly created temp directory under authorized core evidence, identifies its path in the report, and preserves failures. Runtime stdout comparison normalizes CRLF to LF only. No warnings suppressed. Missing tools/timeouts/diagnostics/mismatched counts fail. This invocation defines commands without execution; no expected result is observed evidence.

## Limitations
Harness self-report can lie; independent judge wrapper plus source semantic inspection are required. Passing max-size execution cannot prove O(m+n)/O(1) or transient nonmutation; source analysis required. Preimplementation absence/preservation still pending; CHK-0003/0004 untouched. No checks executed, no source writes, no acceptance or review pass claimed. Independent semantic inspection covers algorithm/harness honesty, and final manifest check remains to be bound from actual immutable baseline.
