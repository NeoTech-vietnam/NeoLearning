# Quest Expedition and explorer EXP

## Goal

Turn quests into guided expeditions and add durable daily check-in, experience, levels and reward history.

## Requirements

- Reuse existing quest challenges, simulations, evidence and journals. Add current-stage briefing, focus mode, destination summary and map explorer markers without locking free exploration.
- Durable daily check-in (5 EXP), successful activity (20), milestone (50), evidence checkpoint (100), quest (200). Reward each stable achievement once, including historical completions. Never subtract EXP after a missed day.
- Show calendar, separate check-in/learning streaks, levels, titles and reward history. Server owns dates and point amounts; no client-granted rewards.
- Preserve legacy progress, curriculum and existing navigation. Support phone, keyboard and reduced motion.

## Acceptance Criteria

- [x] Repeated/concurrent check-in and sync never duplicate rewards; restart retains data.
- [x] Corrupted ledger fails visibly; calendar follows documented server timezone.
- [x] Existing and new unit/browser quality gates pass.

## Notes

- User explicitly approved the proposed scope and delegated remaining decisions: "Thực hiện hết đi, hãy tự quyết định". This overrides another planning approval round.
- Exclude multiplayer, uploads, hardware verification, leaderboard and level-locked knowledge.
