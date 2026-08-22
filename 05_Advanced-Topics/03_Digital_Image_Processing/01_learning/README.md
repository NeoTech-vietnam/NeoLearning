# Digital Image Processing — Learning Index

Source: Rafael C. Gonzalez and Richard E. Woods, *Digital Image Processing*, 3rd ed., 2008. Printed page 1 is PDF page 24; therefore **PDF page = printed page + 23**. Ranges below use printed pages.

Use this index for sequential study or direct lookup. Each note condenses one book section into cues, explanations, equations/examples where useful, and a summary.

## Chapter 1 — Introduction

| Section | Source | Use |
|---|---:|---|
| [1.1 What Is Digital Image Processing?](01_introduction/01_what_is_digital_image_processing.md) | pp. 1–3 | Define DIP scope, image levels, and processing categories. |
| [1.2 Origins of Digital Image Processing](01_introduction/02_origins_of_digital_image_processing.md) | pp. 3–7 | Place core advances in historical context. |
| [1.3 Fields Using Digital Image Processing](01_introduction/03_fields_using_digital_image_processing.md) | pp. 7–25 | Match imaging sources to major applications. |
| [1.4 Fundamental Steps in Digital Image Processing](01_introduction/04_fundamental_steps_in_digital_image_processing.md) | pp. 25–28 | Understand the end-to-end DIP pipeline. |
| [1.5 Components of an Image Processing System](01_introduction/05_components_of_an_image_processing_system.md) | pp. 28–31 | Identify system hardware, software, storage, and display roles. |

## Chapter 2 — Digital Image Fundamentals

| Section | Source | Use |
|---|---:|---|
| [2.1 Elements of Visual Perception](02_digital_image_fundamentals/01_elements_of_visual_perception.md) | pp. 36–43 | Relate eye physiology and perception to image design. |
| [2.2 Light and the Electromagnetic Spectrum](02_digital_image_fundamentals/02_light_and_the_electromagnetic_spectrum.md) | pp. 43–46 | Connect wavelength, energy, and imaging bands. |
| [2.3 Image Sensing and Acquisition](02_digital_image_fundamentals/03_image_sensing_and_acquisition.md) | pp. 46–52 | Trace scene energy through sensors into an image. |
| [2.4 Image Sampling and Quantization](02_digital_image_fundamentals/04_image_sampling_and_quantization.md) | pp. 52–68 | Choose spatial resolution and intensity depth. |
| [2.5 Basic Relationships between Pixels](02_digital_image_fundamentals/05_basic_relationships_between_pixels.md) | pp. 68–72 | Apply neighborhoods, adjacency, connectivity, and distance. |
| [2.6 Mathematical Tools](02_digital_image_fundamentals/06_mathematical_tools.md) | pp. 72–98 | Review operators used throughout later chapters. |

## Chapter 3 — Intensity Transformations and Spatial Filtering

| Section | Source | Use |
|---|---:|---|
| [3.1 Background](03_intensity_transformations_and_spatial_filtering/01_background.md) | pp. 105–107 | Distinguish point and neighborhood enhancement. |
| [3.2 Basic Intensity Transformation Functions](03_intensity_transformations_and_spatial_filtering/02_basic_intensity_transformation_functions.md) | pp. 107–120 | Select contrast, logarithmic, and power-law mappings. |
| [3.3 Histogram Processing](03_intensity_transformations_and_spatial_filtering/03_histogram_processing.md) | pp. 120–144 | Equalize, specify, and locally adapt contrast. |
| [3.4 Fundamentals of Spatial Filtering](03_intensity_transformations_and_spatial_filtering/04_fundamentals_of_spatial_filtering.md) | pp. 144–152 | Build and apply spatial kernels correctly. |
| [3.5 Smoothing Spatial Filters](03_intensity_transformations_and_spatial_filtering/05_smoothing_spatial_filters.md) | pp. 152–157 | Reduce noise using linear or order-statistic filters. |
| [3.6 Sharpening Spatial Filters](03_intensity_transformations_and_spatial_filtering/06_sharpening_spatial_filters.md) | pp. 157–169 | Enhance detail with derivatives and unsharp masking. |
| [3.7 Combining Spatial Enhancement Methods](03_intensity_transformations_and_spatial_filtering/07_combining_spatial_enhancement_methods.md) | pp. 169–173 | Compose complementary enhancement stages. |
| [3.8 Fuzzy Techniques](03_intensity_transformations_and_spatial_filtering/08_fuzzy_techniques.md) | pp. 173–192 | Model gradual intensity classes and fuzzy rules. |

