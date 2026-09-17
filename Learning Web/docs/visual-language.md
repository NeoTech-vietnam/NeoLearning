# Cartographic visual language

This is the implementation contract for NeoLearning interfaces. The asset,
country geometry, and label-anchor contract remains authoritative in
[world-map-art-spec.md](world-map-art-spec.md). Components must use the semantic
custom properties in `src/app/styles/tokens.css`; raw visual values belong only
in that token file or the final art assets.

## Intent and restraint

Navigation should feel like opening a scholarly, hand-illustrated atlas:
parchment surfaces, sepia ink, muted watercolor country washes, a deep
blue-green sea, and a small gold accent for a current quest. The interface is
not a game reward loop. Do not add XP fireworks, loot, faux currencies,
characters, heraldry, decorative frames, or high-chroma game gradients. Progress
is useful orientation, not the content itself.

## Token contract

`tokens.css` owns semantic colors, typography, spacing, radius, borders,
elevation, z-layers, motion, and the 44px minimum interactive target. Key
families are:

- `--color-surface-*`, `--color-ink-*`, `--color-action-*`, and
  `--color-accent-*` for interface surfaces and hierarchy.
- `--color-country-*` only for country-state overlays; country watercolor stays
  subordinate to terrain and uses the art specification palette.
- `--font-display` for world/country/region labels; `--font-body` for prose and
  controls; `--font-code` for Markdown/source-editing views.
- `--text-map`, `--text-country`, `--text-region`, `--text-body`,
  `--text-meta`, and `--text-code` for type hierarchy.
- `--space-*`, `--radius-*`, `--elevation-*`, `--layer-*`, and `--motion-*` for
  layout and interactions. Do not introduce per-screen replacements.

## Primitives

Import from `src/ui`. `Button`, `IconButton`, `Card`, `Badge`, `Progress`,
`Tooltip`, `Modal` (also the drawer mode), `Skeleton`, `EmptyState`, and
`ErrorState` are the base interface primitives. Buttons default to an explicit
`type="button"`, disabled controls use native disabled behavior, progress has a
`progressbar` role and values, tooltips appear on both hover and keyboard focus,
and dialogs support Escape, backdrop close, a visible close control, and focus
on that control when opened.

Use `ErrorState` for recoverable user-facing failure; it has `role="alert"`.
Use `Skeleton` only while content is genuinely loading (`aria-busy`). Cards are
structural by default; only use `interactive` with a real button or link inside
when a whole-card action is needed.

## Landmark state model

`Landmark` exposes exactly these states: `default`, `selected`, `visited`,
`active-quest`, `completed`, `locked`, and `unavailable`.

- Hover and keyboard focus lift the crest slightly and add the gold focus ring;
  focus never relies on color alone because the browser-visible outline remains.
- Selected uses the same clear ring and is announced in the accessible button
  name. Visited/completed use a distinct crest fill plus state text in the
  accessible name.
- Active quest is gold; it must remain the only prominent progress accent in a
  nearby map area.
- Locked and unavailable remain discoverable and are disabled native buttons;
  they never rely solely on opacity to convey why they cannot open.

## Map-layer rules

The map base and land/country masks are separate assets. Use artwork with the
same 3840×2160 coordinate system; never bake UI labels or quest paths into the
raster.

1. Country boundaries use the shared paths from the country mask. Region
   boundaries are lighter, dotted, and never redraw a coastline.
2. Trails are a gold broken line with round caps. Quest stops are gold circles
   on the trail. Uncharted paths are neutral slate dotted lines, not a second
   accent color.
3. Layer order is base artwork → boundaries/trails → labels/landmarks → panels
   → tooltips → modal. Use the supplied `--layer-*` variables.
4. Label anchors come from `embedded-world-label-anchors.json`; use its calm
   areas, not arbitrary terrain. Country number and name have higher priority
   than region/topic labels. If labels collide, hide lower-priority metadata,
   then labels, and expose the omitted detail through selected-region UI.
5. At world zoom show country names, country numbers, active trail, and only
   primary quest stops. At country zoom show region names and visited detail.
   At region zoom show topics and lessons. Do not scale every label down until
   it becomes unreadable.

## Responsive and accessibility contract

Desktop (1024px and wider) can retain world title, labels, panel, and legend in
their artwork safe areas. From 768px to 1023px, collapse secondary metadata and
stack exterior panels. Below 768px, retain landmark focus targets, progressively
hide map metadata and labels, and move selected-region detail into the drawer.

All interactive targets are at least 44px, map landmarks are buttons, focus is
visible, and keyboard users can reach all selectable geography in the same
logical ordering as the visual route. Color combinations use the ink-on-
parchment relationship for text contrast; never place dark text directly on an
unbacked country wash. Motion respects `prefers-reduced-motion`.

## Development page and screenshot targets

In a development Vite server, open `/#/design-system` to review every primitive
and state. Open `/#/map-preview` to inspect the deterministic vector map,
country hit regions and label anchors. Production builds intentionally do not
expose either route.

Reference capture is specified in `tests/visual/reference-targets.json`. The
hybrid vector MVP, country/land masks and anchors live in `assets/maps/`; its
interactive proof is captured there as well. Design-system screenshots and an
automated browser accessibility runner remain part of the quality-gate task.
