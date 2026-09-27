# Cornell Notes

## Topic: Erosion and Dilation

**Source:** Section 9.2, printed pp. 630–634 (PDF pp. 653–657).

---

### Cue Column

- What geometric tests define erosion and dilation?
- How do the operations affect object size?
- How are they related by duality?

---

### Notes Section

Erosion keeps positions where the translated structuring element fits entirely inside the foreground:

$$A\ominus B=\{z\mid B_z\subseteq A\}.$$

It shrinks boundaries, removes objects smaller than $B$, and can break narrow connections. Dilation keeps positions where the reflected translated probe intersects the foreground:

$$A\oplus B=\{z\mid (\hat B)_z\cap A\ne\varnothing\}.$$

It expands boundaries, fills small gaps, and joins nearby components. With compatible reflection, the operations are dual:

$$(A\ominus B)^c=A^c\oplus\hat B.$$

Example: eroding a one-pixel-wide line with a $3\times3$ square removes it because the square fits nowhere; dilation thickens that line by one pixel in every square-neighborhood direction.

---

### Summary Section

Erosion requires complete probe containment; dilation requires any overlap. Their effects are shape- and scale-dependent, with complement duality connecting them.

**Previous:** [Preliminaries](01_preliminaries.md)  
**Next:** [Opening and Closing](03_opening_and_closing.md)
