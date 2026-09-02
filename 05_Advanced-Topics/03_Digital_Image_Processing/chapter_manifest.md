# Digital Image Processing — Chapter Manifest

Source: Rafael C. Gonzalez and Richard E. Woods, *Digital Image Processing*, 3rd ed., 2008.

> Printed page 1 is PDF page 24. Source references below use printed page numbers.

## Coverage

| Chapter | Topic | Printed pages | Notes directory | Outline | Learning enrichment | Hardware lab |
|---:|---|---:|---|---|---|---|
| 1 | Introduction | 1–31 | `01_learning/01_introduction/` | Complete | Complete | Implemented; physical verification pending |
| 2 | Digital Image Fundamentals | 35–98 | `01_learning/02_digital_image_fundamentals/` | Complete | Complete | Implemented subset; physical verification pending |
| 3 | Intensity Transformations and Spatial Filtering | 104–192 | `01_learning/03_intensity_transformations_and_spatial_filtering/` | Complete | Complete | Not implemented; add only with a validated ESP32-S3 use case |
| 4 | Filtering in the Frequency Domain | 199–303 | `01_learning/04_filtering_in_the_frequency_domain/` | Complete | Not started | Planned |
| 5 | Image Restoration and Reconstruction | 311–387 | `01_learning/05_image_restoration_and_reconstruction/` | Complete | Not started | Planned |
| 6 | Color Image Processing | 394–455 | `01_learning/06_color_image_processing/` | Complete | Not started | Planned |
| 7 | Wavelets and Multiresolution Processing | 461–520 | `01_learning/07_wavelets_and_multiresolution_processing/` | Complete | Not started | Planned |
| 8 | Image Compression | 525–621 | `01_learning/08_image_compression/` | Complete | Not started | Planned |
| 9 | Morphological Image Processing | 627–679 | `01_learning/09_morphological_image_processing/` | Complete | Not started | Planned |
| 10 | Image Segmentation | 689–785 | `01_learning/10_image_segmentation/` | Complete | Not started | Planned |
| 11 | Representation and Description | 795–856 | `01_learning/11_representation_and_description/` | Complete | Not started | Planned |
| 12 | Object Recognition | 861–906 | `01_learning/12_object_recognition/` | Complete | Not started | Planned |

- **Outline complete:** every textbook section has a concise note and source range.
- **Learning enrichment:** intuition, symbols, worked examples, visuals, mistakes, self-checks, and practice are present where useful.
- **Hardware lab:** firmware exists separately from evidence collected on a physical board.

## Section map

### 1. Introduction

1.1 What Is Digital Image Processing? (p. 1)  
1.2 The Origins of Digital Image Processing (p. 3)  
1.3 Examples of Fields that Use Digital Image Processing (p. 7)  
1.4 Fundamental Steps in Digital Image Processing (p. 25)  
1.5 Components of an Image Processing System (p. 28)

### 2. Digital Image Fundamentals

2.1 Elements of Visual Perception (p. 36)  
2.2 Light and the Electromagnetic Spectrum (p. 43)  
2.3 Image Sensing and Acquisition (p. 46)  
2.4 Image Sampling and Quantization (p. 52)  
2.5 Some Basic Relationships between Pixels (p. 68)  
2.6 Mathematical Tools Used in Digital Image Processing (p. 72)

### 3. Intensity Transformations and Spatial Filtering

3.1 Background (p. 105)  
3.2 Basic Intensity Transformation Functions (p. 107)  
3.3 Histogram Processing (p. 120)  
3.4 Fundamentals of Spatial Filtering (p. 144)  
3.5 Smoothing Spatial Filters (p. 152)  
3.6 Sharpening Spatial Filters (p. 157)  
3.7 Combining Spatial Enhancement Methods (p. 169)  
3.8 Fuzzy Techniques for Intensity Transformations and Spatial Filtering (p. 173)

### 4. Filtering in the Frequency Domain

4.1 Background (p. 200)  
4.2 Preliminary Concepts (p. 202)  
4.3 Sampling and the Fourier Transform of Sampled Functions (p. 211)  
4.4 One-Dimensional Discrete Fourier Transform (p. 220)  
4.5 Extension to Functions of Two Variables (p. 225)  
4.6 Properties of the Two-Dimensional DFT (p. 236)  
4.7 Basics of Frequency-Domain Filtering (p. 255)  
4.8 Frequency-Domain Image Smoothing (p. 269)  
4.9 Frequency-Domain Image Sharpening (p. 280)  
4.10 Selective Filtering (p. 294)  
4.11 Implementation (p. 298)

