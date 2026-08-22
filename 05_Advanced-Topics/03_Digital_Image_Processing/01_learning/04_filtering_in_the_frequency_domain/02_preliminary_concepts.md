# Cornell Notes

## Topic: Preliminary Concepts

**Source:** Section 4.2, printed pp. 202–210 (PDF pp. 225–233).

---

### Cue Column

- How do complex exponentials encode frequency?
- What are impulses and convolution?
- Why are Fourier transforms useful?

---

### Notes Section

A complex sinusoid is $e^{j2\pi ut}=\cos(2\pi ut)+j\sin(2\pi ut)$. Its magnitude is one; its phase rotates at frequency $u$. The unit impulse samples a function through $\int f(t)\delta(t-t_0)dt=f(t_0)$.

Convolution combines a signal with a shifted kernel:

$$f(t)*h(t)=\int_{-\infty}^{\infty}f(\tau)h(t-\tau)d\tau.$$

The Fourier pair

$$F(u)=\int f(t)e^{-j2\pi ut}dt,\qquad f(t)=\int F(u)e^{j2\pi ut}du$$

changes convolution into multiplication. This duality is the basis of frequency-domain filtering.

---

### Summary Section

Impulses model sampling, convolution models linear filtering, and complex sinusoids form the Fourier representation.

**Previous:** [Background](01_background.md)  
**Next:** [Sampling and the Fourier Transform](03_sampling_and_the_fourier_transform_of_sampled_functions.md)
