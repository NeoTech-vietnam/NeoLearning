# Source Quality and Coverage

## Source selection

Prefer sources in this order, according to the claim being checked:

1. **Primary evidence:** standards, datasheets, TRMs, peer-reviewed papers, official API references, and the source code or release being documented.
2. **Authoritative explanation:** official vendor documentation, university material, maintainers' design notes, and reputable technical books or surveys.
3. **Context:** community discussions and secondary articles. Use these to discover questions or explain practice, not as the sole support for a consequential technical claim.

Check publication/update dates, version and hardware target, authorship, and whether the source directly supports the claim. For important or disputed claims, compare independent evidence. Report unresolved disagreement rather than selecting a convenient answer. Research methods inspired by STORM, GPT Researcher, and PaperQA do not replace source verification.

## Citation and retrieval anchors

- Web sources: cite a direct page or paper URL and its publication/update date when available.
- GitHub sources: record repository, file path, and a commit/tag or other stable ref. Cite exact line ranges. Use the read-only GitHub tools for repository content; use web search for non-GitHub material.
- Local PDFs: cite the repository-relative path and PDF page number(s). Inspect nearby pages or rendered material when text extraction seems sparse; OCR and automatic interpretation of image-only pages are outside this workflow.
- Local Markdown: cite the path, relevant heading, and line range. Local code: cite the path and exact lines of the relevant syntax unit. Tree-sitter boundaries help locate code; they do not establish what that code means.
- Keep source identifiers stable between the claim and its entry in the in-Notes source list. Do not cite a search results page when the underlying source is available.

## Coverage and gaps

Use a coverage ledger when the user requests comprehensive coverage or when the source is a substantial multi-part corpus. Enumerate retrieved units, preserve the script's source/page/line anchors, and record both extraction and documentation status. Re-running retrieval must not silently erase existing completion mappings.

Treat a PDF page with little or no extracted text as incomplete evidence, not a complete page. Preserve the extraction status reported by the parser, mark such units `unreadable` in documentation status, and describe the gap. Mark units `unprocessed` until their evidence has been examined and included; use `completed` only after it is represented in the note. If the corpus cannot be fully inspected within the request, state which units remain unprocessed. Never infer coverage from a successful index build alone.

## Source figures and image reuse

- Figure search and capture run only after the existing-note fast path has missed or the user explicitly requested new research. Select figures that explain a cited claim; omit decoration and redundant visuals.
- A public webpage being accessible does not grant image-reuse permission. Verify terms for the specific asset. Copy a direct web image only when explicit terms allow reuse and attribution; use a local PDF page/crop only when the source's reuse basis is clear. Otherwise link to the original or draw an original, cited diagram.
- Preserve a local relative image path, descriptive alt text, a nearby numbered caption with `[S#]`, and a matching in-Notes source entry with creator/title (or `not identified`), original direct URL or exact PDF page, reuse/license terms, and modification status. The figure helper supports direct HTTPS PNG/JPEG/WebP downloads and selected PDF page/crop renders; it does not capture a webpage screenshot.
- Visually inspect each saved figure and explain how it clarifies the nearby claim. Page rendering is not OCR: keep text extraction gaps for image-heavy pages unless visual content is actually inspected. The validator checks local files and declared provenance structure only; it does not certify licensing, attribution truth, legibility, or visual correctness.
