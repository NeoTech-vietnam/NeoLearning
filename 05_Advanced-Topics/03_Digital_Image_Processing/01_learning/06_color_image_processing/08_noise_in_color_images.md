# Cornell Notes

## Topic: Noise in Color Images

**Source:** Section 6.8, printed pp. 451–453 (PDF pp. 474–476).

---

### Cue Column

- How does noise propagate between color spaces?
- Why can one noisy channel alter all transformed components?
- Which filters preserve valid colors?

---

### Notes Section

Sensor channels may have different noise variances and correlations. A linear color conversion $\mathbf y=A\mathbf x$ transforms covariance as

$$C_y=AC_xA^T.$$

Thus independent RGB noise can become correlated elsewhere, and corruption in one component can influence every reconstructed channel. Component median filtering may combine components from different pixels into a nonexistent color; vector filters retain an observed neighborhood vector. Noise assessment should use component covariance, not only separate histograms.

---

### Summary Section

Color noise is multivariate; transformations redistribute it, making covariance-aware and vector-preserving treatment valuable.

**Previous:** [Color-Based Segmentation](07_color_based_image_segmentation.md)  
**Next:** [Color Image Compression](09_color_image_compression.md)
