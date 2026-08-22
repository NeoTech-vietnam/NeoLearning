# Cornell Notes

## Topic: Histogram Processing

**Source:** Section 3.3, printed pp. 120–144 (PDF pp. 143–167).

---

### Cue Column

- What does an image histogram measure?
- Why does equalization use the cumulative distribution function?
- How does histogram matching differ from equalization?
- When is local histogram processing preferable?

---

### Notes Section

For an $M\times N$ image with levels $r_k$, the histogram is $h(r_k)=n_k$, where $n_k$ counts pixels at level $r_k$. The normalized histogram estimates a probability:

$$p_r(r_k)=\frac{n_k}{MN}$$

#### Histogram equalization

The discrete transform is the cumulative normalized histogram:

$$s_k=(L-1)\sum_{j=0}^{k}p_r(r_j)$$

It is monotonic and maps values into $[0,L-1]$. Equalization tends to spread frequently occupied levels, improving global contrast. Discreteness prevents a perfectly uniform result.

#### Histogram matching

Matching targets a specified output distribution rather than a uniform one:

1. Equalize the input using its cumulative distribution.
2. Compute the target cumulative distribution.
3. Map equalized values to the closest target cumulative values.

#### Local processing

Global histograms miss small regions whose statistics differ from the whole image. Local processing computes statistics within a moving neighborhood, enhancing local detail at higher computational cost.

#### Statistical enhancement

Mean describes average brightness; variance describes contrast:

$$m=\sum_{i=0}^{L-1}r_i p(r_i)$$

$$\sigma^2=\sum_{i=0}^{L-1}(r_i-m)^2p(r_i)$$

Local mean and variance can identify pixels belonging to dark, low-contrast regions and selectively enhance them.

```mermaid
flowchart LR
    I[Input histogram] --> C[Compute CDF]
    C --> M[Map each intensity]
    M --> O[Output image]
```

---

### Summary Section

Histograms summarize intensity frequency. Equalization derives an automatic global remapping; matching follows a desired distribution; local statistics adapt enhancement to neighborhoods.

**Previous:** [Basic Intensity Transformations](02_basic_intensity_transformation_functions.md)  
**Next:** [Fundamentals of Spatial Filtering](04_fundamentals_of_spatial_filtering.md)
