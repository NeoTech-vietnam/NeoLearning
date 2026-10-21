# CPU design exercises

All operands are **unsigned**. These are combinational circuits: no clock or reset is needed. Testbenches apply inputs, wait 1 ns for the result, and stop with `$fatal` on a mismatch. A successful run prints one `PASS` summary and writes a VCD waveform under `build/`.

Exercises 3-8 first show two checked examples with decimal and binary values. Each example occupies 10 ns in the waveform (0-10 ns and 10-20 ns); exhaustive testing begins at 20 ns. The case counts below refer to the exhaustive phase, in addition to these two examples.

| Exercise | Interface and behavior | Exhaustive cases |
| --- | --- | ---: |
| 1. Half adder | `{carry, sum} = a + b` | 4 |
| 2. Full adder | `{cout, sum} = a + b + cin` | 8 |
| 3. Ripple-carry adder | Eight full adders; `{cout, sum} = a + b + cin`. Carry flows from bit 0 to bit 7. | 131072 |
| 4. Subtract | `difference = (a - b) mod 256`; `borrow = 1` when `a < b`. Example: 0 - 1 gives difference 255, borrow 1. | 65536 |
| 5. Compare | Exactly one of `lt`, `eq`, `gt` is high for known binary inputs. | 65536 |
| 6. Shift | `direction = 0`: left; `direction = 1`: right. Zero-filled logical shifts by `amount` 0..15; amounts >= 8 produce zero. Shifted-out bits are discarded. | 8192 |
| 7. Multiply | Full 16-bit `product`; maximum 255 x 255 = 65025. | 65536 |
| 8. Integer divide | For nonzero divisor: dividend = quotient x divisor + remainder, remainder < divisor. For zero divisor: flag = 1, quotient = 0, remainder = dividend. | 65536 |
| 9. ALU | Selects exercises 3-8 with a 3-bit opcode; see the table below. | 466944 |

The multiplier uses `*`, and the divider uses `/` and `%` to describe combinational hardware. A synthesized divider can be large and slow; no multicycle implementation or timing claim is implied. The testbench multiplication and division oracles use repeated addition and subtraction respectively.

## Run with Icarus Verilog

Run each block from this `07_cpu_design` directory in PowerShell. `iverilog` and `vvp` must be on PATH. Each block enters its exercise folder and returns afterward. Existing folder spellings are preserved.

For the installed NeoHDL toolchain on this machine, set PATH in the current PowerShell session first:

```powershell
$env:PATH = "$env:LOCALAPPDATA/Programs/NeoHDL/ucrt64/bin;" + $env:PATH
```

### 01_half_ladder

```powershell
Push-Location 01_half_ladder
New-Item -ItemType Directory -Force build | Out-Null
iverilog -g2012 -s tb_half_adder -o build/half_adder.vvp half_adder.sv tb_half_adder.sv
vvp build/half_adder.vvp
Pop-Location
```

### 02_full_adder

```powershell
Push-Location 02_full_adder
New-Item -ItemType Directory -Force build | Out-Null
iverilog -g2012 -s tb_full_adder -o build/full_adder.vvp full_adder.sv tb_full_adder.sv
vvp build/full_adder.vvp
Pop-Location
```

### 03_ripple_carry_adder_8bits

```powershell
Push-Location 03_ripple_carry_adder_8bits
New-Item -ItemType Directory -Force build | Out-Null
iverilog -g2012 -s tb_ripple_carry_adder_8bits -o build/ripple_carry_adder_8bits.vvp ripple_carry_adder_8bits.sv tb_ripple_carry_adder_8bits.sv ../02_full_adder/full_adder.sv
vvp build/ripple_carry_adder_8bits.vvp
Pop-Location
```

### 04_subtract_number_8bits

```powershell
Push-Location 04_subtract_number_8bits
New-Item -ItemType Directory -Force build | Out-Null
iverilog -g2012 -s tb_subtract_number_8bits -o build/subtract_number_8bits.vvp subtract_number_8bits.sv tb_subtract_number_8bits.sv
vvp build/subtract_number_8bits.vvp
Pop-Location
```

### 05_compare_2_number_8bits

```powershell
Push-Location 05_compare_2_number_8bits
New-Item -ItemType Directory -Force build | Out-Null
iverilog -g2012 -s tb_compare_2_number_8bits -o build/compare_2_number_8bits.vvp compare_2_number_8bits.sv tb_compare_2_number_8bits.sv
vvp build/compare_2_number_8bits.vvp
Pop-Location
```

