# Cornell Notes

## Topic: Thresholding

**Source:** Section 10.3, printed pp. 738–762 (PDF pp. 761–785).

---

### Cue Column

- When does a global threshold work?
- How is Otsu's threshold selected?
- Why use local or multivariable thresholds?

---

### Notes Section

Binary thresholding assigns

$$g(x,y)=\begin{cases}1,&f(x,y)>T\\0,&f(x,y)\le T.\end{cases}$$

A global $T$ works when object and background intensity distributions are well separated. Uneven illumination or spatially varying material calls for $T(x,y)$ derived from a neighborhood statistic. Smoothing the histogram and using prior knowledge can stabilize valley selection.

Otsu's method tests thresholds and maximizes between-class variance. For class probabilities $\omega_0,\omega_1$ and means $\mu_0,\mu_1$,

$$\sigma_B^2(T)=\omega_0(T)\omega_1(T)[\mu_0(T)-\mu_1(T)]^2.$$

The maximizing threshold gives the strongest normalized class separation without labeled pixels. Multiple thresholds extend the idea to several modes, at increased search cost.

Thresholds may also operate on color, gradient, or texture features. A decision surface then replaces a scalar cut. Preprocessing should correct shading only when its assumptions are valid; otherwise adaptive thresholds are safer.

Example: histogram bins $[0,1,2,7,8,9]$ form two compact groups. Any threshold between 2 and 7 yields the same perfect partition; Otsu selects one of these equivalent cuts.

---

### Summary Section

Thresholding is a classification rule on pixel features; global, adaptive, Otsu, and multilevel forms match different histogram and illumination conditions.

**Previous:** [Point, Line, and Edge Detection](02_point_line_and_edge_detection.md)  
**Next:** [Region-Based Segmentation](04_region_based_segmentation.md)
