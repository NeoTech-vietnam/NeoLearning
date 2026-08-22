# Cornell Notes

## Topic: Digital Image Watermarking

**Source:** Section 8.3, printed pp. 614–621 (PDF pp. 637–644).

---

### Cue Column

- What properties make a watermark useful?
- How do spatial and transform-domain embedding differ?
- What distinguishes detection from extraction?

---

### Notes Section

Watermarking embeds auxiliary information into a host image. Design balances imperceptibility, payload, robustness, security, and detection reliability; improving one often weakens another.

A simple additive model is

$$f_w(x,y)=f(x,y)+\alpha w(x,y),$$

where $\alpha$ controls visibility and resilience. Transform-domain methods modify selected DCT or wavelet coefficients, often surviving moderate compression better than direct least-significant-bit changes. A secret key can determine coefficient locations or watermark sequence.

A detector may test correlation

$$\rho=\frac{\langle z,w\rangle}{\|z\|\,\|w\|}$$

against a threshold. False-positive and missed-detection rates determine that threshold. Robust watermarks support ownership claims; fragile watermarks reveal modification. Watermarking does not encrypt content and cannot by itself prove when or by whom an image was created.

---

### Summary Section

Watermarking hides keyed information within acceptable distortion. Its design is an application-specific compromise among visibility, capacity, robustness, and detection error.

**Previous:** [Basic Compression Methods](02_basic_compression_methods.md)  
**Next:** [Morphological Preliminaries](../09_morphological_image_processing/01_preliminaries.md)
