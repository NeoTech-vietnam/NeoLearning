# Reading Map: Understanding Digital Signal Processing

## Exact book and navigation

Richard G. Lyons, *Understanding Digital Signal Processing*, Third Edition, 2011, ISBN 978-0-13-702741-5. The local PDF has 983 pages and SHA-256 f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057.

For the numbered body chapters, the visible printed page number maps to PDF ordinal +25. For example, printed page 1 is PDF page 26, printed page 59 is PDF page 84, and printed page 253 is PDF page 278. Front matter uses Roman numerals; always search by the printed page and confirm the PDF ordinal.

## What to read for the 00_Intro lecture

| Priority | Book chapter and printed pages | 1-based PDF pages | Why it matches the lecture |
|---|---|---|---|
| 1 | Ch. 1, “Discrete Sequences and Systems,” pp. 1-21; problems p. 23 | 26-46; problems 48 | Sequences, system properties, LTI systems, and system analysis |
| 2 | Ch. 2, “Periodic Sampling,” pp. 33-49; problems p. 50 | 58-74; problems 75 | Sampling, aliasing, and lowpass/bandpass sampling |
| 3 | Ch. 3, “The Discrete Fourier Transform,” pp. 59-124; problems p. 125 | 84-149; problems 150 | DFT, frequency bins, leakage, windows, and the DTFT connection |
| 4 | Ch. 4, “The Fast Fourier Transform,” pp. 135-158; problems p. 160 | 160-183; problems 185 | Radix-2 FFT and the lecture's 8-point decimation-in-time example |
| 5 | Ch. 5, “Finite Impulse Response Filters,” pp. 169-237; problems p. 238 | 194-262; problems 263 | Convolution, FIR design, phase, and filter analysis |
| 6 | Ch. 6, “Infinite Impulse Response Filters,” pp. 253-335; problems p. 336 | 278-360; problems 361 | Z-transform, poles/zeros, IIR structures, and analog-to-digital design |
| Later | Ch. 12, “Digital Data Formats and Their Effects,” pp. 623-660; problems p. 661 | 648-685; problems 686 | Fixed-point arithmetic, quantization, and finite-word-length effects |

For extra sampling-rate conversion after the introductory material, read Ch. 10, pp. 507-567 and problems p. 568 (PDF 532-592 and 593).

## Section-level assignments

### 1. Sequences and systems

Read §§1.1-1.8: sequence notation (p. 2), amplitude/magnitude/power (p. 8), operational symbols (p. 10), LTI introduction and linearity (p. 12), time invariance (p. 17), commutativity (p. 18), and system analysis (p. 19). The chapter's central move is to identify a system by its response to the unit impulse, then use linearity and time invariance to compute responses to general inputs.

### 2. Sampling

Read §§2.1-2.4: aliasing (p. 33), lowpass sampling (p. 38), bandpass sampling (p. 42), and practical bandpass sampling (p. 45). Pair this with lecture PDF pages 1-5 and the DAC reconstruction exercise. Keep analog anti-alias filtering before sampling separate from the reconstruction filter after a DAC.

### 3. DFT and frequency interpretation

Read §§3.1-3.8 first: the DFT equation (p. 60), symmetry (p. 73), linearity and magnitudes (p. 75), frequency axis and shifting (p. 77), inverse DFT (p. 80), and leakage (p. 81). Then read windows and scalloping (§§3.9-3.10, pp. 89-97) and resolution/zero padding (§3.11, p. 98). The book's DTFT interpretation (§3.14, p. 120) helps explain why an N-point DFT samples a periodic frequency-domain representation.

### 4. FFT

Read §4.1 for the relation between FFT and DFT (p. 136), §4.2 for practical use (p. 137), then the radix-2 derivation (p. 141), bit reversal (p. 149), and butterfly structures (pp. 151-157).

### 5. FIR filters

Read the introduction (§5.1, p. 170), convolution (§5.2, p. 175), lowpass design (§5.3, p. 186), bandpass/highpass designs (§§5.4-5.5, pp. 201-203), phase response (§5.8, p. 209), generic convolution (§5.9, p. 214), and analysis (§5.10, p. 226). Parks-McClellan and half-band filters are useful follow-up sections, not prerequisites for the first pass.

### 6. IIR filters

Prioritize the z-transform (§6.3, p. 270), IIR analysis (§6.4, p. 274), poles and zeros (§6.5, p. 282), structures and implementation pitfalls (§§6.6-6.7, pp. 289-292), cascaded sections (§6.8, p. 295), and the FIR/IIR comparison (§6.13, p. 332). Then read impulse invariance (§6.10, p. 303) and the bilinear transform (§6.11, p. 319) alongside lecture examples.

## Suggested reading order

1. Ch. 1 §§1.1-1.8.
2. Ch. 2 §§2.1-2.2.
3. Ch. 6 §§6.3-6.7 for the transform and recursive systems.
4. Ch. 5 §§5.1-5.3 for convolution and FIR filters.
5. Ch. 3 §§3.1-3.11, then Ch. 4 §§4.1-4.5.
6. Ch. 6 §§6.10-6.13; use Ch. 12 when the lecture reaches finite precision.

The chapter-end problem page references above point you to the book's own exercises without reproducing its problem text.

## Coverage boundary

Lyons supplies the general DSP theory behind the lecture. The exact DAC code convention (Vout = 5D/256), the local 0-5 V to 0-3000 rpm driver mapping, and the assignment's motor-command numbers come from the course's own DAC exercise, not from the book reading map. Use the local lecture and exercise for those values; do not infer real motor dynamics from the linear command mapping alone.
