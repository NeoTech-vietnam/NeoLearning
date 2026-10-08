# Implementation Checklist

1. Add the VS Code custom agent profile with scoped tools and invocation guidance.
2. Add the research-to-Cornell skill and concise references for source quality, the Cornell contract, coverage expectations, and script usage.
3. Implement the source retrieval/index script: explicit roots, SQLite FTS5, Markdown heading chunks, PDF page chunks, Tree-sitter C/C++/Python chunks, temporary database, optional coverage CSV, and clear extraction/parser errors.
4. Implement note and coverage validation, plus small standard-library `unittest` coverage for valid/invalid notes and retrieval metadata; use optional-dependency skips only when the dependency truly is unavailable.
5. Add skill-scoped dependency pins for `pypdf`, `tree-sitter`, `tree-sitter-c`, `tree-sitter-cpp`, and `tree-sitter-python`.
6. Add read-only GitHub MCP configuration to the existing `.vscode/mcp.json`, preserving current entries and storing no credentials.
7. Run tests and CLI smoke checks on temporary Markdown, PDF, and C/C++/Python fixtures; validate a sample Cornell note and coverage ledger.
8. Inspect the final diff and `git status`; confirm the pre-existing `Examples` submodule modification is unchanged.
9. Add the existing-note fast path ahead of research planning: substantive local coverage returns a concise sourced answer and path; incidental mentions or explicit research/update/comprehensive requests use the full workflow.
10. Extend the full research path with useful source-figure discovery, note-local PDF page/crop rendering, and permitted direct HTTPS image capture; record image provenance and reuse terms.
11. Add skill-scoped image dependencies/helper and validate local image links, descriptive alt text, figure captions, and matching source IDs with focused unit tests.

## Review gates

- Confirm Copilot agent/skill metadata matches current VS Code conventions.
- Confirm retrieved chunks retain source paths and page/line anchors.
- Confirm low-text PDF units cannot be marked complete by default.
- Confirm MCP configuration is read-only and additive.
