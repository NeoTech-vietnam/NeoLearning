# Solution design

## Artifact

One UTF-8 Vietnamese Markdown file beside the PDF, with a relative source link, short notation section, Exercise 1-16 sections and verification summary. Use LaTeX formulas, Markdown tables, simple text hardware schematics and Mermaid FSM diagrams. Exercise 3 must have a timing diagram; optionally add a verified local figure only when it improves clarity.

## Modeling contracts

- Q is present state, Q+ is next state. D=Q+; T uses Q+=Q XOR T; JK uses Q+=J NOT(Q)+NOT(K) Q.
- Use positive-edge flip-flops unless a variant says otherwise. Trace tables show input sampled at edge k and state after edge k. All synchronous state bits update simultaneously.
- Reset establishes each initial state; unused FSM encodings recover explicitly.
- Exercise 1 samples B at rising A; describe A-leading-B/B-leading-A and state any chosen CW/CCW convention.
- Exercise 3 primarily uses shared-clock toggle logic; identify different clock-edge behavior if showing a ripple alternative.
- Exercise 5 inserts serial data at Q0 and shifts old Q0 toward Q3, with that choice stated.

## Proposed educational conventions

- Parking: four-bit up/down occupancy; bounds prevent modulo wrap from corrupting occupancy. Simultaneous IN/OUT cancel. Sensor events are conditioned one-event pulses.
- Button: one toggle per debounced press; distinguish event-clock and common-clock-enable versions.
- Pattern: primary overlapping 101 detector with one-event indication; compare Moore/Mealy and explain sticky/non-overlap variants. Do not claim an unconditional extra cycle of Moore latency without defining sampling/observation.
- Door: Moore states store zero, one, two and at least three sampled-open periods. Any sampled closure returns to zero. Immediate between-edge clearing requires asynchronous clear or an input-qualified output; explain the resulting distinction.
- Direction: remember first sensor across a gap, report completed direction, rearm after both clear. An initially simultaneous A/B event does not establish direction. Explain the single-person/event model and sustained/overlapping levels.
- Vending: inputs none/5k/10k; dispense at credit >=15k; no change output required. Moore has a dispensing state with coin acceptance gated while busy; Mealy outputs on the qualifying transition and returns to zero. Explicitly define idle and simultaneous/invalid input behavior.
- Traffic: retain R/G/B source names; timer-complete controls advancement and permits unspecified state durations. Define unused-state recovery.
- Batch alarm: modulo-8 count memory and terminal-carry event at the eighth product, with registered alarm pulse if a stable output is needed. Distinguish three count flip-flops from additional alarm storage. Detecting count 7 alone is not detection of eight products.

## Verification and compatibility

A task-local Python reference checks finite Boolean/transition rows and representative sequences. A separate Trellis check subagent reviews the document against the source and independently checks the models. Markdown checks cover structure, math, diagrams and links. Numerical checks preserve ns/s/Hz units. State/output observation conventions are part of the test contract.

This is logical/sampled verification, not physical hardware or transistor simulation. Source ambiguities remain visible as assumptions/alternatives. No application architecture, firmware or production subsystem is added.

## Rollback

The final solution is a new file. Inspect for subsequent user edits before rollback. Preserve source PDF, submodule and unrelated files. No remote changes are required.
