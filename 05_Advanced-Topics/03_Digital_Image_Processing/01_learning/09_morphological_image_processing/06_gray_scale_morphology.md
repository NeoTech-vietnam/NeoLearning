# Cornell Notes

## Topic: Gray-Scale Morphology

**Source:** Section 9.6, printed pp. 665–679 (PDF pp. 688–702).

---

### Cue Column

- How do binary operators extend to intensity images?
- What changes with flat versus nonflat structuring elements?
- Which features do top-hat transforms isolate?

---

### Notes Section

Gray-scale morphology replaces set containment and overlap with neighborhood extrema. For image $f$ and nonflat structuring function $b$:

$$(f\ominus b)(x,y)=\min_{(s,t)\in D_b}[f(x+s,y+t)-b(s,t)],$$
$$(f\oplus b)(x,y)=\max_{(s,t)\in D_b}[f(x-s,y-t)+b(s,t)].$$

A flat element has $b=0$ on its support, so erosion is a local minimum and dilation a local maximum. Gray-scale opening and closing use the same compositions as binary morphology. Opening suppresses bright structures smaller than the probe; closing suppresses small dark structures.

The white and black top-hat transforms isolate those residuals:

$$T_w=f-(f\circ b),\qquad T_b=(f\bullet b)-f.$$

The morphological gradient $(f\oplus b)-(f\ominus b)$ emphasizes local transitions. Example: a disk wider than tiny bright spots estimates their background through opening; subtracting that opening leaves the spots while reducing slow illumination variation.

---

### Summary Section

Gray-scale morphology uses local extrema shaped by a structuring function. Openings, closings, gradients, and top-hats extract intensity features by size and polarity.

**Previous:** [Basic Morphological Algorithms](05_basic_morphological_algorithms.md)  
**Next:** [Segmentation Fundamentals](../10_image_segmentation/01_fundamentals.md)
