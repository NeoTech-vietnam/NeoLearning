# Cornell Notes

## Topic: Smoothing Spatial Filters

**Source:** Section 3.5, printed pp. 152–157 (PDF pp. 175–180).

---

### Cue Column

- How does averaging suppress noise?
- Why does smoothing blur edges?
- What distinguishes weighted means from order-statistic filters?
- Which filter handles impulse noise well?

---

### Notes Section

Smoothing suppresses noise and small detail by reducing rapid intensity variation.

#### Linear smoothing

A normalized box filter averages an $m\times n$ neighborhood:

$$g(x,y)=\frac{1}{mn}\sum_{(s,t)\in S_{xy}}f(s,t)$$

Weighted filters give nearby pixels different importance. Coefficients usually sum to one, preserving average brightness. Larger masks suppress more noise but blur more detail.

#### Order-statistic filters

These nonlinear filters sort neighborhood values, then select or combine ranks.

- **Median:** replaces the center with the middle value; strong against salt-and-pepper noise.
- **Max:** removes dark impulses and expands bright regions.
- **Min:** removes bright impulses and expands dark regions.
- **Midpoint:** averages neighborhood minimum and maximum.

#### Worked example

For neighborhood values $[2,3,3,4,250]$, the mean is $52.4$, badly influenced by the impulse. The median is $3$.

---

### Summary Section

Averages reduce random variation but blur boundaries. Order-statistic filters use ranks instead of weighted sums; the median is especially effective for impulse noise.

**Previous:** [Spatial Filtering Fundamentals](04_fundamentals_of_spatial_filtering.md)  
**Next:** [Sharpening Spatial Filters](06_sharpening_spatial_filters.md)
