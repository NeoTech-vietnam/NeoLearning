import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
execFileSync(process.execPath, ['--check', fileURLToPath(new URL('src/index.js', import.meta.url))], { stdio: 'inherit' });
await mkdir(new URL('dist/', import.meta.url), { recursive: true });
let source = await readFile(new URL('src/index.js', import.meta.url), 'utf8');
for (const module of ['sessions', 'events', 'characters', 'weather', 'rendering']) {
  execFileSync(process.execPath, ['--check', fileURLToPath(new URL(`src/${module}.js`, import.meta.url))], { stdio: 'inherit' });
  const pattern = new RegExp(`^import \\{[^\\n]+\\} from '\\./${module}\\.js';\\r?$`, 'gm');
  if ([...source.matchAll(pattern)].length !== 1) throw Error(`${module} adapter import changed; update the bundler.`);
  source = source.replace(pattern, '') + '\n' + await readFile(new URL(`src/${module}.js`, import.meta.url), 'utf8');
}
await writeFile(new URL('dist/index.js', import.meta.url), source);
execFileSync(process.execPath, ['--check', fileURLToPath(new URL('dist/index.js', import.meta.url))], { stdio: 'inherit' });
await copyFile(new URL('src/style.css', import.meta.url), new URL('dist/style.css', import.meta.url));
console.log('Built Agent Office with live workspace sessions and a separate demo. No model calls.');
