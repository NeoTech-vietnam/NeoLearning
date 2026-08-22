# Cornell Notes

## Topic: Frequency-Domain Image Sharpening

**Source:** Section 4.9, printed pp. 280–293 (PDF pp. 303–316).

---

### Cue Column

- How does high-pass filtering sharpen?
- What is high-frequency emphasis?
- How is the Laplacian implemented in frequency?

---

### Notes Section

A high-pass response can be formed as $H_{HP}=1-H_{LP}$. It attenuates smooth components while retaining transitions. Because pure high-pass filtering can remove overall appearance, high-frequency emphasis uses

$$H_{hfe}=a+bH_{HP},\qquad a\ge0,\ b>a.$$

The Fourier transform of the Laplacian is

$$\mathcal F\{\nabla^2f\}=-4\pi^2(u^2+v^2)F(u,v),$$

so sharpening adds a scaled frequency-weighted derivative to the image. Homomorphic filtering similarly separates multiplicative illumination and reflectance after a logarithm, then suppresses low-frequency illumination while boosting detail.

---

### Summary Section

High-pass and derivative responses enhance transitions; retaining a low-frequency baseline avoids unnatural images.

**Previous:** [Frequency-Domain Image Smoothing](08_frequency_domain_image_smoothing.md)  
**Next:** [Selective Filtering](10_selective_filtering.md)
