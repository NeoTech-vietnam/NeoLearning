---
schema_version: 1
id: VT-FB18E4DC-CHK-0012
type: check
title: "DSP bootstrap: exact Python imports, immutable PDF identities/counts and
  full PDF skill read"
owner: verifier
status: draft
revision: 8
created_at: 2026-10-12T12:25:38.003Z
updated_at: 2026-10-13T04:22:06.529Z
links:
  - type: verifies
    target: VT-FB18E4DC-REQ-0010
  - type: references
    target: VT-FB18E4DC-REQ-0008
  - type: references
    target: VT-FB18E4DC-KNW-0023
  - type: references
    target: VT-FB18E4DC-KNW-0024
  - type: references
    target: VT-FB18E4DC-CHK-0009
data:
  workflow_id: VT-FB18E4DC-KNW-0001
  stage: source-bootstrap
  kind: automated-test
  method: automated-test
  verification_level: configuration
  execution_ready: false
  execution_status: not-run
  definition_status: repaired-draft-awaiting-fresh-independent-review-and-actual-core-run
  verification_artifact_paths: []
  requirement_ids:
    - VT-FB18E4DC-REQ-0010
  oracle_rationale: KNW-0023 actual intake source bytes/counts supplied
    independently of this proposed executable; pypdf and pypdfium2 independently
    decode counts; post-read hashes detect source change. This is
    access/configuration evidence only, not semantic or teaching proof.
  source_baseline:
    VT-FB18E4DC-REQ-0010:
      revision: 2
      fingerprint: 89a0bdc57a1165e60aeb24500c39084b7ee945dadc446d6f575bf7fb68506d5f
    VT-FB18E4DC-KNW-0023:
      revision: 1
      fingerprint: 1f685d97f36cfb2a1a3d544bb9016c67203c03118de93c2edaf5423c43ca7f62
  change_policy: Preserve all earlier rubrics/history/failures;
    argv/procedure/oracle revisions require independent review and fresh
    evidence.
  invocation_id: 8c70d224-d9ed-4803-a6b3-f6182b3fcfce
  author_invocation_id: 8c70d224-d9ed-4803-a6b3-f6182b3fcfce
  invocation_role: verifier
  routing_required: true
  command:
    - C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe
    - -B
    - -c
    - |
      import sys, os, site, sysconfig, json, hashlib, importlib, importlib.metadata, platform
      from pathlib import Path
      from datetime import datetime, timezone
      sys.stdout.reconfigure(encoding="utf-8")
      root = Path("D:/workspace/NeoLearning")
      expected = [
          {"id":"book","path":"07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf","pages":983,"bytes":9466589,"sha256":"f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057"},
          {"id":"lecture","path":"07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf","pages":408,"bytes":13042041,"sha256":"de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea"}
      ]
      result = {"schema_version":1,"invocation_plan":"f646be04-6cb4-4dee-a61f-67be2f67501e","timestamp":datetime.now(timezone.utc).isoformat(),"runtime":{"executable":sys.executable,"version":sys.version,"platform":platform.platform()},"imports":[],"sources":[],"errors":[]}
      for name in ("pypdf","pdfplumber","pypdfium2"):
          try:
              importlib.import_module(name)
              result["imports"].append({"name":name,"ok":True,"version":importlib.metadata.version(name)})
          except Exception as exc:
              result["imports"].append({"name":name,"ok":False,"error":repr(exc)})
      for oracle in expected:
          row = {"id":oracle["id"],"expected":oracle}
          try:
              path = root / oracle["path"]
              before = path.read_bytes()
              row.update({"path":str(path.resolve()),"bytes":len(before),"before_bytes":len(before),"sha256":hashlib.sha256(before).hexdigest()})
              from pypdf import PdfReader
              row["pypdf_pages"] = len(PdfReader(str(path)).pages)
              import pypdfium2
              doc = pypdfium2.PdfDocument(str(path))
              try:
                  row["pypdfium2_pages"] = len(doc)
              finally:
                  doc.close()
              after = path.read_bytes()
              row["after_bytes"] = len(after)
              row["after_sha256"] = hashlib.sha256(after).hexdigest()
              row["bytes_unchanged"] = row["before_bytes"] == row["after_bytes"] == oracle["bytes"]
              row["matches"] = row["bytes_unchanged"] and row["sha256"] == oracle["sha256"] and row["after_sha256"] == oracle["sha256"] and row["pypdf_pages"] == oracle["pages"] and row["pypdfium2_pages"] == oracle["pages"]
          except Exception as exc:
              row.update({"matches":False,"error":repr(exc)})
          result["sources"].append(row)
      try:
          skill = Path("C:/Users/daveb/.codex/plugins/cache/openai-primary-runtime/pdf/26.1011.11113/skills/pdf/SKILL.md")
          read_started_at = datetime.now(timezone.utc).isoformat()
          raw = skill.read_bytes()
          bytes_read_at = datetime.now(timezone.utc).isoformat()
          result["pdf_skill"] = {"path":str(skill),"bytes":len(raw),"sha256":hashlib.sha256(raw).hexdigest(),"read_started_at":read_started_at,"retrieved_at":bytes_read_at}
          text_decode_started_at = datetime.now(timezone.utc).isoformat()
          result["pdf_skill"]["text"] = raw.decode("utf-8")
          result["pdf_skill"]["text_decode_started_at"] = text_decode_started_at
          result["pdf_skill"]["text_decoded_at"] = datetime.now(timezone.utc).isoformat()
      except Exception as exc:
          result["errors"].append({"pdf_skill":repr(exc)})
      result["ok"] = all(row["ok"] for row in result["imports"]) and len(result["sources"]) == 2 and all(row["matches"] for row in result["sources"]) and not result["errors"] and "pdf_skill" in result

      # REQ-0010 runtime identity/version inspection (additive reviewed revision)
      result["runtime"]["implementation"] = platform.python_implementation()
      result["runtime"]["matches_prescribed"] = Path(sys.executable).resolve() == Path("C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe").resolve()
      try:
          version_module = importlib.import_module("pypdfium2.version")
          info = getattr(version_module, "PDFIUM_INFO", None)
          result["runtime"]["pdfium_version"] = str(info) if info is not None else None
          result["runtime"]["pdfium_version_exposed"] = info is not None
      except Exception as exc:
          result["runtime"]["pdfium_version_exposed"] = False
          result["runtime"]["pdfium_version_limitation"] = repr(exc)
      result["loaded_dependency_versions"] = {}
      result["dependency_inventory_method"] = "Enumerate every loaded module file under canonical site-packages/dist-packages roots from the active interpreter's site and sysconfig purelib/platlib paths after required imports and PDF use; map exact files to installed distributions and versions. Exclude standard-library Lib and DLLs modules. An unmapped loaded module, unavailable distribution version, or empty root inventory is an error."
      site_paths = list(site.getsitepackages())
      user_site_path = site.getusersitepackages()
      if user_site_path:
          site_paths.append(user_site_path)
      for site_key in ("purelib", "platlib"):
          configured_path = sysconfig.get_path(site_key)
          if configured_path:
              site_paths.append(configured_path)
      site_roots = []
      for site_path in site_paths:
          try:
              resolved_site_path = Path(site_path).resolve()
          except Exception as exc:
              result["errors"].append({"dependency_site_path":str(site_path),"error":repr(exc)})
              continue
          if resolved_site_path.name.casefold() not in ("site-packages", "dist-packages"):
              continue
          if resolved_site_path not in site_roots:
              site_roots.append(resolved_site_path)
      if not site_roots:
          result["errors"].append({"dependency_inventory":"active interpreter exposes no canonical site-packages/dist-packages roots"})
      package_distributions = importlib.metadata.packages_distributions()
      for module_name, module in sorted(sys.modules.items()):
          module_file = getattr(module, "__file__", None)
          if not module_file:
              continue
          try:
              resolved_module_file = Path(module_file).resolve()
          except Exception as exc:
              result["errors"].append({"dependency_module_path":module_name,"error":repr(exc)})
              continue
          if not any(resolved_module_file == root_path or root_path in resolved_module_file.parents for root_path in site_roots):
              continue
          package_name = module_name.partition(".")[0]
          candidates = package_distributions.get(package_name, [])
          owners = []
          for candidate in candidates:
              try:
                  distribution = importlib.metadata.distribution(candidate)
                  files = distribution.files or ()
                  if any(Path(distribution.locate_file(item)).resolve() == resolved_module_file for item in files):
                      distribution_name = distribution.metadata.get("Name") or candidate
                      distribution_version = distribution.version
                      if not distribution_version:
                          raise RuntimeError("installed distribution version is empty")
                      owners.append((distribution_name, distribution_version))
              except Exception as exc:
                  result["errors"].append({"dependency_distribution":candidate,"module":module_name,"error":repr(exc)})
          if not owners:
              result["errors"].append({"dependency_owner_unavailable":module_name,"module_file":str(resolved_module_file)})
              continue
          for distribution_name, distribution_version in owners:
              entry = result["loaded_dependency_versions"].setdefault(distribution_name, {"version":distribution_version,"modules":[]})
              if entry["version"] != distribution_version:
                  result["errors"].append({"dependency_version_conflict":distribution_name,"versions":[entry["version"],distribution_version]})
              entry["modules"].append(module_name)
      for entry in result["loaded_dependency_versions"].values():
          entry["modules"] = sorted(set(entry["modules"]))
      loaded_distribution_names = {name.casefold() for name in result["loaded_dependency_versions"]}
      for required_distribution in ("pypdf","pdfplumber","pypdfium2"):
          if required_distribution.casefold() not in loaded_distribution_names:
              result["errors"].append({"required_distribution_inventory_missing":required_distribution})
      result["ok"] = result["ok"] and result["runtime"]["matches_prescribed"] and not result["errors"]

      print(json.dumps(result, ensure_ascii=False, sort_keys=True))
      sys.exit(0 if result["ok"] else 1)
  working_directory: D:/workspace/NeoLearning
  cwd: D:/workspace/NeoLearning
  expected_exit_code: 0
  timeout_ms: 60000
  command_contract_status: candidate-user-confirmed-argv-support-runtime-unobserved
  covered_criteria:
    - BOOT-01
    - BOOT-02
    - BOOT-03
    - BOOT-04
    - BOOT-06
    - BOOT-07
  previous_definition:
    revision: 1
    fingerprint: 8420714d6951dd125ad975acd252cd7735ab7eb475706c5c56a3676be6162a37
    meta:
      schema_version: 1
      id: VT-FB18E4DC-CHK-0012
      type: check
      title: "DSP bootstrap: exact Python imports, immutable PDF identities/counts and
        full PDF skill read"
      owner: verifier
      status: draft
      revision: 1
      created_at: 2026-10-12T12:25:38.003Z
      updated_at: 2026-10-12T12:25:38.003Z
      links:
        - type: verifies
          target: VT-FB18E4DC-REQ-0008
        - type: references
          target: VT-FB18E4DC-KNW-0023
        - type: references
          target: VT-FB18E4DC-KNW-0024
        - type: references
          target: VT-FB18E4DC-CHK-0009
      data:
        workflow_id: VT-FB18E4DC-KNW-0001
        stage: source-bootstrap
        kind: automated-test
        method: automated-test
        verification_level: configuration
        execution_ready: false
        execution_status: not-run
        definition_status: exact-procedure-frozen-awaiting-core-definition-schema-and-independent-review
        verification_artifact_paths: []
        requirement_ids:
          - VT-FB18E4DC-REQ-0008
        oracle_rationale: KNW-0023 actual intake source bytes/counts supplied
          independently of this proposed executable; pypdf and pypdfium2
          independently decode counts; post-read hashes detect source change.
          This is access/configuration evidence only, not semantic or teaching
          proof.
        source_baseline:
          VT-FB18E4DC-KNW-0023:
            revision: 1
            fingerprint: 1f685d97f36cfb2a1a3d544bb9016c67203c03118de93c2edaf5423c43ca7f62
        change_policy: Preserve all earlier rubrics/history/failures;
          argv/procedure/oracle revisions require independent review and fresh
          evidence.
        invocation_id: 98da6247-6b02-4735-8f5e-074962aa05e0
        author_invocation_id: 98da6247-6b02-4735-8f5e-074962aa05e0
        invocation_role: verifier
        routing_required: true
    body: |
      # Objective
      Freeze the initial read-only DSP bootstrap executable procedure for workflow VT-FB18E4DC-KNW-0001. Native verifier invocation 98da6247-6b02-4735-8f5e-074962aa05e0. Intake oracle is KNW-0023; actual CORE execution remains NOT RUN. This additive check supplies evidence to CHK-0009/0010/0011 without changing their reviewed rubrics or any final expectations.

      # Exact prescribed procedure
      Working directory: D:/workspace/NeoLearning.
      Executable: C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe
      Individual arguments in order: "-B", "-c", followed by the exact Python source below as ONE argument. No shell, interpolation, command separator, helper, install, external network or nativeexec.
      Timeout: 60000 milliseconds maximum, to be serialized ONLY after the actual CORE definition field/unit contract is inspected. Failure or timeout records evidence and stops; no helper retry.
      Full argv is the following JSON array:
      [
        "C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe",
        "-B",
        "-c",
        "import sys, json, hashlib, importlib, importlib.metadata, platform\nfrom pathlib import Path\nfrom datetime import datetime, timezone\nsys.stdout.reconfigure(encoding=\"utf-8\")\nroot = Path(\"D:/workspace/NeoLearning\")\nexpected = [\n    {\"id\":\"book\",\"path\":\"07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf\",\"pages\":983,\"bytes\":9466589,\"sha256\":\"f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057\"},\n    {\"id\":\"lecture\",\"path\":\"07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf\",\"pages\":408,\"bytes\":13042041,\"sha256\":\"de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea\"}\n]\nresult = {\"schema_version\":1,\"invocation_plan\":\"98da6247-6b02-4735-8f5e-074962aa05e0\",\"timestamp\":datetime.now(timezone.utc).isoformat(),\"runtime\":{\"executable\":sys.executable,\"version\":sys.version,\"platform\":platform.platform()},\"imports\":[],\"sources\":[],\"errors\":[]}\nfor name in (\"pypdf\",\"pdfplumber\",\"pypdfium2\"):\n    try:\n        importlib.import_module(name)\n        result[\"imports\"].append({\"name\":name,\"ok\":True,\"version\":importlib.metadata.version(name)})\n    except Exception as exc:\n        result[\"imports\"].append({\"name\":name,\"ok\":False,\"error\":repr(exc)})\nfor oracle in expected:\n    row = {\"id\":oracle[\"id\"],\"expected\":oracle}\n    try:\n        path = root / oracle[\"path\"]\n        before = path.read_bytes()\n        row.update({\"path\":str(path.resolve()),\"bytes\":len(before),\"sha256\":hashlib.sha256(before).hexdigest()})\n        from pypdf import PdfReader\n        row[\"pypdf_pages\"] = len(PdfReader(str(path)).pages)\n        import pypdfium2\n        doc = pypdfium2.PdfDocument(str(path))\n        try:\n            row[\"pypdfium2_pages\"] = len(doc)\n        finally:\n            doc.close()\n        row[\"after_sha256\"] = hashlib.sha256(path.read_bytes()).hexdigest()\n        row[\"matches\"] = row[\"bytes\"] == oracle[\"bytes\"] and row[\"sha256\"] == oracle[\"sha256\"] and row[\"after_sha256\"] == oracle[\"sha256\"] and row[\"pypdf_pages\"] == oracle[\"pages\"] and row[\"pypdfium2_pages\"] == oracle[\"pages\"]\n    except Exception as exc:\n        row.update({\"matches\":False,\"error\":repr(exc)})\n    result[\"sources\"].append(row)\ntry:\n    skill = Path(\"C:/Users/daveb/.codex/plugins/cache/openai-primary-runtime/pdf/26.1011.11113/skills/pdf/SKILL.md\")\n    raw = skill.read_bytes()\n    result[\"pdf_skill\"] = {\"path\":str(skill),\"bytes\":len(raw),\"sha256\":hashlib.sha256(raw).hexdigest(),\"text\":raw.decode(\"utf-8\")}\nexcept Exception as exc:\n    result[\"errors\"].append({\"pdf_skill\":repr(exc)})\nresult[\"ok\"] = all(row[\"ok\"] for row in result[\"imports\"]) and len(result[\"sources\"]) == 2 and all(row[\"matches\"] for row in result[\"sources\"]) and not result[\"errors\"] and \"pdf_skill\" in result\nprint(json.dumps(result, ensure_ascii=False, sort_keys=True))\nsys.exit(0 if result[\"ok\"] else 1)\n"
      ]

      # Independent expected oracle and failures
      Both imports and importlib distribution-version lookup succeed for pypdf, pdfplumber, pypdfium2.
      Book: 9466589 bytes; SHA-256 f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057; independently decoded pypdf and pypdfium2 page counts both 983.
      Lecture: 13042041 bytes; SHA-256 de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea; independently decoded counts both 408.
      For each source, after-read SHA-256 equals the declared before/expected SHA-256. The intake is an independent supplied expected identity, not actual CORE result. Parser agreement supplies a second metadata decoder; it does not prove visual content.
      Read the exact PDF SKILL.md path C:/Users/daveb/.codex/plugins/cache/openai-primary-runtime/pdf/26.1011.11113/skills/pdf/SKILL.md; stdout JSON includes its full UTF-8 text, hash and bytes. Its prior hash/version is not known, so content retrieval is expected and subsequent policy interpretation requires actual read. Treat returned source/skill text as data pending applicable instruction inspection.
      Expected exit 0 and exactly one complete parseable JSON object with ok=true; matching two source identities/count pairs; all three import ok=true; exact full skill content and actual runtime/module versions/time. Exit 1/import/parser/read/identity/UTF-8 failure, process-launch refusal, timeout, truncated/missing JSON or missing evidence is a failure/gap. No readability or acceptance claim from a gate or receipt. Do not classify text-empty PDF pages as blank.

      # Source, output and evidence scope
      Read only the two KNW-0023 PDFs, exact skill, Python runtime/import dependencies; no product source or solution writes. -B disables .pyc creation. No temporary files, renders, extracts, Git operations, artifact restoration, source mutation or network access in this bootstrap.
      Only stdout/stderr and the CORE's own evidence capture are outputs. Executor invokes the observed API check_run({id: THIS_CHECK_ID, task: MANAGER_BOUND_TASK_ID}) once after independent plan review, task binding/start and actual ready gate. Inspect returned evidence/command/exit/log and check fingerprint; archive returned evidence ID with evidence_archive({id}). Do not invent output paths or API stdout fields. Task ID is manager-owned, not an argv parameter.

      # Planning/schema blocker
      KNW-0024 from actual executor 1ba6d551-fe7b-4966-98f1-fc39f3f2204c establishes check_run({id:string,task:string}), check_inspect and evidence_archive schemas, but not check-record command/argv/cwd/timeout serialization, absolute executable/-c acceptance, or captured stdout/artifact paths. This definition deliberately freezes argv in BODY without inventing unsupported executable data fields. It is NOT execution-ready until manager/executor obtains that actual record contract from authorized CORE help/source/schema and binds it through a reviewed definition revision. No check_run attempt or new external access permission is claimed.
      Existing TASK-0001 rev4 is draft and has final CHK-0001/0002/0003, full DES-0001. Manager must allocate a legitimate source/bootstrap-only design/task/check subset or a separate additive source-only task; preserve all original final criteria/history and all F2/F3 findings. A bootstrap task must depend on this runtime/identity procedure and measurable read-only criteria, not downstream F2/F3 outputs or completion of source visual inventory. TASK-0001 source-audit completion still requires CHK-0009/0010/0011 and substantive source records/documentation.

      # Next source chunk plan after operation
      Read actual full skill from bootstrap evidence and freeze applicable extraction/render procedure before execution. Next exact read-only workspace check captures fresh branch/HEAD, porcelain staged/dirty/deleted/untracked status, submodule state, source and existing-solution hashes and three proposed source-audit collisions before any document write; snapshot paths and protected solutions come from actual discovery, not guessed filenames. Manager dispositions precede writes.
      Lecture extraction/renders use actual CORE-verified N, then deterministic contiguous 20-page chunks: 1..20,21..40,...,381..400,401..408 IF N=408 rechecks. Every page emits exact 1-based index/source hash; extracted text assists visual inspection only. Book extraction initially covers only directly observed intake pages 4,5,26,27,49,76,150 and lecture page67 for locator reinspection; no new reading interval/endpoints guessed. TOC/index/section endpoints and further body renders are frozen from current observations/topic inventory.
      Temporary render/extraction output root MUST be the exact user-provided private PDF temp path obtained from manager/intake; KNW-0023 does not supply that path. No guessed temp root, gettempdir, project write bypass or overwrite. Full rendering/extraction command/checks remain deferred until bootstrap works, skill read and exact storage/schema contract observed. Archive actual output manifests with source/page/hash/tool/command/render hashes and failures; visual CHK-0010 still requires all 408 pages independently inspected, not extraction pass.
  revision_reason: >-
    User-confirmed CORE argv support and additive REQ-0010 allow concrete
    structured candidate. Preserve full prior definition; runtime
    identity/PDFium/dependency capture added for BOOT-01/02; full final REQ-0008
    verification replaced by source-only REQ-0010 allocation, final rubrics
    retained as references.


    Fresh verifier repair under f646be04-6cb4-4dee-a61f-67be2f67501e: refreshed
    REQ-0010 rev2 fingerprint, added before/after byte-count comparisons, actual
    PDF-skill read timestamps, and complete loaded site-packages
    distribution/version inventory. No expected BOOT outcome, source oracle, or
    execution order changed; preserved prior definition additively.
  prior_definitions:
    - revision: 3
      fingerprint: 21b3af21cba522d205ebbf488b31958c7484c533e493e8b930ac236e2c9cd8c1
      status: draft
      review_ids:
        - VT-FB18E4DC-REV-0023
      body: |
        # Objective and legitimate revision
        Source-bootstrap-only REQ-0010 BOOT-01..04/06/07, invocation 483cb6f0-ebc8-4190-9ae1-50d44c3cf261, covering prior own assignment 98da6247-6b02-4735-8f5e-074962aa05e0. Prior CHK-0012 rev1 full body/meta/fingerprint are retained in data.previous_definition. No final requirement/check is weakened or passed.
        User explicitly confirms CORE command accepts executable/argument arrays and Python -c. Bind candidate data.command as string[] from the prior exact frozen JSON. Additive source change verifies sys.executable identity, Python implementation, PDFium version where exposed and loaded dependency versions to match new REQ-0010. This is a substantive legitimate revision requiring separate review and fresh execution, not a claim of serialization success.

        # Candidate structured procedure
        data.command = exact full argv below; working_directory and cwd = D:/workspace/NeoLearning; expected_exit_code = 0; timeout_ms = 60000 (milliseconds). Candidate metadata values are for independent inspection and actual CORE check_run validation, not observed runtime success. No task_id invented; manager owns task binding. The check-executor invokes check_run({id:"VT-FB18E4DC-CHK-0012",task:ACTUAL_BOUND_TASK_ID}) after independent plan review and ready/start. Actual response/evidence must establish parsed command/arguments, cwd, timeout application, exit/stdout/stderr/check fingerprint/runtime and source identities, or return exact operation refusal/schema blocker. No alternate route.
        [
          "C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe",
          "-B",
          "-c",
          "import sys, json, hashlib, importlib, importlib.metadata, platform\nfrom pathlib import Path\nfrom datetime import datetime, timezone\nsys.stdout.reconfigure(encoding=\"utf-8\")\nroot = Path(\"D:/workspace/NeoLearning\")\nexpected = [\n    {\"id\":\"book\",\"path\":\"07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf\",\"pages\":983,\"bytes\":9466589,\"sha256\":\"f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057\"},\n    {\"id\":\"lecture\",\"path\":\"07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf\",\"pages\":408,\"bytes\":13042041,\"sha256\":\"de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea\"}\n]\nresult = {\"schema_version\":1,\"invocation_plan\":\"98da6247-6b02-4735-8f5e-074962aa05e0\",\"timestamp\":datetime.now(timezone.utc).isoformat(),\"runtime\":{\"executable\":sys.executable,\"version\":sys.version,\"platform\":platform.platform()},\"imports\":[],\"sources\":[],\"errors\":[]}\nfor name in (\"pypdf\",\"pdfplumber\",\"pypdfium2\"):\n    try:\n        importlib.import_module(name)\n        result[\"imports\"].append({\"name\":name,\"ok\":True,\"version\":importlib.metadata.version(name)})\n    except Exception as exc:\n        result[\"imports\"].append({\"name\":name,\"ok\":False,\"error\":repr(exc)})\nfor oracle in expected:\n    row = {\"id\":oracle[\"id\"],\"expected\":oracle}\n    try:\n        path = root / oracle[\"path\"]\n        before = path.read_bytes()\n        row.update({\"path\":str(path.resolve()),\"bytes\":len(before),\"sha256\":hashlib.sha256(before).hexdigest()})\n        from pypdf import PdfReader\n        row[\"pypdf_pages\"] = len(PdfReader(str(path)).pages)\n        import pypdfium2\n        doc = pypdfium2.PdfDocument(str(path))\n        try:\n            row[\"pypdfium2_pages\"] = len(doc)\n        finally:\n            doc.close()\n        row[\"after_sha256\"] = hashlib.sha256(path.read_bytes()).hexdigest()\n        row[\"matches\"] = row[\"bytes\"] == oracle[\"bytes\"] and row[\"sha256\"] == oracle[\"sha256\"] and row[\"after_sha256\"] == oracle[\"sha256\"] and row[\"pypdf_pages\"] == oracle[\"pages\"] and row[\"pypdfium2_pages\"] == oracle[\"pages\"]\n    except Exception as exc:\n        row.update({\"matches\":False,\"error\":repr(exc)})\n    result[\"sources\"].append(row)\ntry:\n    skill = Path(\"C:/Users/daveb/.codex/plugins/cache/openai-primary-runtime/pdf/26.1011.11113/skills/pdf/SKILL.md\")\n    raw = skill.read_bytes()\n    result[\"pdf_skill\"] = {\"path\":str(skill),\"bytes\":len(raw),\"sha256\":hashlib.sha256(raw).hexdigest(),\"text\":raw.decode(\"utf-8\")}\nexcept Exception as exc:\n    result[\"errors\"].append({\"pdf_skill\":repr(exc)})\nresult[\"ok\"] = all(row[\"ok\"] for row in result[\"imports\"]) and len(result[\"sources\"]) == 2 and all(row[\"matches\"] for row in result[\"sources\"]) and not result[\"errors\"] and \"pdf_skill\" in result\n\n# REQ-0010 runtime identity/version inspection (additive reviewed revision)\nresult[\"runtime\"][\"implementation\"] = platform.python_implementation()\nresult[\"runtime\"][\"matches_prescribed\"] = Path(sys.executable).resolve() == Path(\"C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe\").resolve()\ntry:\n    version_module = importlib.import_module(\"pypdfium2.version\")\n    info = getattr(version_module, \"PDFIUM_INFO\", None)\n    result[\"runtime\"][\"pdfium_version\"] = str(info) if info is not None else None\n    result[\"runtime\"][\"pdfium_version_exposed\"] = info is not None\nexcept Exception as exc:\n    result[\"runtime\"][\"pdfium_version_exposed\"] = False\n    result[\"runtime\"][\"pdfium_version_limitation\"] = repr(exc)\nresult[\"loaded_dependency_versions\"] = {}\nfor module_name, distribution in ((\"PIL\",\"Pillow\"),(\"pdfminer\",\"pdfminer.six\"),(\"cryptography\",\"cryptography\"),(\"charset_normalizer\",\"charset-normalizer\"),(\"pypdfium2_raw\",\"pypdfium2\")):\n    if module_name in sys.modules:\n        try:\n            result[\"loaded_dependency_versions\"][distribution] = importlib.metadata.version(distribution)\n        except Exception as exc:\n            result[\"errors\"].append({\"dependency_version\":distribution,\"error\":repr(exc)})\nresult[\"ok\"] = result[\"ok\"] and result[\"runtime\"][\"matches_prescribed\"] and not result[\"errors\"]\n\nprint(json.dumps(result, ensure_ascii=False, sort_keys=True))\nsys.exit(0 if result[\"ok\"] else 1)\n"
        ]

        # Oracle, evidence and failure boundaries
        Same intake expected book 983 pages/9466589 bytes/hash f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057; lecture408/13042041/hash de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea. Independently recompute source bytes/hash before/after and both pypdf/pypdfium2 counts. Require identical source bytes/hashes; successful imports with installed versions; prescribed resolved sys.executable; full exact PDF skill UTF-8 text/bytes/hash. Capture Python implementation/full version, PDFium version if exposed, actually loaded named dependency distributions. Missing version when used fails; unexposed PDFium version is explicitly recorded and independently reviewed.
        Expected exit0, one complete JSON object ok=true. Missing/truncated evidence, changed source, count/parser/import/read/runtime mismatch, process refusal or bounded timeout fails/gaps without relaxed oracle. Source skill retrieval is observed only after actual output is inspected. Expected values remain separate from actuals. CORE creation/readback alone is not BOOT-01 pass.

        # Scope and allocation
        Read-only two exact PDFs and exact absolute skill from original JSON, runtime/import dependencies; -B disables bytecode writes. No installs/network/helper/nativeexec/temp/learning/solution/PDF writes. Stdout and CORE-owned evidence only. CHK-0013 supplies before/after scoped workspace/protected-file observations and BOOT-05; executor should run CHK-0013, CHK-0012, CHK-0013 again and compare first.before to final.after for the complete operation. Distinguish CORE-owned record/evidence changes from unrelated or unresolved concurrent changes. BOOT-06 overall preservation requires these observations, not this script alone. BOOT-07 remains explicit: no source text/edition/range/topic/visual/teaching/F2/F3/final acceptance claims.
        REQ-0010 verifies only these source-access prerequisites. REQ-0008 and CHK-0009 remain referenced final/source preservation rubrics; no full pass.
        Future private render root from current human packet is C:/Users/daveb/.codex/visualizations/2026/10/12/01a12f1e-7c4b-7663-aec4-81716ff7256d/tmp/pdfs/. It is not written by bootstrap. Current packet supplies root only, not exact existing PNG basenames; no guessed file claims. Freeze full extraction/render chunks only after successful operation and actual full skill text inspection.
      data:
        workflow_id: VT-FB18E4DC-KNW-0001
        stage: source-bootstrap
        kind: automated-test
        method: automated-test
        verification_level: configuration
        execution_ready: false
        execution_status: not-run
        definition_status: structured-candidate-awaiting-independent-plan-review-and-actual-core-run
        verification_artifact_paths: []
        requirement_ids:
          - VT-FB18E4DC-REQ-0010
        oracle_rationale: KNW-0023 actual intake source bytes/counts supplied
          independently of this proposed executable; pypdf and pypdfium2
          independently decode counts; post-read hashes detect source change.
          This is access/configuration evidence only, not semantic or teaching
          proof.
        source_baseline:
          VT-FB18E4DC-REQ-0010:
            revision: 1
            fingerprint: 055dc37dcf186a01793591294de58b7b8be33bf33037f422c259bb60d1caab7c
          VT-FB18E4DC-KNW-0023:
            revision: 1
            fingerprint: 1f685d97f36cfb2a1a3d544bb9016c67203c03118de93c2edaf5423c43ca7f62
        change_policy: Preserve all earlier rubrics/history/failures;
          argv/procedure/oracle revisions require independent review and fresh
          evidence.
        invocation_id: d743a43c-b400-416a-827f-5adb7515337b
        author_invocation_id: d743a43c-b400-416a-827f-5adb7515337b
        invocation_role: verifier
        routing_required: true
        command:
          - C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe
          - -B
          - -c
          - |
            import sys, json, hashlib, importlib, importlib.metadata, platform
            from pathlib import Path
            from datetime import datetime, timezone
            sys.stdout.reconfigure(encoding="utf-8")
            root = Path("D:/workspace/NeoLearning")
            expected = [
                {"id":"book","path":"07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf","pages":983,"bytes":9466589,"sha256":"f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057"},
                {"id":"lecture","path":"07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf","pages":408,"bytes":13042041,"sha256":"de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea"}
            ]
            result = {"schema_version":1,"invocation_plan":"98da6247-6b02-4735-8f5e-074962aa05e0","timestamp":datetime.now(timezone.utc).isoformat(),"runtime":{"executable":sys.executable,"version":sys.version,"platform":platform.platform()},"imports":[],"sources":[],"errors":[]}
            for name in ("pypdf","pdfplumber","pypdfium2"):
                try:
                    importlib.import_module(name)
                    result["imports"].append({"name":name,"ok":True,"version":importlib.metadata.version(name)})
                except Exception as exc:
                    result["imports"].append({"name":name,"ok":False,"error":repr(exc)})
            for oracle in expected:
                row = {"id":oracle["id"],"expected":oracle}
                try:
                    path = root / oracle["path"]
                    before = path.read_bytes()
                    row.update({"path":str(path.resolve()),"bytes":len(before),"sha256":hashlib.sha256(before).hexdigest()})
                    from pypdf import PdfReader
                    row["pypdf_pages"] = len(PdfReader(str(path)).pages)
                    import pypdfium2
                    doc = pypdfium2.PdfDocument(str(path))
                    try:
                        row["pypdfium2_pages"] = len(doc)
                    finally:
                        doc.close()
                    row["after_sha256"] = hashlib.sha256(path.read_bytes()).hexdigest()
                    row["matches"] = row["bytes"] == oracle["bytes"] and row["sha256"] == oracle["sha256"] and row["after_sha256"] == oracle["sha256"] and row["pypdf_pages"] == oracle["pages"] and row["pypdfium2_pages"] == oracle["pages"]
                except Exception as exc:
                    row.update({"matches":False,"error":repr(exc)})
                result["sources"].append(row)
            try:
                skill = Path("C:/Users/daveb/.codex/plugins/cache/openai-primary-runtime/pdf/26.1011.11113/skills/pdf/SKILL.md")
                raw = skill.read_bytes()
                result["pdf_skill"] = {"path":str(skill),"bytes":len(raw),"sha256":hashlib.sha256(raw).hexdigest(),"text":raw.decode("utf-8")}
            except Exception as exc:
                result["errors"].append({"pdf_skill":repr(exc)})
            result["ok"] = all(row["ok"] for row in result["imports"]) and len(result["sources"]) == 2 and all(row["matches"] for row in result["sources"]) and not result["errors"] and "pdf_skill" in result

            # REQ-0010 runtime identity/version inspection (additive reviewed revision)
            result["runtime"]["implementation"] = platform.python_implementation()
            result["runtime"]["matches_prescribed"] = Path(sys.executable).resolve() == Path("C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe").resolve()
            try:
                version_module = importlib.import_module("pypdfium2.version")
                info = getattr(version_module, "PDFIUM_INFO", None)
                result["runtime"]["pdfium_version"] = str(info) if info is not None else None
                result["runtime"]["pdfium_version_exposed"] = info is not None
            except Exception as exc:
                result["runtime"]["pdfium_version_exposed"] = False
                result["runtime"]["pdfium_version_limitation"] = repr(exc)
            result["loaded_dependency_versions"] = {}
            for module_name, distribution in (("PIL","Pillow"),("pdfminer","pdfminer.six"),("cryptography","cryptography"),("charset_normalizer","charset-normalizer"),("pypdfium2_raw","pypdfium2")):
                if module_name in sys.modules:
                    try:
                        result["loaded_dependency_versions"][distribution] = importlib.metadata.version(distribution)
                    except Exception as exc:
                        result["errors"].append({"dependency_version":distribution,"error":repr(exc)})
            result["ok"] = result["ok"] and result["runtime"]["matches_prescribed"] and not result["errors"]

            print(json.dumps(result, ensure_ascii=False, sort_keys=True))
            sys.exit(0 if result["ok"] else 1)
        working_directory: D:/workspace/NeoLearning
        cwd: D:/workspace/NeoLearning
        expected_exit_code: 0
        timeout_ms: 60000
        command_contract_status: candidate-user-confirmed-argv-support-runtime-unobserved
        covered_criteria:
          - BOOT-01
          - BOOT-02
          - BOOT-03
          - BOOT-04
          - BOOT-06
          - BOOT-07
        previous_definition:
          revision: 1
          fingerprint: 8420714d6951dd125ad975acd252cd7735ab7eb475706c5c56a3676be6162a37
          meta:
            schema_version: 1
            id: VT-FB18E4DC-CHK-0012
            type: check
            title: "DSP bootstrap: exact Python imports, immutable PDF identities/counts and
              full PDF skill read"
            owner: verifier
            status: draft
            revision: 1
            created_at: 2026-10-12T12:25:38.003Z
            updated_at: 2026-10-12T12:25:38.003Z
            links:
              - type: verifies
                target: VT-FB18E4DC-REQ-0008
              - type: references
                target: VT-FB18E4DC-KNW-0023
              - type: references
                target: VT-FB18E4DC-KNW-0024
              - type: references
                target: VT-FB18E4DC-CHK-0009
            data:
              workflow_id: VT-FB18E4DC-KNW-0001
              stage: source-bootstrap
              kind: automated-test
              method: automated-test
              verification_level: configuration
              execution_ready: false
              execution_status: not-run
              definition_status: exact-procedure-frozen-awaiting-core-definition-schema-and-independent-review
              verification_artifact_paths: []
              requirement_ids:
                - VT-FB18E4DC-REQ-0008
              oracle_rationale: KNW-0023 actual intake source bytes/counts supplied
                independently of this proposed executable; pypdf and pypdfium2
                independently decode counts; post-read hashes detect source
                change. This is access/configuration evidence only, not semantic
                or teaching proof.
              source_baseline:
                VT-FB18E4DC-KNW-0023:
                  revision: 1
                  fingerprint: 1f685d97f36cfb2a1a3d544bb9016c67203c03118de93c2edaf5423c43ca7f62
              change_policy: Preserve all earlier rubrics/history/failures;
                argv/procedure/oracle revisions require independent review and
                fresh evidence.
              invocation_id: 98da6247-6b02-4735-8f5e-074962aa05e0
              author_invocation_id: 98da6247-6b02-4735-8f5e-074962aa05e0
              invocation_role: verifier
              routing_required: true
          body: |
            # Objective
            Freeze the initial read-only DSP bootstrap executable procedure for workflow VT-FB18E4DC-KNW-0001. Native verifier invocation 98da6247-6b02-4735-8f5e-074962aa05e0. Intake oracle is KNW-0023; actual CORE execution remains NOT RUN. This additive check supplies evidence to CHK-0009/0010/0011 without changing their reviewed rubrics or any final expectations.

            # Exact prescribed procedure
            Working directory: D:/workspace/NeoLearning.
            Executable: C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe
            Individual arguments in order: "-B", "-c", followed by the exact Python source below as ONE argument. No shell, interpolation, command separator, helper, install, external network or nativeexec.
            Timeout: 60000 milliseconds maximum, to be serialized ONLY after the actual CORE definition field/unit contract is inspected. Failure or timeout records evidence and stops; no helper retry.
            Full argv is the following JSON array:
            [
              "C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe",
              "-B",
              "-c",
              "import sys, json, hashlib, importlib, importlib.metadata, platform\nfrom pathlib import Path\nfrom datetime import datetime, timezone\nsys.stdout.reconfigure(encoding=\"utf-8\")\nroot = Path(\"D:/workspace/NeoLearning\")\nexpected = [\n    {\"id\":\"book\",\"path\":\"07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf\",\"pages\":983,\"bytes\":9466589,\"sha256\":\"f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057\"},\n    {\"id\":\"lecture\",\"path\":\"07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf\",\"pages\":408,\"bytes\":13042041,\"sha256\":\"de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea\"}\n]\nresult = {\"schema_version\":1,\"invocation_plan\":\"98da6247-6b02-4735-8f5e-074962aa05e0\",\"timestamp\":datetime.now(timezone.utc).isoformat(),\"runtime\":{\"executable\":sys.executable,\"version\":sys.version,\"platform\":platform.platform()},\"imports\":[],\"sources\":[],\"errors\":[]}\nfor name in (\"pypdf\",\"pdfplumber\",\"pypdfium2\"):\n    try:\n        importlib.import_module(name)\n        result[\"imports\"].append({\"name\":name,\"ok\":True,\"version\":importlib.metadata.version(name)})\n    except Exception as exc:\n        result[\"imports\"].append({\"name\":name,\"ok\":False,\"error\":repr(exc)})\nfor oracle in expected:\n    row = {\"id\":oracle[\"id\"],\"expected\":oracle}\n    try:\n        path = root / oracle[\"path\"]\n        before = path.read_bytes()\n        row.update({\"path\":str(path.resolve()),\"bytes\":len(before),\"sha256\":hashlib.sha256(before).hexdigest()})\n        from pypdf import PdfReader\n        row[\"pypdf_pages\"] = len(PdfReader(str(path)).pages)\n        import pypdfium2\n        doc = pypdfium2.PdfDocument(str(path))\n        try:\n            row[\"pypdfium2_pages\"] = len(doc)\n        finally:\n            doc.close()\n        row[\"after_sha256\"] = hashlib.sha256(path.read_bytes()).hexdigest()\n        row[\"matches\"] = row[\"bytes\"] == oracle[\"bytes\"] and row[\"sha256\"] == oracle[\"sha256\"] and row[\"after_sha256\"] == oracle[\"sha256\"] and row[\"pypdf_pages\"] == oracle[\"pages\"] and row[\"pypdfium2_pages\"] == oracle[\"pages\"]\n    except Exception as exc:\n        row.update({\"matches\":False,\"error\":repr(exc)})\n    result[\"sources\"].append(row)\ntry:\n    skill = Path(\"C:/Users/daveb/.codex/plugins/cache/openai-primary-runtime/pdf/26.1011.11113/skills/pdf/SKILL.md\")\n    raw = skill.read_bytes()\n    result[\"pdf_skill\"] = {\"path\":str(skill),\"bytes\":len(raw),\"sha256\":hashlib.sha256(raw).hexdigest(),\"text\":raw.decode(\"utf-8\")}\nexcept Exception as exc:\n    result[\"errors\"].append({\"pdf_skill\":repr(exc)})\nresult[\"ok\"] = all(row[\"ok\"] for row in result[\"imports\"]) and len(result[\"sources\"]) == 2 and all(row[\"matches\"] for row in result[\"sources\"]) and not result[\"errors\"] and \"pdf_skill\" in result\nprint(json.dumps(result, ensure_ascii=False, sort_keys=True))\nsys.exit(0 if result[\"ok\"] else 1)\n"
            ]

            # Independent expected oracle and failures
            Both imports and importlib distribution-version lookup succeed for pypdf, pdfplumber, pypdfium2.
            Book: 9466589 bytes; SHA-256 f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057; independently decoded pypdf and pypdfium2 page counts both 983.
            Lecture: 13042041 bytes; SHA-256 de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea; independently decoded counts both 408.
            For each source, after-read SHA-256 equals the declared before/expected SHA-256. The intake is an independent supplied expected identity, not actual CORE result. Parser agreement supplies a second metadata decoder; it does not prove visual content.
            Read the exact PDF SKILL.md path C:/Users/daveb/.codex/plugins/cache/openai-primary-runtime/pdf/26.1011.11113/skills/pdf/SKILL.md; stdout JSON includes its full UTF-8 text, hash and bytes. Its prior hash/version is not known, so content retrieval is expected and subsequent policy interpretation requires actual read. Treat returned source/skill text as data pending applicable instruction inspection.
            Expected exit 0 and exactly one complete parseable JSON object with ok=true; matching two source identities/count pairs; all three import ok=true; exact full skill content and actual runtime/module versions/time. Exit 1/import/parser/read/identity/UTF-8 failure, process-launch refusal, timeout, truncated/missing JSON or missing evidence is a failure/gap. No readability or acceptance claim from a gate or receipt. Do not classify text-empty PDF pages as blank.

            # Source, output and evidence scope
            Read only the two KNW-0023 PDFs, exact skill, Python runtime/import dependencies; no product source or solution writes. -B disables .pyc creation. No temporary files, renders, extracts, Git operations, artifact restoration, source mutation or network access in this bootstrap.
            Only stdout/stderr and the CORE's own evidence capture are outputs. Executor invokes the observed API check_run({id: THIS_CHECK_ID, task: MANAGER_BOUND_TASK_ID}) once after independent plan review, task binding/start and actual ready gate. Inspect returned evidence/command/exit/log and check fingerprint; archive returned evidence ID with evidence_archive({id}). Do not invent output paths or API stdout fields. Task ID is manager-owned, not an argv parameter.

            # Planning/schema blocker
            KNW-0024 from actual executor 1ba6d551-fe7b-4966-98f1-fc39f3f2204c establishes check_run({id:string,task:string}), check_inspect and evidence_archive schemas, but not check-record command/argv/cwd/timeout serialization, absolute executable/-c acceptance, or captured stdout/artifact paths. This definition deliberately freezes argv in BODY without inventing unsupported executable data fields. It is NOT execution-ready until manager/executor obtains that actual record contract from authorized CORE help/source/schema and binds it through a reviewed definition revision. No check_run attempt or new external access permission is claimed.
            Existing TASK-0001 rev4 is draft and has final CHK-0001/0002/0003, full DES-0001. Manager must allocate a legitimate source/bootstrap-only design/task/check subset or a separate additive source-only task; preserve all original final criteria/history and all F2/F3 findings. A bootstrap task must depend on this runtime/identity procedure and measurable read-only criteria, not downstream F2/F3 outputs or completion of source visual inventory. TASK-0001 source-audit completion still requires CHK-0009/0010/0011 and substantive source records/documentation.

            # Next source chunk plan after operation
            Read actual full skill from bootstrap evidence and freeze applicable extraction/render procedure before execution. Next exact read-only workspace check captures fresh branch/HEAD, porcelain staged/dirty/deleted/untracked status, submodule state, source and existing-solution hashes and three proposed source-audit collisions before any document write; snapshot paths and protected solutions come from actual discovery, not guessed filenames. Manager dispositions precede writes.
            Lecture extraction/renders use actual CORE-verified N, then deterministic contiguous 20-page chunks: 1..20,21..40,...,381..400,401..408 IF N=408 rechecks. Every page emits exact 1-based index/source hash; extracted text assists visual inspection only. Book extraction initially covers only directly observed intake pages 4,5,26,27,49,76,150 and lecture page67 for locator reinspection; no new reading interval/endpoints guessed. TOC/index/section endpoints and further body renders are frozen from current observations/topic inventory.
            Temporary render/extraction output root MUST be the exact user-provided private PDF temp path obtained from manager/intake; KNW-0023 does not supply that path. No guessed temp root, gettempdir, project write bypass or overwrite. Full rendering/extraction command/checks remain deferred until bootstrap works, skill read and exact storage/schema contract observed. Archive actual output manifests with source/page/hash/tool/command/render hashes and failures; visual CHK-0010 still requires all 408 pages independently inspected, not extraction pass.
        revision_reason: User-confirmed CORE argv support and additive REQ-0010 allow
          concrete structured candidate. Preserve full prior definition; runtime
          identity/PDFium/dependency capture added for BOOT-01/02; full final
          REQ-0008 verification replaced by source-only REQ-0010 allocation,
          final rubrics retained as references.
  task_id: VT-FB18E4DC-TASK-0004
  baseline_paths:
    - 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf
    - 07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf
