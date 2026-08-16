# Output Contract

## Required layout

Create these directories below the selected topic root:

- `01_technical_reference_manual`
- `02_programming_guide`
- `03_use_cases`

Number topic files with two digits. Reserve the final use-case file for the complete `<peripheral>_apis.md` inventory when the user requests exhaustive tracing.

## Cornell contract

Every Markdown note must contain, in order:

1. `# Cornell Notes`
2. `## Topic: ...`
3. `## Date: DD/MM/YYYY`
4. `### Cue Column (Questions, Keywords, or Prompts)` with topic-specific questions
5. `### Notes Section (Main Notes)` answering those questions
6. `### Summary Section (Summary of Notes)` with concrete rules

Do not leave placeholders, empty headings, generic image alt text, or unanswered cues.

## Cross-layer contract

For each public API family, document:

- required arguments and validation;
- allocation, ownership, state, locking, and cleanup;
- private driver sequence;
- HAL/LL calls and target-specific behavior;
- registers/fields and matching TRM section;
- errors, rollback, concurrency, ISR, IRAM, DMA, and power constraints;
- links to related guide, TRM, use case, example, and API-inventory anchors.

The inventory must classify every symbol as Public, Private, HAL, LL, Register, or External. Include structures, enums, callbacks, flags, function-like macros, static functions, and inline target LL functions. External subsystems need boundary explanations only.

## Evidence and links

- Cite TRM chapter section and PDF page number.
- Cite ESP-IDF repository-relative path, symbol, and stable tag URL.
- Prefer Mermaid for ownership, state, call, and sequence relationships.
- Use relative links for all local notes and images.
- Reuse useful existing figures; name new captures by meaning rather than `image-N` when practical.

## Safety and completion

- Work on the current branch only; do not perform Git branch/commit/push operations.
- Generate in `/tmp` before merging into the topic root.
- Preserve unrelated dirty files and the entire ESP-IDF working tree.
- Completion requires successful validation and zero unresolved inventory symbols.
