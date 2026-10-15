---
schema_version: 1
id: VT-FB18E4DC-EVD-0002
type: evidence
title: "fail: DSP bootstrap: exact Python imports, immutable PDF
  identities/counts and full PDF skill read"
owner: verifier
status: failed
revision: 3
created_at: 2026-10-13T02:47:28.545Z
updated_at: 2026-10-13T02:47:39.596Z
links:
  - type: evidence-for
    target: VT-FB18E4DC-CHK-0012
  - type: documents
    target: VT-FB18E4DC-TASK-0002
data:
  schema_version: 1
  execution_invocation_id: dd730282-aa88-461e-8a54-ef7741716ad4
  run_id: 833f44d5-8066-49a7-be88-2ca2540fbfc2
  task_id: VT-FB18E4DC-TASK-0002
  check_id: VT-FB18E4DC-CHK-0012
  check_fingerprint: a144f8782b208cc9f8210072bf0efa47e93b8a83f49af882c3653942c5aafd4a
  record_baseline:
    VT-FB18E4DC-TASK-0002: c90e64a64a6622ea5132d90b569e2ec696b1af02bced13adf76dc1b80cea809f
    VT-FB18E4DC-REQ-0010: 89a0bdc57a1165e60aeb24500c39084b7ee945dadc446d6f575bf7fb68506d5f
    VT-FB18E4DC-REQ-0001: 3910ed7d981d5434c94b104ad999ba322afd426430bf90983af15628f7ba7833
    VT-FB18E4DC-DES-0001: 1d755a1c73156f94a9e47044a2e352a53d223458ed04b1efe5c979ffdaf6d085
  record_revisions:
    VT-FB18E4DC-DES-0001: 6
    VT-FB18E4DC-REQ-0001: 3
    VT-FB18E4DC-REQ-0010: 2
    VT-FB18E4DC-TASK-0002: 15
  file_baseline:
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf: f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf: de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea
  input_snapshot:
    schema_version: 1
    manifest_path: .verythinker/evidence/inputs/manifests/9d81e5b3e5ab767e7abf842a13526dcaddec255edc3bbabc83c24f3524624bc8.json
    manifest_hash: 9d81e5b3e5ab767e7abf842a13526dcaddec255edc3bbabc83c24f3524624bc8
  pack_lock_hash: ca4b8ad30dc37ec95ba3cf435016d08f07c2580c1825340c15bf60df988defe9
  tool_lock_hash: ab517f76a5cbc921d870fb2293ccd712144c4901a0a5e479142b3a2ca01f88c3
  revision:
    git_commit: d7016f359bbe6f8f6b6cddc35fd26a8e33cb55c4
    workspace_hash: f6d7eac74683fb2176466e53e853c58e7eee81d7aaa4268f866e20e1bed01926
  tool_versions:
    runner_node: v24.18.0
    declared: {}
  result: fail
  exit_code: 1
  duration_ms: 14000
  method: automated-test
  environment:
    os: win32
    node: v24.18.0
  command:
    - C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe
    - -B
    - -c
    - |
      import sys, os, site, json, hashlib, importlib, importlib.metadata, platform
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
      result["dependency_inventory_method"] = "Enumerate every loaded module file under the active interpreter site-packages after required imports and PDF use; map exact files to installed distributions and versions. An unmapped loaded module, unavailable distribution version, or empty site-packages inventory is an error."
      site_roots = []
      for site_path in site.getsitepackages() + [site.getusersitepackages()]:
          if site_path:
              resolved_site_path = Path(site_path).resolve()
              if resolved_site_path not in site_roots:
                  site_roots.append(resolved_site_path)
      if not site_roots:
          result["errors"].append({"dependency_inventory":"active interpreter exposes no site-packages roots"})
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
      import sys, os, site, json, hashlib, importlib, importlib.metadata, platform
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
      result["dependency_inventory_method"] = "Enumerate every loaded module file under the active interpreter site-packages after required imports and PDF use; map exact files to installed distributions and versions. An unmapped loaded module, unavailable distribution version, or empty site-packages inventory is an error."
      site_roots = []
      for site_path in site.getsitepackages() + [site.getusersitepackages()]:
          if site_path:
              resolved_site_path = Path(site_path).resolve()
              if resolved_site_path not in site_roots:
                  site_roots.append(resolved_site_path)
      if not site_roots:
          result["errors"].append({"dependency_inventory":"active interpreter exposes no site-packages roots"})
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
  at: 2026-10-13T02:47:28.504Z
  log_path: .verythinker/evidence/VT-FB18E4DC-EVD-0002/output.log
  log_hash: b90c5314aff0c9b639ecec7a3c7adfc02e17bfd4e5de10ffaa825ac547f9df72
  receipt_path: .verythinker/evidence/VT-FB18E4DC-EVD-0002/receipt.json
  routing_required: true
  archived_at: 2026-10-13T02:47:39.534Z
---
# Results
fail; exit code 1.

# Evidence
[Archived verification log](../evidence/VT-FB18E4DC-EVD-0002/output.log)

# Limitations
Evidence applies to its recorded baseline. Inspect exported logs before sharing.
