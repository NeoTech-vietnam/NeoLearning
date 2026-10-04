# Source inventory

Source: `07_mechatronics_engineering_master_program/05_Computer-Architecture/02_exercises/Bài tập Sequential logic.pdf`. All six pages extracted and visually inspected on 2026-10-03. Temporary renders: `C:/Users/daveb/AppData/Local/Temp/codex-sequential-logic/page-1.png` through `page-6.png`; re-render if unavailable.

## Coverage

| Exercise | Page | Required content |
|---|---|---|
| 1 | 1 | DFF quadrature encoder direction circuit |
| 2 | 1 | Direction at A rising edges for B=1,1,0,0,1 |
| 3 | 1 | a: divide-by-2; b: divide-by-4; c: both timing diagrams |
| 4 | 2 | a: FF count; b: state table; c: D; d: T; e: JK; f: excitation comparison; counts 0-7 |
| 5 | 2 | a: four-DFF shift circuit; b: per-edge states; c: parallel result; d: serial-to-parallel explanation; stream 1,0,1,1, initial 0000 |
| 6 | 2 | a: FF count; b: range; c: after 11 pulses; d: after 16; e: cycle at 100 pulses/s; initial 0000 |
| 7 | 3 | a: bit count and parking UP/DOWN design, capacity 15; b: 5 initial, 4 arrivals, 2 departures |
| 8 | 3 | a: T; b: JK; c: D for OFF/ON toggle per press |
| 9 | 3 | a: states; b: diagram; c: Moore 101; d: Mealy 101; e: state count and I/O timing |
| 10 | 4 | a: states; b: diagram; c: Moore; d: sequence 0,1,1,1,0,1,1; e: alarm onset; f: immediate off on closure; threshold three consecutive open samples |
| 11 | 4 | a: states; b: diagram; c: table; d: direction FSM; e: RIGHT/LEFT conditions; A then B means right, B then A means left |
| 12 | 4-5 | a: credit states; b: diagram; c: Moore DISPENSE; d: Mealy; e: comparison; f: post-dispense reset; price 15k VND, accepted 5k/10k |
| 13 | 5 | a: state count; b: encoding; c: diagram; d: table; e: DFF storage; f: R/G/B equations; R to G to B with unspecified durations |
| 14 | 5-6 | a-c: setup/hold/compliance for 6 ns before and 3 ns after; d: violation for 2 ns before and 3 ns after; e: metastability; setup 4 ns, hold 2 ns |
| 15 | 6 | a: Tmin/fmax with tCQ=3 ns, tlogic=10 ns, tsetup=2 ns; b: literal 50 Hz; c: tlogic becomes 18 ns |
| 16 | 6 | a: counter type; b: FF count; c: sequence; d: alarm at eight; e: reset; f: interval at 2 pulses/s |

## Correctness traps

Physical CW/CCW and shift direction are unspecified. Detection overlap/sticky behavior, sensor overlap/rearming, simultaneous parking events, vending change and exact traffic durations are unspecified. Document assumptions rather than attribute them to the lecturer.

A synchronous Moore output cannot immediately react between clock edges. Exercise 15 is visually confirmed as 50 Hz; minimum path delay is absent, so full hold compliance is not established. Mod-8 count 7 represents seven accepted products, whereas eight is the wrap/carry event; preserve alarm observability at reset.

## Existing format evidence

The previous solution is `07_mechatronics_engineering_master_program/05_Computer-Architecture/02_exercises/Bai_tap_Logic_To_hop_Loi_giai.md`. The related note `07_mechatronics_engineering_master_program/05_Computer-Architecture/01_learning/traffic-light-moore-machine.md` uses Vietnamese prose, LaTeX, tables, Mermaid and text schematics with explicit reset/unused-state recovery. Its R/G/Y labels differ from this worksheet's R/G/B; reuse presentation conventions, not source assumptions.

No curriculum package/layer spec appears in the current Trellis package listing; Examples backend/frontend specs do not apply to this document task.
