import { mkdir, copyFile, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const source = new URL('./src/index.js', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('./manifest.json', import.meta.url), 'utf8'));
execFileSync(process.execPath, ['--check', fileURLToPath(source)], { stdio: 'inherit' });
await mkdir(new URL('./dist/', import.meta.url), { recursive: true });
await copyFile(source, new URL('./dist/index.js', import.meta.url));
console.log(`Built ${manifest.name} ${manifest.version}. React is provided by Nimbalyst.`);
