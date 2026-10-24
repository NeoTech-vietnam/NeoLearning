# Visual Figures for Research Notes

Use this procedure only in the full research workflow, after a substantive existing-note fast-path match has failed or the user explicitly requested new research. The goal is one or a few figures that improve understanding of specific claims.

## Find and select

1. Inspect the cited source pages and selected local resources for diagrams, waveforms, charts, architecture views, or component images that explain an idea used in the note.
2. Prefer original downloadable assets and useful figures from the user's local resources. Do not capture a whole webpage screenshot or include decoration, duplicate variants, or unreadable detail.
3. Verify reuse terms for the specific figure, not just the page or PDF. Copy a web image only when explicit reuse terms permit repository redistribution and attribution. Confirm a clear reuse basis before copying a local PDF page/crop. If the terms are unclear, link to the original or make an original diagram from cited facts.
4. Inspect the saved image. Make sure labels and the relevant feature are legible at note size, and explain near the caption which claim it clarifies. A page render is visual evidence only; it does not recover or transcribe page text.

## Save a local asset

Place selected images beside the note in `figures/<note-slug>/` and link to them with a path relative to the note. Use a descriptive, lowercase filename. The helper refuses existing outputs, HTML or other non-image bodies, unsupported formats, non-HTTPS URLs, mismatched extensions, and oversized downloads. Its web downloader accepts only direct PNG, JPEG, or WebP assets, caps downloads at 25 MiB (8 MiB by default), checks image bytes, and verifies that redirects remain HTTPS. It cannot discover browser-rendered image URLs, authenticate, or save webpage screenshots.

Install the skill-scoped pins into the Python environment used for capture if they are absent:

```powershell
python -m pip install -r .github/skills/research-to-cornell-notes/requirements.txt
```

Download a permitted direct web image (choose the extension that matches the actual image):

```powershell
python .github/skills/research-to-cornell-notes/scripts/capture_resource_image.py download --url "https://example.org/assets/controller-block-diagram.png" --output "<note-directory>/figures/<note-slug>/controller-block-diagram.png" --max-bytes 8388608
```

Render a selected 1-based PDF page. The output is a PNG; the original PDF's printed/page index is recorded in the caption and Sources entry:

```powershell
python .github/skills/research-to-cornell-notes/scripts/capture_resource_image.py render-pdf --pdf "<selected-source.pdf>" --page 18 --output "<note-directory>/figures/<note-slug>/gateway-security-page-18.png" --scale 2
```

To crop a selected part, provide `LEFT TOP RIGHT BOTTOM` in output pixel coordinates after scaling. Bounds are checked against the rendered page:

```powershell
python .github/skills/research-to-cornell-notes/scripts/capture_resource_image.py render-pdf --pdf "<selected-source.pdf>" --page 18 --output "<note-directory>/figures/<note-slug>/gateway-security-detail.png" --scale 2 --crop 80 100 1200 900
```

The script prints JSON with the original URL or PDF path/page and saved output. Stop that capture attempt on a nonzero exit and use the diagnostic: a missing dependency, network/site block, unsupported response, invalid page/crop, or existing destination must be resolved or reported before writing an image link. A local fallback to direct source reading does not imply the image was captured.

## Add figure evidence in Cornell Notes

Put each image in the Notes Section beside the claim it explains. Use descriptive alt text (what the image shows and why it matters), then an adjacent numbered caption in the requested note language (such as `Figure 1`, `Hình 1`, `Ảnh 1`, or `Figura 1`) citing the figure's `[S#]`. Add that source ID to the `#### Sources` list in Notes with creator/title (or `not identified`), original direct URL or exact PDF page, reuse license/permission terms, and whether/how the image was modified. Link the license terms when available. Use `changes: unchanged` for an unaltered asset or state the crop/page-render operation. Do not treat a source webpage's terms as the figure's license unless they explicitly cover that asset.

```markdown
![Block diagram showing how the gateway authenticates a message before forwarding it to the bus](figures/ecu-interfaces/gateway-security-path.png)
*Figure 1. The security module authenticates messages before routing them; source [S2], PDF p. 18, cropped from the page under CC BY 4.0.*

#### Sources

- [S2] Creator: Vehicle Network Lab; title: Gateway Security Architecture; original: [PDF p. 18](https://example.org/gateway-security.pdf); reuse: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); changes: cropped from PDF p. 18.
```

The note validator checks that images are local and present, have non-generic alt text, appear in Notes, have a numbered nearby caption citing a listed source ID, and declare attribution, original source, reuse, and change fields. It checks structure only; it cannot establish legal permission, metadata truth, accessibility quality, or visual accuracy. Report an unavailable or uninspected image honestly and preserve any text-extraction coverage gap.
