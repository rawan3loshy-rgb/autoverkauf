import fs from 'node:fs/promises';

export const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  Accept: 'image/avif,image/webp,image/*,*/*',
  'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let queue = Promise.resolve();
let gap = 3000;
export const stats = { ok: 0, fail: 0, throttled: 0 };

/**
 * Global serialisierter Download.
 *
 * upload.wikimedia.org limitiert hart und schickt bei Überschreitung `Retry-After: 10`.
 * Wer dann weiter anklopft, hält den Bucket dauerhaft leer – deshalb wird der Wert
 * exakt eingehalten und die Grundpause danach angehoben.
 */
export function throttledFetch(url) {
  const run = async () => {
    for (let attempt = 0; attempt < 9; attempt++) {
      await sleep(gap);
      let res;
      try {
        res = await fetch(url, { headers: HEADERS });
      } catch {
        await sleep(3000);
        continue;
      }
      if (res.status === 429) {
        stats.throttled++;
        const ra = Number(res.headers.get('retry-after'));
        const wait = (Number.isFinite(ra) && ra > 0 ? ra : 10) * 1000 + 700;
        gap = Math.min(gap + 400, 6000);
        await sleep(wait);
        continue;
      }
      if (!res.ok) {
        stats.fail++;
        return null;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      stats.ok++;
      gap = Math.max(2600, gap - 100);
      return buf;
    }
    stats.fail++;
    return null;
  };
  const next = queue.then(run, run);
  queue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

export async function exists(p, min = 3000) {
  try {
    const st = await fs.stat(p);
    return st.size > min;
  } catch {
    return false;
  }
}

/**
 * Verteilt die Kandidaten reihum über die Suchanfragen, damit ein Ausschnitt der
 * Liste alle Perspektiven abdeckt und nicht nur Frontansichten enthält.
 */
export function interleaveByQuery(list) {
  const buckets = new Map();
  for (const item of list) {
    if (!buckets.has(item.q)) buckets.set(item.q, []);
    buckets.get(item.q).push(item);
  }
  const out = [];
  const groups = [...buckets.values()];
  for (let i = 0; out.length < list.length; i++) {
    let added = false;
    for (const g of groups) {
      if (g[i]) {
        out.push(g[i]);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}
