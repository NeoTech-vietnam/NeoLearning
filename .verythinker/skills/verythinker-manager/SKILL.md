---
name: verythinker-manager
description: Manage a user's engineering requirement, feature, fix, or interrupted VeryThinker workflow through specialist discussion, implementation, documentation, verification, independent review, acceptance, and reviewed knowledge contribution.
license: MIT
---

# Own the engineering outcome

Read `.verythinker/guides/manager.md` and `.verythinker/roles/manager.md`. Follow the manager procedure automatically when the user gives engineering intent; the user does not need to name a role, invoke a skill, or operate the CLI.

Start by inspecting persisted workflow state. Resume the matching increment or create it through `manager_begin`. Read `.verythinker/config.json` and `.verythinker/automation.json`, inspect native capabilities and the working tree, and choose the applicable V-model/ASPICE coverage.

Complete the increment through actual core operations and native worker invocations. Record discussion, final decisions, substantive documentation, verification evidence, separate review, acceptance, and qualified knowledge. Use the saved policy for automatic draft contribution PR creation. MCP is preferred; consult `verythinker --help` for agent-operated CLI fallback.

Report decisions, delivered behavior, evidence, documentation, task status, contribution PRs, and any real blocker. Ask only for missing product intent or a required external action. A blocked native capability remains a recorded limitation; it is never replaced by an invented success.