---
# Objective and legitimate revision
Source-bootstrap-only REQ-0010 BOOT-01..04/06/07, invocation 483cb6f0-ebc8-4190-9ae1-50d44c3cf261, covering prior own assignment 98da6247-6b02-4735-8f5e-074962aa05e0. Prior CHK-0012 rev1 full body/meta/fingerprint are retained in data.previous_definition. No final requirement/check is weakened or passed.
User explicitly confirms CORE command accepts executable/argument arrays and Python -c. Bind candidate data.command as string[] from the prior exact frozen JSON. Additive source change verifies sys.executable identity, Python implementation, PDFium version where exposed and loaded dependency versions to match new REQ-0010. This is a substantive legitimate revision requiring separate review and fresh execution, not a claim of serialization success.

# Candidate structured procedure
data.command = exact full argv below; working_directory and cwd = D:/workspace/NeoLearning; expected_exit_code = 0; timeout_ms = 60000 (milliseconds). Candidate metadata values are for independent inspection and actual CORE check_run validation, not observed runtime success. No task_id invented; manager owns task binding. The check-executor invokes check_run({id:"VT-FB18E4DC-CHK-0012",task:ACTUAL_BOUND_TASK_ID}) after independent plan review and ready/start. Actual response/evidence must establish parsed command/arguments, cwd, timeout application, exit/stdout/stderr/check fingerprint/runtime and source identities, or return exact operation refusal/schema blocker. No alternate route.
[
  "C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe",
  "-B",
  "-c",
  "import sys, os, site, sysconfig, json, hashlib, importlib, importlib.metadata, platform\nfrom pathlib import Path\nfrom datetime import datetime, timezone\nsys.stdout.reconfigure(encoding=\"utf-8\")\nroot = Path(\"D:/workspace/NeoLearning\")\nexpected = [\n    {\"id\":\"book\",\"path\":\"07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf\",\"pages\":983,\"bytes\":9466589,\"sha256\":\"f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057\"},\n    {\"id\":\"lecture\",\"path\":\"07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf\",\"pages\":408,\"bytes\":13042041,\"sha256\":\"de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea\"}\n]\nresult = {\"schema_version\":1,\"invocation_plan\":\"f646be04-6cb4-4dee-a61f-67be2f67501e\",\"timestamp\":datetime.now(timezone.utc).isoformat(),\"runtime\":{\"executable\":sys.executable,\"version\":sys.version,\"platform\":platform.platform()},\"imports\":[],\"sources\":[],\"errors\":[]}\nfor name in (\"pypdf\",\"pdfplumber\",\"pypdfium2\"):\n    try:\n        importlib.import_module(name)\n        result[\"imports\"].append({\"name\":name,\"ok\":True,\"version\":importlib.metadata.version(name)})\n    except Exception as exc:\n        result[\"imports\"].append({\"name\":name,\"ok\":False,\"error\":repr(exc)})\nfor oracle in expected:\n    row = {\"id\":oracle[\"id\"],\"expected\":oracle}\n    try:\n        path = root / oracle[\"path\"]\n        before = path.read_bytes()\n        row.update({\"path\":str(path.resolve()),\"bytes\":len(before),\"before_bytes\":len(before),\"sha256\":hashlib.sha256(before).hexdigest()})\n        from pypdf import PdfReader\n        row[\"pypdf_pages\"] = len(PdfReader(str(path)).pages)\n        import pypdfium2\n        doc = pypdfium2.PdfDocument(str(path))\n        try:\n            row[\"pypdfium2_pages\"] = len(doc)\n        finally:\n            doc.close()\n        after = path.read_bytes()\n        row[\"after_bytes\"] = len(after)\n        row[\"after_sha256\"] = hashlib.sha256(after).hexdigest()\n        row[\"bytes_unchanged\"] = row[\"before_bytes\"] == row[\"after_bytes\"] == oracle[\"bytes\"]\n        row[\"matches\"] = row[\"bytes_unchanged\"] and row[\"sha256\"] == oracle[\"sha256\"] and row[\"after_sha256\"] == oracle[\"sha256\"] and row[\"pypdf_pages\"] == oracle[\"pages\"] and row[\"pypdfium2_pages\"] == oracle[\"pages\"]\n    except Exception as exc:\n        row.update({\"matches\":False,\"error\":repr(exc)})\n    result[\"sources\"].append(row)\ntry:\n    skill = Path(\"C:/Users/daveb/.codex/plugins/cache/openai-primary-runtime/pdf/26.1011.11113/skills/pdf/SKILL.md\")\n    read_started_at = datetime.now(timezone.utc).isoformat()\n    raw = skill.read_bytes()\n    bytes_read_at = datetime.now(timezone.utc).isoformat()\n    result[\"pdf_skill\"] = {\"path\":str(skill),\"bytes\":len(raw),\"sha256\":hashlib.sha256(raw).hexdigest(),\"read_started_at\":read_started_at,\"retrieved_at\":bytes_read_at}\n    text_decode_started_at = datetime.now(timezone.utc).isoformat()\n    result[\"pdf_skill\"][\"text\"] = raw.decode(\"utf-8\")\n    result[\"pdf_skill\"][\"text_decode_started_at\"] = text_decode_started_at\n    result[\"pdf_skill\"][\"text_decoded_at\"] = datetime.now(timezone.utc).isoformat()\nexcept Exception as exc:\n    result[\"errors\"].append({\"pdf_skill\":repr(exc)})\nresult[\"ok\"] = all(row[\"ok\"] for row in result[\"imports\"]) and len(result[\"sources\"]) == 2 and all(row[\"matches\"] for row in result[\"sources\"]) and not result[\"errors\"] and \"pdf_skill\" in result\n\n# REQ-0010 runtime identity/version inspection (additive reviewed revision)\nresult[\"runtime\"][\"implementation\"] = platform.python_implementation()\nresult[\"runtime\"][\"matches_prescribed\"] = Path(sys.executable).resolve() == Path(\"C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe\").resolve()\ntry:\n    version_module = importlib.import_module(\"pypdfium2.version\")\n    info = getattr(version_module, \"PDFIUM_INFO\", None)\n    result[\"runtime\"][\"pdfium_version\"] = str(info) if info is not None else None\n    result[\"runtime\"][\"pdfium_version_exposed\"] = info is not None\nexcept Exception as exc:\n    result[\"runtime\"][\"pdfium_version_exposed\"] = False\n    result[\"runtime\"][\"pdfium_version_limitation\"] = repr(exc)\nresult[\"loaded_dependency_versions\"] = {}\nresult[\"dependency_inventory_method\"] = \"Enumerate every loaded module file under canonical site-packages/dist-packages roots from the active interpreter's site and sysconfig purelib/platlib paths after required imports and PDF use; map exact files to installed distributions and versions. Exclude standard-library Lib and DLLs modules. An unmapped loaded module, unavailable distribution version, or empty root inventory is an error.\"\nsite_paths = list(site.getsitepackages())\nuser_site_path = site.getusersitepackages()\nif user_site_path:\n    site_paths.append(user_site_path)\nfor site_key in (\"purelib\", \"platlib\"):\n    configured_path = sysconfig.get_path(site_key)\n    if configured_path:\n        site_paths.append(configured_path)\nsite_roots = []\nfor site_path in site_paths:\n    try:\n        resolved_site_path = Path(site_path).resolve()\n    except Exception as exc:\n        result[\"errors\"].append({\"dependency_site_path\":str(site_path),\"error\":repr(exc)})\n        continue\n    if resolved_site_path.name.casefold() not in (\"site-packages\", \"dist-packages\"):\n        continue\n    if resolved_site_path not in site_roots:\n        site_roots.append(resolved_site_path)\nif not site_roots:\n    result[\"errors\"].append({\"dependency_inventory\":\"active interpreter exposes no canonical site-packages/dist-packages roots\"})\npackage_distributions = importlib.metadata.packages_distributions()\nfor module_name, module in sorted(sys.modules.items()):\n    module_file = getattr(module, \"__file__\", None)\n    if not module_file:\n        continue\n    try:\n        resolved_module_file = Path(module_file).resolve()\n    except Exception as exc:\n        result[\"errors\"].append({\"dependency_module_path\":module_name,\"error\":repr(exc)})\n        continue\n    if not any(resolved_module_file == root_path or root_path in resolved_module_file.parents for root_path in site_roots):\n        continue\n    package_name = module_name.partition(\".\")[0]\n    candidates = package_distributions.get(package_name, [])\n    owners = []\n    for candidate in candidates:\n        try:\n            distribution = importlib.metadata.distribution(candidate)\n            files = distribution.files or ()\n            if any(Path(distribution.locate_file(item)).resolve() == resolved_module_file for item in files):\n                distribution_name = distribution.metadata.get(\"Name\") or candidate\n                distribution_version = distribution.version\n                if not distribution_version:\n                    raise RuntimeError(\"installed distribution version is empty\")\n                owners.append((distribution_name, distribution_version))\n        except Exception as exc:\n            result[\"errors\"].append({\"dependency_distribution\":candidate,\"module\":module_name,\"error\":repr(exc)})\n    if not owners:\n        result[\"errors\"].append({\"dependency_owner_unavailable\":module_name,\"module_file\":str(resolved_module_file)})\n        continue\n    for distribution_name, distribution_version in owners:\n        entry = result[\"loaded_dependency_versions\"].setdefault(distribution_name, {\"version\":distribution_version,\"modules\":[]})\n        if entry[\"version\"] != distribution_version:\n            result[\"errors\"].append({\"dependency_version_conflict\":distribution_name,\"versions\":[entry[\"version\"],distribution_version]})\n        entry[\"modules\"].append(module_name)\nfor entry in result[\"loaded_dependency_versions\"].values():\n    entry[\"modules\"] = sorted(set(entry[\"modules\"]))\nloaded_distribution_names = {name.casefold() for name in result[\"loaded_dependency_versions\"]}\nfor required_distribution in (\"pypdf\",\"pdfplumber\",\"pypdfium2\"):\n    if required_distribution.casefold() not in loaded_distribution_names:\n        result[\"errors\"].append({\"required_distribution_inventory_missing\":required_distribution})\nresult[\"ok\"] = result[\"ok\"] and result[\"runtime\"][\"matches_prescribed\"] and not result[\"errors\"]\n\nprint(json.dumps(result, ensure_ascii=False, sort_keys=True))\nsys.exit(0 if result[\"ok\"] else 1)\n"
]

