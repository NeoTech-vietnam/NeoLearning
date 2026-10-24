# Cornell Notes

## Topic: Boundary Descriptors

**Source:** Section 11.2, printed pp. 815–821 (PDF pp. 838–844).

---

### Cue Column

- Which simple measures describe a boundary?
- How do Fourier descriptors encode shape?
- How is invariance obtained?

---

### Notes Section

Simple boundary descriptors include perimeter, diameter, major-axis orientation, curvature, and compactness. A common scale-independent compactness measure is

$$C=\frac{P^2}{A},$$

where $P$ is perimeter and $A$ area. A circle minimizes $C$ in the continuous plane; digitization changes the exact value.

For ordered boundary points $(x_k,y_k)$, form $z_k=x_k+jy_k$ and compute its DFT:

$$a_n=\frac{1}{K}\sum_{k=0}^{K-1}z_ke^{-j2\pi nk/K}.$$

Low-frequency Fourier descriptors capture broad shape; high frequencies encode fine detail and noise. Reconstruction with only a few coefficients yields a controlled approximation.

Translation changes only $a_0$, so discard it. Scaling divides coefficients by a reference magnitude. Rotation adds a common phase; starting-point shifts add frequency-dependent phase. Magnitudes give simple invariance but discard some discriminative phase information.

Example: retaining only the lowest harmonics converts a jagged sampled contour into a smooth global outline while preserving its dominant elongation.

---

### Summary Section

Boundary descriptors range from scalar geometry to multiscale Fourier coefficients; normalization trades nuisance invariance against retained shape information.

**Previous:** [Representation](01_representation.md)  
**Next:** [Regional Descriptors](03_regional_descriptors.md)
