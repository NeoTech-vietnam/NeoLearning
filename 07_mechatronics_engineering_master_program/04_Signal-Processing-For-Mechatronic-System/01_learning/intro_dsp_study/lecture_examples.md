# Worked Examples in 00_Intro.pdf

## Source and page convention

The lecture PDF is 408 pages and has SHA-256 de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea. The locations below use 1-based PDF page ordinals, which are the page numbers in a PDF viewer. Some slides also print a footer number on the slide; use the PDF ordinal as the unambiguous locator.

The locator table comes from a searchable-text scan of all pages. I also visually inspected PDF pages 235 and 337 for the DFT and FIR examples. It is an example index, not a transcription of every diagram or every slide.

## Example and demonstration locator map

| PDF page(s) | Topic and what to inspect |
|---|---|
| 1, 5 | What signals are; analog, discrete, and digital examples; signal-processing applications |
| 28 | Impulse (delta) function and localized-signal example |
| 41 | Discrete-time systems as input-sequence to output-sequence mappings |
| 43 | Linearity examples and counterexamples |
| 45 | Time-invariance example and counterexample |
| 49 | Causality, including backward- and forward-difference examples |
| 51 | BIBO stability example and counterexample |
| 53 | Memoryless-system example |
| 56, 58 | Ideal delay, moving average, accumulator, and backward difference; then their impulse responses and FIR/IIR classification |
| 62 | Accumulator recurrence derived from the running sum |
| 67-69 | Solve a second-order difference equation: homogeneous, particular, then total response |
| 72-73 | Separate zero-input response from zero-state response |
| 75 | Obtain an impulse response from a difference equation |
| 79, 84 | Application examples; ideal lowpass-filter example |
| 94, 98 | Z-transform convergence/ROC and Laurent-series context |
| 101-105 | Z-transforms of right-sided, left-sided, summed exponential, two-sided, and finite-length sequences; inspect each ROC |
| 111, 113-115 | Second-order partial-fraction example, another transform example, power-series expansion, and a logarithmic transform example |
| 121, 123, 125 | Form a system function from a difference equation; consider its possible ROCs; derive system function, impulse response, and difference equation |
| 159, 165 | Compute reflection/lattice parameters and inspect an IIR lattice structure with poles and zeros |
| 235 | Eight-point DFT using decimation in time; compare the split computation with a direct DFT |
| 247, 252 | Digital filter specifications and conversion from analog frequency units to digital frequency |
| 271 | Backward-difference approximation for an analog bandpass filter |
| 275 | Impulse-invariance design example |
| 278-280 | Impulse invariance applied to a Butterworth design |
| 284-286 | Bilinear transform applied to a Butterworth design |
| 296, 300 | Lowpass-to-lowpass and lowpass-to-highpass spectral transformations |
| 316 | Linear-phase example |
| 326 | Window properties that frame the following design examples |
| 337-338 | Length-51 Hann-window lowpass FIR example and frequency-sampling design method |
| 375 | Coefficient finite-precision example for a second-order system |
| 405-407 | Fixed-point zero-input limit cycle and overflow limit-cycle examples |

## What is and is not an exercise in this deck

A searchable-text scan of all 408 pages found no slide titled Exercise, Question, Homework, or Assignment. The word “problem” occurs incidentally on four pages but does not introduce a dedicated problem set. Text extraction can miss picture-only content; if a later slide revision adds scan-only prompts, visual inspection is needed to update this finding.

There is a separate, existing six-question DAC and reconstruction assignment in 02_exercises/BaiTap_DA_NguyenLy_2670014_Nguyen_Ba_Vu_Thach.docx, with a detailed solution in 02_exercises/BaiTap_DA_NguyenLy_Loi_giai_chi_tiet_Tieng_Viet.docx. I have translated and summarized it in [Practice exercises](practice_exercises.md), with answers kept separately.

## A productive pass through the examples

1. Work pages 56-75 by hand; write the input/output equation before classifying the system.
2. For pages 101-125, record transform, ROC, pole locations, and the corresponding time-domain sequence together.
3. Use page 235 to understand the DFT decomposition before treating FFT as a separate transform.
4. Compare pages 271, 275, 278-280, and 284-286. The discretization method changes how analog poles and frequency specifications map into the z-plane.
5. For pages 337 and 375-407, keep ideal arithmetic separate from coefficient rounding, output quantization, and overflow.
