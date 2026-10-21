<!-- TRELLIS:COPILOT-GUIDANCE:START -->
# Trellis Review Guidance

When reviewing a Trellis-enabled repository:

- Treat Trellis-generated runtime and platform payloads as copied integration files in consumer repositories. Examples include `.trellis/scripts/**`, `.trellis/agents/**`, `.trellis/workflow.md`, and platform Trellis files under `.agents/**`, `.claude/**`, `.codex/**`, `.cursor/**`, `.gemini/**`, `.github/**`, `.opencode/**`, `.qoder/**`, `.codebuddy/**`, `.factory/**`, `.pi/**`, `.reasonix/**`, `.trae/**`, and `.zcode/**`.
- Do not leave line-by-line style, wording, or local refactor comments on those copied files unless the PR explicitly changes Trellis integration, the copied file is the primary subject, it leaks secrets, it has syntax or wiring breakage, or it contradicts the PR goal.
- If a Trellis-generated file needs a behavior change, leave one handoff comment asking for an upstream Trellis fix. Include the affected path, expected behavior, observed evidence or reproduction steps, and why the fix belongs upstream.
- Continue reviewing repo-owned `.trellis/spec/**`, `.trellis/tasks/**`, application code, migrations, tests, docs, and non-Trellis scripts normally.
- Group duplicate root-cause findings into one comment and point to a deterministic local check when one already covers the issue class.
<!-- TRELLIS:COPILOT-GUIDANCE:END -->

<!-- BEGIN VERYTHINKER EFFICIENCY -->
Use the verythinker-efficiency skill for routine requests. Answer read-only questions directly. Every engineering change, including a small reversible edit, follows the managed V-model and ASPICE-oriented workflow: requirement and acceptance criteria, applicable design, implementation, planned checks, actual evidence, independent review, and acceptance remain traceable. Preserve the ready, design-ready, verified, and accepted gates and resume an existing managed assignment without duplication. Before implementation, define and review applicable design and planned checks with expected outcomes and pass ready/design-ready. Target the first reviewable output within 300 seconds (five minutes), never acceptance by deadline. If required core operations or configuration are unavailable, save a draft artifact, report the precise pending gate, and retain non-accepted status; use a scope, plan, or patch candidate checkpoint rather than implementing before required ready/design-ready gates pass. Do not invent closure or create a replacement workflow to evade a gate. See .verythinker/guides/efficiency.md.
<!-- END VERYTHINKER EFFICIENCY -->
