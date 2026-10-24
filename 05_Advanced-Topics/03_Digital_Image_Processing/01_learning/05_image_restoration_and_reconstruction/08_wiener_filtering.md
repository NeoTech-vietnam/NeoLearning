# Cornell Notes

## Topic: Wiener Filtering

**Source:** Section 5.8, printed pp. 352–356 (PDF pp. 375–379).

---

### Cue Column

- What objective does Wiener filtering minimize?
- How are blur and noise balanced?
- What statistics are required?

---

### Notes Section

The Wiener filter minimizes mean-square error between $f$ and $\hat f$:

$$\hat F=\left[\frac{H^*}{|H|^2+S_\eta/S_f}\right]G,$$

where $S_\eta$ and $S_f$ are noise and image power spectra. When noise is negligible it approaches inverse filtering; where noise dominates it suppresses unreliable inversion. If spectra are unknown, a constant $K$ often approximates $S_\eta/S_f$ and is tuned empirically.

---

### Summary Section

Wiener restoration regularizes deconvolution using signal and noise power, minimizing expected squared error.

**Previous:** [Inverse Filtering](07_inverse_filtering.md)  
**Next:** [Constrained Least Squares](09_constrained_least_squares_filtering.md)
