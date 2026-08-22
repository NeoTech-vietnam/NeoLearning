# Cornell Notes

## Topic: Constrained Least Squares Filtering

**Source:** Section 5.9, printed pp. 357–360 (PDF pp. 380–383).

---

### Cue Column

- What constraint stabilizes least-squares restoration?
- How does $\gamma$ control the result?
- How can residual noise guide parameter choice?

---

### Notes Section

Constrained least squares minimizes data mismatch while limiting roughness, commonly through a Laplacian operator $P$:

$$\hat F=\frac{H^*}{|H|^2+\gamma|P|^2}G.$$

Larger $\gamma$ favors smooth solutions; smaller values fit the observation more closely and may amplify noise. If noise energy is known, choose $\gamma$ so the residual $\|g-h*\hat f\|^2$ matches that expected energy. Unlike Wiener filtering, this method does not require the undegraded image spectrum.

---

### Summary Section

A smoothness constraint stabilizes deconvolution; $\gamma$ balances fidelity against amplified roughness.

**Previous:** [Wiener Filtering](08_wiener_filtering.md)  
**Next:** [Geometric Mean Filter](10_geometric_mean_filter.md)
