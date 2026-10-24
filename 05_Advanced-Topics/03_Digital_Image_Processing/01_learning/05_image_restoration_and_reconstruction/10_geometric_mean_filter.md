# Cornell Notes

## Topic: Geometric Mean Filter

**Source:** Section 5.10, printed p. 361 (PDF p. 384).

---

### Cue Column

- How does the geometric mean filter unify restoration forms?
- What do its parameters control?

---

### Notes Section

The geometric mean filter combines inverse-like and Wiener-like factors:

$$\hat F=\left[\frac{H^*}{|H|^2}\right]^\alpha
\left[\frac{H^*}{|H|^2+\beta S_\eta/S_f}\right]^{1-\alpha}G.$$

Parameter $\alpha$ interpolates between formulations; $\beta$ adjusts noise weighting. Special choices recover familiar filters. Flexibility helps empirical tuning but adds no information: poor estimates of $H$ or spectra still limit restoration.

---

### Summary Section

The geometric mean family continuously trades aggressive inversion against noise-aware regularization.

**Previous:** [Constrained Least Squares](09_constrained_least_squares_filtering.md)  
**Next:** [Reconstruction from Projections](11_image_reconstruction_from_projections.md)
