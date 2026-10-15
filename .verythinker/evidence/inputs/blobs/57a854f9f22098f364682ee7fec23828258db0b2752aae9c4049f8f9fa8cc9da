# Cornell Notes

## Topic: Identify a source PDF and navigate between printed and PDF pages

## Date: 2026-10-13

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

## Context and Constraints

Bootstrap how-to for source navigation; not an exhaustive book or lecture inventory.

- KNW-0023 facts are intake-reported; current checks are separately labelled.
- PDF pages are 1-based ordinals and printed labels are independent.
- No exhaustive source/page/lecture/example/topic coverage claim.

## Cue Column

- What identifies this exact file?
- What printed label appears?
- What is its 1-based PDF page?
- Is this intake or current evidence?

## Main Notes

## Source identity and navigation

[Source-reported: KNW-0023] Book: `07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/03-Understanding-Digital-Signal-Processing.pdf`; reported as Richard G. Lyons, *Understanding Digital Signal Processing*, Third Edition, copyright 2011, ISBN 978-0-13-702741-5; 983 PDF pages, 9,466,589 bytes, SHA-256 `f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057` [S1].

[Source-reported: KNW-0023] Lecture: `07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/03_resources/01_lectures/00_Intro.pdf`; 408 PDF pages, 13,042,041 bytes, SHA-256 `de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea` [S1]. These identities do not mean every page or topic was audited.

[Observed: current bootstrap] CHK-0013 passed twice (EVD-0001, EVD-0003); their before/after snapshots matched expected source identities, scoped resources/learning trees, and collision state. CHK-0012 failed with exit 1 (EVD-0002), so no passing runtime/library/skill inspection is claimed [S2–S4].

### Reproducible navigation
1. Identify a source by canonical relative path and SHA-256, not filename alone.
2. Record a PDF page as a 1-based ordinal: PDF page 26 is the 26th page in the file.
3. Separately record the printed page label visible on that page. Front matter can shift the relationship; some pages may have no printed number.
4. Verify labels and section boundaries visually. Record both coordinates together, such as “printed 1 / PDF 26,” reported by KNW-0023 for section 1.1 [S1].
5. Recheck identity before reusing locators after a source file changes.

### Evidence labels
- **[source-reported]**: stated by intake in KNW-0023.
- **[observed]**: returned by a current prescribed CORE run and tied to its evidence record.
- **[expected]**: an oracle or criterion, not an observation.
- **[inferred]**: a conclusion derived from cited facts; identify it explicitly.

> “Exact local edition confirmed PDF4/5” [S1]

This intake quote distinguishes the reported inspection of the book’s opening PDF pages from the later CORE identity checks. Neither establishes exhaustive reading.

## Demonstration

Expected: a reader can state a source path/hash and distinguish printed label from 1-based PDF page. Observed: CHK-0013 passed twice (EVD-0001, EVD-0003); CHK-0012 failed (EVD-0002).

Worked example: evaluate the explicit inputs and expected outcome below.

### Expected Result

[expected] Source identity and page coordinates are reproducible, while intake and current evidence remain distinct.

### Observed Result

[observed] Two current CHK-0013 runs passed and produced recorded workspace/source/collision snapshots.
Evidence: VT-FB18E4DC-EVD-0001, VT-FB18E4DC-EVD-0003

## Failure Cases

- Confusing a printed label with a PDF ordinal.
- Reusing a locator after file hash changes.
- Promoting intake facts to current observations.
- Treating matching hash/page count as exhaustive coverage.

## Practice

[Exercise](source_navigation_exercise.md) · [Answer](source_navigation_answer.md)

Argument vector (run from the project root):

```json
["python","-c","print('Use the written source-navigation exercise and answer key.')"]
```

## Summary

A bounded provenance guide for file identity, printed-page labels, 1-based PDF ordinals, and intake-versus-current evidence.

## Sources

- [S1] PDF skill intake: working source observations and prescribed core route; record:VT-FB18E4DC-KNW-0023; retrieved 2026-10-13T02:45:48Z; locator: book/lecture identities and section 1.1 locator
- [S2] Current CHK-0013 execution EVD-0001; record:VT-FB18E4DC-EVD-0001; retrieved 2026-10-13T02:46:58Z; locator: run 8fd9084f-f6c5-4a99-b351-13a60823f9a1; pass, exit 0
- [S3] Current CHK-0012 execution EVD-0002; record:VT-FB18E4DC-EVD-0002; retrieved 2026-10-13T02:47:28Z; locator: run 833f44d5-8066-49a7-be88-2ca2540fbfc2; fail, exit 1
- [S4] Current CHK-0013 execution EVD-0003; record:VT-FB18E4DC-EVD-0003; retrieved 2026-10-13T02:48:03Z; locator: run d6910521-8304-4d9e-bc9e-2cfb0657334e; pass, exit 0
