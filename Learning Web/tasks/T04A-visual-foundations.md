---
taskId: LW-T04A
title: Cartographic visual foundations
status: pending
priority: high
model: terra
wave: 1
dependencies: [LW-T01]
ownership: [src/ui, src/app/styles, src/dev/design-system, docs/visual-language.md, tests/visual]
---

# T04A — Cartographic visual foundations

## Goal

Turn the approved art direction into an enforceable visual contract so feature
implementers do not invent incompatible colors, spacing, controls, or states.

## Requirements

- Treat `Learning Web/docs/world-map-art-spec.md` as the authoritative artwork,
  asset-layer, country-mask, and label-safe-area contract.
- Extract semantic design tokens for color, typography, spacing, radius,
  elevation, borders, z-layers and motion. Components use semantic tokens rather
  than raw color values.
- Define the typography scale for map labels, country/region titles, body text,
  metadata and code/Markdown editing.
- Implement accessible primitives: button, icon button, card, badge, progress,
  tooltip, modal/drawer, skeleton, empty state and error state.
- Define landmark states: default, hover, focus, selected, visited, active quest,
  completed, locked and unavailable.
- Define map visual rules: country boundary, region boundary, trail, quest stop,
  uncharted path, label priority, overlap avoidance and zoom visibility.
- Document restrained game styling: cartographic navigation and progress are in;
  ornamental mechanics that obscure learning content are out.
- Target WCAG 2.2 AA, keyboard navigation, visible focus, minimum interactive
  target sizing, reduced motion and sufficient text contrast.
- Add a development-only design-system page showing every primitive and state.
- Add stable reference screenshots at 1440×900, 1280×800 and 1024×768 for later
  visual regression tests.

## Acceptance criteria

- Atlas and editor implementers can build screens without choosing new raw
  colors, spacing values, radii or interaction states.
- Every primitive exposes keyboard/focus/disabled/error behavior.
- Design-system page demonstrates all landmark and quest states.
- Automated accessibility checks have no critical violations.
- Reference screenshots are reviewed against the cartographic mockup.

## Validation

```bash
npm run test -- visual
npm run typecheck
npm run build
```

## Handoff

List token files, exported primitives, responsive rules, screenshot locations
and any deliberate deviations from the mockup.
