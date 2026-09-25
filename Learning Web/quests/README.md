# Quest definition schema

Each quest is a Markdown file in this directory. The frontmatter is the
version-controlled source of truth; the Markdown body may contain briefing and
implementation notes. Personal completion state is deliberately kept out of
these files in `.data/progress.json`.

The supported YAML subset is intentionally strict: root scalars, string lists,
and a list of scalar milestone maps. Required fields are `id`, `title`,
`regions`, `knowledgeLinks`, `milestones`, and `completionCriteria`.
Optional `destination` names the working outcome; each milestone may add a
`challenge` action beside its learning description.

```yaml
---
id: lowercase-kebab-case
title: Human-readable title
level: beginner | intermediate | advanced
problem: What the learner will solve
destination: The working artifact or demonstrated outcome
regions:
  - content:02-software
knowledgeLinks:
  - 02_Software/03_Microcontrollers/02_ADC-DAC
milestones:
  - id: lowercase-kebab-case
    title: Human-readable milestone
    order: 1
    description: Optional learning objective
    challenge: Optional action to make or prove at this stop
    required: true
    evidenceRequired: true
    knowledgeLinks:
      - 03_Interfaces-and-Protocols/01_Basic/02_I2C
completionCriteria:
  - Every required milestone is complete.
---
```

Quest and milestone IDs must be unique lowercase kebab-case values. Milestone
orders must be consecutive, beginning at one. Every knowledge link must be a
real repository-relative path that resolves inside this repository; absolute,
traversal, and symlink-escape paths are rejected.

Completed lesson labs may be offered as *simulation* evidence for a milestone via an activity sidecar in [`../activities/`](../activities/README.md). This is an optional suggestion: the learner must choose the evidence and explicitly complete the milestone. It does not claim a physical hardware test.
