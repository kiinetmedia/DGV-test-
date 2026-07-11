// One-off build tool: pulls the "latin" subset woff2 files referenced in the
// Google Fonts CSS response and self-hosts them under src/assets/fonts,
// writing a local @font-face stylesheet fragment.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const FONT_DIR = join(ROOT, "src", "assets", "fonts");
if (!existsSync(FONT_DIR)) mkdirSync(FONT_DIR, { recursive: true });

const css = readFileSync("/tmp/gfonts.css", "utf-8");

// Split into @font-face blocks, keeping the preceding "/* subset */" comment.
const blocks = css.split(/\n\/\* /).map((b, i) => (i === 0 ? b : "/* " + b));

const latinBlocks = blocks.filter((b) => b.startsWith("/* latin */") || b.startsWith("/* latin */\n"));

const fontFaceRegex = /font-family:\s*'([^']+)';\s*font-style:\s*(\w+);\s*font-weight:\s*(\d+);\s*font-display:\s*swap;\s*src:\s*url\(([^)]+)\)/;

const results = [];
for (const block of latinBlocks) {
  const m = block.match(fontFaceRegex);
  if (!m) continue;
  const [, family, style, weight, url] = m;
  results.push({ family, style, weight, url });
}

console.log(`Found ${results.length} latin-subset font files`);

const fontFaceCss = [];

for (const r of results) {
  const familySlug = r.family.toLowerCase().replace(/\s+/g, "-");
  const fileName = `${familySlug}-${r.weight}${r.style === "italic" ? "-italic" : ""}.woff2`;
  const outPath = join(FONT_DIR, fileName);

  const res = await fetch(r.url);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buf);
  console.log(`  ${fileName}  (${(buf.length / 1024).toFixed(1)} KB)`);

  fontFaceCss.push(`@font-face {
  font-family: '${r.family}';
  font-style: ${r.style};
  font-weight: ${r.weight};
  font-display: swap;
  src: url('/src/assets/fonts/${fileName}') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`);
}

writeFileSync(join(ROOT, "src", "fonts.css"), fontFaceCss.join("\n\n") + "\n");
console.log("\nWrote src/fonts.css");
