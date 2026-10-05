# Cornell Notes

## Topic: Properties of the Two-Dimensional DFT

**Source:** Section 4.6, printed pp. 236–254 (PDF pp. 259–277).

---

### Cue Column

- Which DFT properties simplify image processing?
- How are translation and rotation represented?
- Why center the spectrum?

---

### Notes Section

The 2-D DFT is linear, separable, and periodic. For real images it has conjugate symmetry: $F(u,v)=F^*(-u,-v)$. Spatial translation changes phase but not magnitude; multiplying by a complex exponential shifts the spectrum.

Multiplication by $(-1)^{x+y}$ moves the origin to the display center:

$$f(x,y)(-1)^{x+y}\Longleftrightarrow F(u-M/2,v-N/2).$$

Rotation in space rotates the spectrum by the same angle. Parseval's relation preserves total energy up to normalization. The convolution theorem gives

$$f*h\Longleftrightarrow FH,$$

while spatial multiplication corresponds to frequency convolution.

---

### Summary Section

DFT symmetry, shifts, rotation, energy conservation, and convolution duality support efficient analysis and filter design.

**Previous:** [Extension to Two Variables](05_extension_to_functions_of_two_variables.md)  
**Next:** [Basics of Frequency-Domain Filtering](07_basics_of_frequency_domain_filtering.md)
