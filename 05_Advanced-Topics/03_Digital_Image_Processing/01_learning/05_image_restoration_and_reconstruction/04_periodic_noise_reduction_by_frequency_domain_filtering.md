# Cornell Notes

## Topic: Periodic Noise Reduction by Frequency-Domain Filtering

**Source:** Section 5.4, printed pp. 335–342 (PDF pp. 358–365).

---

### Cue Column

- How is periodic noise recognized?
- Which filters remove spectral spikes?
- What is optimum notch filtering?

---

### Notes Section

Periodic interference forms isolated conjugate peaks in the centered spectrum. Paired notch-reject filters suppress these locations while preserving unrelated frequencies. Bandreject filters suit interference spread over a radial band.

Optimum notch filtering first isolates a noise pattern $\eta$, then subtracts a locally weighted estimate:

$$\hat f(x,y)=g(x,y)-w(x,y)\eta(x,y).$$

The weight is selected from local covariance and variance to minimize error. Inspecting the notch-pass reconstruction helps distinguish interference from legitimate texture.

---

### Summary Section

Periodic noise is spectrally localized; selective notches remove it with less collateral damage than broad smoothing.

**Previous:** [Spatial Filtering with Noise](03_spatial_filtering_in_the_presence_of_noise_only.md)  
**Next:** [Linear, Position-Invariant Degradations](05_linear_position_invariant_degradations.md)
