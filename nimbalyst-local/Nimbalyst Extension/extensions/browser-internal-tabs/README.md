# Browser internal tabs

Version `1.0.1-local.3` temporarily disables all Browser AI tools at the user's request. The manifest declares no AI tools and the built module exports an empty tool array, so Browser cannot register open/read/click/type/evaluate/screenshot tools for agents. Manual navigation, all three editor registrations, bookmarks and internal popup tabs remain available. This is a registration boundary for this extension, not a system-wide network/firewall policy for other agent tools or a local-preview network blocker. Re-enable only on an explicit user request.

Version `1.0.1-local.2` adds a bookmarks row below the address bar in Browser Session and HTML Preview editors. **☆ Lưu trang** saves the current HTTP(S) page title and exact URL; a bookmark opens in the current tab and **×** removes it. The row scrolls horizontally, and saved URLs are deduplicated. Bookmarks are persisted automatically with extension-global storage (`browser-bookmarks-v1`), shared between tabs and restored on reopening; browser-session files and document Save are independent. The native surface remains the flexible sibling below both toolbar rows, so its existing resize observer tracks the extra row. There are no new packages or permissions. Vendor files remain unchanged; the build guards and wraps exactly two toolbar sites. A limit of 100 bookmarks bounds the list; unsupported URLs and failed writes are reported rather than silently saved.

Local override of Nimbalyst Browser 1.0.1. Web links requesting a new window (`target="_blank"` or `window.open(url)`) open a new Browser editor tab in the same Nimbalyst window. The original tab remains available; ordinary links continue navigating in the current tab. Links to mail clients and other external apps retain their existing handling.

The built-in Browser files are untouched. The local extension uses the same extension ID, preserving its virtual URLs, URL storage, editors and AI tools. Nimbalyst discovers user extensions before built-in extensions and hot-reloads this local version through the Extension Developer Kit.

`vendor/browser-1.0.1.js` and `vendor/style.css` are unmodified copies from this installation. `build.mjs` replaces exactly the two existing new-window event handlers, initializes session storage on activation, and bundles `src/open-window.js` into the single extension entry point. The native Chromium surface, session lifecycle and normal navigation remain supplied by Nimbalyst. This is pinned to Browser 1.0.1 and uses the host's internal `workspace:open-file` route; review compatibility after an application update.

Link-created tabs use real `.browser.json` files in this extension's `sessions/` folder. Nimbalyst watches editor tabs as disk files; synthetic `virtual://.../link-...` paths triggered delayed “Could not refresh” warnings. Each session file is written before opening its tab, preserving the exact destination URL including redirect parameters. Files remain available after closing tabs. They contain visited URLs and should not be committed or shared; `sessions/` is excluded by this extension's `.gitignore`.

Build: `npm run build`. Routing checks: `npm test`. No package download is required; React is supplied by Nimbalyst.

The host denies native popup windows and exposes the requested URL, so this opens a fresh tab without an actual `window.opener` relationship. Sites requiring a script-controlled child window may need their normal browser flow.

To restore the bundled implementation, uninstall this local override through Extension Developer Kit and reload the built-in Browser extension. The separate Browser Launcher remains available.
