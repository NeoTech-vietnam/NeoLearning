#!/usr/bin/env python3
"""Validate structural requirements for LeetCode Cornell notes."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


REQUIRED_EXACT_HEADINGS = (
    "# Cornell Notes",
    "### Problem Description",
    "#### Constraints",
    "#### Function Contract",
    "### Cue Column (Questions, Keywords, or Prompts)",
    "### Notes Section (Main Notes)",
    "### Summary Section (Summary of Notes)",
)


def fences_are_balanced(text: str) -> bool:
    opening: tuple[str, int] | None = None

    for line in text.splitlines():
        match = re.match(r"^(`{3,}|~{3,})(.*)$", line)
        if match is None:
            continue

        marker = match.group(1)
        marker_char = marker[0]
        marker_length = len(marker)

        if opening is None:
            opening = (marker_char, marker_length)
        elif marker_char == opening[0] and marker_length >= opening[1]:
            opening = None

    return opening is None


def strategy_letters(text: str) -> set[str]:
    return set(re.findall(r"^## Strategy ([A-Z])(?:\b|:)", text, re.MULTILINE))


def headed_blocks(
    text: str,
    heading_pattern: re.Pattern[str],
) -> dict[str, str]:
    headings = list(heading_pattern.finditer(text))
    blocks: dict[str, str] = {}

    for heading in headings:
        remaining = text[heading.end() :]
        next_heading = re.search(r"^#{1,3}\s+", remaining, re.MULTILINE)
        end = (
            heading.end() + next_heading.start()
            if next_heading is not None
            else len(text)
        )
        blocks[heading.group(1)] = text[heading.end() : end].strip()

    return blocks


def flow_blocks(text: str) -> dict[str, str]:
    return headed_blocks(
        text,
        re.compile(r"^### Strategy ([A-Z]) Flow\s*$", re.MULTILINE),
    )


def worked_example_flow_blocks(text: str) -> dict[str, str]:
    return headed_blocks(
        text,
        re.compile(
            r"^### Strategy ([A-Z]) Worked Example Flow\s*$",
            re.MULTILINE,
        ),
    )


def validate_note(path: Path) -> list[str]:
    errors: list[str] = []

    if not path.is_file():
        return ["file does not exist"]

    text = path.read_text(encoding="utf-8")

    if not re.search(r"^## Topic: Leetcode - \d+ - .+$", text, re.MULTILINE):
        errors.append("missing or invalid Topic heading")

    if not re.search(
        r"^## Date: \d{2}/\d{2}/\d{4}$",
        text,
        re.MULTILINE,
    ):
        errors.append("missing or invalid DD/MM/YYYY Date heading")

    for heading in REQUIRED_EXACT_HEADINGS:
        count = len(re.findall(rf"^{re.escape(heading)}$", text, re.MULTILINE))
        if count != 1:
            errors.append(f"expected exactly one `{heading}`, found {count}")

    if not fences_are_balanced(text):
        errors.append("unbalanced Markdown code fences")

    if re.search(r"<style(?:\s|>)", text, re.IGNORECASE):
        errors.append("raw HTML style block found; use Mermaid classDef")

    strategies = strategy_letters(text)
    flows = flow_blocks(text)
    worked_example_flows = worked_example_flow_blocks(text)

    missing_flows = sorted(strategies - flows.keys())
    extra_flows = sorted(flows.keys() - strategies)
    missing_worked_example_flows = sorted(
        strategies - worked_example_flows.keys()
    )
    extra_worked_example_flows = sorted(
        worked_example_flows.keys() - strategies
    )

    if missing_flows:
        errors.append(
            "strategies missing Mermaid flows: " + ", ".join(missing_flows)
        )
    if extra_flows:
        errors.append(
            "flows without matching strategies: " + ", ".join(extra_flows)
        )
    if missing_worked_example_flows:
        errors.append(
            "strategies missing worked-example Mermaid flows: "
            + ", ".join(missing_worked_example_flows)
        )
    if extra_worked_example_flows:
        errors.append(
            "worked-example flows without matching strategies: "
            + ", ".join(extra_worked_example_flows)
        )

    mermaid_only_pattern = re.compile(
        r"^```mermaid\s*\n.+\n```$",
        re.DOTALL,
    )
    flow_groups = (
        ("flow", flows),
        ("worked-example flow", worked_example_flows),
    )
    for flow_name, blocks in flow_groups:
        for letter, block in sorted(blocks.items()):
            if mermaid_only_pattern.fullmatch(block) is None:
                errors.append(
                    f"Strategy {letter} {flow_name} must contain "
                    "one Mermaid fence only"
                )
            elif "classDef" not in block:
                errors.append(
                    f"Strategy {letter} {flow_name} lacks "
                    "Mermaid classDef styling"
                )

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate LeetCode Cornell note structure.",
    )
    parser.add_argument("notes", nargs="+", type=Path)
    args = parser.parse_args()

    failed = False

    for path in args.notes:
        errors = validate_note(path)
        if errors:
            failed = True
            print(f"FAIL {path}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {path}")

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
