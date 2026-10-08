# Cornell Notes

## Topic: Fundamentals

**Source:** Section 8.1, printed pp. 526–541 (PDF pp. 549–564).

---

### Cue Column

- Which redundancies make compression possible?
- How are rate, distortion, and fidelity measured?
- What separates lossless from lossy coding?

---

### Notes Section

Compression removes coding redundancy, interpixel redundancy, and visually irrelevant information. Lossless methods permit exact reconstruction; lossy methods accept controlled error for lower rates.

If an original uses $n_1$ bits and its coded form uses $n_2$ bits,

$$C_R=\frac{n_1}{n_2},\qquad R_D=1-\frac{1}{C_R}.$$

For $M\times N$ images, mean-squared error and peak signal-to-noise ratio are

$$\mathrm{MSE}=\frac1{MN}\sum_{x,y}[f(x,y)-\hat f(x,y)]^2,$$
$$\mathrm{PSNR}=10\log_{10}\frac{(L-1)^2}{\mathrm{MSE}}.$$

PSNR is reproducible but does not reliably predict perceived quality. A compression system typically maps source data to a less redundant representation, quantizes when loss is allowed, then entropy-codes symbols. Decoding reverses available stages; quantization cannot be undone exactly.

---

### Summary Section

Compression exploits statistical and perceptual redundancy. Evaluate it jointly by bit rate, reconstruction distortion, complexity, and task-specific quality.

**Previous:** [Wavelet Packets](../07_wavelets_and_multiresolution_processing/06_wavelet_packets.md)  
**Next:** [Basic Compression Methods](02_basic_compression_methods.md)
