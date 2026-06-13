# Cornell Notes

## Topic: Image Sampling and Quantization

## Date: 13/06/2026

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---
### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

In the larger context of **Digital Image Fundamentals (Chapter 2)**, understanding the **Basic Relationships between Pixels (Section 2.5)** is crucial because these concepts form the **foundational building blocks for subsequent image processing techniques** discussed throughout the book. This chapter aims to introduce fundamental ideas about how digital images are represented and manipulated, and the relationships between individual pixels are integral to these processes.

Here's a discussion of what the sources say about basic relationships image processing techniques** discussed throughout the book. This chapter aims to introduce fundamental ideas about how digital images are represented and manipulated, and the relationships between individual pixels are integral to these processes.

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
    *   **Paths and Connectivity**:
        *   A **(digital) path (or curve)** from pixel `p` to pixel `q` is a sequence of distinct pixels where consecutive pixels are adjacent (e.g., 4-paths, 8-paths, or m-paths). The length of the path is `n` if there are `n` pixels in the sequence. If the start and end pixels are the same, it's a **closed path**.
        *   **Connected**: Two pixels `p` and `q` in a subset `S` of pixels are connected if a path exists between them consisting entirely of pixels in `S`.
        *   **Connected component**: For any pixel `p` in `S`, the set of pixels connected to `p` within `S` forms a connected component. If `S` has only one connected component, it's a **connected set**.
    *   **Regions and Boundaries**:
        *   A **region** `R` of an image is defined as a connected set of pixels.
        *   Two regions $R_i$ and $R_j$ are **adjacent** if their union forms a connected set. The type of adjacency (4- or 8-adjacency) must be specified for this definition to be meaningful.
        *   The **boundary (border or contour)** of a region `R` is the set of points in `R` that are adjacent to points in the complement of `R` (i.e., pixels in `R` with at least one background neighbor). Adjacency between points in a region and its background is typically defined using **8-connectivity**.
        *   A distinction is made between **edges** and **boundaries**: Boundaries are a "global" concept forming a closed path, while edges are "local" concepts based on intensity-level discontinuities at a point. Edges can be linked to form boundaries, especially in binary images where they often correspond.

*   **Distance Measures (Section 2.5.3)**
    *   A **distance function (metric)** `D` between pixels `p`, `q`, and `z` must satisfy three properties:
        *   `D(p, q) ≥ 0` (`D(p, q) = 0` if `p = q`)
        *   `D(p, q) = D(q, p)`
        *   `D(p, z) ≤ D(p, q) + D(q, z)`
    *   **Euclidean distance ($D_e$)**: The most common distance, defined as $\sqrt{(x-s)^2 + (y-t)^2}$ for pixels `p(x, y)` and `q(s, t)`. Pixels within a certain Euclidean distance from a point form a disk.
    *   **D4 distance (city-block distance)**: Defined as $|x-s| + |y-t|$. Pixels within a certain D4 distance form a diamond shape. Pixels with a D4 distance of 1 from `(x, y)` are its **4-neighbors**.
    *   **D8 distance (chessboard distance)**: Defined as $\max(|x-s|, |y-t|)$. Pixels within a certain D8 distance form a square shape. Pixels with a D8 distance of 1 from `(x, y)` are its **8-neighbors**.
    *   The concept of m-path distance is also mentioned, where the "length" of the path depends on m-adjacency.

These fundamental concepts regarding pixel relationships are the "basic building blocks for processing techniques based on pixel neighborhoods". They are extensively applied in various image processing tasks, including image enhancement and restoration (Chapters 3 and 5), image morphology (Chapter 9), and image segmentation (Chapter 10).

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]