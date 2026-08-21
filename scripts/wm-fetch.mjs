/**
 * Lädt die Wikimedia-Commons-Kandidaten in den Cache.
 *
 * upload.wikimedia.org drosselt hart (Retry-After: 10). Der Downloader hält den Wert
 * exakt ein; dadurch kommen im Schnitt rund zehn Bilder pro Minute durch.
 * Die Kandidaten werden reihum über die Suchanfragen verteilt, damit ein Ausschnitt
 * alle Perspektiven abdeckt und nicht nur Frontansichten.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { throttledFetch, exists, stats, interleaveByQuery } from './lib-download.mjs';

const KEY_MAP = {
  'porsche-911-carrera-4-gts': 'porsche-911-carrera-4-gts',
  'mercedes-amg-g63': 'mercedes-amg-g-63',
  'bmw-m4-competition': 'bmw-m4-competition-xdrive',
  'audi-rs6-avant': 'audi-rs-6-avant-performance',
  'bmw-x5-m-competition': 'bmw-x5-m-competition',
  'mercedes-amg-gt-63-s': 'mercedes-amg-gt-63-s',
  'porsche-taycan-4s': 'porsche-taycan-4s',
  'range-rover-sport': 'range-rover-sport-d350',
  'land-rover-defender-110': 'land-rover-defender-110-d300',
  'vw-touareg-r-line': 'vw-touareg-r-line-v6-tdi',
  'bmw-530e': 'bmw-530e-limousine-m-sport',
  'mercedes-e220d-tmodell': 'mercedes-e-220-d-t-modell',
  'audi-q5-55-tfsi-e': 'audi-q5-55-tfsi-e-quattro',
  'bmw-430i-cabrio': 'bmw-430i-cabrio-m-sport',
  'audi-a6-avant': 'audi-a6-avant-45-tfsi-quattro',
  'vw-golf-gti-clubsport': 'vw-golf-gti-clubsport',
  _editorial: '_editorial',
};

const raw = JSON.parse(await fs.readFile('scripts/.cache/candidates.json', 'utf8'));
const CACHE = 'scripts/.cache/wm';
const PER_KEY = Number(process.env.PER_KEY || 12);
const MANIFEST = 'scripts/.cache/wm-manifest.json';

await fs.mkdir(CACHE, { recursive: true });

let manifest = {};
try {
  manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
} catch {}

const plan = {};
for (const [oldKey, list] of Object.entries(raw)) {
  const key = KEY_MAP[oldKey] || oldKey;
  plan[key] = interleaveByQuery(list).slice(0, PER_KEY);
}

let done = 0;
const total = Object.values(plan).reduce((n, l) => n + l.length, 0);
const started = Date.now();

for (const [key, list] of Object.entries(plan)) {
  const dir = path.join(CACHE, key);
  await fs.mkdir(dir, { recursive: true });
  const entries = [];

  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    const file = path.join(dir, `${i}.jpg`);
    const meta = {
      i,
      file,
      q: c.q,
      w: c.w,
      h: c.h,
      title: (c.title || '').replace(/^File:/, '').replace(/\.(jpg|jpeg|png)$/i, ''),
      creator: c.artist || '',
      license: c.license || '',
      licenseUrl: '',
      source: 'Wikimedia Commons',
      landing: `https://commons.wikimedia.org/wiki/${encodeURIComponent(c.title || '')}`,
    };

    if (await exists(file, 20000)) {
      entries.push(meta);
      done++;
      continue;
    }

    // Wikimedia erlaubt nur feste Vorschaubreiten – alles andere quittiert der
    // Thumbnailer mit HTTP 400.
    const width = c.w >= 1920 ? 1920 : c.w >= 1280 ? 1280 : null;
    const url = (width ? c.thumb.replace(/\/\d+px-/, `/${width}px-`) : c.thumb).split('?')[0];
    const buf = await throttledFetch(url);
    done++;

    if (buf) {
      try {
        await sharp(buf).resize({ width: 1920, withoutEnlargement: true }).jpeg({ quality: 88 }).toFile(file);
        entries.push(meta);
      } catch {}
    }

    if (done % 10 === 0) {
      const mins = (Date.now() - started) / 60000;
      const rate = done / Math.max(mins, 0.01);
      const eta = (total - done) / Math.max(rate, 0.01);
      console.log(
        `${done}/${total} ok=${stats.ok} 429=${stats.throttled} · ${mins.toFixed(1)} min · ETA ${eta.toFixed(0)} min`,
      );
    }
  }

  manifest[key] = entries;
  console.log(`[${key}] ${entries.length}/${list.length}`);
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
}

console.log('WM DONE', JSON.stringify(stats));
