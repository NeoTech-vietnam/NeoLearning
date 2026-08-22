# Cornell Notes

## Topic: One-Dimensional Discrete Fourier Transform

**Source:** Section 4.4, printed pp. 220–224 (PDF pp. 243–247).

---

### Cue Column

- How is a finite sample sequence transformed?
- What do DFT magnitude and phase represent?
- Why is the DFT periodic?

---

### Notes Section

For $M$ samples, the DFT pair is

$$F(u)=\sum_{x=0}^{M-1}f(x)e^{-j2\pi ux/M},$$

$$f(x)=\frac1M\sum_{u=0}^{M-1}F(u)e^{j2\pi ux/M}.$$

$|F(u)|$ measures component strength; $\arg F(u)$ records alignment. Both spatial and frequency sequences repeat with period $M$. The zero-frequency coefficient is $F(0)=\sum_x f(x)$, proportional to the mean. Complex coefficients are required even for real inputs; conjugate symmetry removes redundancy.

---

### Summary Section

The DFT gives an exact, invertible frequency description of a finite sequence, with magnitude and phase carrying complementary information.

**Previous:** [Sampling and the Fourier Transform](03_sampling_and_the_fourier_transform_of_sampled_functions.md)  
**Next:** [Extension to Two Variables](05_extension_to_functions_of_two_variables.md)
