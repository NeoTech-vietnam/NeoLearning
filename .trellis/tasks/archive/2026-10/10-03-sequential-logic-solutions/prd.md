# Sequential logic exercise solutions

## Goal

Create one complete, understandable Vietnamese Markdown solution for all 16 exercises in `07_mechatronics_engineering_master_program/05_Computer-Architecture/02_exercises/Bài tập Sequential logic.pdf`, matching the previous combinational-logic solutions.

## Background

The source contains six pages, all extracted and visually inspected. The user approved this Trellis task. Exercise 15b literally specifies 50 Hz. The existing traffic-light Moore-machine note provides a suitable format for tables, equations and diagrams. Only Examples has package-specific specs; this curriculum document uses repository guidance and task research instead of firmware/app specifications.

## Requirements

- R1: Save `07_mechatronics_engineering_master_program/05_Computer-Architecture/02_exercises/Bai_tap_Sequential_logic_Loi_giai.md`, covering every exercise and requested subpart.
- R2: Explain reasoning and provide requested state/excitation equations, state encodings, tables, circuit connections, timing/state diagrams and numeric calculations.
- R3: Define clock edge, reset, present/next state, bit ordering and output-observation conventions explicitly. Identify any author-selected assumption.
- R4: Address counter boundaries, simultaneous events and unused state recovery. Detect completion of eight products at the eighth accepted event and preserve an observable alarm when the count resets.
- R5: Explain underspecified FSM behaviors using explicit educational conventions and meaningful alternatives: sequence overlap/latched indication, immediate door-warning clearing, direction-sensor rearming, parking limits and vending reset/overpayment.
- R6: Use literal source units. Separate setup-path timing results from hold-time conclusions when the source lacks minimum-delay data.
- R7: Verify finite transition/Boolean relations, given traces and important edge cases; check Markdown/math/diagrams/links before delivery.

## Acceptance criteria

- AC1 (R1): Sixteen main exercise sections; every subpart in the source inventory is accounted for in the check report.
- AC2 (R2-R3): Each design has enough equations/connections to reconstruct it. State tables, diagrams and traces agree, including pre-edge versus post-edge observations.
- AC3 (R4-R5): Verification covers all counter states, stated sample streams, wraps, parking bounds, 101 overlap, three consecutive door-open samples, both movement directions, vending sequences, timed traffic holds and eighth-product completion.
- AC4 (R6): Setup/hold comparisons and maximum-frequency calculations use correct units and state what the given data can establish.
- AC5 (R7): Finite rows and equations agree with independent references; source/asset links resolve; no unresolved placeholder, unbalanced block or unexplained diagram assumption remains.
- AC6: Open the final Markdown in Codex and provide a clickable link with a concise completion/verification summary.

## Scope boundaries

The output is the solution document and task-local verification evidence. Hardware construction, firmware, simulator projects, remote publication and changes to existing course notes or Examples are outside scope. Preserve the pre-existing source PDF and dirty Examples submodule; exclude them from any task-only commit unless authorized. Do not invent numerical traffic-light durations or currency-change requirements.

## Planning status

Coverage, design and execution/check plans were reviewed. The user explicitly approved the final planning summary on 2026-10-03; implementation is authorized under the documented conventions.
