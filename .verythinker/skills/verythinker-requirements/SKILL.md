---
name: verythinker-requirements
description: Turn stakeholder needs into measurable VeryThinker requirements and checks, or assess requirement changes and affected records.
license: MIT
---

# Define measurable requirements

1. Read `.verythinker/roles/requirements.md` and `.verythinker/guides/process.md`. Inspect the current needs, baseline, profile, constraints, and existing requirements.
2. Write one observable behavior per requirement. Specify conditions, measurable acceptance criterion, source, rationale, assumptions, and verification method using the installed requirement template.
3. Link derived requirements to their source needs and define corresponding checks. Distinguish intended-use validation from specification verification.
4. For a change, preserve its rationale and old baseline. Use the `trace` command's impact view to identify downstream records needing reassessment.
5. Confirm every in-scope need has a requirement/check or recorded disposition. Save a work record and return unresolved product decisions to the manager.

Use `record`, `trace`, and `verify` through the CLI or equivalent MCP core operations. Read `verythinker --help` for arguments. The step is complete when the `ready` criteria can be assessed against specific records, rather than a promise of future tests.
