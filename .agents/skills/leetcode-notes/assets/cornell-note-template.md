# Cornell Notes

## Topic: Leetcode - {{NUMBER}} - {{TITLE}}

## Date: {{DD/MM/YYYY}}

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---

### Problem Description

{{PROBLEM_STATEMENT}}

#### Example 1

```text
Input:  {{INPUT}}
Output: {{OUTPUT}}
```

{{EXPLANATION}}

#### Constraints

- {{CONSTRAINT}}

#### Function Contract

- **Input:** {{INPUT_CONTRACT}}
- **Output:** {{OUTPUT_CONTRACT}}
- **Mutation:** {{MUTATION_CONTRACT}}
- **Ordering:** {{ORDERING_CONTRACT}}

---

### Cue Column (Questions, Keywords, or Prompts)

- {{PATTERN_QUESTION}}
- {{INVARIANT_QUESTION}}
- {{COMPLEXITY_QUESTION}}
- {{EDGE_CASE_QUESTION}}

---

### Notes Section (Main Notes)

## Mindset First (language-agnostic)

- Pattern: {{PATTERN}}
- Invariant: {{INVARIANT}}
- Target time: `{{TIME_COMPLEXITY}}`
- Target auxiliary space: `{{SPACE_COMPLEXITY}}`

## Strategy A: {{OPTIMAL_STRATEGY}}

- Core idea: {{CORE_IDEA}}
- Algorithm:
	1. {{STEP_1}}
	2. {{STEP_2}}
	3. {{STEP_3}}
- Correctness: {{CORRECTNESS}}
- Complexity: `{{TIME_COMPLEXITY}}` time, `{{SPACE_COMPLEXITY}}` auxiliary space.

### Strategy A Flow

```mermaid
flowchart TD
    A(["Start"]) --> B["Initialize"]
    B --> C{"Decision?"}
    C -- Yes --> D["Apply matching action"]
    C -- No --> E["Apply alternate action"]
    D --> F(["Return result"])
    E --> F

    classDef start fill:#dbeafe,stroke:#2563eb,color:#1e3a8a,stroke-width:2px;
    classDef decision fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:2px;
    classDef remove fill:#fee2e2,stroke:#dc2626,color:#7f1d1d,stroke-width:2px;
    classDef keep fill:#dcfce7,stroke:#16a34a,color:#14532d,stroke-width:2px;
    classDef finish fill:#ede9fe,stroke:#7c3aed,color:#4c1d95,stroke-width:2px;

    class A start;
    class C decision;
    class D remove;
    class B,E keep;
    class F finish;
```

## Worked Example A: {{OPTIMAL_STRATEGY}} on `{{EXAMPLE_INPUT_A}}`

This flow executes Strategy A with real values from one valid case.

### Strategy A Worked Example Flow

```mermaid
flowchart TD
    A(["Input: {{EXAMPLE_INPUT_A}}"]) --> B["Initialize<br/>{{INITIAL_STATE_A}}"]
    B --> C1{"{{CONCRETE_DECISION_A1}}"}
    C1 -- {{ACTUAL_OUTCOME_A1}} --> D1["{{CONCRETE_UPDATE_A1}}"]
    D1 --> C2{"{{CONCRETE_DECISION_A2}}"}
    C2 -- {{ACTUAL_OUTCOME_A2}} --> D2["{{CONCRETE_UPDATE_A2}}"]
    D2 --> F(["Return: {{CONCRETE_OUTPUT_A}}"])

    classDef start fill:#dbeafe,stroke:#2563eb,color:#1e3a8a,stroke-width:2px;
    classDef decision fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:2px;
    classDef keep fill:#dcfce7,stroke:#16a34a,color:#14532d,stroke-width:2px;
    classDef finish fill:#ede9fe,stroke:#7c3aed,color:#4c1d95,stroke-width:2px;

    class A,B start;
    class C1,C2 decision;
    class D1,D2 keep;
    class F finish;
```

## Strategy B: {{ALTERNATIVE_STRATEGY}}

- Core idea: {{CORE_IDEA}}
- Trade-off: {{TRADE_OFF}}
- Complexity: `{{TIME_COMPLEXITY}}` time, `{{SPACE_COMPLEXITY}}` auxiliary space.

### Strategy B Flow

```mermaid
flowchart TD
    A(["Start"]) --> B{"Decision?"}
    B -- Yes --> C["Action"]
    B -- No --> D(["Return result"])
    C --> B

    classDef start fill:#dbeafe,stroke:#2563eb,color:#1e3a8a,stroke-width:2px;
    classDef decision fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:2px;
    classDef keep fill:#dcfce7,stroke:#16a34a,color:#14532d,stroke-width:2px;
    classDef finish fill:#ede9fe,stroke:#7c3aed,color:#4c1d95,stroke-width:2px;

    class A start;
    class B decision;
    class C keep;
    class D finish;
```

## Worked Example B: {{ALTERNATIVE_STRATEGY}} on `{{EXAMPLE_INPUT_B}}`

This flow executes Strategy B with real values from one valid case.

### Strategy B Worked Example Flow

```mermaid
flowchart TD
    A(["Input: {{EXAMPLE_INPUT_B}}"]) --> B["Initialize<br/>{{INITIAL_STATE_B}}"]
    B --> C1{"{{CONCRETE_DECISION_B1}}"}
    C1 -- {{ACTUAL_OUTCOME_B1}} --> D1["{{CONCRETE_UPDATE_B1}}"]
    D1 --> C2{"{{CONCRETE_DECISION_B2}}"}
    C2 -- {{ACTUAL_OUTCOME_B2}} --> D2["{{CONCRETE_UPDATE_B2}}"]
    D2 --> F(["Return: {{CONCRETE_OUTPUT_B}}"])

    classDef start fill:#dbeafe,stroke:#2563eb,color:#1e3a8a,stroke-width:2px;
    classDef decision fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:2px;
    classDef keep fill:#dcfce7,stroke:#16a34a,color:#14532d,stroke-width:2px;
    classDef finish fill:#ede9fe,stroke:#7c3aed,color:#4c1d95,stroke-width:2px;

    class A,B start;
    class C1,C2 decision;
    class D1,D2 keep;
    class F finish;
```

<!-- Add Strategy C and its Mermaid-only flow only when meaningful. -->

## Common Failure Points (all languages)

- {{FAILURE_POINT}}

## Edge Cases to Test

| Case | Input | Expected | Notes |
|------|-------|----------|-------|
| {{CASE}} | `{{INPUT}}` | `{{EXPECTED}}` | {{NOTES}} |

## Why {{OPTIMAL_STRATEGY}} is Interview Gold

1. {{REASON}}

## Implementation Checklist

- [ ] Handle minimum input.
- [ ] Handle boundary positions.
- [ ] Verify repeated patterns.
- [ ] Verify time and auxiliary-space complexity.

---

### Summary Section (Summary of Notes)

{{SUMMARY}}
