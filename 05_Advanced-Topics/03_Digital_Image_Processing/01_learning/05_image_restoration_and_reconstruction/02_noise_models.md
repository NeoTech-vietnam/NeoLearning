# Cornell Notes

## Topic: Noise Models

**Source:** Section 5.2, printed pp. 313–321 (PDF pp. 336–344).

---

### Cue Column

- Which probability models describe image noise?
- How are noise parameters estimated?
- When is noise additive or signal-dependent?

---

### Notes Section

Noise histograms may follow Gaussian, uniform, Rayleigh, exponential, gamma, or impulse distributions. Gaussian noise is characterized by mean $\mu$ and variance $\sigma^2$:

$$p(z)=\frac{1}{\sqrt{2\pi}\sigma}e^{-(z-\mu)^2/(2\sigma^2)}.$$

Salt-and-pepper noise concentrates probability at extreme levels. Periodic interference appears as spectral peaks. Parameters can be estimated from flat image patches, repeated captures, or sensor calibration. A model should match the acquisition mechanism; histogram resemblance alone is insufficient.

---

### Summary Section

Noise distributions encode likely corruption values and guide the choice of spatial or frequency restoration method.

**Previous:** [Degradation Model](01_degradation_restoration_model.md)  
**Next:** [Spatial Filtering with Noise](03_spatial_filtering_in_the_presence_of_noise_only.md)
