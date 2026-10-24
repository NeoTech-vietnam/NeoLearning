from __future__ import annotations

import csv
import email.message
import importlib.util
import io
import json
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from unittest.mock import MagicMock, patch


SKILL_ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = SKILL_ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))

import retrieve_sources  # noqa: E402
import capture_resource_image  # noqa: E402
import validate_notes  # noqa: E402


HAS_PYPDF = importlib.util.find_spec("pypdf") is not None
HAS_PDFIUM_AND_PIL = all(importlib.util.find_spec(name) is not None for name in ("pypdfium2", "PIL"))
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


def note_with_figure(image_path: str = "figures/closed-loop/controller-feedback.png") -> str:
    text = valid_note().replace(
        "#### Sources\n\n- [S1] Control primer. [Online source](https://example.org/control).",
        "![Block diagram showing the controller using measured output to reduce tracking error]("
        f"{image_path})\n*Figure 1. The feedback path corrects tracking error; source [S1], reused under CC BY 4.0.*\n\n"
        "#### Sources\n\n- [S1] Creator: Control Lab; title: Feedback Loop Diagram; "
        "original: [image asset](https://example.org/controller.png); "
        "reuse: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); changes: unchanged.",
    )
    return text


class FakeImageResponse:
    def __init__(self, body: bytes, content_type: str = "image/png", url: str = "https://example.org/image.png") -> None:
        self.body = body
        self.url = url
        self.headers = email.message.Message()
        self.headers["Content-Type"] = content_type
        self.headers["Content-Length"] = str(len(body))

    def __enter__(self) -> FakeImageResponse:
        return self

    def __exit__(self, *_: object) -> None:
        return None

    def geturl(self) -> str:
        return self.url

    def read(self, size: int = -1) -> bytes:
        return self.body if size < 0 else self.body[:size]


