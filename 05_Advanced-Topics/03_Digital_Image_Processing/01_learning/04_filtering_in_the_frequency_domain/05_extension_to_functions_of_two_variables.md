# Cornell Notes

## Topic: Extension to Functions of Two Variables

**Source:** Section 4.5, printed pp. 225–235 (PDF pp. 248–258).

---

### Cue Column

- How does the Fourier transform extend to images?
- What does a 2-D frequency coordinate mean?
- How does 2-D sampling create aliasing?

---

### Notes Section

For an $M\times N$ image,

$$F(u,v)=\sum_{x=0}^{M-1}\sum_{y=0}^{N-1}f(x,y)e^{-j2\pi(ux/M+vy/N)},$$

$$f(x,y)=\frac1{MN}\sum_u\sum_vF(u,v)e^{j2\pi(ux/M+vy/N)}.$$

Each $(u,v)$ identifies a sinusoidal pattern with orientation and spatial rate. Sampling on a 2-D grid replicates the continuous spectrum along both frequency axes. Insufficient sampling causes overlap in either direction. The transform is separable: apply 1-D transforms to every row, then every column.

---

### Summary Section

The 2-D DFT decomposes images into oriented spatial frequencies and can be computed through successive row and column transforms.

**Previous:** [One-Dimensional DFT](04_one_dimensional_discrete_fourier_transform.md)  
**Next:** [Properties of the Two-Dimensional DFT](06_properties_of_the_two_dimensional_dft.md)
