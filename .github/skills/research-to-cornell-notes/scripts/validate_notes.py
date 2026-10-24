#!/usr/bin/env python3
"""Validate a Cornell research note, its local links, and optional coverage CSV."""

from __future__ import annotations

import argparse
import csv
import re
import sys
from datetime import datetime
from pathlib import Path, PureWindowsPath
from typing import Sequence
from urllib.parse import unquote


REPO_ROOT = Path(__file__).resolve().parents[4]
COVERAGE_FIELDS = (
    "source_path",
    "unit_id",
    "unit_kind",
    "unit_ref",
    "start_line",
    "end_line",
    "extraction_status",
    "documentation_status",
    "note_path",
)
DOCUMENTATION_STATUSES = {"unprocessed", "completed", "unreadable"}
EXTRACTION_STATUSES = {"ok", "low_text", "error"}
REQUIRED_HEADINGS = (
    "# Cornell Notes",
    "### Cue Column (Questions, Keywords, or Prompts)",
    "### Notes Section (Main Notes)",
    "### Summary Section (Summary of Notes)",
)
HEADING = re.compile(r"^#{1,6}\s+(.+?)\s*$", re.MULTILINE)
MARKDOWN_LINK = re.compile(r"!?\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+[^)]*)?\)")
MARKDOWN_IMAGE = re.compile(r"!\[(?P<alt>[^\]]*)\]\((?P<target><[^>]+>|[^)\s]+)(?:\s+[^)]*)?\)")
PLACEHOLDER = re.compile(
    r"(?i)(?:\bplaceholder\b|\bTODO\b|\bTBD\b|\bto be completed\b|"
    r"\binsert (?:text|topic|date|source|content)\b|\breplace with\b|"
    r"\[\s*(?:focused peripheral topic|dd/mm/yyyy|topic-specific question|"
    r"verified concepts[^\]]*|concrete takeaways[^\]]*|insert[^\]]*)\s*\]|\[\.\.\.\]|\{\{[^}]+\}\})"
)
FILE_ANCHOR = re.compile(
    r"(?i)(?:\.pdf\s*(?:,|\s)+(?:pdf\s*)?p{1,2}\.?\s*\d+(?:\s*[-–]\s*\d+)?|"
    r"\.(?:c|cc|cpp|cxx|h|hpp|hxx|py)\s*(?::|,|\s)+(?:l(?:ine)?s?\s*)?\d+)"
)
LINE_FRAGMENT = re.compile(r"(?i)^L\d+(?:-L?\d+)?$")
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
ALT_PLACEHOLDERS = {"image", "picture", "figure", "diagram", "photo", "screenshot", "alt text"}
FIGURE_SOURCE_FIELDS = ("creator:", "title:", "original:", "reuse:", "changes:")
FIGURE_CAPTION_PREFIX = r"(?:Figure|Fig\.?|Hình|Ảnh|Figura|Abbildung|Imagem|Image|Imagen|図|图|圖|그림)"


def _normalize_anchor(heading: str) -> str:
    heading = re.sub(r"\s+\{#[^}]+\}\s*$", "", heading.strip())
    heading = heading.lower().replace("_", "-")
    heading = re.sub(r"[^\w\- ]", "", heading, flags=re.UNICODE)
    return re.sub(r"[\s-]+", "-", heading).strip("-")


def _markdown_anchors(text: str) -> set[str]:
    return {_normalize_anchor(heading) for heading in HEADING.findall(text)}


def _split_cornell_sections(text: str) -> tuple[str, str, str, list[str]]:
    lines = text.splitlines()
    positions = {
        heading: next((index for index, line in enumerate(lines) if line.strip() == heading), -1)
        for heading in REQUIRED_HEADINGS
    }
    cue_title = REQUIRED_HEADINGS[1]
    notes_title = REQUIRED_HEADINGS[2]
    summary_title = REQUIRED_HEADINGS[3]
    cue_at, notes_at, summary_at = positions[cue_title], positions[notes_title], positions[summary_title]
    cue = "\n".join(lines[cue_at + 1 : notes_at]) if cue_at >= 0 and notes_at > cue_at else ""
    notes = "\n".join(lines[notes_at + 1 : summary_at]) if notes_at >= 0 and summary_at > notes_at else ""
    summary = "\n".join(lines[summary_at + 1 :]) if summary_at >= 0 else ""
    return cue, notes, summary, lines


def _repo_relative_or_absolute(path: Path, repo_root: Path) -> Path:
    if path.is_absolute():
        return path.resolve()
    return (repo_root / path).resolve()


