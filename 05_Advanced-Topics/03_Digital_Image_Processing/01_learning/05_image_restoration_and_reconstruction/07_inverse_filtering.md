# Cornell Notes

## Topic: Inverse Filtering

**Source:** Section 5.7, printed p. 351 (PDF p. 374).

---

### Cue Column

- How does inverse filtering undo blur?
- Why do transfer-function zeros cause failure?
- How can inversion be limited?

---

### Notes Section

Ignoring noise, direct inversion estimates

$$\hat F(u,v)=\frac{G(u,v)}{H(u,v)}.$$

With noise, $G/H=F+N/H$; small $|H|$ greatly amplifies noise and model error. Setting a minimum denominator or applying inversion only within a trusted frequency radius reduces instability, but discards information. Direct inversion is suitable only when $H$ is accurate and well-conditioned.

---

### Summary Section

Inverse filtering is exact in an ideal noiseless model, unstable wherever degradation strongly attenuates frequencies.

**Previous:** [Estimating Degradation](06_estimating_the_degradation_function.md)  
**Next:** [Wiener Filtering](08_wiener_filtering.md)
