import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const expected = JSON.parse(await readFile(path.join(root, 'SHA256SUMS.json'), 'utf8'));
const files = [];
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Unexpected link: ' + full);
    if (entry.isDirectory()) await scan(full);
    else if (entry.isFile()) files.push(path.relative(root, full).split(path.sep).join('/'));
  }
}
await scan(root);
const actualFiles = files.filter(file => file !== 'SHA256SUMS.json').sort();
if (JSON.stringify(actualFiles) !== JSON.stringify(Object.keys(expected).sort())) throw new Error('File list differs from SHA256SUMS.json');
for (const file of actualFiles) {
  const full = path.resolve(root, file);
  if (!full.startsWith(root + path.sep)) throw new Error('Invalid path');
  const hash = createHash('sha256').update(await readFile(full)).digest('hex');
  if (hash !== expected[file]) throw new Error('Hash mismatch: ' + file);
}
const contents = JSON.parse(await readFile(path.join(root, 'CONTENTS.json'), 'utf8'));
for (const item of contents.extensions) {
  const manifest = JSON.parse(await readFile(path.join(root, item.folder, 'manifest.json'), 'utf8'));
  if (manifest.id !== item.id || manifest.version !== item.version) throw new Error('Inventory mismatch: ' + item.folder);
  console.log(item.id + ' ' + item.version + ' OK');
}
console.log('Verified ' + actualFiles.length + ' file hashes.');
