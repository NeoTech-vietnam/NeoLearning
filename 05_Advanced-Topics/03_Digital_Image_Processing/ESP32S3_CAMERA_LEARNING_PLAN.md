# ESP32-S3 Sense Camera — Digital Image Processing Plan

This file preserves the implementation strategy that connects the 12 textbook chapters to one progressive XIAO ESP32-S3 Sense/OV2640 camera project.

- Theory notes: [Learning index](01_learning/README.md)
- Textbook coverage: [Chapter manifest](chapter_manifest.md)
- Chapter 1 firmware: [Camera pipeline](../../Examples/ESP32/FreeRTOS/05_Advanced-Topics/03_Digital_Image_Processing/01_demo_project/README.md)
- Chapter 2 firmware: [Sampling and quantization](../../Examples/ESP32/FreeRTOS/05_Advanced-Topics/03_Digital_Image_Processing/02_sampling_quantization/README.md)

## Strategy

Extend one project chapter by chapter. Keep acquisition, Wi-Fi, HTTP, dashboard, metrics, and frame ownership stable. Add only the smallest processing path needed by the current chapter.

1. Preserve the original JPEG path for baseline captures and streaming.
2. Decode to grayscale or RGB only when pixel access is required.
3. Begin with small frames or a region of interest; ESP32-S3 RAM and CPU are limited.
4. Compare original and processed outputs using repeatable scenes and recorded metrics.
5. Implement algorithms directly for learning before considering optimized libraries.
6. Keep expensive offline reference calculations on a PC when they do not teach an embedded constraint.

## Progressive chapter plan

| Chapter | Learning target | ESP32-S3 camera example | Intended result | Status |
|---:|---|---|---|---|
| 1 | Image-processing system and pipeline | Capture VGA JPEG, buffer in PSRAM, serve `/capture` and `/stream`, report `/metrics` | Explain every component from light to browser | Implemented; build passed |
| 2 | Sensing, sampling, quantization, pixels | Capture the same scene at several frame sizes; convert a small frame to grayscale; reduce intensity from 8 bits to 4/2 bits; inspect neighbors and distances | Resolution/bit-depth comparison with timing and memory data | In progress; QVGA grayscale and 8/4/2-bit quantization build passed |
| 3 | Intensity transforms and spatial filters | Add negative, log/gamma, contrast stretch, histogram, equalization, box blur, median, Laplacian, Sobel, and unsharp modes | Side-by-side original/processed images and histograms | Planned |
| 4 | Frequency-domain filtering | Compute a 1-D DFT for a selected row first; then a small power-of-two 2-D ROI; demonstrate low-pass/high-pass effects | Magnitude spectrum plus filtered ROI | Planned |
| 5 | Restoration | Inject Gaussian-like, salt-and-pepper, and periodic noise; compare mean, median, notch, inverse-limit, and simplified Wiener restoration | Quantitative before/after error and visual comparison | Planned |
| 6 | Color processing | Decode RGB565/RGB888; inspect RGB and HSV-like channels; segment a strongly colored object such as a red target | Color mask, centroid, and processed preview | Planned |
| 7 | Multiresolution and wavelets | Build Gaussian/downsample levels; implement one-level 2-D Haar transform on a small grayscale frame | Approximation/detail subbands and reconstruction error | Planned |
| 8 | Compression | Compare raw, grayscale, RGB565, and JPEG sizes; vary OV2640 JPEG quality; optionally add simple RLE for binary masks | Compression ratio, quality, capture time, transfer time | Planned |
| 9 | Morphology | Threshold a high-contrast object; apply 3×3 erosion, dilation, opening, closing, boundary extraction, and simple connected components | Clean binary mask and component count | Planned |
| 10 | Segmentation | Compare global/Otsu-like thresholding, Sobel edges, region growing, and frame differencing for motion | Segmented object or moving-region overlay | Planned |
| 11 | Representation and description | Extract bounding box, area, perimeter, centroid, aspect ratio, compactness, and low-order moments from a component | JSON feature vector and annotated frame | Planned |
| 12 | Object recognition | Classify a few controlled objects using normalized handcrafted features and nearest-centroid or minimum-distance classification | Label, confidence/distance, confusion table | Planned |

## Endpoint evolution

Keep existing endpoints compatible:

| Endpoint | Role |
|---|---|
| `/` | Dashboard, controls, original/processed comparison |
| `/stream` | Original MJPEG baseline |
| `/capture` | One image; later accepts a processing selector such as `?mode=gray` |
| `/metrics` | Capture, processing, memory, size, and error measurements |

Do not add a generic processing framework in advance. Add each mode only when its chapter begins. If mode count becomes difficult to maintain, introduce a small mode table then—not before.

## Measurement contract

For every implemented mode, record only applicable values:

- frame width, height, pixel format, encoded byte count;
- capture, decode, processing, encode, and total latency;
- free internal RAM and PSRAM before/after processing;
- average frame rate for streaming modes;
- algorithm-specific result: histogram, reconstruction error, component count, or classifier distance;
- one fixed test scene plus one difficult scene.

## Resource limits

- Keep camera frame buffers in PSRAM; keep latency-sensitive working data internal only when it fits.
- Prefer grayscale and one reusable working buffer.
- Start pixel algorithms at QQVGA/QVGA or a cropped ROI, not VGA RGB888.
- Use integer or fixed-point arithmetic where float cost matters; verify against a PC reference first.
- Process snapshots before attempting real-time streaming.
- Always return every `camera_fb_t` with `esp_camera_fb_return()` on every exit path.
- Treat a browser closing an MJPEG socket as an expected client disconnect, not a camera failure.

## Implementation order per chapter

1. Read the chapter notes and select one observable concept.
2. Define one mode, expected output, and measurable acceptance condition.
3. Save an original baseline capture.
4. Implement the smallest snapshot-only algorithm.
5. Validate against a tiny known input or PC reference.
6. Add dashboard control and metrics only after correctness.
7. Test fixed, textured, low-light, and motion scenes as applicable.
8. Document findings in the demo project README before proceeding.

## Current checkpoint

### Chapter 1 complete

- OV2640 VGA JPEG acquisition.
- PSRAM-backed camera frame buffers.
- Wi-Fi HTTP dashboard.
- `/stream`, `/capture`, and `/metrics` endpoints.
- Capture/stream counters and timing.
- ESP-IDF v6.0.1 build passed with `espressif/esp32-camera` and `esp_timer`.

### Chapter 2 in progress

- Separate `02_sampling_quantization` project created; Chapter 1 remains isolated.
- VGA JPEG baseline preserved through `/capture` and `/stream`.
- `/quantize?bits=8|4|2` decodes VGA JPEG at half scale, quantizes a 320×240 grayscale buffer, then returns browser-viewable JPEG.
- The pre-encode grayscale buffer has exactly 256, 16, or 4 possible values; lossy JPEG can alter decoded output values.
- ESP-IDF v6.0.1 build passed.
- Physical comparison, multiple sensor frame sizes, pixel-neighbor relations, timing, and memory measurements remain pending.

## Completion checklist

- [x] Chapter 1: acquisition and complete system
- [ ] Chapter 2: sampling, quantization, and pixel relations
- [ ] Chapter 3: spatial enhancement
- [ ] Chapter 4: frequency-domain filtering
- [ ] Chapter 5: restoration
- [ ] Chapter 6: color processing
- [ ] Chapter 7: multiresolution and Haar wavelets
- [ ] Chapter 8: compression
- [ ] Chapter 9: morphology
- [ ] Chapter 10: segmentation
- [ ] Chapter 11: representation and descriptors
- [ ] Chapter 12: recognition
