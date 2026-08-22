# Cornell Notes

## Topic: Color Models

**Source:** Section 6.2, printed pp. 401–413 (PDF pp. 424–436).

---

### Cue Column

- When are RGB, CMY/CMYK, HSI, and device-independent spaces useful?
- How do additive and subtractive models differ?
- Why separate luminance from chrominance?

---

### Notes Section

RGB is additive and natural for cameras and displays. CMY is subtractive for pigments; ideally

$$\begin{bmatrix}C\\M\\Y\end{bmatrix}=
\begin{bmatrix}1\\1\\1\end{bmatrix}-
\begin{bmatrix}R\\G\\B\end{bmatrix},$$

with black ink added in CMYK for practical printing. HSI expresses hue, saturation, and intensity, making intensity operations less likely to alter color. YCbCr-like models separate luminance from color differences, supporting video processing and chroma subsampling. CIE XYZ provides a device-independent reference.

No model is universally best: select one aligned with acquisition, display, perception, or algorithmic needs.

---

### Summary Section

Color spaces reorganize the same information for devices or tasks; conversion does not create new color content.

**Previous:** [Color Fundamentals](01_color_fundamentals.md)  
**Next:** [Pseudocolor Processing](03_pseudocolor_image_processing.md)
