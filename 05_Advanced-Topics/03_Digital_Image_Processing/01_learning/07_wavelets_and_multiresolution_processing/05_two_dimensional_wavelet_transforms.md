# Cornell Notes

## Topic: Two-Dimensional Wavelet Transforms

**Source:** Section 7.5, printed pp. 501–509 (PDF pp. 524–532).

---

### Cue Column

- How does separability extend wavelets to images?
- What do LL, LH, HL, and HH contain?
- How is a multilevel image pyramid formed?

---

### Notes Section

A separable 2-D DWT filters rows and columns independently. Combining low-pass ($L$) and high-pass ($H$) outputs gives four quarter-size subbands: LL is the approximation; LH and HL emphasize changes along complementary axes; HH responds strongly to diagonal and fine-scale variation.

For separable basis functions:

$$\phi(x,y)=\phi(x)\phi(y),$$
$$\psi^H=\psi(x)\phi(y),\quad
\psi^V=\phi(x)\psi(y),\quad
\psi^D=\psi(x)\psi(y).$$

Recursive decomposition of LL builds a pyramid. For an $M\times N$ image, one level keeps $MN$ total coefficients across all four critically sampled bands. Example: an $8\times8$ image yields four $4\times4$ bands; decomposing LL again yields four $2\times2$ bands while the first-level details remain.

---

### Summary Section

The 2-D DWT partitions image information by scale and orientation without increasing the coefficient count.

**Previous:** [Fast Wavelet Transform](04_fast_wavelet_transform.md)  
**Next:** [Wavelet Packets](06_wavelet_packets.md)