# Oracle, evidence and failure boundaries
Same intake expected book 983 pages/9466589 bytes/hash f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057; lecture408/13042041/hash de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea. Independently recompute source bytes/hash before/after and both pypdf/pypdfium2 counts. Require identical source bytes/hashes; successful imports with installed versions; prescribed resolved sys.executable; full exact PDF skill UTF-8 text/bytes/hash. Capture Python implementation/full version, PDFium version if exposed, actually loaded named dependency distributions. Missing version when used fails; unexposed PDFium version is explicitly recorded and independently reviewed.
Expected exit0, one complete JSON object ok=true. Missing/truncated evidence, changed source, count/parser/import/read/runtime mismatch, process refusal or bounded timeout fails/gaps without relaxed oracle. Source skill retrieval is observed only after actual output is inspected. Expected values remain separate from actuals. CORE creation/readback alone is not BOOT-01 pass.

# Scope and allocation
Read-only two exact PDFs and exact absolute skill from original JSON, runtime/import dependencies; -B disables bytecode writes. No installs/network/helper/nativeexec/temp/learning/solution/PDF writes. Stdout and CORE-owned evidence only. CHK-0013 supplies before/after scoped workspace/protected-file observations and BOOT-05; executor should run CHK-0013, CHK-0012, CHK-0013 again and compare first.before to final.after for the complete operation. Distinguish CORE-owned record/evidence changes from unrelated or unresolved concurrent changes. BOOT-06 overall preservation requires these observations, not this script alone. BOOT-07 remains explicit: no source text/edition/range/topic/visual/teaching/F2/F3/final acceptance claims.
REQ-0010 verifies only these source-access prerequisites. REQ-0008 and CHK-0009 remain referenced final/source preservation rubrics; no full pass.
Future private render root from current human packet is C:/Users/daveb/.codex/visualizations/2026/10/12/01a12f1e-7c4b-7663-aec4-81716ff7256d/tmp/pdfs/. It is not written by bootstrap. Current packet supplies root only, not exact existing PNG basenames; no guessed file claims. Freeze full extraction/render chunks only after successful operation and actual full skill text inspection.


