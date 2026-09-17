# Vector map production notes

## Method

The map was drawn as deterministic SVG geometry rather than generated as one
raster image. The continent and six countries were art-directed with Bézier
paths in a 3840×2160 coordinate system. There is no random runtime layout.

The master separates paper, sea, land, watercolor washes, mountains, water,
forests, roads, settlements, boundaries and grading into named SVG groups.
Country paths are repeated in the interaction mask and protected against drift
by `tests/visual/map-assets.test.mjs`.

## Export

- Master renderer: Google Chrome headless, device scale factor 1.
- Raster master: 3840×2160 PNG rendered directly from the SVG.
- WebP and responsive JPEG previews: Pillow 12.1.1, Lanczos resize and centered
  crop.
- Interactive proof: Vite development route `/#/map-preview`, captured at
  1440×900.

## Current limitations

This is the first controlled vector-art pass. It establishes production-safe
geometry, masks, anchors, terrain language and interaction. A later illustration
pass may increase coastline micro-detail, terrain density and hand-ink variation
without changing country IDs or the web interaction contract.
