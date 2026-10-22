# Claude Inspired Theme

Author: **Hieu Tran Ngoc**.

A neutral dark Nimbalyst theme based on the user's Claude extension screenshot, replacing the previous warm-gray light palette.

## Appearance

- Theme: **Claude Extension Dark**, declared with `isDark: true`.
- Main background: **#191A1B**.
- Main text: **#BFBFBF**, soft gray rather than pure white.
- Toolbar and secondary surfaces: **#202122**.
- Code blocks and nested surfaces: **#242526**.
- Borders: **#2A2B2C**; faint labels: **#888888**.
- Orange accent/icons: **#D97757**; links: **#4AA8DA**.
- All 75 theme tokens are assigned, including tables, code, terminal, scrollbars and diff colors.
- AI session body font remains **Segoe UI 16px**, line height 1.6, paragraph spacing 16px, as previously requested. Code keeps its own font rules.

Main background, text, toolbar, code background and border values were sampled from the supplied screenshot. Secondary accent colors are adapted to fit; this is not an exact export of the reference extension's theme.

## Apply in Nimbalyst

1. Reload extension `com.local.midnight-teal` from this directory.
2. Confirm **Claude Inspired Theme** is enabled in Extensions.
3. Choose **Claude Extension Dark** in the theme picker.

The original extension/theme IDs are retained for existing installations. Transcript CSS inherits the theme colors.

## Development

Edit [manifest.json](manifest.json) or [transcript.css](transcript.css), then run `npm run build` and reload. The build checks main/muted text contrast, accent buttons, code and terminal. No npm dependencies or runtime JavaScript are required.

Version 0.5.3 has been built locally. Live Nimbalyst reload and visual verification remain pending in this Codex session. Native Acrylic/Mica transparency is not enabled by this extension.

The previous warm-gray version is preserved in `previous/0.5.1`.
