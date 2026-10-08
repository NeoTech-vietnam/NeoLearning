# Cornell Notes

## Topic: Representation

**Source:** Section 11.1, printed pp. 796–814 (PDF pp. 819–837).

---

### Cue Column

- When should a region use boundary or interior representation?
- How are chain codes made robust?
- What do skeletons preserve?

---

### Notes Section

After segmentation, a region is represented by its boundary, its pixels, or a reduced structure. Boundary forms suit shape and perimeter analysis; regional forms suit area, texture, and internal intensity.

A boundary may be encoded as an ordered coordinate list or a 4-/8-direction **chain code**. Differential chain codes subtract successive directions modulo the alphabet size, removing dependence on starting orientation; choosing a canonical cyclic shift removes dependence on starting point. Resampling to a coarser grid reduces noise sensitivity.

Polygonal approximations retain dominant vertices while controlling deviation. Signatures reduce a boundary to a 1-D function, such as centroid distance versus angle. Boundary segments can also be represented by convex hull differences.

A skeleton is a thin medial representation preserving topology and approximate shape. With structuring element $B$, one morphological form is

$$S(A)=\bigcup_{k=0}^{K}\left[(A\ominus kB)-((A\ominus kB)\circ B)\right].$$

Skeleton pruning removes short noise-induced branches, cautiously: excessive pruning changes topology.

---

### Summary Section

Representation chooses boundary, region, polygon, signature, or skeleton forms according to the measurements needed next.

**Previous:** [Use of Motion in Segmentation](../10_image_segmentation/06_use_of_motion_in_segmentation.md)  
**Next:** [Boundary Descriptors](02_boundary_descriptors.md)
