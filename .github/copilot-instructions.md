<!-- TRELLIS:COPILOT-GUIDANCE:START -->
# Trellis Review Guidance

When reviewing a Trellis-enabled repository:

- Treat Trellis-generated runtime and platform payloads as copied integration files in consumer repositories. Examples include `.trellis/scripts/**`, `.trellis/agents/**`, `.trellis/workflow.md`, and platform Trellis files under `.agents/**`, `.claude/**`, `.codex/**`, `.cursor/**`, `.gemini/**`, `.github/**`, `.opencode/**`, `.qoder/**`, `.codebuddy/**`, `.factory/**`, `.pi/**`, `.reasonix/**`, `.trae/**`, and `.zcode/**`.
- Do not leave line-by-line style, wording, or local refactor comments on those copied files unless the PR explicitly changes Trellis integration, the copied file is the primary subject, it leaks secrets, it has syntax or wiring breakage, or it contradicts the PR goal.
- If a Trellis-generated file needs a behavior change, leave one handoff comment asking for an upstream Trellis fix. Include the affected path, expected behavior, observed evidence or reproduction steps, and why the fix belongs upstream.
- Continue reviewing repo-owned `.trellis/spec/**`, `.trellis/tasks/**`, application code, migrations, tests, docs, and non-Trellis scripts normally.
- Group duplicate root-cause findings into one comment and point to a deterministic local check when one already covers the issue class.
<!-- TRELLIS:COPILOT-GUIDANCE:END -->

<!-- BEGIN VERYTHINKER instructions -->
## VeryThinker engineering workflow

For a new requirement, feature, fix, research-to-implementation request, or interrupted engineering workflow received directly from the user, automatically act as the VeryThinker manager and load the verythinker-manager skill plus .verythinker/guides/manager.md. Assigned workers follow their bounded task and specialist role. The user supplies intent; the manager owns internal discussion, decisions, execution, documentation, verification, review, task acceptance, and reviewed knowledge contributions through closure.
Read .verythinker/config.json and .verythinker/automation.json for profile, routing, and contribution policy. Ask only when product intent cannot be inferred or an actual external blocker needs user action; resolve routine engineering choices internally and report final decisions with rationale.
Use native workers when available, recording actual invocation identities and model observations. Resume saved manager workflow state before creating duplicate work. MCP is preferred; agent-operated CLI fallback keeps commands out of the user's workflow.
For a delegated task, obtain its context packet through VeryThinker CLI or MCP, then stay within its allowed scope.
Read .verythinker/guides/workflow.md and your role contract for worker submission and review. Produce substantive work records and required project documentation; current evidence and a separate reviewer invocation precede acceptance.
Hooks provide advisory context. Completion must pass core validation even when hooks fail. Respect native execution and trust controls; report restrictions without inventing successful delegation, checks, review, or background execution.
Use English for authored instructions, records, documentation, and output.
<!-- END VERYTHINKER instructions -->
