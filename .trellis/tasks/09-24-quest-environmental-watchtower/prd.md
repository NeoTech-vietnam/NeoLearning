# Quest path: Environmental Watchtower

## Goal

Give learners one named, goal-directed route through the Embedded world: “Hành trình Trạm Quan trắc” ends with a working environmental monitor that measures a signal, transmits readings, and has test evidence. This is the first reusable example of many future roads with different destinations.

## Background

- Atlas country and nested-region navigation and an ordered cross-country Quest route already exist.
- Quest definitions are Markdown frontmatter; progress is local and separate from definitions.
- The nine proposed regions exist in the canonical curriculum tree.
- The user approved this destination and a new Quest rather than changing the existing Environmental Sentinel or its saved progress.

## Requirements

1. Add one new Quest with a stable ID, route name, explicit destination, and exactly nine ordered stops: three regions in Hardware, three in Software, and three in Interfaces & Protocols. Each stop resolves to one real top-level region.
2. Every stop presents a concrete “learn → make/prove” challenge. The last stop of each country is an evidence-required checkpoint; the final checkpoint demonstrates the destination. A learner can mark stops in progress or complete using the existing progress model.
3. The Quest Board, Quest Detail, and Atlas quest mode show the same route identity and destination. Atlas shows the ordered path across all three countries and three local regions per country. Selecting a stop opens its region.
4. Quest status survives reload/restart. Required checkpoints cannot complete with blank evidence. Existing quests, routes, and progress remain compatible.
5. Keep the canonical content tree authoritative: route stops reference its paths, not a duplicate taxonomy. Preserve keyboard/mobile navigation and meaningful error states.

## Acceptance criteria

- [ ] The new Quest is listed beside Environmental Sentinel with a distinct name and destination.
- [ ] Its ordered itinerary has exactly nine stops, grouped 3+3+3 across the specified countries; every path resolves in the content index.
- [ ] The Board, Detail, and Atlas identify the same Quest and destination; Atlas world/local routes and stop navigation work after reload and browser history.
- [ ] All nine challenges are readable; checkpoint 3, 6, and 9 require non-blank evidence before completion.
- [ ] Completing the required stops records completion; progress persists without modifying either Quest Markdown file.
- [ ] Existing Environmental Sentinel behavior and all current quality checks remain green.

## Out of scope

- A quest authoring UI, multiple newly authored routes, XP/achievements, and game-state mechanics.
- Uploading or automatically verifying artifacts, building physical firmware/PCB in this web task, or prescribing one hardware board/sensor.
- Changing existing Environmental Sentinel progress or unrelated Atlas artwork/layout.
