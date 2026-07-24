# Mermaid Flow Standard

## Diagram Rules

- Use `flowchart TD` unless another direction materially improves clarity.
- Show start, decisions, state changes, loops, and returns.
- Label decision edges `Yes` and `No`.
- Use rounded nodes for start and return.
- Use subgraphs for phases, multiple passes, or recursion descent/unwind.
- Keep node labels short and technically exact.
- Use Mermaid `classDef`.
- Do not use HTML `<style>` blocks or external CSS.
- Keep only Mermaid fence inside each `### Strategy X Flow` section.

## Semantic Palette

```mermaid
flowchart LR
    A(["Start"]) --> B{"Decision"}
    B -- Yes --> C["Remove or reject"]
    B -- No --> D["Keep or advance"]
    C --> E(["Return"])
    D --> E

    classDef start fill:#dbeafe,stroke:#2563eb,color:#1e3a8a,stroke-width:2px;
    classDef decision fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:2px;
    classDef remove fill:#fee2e2,stroke:#dc2626,color:#7f1d1d,stroke-width:2px;
    classDef keep fill:#dcfce7,stroke:#16a34a,color:#14532d,stroke-width:2px;
    classDef recurse fill:#e0f2fe,stroke:#0891b2,color:#164e63,stroke-width:2px;
    classDef finish fill:#ede9fe,stroke:#7c3aed,color:#4c1d95,stroke-width:2px;

    class A start;
    class B decision;
    class C remove;
    class D keep;
    class E finish;
```

Color meanings:

- Blue: start or initialization.
- Yellow: decision.
- Red: removal, rejection, or failure.
- Green: keep, accept, or advance.
- Cyan: recursion or subproblem.
- Purple: return or completion.

## Multi-Phase Pattern

```mermaid
flowchart TD
    S(["Start"])

    subgraph P1["Phase 1"]
        A["Initialize"] --> B{"Condition?"}
        B -- Yes --> C["Update"]
        C --> B
    end

    subgraph P2["Phase 2"]
        D["Process"] --> E{"Done?"}
        E -- No --> D
    end

    R(["Return result"])
    S --> A
    B -- No --> D
    E -- Yes --> R
```

Add semantic `classDef` declarations and class assignments to every final flow.