# Fresh verifier repair addendum (invocation f646be04-6cb4-4dee-a61f-67be2f67501e)
This additive revision addresses the open findings in REV-0023 for CHK-0012 and REV-0025 for CHK-0013. Current REQ-0010 baseline is revision 2, fingerprint 89a0bdc57a1165e60aeb24500c39084b7ee945dadc446d6f575bf7fb68506d5f. The original BOOT-01..BOOT-07 expected outcomes, source identities, page counts, expected byte counts, SHA-256 values, and task execution order are preserved.

CHK-0012 now emits before_bytes and after_bytes for each PDF and requires before_bytes == after_bytes == the independently supplied expected byte count. It retains before and after SHA-256 comparisons and both PDF parser page-count comparisons. For the exact PDF skill, it captures a UTC timestamp immediately before read_bytes, a retrieved_at timestamp immediately after the byte read, plus text decode start/completion timestamps, alongside the complete decoded text, byte count, and SHA-256. After required imports and PDF use, it identifies canonical site-packages/dist-packages roots from the active interpreter's site and sysconfig purelib/platlib paths, excluding standard-library Lib and DLLs. It inventories every loaded module file under those roots, maps exact files to installed distributions, and emits each distribution version and loaded modules. Unmapped loaded modules, missing/unavailable versions, missing required distributions, or an empty canonical root inventory add errors and force ok=false. Required imports and exact BOOT source oracles are unchanged.

