# Cornell Notes

## Topic: Multiresolution Expansions

**Source:** Section 7.2, printed pp. 477–485 (PDF pp. 500–508).

---

### Cue Column

- What makes resolution spaces nested?
- How are approximation and detail related?
- Why must the basis be orthogonal or biorthogonal?

---

### Notes Section

A multiresolution analysis uses nested spaces

$$\cdots\subset V_{-1}\subset V_0\subset V_1\subset\cdots,$$

where $V_j$ contains approximations at scale $2^{-j}$. Their union can represent arbitrary finite-energy signals; their intersection contains only the zero signal. Translation and dyadic scaling preserve the structure.

The detail space $W_j$ complements $V_j$ inside the next finer space:

$$V_{j+1}=V_j\oplus W_j.$$

A scaling function $\phi$ generates $V_0$ by integer shifts. It obeys a two-scale relation

$$\phi(t)=\sqrt2\sum_n h_\phi(n)\phi(2t-n).$$

A related coefficient sequence generates $\psi$ and $W_0$. Orthogonal bases simplify energy accounting; biorthogonal pairs trade strict orthogonality for symmetric filters and flexible reconstruction.

---

### Summary Section

Nested approximation spaces plus complementary detail spaces provide a consistent decomposition and exact reconstruction framework.

**Previous:** [Background](01_background.md)  
**Next:** [One-Dimensional Wavelet Transforms](03_one_dimensional_wavelet_transforms.md)
