// One-off build tool: converts raster assets to compressed WebP/AVIF.
// Run with: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdirSync, statSync, mkdirSync, existsSync } from "fs";
import { join, extname, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const RASTER_EXT = new Set([".png", ".jpg", ".jpeg"]);

// Hero gets a full responsive multi-width srcset (webp + avif).
const HERO_FILES = new Set(["hero-image.png"]);
const HERO_WIDTHS = [480, 768, 1024, 1400];

// Editorial/full-bleed images — single width, generous quality.
const LARGE_MAX_WIDTH = 1600;
// Card/thumbnail/detail-panel images.
const THUMB_MAX_WIDTH = 1000;
// Small logos/strip images.
const LOGO_MAX_WIDTH = 320;

const THUMB_DIRS = ["products", "vas"];
const LOGO_DIRS = ["clientele/strip"];

let converted = 0;
let totalBefore = 0;
let totalAfter = 0;

function targetWidthFor(fullPath) {
  const rel = fullPath.split("src/assets/")[1] ?? "";
  if (LOGO_DIRS.some((d) => rel.startsWith(d))) return LOGO_MAX_WIDTH;
  if (THUMB_DIRS.some((d) => rel.startsWith(d))) return THUMB_MAX_WIDTH;
  return LARGE_MAX_WIDTH;
}

async function convertOne(fullPath) {
  const before = statSync(fullPath).size;
  totalBefore += before;

  const dir = dirname(fullPath);
  const name = basename(fullPath, extname(fullPath));
  const img = sharp(fullPath, { failOn: "none" });
  const meta = await img.metadata();

  if (HERO_FILES.has(basename(fullPath))) {
    for (const w of HERO_WIDTHS) {
      if (meta.width && w > meta.width) continue;
      const pipeline = () => sharp(fullPath).resize({ width: w, withoutEnlargement: true });
      const webpOut = join(dir, `${name}-${w}.webp`);
      const avifOut = join(dir, `${name}-${w}.avif`);
      await pipeline().webp({ quality: 78 }).toFile(webpOut);
      await pipeline().avif({ quality: 62 }).toFile(avifOut);
      totalAfter += statSync(webpOut).size + statSync(avifOut).size;
      converted += 2;
    }
    // Also emit a default (unsuffixed) webp at the largest width for non-srcset fallback use.
    const fallback = join(dir, `${name}.webp`);
    await sharp(fullPath)
      .resize({ width: HERO_WIDTHS[HERO_WIDTHS.length - 1], withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(fallback);
    totalAfter += statSync(fallback).size;
    converted += 1;
    return;
  }

  const maxWidth = targetWidthFor(fullPath);
  const out = join(dir, `${name}.webp`);
  const pipeline = sharp(fullPath);
  if (meta.width && meta.width > maxWidth) {
    pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }
  await pipeline.webp({ quality: 76 }).toFile(out);
  totalAfter += statSync(out).size;
  converted += 1;
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (RASTER_EXT.has(extname(entry).toLowerCase())) files.push(full);
  }
  return files;
}

async function main() {
  const assetsDir = join(ROOT, "src", "assets");
  const files = walk(assetsDir);
  console.log(`Found ${files.length} raster images under src/assets`);

  for (const f of files) {
    try {
      await convertOne(f);
      process.stdout.write(".");
    } catch (err) {
      console.error(`\nFailed: ${f}`, err.message);
    }
  }

  console.log(`\n\nConverted ${converted} output files.`);
  console.log(`Before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`After:  ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved:  ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%`);
}

main();
