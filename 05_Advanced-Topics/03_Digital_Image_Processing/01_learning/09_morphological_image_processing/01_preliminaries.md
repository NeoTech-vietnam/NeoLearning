# Cornell Notes

## Topic: Preliminaries

**Source:** Section 9.1, printed pp. 628–629 (PDF pp. 651–652).

---

### Cue Column

- Why model binary images as sets?
- What roles do translation and reflection play?
- What is a structuring element?

---

### Notes Section

Binary morphology treats foreground pixels as a set $A\subset\mathbb Z^2$. A small set $B$, the structuring element, acts as a shape probe with a declared origin.

Translation and reflection are

$$B_z=\{b+z\mid b\in B\},\qquad
\hat B=\{-b\mid b\in B\}.$$

Set complement, union, intersection, and difference describe foreground relationships. The structuring element encodes the neighborhood and directional bias: a disk treats directions similarly, while a line probes features aligned with it. Results therefore depend on foreground convention, origin, size, and border handling—not merely the operator name.

---

### Summary Section

Mathematical morphology analyzes image shape through set operations driven by a translated, reflected structuring element.

**Previous:** [Digital Image Watermarking](../08_image_compression/03_digital_image_watermarking.md)  
**Next:** [Erosion and Dilation](02_erosion_and_dilation.md)
