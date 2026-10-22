# Design
No Learning Web package specs are registered. Follow existing shared TypeScript contracts, Express routers, atomic JSON stores and fixture-isolated tests, with shared cross-layer/reuse guides.

ExplorerStore owns a serialized atomic ledger in explorer.json. Reconciliation reads learning/quest catalogs and progress. Stable reward IDs deduplicate even after undo/recomplete; existing achievements receive credit. Calendar uses NEOLEARNING_TIME_ZONE (default Asia/Jakarta). Client cannot submit dates or amounts. Learning dates derive from successful attempts/completions, not visits. Level increments every 250 EXP; titles are descriptive, not certifications.

GET projects the ledger, POST sync reconciles progress, POST check-in reconciles and stamps today in one transaction. Home panel and header stats refresh on domain-progress events. QuestDetail gets stage briefing and focus mode; maps derive completed/current stops by milestone IDs, independent of folder coverage.

Nine Watchtower field clues are authored in server/explorer/clues.ts; the public endpoint strips answer keys. Successful predictions grant one stable clue reward and record a learning day; they do not change Quest completion/evidence. Ordered mode is optional quest frontmatter, enforced within the serialized ProgressStore write queue. Existing quests omit it and retain unordered semantics. Ordered detail defaults to current-stage focus; completion reveals the full journal again.