## Chapter 4 — Filtering in the Frequency Domain

| Section | Source | Use |
|---|---:|---|
| [4.1 Background](04_filtering_in_the_frequency_domain/01_background.md) | pp. 200–201 | Motivate frequency-domain representation. |
| [4.2 Preliminary Concepts](04_filtering_in_the_frequency_domain/02_preliminary_concepts.md) | pp. 202–210 | Review complex numbers, impulses, and convolution. |
| [4.3 Sampling and the Fourier Transform of Sampled Functions](04_filtering_in_the_frequency_domain/03_sampling_and_the_fourier_transform_of_sampled_functions.md) | pp. 211–219 | Explain sampling replicas and aliasing. |
| [4.4 One-Dimensional Discrete Fourier Transform](04_filtering_in_the_frequency_domain/04_one_dimensional_discrete_fourier_transform.md) | pp. 220–224 | Compute and interpret the 1-D DFT. |
| [4.5 Extension to Functions of Two Variables](04_filtering_in_the_frequency_domain/05_extension_to_functions_of_two_variables.md) | pp. 225–235 | Extend Fourier analysis to images. |
| [4.6 Properties of the Two-Dimensional DFT](04_filtering_in_the_frequency_domain/06_properties_of_the_two_dimensional_dft.md) | pp. 236–254 | Use symmetry, periodicity, translation, and convolution properties. |
| [4.7 Basics of Frequency-Domain Filtering](04_filtering_in_the_frequency_domain/07_basics_of_frequency_domain_filtering.md) | pp. 255–268 | Implement the standard frequency-filtering pipeline. |
| [4.8 Frequency-Domain Image Smoothing](04_filtering_in_the_frequency_domain/08_frequency_domain_image_smoothing.md) | pp. 269–279 | Compare ideal, Butterworth, and Gaussian low-pass filters. |
| [4.9 Frequency-Domain Image Sharpening](04_filtering_in_the_frequency_domain/09_frequency_domain_image_sharpening.md) | pp. 280–293 | Apply high-pass, Laplacian, and high-frequency emphasis. |
| [4.10 Selective Filtering](04_filtering_in_the_frequency_domain/10_selective_filtering.md) | pp. 294–297 | Isolate directional or narrow frequency components. |
| [4.11 Implementation](04_filtering_in_the_frequency_domain/11_implementation.md) | pp. 298–303 | Avoid FFT padding, centering, scaling, and cropping errors. |

## Chapter 5 — Image Restoration and Reconstruction

| Section | Source | Use |
|---|---:|---|
| [5.1 Degradation/Restoration Model](05_image_restoration_and_reconstruction/01_degradation_restoration_model.md) | p. 312 | Frame restoration as degradation plus noise inversion. |
| [5.2 Noise Models](05_image_restoration_and_reconstruction/02_noise_models.md) | pp. 313–321 | Identify common spatial noise distributions. |
| [5.3 Spatial Filtering with Noise Only](05_image_restoration_and_reconstruction/03_spatial_filtering_in_the_presence_of_noise_only.md) | pp. 322–334 | Match mean, order-statistic, and adaptive filters to noise. |
| [5.4 Periodic Noise Reduction](05_image_restoration_and_reconstruction/04_periodic_noise_reduction_by_frequency_domain_filtering.md) | pp. 335–342 | Remove periodic interference with notch filtering. |
| [5.5 Linear, Position-Invariant Degradations](05_image_restoration_and_reconstruction/05_linear_position_invariant_degradations.md) | pp. 343–345 | Express blur through convolution and transfer functions. |
| [5.6 Estimating the Degradation Function](05_image_restoration_and_reconstruction/06_estimating_the_degradation_function.md) | pp. 346–350 | Estimate blur from observations, experiments, or models. |
| [5.7 Inverse Filtering](05_image_restoration_and_reconstruction/07_inverse_filtering.md) | p. 351 | Understand direct inversion and its instability. |
| [5.8 Wiener Filtering](05_image_restoration_and_reconstruction/08_wiener_filtering.md) | pp. 352–356 | Balance deblurring against noise statistically. |
| [5.9 Constrained Least Squares Filtering](05_image_restoration_and_reconstruction/09_constrained_least_squares_filtering.md) | pp. 357–360 | Regularize restoration without full signal statistics. |
| [5.10 Geometric Mean Filter](05_image_restoration_and_reconstruction/10_geometric_mean_filter.md) | p. 361 | Interpolate between inverse and Wiener behavior. |
| [5.11 Image Reconstruction from Projections](05_image_restoration_and_reconstruction/11_image_reconstruction_from_projections.md) | pp. 362–387 | Understand the Radon transform and filtered backprojection. |

