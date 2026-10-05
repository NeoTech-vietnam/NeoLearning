# Design

## Authorities and boundaries
The revised outline controls content hierarchy, the regulations control formatting, BM03 controls the cover, and supplied drafts provide the main text. Embedded instructions are treated as source/teacher guidance only where relevant to the user request. The new output is independent of the inputs and the old essay.

## Content flow
Read paragraphs and source references into an auditable map. Reconcile chapter 1 section 1.1 with existing 1.1.1–1.1.5; retain 1.2.1–1.2.3. Create 2.1.1 (worldview) and 2.1.2 (methodology) using the existing two argument groups. Keep 2.2.1/2.2.2 and the five solution sections. Add chapter summaries and an introductory structure statement. Convert verified citations into footnotes and consolidate only references used in the final text.

## Format and compatibility
Use bundled python-docx with targeted OOXML for footnotes and fields. Run the bundled Node artifact marker immediately before first authoring. Recreate an editable cover using the original logo. Use heading styles, an automatic TOC and page fields. If bundled LibreOffice is absent, use hidden Word COM for field updates and PDF export, then a conversion adapter for packaged render_docx.py to produce page PNGs. Never use the user's desktop LibreOffice.

## Risks and rollback
Some numbers and source labels are incorrect. Correct or qualify them while preserving the underlying argument. Textbook pagination may differ between manuscript and published editions; do not invent page numbers. Meet the page range through substantive integration, not filler. Keep input hashes and preserve originals. The new DOCX can be removed independently; no external publication.
