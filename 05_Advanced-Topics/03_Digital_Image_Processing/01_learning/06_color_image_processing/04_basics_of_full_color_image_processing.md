# Cornell Notes

## Topic: Basics of Full-Color Image Processing

**Source:** Section 6.4, printed pp. 424–425 (PDF pp. 447–448).

---

### Cue Column

- What distinguishes full-color from pseudocolor processing?
- When can channels be processed independently?
- Why treat pixels as vectors?

---

### Notes Section

A full-color image contains measured color components at every pixel. Processing may transform each channel independently or operate on the color vector

$$\mathbf c(x,y)=[c_1,c_2,c_3]^T.$$

Independent processing is valid when the operation and color space do not require cross-channel consistency. Vector processing better preserves relationships for distance, edge, and segmentation tasks. Results depend on color space: Euclidean distances in RGB are not uniformly perceptual.

---

### Summary Section

Full-color methods operate on acquired component vectors; channel-wise shortcuts are safe only when component coupling is irrelevant.

**Previous:** [Pseudocolor Processing](03_pseudocolor_image_processing.md)  
**Next:** [Color Transformations](05_color_transformations.md)
