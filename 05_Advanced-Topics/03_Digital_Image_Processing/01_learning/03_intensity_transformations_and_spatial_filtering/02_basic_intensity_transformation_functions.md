# Cornell Notes

## Topic: Basic Intensity Transformation Functions

**Source:** Section 3.2, printed pp. 107–120 (PDF pp. 130–143).

---

### Cue Column

- What do negative, logarithmic, and gamma transforms emphasize?
- Why must power-law displays use gamma correction?
- How do contrast stretching and bit-plane slicing work?

---

### Notes Section

For input intensity $r$ and output $s$, point processing uses $s=T(r)$.

#### Image negative

For levels in $[0,L-1]$:

$$s=L-1-r$$

Useful when light detail is embedded in dark regions.

#### Log transformation

$$s=c\log(1+r)$$

Expands low intensities; compresses high intensities. Common for displaying Fourier spectra with very large dynamic range. The inverse-log transform does the opposite.

#### Power-law transformation

$$s=cr^\gamma$$

- $\gamma<1$: expands dark values.
- $\gamma>1$: compresses dark values.
- Display and acquisition devices may have nonlinear power responses; **gamma correction** compensates for them.

#### Piecewise-linear transformations

- **Contrast stretching:** expands a chosen intensity interval.
- **Thresholding:** maps values into two classes.
- **Intensity-level slicing:** highlights a selected range, either suppressing or retaining the background.
- **Bit-plane slicing:** separates the contribution of each binary bit. High-order planes contain major structure; low-order planes often contain fine detail or noise.

#### Worked example

For an 8-bit image, $L=256$. The negative of $r=40$ is:

$$s=255-40=215$$

---

### Summary Section

Point transforms reshape the intensity distribution without consulting neighbors. The chosen curve determines which tonal ranges are expanded, compressed, highlighted, or discarded.

**Previous:** [Background](01_background.md)  
**Next:** [Histogram Processing](03_histogram_processing.md)