def make_png() -> bytes:
    from PIL import Image

    buffer = io.BytesIO()
    with Image.new("RGB", (8, 6), color=(20, 80, 160)) as image:
        image.save(buffer, format="PNG")
    return buffer.getvalue()


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

    def test_figure_requires_local_asset_descriptive_alt_caption_and_source_provenance(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            note = root / "notes.md"
            image = root / "figures" / "closed-loop" / "controller-feedback.png"
            image.parent.mkdir(parents=True)
            image.write_bytes(make_png())
            note.write_text(note_with_figure(), encoding="utf-8")
            self.assertEqual(validate_notes.validate_note(note, root), [])
            note.write_text(note_with_figure().replace("Figure 1.", "Hình 1."), encoding="utf-8")
            self.assertEqual(validate_notes.validate_note(note, root), [])

            invalid = note_with_figure().replace(
                "Block diagram showing the controller using measured output to reduce tracking error",
                "image",
            ).replace("source [S1], reused", "source [S9], reused")
            note.write_text(invalid, encoding="utf-8")
            errors = validate_notes.validate_note(note, root)
            self.assertTrue(any("descriptive alt text" in error for error in errors))
            self.assertTrue(any("source S9 is not declared" in error for error in errors))

    def test_figure_must_be_local_and_inside_notes_with_numbered_cited_caption(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            note = root / "notes.md"
            note.write_text(
                valid_note().replace(
                    "### Cue Column (Questions, Keywords, or Prompts)",
                    "### Cue Column (Questions, Keywords, or Prompts)\n\n"
                    "![Diagram showing how a controller compares its input and output](https://example.org/figure.png)\n"
                    "Figure 1. A caption without a source ID.",
                ),
                encoding="utf-8",
            )
            errors = validate_notes.validate_note(note, root)
            self.assertTrue(any("inside the Notes Section" in error for error in errors))
            self.assertTrue(any("local relative image file" in error for error in errors))

    def test_figure_rejects_absolute_local_paths(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            note = root / "notes.md"
            image = root / "figures" / "controller-feedback.png"
            image.parent.mkdir()
            image.write_bytes(make_png())
            note.write_text(note_with_figure(str(image)), encoding="utf-8")
            errors = validate_notes.validate_note(note, root)
            self.assertTrue(any("local relative image file" in error for error in errors))

    def test_figure_rejects_relative_paths_that_escape_note_directory(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            note_dir = root / "topic"
            note_dir.mkdir()
            note = note_dir / "notes.md"
            (root / "outside.png").write_bytes(make_png())
            note.write_text(note_with_figure("../outside.png"), encoding="utf-8")
            errors = validate_notes.validate_note(note, root)
            self.assertTrue(any("stay inside the note directory" in error for error in errors))


class ImageCaptureTests(unittest.TestCase):
    @unittest.skipUnless(importlib.util.find_spec("PIL"), "Pillow is not installed")
    def test_download_validates_direct_https_image_and_refuses_overwrite(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            output = Path(temp_dir) / "feedback-loop.png"
            data = make_png()
            response = FakeImageResponse(data)
            with patch.object(capture_resource_image, "_open_https_request", return_value=response):
                result = capture_resource_image.download_image(
                    "https://example.org/image.png", output, max_bytes=len(data)
                )
            self.assertEqual(Path(str(result["output"])).read_bytes(), data)
            self.assertEqual(result["format"], "PNG")

            with patch.object(
                capture_resource_image,
                "_open_https_request",
                return_value=FakeImageResponse(data),
            ):
                with self.assertRaisesRegex(capture_resource_image.CaptureError, "refusing to overwrite"):
                    capture_resource_image.download_image("https://example.org/image.png", output)
            self.assertEqual(output.read_bytes(), data)

    @unittest.skipUnless(importlib.util.find_spec("PIL"), "Pillow is not installed")
    def test_download_rejects_non_https_oversized_html_and_extension_mismatch(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            with self.assertRaisesRegex(capture_resource_image.CaptureError, "direct HTTPS"):
                capture_resource_image.download_image("http://example.org/image.png", root / "image.png")

            data = make_png()
            with patch.object(
                capture_resource_image,
                "_open_https_request",
                return_value=FakeImageResponse(data),
            ):
                with self.assertRaisesRegex(capture_resource_image.CaptureError, "exceeds"):
                    capture_resource_image.download_image(
                        "https://example.org/image.png", root / "oversized-capture.png", max_bytes=len(data) - 1
                    )

            html = FakeImageResponse(b"<html>not an image</html>", "text/html")
            with patch.object(capture_resource_image, "_open_https_request", return_value=html):
                with self.assertRaisesRegex(capture_resource_image.CaptureError, "Content-Type"):
                    capture_resource_image.download_image(
                        "https://example.org/page", root / "page.png"
                    )

            with patch.object(
                capture_resource_image,
                "_open_https_request",
                return_value=FakeImageResponse(data),
            ):
                with self.assertRaisesRegex(capture_resource_image.CaptureError, "extension is .jpg"):
                    capture_resource_image.download_image(
                        "https://example.org/image.png", root / "image-capture-mismatch.jpg"
                    )

    def test_redirect_handler_rejects_every_non_https_hop(self) -> None:
        handler = capture_resource_image.HttpsOnlyRedirectHandler()
        request = capture_resource_image.urllib.request.Request("https://example.org/start")
        with self.assertRaisesRegex(capture_resource_image.CaptureError, "redirected away from"):
            handler.redirect_request(
                request,
                io.BytesIO(),
                302,
                "Found",
                email.message.Message(),
                "http://example.org/image.png",
            )

    def test_write_open_error_does_not_delete_existing_asset(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            output = Path(temp_dir) / "existing.png"
            original = b"keep this existing asset"
            output.write_bytes(original)
            with patch.object(Path, "open", autospec=True, side_effect=PermissionError("blocked")):
                with self.assertRaises(PermissionError):
                    capture_resource_image._write_new(output, b"replacement")
            self.assertEqual(output.read_bytes(), original)

    @unittest.skipUnless(importlib.util.find_spec("PIL"), "Pillow is not installed")
    def test_download_rejects_images_over_pixel_limit_before_decode(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            output = Path(temp_dir) / "pixel-limit-check.png"
            data = make_png()
            fake_image = MagicMock()
            fake_image.format = "PNG"
            fake_image.size = (capture_resource_image.MAX_IMAGE_PIXELS + 1, 1)
            fake_context = MagicMock()
            fake_context.__enter__.return_value = fake_image
            with patch.object(capture_resource_image, "_open_https_request", return_value=FakeImageResponse(data)):
                with patch("PIL.Image.open", return_value=fake_context):
                    with self.assertRaisesRegex(capture_resource_image.CaptureError, "pixel decoding limit"):
                        capture_resource_image.download_image("https://example.org/image.png", output)
            self.assertFalse(output.exists())

    @unittest.skipUnless(HAS_PDFIUM_AND_PIL, "pypdfium2 and Pillow are not installed")
    def test_pdf_page_and_crop_render_to_png_with_page_metadata(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            source = root / "source.pdf"
            make_pdf(source, ["Controller compares the measured output to the reference."])
            output = root / "figures" / "controller-page.png"
            result = capture_resource_image.render_pdf_page(source, 1, output, scale=1, crop=(50, 50, 200, 180))
            self.assertEqual(result["pdf_page"], 1)
            self.assertEqual(result["crop_pixels"], [50, 50, 200, 180])
            from PIL import Image

            with Image.open(output) as image:
                self.assertEqual(image.size, (150, 130))
                self.assertEqual(image.format, "PNG")
            with self.assertRaisesRegex(capture_resource_image.CaptureError, "has 1 pages"):
                capture_resource_image.render_pdf_page(source, 2, root / "missing.png")
            with self.assertRaisesRegex(capture_resource_image.CaptureError, "exceed .* pixels"):
                capture_resource_image.render_pdf_page(source, 1, root / "oversized.png", scale=8)
            with self.assertRaisesRegex(capture_resource_image.CaptureError, "crop must fit"):
                capture_resource_image.render_pdf_page(
                    source, 1, root / "invalid-crop.png", scale=1, crop=(0, 0, 5000, 100)
                )


if __name__ == "__main__":
    unittest.main()
