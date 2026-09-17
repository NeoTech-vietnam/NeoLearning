# Learning Web vector world map

## Goal

Implement NEL.19 deterministic hybrid SVG world map assets and interactive country preview from the approved art specification.

## Requirements

- Create a deterministic, editable 3840x2160 SVG map from the approved art spec.
- Use one connected continent partitioned into six non-overlapping country paths
  with IDs `country-01` through `country-06`.
- Keep country geometry identical between the layered source and interaction
  mask; provide a land mask and normalized label/capital anchors.
- Add restrained parchment, watercolor, terrain, roads, settlements and coast
  treatment without labels, quest routes, or copyrighted map geometry.
- Export lossless PNG, production WebP, and review previews.
- Add a development preview supporting keyboard/pointer country selection.
- Do not implement the full hierarchical atlas in this task.

## Acceptance Criteria

- [ ] Source SVG, country mask, land mask and anchors exist and validate.
- [ ] All six countries are present, connected through shared borders, and
  Software is the largest central country.
- [ ] Raster exports render at the required sizes.
- [ ] Interactive preview selects every country with visible focus.
- [ ] Visual tests, typecheck and build pass.

## Notes

- Tracker: NEL.19. Atlas tracker NEL.15 depends on this deliverable.
