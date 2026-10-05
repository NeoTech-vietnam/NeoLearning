#!/usr/bin/env python3
"""Retrieve source-grounded chunks from explicitly selected local roots."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import sqlite3
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Sequence


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
LOW_TEXT_CHARACTERS = 40
SUPPORTED_EXTENSIONS = {".md", ".pdf", ".c", ".h", ".cc", ".cpp", ".cxx", ".hpp", ".hxx", ".py"}
CODE_EXTENSIONS = {".c", ".h", ".cc", ".cpp", ".cxx", ".hpp", ".hxx", ".py"}
IGNORED_DIRECTORY_NAMES = {
    ".git",
    ".hg",
    ".svn",
    ".venv",
    "venv",
    "__pycache__",
    "node_modules",
    "build",
    "dist",
}
HEADING = re.compile(r"^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$")
QUERY_WORD = re.compile(r"[^\W_]+", re.UNICODE)


class RetrievalError(Exception):
    """A selected source could not be indexed safely."""


@dataclass(frozen=True)
class SourceUnit:
    source_path: str
    unit_id: str
    unit_kind: str
    unit_ref: str
    start_line: int | None
    end_line: int | None
    extraction_status: str
    text: str


def source_path_label(path: Path) -> str:
    """Return a stable repository-relative path when the source is in this repo."""
    resolved = path.resolve()
    try:
        return resolved.relative_to(REPO_ROOT).as_posix()
    except ValueError:
        return str(resolved)


def _unit_id(source_path: str, unit_kind: str, unit_ref: str, start_line: int | None) -> str:
    key = "\0".join((source_path, unit_kind, unit_ref, "" if start_line is None else str(start_line)))
    return hashlib.sha256(key.encode("utf-8")).hexdigest()[:20]


def _make_unit(
    path: Path,
    kind: str,
    ref: str,
    start_line: int | None,
    end_line: int | None,
    status: str,
    text: str,
) -> SourceUnit:
    label = source_path_label(path)
    return SourceUnit(
        source_path=label,
        unit_id=_unit_id(label, kind, ref, start_line),
        unit_kind=kind,
        unit_ref=ref,
        start_line=start_line,
        end_line=end_line,
        extraction_status=status,
        text=text,
    )


def _markdown_headings(lines: Sequence[str]) -> list[tuple[int, int, str]]:
    """Collect headings outside fenced code, returning (line index, level, title)."""
    found: list[tuple[int, int, str]] = []
    fence_char: str | None = None
    fence_size = 0
    for index, line in enumerate(lines):
        fence = re.match(r"^\s{0,3}(`{3,}|~{3,})", line)
        if fence:
            marker = fence.group(1)
            if fence_char is None:
                fence_char, fence_size = marker[0], len(marker)
            elif marker[0] == fence_char and len(marker) >= fence_size:
                fence_char, fence_size = None, 0
            continue
        if fence_char is not None:
            continue
        match = HEADING.match(line)
        if match:
            found.append((index, len(match.group(1)), match.group(2).strip()))
    return found


def markdown_units(path: Path) -> list[SourceUnit]:
    text = path.read_text(encoding="utf-8", errors="replace")
    lines = text.splitlines()
    if not lines:
        return []
    headings = _markdown_headings(lines)
    units: list[SourceUnit] = []
    if not headings:
        if text.strip():
            units.append(_make_unit(path, "markdown", "Document", 1, len(lines), "ok", text))
        return units

    first_heading = headings[0][0]
    preamble = "\n".join(lines[:first_heading]).strip()
    if preamble:
        units.append(_make_unit(path, "markdown", "Preamble", 1, first_heading, "ok", preamble))

    heading_stack: list[tuple[int, str]] = []
    for number, (line_index, level, title) in enumerate(headings):
        while heading_stack and heading_stack[-1][0] >= level:
            heading_stack.pop()
        heading_stack.append((level, title))
        next_line = headings[number + 1][0] if number + 1 < len(headings) else len(lines)
        body = "\n".join(lines[line_index:next_line]).strip()
        if not body:
            continue
        ref = " > ".join(label for _, label in heading_stack)
        units.append(
            _make_unit(path, "markdown", ref, line_index + 1, next_line, "ok", body)
        )
    return units


def _import_pdf_reader():
    try:
        from pypdf import PdfReader
    except ImportError as error:
        raise RetrievalError(
            "PDF retrieval requires pypdf. Install the skill dependencies with "
            "`python -m pip install -r .github/skills/research-to-cornell-notes/requirements.txt`."
        ) from error
    return PdfReader


def pdf_units(path: Path) -> list[SourceUnit]:
    PdfReader = _import_pdf_reader()
    try:
        reader = PdfReader(str(path), strict=False)
        if reader.is_encrypted:
            try:
                reader.decrypt("")
            except Exception as error:  # pragma: no cover - depends on PDF encryption backend
                raise RetrievalError(f"cannot read encrypted PDF {path}: {error}") from error
            if reader.is_encrypted:
                raise RetrievalError(f"cannot read encrypted PDF without a password: {path}")
    except RetrievalError:
        raise
    except Exception as error:
        raise RetrievalError(f"cannot open PDF {path}: {error}") from error

    units: list[SourceUnit] = []
    for page_number, page in enumerate(reader.pages, start=1):
        try:
            page_text = page.extract_text() or ""
            status = "ok" if len(page_text.strip()) >= LOW_TEXT_CHARACTERS else "low_text"
        except Exception as error:
            page_text = ""
            status = "error"
            print(
                f"warning: PDF page extraction failed for {path} page {page_number}: {error}",
                file=sys.stderr,
            )
        if status == "low_text":
            print(
                f"warning: PDF page has too little extractable text and needs visual review: {path} page {page_number}",
                file=sys.stderr,
            )
        units.append(
            _make_unit(path, "pdf_page", f"page {page_number}", None, None, status, page_text)
        )
    return units


def _tree_sitter_parser(extension: str):
    try:
        from tree_sitter import Language, Parser
    except ImportError as error:
        raise RetrievalError(
            "code retrieval requires tree-sitter. Install the skill dependencies with "
            "`python -m pip install -r .github/skills/research-to-cornell-notes/requirements.txt`."
        ) from error

    grammar_modules = {
        ".c": ("tree_sitter_c", "language"),
        ".h": ("tree_sitter_c", "language"),
        ".cc": ("tree_sitter_cpp", "language"),
        ".cpp": ("tree_sitter_cpp", "language"),
        ".cxx": ("tree_sitter_cpp", "language"),
        ".hpp": ("tree_sitter_cpp", "language"),
        ".hxx": ("tree_sitter_cpp", "language"),
        ".py": ("tree_sitter_python", "language"),
    }
    module_name, language_factory = grammar_modules[extension]
    try:
        module = __import__(module_name, fromlist=[language_factory])
        grammar = Language(getattr(module, language_factory)())
        return Parser(grammar)
    except ImportError as error:
        raise RetrievalError(
            f"code retrieval for {extension} requires {module_name}; install the skill dependencies "
            "with `python -m pip install -r .github/skills/research-to-cornell-notes/requirements.txt`."
        ) from error
    except Exception as error:
        raise RetrievalError(f"cannot initialize Tree-sitter grammar for {extension}: {error}") from error


def _identifier_for_node(node, source: bytes) -> str:
    """Add a readable declaration name when the top-level node has one."""
    identifiers: list[str] = []
    stack = list(reversed(node.named_children))
    while stack:
        child = stack.pop()
        if child.type == "identifier":
            identifiers.append(source[child.start_byte : child.end_byte].decode("utf-8", errors="replace"))
            break
        stack.extend(reversed(child.named_children))
    return identifiers[0] if identifiers else ""


def code_units(path: Path) -> list[SourceUnit]:
    parser = _tree_sitter_parser(path.suffix.lower())
    try:
        source = path.read_bytes()
        tree = parser.parse(source)
    except Exception as error:
        raise RetrievalError(f"Tree-sitter could not parse {path}: {error}") from error
    if tree.root_node.has_error:
        raise RetrievalError(
            f"Tree-sitter reported syntax errors in {path}; fix or isolate the source before indexing it."
        )

    units: list[SourceUnit] = []
    for node in tree.root_node.named_children:
        if node.end_byte <= node.start_byte:
            continue
        snippet = source[node.start_byte : node.end_byte].decode("utf-8", errors="replace")
        if not snippet.strip():
            continue
        start_line = node.start_point.row + 1
        end_line = node.end_point.row if node.end_point.column == 0 else node.end_point.row + 1
        name = _identifier_for_node(node, source)
        ref = f"{node.type}{' ' + name if name else ''}"
        units.append(_make_unit(path, "code", ref, start_line, end_line, "ok", snippet))
    return units


def roots_to_files(roots: Sequence[Path], include_code: bool) -> tuple[list[Path], list[Path]]:
    resolved_roots: list[Path] = []
    for root in roots:
        resolved = root.expanduser().resolve()
        if not resolved.exists():
            raise RetrievalError(f"selected root does not exist: {root}")
        if not resolved.is_dir() and not resolved.is_file():
            raise RetrievalError(f"selected root is not a file or directory: {root}")
        resolved_roots.append(resolved)

    extensions = SUPPORTED_EXTENSIONS if include_code else SUPPORTED_EXTENSIONS - CODE_EXTENSIONS
    selected: dict[str, Path] = {}
    for root in resolved_roots:
        if root.is_file():
            if root.suffix.lower() in extensions:
                selected[str(root).casefold()] = root
            continue
        for directory, dir_names, file_names in os.walk(root, followlinks=False):
            dir_names[:] = sorted(
                name
                for name in dir_names
                if name.casefold() not in IGNORED_DIRECTORY_NAMES
                and not (Path(directory) / name).is_symlink()
            )
            for file_name in file_names:
                candidate = Path(directory) / file_name
                if candidate.is_symlink() or candidate.suffix.lower() not in extensions:
                    continue
                selected[str(candidate.resolve()).casefold()] = candidate

    files = sorted(selected.values(), key=lambda path: source_path_label(path).casefold())
    return files, resolved_roots


def extract_units(files: Sequence[Path], include_code: bool) -> list[SourceUnit]:
    units: list[SourceUnit] = []
    for path in files:
        extension = path.suffix.lower()
        if extension == ".md":
            units.extend(markdown_units(path))
        elif extension == ".pdf":
            units.extend(pdf_units(path))
        elif extension in CODE_EXTENSIONS and include_code:
            units.extend(code_units(path))
    return units


def _coverage_existing(path: Path) -> dict[str, dict[str, str]]:
    if not path.exists():
        return {}
    try:
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            if tuple(reader.fieldnames or ()) != COVERAGE_FIELDS:
                raise RetrievalError(
                    f"coverage CSV must have these columns in order: {','.join(COVERAGE_FIELDS)}"
                )
            rows = {}
            for row in reader:
                unit_id = (row.get("unit_id") or "").strip()
                if not unit_id:
                    continue
                rows[unit_id] = {field: (row.get(field) or "") for field in COVERAGE_FIELDS}
            return rows
    except UnicodeError as error:
        raise RetrievalError(f"cannot read coverage CSV as UTF-8: {path}: {error}") from error


def _path_is_under_roots(source_path: str, roots: Sequence[Path]) -> bool:
    source = Path(source_path)
    if not source.is_absolute():
        source = REPO_ROOT / source
    try:
        resolved_source = source.resolve()
    except OSError:
        return False
    for root in roots:
        try:
            resolved_source.relative_to(root)
            return True
        except ValueError:
            continue
    return False


def write_coverage(path: Path, units: Sequence[SourceUnit], roots: Sequence[Path]) -> None:
    old_rows = _coverage_existing(path)
    new_rows: dict[str, dict[str, str]] = {}
    for unit in units:
        previous = old_rows.get(unit.unit_id, {})
        if unit.extraction_status in {"low_text", "error"}:
            documentation_status = "unreadable"
            note_path = ""
        else:
            status = previous.get("documentation_status", "unprocessed")
            documentation_status = status if status in DOCUMENTATION_STATUSES else "unprocessed"
            note_path = previous.get("note_path", "") if documentation_status == "completed" else ""
        new_rows[unit.unit_id] = {
            "source_path": unit.source_path,
            "unit_id": unit.unit_id,
            "unit_kind": unit.unit_kind,
            "unit_ref": unit.unit_ref,
            "start_line": "" if unit.start_line is None else str(unit.start_line),
            "end_line": "" if unit.end_line is None else str(unit.end_line),
            "extraction_status": unit.extraction_status,
            "documentation_status": documentation_status,
            "note_path": note_path,
        }

    # A ledger may be built in batches. Preserve entries outside selected roots,
    # while dropping stale units for files that were re-indexed or removed there.
    for unit_id, row in old_rows.items():
        if unit_id in new_rows or _path_is_under_roots(row.get("source_path", ""), roots):
            continue
        new_rows[unit_id] = row

    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_name: str | None = None
    try:
        with tempfile.NamedTemporaryFile(
            "w", encoding="utf-8", newline="", dir=path.parent, delete=False, suffix=".tmp"
        ) as handle:
            temporary_name = handle.name
            writer = csv.DictWriter(handle, fieldnames=COVERAGE_FIELDS, lineterminator="\n")
            writer.writeheader()
            for unit_id in sorted(new_rows):
                writer.writerow(new_rows[unit_id])
        os.replace(temporary_name, path)
    except OSError as error:
        if temporary_name:
            try:
                os.unlink(temporary_name)
            except OSError:
                pass
        raise RetrievalError(f"cannot write coverage CSV {path}: {error}") from error


def retrieve(units: Sequence[SourceUnit], query: str, limit: int) -> list[dict[str, object]]:
    terms = QUERY_WORD.findall(query)
    if not terms:
        raise RetrievalError("query must contain at least one searchable word")
    safe_query = " OR ".join('"' + term.replace('"', '""') + '"' for term in terms[:64])
    connection = sqlite3.connect(":memory:")
    try:
        try:
            connection.execute(
                """CREATE VIRTUAL TABLE source_index USING fts5(
                    source_path UNINDEXED,
                    unit_id UNINDEXED,
                    unit_kind UNINDEXED,
                    unit_ref UNINDEXED,
                    start_line UNINDEXED,
                    end_line UNINDEXED,
                    extraction_status UNINDEXED,
                    text,
                    tokenize='unicode61 remove_diacritics 2'
                )"""
            )
        except sqlite3.OperationalError as error:
            if "fts5" in str(error).lower():
                raise RetrievalError("this Python SQLite build does not include FTS5") from error
            raise
        connection.executemany(
            "INSERT INTO source_index VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                (
                    unit.source_path,
                    unit.unit_id,
                    unit.unit_kind,
                    unit.unit_ref,
                    unit.start_line,
                    unit.end_line,
                    unit.extraction_status,
                    unit.text,
                )
                for unit in units
                if unit.extraction_status == "ok" and unit.text.strip()
            ),
        )
        rows = connection.execute(
            """SELECT source_path, unit_id, unit_kind, unit_ref, start_line,
                      end_line, extraction_status, text
               FROM source_index
               WHERE source_index MATCH ?
               ORDER BY bm25(source_index, 0, 0, 0, 0, 0, 0, 0, 1), source_path, start_line
               LIMIT ?""",
            (safe_query, limit),
        ).fetchall()
        return [
            {
                "source_path": row[0],
                "unit_id": row[1],
                "unit_kind": row[2],
                "unit_ref": row[3],
                "start_line": row[4],
                "end_line": row[5],
                "extraction_status": row[6],
                "text": row[7],
            }
            for row in rows
        ]
    finally:
        connection.close()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, action="append", required=True, help="explicit file or directory to index; repeatable")
    parser.add_argument("--query", required=True, help="lexical query used to retrieve chunks")
    parser.add_argument("--include-code", action="store_true", help="include C, C++, and Python files via Tree-sitter")
    parser.add_argument("--coverage-csv", type=Path, help="write or update a coverage ledger")
    parser.add_argument("--limit", type=int, default=8, help="maximum number of result chunks (default: 8)")
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    if args.limit < 1:
        parser.error("--limit must be at least 1")
    try:
        files, roots = roots_to_files(args.root, args.include_code)
        units = extract_units(files, args.include_code)
        if args.coverage_csv:
            write_coverage(args.coverage_csv.expanduser().resolve(), units, roots)
        results = retrieve(units, args.query, args.limit)
    except RetrievalError as error:
        print(f"error: {error}", file=sys.stderr)
        return 2
    except (OSError, sqlite3.Error) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2
    json.dump(results, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
