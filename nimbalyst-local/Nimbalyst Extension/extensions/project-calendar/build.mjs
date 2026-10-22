import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('./', import.meta.url);
const sourceFiles = [
  'src/index.js',
  'src/model.js',
  'src/paths.js',
  'src/tracker-adapter.js',
  'src/workspace-storage.js',
  'src/save-bridge.js',
  'src/calendar-app.js',
  'src/calendar-ai.js',
];
const externals = ['react', '@nimbalyst/runtime'];
const manifest = JSON.parse(await readFile(new URL('manifest.json', root), 'utf8'));
const moduleSet = new Set(sourceFiles);

function parseBindings(specifierList) {
  return specifierList.split(',').map((raw) => raw.trim()).filter(Boolean).map((binding) => {
    const match = /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(binding);
    if (!match) throw new Error('Unsupported import binding: ' + binding);
    return match[2] ? match[1] + ': ' + match[2] : match[1];
  });
}

function bundleModule(modulePath, input) {
  const exports = [];
  let source = input.replace(/^import\s*\{([\s\S]*?)\}\s*from\s*(['"])([^'"]+)\2\s*;?\s*$/gm,
    (_statement, bindings, _quote, specifier) => {
      const destructuring = parseBindings(bindings).join(', ');
      if (externals.includes(specifier)) {
        return 'const { ' + destructuring + ' } = __external[' + JSON.stringify(specifier) + '];';
      }
      if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
        throw new Error(modulePath + ' imports unsupported package ' + specifier);
      }
      const dependency = path.posix.normalize(path.posix.join(path.posix.dirname(modulePath), specifier));
      if (!moduleSet.has(dependency)) throw new Error(modulePath + ' imports missing module ' + dependency);
      return 'const { ' + destructuring + ' } = __require(' + JSON.stringify(dependency) + ');';
    });

  if (/^\s*import\b/m.test(source)) throw new Error(modulePath + ' contains an unsupported import form');
  source = source.replace(/^export\s+(?=(?:(?:async\s+)?(?:function|const|let|class)\s+))/gm, '');
  for (const match of input.matchAll(/^export\s+(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)) {
    if (!exports.includes(match[1])) exports.push(match[1]);
  }
  if (/^\s*export\b/m.test(source)) throw new Error(modulePath + ' contains an unsupported export form');

  return {
    exports,
    code: JSON.stringify(modulePath) + ': function(__exports, __require, __external) {\n' +
      source + '\nObject.assign(__exports, {' + exports.join(', ') + '});\n}',
  };
}

for (const sourceFile of sourceFiles) {
  execFileSync(process.execPath, ['--check', fileURLToPath(new URL(sourceFile, root))], { stdio: 'inherit' });
}

const modules = [];
let entryExports = [];
for (const sourceFile of sourceFiles) {
  const source = await readFile(new URL(sourceFile, root), 'utf8');
  const bundled = bundleModule(sourceFile, source);
  modules.push(bundled.code);
  if (sourceFile === 'src/index.js') entryExports = bundled.exports;
}
if (!['activate', 'components', 'panels'].every((name) => entryExports.includes(name))) {
  throw new Error('Entry must export activate, components, and panels for Nimbalyst.');
}

const externalImports = externals.map((name, index) =>
  'import * as __external' + index + ' from ' + JSON.stringify(name) + ';').join('\n');
const externalMap = 'const __external = Object.freeze({' + externals.map((name, index) =>
  JSON.stringify(name) + ': __external' + index).join(', ') + '});';
const bundle = [
  externalImports,
  externalMap,
  'const __factories = {' + modules.join(',\n') + '};',
  'const __cache = Object.create(null);',
  'function __require(id) {',
  '  if (__cache[id]) return __cache[id];',
  '  const factory = __factories[id];',
  '  if (typeof factory !== "function") throw new Error("Unknown bundled module: " + id);',
  '  const exports = {};',
  '  __cache[id] = exports;',
  '  factory(exports, __require, __external);',
  '  return exports;',
  '}',
  'const __entry = __require("src/index.js");',
  ...entryExports.map((name) => name === 'components'
    ? 'export const components = { ...__entry.components, CalendarEditor: __entry.components.CalendarEditor };'
    : 'export const ' + name + ' = __entry.' + name + ';'),
  '',
].join('\n');

const distUrl = new URL('dist/', root);
await mkdir(distUrl, { recursive: true });
for (const entry of await readdir(distUrl, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.js')) await rm(new URL(entry.name, distUrl));
}
const outputUrl = new URL('dist/index.js', root);
await writeFile(outputUrl, bundle, 'utf8');
execFileSync(process.execPath, ['--check', fileURLToPath(outputUrl)], { stdio: 'inherit' });
await copyFile(new URL('src/style.css', root), new URL('dist/style.css', root));
console.log('Bundled ' + manifest.name + ' ' + manifest.version + ' into dist/index.js; React and @nimbalyst/runtime stay external.');
