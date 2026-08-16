# Register Notes — Cornell Format Specification

Use this spec when reformatting raw/compressed register dumps (e.g. extracted from a datasheet PDF) into the Cornell Notes study format used in `07_registers.md`.

## Goal

Convert each register entry from a single inline line into a structured, readable block.

## Input shape (raw / compressed)

A register entry arrives as one logical line (often soft-wrapped across several physical lines), in this shape:

```
MACRO_NAME Description text. 0: optA, 1: optB, 2: optC. (ACCESS)
```

- `MACRO_NAME` — register/field identifier, ALL_CAPS with underscores.
- `Description text.` — one or more sentences.
- Option list — enumerated values, separated by `,` `;` or written as `When bitN is set to 1: ...`.
- `(ACCESS)` — access type at the end, in parentheses: `R/W`, `RO`, `WT`, `R/WTC/SC`, `R/WTC/SS`, `R/W/SC`, etc.

## Output shape (Cornell format)

```
`MACRO_NAME` (ACCESS):

Description text.
- optA
- optB
- optC
```

## Rules

1. **Macro name in backticks; access type moves to the header.**
   - Wrap `MACRO_NAME` in backticks.
   - Move the `(ACCESS)` token from the end of the line to directly after the macro name.
   - End the header line with a colon: `` `MACRO_NAME` (ACCESS): ``

2. **Description on its own line(s), ending in a period.**
   - One blank line between the header and the description.
   - Keep multi-sentence descriptions and parenthetical notes verbatim.

3. **Repetitive / enumerated content becomes `-` bullets.**
   - Split option lists separated by `;` or `,` into one `- ` bullet per option.
   - Convert repeated `When bitN is set to 1: X` clauses into `- When bitN is set to 1: X`.
   - Drop the trailing separators (`;` / `,`) — one item per line.
   - Single-fact extras (e.g. `Toggle triggers a force event.`) also become a `- ` bullet.

4. **One blank line between consecutive macro entries** (extra spacing for readability).

5. **Preserve verbatim:** smart quotes (`’`), technical terms, signal names (`event_f0`, `PWM_clk`, `SYNC0`), formulas, table references (`S8 in table 36.3-5`), and exact access strings.

6. **Images untouched.** Leave `![alt text](image-NN.png)` lines and `---` separators as-is.

## Example

Input:

```
MCPWM_GEN2_T1_SEL Source selection for PWM generator 2 event_t1, take effect immediately,
0: fault_event0, 1: fault_event1, 2: fault_event2, 3: sync_taken, 4: none. (R/W)
```

Output:

```
`MCPWM_GEN2_T1_SEL` (R/W):

Source selection for PWM generator 2 event_t1, take effect immediately.
- 0: fault_event0
- 1: fault_event1
- 2: fault_event2
- 3: sync_taken
- 4: none
```
