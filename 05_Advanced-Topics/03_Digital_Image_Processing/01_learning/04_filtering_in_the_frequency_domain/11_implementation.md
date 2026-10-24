# Cornell Notes

## Topic: Implementation

**Source:** Section 4.11, printed pp. 298–303 (PDF pp. 321–326).

---

### Cue Column

- Why use the FFT?
- How should dimensions and padding be chosen?
- Which numerical details affect the result?

---

### Notes Section

Direct 2-D DFT evaluation is expensive. Separable FFT algorithms reduce work by transforming rows then columns, with radix-2 implementations favoring power-of-two dimensions.

Implementation sequence: convert to floating point, pad for linear convolution, center, FFT, multiply by a size-compatible $H$, inverse FFT, take the real component, uncenter, crop, then map intensities for display. Preserve full precision until display; early clipping loses recoverable information. Inspect residual imaginary values and scaling conventions because libraries distribute the $1/(MN)$ factor differently.

---

### Summary Section

FFT filtering needs correct padding, centering, normalization, precision, and cropping—not only a mathematically valid transfer function.

**Previous:** [Selective Filtering](10_selective_filtering.md)  
**Next:** [Degradation/Restoration Model](../05_image_restoration_and_reconstruction/01_degradation_restoration_model.md)
