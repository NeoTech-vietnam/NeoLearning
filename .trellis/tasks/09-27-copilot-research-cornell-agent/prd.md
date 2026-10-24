# Copilot Research-to-Cornell Notes Agent

## Goal

Provide a VS Code Copilot agent that researches embedded-systems learning topics from local and public sources, then writes source-grounded Cornell notes with useful, attributed figures into the appropriate NeoLearning curriculum location.

## Background and constraints

- NeoLearning is a Markdown knowledge base with course PDFs and the `Examples` submodule; it has no root application runtime or package manager.
- The repo has a topic-neutral Cornell asset at `.github/skills/generate-esp-idf-peripheral-notes/assets/cornell-note.md` and more specialized LeetCode/ESP-IDF note workflows.
- Existing curriculum notes embed local figures and screenshots; relevant source visuals improve technical explanations when placed beside the claims they illustrate.
- Existing `.vscode/mcp.json` contains `mcp_boilerplate`; preserve it.
- `Examples` currently has an unrelated dirty submodule state; preserve it.

## Requirements

- Add one VS Code-targeted Copilot custom agent in `.github/agents` and one reusable research-to-Cornell skill in `.github/skills`.
- Apply STORM-style perspective discovery and outline-first synthesis, GPT Researcher-style research-question decomposition and source tracking, and PaperQA-style retrieval-grounded synthesis without installing or vendoring those projects.
- Follow the topic-neutral Cornell headings and ordering. Include source links within the Notes section, with PDF page numbers and code path/line references where applicable.
- During full research, include useful source visuals inline in Notes when selected sources provide a suitable figure. Capture a local PDF page/crop or permitted direct web image into a note-specific asset folder; add descriptive alt text, a numbered caption, a matching `[S#]` citation, and source attribution/reuse terms. Explain when no suitable figure is available rather than adding decoration.
- Honor the requested note language; ask only when it is unclear. Write only to the identified curriculum topic. If creating a new topic folder, update its parent README.
- Before planning research, quickly search the curriculum for an existing note or section that substantively covers the requested topic. If found and the user has not requested new research or an update, answer concisely from that material and link it; do not start web/RAG research or rewrite the note.
- An incidental repository mention or a note that does not substantively cover the topic is not a fast-path match; continue with the normal research workflow.
- Provide local lexical retrieval using SQLite FTS5, page-aware PDF extraction with `pypdf`, and Tree-sitter chunking for C, C++, and Python. Limit indexing to explicitly selected roots and keep generated indexes outside tracked files.
- Provide a skill-scoped helper for rendering selected local PDF pages/crops and capturing permitted direct HTTPS raster-image resources into note assets. Preserve source URL/page and never overwrite an existing asset by default.
- Validate that embedded figures resolve to local image files, have descriptive alt text and a caption citing a listed source ID, and appear within the Notes section.
- For comprehensive multi-part sources, create a coverage ledger that distinguishes completed, unreadable/low-text, and unprocessed units. Never claim completeness for unreadable pages.
- Add a deterministic note/coverage validator and keep Python dependencies scoped to the skill.
- Add the official GitHub MCP server in read-only mode to `.vscode/mcp.json`; do not commit credentials or remove existing MCP entries.
- Do not add Copilot subagents, vector databases, hosted RAG, the three research runtimes, or OCR in v1.

## Acceptance criteria

- [ ] VS Code recognizes the custom agent and its skill has valid Copilot skill metadata and clear invocation guidance.
- [x] The skill defines the fast path for any single-topic request, including a bare topic name: substantive coverage returns a concise answer and note link without research/RAG/editing.
- [x] The skill sends incidental or inadequate matches to the normal research workflow and bypasses the fast path for explicit research/current-source/update/new-note/comprehensive requests.
- [x] Local retrieval preserves PDF page, Markdown heading/line, and Tree-sitter code-chunk line metadata for the selected corpus.
- [x] Sparse/image-only PDF pages are identified and represented as coverage gaps, not silently marked complete.
- [x] Cornell validation checks required headings/order, date, placeholders, local links, source IDs/references, and coverage status consistency.
- [x] Research notes embed useful, source-attributed figures when available; captured PDF/web images are stored beside the note, and local figure links, alt text, captions, and source IDs validate.
- [x] GitHub MCP configuration is read-only, requires no committed token, and preserves the existing `mcp_boilerplate` configuration.
- [x] No changes are made to existing specialized agents/skills or the `Examples` submodule.
