# Cornell Notes

## Topic: Frequency-Domain Image Smoothing

**Source:** Section 4.8, printed pp. 269–279 (PDF pp. 292–302).

---

### Cue Column

- How do low-pass filters smooth images?
- Why does an ideal cutoff ring?
- How do Gaussian and Butterworth responses differ?

---

### Notes Section

Let $D(u,v)$ be distance from the centered origin. An ideal low-pass filter is one inside cutoff $D_0$ and zero outside; its abrupt transition produces spatial ringing.

Butterworth smoothing uses

$$H(u,v)=\frac{1}{1+[D(u,v)/D_0]^{2n}},$$

where order $n$ controls transition steepness. A Gaussian response

$$H(u,v)=e^{-D^2(u,v)/(2D_0^2)}$$

has no sharp discontinuity and therefore minimal ringing. Smaller $D_0$ removes more detail. Filter choice trades selectivity against spatial artifacts.

---

### Summary Section

Low-pass filters suppress fine variation. Smooth spectral transitions reduce ringing; sharper transitions improve cutoff selectivity.

**Previous:** [Filtering Basics](07_basics_of_frequency_domain_filtering.md)  
**Next:** [Frequency-Domain Image Sharpening](09_frequency_domain_image_sharpening.md)
