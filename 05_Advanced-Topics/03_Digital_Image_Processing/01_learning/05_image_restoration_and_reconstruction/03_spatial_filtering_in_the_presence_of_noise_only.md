# Cornell Notes

## Topic: Spatial Filtering in the Presence of Noise Only

**Source:** Section 5.3, printed pp. 322–334 (PDF pp. 345–357).

---

### Cue Column

- Which mean filters suit different noise types?
- Why are order-statistic filters robust?
- How do adaptive filters preserve detail?

---

### Notes Section

Arithmetic averaging reduces independent zero-mean noise but blurs edges. Geometric, harmonic, and contraharmonic means target different skewed noise distributions. The contraharmonic mean

$$\hat f=\frac{\sum_{S}g^{Q+1}}{\sum_{S}g^Q}$$

removes pepper noise for $Q>0$ and salt noise for $Q<0$, but not both simultaneously.

Median filtering is robust to impulses; max and min filters target pepper and salt respectively. Alpha-trimmed means bridge averaging and median behavior. Adaptive local filters use estimated local variance; adaptive median filters enlarge their window only when needed, preserving uncorrupted detail.

---

### Summary Section

Match filter statistics to noise: means for distributed noise, order statistics for impulses, adaptive methods for spatially varying corruption.

**Previous:** [Noise Models](02_noise_models.md)  
**Next:** [Periodic Noise Reduction](04_periodic_noise_reduction_by_frequency_domain_filtering.md)