### 06_shift_number_8bits

```powershell
Push-Location 06_shift_number_8bits
New-Item -ItemType Directory -Force build | Out-Null
iverilog -g2012 -s tb_shift_number_8bits -o build/shift_number_8bits.vvp shift_number_8bits.sv tb_shift_number_8bits.sv
vvp build/shift_number_8bits.vvp
Pop-Location
```

### 07_multiply_number_8bit

```powershell
Push-Location 07_multiply_number_8bit
New-Item -ItemType Directory -Force build | Out-Null
iverilog -g2012 -s tb_multiply_number_8bit -o build/multiply_number_8bit.vvp multiply_number_8bit.sv tb_multiply_number_8bit.sv
vvp build/multiply_number_8bit.vvp
Pop-Location
```

### 08_divide_number_8bits

```powershell
Push-Location 08_divide_number_8bits
New-Item -ItemType Directory -Force build | Out-Null
iverilog -g2012 -s tb_divide_number_8bits -o build/divide_number_8bits.vvp divide_number_8bits.sv tb_divide_number_8bits.sv
vvp build/divide_number_8bits.vvp
Pop-Location
```

Open the generated VCD in your waveform viewer to inspect operands, outputs, and the RCA's internal carry chain. Exhaustive cases cover binary inputs; X/Z propagation is outside these tests.

## 09_alu_8bits: combine exercises 3-8

`alu_8bits` instantiates the existing adder, subtractor, comparator, shifter, multiplier, and divider, then selects their outputs. All blocks are combinational and operate in parallel; the opcode controls the output selection.

Inputs are unsigned `a[7:0]`, `b[7:0]`, `cin`, `shift_amount[3:0]`, and `opcode[2:0]`. Outputs are `result[15:0]`, `carry`, `borrow`, `lt`, `eq`, `gt`, `remainder[7:0]`, and `divide_by_zero`.

| Opcode | Operation | Result | Other active outputs |
| --- | --- | --- | --- |
| `000` (0) | ADD | Low 8 bits of a + b + cin, zero extended to 16 bits | `carry` = ninth sum bit |
| `001` (1) | SUB | (a - b) mod 256, zero extended | `borrow` = a < b |
| `010` (2) | CMP | 0 | `lt`, `eq`, `gt` compare a with b |
| `011` (3) | SHL | Logical a << shift_amount, truncated to 8 bits, zero extended | None |
| `100` (4) | SHR | Logical a >> shift_amount, zero extended | None |
| `101` (5) | MUL | Full 16-bit a x b | None |
| `110` (6) | DIV | Integer a / b, zero extended | `remainder`, `divide_by_zero` |
| `111` (7) | Reserved | 0 | None |

Every output not active for the selected opcode is zero, including all outputs for opcode 7. `cin` affects ADD only; `shift_amount` affects SHL/SHR only. Shifts ignore `b`, zero-fill, and return zero for amounts 8-15. DIV with b = 0 returns result = 0, remainder = a, and divide_by_zero = 1.

The ALU testbench starts with nine checked, labeled examples (one 10 ns waveform interval per example, covering 0-90 ns), including addition overflow, subtraction borrow, normal division, and division by zero. Waveform dumping stops at 90 ns to keep the VCD focused on these examples; simulation continues with 466944 exhaustive binary cases across the operations and verifies inactive outputs are zero. The existing divider has its own independent repeated-subtraction tests; this integration test also verifies opcode routing and flag clearing.

Run from `07_cpu_design` with the PATH setting above:

```powershell
Push-Location 09_alu_8bits
New-Item -ItemType Directory -Force build | Out-Null
iverilog -g2012 -s tb_alu_8bits -o build/alu_8bits.vvp alu_8bits.sv tb_alu_8bits.sv ../02_full_adder/full_adder.sv ../03_ripple_carry_adder_8bits/ripple_carry_adder_8bits.sv ../04_subtract_number_8bits/subtract_number_8bits.sv ../05_compare_2_number_8bits/compare_2_number_8bits.sv ../06_shift_number_8bits/shift_number_8bits.sv ../07_multiply_number_8bit/multiply_number_8bit.sv ../08_divide_number_8bits/divide_number_8bits.sv
vvp build/alu_8bits.vvp
Pop-Location
```
