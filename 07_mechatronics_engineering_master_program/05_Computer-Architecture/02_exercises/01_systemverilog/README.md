# SystemVerilog Exercise: 2:1 Multiplexer

An original introductory exercise inspired by the [ChipVerify SystemVerilog tutorial](https://chipverify.com/tutorials/systemverilog). It demonstrates a module with typed ports, combinational logic using `always_comb`, a testbench, and waveform capture.

The mux implements:

| `sel` | Output |
|---:|---|
| 0 | `y = a` |
| 1 | `y = b` |

## Simulate with Icarus Verilog

From this directory, compile and run the testbench:

```bash
mkdir -p build
iverilog -g2012 -Wall -s tb_mux2 -o build/tb_mux2.vvp mux2.sv tb_mux2.sv
vvp build/tb_mux2.vvp
```

The testbench checks all eight combinations of `sel`, `b`, and `a`. It prints a `PASS` message when each output matches the mux equation and writes the waveform to `build/mux2.vcd`.

## View the waveform

```bash
gtkwave build/mux2.vcd
```

Add `a`, `b`, `sel`, and `y` from the `tb_mux2` scope to the waveform view. Notice that `y` follows `a` while `sel` is low and follows `b` while `sel` is high.

## Inspect synthesis with Yosys

```bash
yosys -p 'read_verilog -sv mux2.sv; hierarchy -top mux2; proc; opt; stat'
```

This converts the SystemVerilog process into logic and prints a small synthesis summary. The testbench is for simulation and is not included in synthesis.