def validate_links(note_path: Path, text: str) -> list[str]:
    errors: list[str] = []
    note_dir = note_path.parent
    for match in MARKDOWN_LINK.finditer(text):
        target = match.group(1)
        if target.startswith("<") and target.endswith(">"):
            target = target[1:-1]
        target = unquote(target)
        if target.startswith(("http://", "https://", "mailto:", "//")):
            continue
        local_target, separator, fragment = target.partition("#")
        if local_target:
            destination = (note_dir / local_target).resolve()
            if not destination.exists():
                errors.append(f"{note_path}: broken local link {target}")
                continue
        else:
            destination = note_path.resolve()
        if separator and fragment and destination.suffix.lower() == ".md":
            try:
                destination_text = destination.read_text(encoding="utf-8")
            except (OSError, UnicodeError) as error:
                errors.append(f"{note_path}: cannot inspect link anchor {target}: {error}")
                continue
            if not LINE_FRAGMENT.fullmatch(fragment) and fragment not in _markdown_anchors(destination_text):
                errors.append(f"{note_path}: broken Markdown anchor {target}")
    return errors


def validate_figures(note_path: Path, text: str) -> list[str]:
    """Check that embedded figures are local, described, captioned, and sourced."""
    errors: list[str] = []
    notes_heading = re.search(r"(?m)^### Notes Section \(Main Notes\)\s*$", text)
    summary_heading = re.search(r"(?m)^### Summary Section \(Summary of Notes\)\s*$", text)
    if not notes_heading or not summary_heading or summary_heading.start() <= notes_heading.end():
        return errors
    notes_text = text[notes_heading.end() : summary_heading.start()]
    sources_match = re.search(r"(?im)^\s*(?:#{3,6}\s+Sources|\*\*Sources\*\*)\s*$", notes_text)
    source_entries: dict[str, str] = {}
    if sources_match:
        source_text = notes_text[sources_match.end() :]
        source_entries = {
            source_id: entry
            for source_id, entry in re.findall(
                r"(?im)^\s*(?:[-*+]\s*)?\[(S\d+)\]\s+(.+)$", source_text
            )
        }

    lines = text.splitlines()
    for match in MARKDOWN_IMAGE.finditer(text):
        line_number = text.count("\n", 0, match.start()) + 1
        prefix = f"{note_path}:{line_number}"
        if not notes_heading.end() <= match.start() < summary_heading.start():
            errors.append(f"{prefix}: embedded figures must appear inside the Notes Section")

        alt = match.group("alt").strip()
        words = re.findall(r"[\w'-]+", alt, flags=re.UNICODE)
        if alt.casefold() in ALT_PLACEHOLDERS or len(alt) < 12 or len(words) < 3:
            errors.append(f"{prefix}: figure needs descriptive alt text (at least three meaningful words)")

        target = match.group("target").strip()
        if target.startswith("<") and target.endswith(">"):
            target = target[1:-1]
        target = unquote(target)
        if target.startswith(("http://", "https://", "//", "data:")):
            errors.append(f"{prefix}: embedded figures must use a local relative image file")
        else:
            local_target = target.partition("#")[0]
            if Path(local_target).is_absolute() or PureWindowsPath(local_target).is_absolute():
                errors.append(f"{prefix}: embedded figures must use a local relative image file")
            else:
                note_dir = note_path.resolve().parent
                image_path = (note_dir / local_target).resolve()
                try:
                    image_path.relative_to(note_dir)
                except ValueError:
                    errors.append(f"{prefix}: embedded figure must stay inside the note directory")
            if Path(local_target).suffix.lower() not in IMAGE_EXTENSIONS:
                errors.append(f"{prefix}: embedded figure must use a PNG, JPEG, or WebP file")

        image_line_index = line_number - 1
        caption_line_index = image_line_index + 1
        while caption_line_index < len(lines) and not lines[caption_line_index].strip():
            caption_line_index += 1
        if caption_line_index >= len(lines):
            errors.append(f"{prefix}: figure needs an adjacent numbered caption with a source ID")
            continue

        caption = lines[caption_line_index].strip().strip("*_ ")
        if not re.match(rf"(?i)^{FIGURE_CAPTION_PREFIX}\s+\d+[.:]\s+\S", caption):
            errors.append(f"{prefix}: figure needs an adjacent numbered caption with a source ID")
            continue
        caption_sources = set(re.findall(r"\[(S\d+)\]", caption))
        if not caption_sources:
            errors.append(f"{note_path}:{caption_line_index + 1}: figure caption must cite a listed source ID")
            continue
        for source_id in sorted(caption_sources):
            entry = source_entries.get(source_id)
            if entry is None:
                errors.append(f"{note_path}:{caption_line_index + 1}: figure caption source {source_id} is not declared in Sources")
                continue
            lowered = entry.casefold()
            missing_fields = [field[:-1] for field in FIGURE_SOURCE_FIELDS if field not in lowered]
            if missing_fields:
                errors.append(
                    f"{note_path}: figure source {source_id} must record: {', '.join(missing_fields)}"
                )
            if not MARKDOWN_LINK.search(entry) and not re.search(r"https?://\S+", entry):
                errors.append(f"{note_path}: figure source {source_id} needs an original source link")

    return errors


