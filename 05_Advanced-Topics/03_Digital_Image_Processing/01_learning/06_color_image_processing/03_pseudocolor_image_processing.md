# Cornell Notes

## Topic: Pseudocolor Image Processing

**Source:** Section 6.3, printed pp. 414–423 (PDF pp. 437–446).

---

### Cue Column

- Why assign color to grayscale data?
- How does intensity slicing work?
- What makes a useful color map?

---

### Notes Section

Pseudocolor maps one intensity to a display color to reveal distinctions difficult to see in gray. Intensity slicing assigns discrete colors to intervals. Continuous mapping uses three transfer functions:

$$R=T_R(z),\qquad G=T_G(z),\qquad B=T_B(z).$$

A good map preserves ordering when ordering matters, highlights task-relevant thresholds, and remains interpretable. Highly oscillatory rainbow maps can create false boundaries and unequal perceptual steps. Pseudocolor aids interpretation but must not be mistaken for measured spectral color.

---

### Summary Section

Pseudocolor encodes scalar intensity using designed colors; map semantics and perceptual uniformity determine usefulness.

**Previous:** [Color Models](02_color_models.md)  
**Next:** [Basics of Full-Color Processing](04_basics_of_full_color_image_processing.md)
