# Research: Figures and Image Assets in Cornell Notes

- Query: How should the research-to-Cornell agent add useful figures from cited websites and local resources while keeping notes stable, source-grounded, cross-model compatible, and rights-aware?
- Scope: mixed
- Date: 2026-09-27

## Findings

### Files found

- `.github/agents/research-notes.agent.md` — VS Code Copilot agent and declared tools.
- `.github/skills/research-to-cornell-notes/SKILL.md` — research, retrieval, synthesis, and note workflow.
- `.github/skills/research-to-cornell-notes/references/cornell-note-contract.md` — Cornell structure and evidence/citation rules.
- `.github/skills/research-to-cornell-notes/references/source-quality.md` — source quality and PDF gap rules.
- `.github/skills/research-to-cornell-notes/scripts/validate_notes.py` — current note, link, citation, and coverage checks.
- `.github/skills/research-to-cornell-notes/requirements.txt` — pypdf and Tree-sitter pins; no image extraction/rendering package is currently pinned.
- `05_Advanced-Topics/02_Automotive_Concepts/01_learning/01_ECU_Interfaces/01_ecu_interfaces_overview.md` — existing note with relative local figure links and colocated WebP/PNG assets.
- `05_Advanced-Topics/02_Automotive_Concepts/01_learning/03_SecServices/01_SecOC/01_overview.md` — existing note with a colocated relative image link.

### Code patterns and capability assessment

- The agent frontmatter grants `read`, `search`, `edit`, `execute`, `web`, and two read-only GitHub tools (`.github/agents/research-notes.agent.md:5-12`). `execute` can run a deterministic local downloader/extractor; the profile does not declare a dedicated image-download, browser-screenshot-to-file, or image-inspection tool. VS Code's custom-agent tool list can include built-in, MCP, and extension tools, and unavailable tools are ignored ([VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents), lines 332-361). Thus instructions and scripts should remain usable without a model-specific image API.
- Existing curriculum notes embed **relative, local** paths such as `image.png` and `ecu-interfaces-title-241203-etas_res_400.webp`; the image files are alongside the note in the same topic directory. This provides a working convention (`01_ecu_interfaces_overview.md:35-50`). GitHub recommends relative image paths for repository Markdown and says they resolve relative to the current file ([GitHub Markdown image syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax), lines 287-309).
- The Cornell contract requires evidence and its `#### Sources` list within the Notes section, and PDF page references (`cornell-note-contract.md:14-22`). Put each figure in that section beside the concept it illustrates, with descriptive alt text, an adjacent caption carrying the `[S#]` citation, and a source entry containing the original asset/page URL, creator/title when available, and verified rights/license.
- `validate_notes.py` already matches Markdown image syntax with `MARKDOWN_LINK` and checks local destinations in `validate_links` (`validate_notes.py:37,84-105`), so a missing local figure file is reported. It skips external URLs and does not currently check image alt-text quality, caption/source linkage, asset license/permission, image format, or rendered image quality (`validate_notes.py:87-104`). Add lightweight deterministic checks for non-empty/descriptive alt text and a nearby caption/source ID for images; keep rights verification as an agent research step because a validator cannot establish the actual license from a URL. Require local paths for durable embedded figures; ordinary web links can remain in the Sources entry.

### Minimal implementation recommendation

