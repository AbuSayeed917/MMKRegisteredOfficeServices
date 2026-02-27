/**
 * PWA Icon Generator
 * Generates all required PWA icon sizes from a source SVG.
 * Usage: node scripts/generate-icons.mjs
 */

import sharp from "sharp";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "icons");

mkdirSync(OUT_DIR, { recursive: true });

// Source icon: cyan-to-blue gradient square with "M" in navy
const createIconSvg = (size, padding = 0) => {
  const innerSize = size - padding * 2;
  const fontSize = Math.round(innerSize * 0.5);
  const radius = Math.round(size * 0.18);
  const yOffset = Math.round(fontSize * 0.36);

  return Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0ea5e9"/>
          <stop offset="100%" stop-color="#38bdf8"/>
        </linearGradient>
      </defs>
      <rect x="${padding}" y="${padding}" width="${innerSize}" height="${innerSize}" rx="${radius}" fill="url(#bg)"/>
      <text x="50%" y="50%" dy="${yOffset}" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${fontSize}" fill="#0c2d42" text-anchor="middle">M</text>
    </svg>
  `);
};

const icons = [
  // Standard icons
  { name: "icon-192x192.png", size: 192, padding: 0 },
  { name: "icon-512x512.png", size: 512, padding: 0 },
  // Maskable icons (with safe-zone padding — 10% on each side)
  { name: "icon-maskable-192x192.png", size: 192, padding: 19 },
  { name: "icon-maskable-512x512.png", size: 512, padding: 51 },
  // Apple touch icon
  { name: "apple-touch-icon.png", size: 180, padding: 0 },
];

console.log("Generating PWA icons...\n");

for (const icon of icons) {
  const svg = createIconSvg(icon.size, icon.padding);
  const outPath = join(OUT_DIR, icon.name);

  await sharp(svg).png().toFile(outPath);

  console.log(`  ${icon.name} (${icon.size}x${icon.size})`);
}

console.log(`\nDone! ${icons.length} icons generated in public/icons/`);
