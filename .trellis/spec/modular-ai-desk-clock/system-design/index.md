# Modular AI Desk Clock: System Design

This package records the current design contract for the desk clock and its reusable slim core. It is a concept-stage specification: **TBC** means a value or behavior must be measured or decided before hardware design is frozen.

| Spec | Use when |
|------|----------|
| [Axiomatic Design and TRIZ](./axiomatic-design-and-triz.md) | Changing the core/host boundary, dock, modules, power, sensing, enclosure, or product-family requirements |

Before making a design decision, update the CN→FR→DP mapping, identify any new FR×DP interactions, and check whether an actual TRIZ contradiction exists. Keep the desk-clock host distinct from the reusable core so future watch and robot hosts can use the same core contract.
