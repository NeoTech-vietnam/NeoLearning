# Cornell Notes: Signals, Systems, and Introductory DSP

## Topic and context

These notes connect the local 00_Intro lecture to the relevant reading in Lyons, *Understanding Digital Signal Processing*, Third Edition. They are a first-pass study guide, not a replacement for deriving the results in the cited sections.

## Cue column

- What does the index n mean?
- What information completely describes an LTI system?
- Why do we need an ROC with a z-transform?
- When does a sampled signal become ambiguous?
- What does an FFT change compared with a DFT?
- Which filter properties matter before implementation?

## Main notes

### 1. From a physical signal to a sequence

A sensor voltage varies with continuous time t. Sampling every T seconds creates a sequence x[n] = x_a(nT), where n is an integer and the sample rate is f_s = 1/T. The index n is not time by itself; physical time is t = nT.

For a mechatronic measurement path, the useful physical picture is:

sensor -> analog anti-alias filter -> sampler/ADC -> sequence x[n] -> digital algorithm -> DAC/ZOH -> reconstruction filter -> actuator

The anti-alias filter protects the ADC from high-frequency inputs that would fold into the sampled band. The reconstruction filter after a DAC suppresses spectral images. Those filters act at different points and solve different problems.

### 2. A system can be tested by its properties

A discrete-time system maps an input sequence x[n] to an output y[n]. A linear system obeys superposition. A time-invariant system responds to a shifted input with the same shift in its output. Linear plus time-invariant gives an LTI system.

The unit impulse δ[n] is zero except at n = 0. The response to δ[n] is h[n], the impulse response. For an LTI system, h[n] is enough to calculate every zero-state output:

$$y[n] = \sum_{k=-\infty}^{\infty} x[k]h[n-k] = x[n] * h[n].$$

The sum is convolution. An implementation computes weighted, delayed input samples. For a causal FIR filter with coefficients b[0]...b[M], y[n] = Σ from k=0 to M of b[k]x[n-k].

- Causal: h[n] = 0 for n < 0.
- BIBO stable LTI: Σ |h[n]| is finite.
- FIR: only finitely many h[n] samples are nonzero.
- IIR: the impulse response can continue indefinitely, usually because of feedback.

An ideal delay has h[n] = δ[n-M]. A moving average has a finite impulse response. An accumulator sums past and present inputs and has an infinite impulse response. These are worked through on lecture PDF pages 56-62.

### 3. Difference equations and initial conditions

A difference equation is the discrete-time counterpart of a differential equation. For example,

$$y[n] - 0.5y[n-1] = x[n]$$

describes a recursive system. To compute its output, retain the prior output sample. With initial rest and x[n] = δ[n], h[n] = (0.5)^n u[n]. The system function is H(z) = 1/(1 - 0.5z^-1), with causal ROC |z| > 0.5.

For a system with stored state, total response separates into:

- zero-input response: output caused by initial stored energy with x[n] = 0;
- zero-state response: output caused by the input when initial state is zero.

Lecture PDF pages 67-75 work these pieces separately. Do not silently assume zero initial conditions when a problem supplies y[-1], y[-2], or another stored state.

### 4. Z-transform, ROC, poles, and stability

The bilateral z-transform is X(z) = Σ x[n]z^-n. A rational expression alone is not the full transform description: the region of convergence (ROC) identifies which time sequence is represented. The same algebraic expression can correspond to right-sided, left-sided, or two-sided sequences with different ROCs.

For an LTI system, H(z) = Y(z)/X(z) under zero-state conditions. Poles are values that make H(z) unbounded; zeros make H(z) zero. For a causal rational IIR system, stability requires every pole strictly inside the unit circle. More generally, an LTI system is stable when the unit circle lies in the ROC.

The frequency response H(e^jω) comes from evaluating H(z) on the unit circle when the ROC includes it. This connects time-domain recurrence, pole-zero location, and sinusoidal steady-state gain.

### 5. Sampling and aliasing

