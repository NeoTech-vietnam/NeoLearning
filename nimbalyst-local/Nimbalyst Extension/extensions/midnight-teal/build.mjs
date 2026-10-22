import { readFile, mkdir, writeFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('./manifest.json', import.meta.url), 'utf8'));
const theme = manifest.contributions.themes[0];

function luminance(hex) {
  const rgb = hex.slice(1).match(/.{2}/g).map(channel => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

// Check readability on all three solid surfaces before packaging.
for (const surface of ['bg', 'bg-secondary', 'bg-tertiary']) {
  for (const foreground of ['text', 'text-muted']) {
    const values = [luminance(theme.colors[surface]), luminance(theme.colors[foreground])];
    const ratio = (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
    if (ratio < 4.5) throw new Error(`${foreground} on ${surface}: contrast ${ratio.toFixed(2)} is below 4.5:1`);
    console.log(`${foreground} on ${surface}: ${ratio.toFixed(2)}:1`);
  }
}

// Also check solid accent buttons, code surfaces, and terminal text.
for (const [foreground, surface] of [['on-primary', 'primary'], ['code-text', 'code-bg'], ['terminal-fg', 'terminal-bg']]) {
  const values = [luminance(theme.colors[surface]), luminance(theme.colors[foreground])];
  const ratio = (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
  if (ratio < 4.5) throw new Error(`${foreground} on ${surface}: contrast ${ratio.toFixed(2)} is below 4.5:1`);
  console.log(`${foreground} on ${surface}: ${ratio.toFixed(2)}:1`);
}

await mkdir(new URL('./dist/', import.meta.url), { recursive: true });
const css = await readFile(new URL('./transcript.css', import.meta.url), 'utf8');
await writeFile(new URL('./dist/transcript.css', import.meta.url), css);
await writeFile(new URL('./dist/manifest.json', import.meta.url), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Built ${manifest.name}: theme and AI transcript CSS, no JavaScript bundle required.`);
