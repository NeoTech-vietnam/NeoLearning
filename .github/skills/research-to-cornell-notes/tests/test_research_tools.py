from __future__ import annotations

import csv
import importlib.util
import io
import json
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = SKILL_ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))

import retrieve_sources  # noqa: E402
import validate_notes  # noqa: E402


HAS_PYPDF = importlib.util.find_spec("pypdf") is not None
HAS_TREE_SITTER = all(
    importlib.util.find_spec(name) is not None
    for name in ("tree_sitter", "tree_sitter_c", "tree_sitter_cpp", "tree_sitter_python")
)


def make_pdf(path: Path, page_texts: list[str]) -> None:
    """Write a tiny text PDF with a normal cross-reference table."""
    objects: dict[int, bytes] = {
        1: b"<< /Type /Catalog /Pages 2 0 R >>",
    }
    page_ids = [3 + 2 * index for index in range(len(page_texts))]
    font_id = 3 + 2 * len(page_texts)
    kids = " ".join(f"{page_id} 0 R" for page_id in page_ids)
    objects[2] = f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>".encode("ascii")
    objects[font_id] = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"

    for page_id, text in zip(page_ids, page_texts):
        content_id = page_id + 1
        safe_text = text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        stream = f"BT /F1 12 Tf 72 720 Td ({safe_text}) Tj ET".encode("ascii")
        objects[page_id] = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
            f"/Resources << /Font << /F1 {font_id} 0 R >> >> /Contents {content_id} 0 R >>"
        ).encode("ascii")
        objects[content_id] = f"<< /Length {len(stream)} >>\nstream\n".encode("ascii") + stream + b"\nendstream"

    pdf = bytearray(b"%PDF-1.4\n")
    offsets = [0] * (max(objects) + 1)
    for object_id in sorted(objects):
        offsets[object_id] = len(pdf)
        pdf.extend(f"{object_id} 0 obj\n".encode("ascii"))
        pdf.extend(objects[object_id])
        pdf.extend(b"\nendobj\n")
    xref_offset = len(pdf)
    pdf.extend(f"xref\n0 {len(offsets)}\n".encode("ascii"))
    pdf.extend(b"0000000000 65535 f \n")
    for object_id in range(1, len(offsets)):
        pdf.extend(f"{offsets[object_id]:010d} 00000 n \n".encode("ascii"))
    pdf.extend(f"trailer\n<< /Size {len(offsets)} /Root 1 0 R >>\n".encode("ascii"))
    pdf.extend(f"startxref\n{xref_offset}\n%%EOF\n".encode("ascii"))
    path.write_bytes(pdf)


def valid_note() -> str:
    return """# Cornell Notes

## Topic: Closed-loop control

## Date: 27/09/2026

### Cue Column (Questions, Keywords, or Prompts)

- How does feedback reduce tracking error?

### Notes Section (Main Notes)

[S1] The controller compares the reference with the measured output and adjusts the actuator. See [the control primer](https://example.org/control).

#### Sources

- [S1] Control primer. [Online source](https://example.org/control).

### Summary Section (Summary of Notes)

Feedback uses measured error to guide the next control action.
"""


