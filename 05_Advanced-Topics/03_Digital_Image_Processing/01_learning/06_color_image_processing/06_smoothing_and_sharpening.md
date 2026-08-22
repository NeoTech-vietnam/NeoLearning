# Cornell Notes

## Topic: Smoothing and Sharpening

**Source:** Section 6.6, printed pp. 439–442 (PDF pp. 462–465).

---

### Cue Column

- How are spatial filters extended to color vectors?
- Why can component filtering create artifacts?
- How can intensity guide sharpening?

---

### Notes Section

Linear averaging can be applied component-wise because averaging commutes with linear color conversion. Nonlinear filters generally do not, so results depend strongly on the selected color space. Vector median methods select a neighborhood color minimizing aggregate vector distance, avoiding synthetic colors produced by separate component medians.

Sharpening may process each channel or sharpen an intensity component and recombine it with chromatic components. The latter often limits hue changes. Clipping and nonlinear display encoding must still be handled consistently.

---

### Summary Section

Color filtering must respect channel relationships; intensity-based or vector methods often preserve chromatic consistency better.

**Previous:** [Color Transformations](05_color_transformations.md)  
**Next:** [Color-Based Segmentation](07_color_based_image_segmentation.md)
