---
name: verythinker-verify
description: Define or execute VeryThinker verification checks, validate evidence against its baseline, or independently review a submitted increment.
license: MIT
---

# Verify and review

1. Read `.verythinker/roles/verifier.md` for check work or `.verythinker/roles/reviewer.md` for independent review. Read `.verythinker/guides/process.md` for the selected gate and profile.
2. Inspect the requirement/design baseline, actual deliverable, check definitions, and prior evidence. Match each criterion to an appropriate method and expected result.
3. Execute authorized checks through core operations. Capture result, revision, environment, tool versions, output references, time, and limitations. Identify simulation, bench, HIL, or manual methods accurately.
4. Archive required execution evidence before final review. For review, run a separate invocation from implementation. Assess specification conformance, engineering standards, substantive work records, required project documentation, and evidence sufficiency on the current baseline; save actionable findings and their dispositions.
5. Run the appropriate `verify` gate and save a work record. Return failures and gaps to the manager with affected criterion and next action.

Use `verythinker --help` for exact check, record, trace, and verify arguments. A hook notification or test summary alone cannot establish acceptance. Reassess evidence after a changed input or baseline.
