# Cornell Notes

## Topic: What is Digital Image Processing?

## Date: 24/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How is a digital image represented mathematically?
- What distinguishes low-, mid-, and high-level processing?
- What are sampling, quantization, spatial resolution, and intensity resolution?
- Which two application goals motivate digital image processing?

---

### Notes Section (Main Notes)

The sources provide a comprehensive framework for understanding **digital image processing** by clearly defining the field itself and numerous fundamental concepts within it. This foundation is crucial for grasping the broader context of image-related computerized tasks.

#### What Is Digital Image Processing?

At its most fundamental level, **digital image processing refers to processing digital images by means of a digital computer**. The interest in this field stems from two primary application areas:
1.  **Improvement of pictorial information for human interpretation**.
2.  **Processing of image data for storage, transmission, and representation for autonomous machine perception**.

The authors of the book specifically define **digital image processing** to encompass both **processes whose inputs and outputs are images** and **processes that extract attributes from images, up to and including the recognition of individual objects**. This definition is intended to be broader than a potentially "limiting and somewhat artificial boundary" that suggests image processing only involves transformations where both input and output are images.


#### Core Definitions within Digital Image Processing

To elaborate on the field and its operations, the sources define several key terms:

*   **Image**: An image is conceptualized as a **two-dimensional function, $f(x, y)$, where $x$ and $y$ are spatial (plane) coordinates, and the amplitude of $f$ at any pair of coordinates $(x, y)$ is called the intensity or gray level** of the image at that point.
*   **Digital Image**: An image becomes a digital image when $x$, $y$, and the intensity values of $f$ are all **finite, discrete quantities**. It is composed of a finite number of elements, each with a particular location and value.
*   **Pixel**: The individual elements of a digital image are most widely known as **pixels**, though they can also be called picture elements, image elements, or pels.
*   **Intensity or Gray Level**: This refers to the **amplitude of the image function $f(x, y)$ at a specific coordinate pair $(x, y)$**. These are positive scalar quantities, often proportional to energy radiated by a physical source. While intensity values can become negative during processing, they are typically scaled to a range like $[0, L-1]$ for storage and display, where $0$ is black and $L-1$ is white.
*   **Spatial Domain**: This is the **section of the real plane spanned by the coordinates of an image**, with $x$ and $y$ referred to as spatial variables or spatial coordinates. Image processing methods in this domain involve **direct manipulation of pixels in an image**.
*   **Sampling**: The process of **digitizing the coordinate values** of a continuous image.
*   **Quantization**: The process of **digitizing the amplitude (intensity) values** of a continuous image.
*   **Dynamic Range**: This establishes the **lowest and highest intensity levels that a system can represent** and that an image can have, bounded by saturation (upper limit) and noise (lower limit).
*   **Image Contrast**: Defined as the **difference in intensity between the highest and lowest intensity levels in an image**. High contrast indicates an appreciable number of pixels with a high dynamic range.
*   **Spatial Resolution**: A measure of the **smallest discernible detail in an image**. It can be quantified as line pairs per unit distance or dots (pixels) per unit distance.
*   **Intensity Resolution**: Refers to the **smallest discernible change in intensity level**. It is commonly expressed by the number of bits used to quantize intensity (e.g., an 8-bit image has 8 bits of intensity resolution).
*   **Filter**: The term "filter" is borrowed from frequency domain processing, where it means **accepting (passing) or rejecting certain frequency components**. In the spatial domain, "spatial filters" (also known as spatial masks, kernels, templates, and windows) achieve similar smoothing or sharpening by directly manipulating image pixels.
*   **Order-Statistic Filters**: These are spatial filters whose **response is based on ordering (ranking) the values of the pixels contained in the image area encompassed by the filter**.
*   **Homomorphic Filtering**: An **image enhancement technique based on an image formation model**.

#### Scope in the Context of Digital Image Processing

The relationship between digital image processing, image analysis, and computer vision is clarified by categorizing processes into three levels:

*   **Low-level processes**: These involve **primitive operations** such as image preprocessing to **reduce noise, enhance contrast, and sharpen images**. The key characteristic is that **both the inputs and outputs are typically images**. Examples include Chapters 3 and 4 which discuss filtering and enhancement.
*   **Mid-level processing**: This includes tasks like **segmentation** (partitioning an image into regions or objects), **description of those objects** for computer processing, and **classification (recognition) of individual objects**. For these processes, **inputs are generally images, but outputs are attributes extracted from those images** (e.g., edges, contours, or the identity of individual objects). Importantly, the book explicitly states that **digital image processing, as defined, extends to these mid-level tasks, including the recognition of individual objects**. This is supported by chapters covering morphological processing, segmentation, representation and description, and object recognition.
*   **High-level processing**: This involves more complex tasks such as "**making sense' of an ensemble of recognized objects**, performing **cognitive functions associated with vision**, and **emulating human intelligence**, which falls under the domain of artificial intelligence (AI). The authors indicate that **going "past this point" (object recognition) requires concepts from machine intelligence that are beyond the scope** of their book. The ultimate goal of computer vision is to fully emulate human vision, including learning and making inferences.

This layered understanding of image processing activities effectively places the book's coverage of **digital image processing** squarely within low- and mid-level operations, providing a robust theoretical and practical foundation up to object recognition, while acknowledging the more advanced, cognitive aspirations of computer vision.

---

### Summary Section (Summary of Notes)

Digital image processing uses computers to improve images for people or extract information for machines. A digital image is a finite grid of sampled coordinates and quantized intensities. The field spans image-to-image enhancement through segmentation, description, and individual-object recognition.

**Source:** Section 1.1, printed pp. 1–3 (PDF pp. 24–26).