class RetrievalTests(unittest.TestCase):
    def test_code_is_not_selected_without_include_code(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "source.md").write_text("# Source\nText.\n", encoding="utf-8")
            (root / "source.c").write_text("int answer(void) { return 42; }\n", encoding="utf-8")
            default_files, _ = retrieve_sources.roots_to_files([root], include_code=False)
            code_files, _ = retrieve_sources.roots_to_files([root], include_code=True)
            self.assertEqual([path.suffix for path in default_files], [".md"])
            self.assertEqual({path.suffix for path in code_files}, {".md", ".c"})

    def test_markdown_chunk_keeps_heading_and_line_range(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            note = root / "source.md"
            note.write_text(
                "# Control\n\nFeedback compares the measured value with the reference.\n"
                "## PID\nThe integral term reduces steady state error.\n",
                encoding="utf-8",
            )
            units = retrieve_sources.markdown_units(note)
            self.assertEqual([unit.unit_ref for unit in units], ["Control", "Control > PID"])
            self.assertEqual((units[0].start_line, units[0].end_line), (1, 3))
            self.assertEqual((units[1].start_line, units[1].end_line), (4, 5))

            stdout = io.StringIO()
            with redirect_stdout(stdout):
                result = retrieve_sources.main(["--root", str(note), "--query", "steady state error"])
            self.assertEqual(result, 0)
            payload = json.loads(stdout.getvalue())
            self.assertEqual(payload[0]["source_path"], str(note.resolve()))
            self.assertEqual(payload[0]["unit_ref"], "Control > PID")
            self.assertEqual((payload[0]["start_line"], payload[0]["end_line"]), (4, 5))
            self.assertEqual(payload[0]["extraction_status"], "ok")

    @unittest.skipUnless(HAS_PYPDF, "pypdf is not installed")
    def test_pdf_units_keep_page_numbers_and_flag_sparse_text(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            pdf = Path(temp_dir) / "control.pdf"
            make_pdf(
                pdf,
                [
                    "A feedback controller compares measured output with a reference and adjusts actuator effort.",
                    "x",
                ],
            )
            units = retrieve_sources.pdf_units(pdf)
            self.assertEqual([unit.unit_ref for unit in units], ["page 1", "page 2"])
            self.assertEqual([unit.extraction_status for unit in units], ["ok", "low_text"])
            self.assertIsNone(units[0].start_line)
            self.assertIn("feedback", units[0].text.lower())

    @unittest.skipUnless(HAS_TREE_SITTER, "Tree-sitter grammars are not installed")
    def test_tree_sitter_chunks_c_cpp_and_python_with_line_ranges(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            c_file = root / "controller.c"
            cpp_file = root / "driver.cpp"
            py_file = root / "model.py"
            c_file.write_text(
                "#include <stdint.h>\n\nint gain = 2;\n\nint scale(int value) {\n    return value * gain;\n}\n",
                encoding="utf-8",
            )
            cpp_file.write_text(
                "namespace driver {\nint update(int value) {\n    return value + 1;\n}\n}\n",
                encoding="utf-8",
            )
            py_file.write_text(
                "def normalize(value):\n    return value.strip().lower()\n\nclass Sensor:\n    pass\n",
                encoding="utf-8",
            )
            c_units = retrieve_sources.code_units(c_file)
            cpp_units = retrieve_sources.code_units(cpp_file)
            py_units = retrieve_sources.code_units(py_file)
            self.assertTrue(any("scale" in unit.unit_ref for unit in c_units))
            function = next(unit for unit in c_units if "scale" in unit.unit_ref)
            self.assertEqual((function.start_line, function.end_line), (5, 7))
            self.assertTrue(any("namespace_definition" in unit.unit_ref for unit in cpp_units))
            self.assertTrue(any("function_definition normalize" in unit.unit_ref for unit in py_units))
            self.assertTrue(all(unit.extraction_status == "ok" for unit in c_units + cpp_units + py_units))

    @unittest.skipUnless(HAS_PYPDF, "pypdf is not installed")
    def test_coverage_rerun_preserves_status_but_not_for_sparse_pdf(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            source = root / "source.md"
            pdf = root / "source.pdf"
            ledger = root / "coverage.csv"
            note = root / "notes.md"
            source.write_text("# Feedback\nThe controller minimizes tracking error.\n", encoding="utf-8")
            make_pdf(pdf, ["Sparse"])
            note.write_text(valid_note(), encoding="utf-8")
            roots = [root]
            files, roots = retrieve_sources.roots_to_files(roots, include_code=False)
            units = retrieve_sources.extract_units(files, include_code=False)
            retrieve_sources.write_coverage(ledger, units, roots)
            with ledger.open("r", encoding="utf-8", newline="") as handle:
                rows = list(csv.DictReader(handle))
            markdown_row = next(row for row in rows if row["unit_kind"] == "markdown")
            for row in rows:
                if row["unit_id"] == markdown_row["unit_id"]:
                    row["documentation_status"] = "completed"
                    row["note_path"] = "notes.md"
            with ledger.open("w", encoding="utf-8", newline="") as handle:
                writer = csv.DictWriter(handle, fieldnames=retrieve_sources.COVERAGE_FIELDS, lineterminator="\n")
                writer.writeheader()
                writer.writerows(rows)

            retrieve_sources.write_coverage(ledger, units, roots)
            with ledger.open("r", encoding="utf-8", newline="") as handle:
                updated = {row["unit_id"]: row for row in csv.DictReader(handle)}
            self.assertEqual(updated[markdown_row["unit_id"]]["documentation_status"], "completed")
            self.assertEqual(updated[markdown_row["unit_id"]]["note_path"], "notes.md")
            pdf_row = next(row for row in updated.values() if row["unit_kind"] == "pdf_page")
            self.assertEqual(pdf_row["documentation_status"], "unreadable")


class NoteValidationTests(unittest.TestCase):
    def test_valid_note_passes_and_broken_or_placeholder_note_fails(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            note = root / "notes.md"
            note.write_text(valid_note(), encoding="utf-8")
            self.assertEqual(validate_notes.validate_note(note, root), [])
            output = io.StringIO()
            with redirect_stdout(output):
                self.assertEqual(validate_notes.main([str(note), "--repo-root", str(root)]), 0)
            self.assertIn("validated Cornell note", output.getvalue())

            invalid = valid_note().replace(
                "[the control primer](https://example.org/control)",
                "[missing local file](missing.md#not-here)",
            ).replace("Feedback uses measured error", "[Concrete takeaways and ordering rules]")
            note.write_text(invalid, encoding="utf-8")
            errors = validate_notes.validate_note(note, root)
            self.assertTrue(any("placeholder" in error.lower() for error in errors))
            self.assertTrue(any("broken local link" in error for error in errors))

    def test_sources_must_be_listed_and_cornell_headings_ordered(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            note = Path(temp_dir) / "notes.md"
            reordered = valid_note().replace(
                "## Topic: Closed-loop control\n\n## Date: 27/09/2026",
                "## Date: 27/09/2026\n\n## Topic: Closed-loop control",
            )
            note.write_text(reordered, encoding="utf-8")
            errors = validate_notes.validate_note(note, Path(temp_dir))
            self.assertTrue(any("Cornell headings are out of order" in error for error in errors))

            missing_source = valid_note().replace("#### Sources\n\n- [S1] Control primer. [Online source](https://example.org/control).\n", "")
            note.write_text(missing_source, encoding="utf-8")
            errors = validate_notes.validate_note(note, Path(temp_dir))
            self.assertTrue(any("needs a Sources list" in error for error in errors))

    def test_coverage_validator_checks_unreadable_and_completed_note_mapping(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            note = root / "notes.md"
            note.write_text(valid_note(), encoding="utf-8")
            ledger = root / "coverage.csv"
            row = {
                "source_path": "source.pdf",
                "unit_id": "page1",
                "unit_kind": "pdf_page",
                "unit_ref": "page 1",
                "start_line": "",
                "end_line": "",
                "extraction_status": "ok",
                "documentation_status": "completed",
                "note_path": "notes.md",
            }
            with ledger.open("w", encoding="utf-8", newline="") as handle:
                writer = csv.DictWriter(handle, fieldnames=validate_notes.COVERAGE_FIELDS, lineterminator="\n")
                writer.writeheader()
                writer.writerow(row)
            self.assertEqual(validate_notes.validate_coverage(ledger, root), [])

            row["extraction_status"] = "low_text"
            with ledger.open("w", encoding="utf-8", newline="") as handle:
                writer = csv.DictWriter(handle, fieldnames=validate_notes.COVERAGE_FIELDS, lineterminator="\n")
                writer.writeheader()
                writer.writerow(row)
            errors = validate_notes.validate_coverage(ledger, root)
            self.assertTrue(any("must be marked unreadable" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
