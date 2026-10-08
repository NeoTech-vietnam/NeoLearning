# Cornell Notes

## Topic: One-Dimensional Wavelet Transforms

**Source:** Section 7.3, printed pp. 486–492 (PDF pp. 509–515).

---

### Cue Column

- Which coefficients form a wavelet transform?
- How is a signal reconstructed?
- What distinguishes continuous and discrete transforms?

---

### Notes Section

Wavelet analysis projects a signal onto scaling and wavelet basis functions. At starting scale $j_0$, approximation coefficients retain coarse content and detail coefficients describe each finer scale:

$$W_\phi(j_0,k)=\langle f,\phi_{j_0,k}\rangle,
\qquad W_\psi(j,k)=\langle f,\psi_{j,k}\rangle.$$

For an orthonormal basis, synthesis is

$$f(t)=\sum_k W_\phi(j_0,k)\phi_{j_0,k}(t)
+\sum_{j=j_0}^{\infty}\sum_k W_\psi(j,k)\psi_{j,k}(t).$$

The continuous transform offers redundant scale-position sampling useful for analysis. The discrete wavelet transform samples scales and shifts economically, enabling compact representations. Large detail coefficients indicate transitions at their scale and location.

---

### Summary Section

A 1-D transform represents a signal using one coarse coefficient set plus scale-indexed detail sets; synthesis combines all sets exactly.

**Previous:** [Multiresolution Expansions](02_multiresolution_expansions.md)  
**Next:** [Fast Wavelet Transform](04_fast_wavelet_transform.md)
