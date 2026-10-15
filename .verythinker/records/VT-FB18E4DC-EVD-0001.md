---
schema_version: 1
id: VT-FB18E4DC-EVD-0001
type: evidence
title: "pass: DSP bootstrap fresh read-only workspace/source/solution/collision
  before-after snapshot"
owner: verifier
status: verified
revision: 3
created_at: 2026-10-13T02:46:58.017Z
updated_at: 2026-10-13T02:47:09.376Z
links:
  - type: evidence-for
    target: VT-FB18E4DC-CHK-0013
  - type: documents
    target: VT-FB18E4DC-TASK-0002
data:
  schema_version: 1
  execution_invocation_id: dd730282-aa88-461e-8a54-ef7741716ad4
  run_id: 8fd9084f-f6c5-4a99-b351-13a60823f9a1
  task_id: VT-FB18E4DC-TASK-0002
  check_id: VT-FB18E4DC-CHK-0013
  check_fingerprint: d4d328d2f043fb687b9094bd17039921743b9d341e38f25d105b65bac7bc8a89
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
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_Syllabus-ME4083_XLTH-cho-các-hệ-thống-cdt.pdf: 46131c8b216e5ea7c16446f4159f32b1b18c35432fe2cbeaaa59a1b55aecbb79
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf: de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/01_DS_FT_a.pdf: 32e299c8707a95a5eb5872fec4e165fc477e1cad1ea415aba6007bdf1a3fdb59
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/01_DS_FT_b.pdf: c42070c179e30b929756ba9b7571a12045c1cad521bfcf86a9ea4bbd8d451577
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/02_DS_LTI_Convo.pdf: 72a323287d88ebf9c5e99af878e55917f71661d59b8cb8a1804d75fcef8b282b
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/03_DS_z.pdf: 7e767a903de09da6c49bda047a4a6d1eac56c680119fe006aeef6357381012ff
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/04_DS_FFT.pdf: c87865bc4b497db0112976cab92d9c636fdc5a6a4ee0326e4140faa190dc617f
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/05_DS_Filter.pdf: 38449c77416efc515524b586d0af6d0e70da3b7e4cc529deae96544159fb5534
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/06_DS_Multirate.pdf: 4b3af269df315e5dc75f2a33f06d4db6cbdc7bf5ce1faa85c39592e939c09d82
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/DS_OnTap.pdf: c6bf661149d56a28eea751cf268ad927b4914e7bb2ccda68c725c23609eb3b8e
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/02-references.pdf: e18586eb6d21b0d944cf7bba6f41f31de46343ed08a9165290f575d9d397f7f9
    07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf: f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057
  input_snapshot:
    schema_version: 1
    manifest_path: .verythinker/evidence/inputs/manifests/0dca87720cc7c1acb10cfa61731b946c3f01bd5d9b98ab98aa85b5700a4c83bc.json
    manifest_hash: 0dca87720cc7c1acb10cfa61731b946c3f01bd5d9b98ab98aa85b5700a4c83bc
  pack_lock_hash: ca4b8ad30dc37ec95ba3cf435016d08f07c2580c1825340c15bf60df988defe9
  tool_lock_hash: ab517f76a5cbc921d870fb2293ccd712144c4901a0a5e479142b3a2ca01f88c3
  revision:
    git_commit: d7016f359bbe6f8f6b6cddc35fd26a8e33cb55c4
    workspace_hash: 56410160cc3b0cfd56d81e22d2e05c1b621e27aea641dde95ba3b130550eb05f
  tool_versions:
    runner_node: v24.18.0
    declared: {}
  result: pass
  exit_code: 0
  duration_ms: 8414
  method: automated-test
  environment:
    os: win32
    node: v24.18.0
  command:
    - C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe
    - -B
    - -c
    - |
      import sys, os, json, hashlib, subprocess, shutil
      from pathlib import Path
      from datetime import datetime, timezone
      sys.stdout.reconfigure(encoding="utf-8")
      root = Path("D:/workspace/NeoLearning")
      base = root / "07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System"
      scopes = [base / "03_resources", base / "01_learning"]
      future = [base / "01_learning/intro_dsp_study", base / "01_learning/intro_dsp_study/provenance/source_audit.md", base / "01_learning/intro_dsp_study/provenance/source_navigation_exercise.md", base / "01_learning/intro_dsp_study/provenance/source_navigation_answer.md"]
      expected = {
      "07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf": [9466589, "f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057"],
      "07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf": [13042041, "de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea"]
      }
      git = shutil.which("git")
      errors = []
      env = os.environ.copy()
      env["GIT_OPTIONAL_LOCKS"] = "0"
      def now():
          return datetime.now(timezone.utc).isoformat()
      def rel(path):
          return path.relative_to(root).as_posix()
      def linked(path):
          return path.is_symlink() or bool(getattr(path.lstat(), "st_file_attributes", 0) & 1024)
      def file_identity(path):
          digest = hashlib.sha256()
          length = 0
          with path.open("rb") as handle:
              for block in iter(lambda: handle.read(1048576), b""):
                  length += len(block)
                  digest.update(block)
          return {"bytes":length, "sha256":digest.hexdigest()}
      def git_read(args, directory=root, allowed=(0,)):
          command = [git, "--no-optional-locks", "-c", "safe.directory=" + str(root), "-c", "core.fsmonitor=false", "-c", "core.untrackedCache=false", "-C", str(directory)] + args
          completed = subprocess.run(command, shell=False, capture_output=True, timeout=5, env=env)
          row = {"command":command, "exit_code":completed.returncode, "stdout":completed.stdout.decode("utf-8", "surrogateescape"), "stderr":completed.stderr.decode("utf-8", "surrogateescape")}
          if completed.returncode not in allowed:
              errors.append({"git_failure":row})
          return row
      def file_tree(directory):
          data = {"exists":directory.exists(), "directories":[], "files":{}}
          if not data["exists"]:
              return data
          if linked(directory):
              raise RuntimeError("Scoped root link/reparse point: " + str(directory))
          def fail_walk(exc):
              raise exc
          for parent, dirs, files in os.walk(directory, topdown=True, followlinks=False, onerror=fail_walk):
              parent = Path(parent)
              data["directories"].append(rel(parent))
              for name in list(dirs):
                  path = parent / name
                  if linked(path):
                      dirs.remove(name)
                      errors.append({"scope_link_not_traversed":rel(path)})
              for name in files:
                  path = parent / name
                  if linked(path):
                      errors.append({"scope_link_not_read":rel(path)})
                  elif path.is_file():
                      data["files"][rel(path)] = file_identity(path)
                  else:
                      errors.append({"nonregular_scoped_file":rel(path)})
          data["directories"].sort()
          return data
      def snapshot():
          result = {"started_at":now(), "git":{}, "scope":{}, "core_record_files":{}}
          result["git"]["branch"] = git_read(["symbolic-ref", "--quiet", "--short", "HEAD"], allowed=(0,1))
          result["git"]["head"] = git_read(["rev-parse", "--verify", "HEAD"])
          result["git"]["status"] = git_read(["status", "--porcelain=v1", "-z", "--untracked-files=all", "--ignore-submodules=none"])
          result["git"]["index"] = git_read(["ls-files", "--stage", "-z"])
          result["git"]["examples_submodule"] = git_read(["submodule", "status", "--", "Examples"])
          examples = root / "Examples"
          result["examples"] = {"exists":examples.exists(), "git_marker_exists":(examples / ".git").exists()}
          if result["examples"]["git_marker_exists"]:
              if linked(examples):
                  errors.append({"examples_link_not_traversed":str(examples)})
              else:
                  result["examples"]["head"] = git_read(["rev-parse", "--verify", "HEAD"], examples)
                  result["examples"]["status"] = git_read(["status", "--porcelain=v1", "-z", "--untracked-files=all"], examples)
          tracked = [row.split("\t",1)[1] for row in result["git"]["index"]["stdout"].split("\x00") if "\t" in row]
          result["git"]["tracked_paths"] = tracked
          for directory in scopes:
              result["scope"][rel(directory)] = file_tree(directory)
          all_files = {}
          for tree in result["scope"].values():
              all_files.update(tree["files"])
          result["protected_scoped_files"] = all_files
          result["solution_name_candidates"] = [path for path in sorted(all_files) if any(token in Path(path).name.casefold() for token in ("solution","answer","giai","dap_an"))]
          result["solution_discovery_policy"] = "All regular resource/learning files are hashed and protected, including files with no solution-like filename; name candidates do not define preservation scope."
          result["expected_sources"] = {}
          for path, oracle in expected.items():
              actual = all_files.get(path)
              result["expected_sources"][path] = {"expected":{"bytes":oracle[0],"sha256":oracle[1]}, "actual":actual, "matches":actual == {"bytes":oracle[0],"sha256":oracle[1]}}
          result["collisions"] = []
          for path in future:
              path_rel = rel(path)
              matching = [p for p in tracked if p == path_rel or p.startswith(path_rel + "/")]
              ancestors = []
              for parent in [path] + list(path.parents):
                  if parent == base / "01_learning":
                      break
                  if root not in parent.parents:
                      break
                  present = os.path.lexists(parent)
                  ancestors.append({"path":rel(parent),"lexists":present,"kind":("link" if linked(parent) else "directory" if parent.is_dir() else "file") if present else "absent"})
              result["collisions"].append({"path":path_rel, "lexists":os.path.lexists(path), "tracked_at_or_below":matching, "tracked_missing_at_or_below":[p for p in matching if not os.path.lexists(root/p)], "ancestor_states":ancestors})
          records = root / ".verythinker/records"
          if records.is_dir() and not linked(records):
              for path in sorted(records.glob("*.md")):
                  if not linked(path):
                      result["core_record_files"][rel(path)] = file_identity(path)
                  else:
                      errors.append({"core_record_link_not_read":rel(path)})
          result["completed_at"] = now()
          return result
      result = {"schema_version":1, "plan_invocation":"483cb6f0-ebc8-4190-9ae1-50d44c3cf261", "timestamp":now(), "runtime":{"executable":sys.executable,"version":sys.version}, "git_executable":git, "errors":errors, "writes_by_script":[]}
      try:
          if git is None:
              raise RuntimeError("git executable unavailable")
          if Path(sys.executable).resolve() != Path("C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe").resolve():
              raise RuntimeError("Unexpected Python executable")
          result["git_version"] = git_read(["--version"])
          result["before"] = snapshot()
          result["after"] = snapshot()
          comparisons = {}
          for key in ("git","examples","scope","protected_scoped_files","collisions"):
              comparisons[key] = result["before"][key] == result["after"][key]
          result["unchanged"] = comparisons
          prior = result["before"]["core_record_files"]
          later = result["after"]["core_record_files"]
          result["core_record_changes"] = [{"path":path,"before":prior.get(path),"after":later.get(path),"attribution":"unresolved: executor/manager must compare actual invocation-owned record/evidence ledger"} for path in sorted(set(prior) | set(later)) if prior.get(path) != later.get(path)]
          result["core_attribution"] = {"known_verifier_candidate_records":[".verythinker/records/VT-FB18E4DC-CHK-0012.md",".verythinker/records/VT-FB18E4DC-CHK-0013.md"],"executor_evidence_records":"Determine from actual CORE check_run response, never invent IDs.","scope_limit":"Hashes cover .verythinker/records/*.md only; native receipts/private keys/runtime caches are neither opened nor hashed. Whole-workspace status/index/Examples observations are not whole-workspace byte-preservation proof."}
          sources_match = all(row["matches"] for snap in ("before","after") for row in result[snap]["expected_sources"].values())
          result["ok"] = not errors and all(comparisons.values()) and sources_match and not result["core_record_changes"]
      except Exception as exc:
          errors.append({"snapshot_failure":repr(exc)})
          result["ok"] = False
      result["finished_at"] = now()
      print(json.dumps(result, ensure_ascii=True, sort_keys=True))
      sys.exit(0 if result["ok"] else 1)
  executed_command:
    - C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe
    - -B
    - -c
    - |
      import sys, os, json, hashlib, subprocess, shutil
      from pathlib import Path
      from datetime import datetime, timezone
      sys.stdout.reconfigure(encoding="utf-8")
      root = Path("D:/workspace/NeoLearning")
      base = root / "07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System"
      scopes = [base / "03_resources", base / "01_learning"]
      future = [base / "01_learning/intro_dsp_study", base / "01_learning/intro_dsp_study/provenance/source_audit.md", base / "01_learning/intro_dsp_study/provenance/source_navigation_exercise.md", base / "01_learning/intro_dsp_study/provenance/source_navigation_answer.md"]
      expected = {
      "07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf": [9466589, "f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057"],
      "07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf": [13042041, "de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea"]
      }
      git = shutil.which("git")
      errors = []
      env = os.environ.copy()
      env["GIT_OPTIONAL_LOCKS"] = "0"
      def now():
          return datetime.now(timezone.utc).isoformat()
      def rel(path):
          return path.relative_to(root).as_posix()
      def linked(path):
          return path.is_symlink() or bool(getattr(path.lstat(), "st_file_attributes", 0) & 1024)
      def file_identity(path):
          digest = hashlib.sha256()
          length = 0
          with path.open("rb") as handle:
              for block in iter(lambda: handle.read(1048576), b""):
                  length += len(block)
                  digest.update(block)
          return {"bytes":length, "sha256":digest.hexdigest()}
      def git_read(args, directory=root, allowed=(0,)):
          command = [git, "--no-optional-locks", "-c", "safe.directory=" + str(root), "-c", "core.fsmonitor=false", "-c", "core.untrackedCache=false", "-C", str(directory)] + args
          completed = subprocess.run(command, shell=False, capture_output=True, timeout=5, env=env)
          row = {"command":command, "exit_code":completed.returncode, "stdout":completed.stdout.decode("utf-8", "surrogateescape"), "stderr":completed.stderr.decode("utf-8", "surrogateescape")}
          if completed.returncode not in allowed:
              errors.append({"git_failure":row})
          return row
      def file_tree(directory):
          data = {"exists":directory.exists(), "directories":[], "files":{}}
          if not data["exists"]:
              return data
          if linked(directory):
              raise RuntimeError("Scoped root link/reparse point: " + str(directory))
          def fail_walk(exc):
              raise exc
          for parent, dirs, files in os.walk(directory, topdown=True, followlinks=False, onerror=fail_walk):
              parent = Path(parent)
              data["directories"].append(rel(parent))
              for name in list(dirs):
                  path = parent / name
                  if linked(path):
                      dirs.remove(name)
                      errors.append({"scope_link_not_traversed":rel(path)})
              for name in files:
                  path = parent / name
                  if linked(path):
                      errors.append({"scope_link_not_read":rel(path)})
                  elif path.is_file():
                      data["files"][rel(path)] = file_identity(path)
                  else:
                      errors.append({"nonregular_scoped_file":rel(path)})
          data["directories"].sort()
          return data
      def snapshot():
          result = {"started_at":now(), "git":{}, "scope":{}, "core_record_files":{}}
          result["git"]["branch"] = git_read(["symbolic-ref", "--quiet", "--short", "HEAD"], allowed=(0,1))
          result["git"]["head"] = git_read(["rev-parse", "--verify", "HEAD"])
          result["git"]["status"] = git_read(["status", "--porcelain=v1", "-z", "--untracked-files=all", "--ignore-submodules=none"])
          result["git"]["index"] = git_read(["ls-files", "--stage", "-z"])
          result["git"]["examples_submodule"] = git_read(["submodule", "status", "--", "Examples"])
          examples = root / "Examples"
          result["examples"] = {"exists":examples.exists(), "git_marker_exists":(examples / ".git").exists()}
          if result["examples"]["git_marker_exists"]:
              if linked(examples):
                  errors.append({"examples_link_not_traversed":str(examples)})
              else:
                  result["examples"]["head"] = git_read(["rev-parse", "--verify", "HEAD"], examples)
                  result["examples"]["status"] = git_read(["status", "--porcelain=v1", "-z", "--untracked-files=all"], examples)
          tracked = [row.split("\t",1)[1] for row in result["git"]["index"]["stdout"].split("\x00") if "\t" in row]
          result["git"]["tracked_paths"] = tracked
          for directory in scopes:
              result["scope"][rel(directory)] = file_tree(directory)
          all_files = {}
          for tree in result["scope"].values():
              all_files.update(tree["files"])
          result["protected_scoped_files"] = all_files
          result["solution_name_candidates"] = [path for path in sorted(all_files) if any(token in Path(path).name.casefold() for token in ("solution","answer","giai","dap_an"))]
          result["solution_discovery_policy"] = "All regular resource/learning files are hashed and protected, including files with no solution-like filename; name candidates do not define preservation scope."
          result["expected_sources"] = {}
          for path, oracle in expected.items():
              actual = all_files.get(path)
              result["expected_sources"][path] = {"expected":{"bytes":oracle[0],"sha256":oracle[1]}, "actual":actual, "matches":actual == {"bytes":oracle[0],"sha256":oracle[1]}}
          result["collisions"] = []
          for path in future:
              path_rel = rel(path)
              matching = [p for p in tracked if p == path_rel or p.startswith(path_rel + "/")]
              ancestors = []
              for parent in [path] + list(path.parents):
                  if parent == base / "01_learning":
                      break
                  if root not in parent.parents:
                      break
                  present = os.path.lexists(parent)
                  ancestors.append({"path":rel(parent),"lexists":present,"kind":("link" if linked(parent) else "directory" if parent.is_dir() else "file") if present else "absent"})
              result["collisions"].append({"path":path_rel, "lexists":os.path.lexists(path), "tracked_at_or_below":matching, "tracked_missing_at_or_below":[p for p in matching if not os.path.lexists(root/p)], "ancestor_states":ancestors})
          records = root / ".verythinker/records"
          if records.is_dir() and not linked(records):
              for path in sorted(records.glob("*.md")):
                  if not linked(path):
                      result["core_record_files"][rel(path)] = file_identity(path)
                  else:
                      errors.append({"core_record_link_not_read":rel(path)})
          result["completed_at"] = now()
          return result
      result = {"schema_version":1, "plan_invocation":"483cb6f0-ebc8-4190-9ae1-50d44c3cf261", "timestamp":now(), "runtime":{"executable":sys.executable,"version":sys.version}, "git_executable":git, "errors":errors, "writes_by_script":[]}
      try:
          if git is None:
              raise RuntimeError("git executable unavailable")
          if Path(sys.executable).resolve() != Path("C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe").resolve():
              raise RuntimeError("Unexpected Python executable")
          result["git_version"] = git_read(["--version"])
          result["before"] = snapshot()
          result["after"] = snapshot()
          comparisons = {}
          for key in ("git","examples","scope","protected_scoped_files","collisions"):
              comparisons[key] = result["before"][key] == result["after"][key]
          result["unchanged"] = comparisons
          prior = result["before"]["core_record_files"]
          later = result["after"]["core_record_files"]
          result["core_record_changes"] = [{"path":path,"before":prior.get(path),"after":later.get(path),"attribution":"unresolved: executor/manager must compare actual invocation-owned record/evidence ledger"} for path in sorted(set(prior) | set(later)) if prior.get(path) != later.get(path)]
          result["core_attribution"] = {"known_verifier_candidate_records":[".verythinker/records/VT-FB18E4DC-CHK-0012.md",".verythinker/records/VT-FB18E4DC-CHK-0013.md"],"executor_evidence_records":"Determine from actual CORE check_run response, never invent IDs.","scope_limit":"Hashes cover .verythinker/records/*.md only; native receipts/private keys/runtime caches are neither opened nor hashed. Whole-workspace status/index/Examples observations are not whole-workspace byte-preservation proof."}
          sources_match = all(row["matches"] for snap in ("before","after") for row in result[snap]["expected_sources"].values())
          result["ok"] = not errors and all(comparisons.values()) and sources_match and not result["core_record_changes"]
      except Exception as exc:
          errors.append({"snapshot_failure":repr(exc)})
          result["ok"] = False
      result["finished_at"] = now()
      print(json.dumps(result, ensure_ascii=True, sort_keys=True))
      sys.exit(0 if result["ok"] else 1)
  at: 2026-10-13T02:46:57.971Z
  log_path: .verythinker/evidence/VT-FB18E4DC-EVD-0001/output.log
  log_hash: 80a0895e52faa963ce07141fcebaecedd6517680b0bccafbbc749ac5cfb06164
  receipt_path: .verythinker/evidence/VT-FB18E4DC-EVD-0001/receipt.json
  routing_required: true
  archived_at: 2026-10-13T02:47:09.300Z
---
# Results
pass; exit code 0.

# Evidence
[Archived verification log](../evidence/VT-FB18E4DC-EVD-0001/output.log)

# Limitations
Evidence applies to its recorded baseline. Inspect exported logs before sharing.
