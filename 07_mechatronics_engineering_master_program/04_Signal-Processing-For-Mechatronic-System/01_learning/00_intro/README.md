# 00 Intro: complete lecture plan and Cornell study index

## Scope and progress

The supplied lecture is **408 PDF pages**. This plan assigns **every page exactly once** to **21 substantial topics** (average 19.4 pages). Topic 15 keeps a 27-page transformation sequence together; several final topics are shorter to respect subject boundaries. These are lecture-page counts, not a promise of 20 printed Markdown pages.

**This batch creates topics 01-10: lecture PDF pages 1-203. Topics 11-21, pages 204-408, are planned only.** They are not represented as completed notes.

Primary source: [00_Intro.pdf](../../03_resources/01_lectures/00_Intro.pdf). Supplement: [Richard G. Lyons, Understanding Digital Signal Processing, third edition](../../03_resources/03-Understanding-Digital-Signal-Processing.pdf), 983 PDF pages, copyright 2011. The title/edition were checked in this local file. For the cited main-text pages, PDF page = printed page + 25; both are given in the notes.

All lecture page references use **one-based PDF viewer pages**, because the printed slide numbers restart/jump. A title slide, repeated explanation, worked-example continuation, or image-only page still gets its own entry. Read notes in English, matching the existing course notes.

## Topic plan

| No. | Topic | Lecture PDF pages | Count | Status |
| --- | --- | --- | --- | --- |
| 01 | [Signals, analog/digital processing, sampling and converters](./01_intro.md) | 1-20 | 20 | Created |
| 02 | [Reconstruction, impulses, basic sequences and system vocabulary](./02_reconstruction_and_sequences.md) | 21-40 | 20 | Created |
| 03 | [System properties, LTI convolution, FIR/IIR, causality and stability](./03_discrete_time_systems.md) | 41-60 | 20 | Created |
| 04 | [Difference equations, initial conditions, responses and DSP applications](./04_difference_equations_and_applications.md) | 61-80 | 20 | Created |
| 05 | [Frequency response, phase/group delay and z-transform convergence](./05_frequency_response_and_z_transform.md) | 81-100 | 20 | Created |
| 06 | [Z-transform pairs, inversion, system functions and ROC examples](./06_inverse_z_transform_and_system_functions.md) | 101-123 | 23 | Created |
| 07 | [Block diagrams, direct-form, cascade and parallel IIR structures](./07_iir_filter_structures.md) | 124-144 | 21 | Created |
| 08 | [Transposition, FIR structures, linear phase and lattice networks](./08_fir_transposed_and_lattice_structures.md) | 145-165 | 21 | Created |
| 09 | [Discrete sinusoids, Fourier series, DTFT, DFT and properties](./09_fourier_series_dtft_and_dft.md) | 166-183 | 18 | Created |
| 10 | [Modulo indexing, circular convolution and DFT-based linear convolution](./10_circular_and_linear_convolution.md) | 184-203 | 20 | Created |
| 11 | Long-sequence filtering: overlap-add and overlap-save | 204-224 | 21 | Planned |
| 12 | CTFT/DTFT/DFT relationships and DIT/DIF FFT algorithms | 225-241 | 17 | Planned |
| 13 | Digital filter specifications and the analog-to-IIR design route | 242-260 | 19 | Planned |
| 14 | Butterworth/Chebyshev prototypes, derivative approximation and impulse invariance | 261-280 | 20 | Planned |
| 15 | Bilinear transformation, prewarping and LP/HP/BP/BS spectral mappings | 281-307 | 27 | Planned |
| 16 | FIR selection, transfer functions and four linear-phase types | 308-323 | 16 | Planned |
| 17 | Window design, Kaiser method, frequency sampling and order estimation | 324-339 | 16 | Planned |
| 18 | Decimation, interpolation, spectra and rational sample-rate conversion | 340-360 | 21 | Planned |
| 19 | Bandpass sampling, oversampling ADC, subbands and finite-word-length foundations | 361-380 | 20 | Planned |
| 20 | Deadbands, limit-cycle models, FFT growth and roundoff-noise propagation | 381-394 | 14 | Planned |
| 21 | Coefficient sensitivity, quantized poles, roundoff, overflow and limit-cycle prevention | 395-408 | 14 | Planned |

## How to use the Cornell notes

1. Read the cue column and try to answer without looking at the notes.
2. Study the key equations and the page-by-page notes. Each lecture page has its full original slide image immediately below its explanation. These full-slide renders preserve every original figure, equation, label, prompt and example, including content embedded as raster images. They are source captures, not redrawn diagrams or OCR transcriptions.
3. Read the clearly marked Lyons supplement. Its figure crops are extracted from this local textbook, with figure number, printed page and PDF page. Suggested reading is a study recommendation, not an official syllabus mapping. Topics the book does not develop in the same detail remain attributed to the lecture.
4. Solve the worked-example variations and retrieval questions, then check the answer key.
5. Write your own two-sentence summary after reading the provided summary.

The written notes explain the material and typeset the main mathematics; the source images carry the complete original page, including dense diagrams/tables. Thus full visual source coverage should not be confused with a verbatim editable transcription of every label. Suspected source mistakes are explicitly called out beside corrected mathematics.

## Coverage and figure audit

- [Page coverage ledger](./coverage.csv): 408 rows, one per lecture PDF page, with assigned topic and creation status.
- [Image provenance manifest](./images/manifest.json): source PDF, page, extraction method and file hash for slide images and textbook figure crops.
- All 203 lecture pages in this batch have a written page section and an inline source image. No lecture page in this batch is silently omitted.
- The initial three short draft notes have been consolidated into the new sequence; their substantive signals/converter content is incorporated in topic 01. Existing loose PNGs are retained for compatibility.

## Validation completed on 2026-09-14

- Exactly 10 topic notes, with contiguous written page sections for lecture pages 1-203; the full plan/ledger assigns pages 1-408 without gaps or duplicate assignments.
- 203 complete lecture-slide images and 11 textbook figure crops have verified file integrity, provenance and working note references. Figure crops were visually inspected and expanded where necessary to retain labels and captions.
- All 914 mathematical expressions parsed successfully with KaTeX. Local Markdown/KaTeX previews of all 10 notes showed no page-width overflow or reported broken images; representative text, equations, tables and source images were visually inspected. This checks that preview renderer, not every possible Markdown editor.
- Independent numerical checks passed for the worked recurrences, partial-fraction expansions, feedback signs, lattice/ladder conversions, DFT inversion/Parseval, correlation, shifts and circular-versus-linear convolution examples.
- Local-link, Cornell-section, page/image-count and whitespace checks passed. Original PDF files were not modified.

## Continuation order

Continue with topic 11, overlap-add and overlap-save, at lecture PDF page 204. Keep the same Cornell structure, page ledger, original figures and local textbook citations. Finish topics 11-21 before calling the entire 408-page lecture converted.
