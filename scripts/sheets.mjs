/** Baut je Fahrzeug einen Kontaktbogen mit nummerierten Kacheln zur Sichtprüfung. */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const manifest = JSON.parse(await fs.readFile(process.env.MANIFEST || 'scripts/.cache/wm-manifest.json', 'utf8'));
const SHEETS = 'scripts/.cache/sheets';
await fs.mkdir(SHEETS, { recursive: true });

const TW = 320;
const TH = 213;
const COLS = 6;

const only = process.argv[2];

for (const [key, entries] of Object.entries(manifest)) {
  if (only && key !== only) continue;
  if (!entries.length) {
    console.log(key, 'EMPTY');
    continue;
  }

  const comps = [];
  for (let n = 0; n < entries.length; n++) {
    const x = (n % COLS) * TW;
    const y = Math.floor(n / COLS) * TH;
    const tile = await sharp(entries[n].file).resize(TW, TH, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer();
    comps.push({ input: tile, left: x, top: y });
    const svg = `<svg width="${TW}" height="34" xmlns="http://www.w3.org/2000/svg"><rect width="54" height="28" x="4" y="4" fill="#000" opacity="0.85"/><text x="31" y="24" font-family="Arial" font-size="17" fill="#fff" text-anchor="middle">${entries[n].i}</text></svg>`;
    comps.push({ input: Buffer.from(svg), left: x, top: y });
  }

  const rows = Math.ceil(entries.length / COLS);
  await sharp({ create: { width: COLS * TW, height: rows * TH, channels: 3, background: '#101011' } })
    .composite(comps)
    .jpeg({ quality: 82 })
    .toFile(path.join(SHEETS, `${key}.jpg`));

  console.log(key, entries.length);
}
console.log('SHEETS DONE');
