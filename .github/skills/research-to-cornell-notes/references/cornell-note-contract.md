# Cornell Note Contract

Use the repository's [topic-neutral Cornell asset](../../generate-esp-idf-peripheral-notes/assets/cornell-note.md) as the structural source. Preserve these headings and their order exactly:

1. `# Cornell Notes`
2. `## Topic: ...`
3. `## Date: DD/MM/YYYY`
4. `### Cue Column (Questions, Keywords, or Prompts)`
5. `### Notes Section (Main Notes)`
6. `### Summary Section (Summary of Notes)`

Replace every template placeholder. Use the current date in `DD/MM/YYYY` format. Keep the topic focused enough that each cue can be answered in the note. Every cue must have a clear answer in the Notes section; the summary restates the main conclusions and ordering or decision rules without introducing unsupported facts.

## Evidence in Notes

- Put claim citations such as `[S1]` and a compact `#### Sources` list inside `### Notes Section (Main Notes)`. Do not move the source list to a separate top-level section. The note validator requires each cited ID to have a matching linked source entry.
- Mark claims with stable source IDs such as `[S1]` and include the matching links and anchors in the Notes section.
- For PDFs, cite the source link/path and the printed or extracted PDF page number(s), for example `manual.pdf, PDF pp. 18–20`. Use PDF page numbering, not a viewer's zero-based index.
- For code, cite the repository path and exact line range, for example `Examples/device/spi.c:L42-L67`; use a stable repository URL and commit/ref when public code may change.
- For Markdown, cite its path, heading, and line range when available. For external sources, use direct links to the relevant official page, paper, or source file.
- Keep each citation close to the claim it supports. Cite a synthesized comparison against every source used for that comparison.

Use the language requested by the user. Keep paragraphs and examples readable as study notes; use a small diagram or table when it clarifies a process or comparison.