## Chapter 6 — Color Image Processing

| Section | Source | Use |
|---|---:|---|
| [6.1 Color Fundamentals](06_color_image_processing/01_color_fundamentals.md) | pp. 395–400 | Relate spectral response to perceived color. |
| [6.2 Color Models](06_color_image_processing/02_color_models.md) | pp. 401–413 | Convert among RGB, CMY, HSI, and related spaces. |
| [6.3 Pseudocolor Image Processing](06_color_image_processing/03_pseudocolor_image_processing.md) | pp. 414–423 | Map grayscale values to informative colors. |
| [6.4 Basics of Full-Color Processing](06_color_image_processing/04_basics_of_full_color_image_processing.md) | pp. 424–425 | Distinguish component-wise and vector processing. |
| [6.5 Color Transformations](06_color_image_processing/05_color_transformations.md) | pp. 426–438 | Adjust color coordinates and intensities safely. |
| [6.6 Smoothing and Sharpening](06_color_image_processing/06_smoothing_and_sharpening.md) | pp. 439–442 | Extend spatial enhancement to color vectors. |
| [6.7 Color-Based Image Segmentation](06_color_image_processing/07_color_based_image_segmentation.md) | pp. 443–450 | Segment by color-space geometry and gradients. |
| [6.8 Noise in Color Images](06_color_image_processing/08_noise_in_color_images.md) | pp. 451–453 | Track multichannel covariance and preserve valid colors. |
| [6.9 Color Image Compression](06_color_image_processing/09_color_image_compression.md) | pp. 454–455 | Exploit luminance/chrominance perception in compression. |

## Chapter 7 — Wavelets and Multiresolution Processing

| Section | Source | Use |
|---|---:|---|
| [7.1 Background](07_wavelets_and_multiresolution_processing/01_background.md) | pp. 462–476 | Compare Fourier and localized scale-space analysis. |
| [7.2 Multiresolution Expansions](07_wavelets_and_multiresolution_processing/02_multiresolution_expansions.md) | pp. 477–485 | Understand nested approximation spaces. |
| [7.3 One-Dimensional Wavelet Transforms](07_wavelets_and_multiresolution_processing/03_one_dimensional_wavelet_transforms.md) | pp. 486–492 | Decompose signals into approximation and detail. |
| [7.4 Fast Wavelet Transform](07_wavelets_and_multiresolution_processing/04_fast_wavelet_transform.md) | pp. 493–500 | Implement analysis/synthesis filter banks. |
| [7.5 Two-Dimensional Wavelet Transforms](07_wavelets_and_multiresolution_processing/05_two_dimensional_wavelet_transforms.md) | pp. 501–509 | Separate image detail by scale and orientation. |
| [7.6 Wavelet Packets](07_wavelets_and_multiresolution_processing/06_wavelet_packets.md) | pp. 510–520 | Refine both approximation and detail subbands. |

## Chapter 8 — Image Compression

