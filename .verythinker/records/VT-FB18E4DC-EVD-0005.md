---
schema_version: 1
id: VT-FB18E4DC-EVD-0005
type: evidence
title: "pass: DSP bootstrap: exact Python imports, immutable PDF
  identities/counts and full PDF skill read"
owner: verifier
status: verified
revision: 2
created_at: 2026-10-14T04:24:23.639Z
updated_at: 2026-10-14T04:24:28.214Z
links:
  - type: evidence-for
    target: VT-FB18E4DC-CHK-0012
  - type: documents
    target: VT-FB18E4DC-TASK-0004
data:
  schema_version: 1
  execution_invocation_id: 78ba19c1-f34c-408c-a882-145675696c5e
  run_id: 13f8ca59-7598-4a3d-96d5-30b39208eb96
  task_id: VT-FB18E4DC-TASK-0004
  check_id: VT-FB18E4DC-CHK-0012
  check_fingerprint: 92336426c44d434d531ed06a5c4413dc69e115c5e68d73759e53e47791ee62bd
  record_baseline:
    VT-FB18E4DC-TASK-0004: f5aa9378c074a2dbfae7a82ee5e68cf937f176f5f0a61fe553df9aade3a5270d
    VT-FB18E4DC-REQ-0010: 89a0bdc57a1165e60aeb24500c39084b7ee945dadc446d6f575bf7fb68506d5f
    VT-FB18E4DC-REQ-0001: 3910ed7d981d5434c94b104ad999ba322afd426430bf90983af15628f7ba7833
    VT-FB18E4DC-DES-0001: a7ad8f3c4f6d2862501886ae9475b1b3f45c30deb439957bd2d641665ead004d
  record_revisions:
    VT-FB18E4DC-DES-0001: 7
    VT-FB18E4DC-REQ-0001: 3
    VT-FB18E4DC-REQ-0010: 2
    VT-FB18E4DC-TASK-0004: 8
  file_baseline:
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf: f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf: de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea
  input_snapshot:
    schema_version: 1
    manifest_path: .verythinker/evidence/inputs/manifests/daa04c63b9ab2ee5913eebceb8e1c8daa3420b60df60c4811aee68d0e34d457e.json
    manifest_hash: daa04c63b9ab2ee5913eebceb8e1c8daa3420b60df60c4811aee68d0e34d457e
  pack_lock_hash: ca4b8ad30dc37ec95ba3cf435016d08f07c2580c1825340c15bf60df988defe9
  tool_lock_hash: ab517f76a5cbc921d870fb2293ccd712144c4901a0a5e479142b3a2ca01f88c3
  revision:
    git_commit: d7016f359bbe6f8f6b6cddc35fd26a8e33cb55c4
    workspace_hash: f6d7eac74683fb2176466e53e853c58e7eee81d7aaa4268f866e20e1bed01926
  tool_versions:
    runner_node: v24.18.0
    declared: {}
  result: pass
  exit_code: 0
  duration_ms: 16048
  method: automated-test
  environment:
    os: win32
    node: v24.18.0
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
  executed_command:
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
  at: 2026-10-14T04:24:23.588Z
  log_path: .verythinker/evidence/VT-FB18E4DC-EVD-0005/output.log
  log_hash: 77fc8bcc94547974a4a27253f6c2af2b3609bc3b6f4695f75871f20a113a16e7
  receipt_path: .verythinker/evidence/VT-FB18E4DC-EVD-0005/receipt.json
  routing_required: true
  archived_at: 2026-10-14T04:24:28.154Z
---
# Results
pass; exit code 0.

# Evidence
[Archived verification log](../evidence/VT-FB18E4DC-EVD-0005/output.log)

# Limitations
Evidence applies to its recorded baseline. Inspect exported logs before sharing.
