#!/usr/bin/env python3
"""Validate generated Cornell notes and local Markdown links."""

from __future__ import annotations

import argparse
import re
from pathlib import Path
from urllib.parse import unquote


REQUIRED = (
    "# Cornell Notes",
    "## Topic:",
    "## Date:",
    "### Cue Column (Questions, Keywords, or Prompts)",
    "### Notes Section (Main Notes)",
    "### Summary Section (Summary of Notes)",
)
PLACEHOLDERS = ("[insert", "[topic-specific", "[verified concepts", "[concrete takeaways", "![alt text]")
LINK = re.compile(r"!?\[[^]]*\]\(([^)]+)\)")
HEADING = re.compile(r"^#{1,6}\s+(.+?)\s*$", re.MULTILINE)


def anchors(text: str) -> set[str]:
    result = set()
    for heading in HEADING.findall(text):
        anchor = heading.strip().lower()
        anchor = re.sub(r"[^\w\- ]", "", anchor)
        result.add(re.sub(r"[\s_]+", "-", anchor))
    return result


def markdown_files(root: Path) -> list[Path]:
    return sorted(path for path in root.rglob("*.md") if ".git" not in path.parts)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", type=Path)
    parser.add_argument("--symbol-file", type=Path)
    parser.add_argument("--reciprocal-links", action="store_true")
    args = parser.parse_args()
    if not args.root.is_dir():
        parser.error(f"not a directory: {args.root}")

    errors: list[str] = []
    files = markdown_files(args.root)
    for path in files:
        text = path.read_text(encoding="utf-8")
        if path.parent.name in {"01_technical_reference_manual", "02_programming_guide", "03_use_cases"}:
            positions = [text.find(heading) for heading in REQUIRED]
            if any(position < 0 for position in positions) or positions != sorted(positions):
                errors.append(f"{path}: missing or misordered Cornell sections")
            if not re.search(r"^## Date: \d{2}/\d{2}/\d{4}$", text, re.MULTILINE):
                errors.append(f"{path}: invalid Cornell date")
        lowered = text.lower()
        for placeholder in PLACEHOLDERS:
            if placeholder in lowered:
                errors.append(f"{path}: placeholder {placeholder!r}")
        if len(re.findall(r"^```", text, re.MULTILINE)) % 2:
            errors.append(f"{path}: unbalanced code fence")
        for target in LINK.findall(text):
            if target.startswith(("http://", "https://", "mailto:")):
                continue
            local, _, fragment = unquote(target).partition("#")
            destination = (path.parent / local).resolve() if local else path.resolve()
            if local and not destination.exists():
                errors.append(f"{path}: broken link {target}")
            elif fragment and destination.suffix.lower() == ".md":
                destination_text = destination.read_text(encoding="utf-8")
                if fragment not in anchors(destination_text):
                    errors.append(f"{path}: broken anchor {target}")

    if args.symbol_file:
        inventory = next(iter(sorted(args.root.rglob("15_*_apis.md"))), None)
        if not inventory:
            errors.append("missing 15_*_apis.md inventory")
        else:
            inventory_text = inventory.read_text(encoding="utf-8")
            for symbol in args.symbol_file.read_text(encoding="utf-8").splitlines():
                symbol = symbol.strip()
                if symbol and symbol not in inventory_text:
                    errors.append(f"{inventory}: missing symbol {symbol}")

    if args.reciprocal_links:
        collections = {"01_technical_reference_manual", "02_programming_guide", "03_use_cases"}
        resolved_files = {path.resolve(): path for path in files}
        outgoing: dict[Path, set[Path]] = {path.resolve(): set() for path in files}
        for path in files:
            source = path.resolve()
            for target in LINK.findall(path.read_text(encoding="utf-8")):
                if target.startswith(("http://", "https://", "mailto:")):
                    continue
                local = unquote(target).partition("#")[0]
                if not local:
                    continue
                destination = (path.parent / local).resolve()
                if destination in resolved_files:
                    outgoing[source].add(destination)
        for source, destinations in outgoing.items():
            source_collection = next((part for part in source.parts if part in collections), None)
            for destination in destinations:
                destination_collection = next((part for part in destination.parts if part in collections), None)
                if source_collection != destination_collection and source not in outgoing[destination]:
                    errors.append(
                        f"{resolved_files[source]}: cross-collection link lacks reciprocal link from "
                        f"{resolved_files[destination]}"
                    )

    if errors:
        print("\n".join(errors))
        return 1
    print(f"validated {len(files)} Markdown files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
