---
name: leetcode-notes
description: Create, update, review, or standardize Cornell-style LeetCode notes for algorithm and data-structure exercises. Use when work involves `*_note.md` files, adding a LeetCode problem description, documenting solution strategies and complexity, building edge-case tables or checklists, or adding vivid Mermaid strategy flows. Do not trigger for code-only solution or test changes unless notes are also requested.
---

# LeetCode Notes

Create accurate, consistent learning notes from local LeetCode source material.

## Workflow

1. Inspect requested problem directory.
2. Read local `.c`, `.cpp`, and existing `*_note.md` files before writing.
3. Read [note-requirements.md](references/note-requirements.md) completely.
4. Read [mermaid-style.md](references/mermaid-style.md) when creating or changing flows.
5. For new notes, copy [cornell-note-template.md](assets/cornell-note-template.md), replace placeholders, and remove unused optional sections.
6. Preserve existing user content unless requested change replaces it.
7. Modify note files only. Do not change solutions or tests unless explicitly requested.
8. Run:

   ```bash
   python3 .agents/skills/leetcode-notes/scripts/validate_notes.py <changed-note> [...]
   ```

9. Run `git diff --check` on changed notes.
10. Report changed files and validation results.

## Source Rules

- Treat local problem statements as primary truth for title, examples, constraints, and judge rules.
- Never invent missing facts.
- Report conflicting local sources before choosing.
- Keep core reasoning language-agnostic.
- Use exact C or C++ syntax only when it improves clarity.

## Resource Routing

- **Always read:** `references/note-requirements.md`.
- **Read for Mermaid work:** `references/mermaid-style.md`.
- **Use for new notes:** `assets/cornell-note-template.md`.
- **Run after edits:** `scripts/validate_notes.py`.

Keep detailed standards in references. Do not duplicate them in this file.
