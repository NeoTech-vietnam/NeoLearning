# NeoLearning Embedded World — Art Specification

## 1. Purpose

Create the master World Map artwork for NeoLearning's **Learning by Making**
experience. The map should feel like opening an illustrated fantasy atlas in a
role-playing game, while remaining clear enough to function as navigation for a
technical learning application.

This document is a production brief for an illustrator or image-generation
model. It defines the visual asset only. Application behavior, labels, progress,
quest paths, selection states, and tooltips are rendered separately by the web
interface.

## 2. Visual reference and interpretation

Primary user reference:

- [Westeros-style kingdom map reference](https://www.google.com/imgres?q=b%E1%BA%A3n%20%C4%91%E1%BB%93%20c%C3%A1c%20v%C6%B0%C6%A1ng%20qu%E1%BB%91c%20game&imgurl=https%3A%2F%2Fgenk.mediacdn.vn%2Fk%3Athumb_w%2F660%2F2016%2Fmap2-1-map-of-westeros-1463677880862%2Ftoan-tap-lich-su-game-of-thrones-cau-truc-bay-vuong-quoc.jpg&imgrefurl=https%3A%2F%2Fgamek.vn%2Ftoan-tap-lich-su-game-of-thrones-cau-truc-bay-vuong-quoc-20160520001012878.chn)

Take from the reference:

- Antique parchment and ink illustration.
- A believable continent with a complex, irregular coastline.
- Mountains, rivers, forests, roads, settlements, ports, and islands.
- Political regions that feel shaped by natural geography.
- Large-scale sense of history, travel, and discovery.
- Restrained regional watercolor washes rather than flat UI fills.

Do **not** copy:

- The Westeros silhouette or north-south proportions.
- Existing kingdom borders, place names, heraldry, house symbols, typography,
  decorative frame, or landmark placement.
- Any recognizable Game of Thrones composition or protected iconography.

The result must be an original NeoLearning world.

## 3. Creative direction

### Core feeling

`Adventure + scholarship + engineering discovery`

The map should feel handcrafted, old, and worth exploring. It must not resemble
a SaaS dashboard, a board-game infographic, a flat Voronoi diagram, or a mobile
strategy-game advertisement.

### Art medium

- Fine sepia pen-and-ink linework on aged parchment.
- Restrained watercolor washes with visible paper texture.
- Dense geographic detail near important locations; calmer negative space where
  HTML labels will appear.
- Hand-drawn cartographic symbols with consistent scale.
- Subtle imperfections; avoid synthetic-perfect vector geometry.

### Visual complexity

- 75% functional geographic illustration.
- 20% atmosphere and texture.
- Maximum 5% ornament, limited to a compass rose and subtle sea decoration.

No decorative border, banners, heraldic shields, characters, monsters, ships,
or large ornamental objects in the MVP artwork.

## 4. World composition

### Canvas

- Master: `3840 × 2160 px`, landscape, sRGB.
- Safe desktop crop: full 16:9 canvas.
- Safe 4:3 crop: central 2880 × 2160 area must retain all six countries.
- Reserve the outermost 4% as low-detail overscan.
- Reserve calm texture at the upper center for the page title.
- Reserve calm texture at the upper-right and lower-left for optional UI cards.

### Continent silhouette

- One primary connected continent occupying approximately 72–78% of the canvas.
- Wide east-west composition, not a tall Westeros-like landmass.
- Asymmetric silhouette with peninsulas, bays, deltas, capes, and a few small
  offshore islands.
- No circular blob, rectangular outline, symmetrical flower shape, or six
  obvious circles fused together.
- Coastline complexity should vary: rugged western and northern edges, calmer
  southern shores, and an island-rich eastern coast.

### Political layout

Six countries share the continent. Their areas are visual targets, not exact
mathematical percentages:

| ID | Country | Target area | Geographic role |
| --- | --- | --- | --- |
| 01 | Hardware Kingdom | 18% | Rocky west and north-west |
| 02 | Software Empire | 36% | Largest central heartland |
| 03 | Protocol Archipelago | 23% | Eastern coast, straits and islands |
| 04 | Skills Guilds | 8% | South-western settled lowlands |
| 05 | Advanced Frontier | 9% | Rugged north-east or far-east frontier |
| 06 | Product Realm | 6% | Small south-central convergence territory |

Country 02 should visually touch all or nearly all other countries. Country 06
should sit near the convergence of routes from Hardware, Software, Protocols,
and Advanced Topics because product projects are the journey destination.

## 5. Natural borders

Borders must look geographically motivated before political lines are added.

Use these priorities:

1. Mountain ridges for strong boundaries.
2. Major rivers, watersheds, forests, and valleys for secondary boundaries.
3. Roads, passes, bridges, and settlements at crossing points.
4. Thin hand-drawn dotted lines only where no natural feature explains the
   political division.

Adjacent countries must share exactly the same border. Do not leave ocean-like
gaps between them or draw overlapping colored land blobs.

Regional watercolor washes should fade into the paper and remain subordinate to
terrain. Target opacity is visually equivalent to 12–20%; border-adjacent colors
may blend slightly.

## 6. Country art direction

### 01 — Hardware Kingdom

- Rugged western highlands, exposed rock, mines, quarries, and mountain passes.
- Sparse workshops, observatory-like test stations, fortified bridges, and
  practical settlements.
- Visual themes: material, energy, measurement, fabrication.
- Avoid literal circuit boards, chips, oscilloscopes, or modern factories.

### 02 — Software Empire

- Broad central plains and river basins with the densest road network.
- Several cities connected through branching routes, implying many internal
  regions and deep hierarchy.
- A central archive or academy may act as the visual capital.
- Visual themes: systems, structure, branching knowledge, orchestration.
- It must be the largest country but must not visually swallow the whole map.

### 03 — Protocol Archipelago

- Eastern coastline with bays, straits, river mouths, ports, bridges, and small
  nearby islands.
- Multiple routes converge on harbors, implying communication between realms.
- Visual themes: connection, transport, exchange, interoperability.
- The mainland portion remains connected to the continent; “Archipelago” does
  not mean the whole country is detached.

### 04 — Skills Guilds

- Compact south-western lowlands with villages, farms, meeting halls, and roads.
- Visually warmer and more inhabited than the technical frontiers.
- Visual themes: cooperation, communication, patience, organization.
- Avoid cartoon characters or literal speech-bubble symbols.

### 05 — Advanced Frontier

- Rugged outer territory with difficult mountain chains, plateaus, old ruins,
  and partially uncharted spaces.
- Lower settlement density and slightly cooler watercolor wash.
- Visual themes: specialization, difficulty, discovery, unknown depth.
- Leave expansion space so the territory can grow as the curriculum expands.

### 06 — Product Realm

- Small but visually important south-central territory.
- One maker citadel or great workshop at the intersection of major routes.
- Mixed landscape features borrowed subtly from neighboring countries.
- Visual themes: integration, completion, craft, real-world outcomes.
- Do not make it a royal throne, giant castle, or dominant fantasy capital.

## 7. Terrain and landmark language

- Mountains: clustered ranges following tectonic-looking arcs, never scattered
  triangle stamps.
- Rivers: originate in highlands, merge naturally, and terminate in sea, lakes,
  or deltas. Rivers do not split upstream without geographic reason.
- Forests: irregular masses following rainfall and terrain; use individual tree
  marks only around edges and key areas.
- Roads: connect settlements and passes; use varied importance and avoid a dense
  web at World Map zoom.
- Settlements: three visual tiers only — capital, major settlement, outpost.
- Islands: cluster near the eastern coast and a small number near major capes.
- Sea: light wave hatching and a few current lines; no ships or creatures.
- Compass: small, original, and subordinate, placed near an outer corner.

## 8. Text and interactive overlays

The raster artwork contains **no text**. The frontend owns:

- World and country names.
- Country numbers `01`–`06`.
- Topic and lesson labels.
- Quest trails and progress markers.
- Selection glow, hover, locked, visited, and completed states.
- Tooltips, cards, breadcrumbs, statistics, and accessibility text.

Create calm label zones near each country's visual center. Do not place a large
mountain, city, forest, or river confluence directly behind those zones.

Quest paths are not baked into the artwork. The art should contain believable
roads and passes that runtime quest paths can approximately follow.

## 9. Palette

Suggested master palette:

| Purpose | Color | Notes |
| --- | --- | --- |
| Parchment light | `#E8D8AE` | Main paper |
| Parchment shadow | `#B79A68` | Edge and age variation |
| Ink | `#473B2A` | Primary linework |
| Deep ink | `#2C2A22` | Coast and major mountains |
| Sea wash | `#7F9A91` | Desaturated blue-green |
| Forest wash | `#6F7F55` | Muted olive |
| Hardware wash | `#8A765B` | Stone brown |
| Software wash | `#83956A` | Central sage |
| Protocol wash | `#8E9F91` | Coastal blue-green |
| Skills wash | `#A78A72` | Warm earth |
| Advanced wash | `#777D82` | Cool slate |
| Product wash | `#A87659` | Restrained rust |
| Quest accent | `#D6A448` | UI only, not baked |

All country washes must remain muted enough that dark HTML labels meet contrast
requirements when placed on an optional translucent parchment backing.

## 10. Required deliverables

### Artwork

1. `embedded-world-base-master.png` — 3840×2160, no labels or UI.
2. `embedded-world-base.webp` — optimized production export.
3. Layered source: PSD, Krita, or equivalent with terrain categories separated.

### Interaction geometry

4. `embedded-world-country-mask.svg` — same 3840×2160 coordinate system, six
   closed non-overlapping country paths with IDs `country-01` through
   `country-06`.
5. `embedded-world-land-mask.svg` — one closed continent outline.
6. `embedded-world-label-anchors.json` — normalized label and capital anchors.

Example anchor record:

```json
{
  "country-02": {
    "label": { "x": 0.47, "y": 0.39 },
    "capital": { "x": 0.52, "y": 0.44 }
  }
}
```

### Review exports

7. JPEG previews at 1440×900, 1280×800, and 1024×768 with safe-area guides.
8. One temporary labeled proof showing country names and IDs; this proof is not
   a production asset.

## 11. Layer requirements

Recommended layer groups:

```text
00_paper
01_sea
02_continent_base
03_country_washes
04_mountains
05_rivers_lakes
06_forests
07_roads_bridges
08_settlements_landmarks
09_coastline_borders
10_compass_decoration
11_texture_grading
```

Country washes and border lines must remain editable independently of terrain.
The artist must not flatten the only master copy.

## 12. Image-model production prompt

```text
Create an original wide 16:9 hand-illustrated fantasy atlas for an educational
engineering adventure called the Embedded Realms. Show one believable connected
continent divided into six naturally formed countries. The largest country is a
broad central heartland touching nearly every other territory. The west is rocky
highland, the east has ports, straits and small islands, the south-west contains
settled guild lowlands, the far frontier is mountainous and partly uncharted,
and a small south-central maker territory sits where major routes converge.

Use intricate sepia pen-and-ink cartography on aged parchment with restrained
watercolor washes, irregular coastlines, realistic mountain chains, rivers that
flow from highlands to sea, irregular forests, roads, bridges, settlements and a
small compass rose. Political borders should follow natural terrain and use thin
dotted ink only where necessary. Keep several calm areas for later HTML labels.
Scholarly, adventurous, believable, handcrafted, richly detailed but readable.

No text, letters, numbers, UI panels, logos, heraldic house emblems, characters,
monsters, ships, watermark, modern technology icons, flat vector polygons,
bright game colors, or recognizable silhouette from an existing fictional map.
```

## 13. Negative prompt / rejection conditions

Reject the output if any of these are present:

- Recognizable Westeros or other copyrighted map silhouette.
- Six disconnected blobs instead of a believable world geography.
- Flat polygon fills, obvious Voronoi cells, or infographic styling.
- Random mountains and rivers that ignore physical geography.
- Text-like gibberish, labels, letters, heraldry, or logos.
- Country colors that overpower terrain illustration.
- Large ornamental objects consuming navigable map space.
- Important detail behind planned UI card or label safe areas.
- Country boundaries that cannot be converted to six closed SVG masks.
- A central country occupying so much space that others feel decorative.

## 14. Acceptance checklist

- [ ] The map is visibly original and does not resemble the reference silhouette.
- [ ] All six countries read as parts of one coherent continent.
- [ ] Software is clearly largest and centrally connected.
- [ ] Product Realm feels like a destination reached from multiple directions.
- [ ] Natural geography explains most political borders.
- [ ] Each country has a distinct geographic identity without literal tech icons.
- [ ] Labels remain readable when overlaid at all three review viewport sizes.
- [ ] Country masks cover the continent without overlaps or gaps.
- [ ] Raster and SVG geometry use the same coordinate system.
- [ ] No text or interactive state is baked into the production artwork.
- [ ] Assets remain usable when quest overlays are hidden.
- [ ] Layered source and production exports are both delivered.
