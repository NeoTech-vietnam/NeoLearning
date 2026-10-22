# Discovery Compass random territories

## Goal

Pick a country fairly then open a random nonempty terminal topic folder, with a cancellable compass animation.

## Requirements

- Approved flow: random country, then a nonempty terminal subfolder inside it; open the folder in Explore mode, not a country or individual file.
- Eligible countries have at least one terminal folder with a directly indexed lesson. Exclude countries themselves, empty folders and branches already omitted by the index.
- Equal choice among eligible countries, then equal choice among eligible folders. Exclude the last result when another exists; allow a singleton result gracefully.
- Home and Atlas have a cancellable one-second compass animation, breadcrumb result, Read here link and Spin again. Disable duplicate starts. Reduced motion skips animation.
- Only actual navigation marks a visit through the existing API. Do not grant EXP or change Quest progress.
- Browser Back/reload preserve navigation; remember the last discovery in session storage with an in-memory fallback.

## Acceptance Criteria

- [x] Pure selector tests verify recursion, eligibility, two-stage distribution, no-repeat and empty/singleton handling.
- [x] Browser tests cover actual leaf-folder opening, cancellation/no transient visits, retry, keyboard, reduced motion, mobile and mode switching.
- [x] Full quality gate passes with existing Quest/EXP changes preserved.

## Notes

- User approved the refined plan and implementation. No new API/dependency, generated images, country-size weighting, XP farming or randomized file opening.
