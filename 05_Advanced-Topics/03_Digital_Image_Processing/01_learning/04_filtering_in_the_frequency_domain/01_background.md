# Cornell Notes

## Topic: Background

**Source:** Section 4.1, printed pp. 200–201 (PDF pp. 223–224).

---

### Cue Column

- Why represent images by spatial frequencies?
- What connects spatial and frequency-domain filtering?
- Which frequencies describe smooth regions and edges?

---

### Notes Section

Fourier analysis represents an image as a weighted collection of complex sinusoids. Slowly varying image content concentrates near low frequencies; abrupt transitions and fine detail require higher frequencies.

Frequency-domain filtering follows three steps: transform the image, modify transform coefficients, then invert the transform. It is not a separate kind of image information: the Fourier transform is an invertible change of representation.

For image $f(x,y)$, a linear shift-invariant spatial convolution has the frequency-domain form

$$g(x,y)=h(x,y)*f(x,y)\quad\Longleftrightarrow\quad G(u,v)=H(u,v)F(u,v).$$

Thus a large spatial kernel may be applied efficiently by pointwise multiplication after transformation. Frequency plots also expose periodic structure and make passband design intuitive.

---

### Summary Section

The Fourier domain reorganizes image information by rate of spatial change. Convolution becomes multiplication, enabling both analysis and efficient filtering.

**Previous:** [Fuzzy Techniques](../03_intensity_transformations_and_spatial_filtering/08_fuzzy_techniques.md)  
**Next:** [Preliminary Concepts](02_preliminary_concepts.md)
