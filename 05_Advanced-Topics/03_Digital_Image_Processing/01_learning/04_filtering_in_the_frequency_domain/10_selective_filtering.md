# Cornell Notes

## Topic: Selective Filtering

**Source:** Section 4.10, printed pp. 294–297 (PDF pp. 317–320).

---

### Cue Column

- What do bandreject and bandpass filters isolate?
- How do notch filters remove periodic interference?
- Why do notches occur in symmetric pairs?

---

### Notes Section

Bandreject filters suppress an annulus of frequencies; bandpass filters use its complement. Notch reject filters target compact neighborhoods around known interference peaks. For real images, conjugate symmetry means a disturbance at $(u_k,v_k)$ normally has a partner at $(-u_k,-v_k)$, so both must be rejected.

Narrow notches preserve more image content but demand accurate peak localization. Smooth Butterworth or Gaussian notches reduce ringing compared with hard masks. Notch pass filters are useful diagnostically: reconstructing only rejected components reveals what the filter would remove.

---

### Summary Section

Selective filters remove or inspect bounded frequency regions; paired smooth notches are effective against periodic noise.

**Previous:** [Frequency-Domain Image Sharpening](09_frequency_domain_image_sharpening.md)  
**Next:** [Implementation](11_implementation.md)
