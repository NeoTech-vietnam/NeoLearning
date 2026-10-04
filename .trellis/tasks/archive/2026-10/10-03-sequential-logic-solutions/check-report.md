# Independent review

**Quality gate: PASS** for the complete Markdown solution, reviewed on 2026-10-03. No mathematical or coverage defect was found; no correction to the solution was needed.

## Findings (fixed)

None. The reviewer preserved the solution and the implementer's verifier while they were being finalized.

## Findings (not fixed)

None requiring implementation or a user decision. The source leaves several policies unspecified; the document explicitly identifies the chosen encoder direction, shift orientation, overlap detection, sensor rearming, parking boundaries, vending overpayment and alarm pulse conventions. These agree with the approved design.

## Source coverage

All six rendered source pages were independently inspected and compared with the saved document. Every requested exercise and subpart is covered:

| Exercise | Page | Reviewed content |
|---|---:|---|
| 1 | 1 | DFF direction wiring and phase/CW convention |
| 2 | 1 | Five direction samples, B=1,1,0,0,1 |
| 3 | 1 | a-c; shared-clock divide-by-2/4, ripple distinction, timing diagram |
| 4 | 2 | a-f; three FFs, all states, D/T/JK wiring and excitation comparison |
| 5 | 2 | a-d; SIPO wiring, per-edge states, result 1011 and bit orientation |
| 6 | 2 | a-e; four FFs, 0-15, 11/16 pulses, cycle 160 ms |
| 7 | 3 | a-b; saturated occupancy, simultaneous events, 7-car result |
| 8 | 3 | a-c; T/JK/D toggle, debounced event versus common clock |
| 9 | 3 | a-e; Moore/Mealy diagrams/tables/equations, overlap and output observation |
| 10 | 4 | a-f; three-open-sample alarm, specified trace, immediate-clear alternatives |
| 11 | 4 | a-e; both directions, gaps, overlaps, held levels, initial simultaneity, rearming |
| 12 | 4-5 | a-f; credit states, Moore/Mealy, dispense/reset, busy and overpayment |
| 13 | 5 | a-f; R/G/B encoding, timer hold/advance, unused state, DFF/output equations |
| 14 | 5-6 | a-e; setup/hold slack, violated setup, metastability explanation |
| 15 | 6 | a-c; 15/23 ns, 66.67/43.48 MHz, literal 50 Hz and hold limitation |
| 16 | 6 | a-f; mod-8, 3 count FFs plus registered alarm, eighth event, reset, 4 s |

## Verification

- Independent reference run: **92,606 assertions passed** using the bundled Python runtime with bytecode disabled. Equations were transcribed from the saved Markdown and compared with arithmetic, suffix matching, run lengths and complete transition tables.
- Counters: complete 2/3/4-bit increment relations, D/T/JK characteristic checks, shift trace and stated numeric answers.
- Parking: all 16 occupancy values and four event combinations against bounded arithmetic.
- Sequence and door FSMs: every binary sequence through length 10, compared step by step with direct suffix and consecutive-open references.
- Direction: all 64 six-bit encodings times four sensor inputs, including invalid one-hot recovery; both directional examples, gaps, overlaps, held levels and unknown initial simultaneity.
- Vending: all credit encodings and normalized none/5k/10k inputs against independent credit arithmetic. The implementer's evidence additionally covers 1,093 short coin/idle sequences, qualifying coin examples and busy reset.
- Traffic: all four encodings and both timer values; correct hold, advancement, recovery and exclusive outputs.
- Batch alarm: every binary enable sequence through length 10 against the accepted-event total, including alarm clearing on idle. The implementer's evidence additionally covers 32 products with idle cycles and alarms at 8/16/24/32.
- Saved artifact: exactly 16 ordered exercise sections, balanced fences/math environments, valid relative PDF link, no placeholders or trailing whitespace. All eight Mermaid FSMs and text schematics/timing diagrams were manually reviewed for consistency with tables and equations.
- `git diff --check`: PASS. New-document whitespace was checked separately because untracked files are not covered by that command.
- Implementation evidence: `verify_solutions.py` and `verification.md` inspected. Their model equations and documented limits agree with the solution and independent review.
- Application lint/type-check/build: **not applicable**; this is a Markdown learning artifact without an application build system. Structural document checks passed.

## Limits

This review verifies the sampled logical models and source coverage. The reviewer did not render Mermaid or LaTeX with a browser engine; static structure, semantics and delimiter checks should not be described as visual rendering. It does not validate physical sensor timing, hardware reset recovery/removal, propagation glitches, metastability probability or visibility of a one-clock alarm pulse. The solution explains these distinctions where relevant.