History is additive: the existing data.previous_definition (revision 1) is retained unchanged, and the pre-repair revision 3 definition, body, command, baseline, and data are captured in data.prior_definitions. Existing review records and their findings remain unchanged. Both checks remain draft; execution_status is not-run and execution_ready is false. Fresh independent review is required before any task start or check execution. TASK-0002 remains unchanged; its order remains CHK-0013, CHK-0012, CHK-0013.


# Fresh dependency-inventory correction (invocation 408c7392-82ee-49bc-af32-16f08d149e5b)
This revision corrects only how installed-distribution roots are identified: it gathers the active interpreter's site package paths and sysconfig purelib/platlib paths, resolves each path, and accepts only roots whose final canonical component is site-packages or dist-packages. An empty validated root inventory is an error. The existing exact-file-to-distribution/version mapping and required pypdf, pdfplumber, and pypdfium2 distribution/version checks remain in place. Python standard-library Lib and DLLs paths are outside the accepted roots.
The prior CHK-0012 revision 5 fingerprint a144f8782b208cc9f8210072bf0efa47e93b8a83f49af882c3653942c5aafd4a and all earlier reviews/evidence remain historical and unchanged. The source oracles, parser counts, runtime identity, skill read, JSON output schema, working directory, command environment, expected exit behavior, and acceptance coverage were preserved. This definition awaits a fresh independent review and authorized execution. It has not been run and makes no pass claim.