def validate_coverage(csv_path: Path, repo_root: Path) -> list[str]:
    errors: list[str] = []
    if not csv_path.is_file():
        return [f"coverage CSV does not exist: {csv_path}"]
    try:
        handle = csv_path.open("r", encoding="utf-8-sig", newline="")
    except OSError as error:
        return [f"cannot read coverage CSV {csv_path}: {error}"]
    with handle:
        reader = csv.DictReader(handle)
        if tuple(reader.fieldnames or ()) != COVERAGE_FIELDS:
            return [f"{csv_path}: expected columns in order: {','.join(COVERAGE_FIELDS)}"]
        seen: set[str] = set()
        count = 0
        for row_number, row in enumerate(reader, start=2):
            count += 1
            prefix = f"{csv_path}:{row_number}"
            unit_id = (row.get("unit_id") or "").strip()
            if not unit_id:
                errors.append(f"{prefix}: unit_id is required")
            elif unit_id in seen:
                errors.append(f"{prefix}: duplicate unit_id {unit_id}")
            seen.add(unit_id)

            source_path = (row.get("source_path") or "").strip()
            unit_kind = (row.get("unit_kind") or "").strip()
            unit_ref = (row.get("unit_ref") or "").strip()
            if not source_path or not unit_kind or not unit_ref:
                errors.append(f"{prefix}: source_path, unit_kind, and unit_ref are required")

            extraction_status = (row.get("extraction_status") or "").strip()
            documentation_status = (row.get("documentation_status") or "").strip()
            if extraction_status not in EXTRACTION_STATUSES:
                errors.append(f"{prefix}: invalid extraction_status {extraction_status!r}")
            if documentation_status not in DOCUMENTATION_STATUSES:
                errors.append(f"{prefix}: invalid documentation_status {documentation_status!r}")
            if extraction_status in {"low_text", "error"} and documentation_status != "unreadable":
                errors.append(f"{prefix}: low-text or failed extraction must be marked unreadable")
            if documentation_status == "completed":
                note_value = (row.get("note_path") or "").strip()
                if not note_value:
                    errors.append(f"{prefix}: completed coverage row must name note_path")
                else:
                    note_target = _repo_relative_or_absolute(Path(note_value), repo_root)
                    if note_target.suffix.lower() != ".md" or not note_target.is_file():
                        errors.append(f"{prefix}: completed note_path does not resolve to a Markdown file: {note_value}")
            for field in ("start_line", "end_line"):
                value = (row.get(field) or "").strip()
                if unit_kind == "pdf_page":
                    if value:
                        errors.append(f"{prefix}: PDF page units use page numbers in unit_ref, not {field}")
                elif not value.isdigit() or int(value) < 1:
                    errors.append(f"{prefix}: {field} must be a positive line number for {unit_kind} units")
            if unit_kind == "pdf_page" and not re.fullmatch(r"page [1-9]\d*", unit_ref):
                errors.append(f"{prefix}: PDF unit_ref must use 'page N' format")
            elif unit_kind != "pdf_page":
                start_line = (row.get("start_line") or "").strip()
                end_line = (row.get("end_line") or "").strip()
                if start_line.isdigit() and end_line.isdigit() and int(end_line) < int(start_line):
                    errors.append(f"{prefix}: end_line must not precede start_line")
        if count == 0:
            errors.append(f"{csv_path}: coverage CSV contains no units")
    return errors