| Section | Source | Use |
|---|---:|---|
| [8.1 Fundamentals](08_image_compression/01_fundamentals.md) | pp. 526–541 | Quantify redundancy, fidelity, and coding stages. |
| [8.2 Basic Compression Methods](08_image_compression/02_basic_compression_methods.md) | pp. 542–613 | Compare entropy, predictive, transform, and wavelet coding. |
| [8.3 Digital Image Watermarking](08_image_compression/03_digital_image_watermarking.md) | pp. 614–621 | Embed and detect robust ownership information. |

## Chapter 9 — Morphological Image Processing

| Section | Source | Use |
|---|---:|---|
| [9.1 Preliminaries](09_morphological_image_processing/01_preliminaries.md) | pp. 628–629 | Establish set notation and structuring elements. |
| [9.2 Erosion and Dilation](09_morphological_image_processing/02_erosion_and_dilation.md) | pp. 630–634 | Shrink, expand, and probe binary shapes. |
| [9.3 Opening and Closing](09_morphological_image_processing/03_opening_and_closing.md) | pp. 635–639 | Remove small features or bridge small gaps. |
| [9.4 Hit-or-Miss Transformation](09_morphological_image_processing/04_hit_or_miss_transformation.md) | pp. 640–641 | Detect exact foreground/background patterns. |
| [9.5 Basic Morphological Algorithms](09_morphological_image_processing/05_basic_morphological_algorithms.md) | pp. 642–664 | Build boundary, filling, thinning, and skeleton operations. |
| [9.6 Gray-Scale Morphology](09_morphological_image_processing/06_gray_scale_morphology.md) | pp. 665–679 | Extend morphology to intensity surfaces. |

## Chapter 10 — Image Segmentation

| Section | Source | Use |
|---|---:|---|
| [10.1 Fundamentals](10_image_segmentation/01_fundamentals.md) | pp. 690–691 | Frame segmentation by discontinuity or similarity. |
| [10.2 Point, Line, and Edge Detection](10_image_segmentation/02_point_line_and_edge_detection.md) | pp. 692–737 | Detect local discontinuities and connect edges. |
| [10.3 Thresholding](10_image_segmentation/03_thresholding.md) | pp. 738–762 | Choose global, local, or multivariable thresholds. |
| [10.4 Region-Based Segmentation](10_image_segmentation/04_region_based_segmentation.md) | pp. 763–768 | Apply region growing and split-and-merge. |
| [10.5 Morphological Watersheds](10_image_segmentation/05_segmentation_using_morphological_watersheds.md) | pp. 769–777 | Segment topographic basins using markers. |
| [10.6 Motion in Segmentation](10_image_segmentation/06_use_of_motion_in_segmentation.md) | pp. 778–785 | Separate moving regions across frames. |

## Chapter 11 — Representation and Description

| Section | Source | Use |
|---|---:|---|
| [11.1 Representation](11_representation_and_description/01_representation.md) | pp. 796–814 | Convert regions into boundary or skeletal forms. |
| [11.2 Boundary Descriptors](11_representation_and_description/02_boundary_descriptors.md) | pp. 815–821 | Describe shape from perimeter features. |
| [11.3 Regional Descriptors](11_representation_and_description/03_regional_descriptors.md) | pp. 822–841 | Measure area, moments, topology, and texture. |
| [11.4 Principal Components for Description](11_representation_and_description/04_principal_components_for_description.md) | pp. 842–851 | Reduce descriptor dimensions along dominant variance. |
| [11.5 Relational Descriptors](11_representation_and_description/05_relational_descriptors.md) | pp. 852–856 | Encode spatial relationships among components. |

## Chapter 12 — Object Recognition

| Section | Source | Use |
|---|---:|---|
| [12.1 Patterns and Pattern Classes](12_object_recognition/01_patterns_and_pattern_classes.md) | pp. 861–865 | Define feature vectors, classes, and classifiers. |
| [12.2 Decision-Theoretic Methods](12_object_recognition/02_recognition_based_on_decision_theoretic_methods.md) | pp. 866–902 | Apply statistical, distance, and neural classification. |
| [12.3 Structural Methods](12_object_recognition/03_structural_methods.md) | pp. 903–906 | Recognize objects through primitives and grammars. |
