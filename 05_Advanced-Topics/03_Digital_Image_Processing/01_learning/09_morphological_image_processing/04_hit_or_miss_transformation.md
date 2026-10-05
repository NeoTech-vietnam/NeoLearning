# Cornell Notes

## Topic: Hit-or-Miss Transformation

**Source:** Section 9.4, printed pp. 640–641 (PDF pp. 663–664).

---

### Cue Column

- How can morphology locate a specific binary pattern?
- Why must both foreground and background match?
- How are rotations handled?

---

### Notes Section

The hit-or-miss transform detects locations where a foreground template and a background template match simultaneously. For disjoint structuring elements $B_1$ and $B_2$:

$$A\circledast(B_1,B_2)
=(A\ominus B_1)\cap(A^c\ominus B_2).$$

The first erosion requires selected foreground pixels; the second requires selected background pixels. Unspecified positions are don't-care locations. This makes the operation stricter than erosion alone and suitable for detecting endpoints, corners, or exact local configurations.

To detect a pattern regardless of orientation, transform with each rotated template and union the results. Template conventions must remain consistent: confusing foreground, background, and don't-care cells changes the detector.

---

### Summary Section

Hit-or-miss performs exact local shape detection by intersecting foreground and background fits; rotated templates provide orientation coverage.

**Previous:** [Opening and Closing](03_opening_and_closing.md)  
**Next:** [Basic Morphological Algorithms](05_basic_morphological_algorithms.md)
