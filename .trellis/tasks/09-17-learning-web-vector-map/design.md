# Deterministic vector world map — design

## Source and layers

`assets/maps/embedded-world-source.svg` is the editable layered master. Country
paths carry stable IDs. The interaction and land masks reuse the same coordinate
system, while a test prevents geometry drift between source and mask.

The master separates paper/sea, country washes, terrain, water, roads,
settlements, borders and decoration. SVG filters add subtle material variation;
they do not determine geography.

## Interaction boundary

The preview overlays the external country mask on the rendered base and owns
only selection/focus behavior. Taxonomy-driven navigation remains in LW-T04.

## Responsive behavior

The SVG preserves its viewBox. Labels are HTML overlays positioned from
normalized anchors, so raster art remains text-free and interaction geometry
does not depend on viewport pixels.
