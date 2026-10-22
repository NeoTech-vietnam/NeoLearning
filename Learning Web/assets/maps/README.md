# Embedded World map assets

`embedded-world-source.svg` is the editable layered master and the source of
the visual geography. It uses a fixed 3840×2160 viewBox and Inkscape-compatible
layer labels. Geography is pinned from Azgaar seed 663386647; there is no
random runtime layout. `scripts/build-world-map.py` regenerates the master,
country mask, land mask, and label anchors together.

`embedded-world-country-mask.svg`, `embedded-world-land-mask.svg`, and
`embedded-world-label-anchors.json` are the interaction contract. Country path
IDs are stable. After changing the pinned source or mapping, run the build
script and `node tests/visual/map-assets.test.mjs` from `Learning Web/`.

Raster files in this directory are derived exports. Do not edit them as master
artwork.

## Open-source provenance

- [Azgaar's Fantasy Map Generator](https://github.com/Azgaar/Fantasy-Map-Generator):
  organic geography, state borders, rivers, routes, coastal detail, and waves;
  MIT license in `vendor/AZGAAR-LICENSE.txt`. The captured source is
  `azgaar-source-663386647.svg`.
- [Kenney Cartography Pack](https://kenney.nl/assets/cartography-pack):
  parchment and six landmark icons; CC0 license in `vendor/kenney/License.txt`.

Only the selected source assets are bundled. The production SVG embeds them,
so the map makes no third-party image requests at runtime.

The artwork, hit-region SVG, and HTML label anchors all use the same 16:9
canvas. Keep `.world-map` at 16:9 when changing its desktop layout; stretching
