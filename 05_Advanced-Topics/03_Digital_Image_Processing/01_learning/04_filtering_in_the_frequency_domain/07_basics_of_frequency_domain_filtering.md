# Cornell Notes

## Topic: Basics of Frequency-Domain Filtering

**Source:** Section 4.7, printed pp. 255–268 (PDF pp. 278–291).

---

### Cue Column

- What is the frequency-domain filtering workflow?
- Why pad images before DFT filtering?
- How are spatial and frequency kernels related?

---

### Notes Section

Filtering forms

$$G(u,v)=H(u,v)F(u,v),\qquad g=\mathcal F^{-1}\{G\}.$$

A practical workflow pads the image, multiplies by $(-1)^{x+y}$, computes the DFT, applies $H$, takes the inverse DFT, undoes centering, then crops. Padding prevents circular wraparound from contaminating linear-convolution results.

$H(0,0)$ controls the mean. Values near the centered origin affect slow variation; distant values affect detail. A spatial kernel and its DFT describe the same linear shift-invariant operation, although truncation and padding alter practical behavior.

---

### Summary Section

Frequency filtering multiplies a centered, padded spectrum by a transfer function, then reconstructs and crops the image.

**Previous:** [DFT Properties](06_properties_of_the_two_dimensional_dft.md)  
**Next:** [Frequency-Domain Image Smoothing](08_frequency_domain_image_smoothing.md)
