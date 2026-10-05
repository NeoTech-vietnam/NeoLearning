# Cornell Notes

## Topic: Basic Relationships between Pixels

## Date: 13/06/2026

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---
### Cue Column (Questions, Keywords, or Prompts)

- What are 4-neighbors, diagonal neighbors, and 8-neighbors?
- How do 4-adjacency, 8-adjacency, and m-adjacency differ?
- What is a connected component, a region, and a boundary?
- How are D4, D8, and Euclidean distances defined?
- Why use m-adjacency instead of only 4- or 8-adjacency?

---

### Notes Section (Main Notes)

In the larger context of **Digital Image Fundamentals (Chapter 2)**, understanding the **Basic Relationships between Pixels (Section 2.5)** is crucial because these concepts form the **foundational building blocks for subsequent image processing techniques** discussed throughout the book. This chapter aims to introduce fundamental ideas about how digital images are represented and manipulated, and the relationships between individual pixels are integral to these processes.

Here's a discussion of what the sources say about basic relationships between pixels:

*   **Pixels as the Foundation**
    *   A digital image is fundamentally a two-dimensional function where coordinates (x, y) are spatial locations and the amplitude at that point is the intensity or gray level. When x, y, and intensity values are all finite and discrete, it's a digital image, and its individual elements are called **pixels**.
    *   In discussions about pixel relationships, individual pixels are often denoted by lowercase letters, such as 'p' and 'q'.

*   **Neighbors of a Pixel (Section 2.5.1)**
    *   A pixel `p` at coordinates `(x, y)` has distinct sets of neighbors:
        *   **4-neighbors**: These are the four horizontal and vertical neighbors with coordinates `(x+1, y)`, `(x-1, y)`, `(x, y+1)`, and `(x, y-1)`. This set is denoted by $N_4(p)$. Each of these pixels is a unit distance from `p`.
        *   **Diagonal neighbors**: These are four neighbors at `(x+1, y+1)`, `(x+1, y-1)`, `(x-1, y+1)`, and `(x-1, y-1)` and are denoted by $N_D(p)$.
        *   **8-neighbors**: This set combines the 4-neighbors and the diagonal neighbors, and is denoted by $N_8(p)$.
    *   It's noted that some neighbor locations might lie outside the digital image if the pixel `p` is on the border of the image.

