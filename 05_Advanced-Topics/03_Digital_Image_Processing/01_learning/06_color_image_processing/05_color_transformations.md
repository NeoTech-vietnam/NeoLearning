# Cornell Notes

## Topic: Color Transformations

**Source:** Section 6.5, printed pp. 426–438 (PDF pp. 449–461).

---

### Cue Column

- How are color points transformed?
- How can intensity and color balance be adjusted separately?
- What is color slicing?

---

### Notes Section

A color transformation maps an input vector to an output vector: $\mathbf s=\mathbf T(\mathbf r)$. Component transforms include model conversion, tone correction, and complement formation. In an intensity-separated space, modifying intensity while retaining hue and saturation reduces unintended color shifts.

Color slicing highlights points near a target $\mathbf a$. A spherical rule uses

$$\|\mathbf r-\mathbf a\|\le D_0,$$

while box rules bound each component independently. White balance applies channel gains to make a known neutral object neutral; gains should be estimated in a linear-light domain when possible.

---

### Summary Section

Color transforms modify vectors, enabling model conversion, tonal correction, balancing, and target-color emphasis.

**Previous:** [Full-Color Basics](04_basics_of_full_color_image_processing.md)  
**Next:** [Smoothing and Sharpening](06_smoothing_and_sharpening.md)