def validate_note(note_path: Path, repo_root: Path, coverage_csv: Path | None = None) -> list[str]:
    errors: list[str] = []
    if not note_path.is_file():
        return [f"note does not exist: {note_path}"]
    try:
        text = note_path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        return [f"cannot read note as UTF-8: {note_path}: {error}"]

    lines = text.splitlines()
    headings = [line.strip() for line in lines]
    heading_positions: list[int] = []
    for heading in REQUIRED_HEADINGS:
        matches = [index for index, line in enumerate(headings) if line == heading]
        if not matches:
            errors.append(f"{note_path}: missing required heading {heading!r}")
            heading_positions.append(-1)
        else:
            if len(matches) > 1:
                errors.append(f"{note_path}: required heading appears more than once: {heading!r}")
            heading_positions.append(matches[0])

    topic_lines = [line.strip() for line in lines if re.match(r"^##\s+Topic\s*:", line.strip())]
    if len(topic_lines) != 1 or not re.fullmatch(r"## Topic:\s*\S.*", topic_lines[0] if topic_lines else ""):
        errors.append(f"{note_path}: expected one non-empty '## Topic: ...' heading")
    topic_position = next(
        (index for index, line in enumerate(headings) if re.match(r"^##\s+Topic\s*:", line)), -1
    )
    date_lines = [line.strip() for line in lines if re.match(r"^##\s+Date\s*:", line.strip())]
    if len(date_lines) != 1:
        errors.append(f"{note_path}: expected one '## Date: DD/MM/YYYY' heading")
        date_position = -1
    else:
        date_position = next(
            (index for index, line in enumerate(headings) if re.match(r"^##\s+Date\s*:", line)), -1
        )
        date_match = re.fullmatch(r"## Date:\s*(\d{2}/\d{2}/\d{4})", date_lines[0])
        if not date_match:
            errors.append(f"{note_path}: date must use DD/MM/YYYY")
        else:
            try:
                datetime.strptime(date_match.group(1), "%d/%m/%Y")
            except ValueError:
                errors.append(f"{note_path}: invalid calendar date {date_match.group(1)}")

    ordered_positions = [heading_positions[0], topic_position, date_position, *heading_positions[1:]]
    if all(position >= 0 for position in ordered_positions) and ordered_positions != sorted(ordered_positions):
        errors.append(f"{note_path}: Cornell headings are out of order")

    for match in PLACEHOLDER.finditer(text):
        line_number = text.count("\n", 0, match.start()) + 1
        errors.append(f"{note_path}:{line_number}: unresolved placeholder {match.group(0)!r}")

    cue, notes, summary, _ = _split_cornell_sections(text)
    if not cue.strip():
        errors.append(f"{note_path}: Cue Column has no content")
    if not notes.strip():
        errors.append(f"{note_path}: Notes Section has no content")
    if not summary.strip():
        errors.append(f"{note_path}: Summary Section has no content")
    has_citation = bool(MARKDOWN_LINK.search(notes) or re.search(r"https?://\S+", notes) or re.search(r"\[\d+\]", notes) or FILE_ANCHOR.search(notes))
    if notes.strip() and not has_citation:
        errors.append(
            f"{note_path}: Notes Section needs a source link, numbered citation, or PDF/code page-line reference"
        )
    sources_match = re.search(r"(?im)^\s*(?:#{3,6}\s+Sources|\*\*Sources\*\*)\s*$", notes)
    if notes.strip() and not sources_match:
        errors.append(f"{note_path}: Notes Section needs a Sources list")
    elif sources_match:
        source_text = notes[sources_match.end() :]
        source_ids = set(re.findall(r"(?im)^\s*(?:[-*+]\s*)?\[(S\d+)\]\s+.+", source_text))
        cited_ids = set(re.findall(r"\[(S\d+)\]", notes[: sources_match.start()]))
        if not source_ids:
            errors.append(f"{note_path}: Sources list needs at least one [S#] reference entry")
        if not cited_ids:
            errors.append(f"{note_path}: Notes Section needs a claim marked with a source ID such as [S1]")
        missing_sources = sorted(cited_ids - source_ids)
        if missing_sources:
            errors.append(f"{note_path}: cited source IDs missing from Sources list: {', '.join(missing_sources)}")
        source_entries = re.findall(r"(?im)^\s*(?:[-*+]\s*)?\[S\d+\]\s+(.+)$", source_text)
        if any(not (MARKDOWN_LINK.search(entry) or re.search(r"https?://\S+", entry)) for entry in source_entries):
            errors.append(f"{note_path}: each Sources entry needs a Markdown link or direct URL")
    errors.extend(validate_links(note_path, text))
    errors.extend(validate_figures(note_path, text))

    if coverage_csv:
        errors.extend(validate_coverage(coverage_csv.expanduser().resolve(), repo_root))
    return errors


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("note", type=Path, help="Cornell Markdown note to validate")
    parser.add_argument("--repo-root", type=Path, default=REPO_ROOT, help="repository root for coverage note paths")
    parser.add_argument("--coverage-csv", type=Path, help="optional source coverage ledger to validate")
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    note_path = args.note.expanduser().resolve()
    repo_root = args.repo_root.expanduser().resolve()
    if not repo_root.is_dir():
        parser.error(f"--repo-root is not a directory: {repo_root}")
    errors = validate_note(note_path, repo_root, args.coverage_csv)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"validated Cornell note: {note_path}")
    if args.coverage_csv:
        print(f"validated coverage ledger: {args.coverage_csv.expanduser().resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
