# Environmental Watchtower quest road — design

## Route contract

A Quest is the named road; its ordered milestones are stops. Keep the current Markdown catalogue and Atlas route projection as the single route source. The new Quest uses id `environmental-watchtower`, title “Hành trình Trạm Quan trắc”, and a distinct `destination` string. Do not modify `environmental-sentinel` or migrate progress.

The route has one canonical region path per milestone:

| Stop | Country | Region path |
| --- | --- | --- |
| 1 | Hardware | `01_Hardware/01_Electronics` |
| 2 | Hardware | `01_Hardware/02_Test-Equipment` |
| 3 | Hardware | `01_Hardware/03_Prototyping-Skills` |
| 4 | Software | `02_Software/12_Sensors-and-Actuators` |
| 5 | Software | `02_Software/03_Microcontrollers` |
| 6 | Software | `02_Software/09_Testing` |
| 7 | Interfaces & Protocols | `03_Interfaces-and-Protocols/01_Basic` |
| 8 | Interfaces & Protocols | `03_Interfaces-and-Protocols/03_Wireless` |
| 9 | Interfaces & Protocols | `03_Interfaces-and-Protocols/06_Network` |

All nine milestones are required. Stops 3, 6, and 9 require evidence. The final checkpoint describes a working environmental monitor with a measured signal, transmitted reading, and test result. Each milestone has a learning objective in `description` and a concrete action in `challenge`.

## Data and UI flow

Extend the shared Quest contract and strict frontmatter parser with optional `destination` and optional milestone `challenge` strings. Their optionality keeps existing Markdown quests valid. The parser continues to validate all knowledge links against the repository and milestone order/IDs. The nine ordered `milestones[].knowledgeLinks` drive the existing world and focused Atlas roads; do not add a second itinerary list or geometry source.

Show the destination on Quest Board, Quest Detail, and the Atlas quest panel. Show each challenge beside its milestone and its evidence/status controls in Quest Detail. The Atlas panel keeps the ordered stop list and can show challenge context without duplicating progress state. Selecting a stop uses the existing hash route, so reload/history retain the selected quest and location.

The existing progress store owns completion; evidence is a non-blank learner-entered artifact path or observation, not an uploaded or verified result. Surface failed milestone saves in the Quest UI rather than allowing an uncaught promise; preserve entered evidence so the learner can retry.

## Compatibility and rollback

Existing quest definitions without the new optional fields still parse and render. Progress JSON schema/version stays unchanged, as do country geometry and content taxonomy. Removing the new Markdown quest and optional-field UI is a straightforward rollback; no migration is required. The current uncommitted Atlas optimization work is user-owned and must not be reset or mixed into unrelated edits.
