---
name: generate-esp-idf-peripheral-notes
description: Generate branch-aware Cornell notes that connect an Espressif TRM chapter, ESP-IDF programming guides, public APIs, private drivers, HAL, LL, registers, examples, and tests. Use for ESP32-family peripheral learning topics such as SPI, I2C, I2S, GDMA, MCPWM, UART, or ADC when notes must be split into technical-reference, programming-guide, and use-case collections with complete symbol and sequence cross-links.
---

# Generate ESP-IDF Peripheral Notes

Generate one peripheral on the currently checked-out learning branch. Never switch, create, merge, commit, or push branches.

## Workflow

1. Read `references/output-contract.md` completely.
2. Confirm the learning repository branch and dirty files. Preserve unrelated changes.
3. Resolve the target, peripheral, topic root, TRM PDF and chapter pages, ESP-IDF root, and immutable Git ref. Ask only when discovery gives multiple plausible topic roots or chapters.
4. Discover relevant guide RST, public/private headers, driver sources, target HAL/LL, register headers, examples, and component tests. Exclude adjacent subsystems unless the request includes them.
5. Run `scripts/prepare_sources.py` with explicit pages and source paths. Read only its staged snapshot when tracing ESP-IDF; do not read modified working-tree versions.
6. Use MarkItDown output as an optional structural hint. Treat Poppler layout text and rendered pages as the page/provenance source of truth.
7. Generate the three Cornell collections in a temporary staging directory using `assets/cornell-note.md`.
8. Inventory every in-scope public, private, HAL, and target LL symbol. Explain every internal function encountered in a public call sequence. Label external dependency boundaries instead of recursively documenting other peripherals.
9. Add reciprocal relative links across the three collections and stable ESP-IDF source links pinned to the selected tag/commit.
10. Run `scripts/validate_notes.py`. Resolve every error before copying staged output into the topic root.
11. Show the changed file summary. Never alter the ESP-IDF checkout.

## Source Rules

- Use `git show <ref>:<path>` or the prepared snapshot for ESP-IDF sources.
- Validate target capabilities before documenting them.
- Distinguish **Public API**, **Private driver**, **HAL**, **LL**, **Register**, and **External dependency**.
- Do not infer a register effect from a function name; verify the function body and target LL implementation.
- Preserve existing useful notes and images. Consolidate duplicates only after comparison.
- Keep examples minimal and public-API-only. Internal APIs are explanatory, never application recommendations.

## Commands

Prepare immutable sources:

```bash
python3 scripts/prepare_sources.py \
  --repo-root /path/to/learning-repo \
  --topic-root /path/to/topic \
  --trm /path/to/trm.pdf --pages 100:150 \
  --idf-root /path/to/esp-idf --idf-ref v6.0.1 \
  --target esp32s3 --peripheral spi \
  --symbol-prefix spi_ --symbol-prefix spicommon_ \
  --symbol-path components/esp_driver_spi/include/driver/spi_master.h \
  --idf-path docs/en/api-reference/peripherals/spi_master.rst \
  --idf-path components/esp_driver_spi/include/driver/spi_master.h
```

Validate generated notes:

```bash
python3 scripts/validate_notes.py /path/to/topic \
  --symbol-file /tmp/prepared/symbols.txt
```

`prepare_sources.py` prints the staging directory. Pass `--output-dir` when a stable path is needed. Use repeated `--symbol-path` arguments to keep examples/tests available as evidence without treating their local helper names as driver inventory.
