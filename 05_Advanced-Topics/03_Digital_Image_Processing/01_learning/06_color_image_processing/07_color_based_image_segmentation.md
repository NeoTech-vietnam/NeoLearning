# Cornell Notes

## Topic: Color-Based Image Segmentation

**Source:** Section 6.7, printed pp. 443–450 (PDF pp. 466–473).

---

### Cue Column

- How does color improve segmentation?
- What is segmentation by vector distance?
- How are color edges defined?

---

### Notes Section

Color adds discriminative dimensions when objects share grayscale intensity. A simple classifier assigns pixel vector $\mathbf z$ to a class centered at mean $\mathbf m$ when distance is below a threshold. Euclidean distance assumes spherical spread; Mahalanobis distance accounts for covariance:

$$D_M(\mathbf z,\mathbf m)=\sqrt{(\mathbf z-\mathbf m)^TC^{-1}(\mathbf z-\mathbf m)}.$$

Color edges should measure vector change, not independently threshold arbitrary channel edges. Illumination variation can dominate raw RGB; normalized chromaticity or hue-saturation features may improve robustness, except near low intensity or low saturation.

---

### Summary Section

Color segmentation classifies pixel vectors or detects vector transitions; suitable distance and illumination handling are essential.

**Previous:** [Smoothing and Sharpening](06_smoothing_and_sharpening.md)  
**Next:** [Noise in Color Images](08_noise_in_color_images.md)
