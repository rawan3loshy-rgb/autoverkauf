import fs from 'node:fs/promises';
import path from 'node:path';

const UA = 'NovaMotorsDemo/1.0 (educational demo; contact: demo@example.com)';
const queries = JSON.parse(await fs.readFile('scripts/queries.json', 'utf8'));
const OUT = 'scripts/.cache';
await fs.mkdir(OUT, { recursive: true });

async function search(q, limit = 14) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=900&format=json&origin=*`;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) return [];
  const d = await r.json();
  const pages = d?.query?.pages ? Object.values(d.query.pages) : [];
  return pages.map((p) => {
    const ii = p.imageinfo?.[0];
    if (!ii) return null;
    const meta = ii.extmetadata || {};
    return {
      title: p.title,
      w: ii.width,
      h: ii.height,
      thumb: ii.thumburl,
      full: ii.url,
      license: (meta.LicenseShortName?.value || '').replace(/<[^>]*>/g, ''),
      artist: (meta.Artist?.value || '').replace(/<[^>]*>/g, '').trim().slice(0, 60),
    };
  }).filter(Boolean);
}

const all = {};
for (const [key, qs] of Object.entries(queries)) {
  const seen = new Set();
  const list = [];
  for (const q of qs) {
    const res = await search(q);
    for (const item of res) {
      if (seen.has(item.title)) continue;
      if (item.w < 1200) continue;
      const ar = item.w / item.h;
      if (ar < 1.15 || ar > 2.6) continue;
      if (/\.svg$|logo|map|diagram|badge|emblem|chart/i.test(item.title)) continue;
      seen.add(item.title);
      list.push({ ...item, q });
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  all[key] = list;
  console.log(key, list.length);
}
await fs.writeFile(path.join(OUT, 'candidates.json'), JSON.stringify(all, null, 2));
console.log('done');
