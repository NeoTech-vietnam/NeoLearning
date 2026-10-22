import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

let editor = await readFile(new URL('./vendor/browser-1.0.1.js', import.meta.url), 'utf8');
const replacements = [
  [
    '  Se as aiTools,',
    '  manualBrowserAiTools as aiTools,',
  ],
  [
    'async function Ie() {\n}',
    'async function Ie(context) {\n  initializeBrowserSessions(context);\n}',
  ],
  [
    '      const s = window.electronAPI;\n      m.startsWith("nim-preview://") ? A(p, m) : s?.invoke && s.invoke("open-external", m).catch(() => {\n      });',
    '      openWindowInBrowser(m).catch((error) => {\n        y(error.message || "Could not open Browser tab");\n      });',
  ],
  [
    '      const l = window.electronAPI;\n      w.startsWith("nim-preview://") ? A(s, w) : l?.invoke && l.invoke("open-external", w).catch(() => {\n      });',
    '      openWindowInBrowser(w).catch((error) => {\n        p(error.message || "Could not open Browser tab");\n      });',
  ],
];

for (const [original, replacement] of replacements) {
  if (editor.split(original).length !== 2) {
    throw new Error('Bundled Browser code changed: review the new-window integration before building.');
  }
  editor = editor.replace(original, replacement);
}
const toolbarPattern = '          ne,\n          {\n';
if (editor.split(toolbarPattern).length !== 3) throw Error('Bundled Browser toolbar changed: review bookmarks integration before building.');
editor = editor.replaceAll(toolbarPattern, '          BrowserBookmarkToolbar,\n          {\n            host: e,\n');
// The extension host loads one blob module; bundle the helper into that module.
editor = await readFile(new URL('./src/open-window.js', import.meta.url), 'utf8') + '\n' + await readFile(new URL('./src/bookmarks.js', import.meta.url), 'utf8') + '\n' + editor;
editor += '\nconst manualBrowserAiTools = [];\nconst { BookmarkToolbar: BrowserBookmarkToolbar } = createBookmarkComponents({ jsx: S, jsxs: O, useState: P, useEffect: k }, ne);\n';

await mkdir(new URL('./dist/', import.meta.url), { recursive: true });
await writeFile(new URL('./dist/index.js', import.meta.url), editor);
await writeFile(new URL('./dist/style.css', import.meta.url), await readFile(new URL('./vendor/style.css', import.meta.url), 'utf8') + '\n' + await readFile(new URL('./src/bookmarks.css', import.meta.url), 'utf8'));
for (const name of ['index.js']) {
  execFileSync(process.execPath, ['--check', fileURLToPath(new URL(`./dist/${name}`, import.meta.url))], { stdio: 'inherit' });
}
console.log('Built manual-only Browser with internal tabs and bookmarks; no AI tools exported.');