1. **Prefer source assets saved locally beside the note**, under a small `figures/` subfolder for new notes (or preserve an existing topic's established layout). Use relative Markdown links. Limit selection to figures that clarify a concept; do not download every page image. Keep a short caption and alt text that describe the visual's learning value, not a generic `alt text` label.
2. **Add one skill-scoped deterministic image helper**, invoked through the existing `execute` capability. It should accept a *direct image URL* or a selected local PDF/page, copy a bounded set of allowed raster formats into the confirmed topic's `figures/`, use safe descriptive filenames, reject HTML/non-image responses, cap byte size, and report the source URL and output path. Python's standard-library `urllib.request.urlopen` reads binary HTTP responses, so direct public image download needs no new web client dependency ([Python `urllib.request`](https://docs.python.org/3/library/urllib.request.html)). This works across compatible models because the helper performs the transfer; a model only selects the URL and filename. It cannot guarantee that a site permits unauthenticated downloads or that VS Code execution has network access.
3. **Use original figure-file URLs where the source exposes them.** A direct download makes the note independent of a volatile hotlink; a full-page website screenshot is not equivalent to a reusable original asset, may copy unrelated text/design, and is not guaranteed to be saved by the current `web` tool declaration. VS Code browser tools can navigate and take screenshots for visual inspection, but the current agent does not explicitly declare browser tools and the documented screenshot workflow is aimed at inspecting pages, not persisting a licensed asset in the repository ([VS Code browser tools](https://code.visualstudio.com/docs/agents/run/browser-tools), lines 220-256). If the user explicitly needs a site screenshot, make it a separately permission-checked capture path and disclose any tool/runtime limitation.
4. **Handle reuse rights before copying.** Verify rights for the specific image, not just the page or PDF. Prefer creator-provided public-domain/CC0 assets or images with a license that permits the intended repository reuse; include creator/title, original link, license link/name, and modification status in the figure caption or its `[S#]` source entry. CC BY requires appropriate credit, a license link, and indication of changes; CC BY-ND prohibits sharing adaptations; NC and SA carry additional conditions ([Creative Commons license overview](https://creativecommons.org/share-your-work/use-remix/cc-licenses/), [CC BY 4.0 deed](https://creativecommons.org/licenses/by/4.0/)). When the image's license or permission is unclear, do not silently copy it: link to the original and, where useful, draw an original schematic from cited facts. A website's public accessibility alone is not reuse permission; the U.S. Copyright Office says internet photos are protected and use of another's photo needs permission ([Copyright Office: Using Photos You Did Not Take](https://www.copyright.gov/engage/docs/photography.pdf)).
5. **PDF figures:** first use pypdf's `page.images` for embedded raster images. Its image extraction requires the optional Pillow dependency (`pip install pypdf[image]`) and can encounter extraction errors ([pypdf image extraction](https://pypdf.readthedocs.io/en/6.6.2/user/extract-images.html), lines 5-18 and 35-49; [pypdf installation](https://pypdf.readthedocs.io/en/6.6.2/user/installation.html), lines 20-37). Add the matching `pypdf[image]` extra to the skill's pinned requirements if that path is implemented. For vector-only diagrams or page compositions, use an opt-in pypdfium2 page render/crop fallback and record the PDF page number; rendering is not OCR or proof that small labels are legible ([pypdfium2 render API](https://pypdfium2-team.github.io/pypdfium2/python_api.html), [pypdfium2 project examples](https://github.com/pypdfium2-team/pypdfium2)). A prior NeoLearning PDF-notes workflow used pypdfium2 for rendered slide pages and figure crops, which is useful local precedent but does not mean the current skill already has that dependency or helper (`MEMORY.md:164-166`). Keep current low-text/image-heavy coverage gaps unless a person or image-capable model actually inspects and documents the visual content.
6. **Validation:** retain current local-file existence checking; add checks for a non-empty, non-placeholder alt string and a figure caption that cites a declared source ID. Make the skill verify image source URL, specific reuse permission/license, exact PDF page or web asset URL, and human-readable/visual relevance. Report an image as unavailable/uninspected instead of claiming it was reviewed. Do not make web reachability or legal-license correctness claims from the local validator.

Suggested in-note pattern (match the note's language for caption prose):

```markdown
![Block diagram showing how the gateway routes authenticated and unauthenticated messages](figures/ecu-communication-gateway.png)
*Figure 1. The security module sits between PduR and the cryptographic service; source [S2], PDF p. 18, reproduced unchanged under CC BY 4.0.*
```

The citation source entry `[S2]` should link to the original PDF/asset and state the creator/title and license URL; keep claim citations in Notes as already required.

### External references

- [VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents) — custom agent tool configuration and unavailable-tool behavior.
- [VS Code browser tools](https://code.visualstudio.com/docs/agents/run/browser-tools) — page inspection and screenshot tools.
- [GitHub Markdown image syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) — local/relative image paths and alt text.
- [pypdf image extraction](https://pypdf.readthedocs.io/en/6.6.2/user/extract-images.html) and [installation extras](https://pypdf.readthedocs.io/en/6.6.2/user/installation.html) — raster extraction and Pillow dependency.
- [pypdfium2 Python API](https://pypdfium2-team.github.io/pypdfium2/python_api.html) — PDF page rendering for vector figures.
- [Python urllib](https://docs.python.org/3/library/urllib.request.html) — direct binary HTTP retrieval using the standard library.
- [Creative Commons license overview](https://creativecommons.org/share-your-work/use-remix/cc-licenses/), [CC BY 4.0 deed](https://creativecommons.org/licenses/by/4.0/), and [Copyright Office photo reuse guidance](https://www.copyright.gov/engage/docs/photography.pdf) — attribution, license conditions, and need to verify permission.

### Related specs

- `.github/skills/research-to-cornell-notes/references/cornell-note-contract.md` — in-Notes evidence and page references.
- `.github/skills/research-to-cornell-notes/references/source-quality.md` — PDF quality and extraction-gap policy.
- No `.trellis/spec` entry covers curriculum note figures or the Copilot research agent.

## Caveats / Not Found

- The available `web` tool behavior in the eventual VS Code/Copilot installation was not exercised. A direct-image downloader can handle a known public asset URL, but it cannot guarantee site access, browser-rendered image discovery, authentication, or persistent screenshots.
- pypdf image extraction handles embedded image objects; it does not extract arbitrary vector artwork as a standalone image. Page rendering can preserve vector visuals but adds a dependency and may produce bulky page images; selective crops need human/model visual inspection.
- No license metadata is currently recorded for the example local note images, and existing samples often use generic alt text. They establish local-path practice, not an attribution/rights standard.
- This research does not establish a legal conclusion for any particular figure. The agent should conservatively use explicitly reusable assets or obtain permission and otherwise link/create an original cited diagram.
