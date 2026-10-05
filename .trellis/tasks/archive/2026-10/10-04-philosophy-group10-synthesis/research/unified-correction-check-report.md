# Independent unified-document correction check

Final candidate: `05_capstone_project/Tieu-luan_Nhom-10_Thong-nhat.docx`; Word export `C:/Users/daveb/AppData/Local/Temp/philosophy_unified_1004/final-v5.pdf`.

## Result

PASS for the latest authorized preservation and citation-format correction. No artifact or source files were edited by the reviewer.

- Entire source prose matches in original order after ignoring only whitespace, Markdown formatting markers and the authorized citation-marker conversions/removals.
- All 88 supplied bibliographic entries survive, including duplicates and the eight original 2.1 footnote entries. Their strings match exactly after stripping numeric labels and formatting; no replacement source or invented entry appears.
- All 96 true Word footnotes map to the corresponding original local sources, use continuous unique anchors 1–96 and retain original source wording.
- Six undefined local 2.2 markers [25]–[27] were removed as explicitly authorized. Associated prose remains unchanged. No unresolved bracket markers remain in the body.
- All eight original input SHA-256 hashes remain unchanged.
- Independently viewed every latest rendered PNG, page-1.png through page-48.png, in render-v5. Cover metadata fields are editable and member rows blank; TOC is legible, has correct page numbers and excludes itself; superscripts remain with preceding text; footnote numbers have visible spacing; body, footnotes and bibliography have no clipping or overlapping text. Natural paragraph/footnote continuations and short chapter-end pages remain.

## Page-count qualification

The PDF contains **48 physical pages**: one cover, two Roman-numbered contents pages, and 45 Arabic-numbered pages. Do not describe this as 45 total pages or assert compliance with a limit that includes all physical pages. Prose fidelity and the requested full footnote placement have priority in this correction; no prose was shortened to meet a page count.

## Evidence

Independent script: `C:/Users/daveb/AppData/Local/Temp/philosophy_verbatim_1004/qa-check/check_academic.py`.

Latest machine results: `qa-check/academic_result.json`; original hashes: `qa-check/input_hashes.json`; original full content snapshot: `qa-check/originals.json`.

The initial missing split-run [7] citation was detected independently and repaired by the implementer; the final exact sequence contains its expected source. Original bibliography/prose factual or citation-association issues were retained rather than editorially corrected, as requested.

Lint and TypeCheck: not applicable to a DOCX-only deliverable. Deterministic content/reference/hash tests: PASS. Full final rendered-page inspection: PASS.
