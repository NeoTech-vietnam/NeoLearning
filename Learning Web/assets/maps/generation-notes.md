# Vector map production notes

## Method

The geography was generated once in Azgaar Fantasy Map Generator v1.153.1
using the High Island template, six states, and seed 663386647. The resulting
SVG is pinned in `azgaar-source-663386647.svg`; there is no runtime random
layout. `scripts/build-world-map.py` remaps its political paths to the six
NeoLearning topic IDs on a fixed 3840×2160 canvas.

The build composes Azgaar coast, rivers, routes and borders with a small CC0
Kenney parchment/icon set. Paper, sea, land, washes, terrain, roads, landmarks,
borders and grading remain separately named SVG layers. Country paths are
repeated in the interaction mask and protected against drift by
`tests/visual/map-assets.test.mjs`.

## Export

From `Learning Web/`:

```bash
python3 scripts/build-world-map.py
npx playwright screenshot --viewport-size='3840,2160' 'file:///absolute/path/to/Learning%20Web/assets/maps/embedded-world-source.svg' assets/maps/embedded-world-base-master.png
python3 scripts/export-map-raster.py
node tests/visual/map-assets.test.mjs
```

The Playwright file URL must be adjusted to the local checkout path.

- Master renderer: Google Chrome headless, device scale factor 1.
- Raster master: 3840×2160 PNG rendered directly from the SVG.
- WebP and responsive JPEG previews: Pillow 12.1.1, Lanczos resize and centered
  crop.
- Interactive proof: Vite development route `/#/map-preview`, captured at
  1440×900.

## Current limitations

The pinned generation leaves a small neutral tract of land between the six
states. It is visible but is not a clickable country. Future editing may annex
it and rebalance country sizes without changing NeoLearning's country IDs or
the web interaction contract.
