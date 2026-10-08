# Cornell Notes

## Topic: Regional Descriptors

**Source:** Section 11.3, printed pp. 822–841 (PDF pp. 845–864).

---

### Cue Column

- What do moments reveal about a region?
- How are translation, scale, and rotation handled?
- How do topology and texture complement geometry?

---

### Notes Section

Regional descriptors use all pixels in an object. Area, centroid, bounding box, Euler number, intensity statistics, and texture summarize complementary properties.

For binary region $f(x,y)$, raw moments are

$$m_{pq}=\sum_x\sum_y x^py^qf(x,y),\qquad
(\bar x,\bar y)=\left(\frac{m_{10}}{m_{00}},\frac{m_{01}}{m_{00}}\right).$$

Central moments

$$\mu_{pq}=\sum_x\sum_y(x-\bar x)^p(y-\bar y)^qf(x,y)$$

are translation invariant. Normalizing by a power of $\mu_{00}$ removes scale; suitable combinations of normalized moments remove rotation. Second-order moments define principal axes and elongation.

Topology ignores metric deformation. The Euler number $E=C-H$ counts connected components $C$ minus holes $H$. Texture descriptors include gray-level co-occurrence statistics, local variation, and spectral energy; their window size determines the scale represented.

Example: two regions can share area and centroid yet differ in Euler number—one solid, one containing a hole—so no single descriptor is sufficient.

---

### Summary Section

Regional description combines moment-based geometry, topology, intensity, and texture; normalized moments provide common geometric invariants.

**Previous:** [Boundary Descriptors](02_boundary_descriptors.md)  
**Next:** [Principal Components for Description](04_principal_components_for_description.md)
