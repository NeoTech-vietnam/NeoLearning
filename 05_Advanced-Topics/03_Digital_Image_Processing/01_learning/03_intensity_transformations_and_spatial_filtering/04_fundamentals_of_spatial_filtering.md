# Cornell Notes

## Topic: Fundamentals of Spatial Filtering

**Source:** Section 3.4, printed pp. 144–152 (PDF pp. 167–175).

---

### Cue Column

- How does a kernel produce an output pixel?
- What distinguishes correlation from convolution?
- Why are odd-sized kernels common?
- How should image borders be handled?

---

### Notes Section

A spatial filter moves an $m\times n$ mask over an image. For a linear filter, each output is a weighted sum of neighborhood pixels:

$$g(x,y)=\sum_{s=-b}^{b}\sum_{t=-a}^{a}w(s,t)f(x+s,y+t)$$

where $m=2a+1$ and $n=2b+1$.

#### Correlation versus convolution

- **Correlation:** apply the mask as written.
- **Convolution:** rotate the mask $180^\circ$ before applying it.
- Symmetric masks produce identical correlation and convolution results.

A neighborhood may also be written as vectors:

$$g(x,y)=\mathbf{w}^{T}\mathbf{z}$$

where $\mathbf{w}$ contains mask coefficients and $\mathbf{z}$ contains corresponding pixels.

#### Mask generation

Masks can be designed from:

- desired smoothing or derivative behavior;
- sampled continuous functions;
- separable one-dimensional components;
- optimization constraints.

#### Borders

Near an edge, part of the mask lies outside the image. Common policies: zero padding, replication, reflection, wrapping, or computing only where the mask fully overlaps. Policy affects output and must be explicit.

---

### Summary Section

Linear spatial filtering computes weighted neighborhood sums. Convolution flips the kernel; correlation does not. Kernel design and border policy are part of the operation, not implementation trivia.

**Previous:** [Histogram Processing](03_histogram_processing.md)  
**Next:** [Smoothing Spatial Filters](05_smoothing_spatial_filters.md)