*   **Adjacency, Connectivity, Regions, and Boundaries (Section 2.5.2)**
    *   **Adjacency**: This concept is defined based on a set of intensity values, `V`, which determines which pixel values are considered "similar" for adjacency purposes. For binary images, `V` might be just `V = {1}` (meaning we're looking at adjacency of '1' pixels), while for gray-scale images, `V` could be a subset of the 256 possible intensity values. Three types of adjacency are defined:
        *   **4-adjacency**: Two pixels `p` and `q` (with values from `V`) are 4-adjacent if `q` is in the set of `p`'s 4-neighbors, $N_4(p)$.
        *   **8-adjacency**: Two pixels `p` and `q` (with values from `V`) are 8-adjacent if `q` is in the set of `p`'s 8-neighbors, $N_8(p)$.
        *   **m-adjacency (mixed adjacency)**: This is a more complex definition, stating `p` and `q` are m-adjacent if `q` is in $N_4(p)$, OR `q` is in $N_D(p)$ AND the set $N_4(p) \cap N_4(q)$ has no pixels whose values are from `V`.

#### Extracted source figure: adjacency ambiguity

![Two small binary pixel grids comparing 8-adjacency with m-adjacency](../../02_assets/02_digital_image_fundamentals/05_basic_relationships_between_pixels/figure_2_25_adjacency.jpg)

*Figure 2.25. Source: Gonzalez and Woods, Section 2.5, printed p. 72 (PDF p. 95). Extracted from the locally supplied textbook PDF for study reference.*

#### How the image resolves diagonal ambiguity

- Treat only pixels whose values belong to $V$ as candidate foreground pixels.
- Under **8-adjacency**, a diagonal neighbor connects immediately. This can create multiple valid paths through a small cluster.
- Under **m-adjacency**, a diagonal connection is allowed only when the two pixels have no common 4-neighbor in $V$.
- Therefore m-adjacency keeps useful diagonal connections but removes the redundant diagonal shortcut when a 4-connected route already exists.
- Trace the marked pixels one step at a time; count edges between pixels, not pixels themselves, to obtain path length.

    *   **Paths and Connectivity**:
        *   A **digital path** from pixel `p` to pixel `q` is a sequence $(p_0,p_1,\ldots,p_n)$ whose consecutive pixels are adjacent. It contains $n+1$ pixels and has length $n$ adjacency steps. If $p_0=p_n$, it is a **closed path**.
        *   **Connected**: Two pixels `p` and `q` in a subset `S` of pixels are connected if a path exists between them consisting entirely of pixels in `S`.
        *   **Connected component**: For any pixel `p` in `S`, the set of pixels connected to `p` within `S` forms a connected component. If `S` has only one connected component, it's a **connected set**.
    *   **Regions and Boundaries**:
        *   A **region** `R` of an image is defined as a connected set of pixels.
        *   Two regions $R_i$ and $R_j$ are **adjacent** if their union forms a connected set. The type of adjacency (4- or 8-adjacency) must be specified for this definition to be meaningful.
        *   The **inner boundary** of a region `R` contains points in `R` adjacent to its complement. Image-border handling and the chosen foreground/background connectivities must be explicit; inconsistent choices can create topology paradoxes.
        *   **Edges** are local intensity discontinuities; **boundaries** describe region separation. A raw inner-boundary set need not itself form one closed digital path under every adjacency convention, so contour-following algorithms define their connectivity carefully.

*   **Distance Measures (Section 2.5.3)**
    *   A **distance function (metric)** `D` between pixels `p`, `q`, and `z` must satisfy:
        *   $D(p,q)\ge0$ and $D(p,q)=0$ **if and only if** $p=q$
        *   $D(p,q)=D(q,p)$
        *   $D(p,z)\le D(p,q)+D(q,z)$
    *   **Euclidean distance ($D_e$)**: The most common distance, defined as $\sqrt{(x-s)^2 + (y-t)^2}$ for pixels `p(x, y)` and `q(s, t)`. Pixels within a certain Euclidean distance from a point form a disk.
    *   **D4 distance (city-block distance)**: Defined as $|x-s| + |y-t|$. Pixels within a certain D4 distance form a diamond shape. Pixels with a D4 distance of 1 from `(x, y)` are its **4-neighbors**.
    *   **D8 distance (chessboard distance)**: Defined as $\max(|x-s|, |y-t|)$. Pixels within a certain D8 distance form a square shape. Pixels with a D8 distance of 1 from `(x, y)` are its **8-neighbors**.
    *   The concept of m-path distance is also mentioned, where the "length" of the path depends on m-adjacency.

### Learning checkpoint

**Outcomes:** Construct neighborhoods; apply value-set-dependent adjacency; find components; compare distance metrics.

**Prerequisite:** Sets, coordinates, and [sampling notation](04_image_sampling_and_quantization.md).

Adjacency requires both pixel values to belong to the selected set $V$. Mixed adjacency admits a diagonal pair only when their shared 4-neighbors contain no value from $V$. Border pixels require bounds checks or an explicitly padded background. $D_m$ is the shortest valid m-path length and therefore depends on $V$ and surrounding pixels.

**Original distance example:** For $p=(1,2)$ and $q=(4,6)$, $D_e=5$, $D_4=7$, and $D_8=4$.

**Original m-adjacency example:** In `[[1,1],[0,1]]` with $V=\{1\}$, the two diagonal `1` pixels are not m-adjacent because a shared 4-neighbor is also `1`; a 4-path already connects them.

**Common mistakes:** Neighborhood is geometric; adjacency additionally tests values in $V$. Diagonal pixels are not always m-adjacent. Edge and boundary are not synonyms.

**Self-check:** On a $3\times3$ binary grid, count components under 4- and 8-adjacency. Why might foreground use 8-connectivity while background uses 4-connectivity?

**Activity:** Hand-label components, then implement flood fill on the same tiny grid and compare labels.

**ESP32-S3 connection:** Thresholded camera pixels can be grouped into connected components before extracting object size and position.

**Previous/next:** [Sampling and quantization](04_image_sampling_and_quantization.md) · [Mathematical tools](06_mathematical_tools.md)

---

### Summary Section (Summary of Notes)

Neighborhood and adjacency rules determine digital connectivity. Connected pixels form components and regions; boundary pixels touch the complement. Euclidean, city-block, and chessboard metrics impose different neighborhood geometries and path lengths.

**Source:** Section 2.5, printed pp. 68–72 (PDF pp. 91–95).