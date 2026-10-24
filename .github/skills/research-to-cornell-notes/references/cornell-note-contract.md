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
- Embed a selected figure inside the Notes Section beside the claim it explains. Use a local relative image path, descriptive alt text, and an immediately following numbered caption in the note language (for example, `Figure 1`, `Hình 1`, `Ảnh 1`, or `Figura 1`) that cites its source, for example:

  ```markdown
  ![Block diagram showing how the gateway routes authenticated and unauthenticated messages](figures/ecu-interfaces/gateway-security-path.png)
  *Figure 1. The security module filters messages before routing; source [S2], PDF p. 18, cropped from the source page under CC BY 4.0.*
  ```

- Give every figure caption's source ID a matching entry in `#### Sources`. Use this compact provenance format: `Creator: ...; title: ...; original: [asset or PDF page](URL or local path); reuse: [license/permission and terms](license URL); changes: unchanged, cropped from PDF p. N, or other accurate modification note.` Write `not identified` when creator or title truly cannot be found. Record the actual reuse basis for the specific figure, not only the page that contains it.
- Prefer an original local source file or a direct image asset whose specific reuse terms permit repository copying. If permission is unclear, leave the image remote-linked or draw an original cited diagram; do not embed an unlicensed copy. The local validator checks declared provenance fields and link structure, but it cannot establish legal rights, visual accuracy, or whether an image truly supports the prose.

Use the language requested by the user. Keep paragraphs and examples readable as study notes; use a small diagram or table when it clarifies a process or comparison.
