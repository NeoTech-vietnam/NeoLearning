# LeetCode Note Requirements

## File and Source Rules

- Name new note `<problem-number>_note.md`.
- Place note beside problem source files.
- Use current date in `DD/MM/YYYY` for new notes.
- Preserve existing note date unless user requests refresh.
- Inspect all local language variants before documenting behavior.
- Preserve user-written content outside requested scope.

## Cornell Structure

Use this order:

1. `# Cornell Notes`
2. `## Topic: Leetcode - <number> - <title>`
3. `## Date: DD/MM/YYYY`
4. Centered motto: `"DO NOT JUST TALK ABOUT IT — SHOW IT"`
5. `### Problem Description`
6. `### Cue Column (Questions, Keywords, or Prompts)`
7. `### Notes Section (Main Notes)`
8. `### Summary Section (Summary of Notes)`

Separate major Cornell sections with horizontal rules.

## Problem Description

Include exactly one `### Problem Description`.

Include:

- Clear language-agnostic problem statement.
- Required output and behavior.
- All examples supplied by local source.
- Fenced `text` blocks for example input/output.
- Brief example explanation when useful.
- `#### Constraints`.
- `#### Function Contract`.

Function contract covers relevant items:

- **Input**
- **Output**
- **Mutation**
- **Ordering**
- **Ownership or memory**
- Judge-specific rules, such as ignored array positions

## Cue Column

Write focused questions about:

- Recognized pattern.
- Invariant.
- Pointer or state movement.
- Complexity.
- Boundary cases.
- Common failure modes.

## Strategy Notes

Start Notes Section with language-agnostic mindset:

- Recognized pattern.
- Core invariant.
- Target time complexity.
- Target auxiliary-space complexity.
- Optimality reason when useful.

Document:

- `## Strategy A`: optimal, interview-stable approach.
- `## Strategy B`: useful alternative with trade-offs.
- `## Strategy C`: another meaningful alternative only when one exists.

Never invent weak strategy to satisfy count.

For each strategy include:

- Core idea.
- Algorithm steps.
- Correctness reasoning or invariant.
- Time complexity.
- Auxiliary-space complexity.
- Benefits.
- Trade-offs.

Immediately follow each strategy with:

```text
### Strategy X Flow

<one Mermaid fence only>
```

This first flow is the reusable, value-agnostic algorithm flow. Preserve it when adding a concrete example.

After the generic flow, add one real execution:

```text
## Worked Example X: <strategy name> on `<concrete input>`

<one concise setup sentence>

### Strategy X Worked Example Flow

<one Mermaid fence only>
```

Add both flows for every documented strategy:

- Keep `### Strategy X Flow` generic so it explains the algorithm for any valid input.
- Use a locally supplied example when it exercises the strategy clearly; otherwise use a small valid case supported by the local constraints.
- Start the worked flow with the actual input and initialized variables, pointers, indexes, or data structure.
- Show actual values after each meaningful save, comparison, mutation, pointer move, loop iteration, or phase.
- End with the concrete returned value or output structure.
- For recursion, show descent, the base case, and every meaningful unwind update.
- Keep optional trace tables in addition to, not instead of, the worked-example Mermaid flow.

Each generic or worked-example flow subsection must contain one Mermaid fence only, with no prose, ASCII diagram, or table inside it.

## Remaining Sections

Include when applicable:

- `## Common Failure Points (all languages)`
- `## Edge Cases to Test`
- `## Why <Optimal Strategy> is Interview Gold`
- Problem-specific invariant, pointer-movement, or state-transition section
- `## Implementation Checklist`

Use compact table for edge cases. Cover:

- Empty or null input when allowed.
- Minimum-size input.
- All-match and no-match cases when relevant.
- Boundary positions.
- Consecutive or repeated patterns.
- Maximum constraint size when useful.

Checklist verifies behavior, boundaries, and claimed complexity.

## Summary

Restate:

- Pattern.
- Invariant.
- Optimal strategy.
- Time and auxiliary-space complexity.
- Critical edge behavior.

## Accuracy and Style

- Wrap identifiers and expressions in backticks.
- Distinguish output space from auxiliary space.
- Count recursive call stack as auxiliary space.
- State mutation and order-preservation requirements.
- Prefer stack allocation for fixed-size sentinel nodes.
- For linked lists, say links change; nodes do not move.
- Keep wording concise and educational.
- Avoid duplicate descriptions and repeated strategy explanations.
