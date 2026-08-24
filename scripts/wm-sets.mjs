/**
 * Sucht auf Wikimedia Commons zusammenhängende Fotoserien EINES Fahrzeugs.
 *
 * Hintergrund: Fotografinnen und Fotografen laden ihre Aufnahmen mit fortlaufenden
 * Dateinamen hoch ("… IMG 5838", "… IMG 5839"). Bilder mit gleichem Namensstamm
 * zeigen deshalb fast immer dasselbe Auto aus verschiedenen Perspektiven – genau das,
 * was eine glaubwürdige Fahrzeuggalerie braucht.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { throttledFetch, exists, stats } from './lib-download.mjs';

const API_UA = { 'User-Agent': 'AutokunstDemo/1.0 (Designdemo; kontakt@example.com)' };
const QUERIES = JSON.parse(await fs.readFile(process.env.QUERIES || 'scripts/set-queries.json', 'utf8'));
const CACHE = process.env.CACHE_DIR || 'scripts/.cache/sets';
const MANIFEST = process.env.SETS_MANIFEST || 'scripts/.cache/sets-manifest.json';
const MAX_PER_VEHICLE = Number(process.env.MAX_PER_VEHICLE || 10);

await fs.mkdir(CACHE, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(q, limit = 50) {
  const url =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: `${q} filetype:bitmap`,
      gsrnamespace: '6',
      gsrlimit: String(limit),
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata',
      iiurlwidth: '1280',
      format: 'json',
    });
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, { headers: API_UA });
      if (r.ok) {
        const d = await r.json();
        return d?.query?.pages ? Object.values(d.query.pages) : [];
      }
    } catch {}
    await sleep(900);
  }
  return [];
}

/** "Porsche 992 Carrera S coupe IMG 5838.jpg" -> "porsche 992 carrera s coupe img" */
function stemOf(title) {
  return title
    .replace(/^File:/, '')
    .replace(/\.(jpe?g|png)$/i, '')
    .replace(/\s*\((cropped|[^)]*)\)\s*$/i, '')
    .replace(/[\s_-]+\d{1,6}[a-z]?$/i, '')
    .trim()
    .toLowerCase();
}

function normalize(page) {
  const ii = page.imageinfo?.[0];
  if (!ii) return null;
  const meta = ii.extmetadata || {};
  return {
    title: page.title,
    stem: stemOf(page.title),
    w: ii.width,
    h: ii.height,
    thumb: ii.thumburl,
    creator: (meta.Artist?.value || '').replace(/<[^>]*>/g, '').trim().slice(0, 60),
    license: (meta.LicenseShortName?.value || '').replace(/<[^>]*>/g, ''),
  };
}

const manifest = {};
try {
  Object.assign(manifest, JSON.parse(await fs.readFile(MANIFEST, 'utf8')));
} catch {}

for (const [key, queries] of Object.entries(QUERIES)) {
  const pool = new Map();
  for (const q of queries) {
    for (const page of await search(q)) {
      const item = normalize(page);
      if (!item) continue;
      if (item.w < 1280) continue;
      const ar = item.w / item.h;
      if (ar < 1.25 || ar > 2.2) continue;
      if (/logo|diagram|badge|emblem|chart|map|interior of a|engine bay/i.test(item.title)) continue;
      if (!pool.has(item.title)) pool.set(item.title, item);
    }
    await sleep(200);
  }

  // Nach Namensstamm gruppieren, größte Serien zuerst.
  const groups = new Map();
  for (const item of pool.values()) {
    if (!groups.has(item.stem)) groups.set(item.stem, []);
    groups.get(item.stem).push(item);
  }
  const ranked = [...groups.entries()]
    .map(([stem, items]) => ({ stem, items }))
    .sort((a, b) => b.items.length - a.items.length);

  const chosen = [];
  for (const g of ranked) {
    if (chosen.length >= MAX_PER_VEHICLE) break;
    const take = g.items.length >= 2 ? g.items.slice(0, 6) : g.items.slice(0, 1);
    for (const item of take) {
      if (chosen.length >= MAX_PER_VEHICLE) break;
      chosen.push({ ...item, group: g.stem, groupSize: g.items.length });
    }
  }

  const dir = path.join(CACHE, key);
  await fs.mkdir(dir, { recursive: true });
  const entries = [];

  for (let i = 0; i < chosen.length; i++) {
    const c = chosen[i];
    const file = path.join(dir, `${i}.jpg`);
    const meta = {
      i,
      file,
      group: c.group,
      groupSize: c.groupSize,
      title: c.title.replace(/^File:/, '').replace(/\.(jpe?g|png)$/i, ''),
      creator: c.creator,
      license: c.license,
      licenseUrl: '',
      source: 'Wikimedia Commons',
      landing: `https://commons.wikimedia.org/wiki/${encodeURIComponent(c.title)}`,
    };
    if (await exists(file, 20000)) {
      entries.push(meta);
      continue;
    }
    const width = c.w >= 1920 ? 1920 : 1280;
    const url = c.thumb.replace(/\/\d+px-/, `/${width}px-`).split('?')[0];
    const buf = await throttledFetch(url);
    if (!buf) continue;
    try {
      await sharp(buf).resize({ width: 1920, withoutEnlargement: true }).jpeg({ quality: 88 }).toFile(file);
      entries.push(meta);
    } catch {}
  }

  manifest[key] = entries;
  const sizes = [...new Set(entries.map((e) => `${e.group.slice(-28)}×${e.groupSize}`))];
  console.log(`[${key}] ${entries.length} · Serien: ${sizes.slice(0, 3).join(', ')} · 429=${stats.throttled}`);
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
}

console.log('SETS DONE', JSON.stringify(stats));
