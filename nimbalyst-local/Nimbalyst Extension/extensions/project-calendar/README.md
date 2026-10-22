# Project Calendar

Workspace-local all-day calendar for notes, milestones, and tasks.

## What it provides

- The launcher icon opens nimbalyst-local/calendar/project.project-calendar.json in the current workspace. It uses the activation filesystem service to create an empty schema-version 1 calendar only when that file is absent; existing data is preserved.
- The *.project-calendar.json editor uses the Nimbalyst editor lifecycle for load, save, dirty state, theme changes, and external file changes.
- Month, upcoming agenda, and week timeline views. Multi-day items span their inclusive start and end dates.
- Create, edit, and delete items with an optional nimbalyst://ID tracker link. The event editor shows an “Mở tracker” link for a valid saved or edited URI.
- **Lưu lịch** saves directly from the Calendar header, using the same SDK save callback as native Save/Ctrl+S. A valid open event form is applied before saving. Pending writes lock editing; status distinguishes unsaved, saving, saved and failed writes. A failed save keeps the edits available for retry.
- JSON import supports merge or replace. Export and import keep schemaVersion 1 and timezone Asia/Ho_Chi_Minh.
- A panel-side, read-only tracker adapter lists items with startDate and items that have not been scheduled. If the query fails, manual calendar editing and links remain available.

Dates stay as plain YYYY-MM-DD values. Calendar math uses Gregorian day counts and does not convert all-day dates into timestamps.

Tracker references stay stored as short nimbalyst:// URIs. Clicking an event link or tracker-list row validates the reference, builds the Console item URL, and sends it through window.electronAPI.invoke('open-external', url). If that broker is missing or fails, the editor shows the short URI and a copy action instead of claiming the item opened.

## Data and permissions

### AI event creation — v0.1.4

Global tool `calendar_add_event` adds and saves an all-day event to the calling session's workspace calendar; no Calendar tab is required. Supply `title`, `startDate` (YYYY-MM-DD), and optionally inclusive `endDate`, `type` (`note`, `milestone`, `task`, default task), `notes`, `trackerUri` and a stable `eventId` for retries. Example: `{"title":"Sprint review","startDate":"2026-10-09","type":"milestone","trackerUri":"nimbalyst://EXS.2"}`.

The destination is always the workspace's `nimbalyst-local/calendar/project.project-calendar.json`, selected from host context. Results include `created`, the saved event/ID and file path. Identical events are deduplicated; an existing conflicting eventId is rejected rather than updated. Existing malformed data, invalid dates and locally registered editors with pending changes/open forms block the write.

AI additions and first-use launcher creation share a per-file queue in this extension runtime. The tool reads current disk data, detects changes before writing and verifies the persisted event. This is not a cross-process filesystem transaction: unrelated direct file writers and other app windows must still coordinate; the mounted-editor guard covers editors in the same extension runtime. AI sessions require access to the installed write tool. Clean editor refresh uses the existing external-change lifecycle; if necessary reopen the calendar. A stale session tool list may require refreshing or starting a new session.

The extension source contains no user calendar. The calendar file lives in the active workspace at nimbalyst-local/calendar/project.project-calendar.json. The empty-calendar.json file under fixtures is a test seed, not the live calendar.

The filesystem permission and workspace-files catalog grant the activation filesystem service used to create the calendar file. The nimbalyst-database-read permission is declared because the launcher panel uses the documented PanelHost.data.query read-only API. The adapter scopes its parameterized query to the current workspace and selects only tracker ID, key, type, title, status, and startDate. It does not read tracker body content or session data. The tracker table schema is not a stable SDK contract; the adapter reports query errors and the host version must be checked after deploy.

The editor host does not expose data.query; tracker lookup runs in the launcher panel. The editor accepts and opens manually entered nimbalyst:// links independently.

