# Answer Key: Introductory DSP

## A. Existing local DAC and reconstruction exercise

Use the exercise's stated transfer Vout = 5D/256 and speed = 600 Vout rpm. Because the DAC has 8 bits, D ranges from 0 to 255; the divisor is 256 under this problem's convention.

1. Voltage step: 5/256 = 0.01953125 V = 19.53125 mV/LSB. Speed step: 600 × 5/256 = 11.71875 rpm/LSB.
2. 1800 rpm requires 3.000 V. The ideal code is 3 × 256/5 = 153.6, so choose D = 154. Then Vout = 770/256 = 3.0078125 V and speed = 1804.6875 rpm. Signed error is +4.6875 rpm (about +0.2604%).
3. Require 3000/2^N <= 1. N >= log2(3000) = 11.55, so the minimum integer is 12 bits. The step is 3000/4096 = 0.732421875 rpm/LSB.
4. T = 1/1000 = 1 ms; samples per period = 1000/50 = 20. For V[n] = 2.5 + 2 sin(2π50nT), n = 0...5 gives ideal voltages approximately 2.5000, 3.1180, 3.6756, 4.1180, 4.4021, 4.5000 V and codes 128, 160, 188, 211, 225, 230. The DAC holds each code until the next update, so its direct output is piecewise constant.
5. The assignment chooses the ideal Nyquist cutoff fs/2 = 500 Hz. Keep DC and the desired 50-Hz component. The first four positive images are 1000-50 = 950 Hz, 1000+50 = 1050 Hz, 2000-50 = 1950 Hz, and 2000+50 = 2050 Hz. In an idealized separation problem a cutoff need only fall between the desired band and the first image; 500 Hz is the course's stated convention, not a uniquely forced value.
6. Nyquist is 40 Hz, below the 50-Hz input. The sampled sequence aliases to 30 Hz (with a phase reversal for the cosine convention). A 40-Hz reconstruction lowpass passes that 30-Hz baseband component; it cannot recover the original 50-Hz intent from these samples alone.

The source solution also separates DAC quantization from sampling images, notes zero-order-hold sinc droop/delay, and warns that a motor's actual speed response needs a mechanical/driver model.

## B. Additional original exercises

1. Convolution with h = [1, -0.5] and x = [1, 2] gives y[0] = 1, y[1] = 1.5, y[2] = -1, so y = [1, 1.5, -1]. The impulse response is causal, finite, and absolutely summable; therefore the system is causal, FIR, and BIBO stable.
2. The impulse response is h[n] = (0.5)^n u[n]. H(z) = 1/(1 - 0.5z^-1), with causal ROC |z| > 0.5. Its pole at z = 0.5 is inside the unit circle, so the causal system is BIBO stable.
3. For n >= 0, y[n] = Σ from k=0 to n of (0.5)^k = 2(1 - 0.5^(n+1)). It approaches 2.
4. 650 Hz folds around 800 Hz to 800-650 = 150 Hz, inside 0...400 Hz. A reconstruction lowpass can pass the baseband 150-Hz sequence; it cannot identify whether the original analog tone was 150 Hz or 650 Hz without additional information.
5. cos(2πn/8) = 0.5e^(j2πn/8) + 0.5e^(-j2πn/8). With the unnormalized forward DFT, X[1] = 4 and X[7] = 4; all other bins are zero.
6. Linear convolution is [1, 3, 3, 1]. For 3-point circular convolution, the final linear-convolution sample wraps to index 0, giving [2, 3, 3]. Zero-padding both inputs to length at least 4 avoids this time-domain wraparound.
7. A 5.5-cycle record does not join smoothly at the rectangular-window boundary; the resulting discontinuity spreads energy among DFT bins. A Hann window reduces sidelobes/leakage but widens the main lobe, so nearby tones may be harder to resolve.
8. Choose FIR as the first candidate. Symmetric or antisymmetric FIR coefficients permit exact linear phase, and a finite impulse response is BIBO stable for finite coefficients. The cost can be a higher order and more computation.
9. Coefficient quantization moves poles/changes the response; finite-word arithmetic can overflow or produce limit cycles. The lecture's concrete examples are on PDF pages 375 and 405-407.

## Checks before reusing these answers

- Confirm the DFT scaling/sign convention stated by the course before comparing numerical bins.
- The DAC answer uses the exercise's explicit divisor 256; another converter's transfer convention may differ.
- A cutoff choice is meaningful only after signal bandwidth, images, and filter idealization are specified.
