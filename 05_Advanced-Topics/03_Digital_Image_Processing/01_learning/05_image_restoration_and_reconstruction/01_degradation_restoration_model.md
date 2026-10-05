# Cornell Notes

## Topic: Degradation/Restoration Model

**Source:** Section 5.1, printed p. 312 (PDF p. 335).

---

### Cue Column

- How is image degradation modeled?
- Why is restoration model-driven?

---

### Notes Section

A degraded observation is modeled by

$$g(x,y)=h(x,y)*f(x,y)+\eta(x,y),$$

or $G=HF+N$ in frequency. Here $f$ is the unknown image, $h$ the degradation, and $\eta$ additive noise. Restoration estimates $f$ using knowledge or estimates of $H$ and noise statistics; enhancement instead prioritizes visual improvement without requiring a physical model.

---

### Summary Section

Restoration inverts a degradation model while controlling noise amplification and uncertainty.

**Previous:** [Implementation](../04_filtering_in_the_frequency_domain/11_implementation.md)  
**Next:** [Noise Models](02_noise_models.md)
