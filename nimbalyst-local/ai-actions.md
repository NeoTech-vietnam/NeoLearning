# AI Action Prompts

This file lists reusable prompts that show up in the **Actions** dropdown in the AI composer.
Each `## Heading` is one action; everything beneath it (until the next `##`) is the prompt that gets inserted into the draft when you pick the action.

Actions can also launch a brand-new sibling session in the current workstream
instead of prefilling the current input.

Recognized keys: `launch` (same-session | new-session), `model`
(provider:variant), `foreground` (true/false), `autoSubmit` (true/false),
`worktree` (true/false). `launch: same-session` is the default; omit the
block entirely to keep current behavior.

## Review Changed Files
/review changed files in this session and call out regression risk in the affected modules.

## Plan Implementation
Look at the active issue (linked above) and the open editor.

Produce a structured plan that:
- breaks the work into 3-5 phases
- identifies the files I'll need to touch
- flags any cross-cutting concerns I should think about before writing code

When you're done, ask me which phase to start with.

## Plan in Fresh Opus Session
launch: new-session
model: claude-code:opus
foreground: true
autoSubmit: true

Open a fresh sibling planning session.
Look at the originating session for context, then produce a clean implementation plan in 3-5 phases.
Call out the riskiest unknowns before suggesting code changes.

## Worktree Implementation Draft
launch: new-session
foreground: true
autoSubmit: false
worktree: true

Open a sibling coding session in a git worktree.
Use the originating session and current editor state for context.
Draft the first implementation message I should send there, including the files to inspect first and the first validation step.

## Draft Release Notes
/release-notes from merged work since the last tag, formatted as a user-facing changelog.

## Inspect Current Editor
Read the file that's currently open and tell me what you'd change. Be specific:
- 3 concrete improvements
- 1 thing that's already good and shouldn't change
