from pathlib import Path
import csv, json, re, hashlib

ROOT = Path('D:/workspace/NeoLearning/07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System')
OUT = ROOT/'01_learning/00_intro'
TMP = Path('D:/workspace/NeoLearning/tmp/pdfs/signal_intro')
LECTURE = '../../03_resources/01_lectures/00_Intro.pdf'
BOOK = '../../03_resources/03-Understanding-Digital-Signal-Processing.pdf'
TOPICS = [
 (1,1,20,'01_intro.md','Signals, analog/digital processing, sampling and converters'),
 (2,21,40,'02_reconstruction_and_sequences.md','Reconstruction, impulses, basic sequences and system vocabulary'),
 (3,41,60,'03_discrete_time_systems.md','System properties, LTI convolution, FIR/IIR, causality and stability'),
 (4,61,80,'04_difference_equations_and_applications.md','Difference equations, initial conditions, responses and DSP applications'),
 (5,81,100,'05_frequency_response_and_z_transform.md','Frequency response, phase/group delay and z-transform convergence'),
 (6,101,123,'06_inverse_z_transform_and_system_functions.md','Z-transform pairs, inversion, system functions and ROC examples'),
 (7,124,144,'07_iir_filter_structures.md','Block diagrams, direct-form, cascade and parallel IIR structures'),
 (8,145,165,'08_fir_transposed_and_lattice_structures.md','Transposition, FIR structures, linear phase and lattice networks'),
 (9,166,183,'09_fourier_series_dtft_and_dft.md','Discrete sinusoids, Fourier series, DTFT, DFT and properties'),
 (10,184,203,'10_circular_and_linear_convolution.md','Modulo indexing, circular convolution and DFT-based linear convolution'),
 (11,204,224,'11_block_convolution.md','Long-sequence filtering: overlap-add and overlap-save'),
 (12,225,241,'12_fft_algorithms.md','CTFT/DTFT/DFT relationships and DIT/DIF FFT algorithms'),
 (13,242,260,'13_filter_specifications.md','Digital filter specifications and the analog-to-IIR design route'),
 (14,261,280,'14_analog_prototypes_and_impulse_invariance.md','Butterworth/Chebyshev prototypes, derivative approximation and impulse invariance'),
 (15,281,307,'15_bilinear_and_spectral_transformations.md','Bilinear transformation, prewarping and LP/HP/BP/BS spectral mappings'),
 (16,308,323,'16_fir_selection_and_linear_phase.md','FIR selection, transfer functions and four linear-phase types'),
 (17,324,339,'17_fir_design_methods.md','Window design, Kaiser method, frequency sampling and order estimation'),
 (18,340,360,'18_multirate_processing.md','Decimation, interpolation, spectra and rational sample-rate conversion'),
 (19,361,380,'19_sampling_applications_and_quantization.md','Bandpass sampling, oversampling ADC, subbands and finite-word-length foundations'),
 (20,381,394,'20_roundoff_noise_and_limit_cycle_models.md','Deadbands, limit-cycle models, FFT growth and roundoff-noise propagation'),
 (21,395,408,'21_finite_precision_filter_implementation.md','Coefficient sensitivity, quantized poles, roundoff, overflow and limit-cycle prevention'),
]

