# Design
Reuse canonicalCountries, ContentNode, atlasHash/editorHash and AtlasReady visit tracking. No Learning Web package specs are registered; follow shared reuse/cross-layer guides and existing pure projection/React/fixture testing conventions.

discovery.ts builds immutable country pools by recursively collecting non-country folders with no folder children and at least one indexed lesson. Selector draws country first, then region, using injectable random values for deterministic tests. Removing the previous result may exclude a now-empty country; uniformity applies to the remaining eligible pools. Empty pools produce no selection.

DiscoveryCompass shares the selector/UI between Home (fetch tree on first use) and Atlas (reuse loaded root). One chosen result is committed only after animation finishes; decorative country cycling never navigates. Timers are cancelled on Cancel, unmount or hash changes. A one-shot ref guards rapid double starts. Session storage holds only the last folder path, never mastery state; storage failure falls back to in-memory state.

Navigate to atlasHash(folderPath) without quest/review parameters. On arrival an inline result shows the full trail and first document link. Result visibility follows the selected path, not unrelated navigation. Existing visit persistence records only the destination; selector and animation perform no domain writes.
