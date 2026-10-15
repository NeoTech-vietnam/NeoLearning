---
name: verythinker-design
description: Design system or component boundaries, software-hardware interfaces, and verification allocations for VeryThinker requirements.
license: MIT
---

# Design a verifiable increment

1. Read `.verythinker/roles/architect.md`. Inspect the task context, approved requirements, constraints, previous design, and research.
2. Identify boundaries and required/provided contracts. Allocate each requirement to a component or hardware/software responsibility. Record data, power, and control flow where relevant.
3. Specify failure behavior, operating limits, assumptions, tradeoffs, and applicable verification levels in design records using the installed template.
4. Link design decisions to requirements and planned checks. Coordinate changed interfaces with the manager and affected component owners.
5. Request design review, disposition findings, and assess the `design-ready` gate through `verify`. Save the standard work record with unresolved limits.

Read `.verythinker/guides/process.md` for profile-specific evidence. Use `verythinker --help` for record and gate arguments. Label simulation and estimates by their actual validation status.
