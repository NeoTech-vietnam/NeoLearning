# Embedded World map assets

`embedded-world-source.svg` is the editable layered master and the source of
the visual geography. It uses a fixed 3840×2160 viewBox and Inkscape-compatible
layer labels. Geography is hand-authored; no runtime random generation is used.

`embedded-world-country-mask.svg`, `embedded-world-land-mask.svg`, and
`embedded-world-label-anchors.json` are the interaction contract. Country path
IDs are stable. If a country path changes, update the same path in the mask and
run `npm run test -- visual` before using the asset.

Raster files in this directory are derived exports. Do not edit them as master
artwork.
