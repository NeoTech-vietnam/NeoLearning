# Design

## Boundaries

Three sequential children own product code: reader R1–R4, notes R5, motion R6–R7. Parent owns integration. Learning Web has no registered package specs; follow shared guides. Examples, curriculum Markdown and deployment access configuration are untouched.

## Shared reader

Extract shared Markdown rendering and a Read-mode shell used for plain documents and interactive lessons. Keep split preview lightweight; keep activity placement and source editing behavior intact. Generate heading anchors from parsed Markdown structure, excluding fenced code; handle duplicate headings with stable occurrence-aware IDs. Validate saved anchors against current source; resume only on explicit user action, not unexpected load jumps. Existing lesson activity slugs remain compatible.

TOC tracks visible sections. Scroll percentage is labeled reading position, never mastery. Focus/font/width/theme controls are browser preferences, not progress. Code renderer supports copy feedback, long-block collapse and lazy syntax highlighting, with plain-text fallback. Dialog focus trapping/Escape/return-focus follow existing Modal conventions. Wide tables scroll within their own container. Preserve safe URL filtering and disabled raw HTML. Local image support must use constrained existing file access or a validated image-only endpoint, never an unrestricted file route.

## Persistence

Add typed reading/notebook contracts and a private `/api/notebook` router mounted behind existing access middleware. A separate `.data/notebook.json` owns per-document reading anchors, bookmarks and quote notes. Reuse serialized atomic-write conventions; fail visibly on corrupt storage without resetting it. GET reads, PUT position debounces, POST creates notes/bookmarks, PATCH updates notes, DELETE removes exact entries. Server validates indexed Markdown paths, bounded payloads and anchors/quotes from current content; creates IDs/timestamps. Never accept arbitrary file paths or write Markdown sources.

Quote anchors contain section identity, selected text, contextual prefix/suffix and server source revision. Only highlight a uniquely matching quote within the same revision; otherwise retain it as a detached note. Conservative revision checks also prevent bookmarks/resume from jumping to an unrelated duplicate heading after source changes. Documents may change without deleting notes. Persist individual mutations rather than replacing the entire notebook, avoiding stale client snapshots clobbering other-device notes. Errors retain local draft text and offer retry. Unsaved source drafts do not create authoritative annotations. All notebook data is shared by the existing single owner; this is not new user isolation.

## Motion

One small motion vocabulary: 150–250ms fade/translate transitions and brief achievement glow. Animate transform/opacity, avoid layout shifts and permanent loops. Do not block navigation/focus or replay achievements on initial state load. Animate EXP toward new authoritative totals while announcing final values once. Reduced motion uses immediate changes and static feedback; cancel timers/animation frames on unmount or rapid navigation.

## Compatibility and rollback

Do not migrate or rewrite learning/explorer/quest stores. Read old lesson resume as fallback when no notebook position exists. Keep activity IDs/heading slugs and existing event refresh behavior. New notebook store can remain on disk if UI/router is reverted. Existing Basic/Tailscale authentication covers all notebook routes. Production preview update follows a successful build; no commit/push without request.