def write_plan():
    s = '''# 00 Intro: complete lecture plan and Cornell study index

## Scope and progress

The supplied lecture is **408 PDF pages**. This plan assigns **every page exactly once** to **21 substantial topics** (average 19.4 pages). Topic 15 keeps a 27-page transformation sequence together; several final topics are shorter to respect subject boundaries. These are lecture-page counts, not a promise of 20 printed Markdown pages.

**This batch creates topics 01-10: lecture PDF pages 1-203. Topics 11-21, pages 204-408, are planned only.** They are not represented as completed notes.

Primary source: [00_Intro.pdf](../../03_resources/01_lectures/00_Intro.pdf). Supplement: [Richard G. Lyons, Understanding Digital Signal Processing, third edition](../../03_resources/03-Understanding-Digital-Signal-Processing.pdf), 983 PDF pages, copyright 2011. The title/edition were checked in this local file. For the cited main-text pages, PDF page = printed page + 25; both are given in the notes.

All lecture page references use **one-based PDF viewer pages**, because the printed slide numbers restart/jump. A title slide, repeated explanation, worked-example continuation, or image-only page still gets its own entry. Read notes in English, matching the existing course notes.

## Topic plan

| No. | Topic | Lecture PDF pages | Count | Status |
| --- | --- | --- | --- | --- |
'''
    for n,a,b,f,t in TOPICS:
        link = f'[{t}](./{f})' if n<=10 else t
        s += f'| {n:02} | {link} | {a}-{b} | {b-a+1} | {"Created" if n<=10 else "Planned"} |\n'
    s += '''
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

## Continuation order

Continue with topic 11, overlap-add and overlap-save, at lecture PDF page 204. Keep the same Cornell structure, page ledger, original figures and local textbook citations. Finish topics 11-21 before calling the entire 408-page lecture converted.
'''
    (OUT/'README.md').write_text(s,encoding='utf-8')
    pages=json.loads((TMP/'lecture.json').read_text(encoding='utf-8'))
    with (OUT/'coverage.csv').open('w',encoding='utf-8',newline='') as fp:
        w=csv.writer(fp); w.writerow(['lecture_pdf_page','source_heading_hint','topic','topic_file','status','source_image'])
        for n,a,b,f,t in TOPICS:
            for p in range(a,b+1):
                hints=[x.strip() for x in pages[p-1].splitlines() if x.strip() and not x.strip().isdigit()]
                w.writerow([p,hints[0] if hints else '[visual page]',f'{n:02}',f,'created' if n<=10 else 'planned',f'images/lecture/lecture-p{p:03}.png' if n<=10 else ''])

def build():
    for n,a,b,f,title in TOPICS[:10]:
        raw=(TMP/f'content-{n:02}.txt').read_text(encoding='utf-8')
        intro,pages,ending=raw.split('\n===PAGES===\n')[0],raw.split('\n===PAGES===\n')[1].split('\n===END===\n')[0],raw.split('\n===END===\n')[1]
        matches=list(re.finditer(r'^@@ (\d+)\|(.+)$',pages,re.M))
        assert [int(m[1]) for m in matches] == list(range(a,b+1)), (n,'missing page')
        nav=['[All topics](./README.md)']
        if n>1: nav.append(f'[Previous](./{TOPICS[n-2][3]})')
        if n<10: nav.append(f'[Next](./{TOPICS[n][3]})')
        text=f'# Cornell Notes {n:02}: {title}\n\n'+ ' | '.join(nav)+'\n\n'
        text+=f'**Lecture:** [PDF pages {a}-{b}]({LECTURE}#page={a}) ({b-a+1} pages). **Updated:** 2026-09-13.\n\n'
        text+='**Source convention:** PDF page numbers are one-based viewer pages. Each original slide is reproduced beneath its written note to preserve the complete source content. “Clarification” marks explanatory additions or corrections; “Lyons supplement” marks textbook enrichment.\n\n'
        text+=intro.strip()+'\n\n## Notes Section: page-by-page lecture coverage\n\n'
        for i,m in enumerate(matches):
            p=int(m[1]); body=pages[m.end():matches[i+1].start() if i+1<len(matches) else len(pages)].strip()
            text+=f'### PDF page {p} - {m[2]}\n\n{body}\n\n'
            text+=f'![Original lecture PDF page {p}: {m[2]}](./images/lecture/lecture-p{p:03}.png)\n\n'
            text+=f'*Original slide, including all figures and annotations: [lecture PDF p. {p}]({LECTURE}#page={p}).*\n\n'
        text+=ending.strip()+'\n'
        (OUT/f).write_text(text,encoding='utf-8')

if __name__=='__main__':
    write_plan()
    if (TMP/'content-10.txt').exists(): build()
