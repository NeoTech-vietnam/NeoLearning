# Practice Exercises: Introductory DSP

Try the questions before opening the separate [answer key](practice_answers.md). The first six are translated and condensed from the existing local DAC assignment. The next ten are newly written practice.

## A. Existing local exercise: DAC and reconstruction

Source: 02_exercises/BaiTap_DA_NguyenLy_2670014_Nguyen_Ba_Vu_Thach.docx; detailed Vietnamese solution: 02_exercises/BaiTap_DA_NguyenLy_Loi_giai_chi_tiet_Tieng_Viet.docx.

Assume an 8-bit unipolar DAC with Vref = 5 V, codes D = 0...255, and transfer Vout = 5D/256. The driver maps 0...5 V linearly to 0...3000 rpm, or 600 rpm/V. The DAC holds each output until the next update (zero-order hold).

1. Find the voltage and speed represented by one LSB.
2. Command 1800 rpm. Find the target voltage, nearest DAC code, output voltage, resulting speed, and signed speed error.
3. Find the minimum DAC resolution in bits for a speed step no greater than 1 rpm.
4. Command a speed sinusoid around 1500 rpm with 1200-rpm amplitude at 50 Hz. At a 1-kHz update rate, find the update period, samples per sine period, and DAC codes for n = 0...5. Explain why the output is a staircase.
5. For the 1-kHz sequence, use the course's ideal reconstruction convention. What cutoff is chosen? Which DC/baseband components pass, and what are the first four positive-frequency images?
6. Repeat the sampling analysis at 80 Hz. Does Nyquist hold? What frequency appears in the reconstructed baseband if an ideal 40-Hz lowpass is used?

## B. Additional original exercises

1. **Impulse response and classification.** An LTI system has h[n] = δ[n] - 0.5δ[n-1]. Find y[n] for x[n] = δ[n] + 2δ[n-1]. State whether the system is causal, FIR or IIR, and BIBO stable.
2. **Recursive system.** With initial rest, solve y[n] - 0.5y[n-1] = x[n] for x[n] = δ[n]. Give h[n], H(z), its causal ROC, and a stability conclusion.
3. **Step response.** For the system in Exercise 2, use x[n] = u[n]. Find y[n] for n >= 0 and its limiting value.
4. **Aliasing.** A 650-Hz cosine is sampled at 800 Hz. Find its baseband alias between 0 and 400 Hz. State what a reconstruction lowpass can and cannot tell you.
5. **Eight-point DFT.** Let x[n] = cos(2πn/8), n = 0...7. Under the forward DFT convention in the notes, identify the nonzero bins and their values.
6. **Convolution.** Find the linear convolution of x = [1, 2, 1] and h = [1, 1]. Then find the 3-point circular convolution after zero-padding h to length 3. Explain the difference.
7. **Windowing.** A sinusoid completes 5.5 cycles in an N-sample record. Explain why a rectangular-window DFT leaks energy across bins, and describe one tradeoff when using a Hann window.
8. **FIR or IIR.** You need a causal lowpass with exactly linear phase and can afford more multiply-accumulates. Which class is the natural first choice, and what property supports that choice?
9. **Fixed-point review.** Name two effects that can change an IIR result when moving from floating point to fixed point. Which lecture pages show concrete examples?
10. **Read-from-book problems.** Work Lyons Chapter 1 problem set (printed p. 23 / PDF p. 48), Chapter 2 (p. 50 / PDF 75), Chapter 3 (p. 125 / PDF 150), Chapter 4 (p. 160 / PDF 185), Chapter 5 (p. 238 / PDF 263), and Chapter 6 (p. 336 / PDF 361). These are locator recommendations; the book's problem text is not copied here.