If the highest input frequency is B and the signal is appropriately bandlimited, lowpass sampling needs f_s > 2B to avoid overlap of spectral copies. If that condition fails, distinct analog frequencies can produce the same sequence. Filtering after sampling cannot recover which original frequency was present.

For a cosine at f_0 sampled at f_s, bring f_0 modulo f_s into the Nyquist interval 0 to f_s/2; a convenient magnitude formula is f_alias = |((f_0 + f_s/2) mod f_s) - f_s/2|. For f_0 = 50 Hz and f_s = 80 Hz, f_alias = 30 Hz. The sampled 50-Hz cosine equals a 30-Hz cosine with a phase reversal at those sample instants.

### 6. DFT and FFT

The N-point DFT represents N samples with N frequency bins. Under the forward convention X[k] = Σ from n=0 to N-1 of x[n] exp(-j2πkn/N), the inverse includes the factor 1/N. Always check the course's sign and scale convention.

The FFT is an efficient algorithm for computing the same DFT values. It does not define a different transform. The lecture's 8-point decimation-in-time example is on PDF page 235; the Lyons radix-2 derivation begins on printed page 141 (PDF 166).

A finite record implicitly applies a time window. If a sinusoid does not fit an integer number of cycles in the record, energy spreads across DFT bins (spectral leakage). A tapering window usually lowers sidelobes but widens the main lobe. Zero padding samples the same underlying spectrum more densely; it does not add measurement information or improve the true resolving power of the original record.

### 7. FIR, IIR, and practical numerical effects

FIR filters use a finite weighted sum of current and past inputs. They are straightforward to make stable and can have exact linear phase with symmetric or antisymmetric coefficients, at the cost of potentially many taps.

IIR filters use feedback. They can meet a magnitude specification with lower order, but finite-precision coefficient changes, internal overflow, and pole movement can affect stability or create limit cycles. Cascaded second-order sections often make implementation safer than a single high-order polynomial.

Keep these effects distinct:

- input sampling and aliasing;
- ADC/DAC quantization;
- coefficient quantization inside the filter;
- overflow or saturation in arithmetic;
- DAC zero-order-hold droop and delay;
- analog plant dynamics after the driver.

The lecture's fixed-point examples are on PDF pages 375 and 405-407. The book's Chapter 12 gives broader fixed-point and word-length coverage.

## Demonstration

Expected: explain why an 80-Hz update cannot faithfully represent a 50-Hz sinusoid in the baseband and identify the aliased frequency.

Work: Nyquist is 80/2 = 40 Hz. A 50-Hz component is 10 Hz above that edge and folds to 30 Hz. Therefore a reconstruction filter with a 40-Hz cutoff passes the 30-Hz alias and cannot infer that the intended input was 50 Hz.

## Failure cases

- Treating a discrete index n as seconds without multiplying by T.
- Giving H(z) but omitting the ROC when the sequence is ambiguous.
- Calling every recursive equation stable without checking its poles or impulse response.
- Calling the FFT a different transform from the DFT.
- Claiming zero padding creates new frequency resolution.
- Confusing pre-ADC anti-alias filtering with post-DAC reconstruction filtering.
- Assuming a digital command guarantees the same mechanical actuator response without a plant model.

## Summary

The core chain is: sample a physical signal into x[n], characterize the discrete-time system, use convolution or a difference equation to compute y[n], use the z-transform and frequency response to analyze it, and account separately for sampling, filtering, and finite-precision effects.

## Sources

- [S1] Richard G. Lyons, *Understanding Digital Signal Processing*, Third Edition, local book PDF; sections and page labels enumerated in book_reading_map.md; SHA-256 f2ae2b5d68b8809a040de28d98ac2a614163d37e85259453a96e70791f0eb057.
- [S2] 00_Intro.pdf, local course lecture PDF; worked examples indexed in lecture_examples.md; SHA-256 de60eb0ab30b67e3d59f94a426795fcdea0232809c096435dbd77e444ae1dbea.
