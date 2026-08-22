# Cornell Notes

## Topic: Use of Motion in Segmentation

**Source:** Section 10.6, printed pp. 778–785 (PDF pp. 801–808).

---

### Cue Column

- How does temporal differencing expose motion?
- What assumptions support optical flow?
- Why are motion masks postprocessed?

---

### Notes Section

Motion provides evidence unavailable in one frame. Frame differencing marks changed pixels,

$$D_t(x,y)=|f_t(x,y)-f_{t-1}(x,y)|,
\qquad M_t(x,y)=\mathbf{1}[D_t(x,y)>T].$$

It is cheap but misses unchanged interiors, reacts to sensor noise and illumination shifts, and produces double boundaries for moving objects. Background modeling compares each frame with an estimated stationary scene; slow updates accommodate gradual changes but risk absorbing stopped objects.

Optical flow estimates apparent velocity $(u,v)$ under brightness constancy. Linearization gives the aperture-constrained equation

$$f_xu+f_yv+f_t=0.$$

One equation cannot determine two components, so neighborhood coherence or regularization supplies extra constraints. Occlusion and nonrigid appearance changes violate the model.

Morphological opening removes isolated detections; closing and hole filling recover coherent silhouettes. Temporal confirmation rejects one-frame events.

```mermaid
flowchart LR
    F[Frame sequence] --> D[Difference or flow]
    D --> T[Motion likelihood]
    T --> P[Morphology + temporal check]
    P --> O[Moving regions]
```

---

### Summary Section

Temporal change, background models, and optical flow segment moving content; spatial and temporal cleanup convert fragile pixel evidence into objects.

**Previous:** [Segmentation Using Morphological Watersheds](05_segmentation_using_morphological_watersheds.md)  
**Next:** [Representation](../11_representation_and_description/01_representation.md)
