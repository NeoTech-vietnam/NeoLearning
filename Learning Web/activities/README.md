# Interactive lesson sidecars

The curriculum Markdown stays the source of truth. Add one JSON sidecar here to layer activities onto a Markdown lesson without changing its notes. See `pwm-generator-actions.json` for the first real lesson. Only `*.json` files are loaded.

Each file needs `id`, `lessonPath` (repository-relative `.md` path), `title`, and a nonempty `activities` array. Activity IDs and the sidecar ID use lowercase kebab-case. `afterHeading` is the heading slug: lowercase heading text with punctuation and spaces replaced by hyphens (for example, `## Notes Section (Main Notes)` becomes `notes-section-main-notes`). Multiple activities may share a heading. If that heading is later renamed, the reader keeps the activities accessible under “Activities needing a location” until the anchor is corrected.

Supported activity kinds:

- `choice`: `options` (`id`, `label`), `answer` (one option ID), and `explanation`.
- `order`: `items` (`id`, `label`), `answer` (every item ID in the right order), and `explanation`.
- `self-check`: `modelAnswer`. The learner writes a reflection and chooses a confidence level; this is self-rated, not machine-graded.
- `pwm-lab`: `targetFrequencyHz` (100–5000), `targetDutyPercent` (1–99), and `explanation`. The learner sets a timing model and predicts HIGH time. It does not measure hardware.

Every activity also needs `id`, `kind`, `title`, `prompt`, and `afterHeading`. Answer keys and explanations are graded or released by the server; the lesson-loading API omits them. The progress store is gitignored at `.data/learning-progress.json`; it records attempts, reflection notes, last heading, and review dates. A correct answer is scheduled for review after 1, 3, 7, 14, then 30 days on consecutive successes; an incorrect answer is scheduled after one hour. This is a lightweight review reminder, not a validated learning assessment.

To offer a completed lab as Quest evidence, add a `questEvidence` entry with `questId`, `milestoneId`, and `activityId`. The Quest UI offers the simulation result only after that activity succeeds. The learner must explicitly choose it and complete the milestone; hardware claims still require their own measurement. See `quests/pwm-signal-lab.md`.

Run `npm run check` from `Learning Web/` before sharing a new sidecar. Browser tests use temporary fixtures and never modify curriculum Markdown.
