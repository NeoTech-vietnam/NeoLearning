import { build } from 'esbuild';
import { validateExtensionBundle } from '../node_modules/@nimbalyst/extension-sdk/dist/validate.js';
for (const [entry, outfile] of [['src/backend.ts','dist/backend.mjs'],['src/mcp-proxy.ts','dist/mcp-proxy.mjs']]) {
  await build({ entryPoints:[entry], outfile, bundle:true, platform:'node', format:'esm', target:'node22', sourcemap:true,
    banner:{js:"import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);"} });
}
const result = await validateExtensionBundle(`${process.cwd()}/dist`);
if (!result.valid) { console.error(result.errors); process.exitCode = 1; }
for (const warning of result.warnings ?? []) console.warn(warning);