### 5. Image Restoration and Reconstruction

5.1 Degradation/Restoration Model (p. 312)  
5.2 Noise Models (p. 313)  
5.3 Spatial Filtering in the Presence of Noise Only (p. 322)  
5.4 Periodic Noise Reduction by Frequency-Domain Filtering (p. 335)  
5.5 Linear, Position-Invariant Degradations (p. 343)  
5.6 Estimating the Degradation Function (p. 346)  
5.7 Inverse Filtering (p. 351)  
5.8 Wiener Filtering (p. 352)  
5.9 Constrained Least Squares Filtering (p. 357)  
5.10 Geometric Mean Filter (p. 361)  
5.11 Image Reconstruction from Projections (p. 362)

### 6. Color Image Processing

6.1 Color Fundamentals (p. 395)  
6.2 Color Models (p. 401)  
6.3 Pseudocolor Image Processing (p. 414)  
6.4 Basics of Full-Color Image Processing (p. 424)  
6.5 Color Transformations (p. 426)  
6.6 Smoothing and Sharpening (p. 439)  
6.7 Color-Based Image Segmentation (p. 443)  
6.8 Noise in Color Images (p. 451)  
6.9 Color Image Compression (p. 454)

### 7. Wavelets and Multiresolution Processing

7.1 Background (p. 462)  
7.2 Multiresolution Expansions (p. 477)  
7.3 One-Dimensional Wavelet Transforms (p. 486)  
7.4 Fast Wavelet Transform (p. 493)  
7.5 Two-Dimensional Wavelet Transforms (p. 501)  
7.6 Wavelet Packets (p. 510)

### 8. Image Compression

8.1 Fundamentals (p. 526)  
8.2 Basic Compression Methods (p. 542)  
8.3 Digital Image Watermarking (p. 614)

### 9. Morphological Image Processing

9.1 Preliminaries (p. 628)  
9.2 Erosion and Dilation (p. 630)  
9.3 Opening and Closing (p. 635)  
9.4 Hit-or-Miss Transformation (p. 640)  
9.5 Basic Morphological Algorithms (p. 642)  
9.6 Gray-Scale Morphology (p. 665)

### 10. Image Segmentation

10.1 Fundamentals (p. 690)  
10.2 Point, Line, and Edge Detection (p. 692)  
10.3 Thresholding (p. 738)  
10.4 Region-Based Segmentation (p. 763)  
10.5 Segmentation Using Morphological Watersheds (p. 769)  
10.6 Use of Motion in Segmentation (p. 778)

### 11. Representation and Description

11.1 Representation (p. 796)  
11.2 Boundary Descriptors (p. 815)  
11.3 Regional Descriptors (p. 822)  
11.4 Principal Components for Description (p. 842)  
11.5 Relational Descriptors (p. 852)

### 12. Object Recognition

12.1 Patterns and Pattern Classes (p. 861)  
12.2 Recognition Based on Decision-Theoretic Methods (p. 866)  
12.3 Structural Methods (p. 903)

## Note contract

Every note must remain an original study aid, not a replacement copy of the textbook. Include only sections that improve learning:

1. Topic, learning outcomes, prerequisites, and exact printed/PDF source range.
2. Cue questions and intuition before formal equations.
3. Key terms plus symbol, unit, assumption, and valid-range explanations.
4. One original numerical example or Mermaid flow for substantial concepts.
5. A useful visual when words alone are insufficient.
6. Common mistakes, a short self-check, and one practical activity.
7. Summary, ESP32-S3 connection where applicable, and adjacent-note links.

Selective source figures require descriptive alt text, figure number, printed page, and PDF page attribution. Prefer native extraction; use a page crop only when vector content requires it. Do not reproduce decorative, redundant, or unnecessary material. Printed page 1 is PDF page 24, so add 23 to convert a printed page to its PDF page.

## Chapter 1–3 enrichment checklist

| Chapter | Outcomes | Intuition before math | Worked examples | Useful visuals | Self-checks | ESP32 lab links |
|---:|---|---|---|---|---|---|
| 1 | Complete | Complete | Complete | Complete | Complete | Complete |
| 2 | Complete | Complete | Complete | Complete | Complete | Complete |
| 3 | Complete | Complete | Complete | Complete | Complete | Not applicable |

Every Chapter 1–3 note was reviewed against its textbook section and the note contract. Chapter 3 uses selective source figures only where comparisons materially aid learning. Hardware status remains separate; successful compilation does not claim physical-board verification.
