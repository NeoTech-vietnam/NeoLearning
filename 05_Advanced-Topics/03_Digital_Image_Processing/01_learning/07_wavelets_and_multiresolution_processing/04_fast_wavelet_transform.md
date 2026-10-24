# Cornell Notes

## Topic: Fast Wavelet Transform

**Source:** Section 7.4, printed pp. 493–500 (PDF pp. 516–523).

---

### Cue Column

- How does a filter bank compute the DWT?
- Why downsample after filtering?
- What guarantees perfect reconstruction?

---

### Notes Section

The fast wavelet transform implements analysis as a two-channel filter bank. A low-pass filter produces approximation coefficients; a high-pass filter produces detail coefficients. Downsampling by two removes the redundancy introduced by the two outputs:

$$a_{j-1}[k]=\sum_n h[n-2k]a_j[n],\qquad
 d_{j-1}[k]=\sum_n g[n-2k]a_j[n].$$

Further levels decompose only the approximation. Synthesis upsamples each branch, applies synthesis filters, then adds the results. Perfect-reconstruction filter relations cancel alias terms and recover delayed or scaled input exactly.

```mermaid
flowchart LR
  X[x[n]] --> L[Low-pass]
  X --> H[High-pass]
  L --> A[Downsample: approximation]
  H --> D[Downsample: detail]
  A --> R[Repeat on approximation]
```

Boundary extension matters: periodic, zero, or symmetric extension changes edge coefficients. Symmetric extension often limits artificial edge discontinuities.

---

### Summary Section

The FWT uses paired filters and factor-two sampling for linear-time multiscale analysis; matched synthesis filters provide exact reconstruction.

**Previous:** [One-Dimensional Wavelet Transforms](03_one_dimensional_wavelet_transforms.md)  
**Next:** [Two-Dimensional Wavelet Transforms](05_two_dimensional_wavelet_transforms.md)
