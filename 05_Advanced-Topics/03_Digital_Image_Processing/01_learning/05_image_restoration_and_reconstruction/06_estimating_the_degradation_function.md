# Cornell Notes

## Topic: Estimating the Degradation Function

**Source:** Section 5.6, printed pp. 346–350 (PDF pp. 369–373).

---

### Cue Column

- How can blur be estimated from observations?
- What roles do experimentation and modeling play?
- Why is estimation uncertainty important?

---

### Notes Section

Three routes estimate $H$: inspect image features, measure the system using known inputs, or derive a physical model. A small region containing a recognizable structure can provide local estimates $\hat H=G_s/\hat F_s$. An impulse-like calibration source directly approximates the point-spread function.

Physical models use exposure time, motion, optics, or turbulence. Uniform linear motion with velocities $(a,b)$ over exposure $T$ yields a sinc-like transfer function. Errors near zeros of $H$ become severe during inversion, so estimated models require regularization.

---

### Summary Section

Degradation estimates come from image evidence, calibration, or physics; their uncertainty limits recoverable detail.

**Previous:** [LPI Degradations](05_linear_position_invariant_degradations.md)  
**Next:** [Inverse Filtering](07_inverse_filtering.md)
