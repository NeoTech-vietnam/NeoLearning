# Cornell Notes

## Topic: Opening and Closing

**Source:** Section 9.3, printed pp. 635–639 (PDF pp. 658–662).

---

### Cue Column

- Why combine erosion and dilation?
- Which defects do opening and closing suppress?
- What does idempotence imply?

---

### Notes Section

Opening erodes then dilates with the same structuring element:

$$A\circ B=(A\ominus B)\oplus B.$$

It removes protrusions and foreground components that cannot contain $B$, smooths convex boundary irregularities, and breaks narrow bridges. Closing reverses the order:

$$A\bullet B=(A\oplus B)\ominus B.$$

It fills small background holes, closes narrow gaps, joins nearby foreground regions, and smooths concave irregularities. Opening is anti-extensive $(A\circ B\subseteq A)$; closing is extensive $(A\subseteq A\bullet B)$. Both are increasing and idempotent:

$$(A\circ B)\circ B=A\circ B,
\qquad (A\bullet B)\bullet B=A\bullet B.$$

Repeated application with unchanged $B$ therefore adds no effect after the first pass.

---

### Summary Section

Opening suppresses small foreground structure; closing suppresses small background structure. Probe geometry defines what counts as small.

**Previous:** [Erosion and Dilation](02_erosion_and_dilation.md)  
**Next:** [Hit-or-Miss Transformation](04_hit_or_miss_transformation.md)
