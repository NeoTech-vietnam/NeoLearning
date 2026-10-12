---
schema_version: 1
id: VT-EF6E07ED-CHK-0004
type: check
title: REQ-0003 read-only current inventory and Git preservation preflight
owner: verifier
status: draft
revision: 3
created_at: 2026-10-11T22:47:12.899Z
updated_at: 2026-10-11T23:26:40.089Z
links:
  - type: verifies
    target: VT-EF6E07ED-REQ-0004
  - type: verifies
    target: VT-EF6E07ED-TASK-0003
  - type: references
    target: VT-EF6E07ED-KNW-0020
data:
  workflow_id: VT-EF6E07ED-KNW-0014
  method: analysis
  level: configuration-baseline
  command:
    - powershell.exe
    - -NoProfile
    - -NonInteractive
    - -Command
    - |
      $ErrorActionPreference = 'Stop'
      $target = '02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures'
      $root = (Get-Location).Path
      $targetFull = (Resolve-Path -LiteralPath $target).Path
      if (-not $targetFull.StartsWith($root + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Target escapes workspace' }
      $directories = @(Get-ChildItem -LiteralPath $targetFull -Force -Directory | Sort-Object Name | ForEach-Object { $_.Name })
      $files = @(Get-ChildItem -LiteralPath $targetFull -Force -File -Recurse | Sort-Object FullName | ForEach-Object {
          [ordered]@{ path = $_.FullName.Substring($root.Length + 1).Replace('\','/'); bytes = $_.Length; sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant() }
      })
      $head = @(& git --no-optional-locks -c safe.directory=D:/workspace/NeoLearning rev-parse HEAD)
      if ($LASTEXITCODE -ne 0 -or $head.Count -ne 1 -or $head[0] -notmatch '^[0-9a-f]{40}$') { throw 'Git HEAD inspection failed' }
      $dirty = @(& git --no-optional-locks -c safe.directory=D:/workspace/NeoLearning -c core.quotePath=false status --porcelain=v1 --untracked-files=all)
      if ($LASTEXITCODE -ne 0) { throw 'Git status inspection failed' }
      $result = [ordered]@{ schema = 1; root = $root; target = $target; utc = [DateTime]::UtcNow.ToString('o'); powershell = $PSVersionTable.PSVersion.ToString(); head = $head[0]; directories = $directories; files = $files; dirty_porcelain = $dirty }
      $result | ConvertTo-Json -Depth 8 -Compress
      Write-Output 'PREFLIGHT: inventory, hashes, HEAD and dirty status captured'
  cwd: .
  expected_exit: 0
  expected_exit_code: 0
  expected_stdout_contains:
    - '"schema":1'
    - '"head":'
    - '"directories":'
    - '"files":'
    - '"dirty_porcelain":'
    - "PREFLIGHT: inventory, hashes, HEAD and dirty status captured"
  expected_stderr: ""
  timeout_ms: 60000
  verification_artifact_paths: []
  acceptance_criteria:
    - Exit exactly 0 and stderr empty.
    - "Stdout first line is valid JSON schema 1 with 40-lowercase-hex HEAD,
      directories array, files array containing every recursively enumerated
      target file path/bytes/64-lowercase-hex SHA256, dirty_porcelain array,
      actual UTC timestamp and PowerShell version; final line equals PREFLIGHT:
      inventory, hashes, HEAD and dirty status captured."
    - Executor inspects actual directories and recursively enumerated paths
      before claiming a candidate absent, including alternate
      names/capitalization; candidate selection remains a
      requirements/architect/manager decision.
    - Immutable evidence stores stdout manifest; downstream preservation check
      must use observed hashes from this evidence, never rebuild a new baseline
      after implementation.
  oracle_rationale: Read-only filesystem enumeration and SHA256 at
    preimplementation time, plus Git read-only HEAD/status; diagnostic output is
    intentionally variable and is validated structurally, not matched to
    invented inventory.
  coverage_classes:
    - current-topic-directory-inventory
    - recursive-existing-file-hashes
    - Git-HEAD
    - tracked-and-untracked-status
  failure_cases:
    - missing target
    - target escapes workspace
    - filesystem/hash access failure
    - Git missing/nonzero
    - invalid HEAD
    - truncated/invalid JSON
    - nonempty stderr
  protected_acceptance:
    review_required: true
    implementation_must_wait: true
    no_product_write: true
    expected_exit: 0
  limitations:
    - This is a diagnostic baseline, not product acceptance; Git status path
      text records dirty state but does not capture bytes of unrelated paths
      outside target.
    - Compiler availability and source semantic behavior untested.
    - No execution or absent-candidate conclusion made by verifier.
  invocation_id: e0930316-4014-4b9c-9cc6-d18b2f88ebbe
  author_invocation_id: e0930316-4014-4b9c-9cc6-d18b2f88ebbe
  invocation_role: verifier
  routing_required: true
  baseline_revision_reason: "Before planning review: include hidden target entries
    with -Force; disable optional Git index locks/refresh writes with
    --no-optional-locks for genuinely read-only diagnostic."
---
## Criterion and Linked Requirements
REQ-0004 supplies the subordinate read-only target inventory and Git preservation diagnostic requirement for TASK-0003. It derives from the unchanged parent REQ-0003. Establish current target inventory and byte hashes, HEAD and dirty/untracked status before any product implementation.

Traceability-only relink by verifier invocation e0930316-4014-4b9c-9cc6-d18b2f88ebbe, recovering incomplete own invocation 8cb6a381-d260-4094-ab94-cfb4349d169b, under manager 26caa8e8-9c38-443e-8010-c64f8a560aa9 and KNW-0040. Only verifies targets are REQ-0004 and TASK-0003; the original command, expectations, oracle, timeout and acceptance criteria are retained without relaxation. Separate current traceability review is required.

## Method and Verification Level
Read-only diagnostic analysis/configuration baseline. Separate independently reviewed check-executor runs check_run, never the verifier.

## Procedure and Configuration
Run exact PowerShell argv from D:/workspace/NeoLearning. Get-ChildItem/Get-FileHash inspect only bounded target; git rev-parse/status are read-only and use explicit safe.directory. No file creation, removal, rename, network call or product write. Core evidence handling alone persists logs. First JSON line and final marker must satisfy the structured acceptance criteria; use check_inspect or report actual inspection of JSON in addition to executable exit evaluation.

## Expected Results
Exit 0, stderr empty, valid complete schema-1 JSON followed by exact marker. Actual inventory/hashes/HEAD are observation fields, not invented expected values. Fail on any command/access error, invalid JSON or incomplete capture.

## Evidence to Capture
Archive exact stdout/stderr/exit through core with check fingerprint, native executor identity, time, runtime and environment. JSON itself is immutable preimplementation baseline. Manager/requirements/architect inspect evidence and then choose one absent exercise. A subsequent preservation check compares against these captured hashes. Do not rewrite the preflight baseline after implementation.

## Limitations
Does not prove any product behavior, note semantics or strict compiler compatibility. Dirty status outside the target is path/status only; unrelated-byte preservation remains partial. No execution occurred in this verifier invocation.
