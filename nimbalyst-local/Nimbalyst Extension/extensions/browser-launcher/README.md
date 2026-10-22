# Browser Launcher

Adds a globe icon labelled **Browser** to Nimbalyst's left activity bar. Clicking it opens the integrated browser in an editor tab. Clicking again focuses the same tab, preserving its current page. Closing that tab lets the icon reopen it.

Requires the built-in `com.nimbalyst.browser` extension to be enabled. This extension uses a standard panel contribution and `PanelHost.openFile` to open the Browser extension's existing virtual editor; it does not modify the application or the built-in Browser files.

Build with `npm run build`, then install this directory with the Extension Developer Kit. React is supplied by Nimbalyst, so no package download is required. Disable or uninstall **Browser Launcher** in Settings > Extensions to remove the icon.
