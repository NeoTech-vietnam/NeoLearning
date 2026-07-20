#!/usr/bin/env python3
"""Prepare immutable TRM and ESP-IDF source snapshots for note generation."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path


def run(*args: str, cwd: Path | None = None, stdout=None) -> subprocess.CompletedProcess:
    return subprocess.run(args, cwd=cwd, stdout=stdout, check=True, text=stdout is None)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_pages(value: str) -> tuple[int, int]:
    first, separator, last = value.partition(":")
    if not separator or not first.isdigit() or not last.isdigit():
        raise argparse.ArgumentTypeError("pages must be FIRST:LAST")
    result = int(first), int(last)
    if result[0] < 1 or result[1] < result[0]:
        raise argparse.ArgumentTypeError("invalid page range")
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", type=Path, required=True)
    parser.add_argument("--topic-root", type=Path, required=True)
    parser.add_argument("--trm", type=Path, required=True)
    parser.add_argument("--pages", type=parse_pages, required=True)
    parser.add_argument("--idf-root", type=Path, required=True)
    parser.add_argument("--idf-ref", required=True)
    parser.add_argument("--target", required=True)
    parser.add_argument("--peripheral", required=True)
    parser.add_argument("--idf-path", action="append", default=[])
    parser.add_argument("--symbol-path", action="append", default=[])
    parser.add_argument("--symbol-prefix", action="append", default=[])
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--markitdown")
    args = parser.parse_args()

    for path in (args.repo_root, args.topic_root, args.idf_root):
        if not path.is_dir():
            parser.error(f"not a directory: {path}")
    if not args.trm.is_file():
        parser.error(f"not a file: {args.trm}")

    branch = subprocess.check_output(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=args.repo_root, text=True
    ).strip()
    commit = subprocess.check_output(
        ["git", "rev-parse", f"{args.idf_ref}^{{commit}}"], cwd=args.idf_root, text=True
    ).strip()
    output = args.output_dir or Path(tempfile.mkdtemp(prefix=f"esp-idf-notes-{args.peripheral}-"))
    output.mkdir(parents=True, exist_ok=True)
    trm_dir = output / "trm"
    idf_dir = output / "idf"
    trm_dir.mkdir(exist_ok=True)
    idf_dir.mkdir(exist_ok=True)

    first, last = args.pages
    layout = trm_dir / "chapter-layout.txt"
    with layout.open("w", encoding="utf-8") as destination:
        run("pdftotext", "-f", str(first), "-l", str(last), "-layout", str(args.trm), "-", stdout=destination)

    markitdown_output = None
    markitdown = Path(args.markitdown) if args.markitdown else None
    if markitdown and markitdown.is_file():
        chapter_pdf = trm_dir / "chapter.pdf"
        run(
            "pdftocairo", "-f", str(first), "-l", str(last), "-pdf",
            str(args.trm), str(chapter_pdf),
        )
        markitdown_output = trm_dir / "chapter-markitdown.md"
        run(str(markitdown), str(chapter_pdf), "-o", str(markitdown_output))

    exported = []
    for relative in args.idf_path:
        relative_path = Path(relative)
        if relative_path.is_absolute() or ".." in relative_path.parts:
            parser.error(f"idf path must be repository-relative: {relative}")
        destination = idf_dir / relative_path
        destination.parent.mkdir(parents=True, exist_ok=True)
        with destination.open("wb") as output_file:
            subprocess.run(
                ["git", "show", f"{args.idf_ref}:{relative}"],
                cwd=args.idf_root,
                stdout=output_file,
                check=True,
            )
        exported.append(relative)

    symbol_paths = args.symbol_path or exported
    unknown_symbol_paths = sorted(set(symbol_paths) - set(exported))
    if unknown_symbol_paths:
        parser.error(f"symbol paths were not exported: {', '.join(unknown_symbol_paths)}")
    prefixes = args.symbol_prefix or [f"{args.peripheral}_"]
    symbols: set[str] = set()
    for relative in symbol_paths:
        source = idf_dir / relative
        if source.suffix not in {".c", ".h"}:
            continue
        source_text = source.read_text(encoding="utf-8", errors="replace")
        for prefix in prefixes:
            escaped = re.escape(prefix)
            symbols.update(re.findall(rf"\b({escaped}[A-Za-z0-9_]*)\s*\(", source_text))
            symbols.update(re.findall(rf"\b({escaped}[A-Za-z0-9_]*_t)\b", source_text))
            # Enum values are identifiers, not preprocessor definitions (for
            # example SPI_EV_* and SPI_CMD_HD_*). Restrict discovery to enum
            # bodies so comments/usages do not become false-positive symbols.
            upper = re.escape(prefix.upper())
            for enum_body in re.findall(r"typedef\s+enum(?:\s+\w+)?\s*\{(.*?)\}\s*\w+\s*;", source_text, re.DOTALL):
                symbols.update(re.findall(rf"^\s*({upper}[A-Z0-9_]*)\b", enum_body, re.MULTILINE))
        upper_prefixes = {prefix.upper() for prefix in prefixes}
        for macro in re.findall(r"^#define\s+([A-Z][A-Z0-9_]*)", source_text, re.MULTILINE):
            if any(macro.startswith(prefix) for prefix in upper_prefixes):
                symbols.add(macro)
    (output / "symbols.txt").write_text("\n".join(sorted(symbols)) + "\n", encoding="utf-8")

    manifest = {
        "learning_branch": branch,
        "topic_root": str(args.topic_root.resolve()),
        "target": args.target,
        "peripheral": args.peripheral,
        "trm": {"path": str(args.trm.resolve()), "sha256": sha256(args.trm), "pages": [first, last]},
        "esp_idf": {"root": str(args.idf_root.resolve()), "ref": args.idf_ref, "commit": commit, "paths": exported},
        "extractors": {
            "pdftotext": shutil.which("pdftotext"),
            "markitdown": str(markitdown) if markitdown_output else None,
        },
        "symbol_inventory": {
            "prefixes": prefixes,
            "paths": symbol_paths,
            "count": len(symbols),
        },
    }
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
