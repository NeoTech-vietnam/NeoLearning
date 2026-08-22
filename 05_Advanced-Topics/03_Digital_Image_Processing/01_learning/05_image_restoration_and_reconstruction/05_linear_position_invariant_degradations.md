# Cornell Notes

## Topic: Linear, Position-Invariant Degradations

**Source:** Section 5.5, printed pp. 343–345 (PDF pp. 366–368).

---

### Cue Column

- What makes a degradation linear and position-invariant?
- Why does convolution model blur?
- What is the point-spread function?

---

### Notes Section

A degradation operator is linear if it obeys superposition and position-invariant if shifting the input only shifts the output. Such a system is completely described by its response to an impulse, the point-spread function $h$:

$$\mathcal H[f]=h*f.$$

In frequency, the optical transfer function $H$ multiplies $F$. Defocus, atmospheric blur over a limited field, and uniform motion are often approximated this way. Boundary effects and spatially varying motion violate the approximation.

---

### Summary Section

Linear shift-invariant blur reduces restoration to deconvolution using a point-spread or transfer function.

**Previous:** [Periodic Noise Reduction](04_periodic_noise_reduction_by_frequency_domain_filtering.md)  
**Next:** [Estimating the Degradation Function](06_estimating_the_degradation_function.md)