Tracker rows are scoped by workspace path. Where supplied by host v0.80.4, EditorHost.workspaceId contains that path and selects the matching snapshot, including on direct opens. The offscreen screenshot host did not supply it during parent verification. The launcher's file-to-workspace association remains a fallback for hosts without that value.

## Build and test

From this folder:

- npm test runs date, import/merge, workspace-scoped tracker, broker URL mapping/error, storage, and single-file bundle runtime/export tests.
- npm run build checks source syntax and bundles the extension into one dist/index.js. Only react and @nimbalyst/runtime remain external; dist/style.css is copied separately. The packaged v0.80.4 host exposes useEditorLifecycle through @nimbalyst/runtime, despite the SDK examples using @nimbalyst/extension-sdk.
- npm run fixture serves fixtures/calendar-ui.html at http://127.0.0.1:4173/fixtures/calendar-ui.html. The page uses fake tracker data and does not connect to Nimbalyst.

## Parent integration

1. Review and copy this staging project to <EXTENSIONS_ROOT>/project-calendar.
2. Build and install from the durable project using the host's extension development tools.
3. Open the calendar icon. The launcher creates the workspace calendar file on first use and preserves it on later launches; test save/reopen, external changes, tracker links, and adapter permission/error UI.
4. Confirm the Calendar panel can call the current host tracker_items schema and that the current host's open-external broker routes Console item URLs to the intended tracker. The panel query and native routing have not been probed from Calendar yet.

The implementing child did not install or reload the extension, write to the durable root, restart the app, or run a live Calendar host test. Parent confirmed that the host extension build/install/reload tools are callable; the remaining live check is specific to Calendar's panel query, lifecycle, and tracker links.

## Parent deployment — 2026-10-08

The parent copied this project to the durable source root above, installed it, and hot-reloaded it in packaged Nimbalyst v0.80.4. The extension reports loaded and registers the custom editor. Parent corrected the runtime import, added empty-import protection, and fixed the light/dark palette after host screenshot checks. The latest suite passes 31 tests.

The default workspace calendar was seeded with an empty document only because no file existed. A separate integration-test.project-calendar.json contains a three-day demo. Both seeds were backed up outside the app under <EXTENSIONS_ROOT>/calendar-data-backups/extension-sdk-docs-2026-10-08. Future edits need fresh backups: this is a snapshot, not automatic backup.

Host screenshots use an offscreen editor. They verify module activation, initial file load and rendering, not interactive save, external file notifications, launcher query or tracker navigation. Those acceptance checks remain open; see [HOST-VALIDATION.md](HOST-VALIDATION.md).

## Scrolling — v0.1.2

From v0.1.3, Saturday/Sunday have a subtle theme-specific background in month cells and week timeline columns. Event colors and the today marker retain their contrast.

The editor fits the host's available height. The header and **Lưu lịch** stay outside the scrolling content. Calendar and sidebar scroll independently on desktop; narrow editors use one content scroller, with the event form first while editing. Add/edit focuses the title without scrolling the host's clipped frame. Tracker refresh preserves content scroll positions.

Browser regression fixture: [calendar-scroll.html](fixtures/calendar-scroll.html), with 67 trackers inside a bounded, overflow-hidden frame. [SCROLL-RESULTS.json](fixtures/SCROLL-RESULTS.json) records five viewport runs, including short and narrow editors. Fixture Save uses memory only; the separate real-host save verification below still applies.

## Save verification — v0.1.1

Parent added the Calendar save button and ran **35/35 tests**, including file readback, native/button callback parity, write failure and retry, duplicate save requests, and invalid draft rejection. A temporary test wrapper opened the unchanged deployed Calendar in the regular Nimbalyst editor, clicked the real save button to create and edit a three-day event, then unmounted/reopened the editor and checked both its rendered content and the actual saved file. This passed; see [HOST-SAVE-RESULT.json](HOST-SAVE-RESULT.json). The test extension was uninstalled afterward. Only dedicated probe files were modified.
