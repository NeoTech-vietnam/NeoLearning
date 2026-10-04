# Implementation and checks

## Execution order

1. Obtain explicit approval of the latest final planning summary; then run task start with real implement/check context.
2. Dispatch a Trellis implement subagent. Prompt starts `Active task: .trellis/tasks/10-03-sequential-logic-solutions`. Give ownership of the new solution Markdown and task-local verification script/report; remind it that other agents/users share the checkout and their edits must be preserved.
3. Implementer reads task artifacts, source PDF/rendered pages and relevant reference notes, solves all 16 exercises and records every subpart's coverage.
4. Run finite state/equation checks and independent sequence references. Fix discrepancies before claiming completion.
5. Dispatch a distinct Trellis check subagent with ownership of scoped verification/corrections. It reads the PDF and reviews mathematics, wiring, transitions, traces, diagrams and Markdown.
6. Main session integrates/checks results and opens the final file. Follow required Trellis finish/spec/commit guidance while excluding unrelated pre-existing changes.

## Required checks

- Encoder sample sequence B=1,1,0,0,1 and explicit direction convention.
- Divider ratios and timing over at least two cycles; mod-8 D/T/JK equations against every state.
- Shift stream 1,0,1,1 from zero; counter results after 11/16 pulses and cycle at 100 pulses/s.
- Parking bounds and simultaneous events; single toggle per event.
- 101 detector overlap trace 10101 and all short binary sequences against pattern matching; reset/unused state and observation convention.
- Door sequence 0,1,1,1,0,1,1, persistent opening, closure and immediate-off discussion.
- Direction A then B/B then A, gaps, overlaps, held levels, simultaneous first activation and rearming.
- Vending 5+5+5, 5+10, 10+5, 10+10, idle/busy/reset.
- Traffic all state/timer combinations, hold behavior, recovery and mutually exclusive R/G/B outputs.
- Setup/hold slack for 6/3 ns and 2/3 ns; distinguish violation from guaranteed erroneous sampling.
- Maximum frequency for logic delay 10/18 ns, literal 50 Hz, no unsupported hold certification.
- Alarm over first nine events and multiple batches; no alarm before eighth; counter wraps at eighth with observable alarm; interval at 2 events/s.
- Exactly 16 exercise sections, all subparts covered; math/code balance, source/asset links, state-diagram syntax, no placeholders.

## Commands and evidence

Use the discovered bundled Python runtime. Run the task-local verifier and appropriate existing Markdown tooling where applicable. Run `git -c safe.directory=D:/workspace/NeoLearning diff --check` and explicitly inspect new-file whitespace too. Persist verification findings in this task directory.

## Status

Final planning summary approved by the user on 2026-10-03. Proceed to task start and implementation/check dispatch.
