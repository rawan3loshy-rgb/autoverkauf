/**
 * Erzeugt aus der kuratierten Auswahl (scripts/selection.json) die finalen Bild-Assets
 * unter /public und schreibt den Bildnachweis nach src/data/image-credits.ts.
 *
 * Referenzformat einer Auswahl:
 *   "s:3"              -> Serienbild 3 des Fahrzeugs (scripts/.cache/sets-manifest.json)
 *   "p:6"              -> Poolbild 6 des Fahrzeugs   (scripts/.cache/wm-manifest.json)
 *   "p:_editorial:8"   -> Poolbild 8 aus einem anderen Schlüssel
 *
 * Alle Aufnahmen bekommen eine gemeinsame, zurückhaltende Farbabstimmung, damit Fotos
 * unterschiedlicher Herkunft nebeneinander nicht auseinanderfallen.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const readJson = async (p, fallback = {}) => {
  try {
    return JSON.parse(await fs.readFile(p, 'utf8'));
  } catch {
    return fallback;
  }
};

const POOL = await readJson('scripts/.cache/wm-manifest.json');
const SETS = await readJson('scripts/.cache/sets-manifest.json');
const selection = await readJson('scripts/selection.json');

/** Zielformate der redaktionellen Flächen. */
const EDITORIAL = {
  hero: { w: 2400, ar: 16 / 9, grade: 'cinematic', position: 'centre' },
  ankauf: { w: 2000, ar: 16 / 9, grade: 'cinematic', position: 'centre' },
  showroom: { w: 1500, ar: 3 / 4, grade: 'editorial', position: 'centre' },
  qualitaet: { w: 1400, ar: 4 / 3, grade: 'editorial', position: 'centre' },
  'ankauf-portrait': { w: 1200, ar: 4 / 3, grade: 'editorial', position: 'centre' },
  'ueber-uns': { w: 1200, ar: 4 / 5, grade: 'editorial', position: 'centre' },
};

const credits = [];
const problems = [];

function resolve(ref, defaultKey) {
  if (typeof ref !== 'string') return null;
  const parts = ref.split(':');
  const source = parts[0];
  const key = parts.length === 3 ? parts[1] : defaultKey;
  const index = Number(parts[parts.length - 1]);
  const manifest = source === 's' ? SETS : POOL;
  const entries = manifest[key] || [];
  return entries.find((e) => e.i === index) || null;
}

function grade(pipeline, kind) {
  if (kind === 'cinematic') {
    return pipeline.modulate({ saturation: 0.8, brightness: 0.95 }).linear(1.1, -14);
  }
  if (kind === 'editorial') {
    return pipeline.modulate({ saturation: 0.88 }).linear(1.06, -8);
  }
  // Fahrzeugaufnahmen: nur eine Spur ruhiger, damit die Lackfarbe glaubwürdig bleibt.
  return pipeline.modulate({ saturation: 0.93 }).linear(1.035, -5);
}

async function render({ source, out, width, aspect, kind, position = 'attention' }) {
  const height = Math.round(width / aspect);
  await fs.mkdir(path.dirname(out), { recursive: true });
  const pipeline = sharp(source).rotate().resize(width, height, { fit: 'cover', position });
  await grade(pipeline, kind).jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(out);
}

function pushCredit(entry, file) {
  credits.push({
    file,
    title: (entry.title || '').replace(/\s+/g, ' ').trim().slice(0, 90),
    creator: (entry.creator || '').replace(/\s+/g, ' ').trim().slice(0, 70),
    license: entry.license || '',
    licenseUrl: entry.licenseUrl || '',
    landing: entry.landing || '',
  });
}

// --- Fahrzeuge -------------------------------------------------------------
const vehicleRoles = {};
for (const [slug, roles] of Object.entries(selection.vehicles || {})) {
  vehicleRoles[slug] = [];
  for (const [role, ref] of Object.entries(roles)) {
    const entry = resolve(ref, slug);
    if (!entry) {
      problems.push(`${slug}/${role}: "${ref}" nicht auflösbar`);
      continue;
    }
    const out = path.join('public/vehicles', slug, `${role}.jpg`);
    await render({ source: entry.file, out, width: 1600, aspect: 3 / 2, kind: 'vehicle', position: 'centre' });
    pushCredit(entry, `/vehicles/${slug}/${role}.jpg`);
    vehicleRoles[slug].push(role);
  }
  console.log(`✓ ${slug} (${vehicleRoles[slug].length})`);
}

// --- Redaktionelle Flächen -------------------------------------------------
for (const [name, spec] of Object.entries(EDITORIAL)) {
  const ref = (selection.editorial || {})[name];
  const entry = resolve(ref, '_editorial');
  if (!entry) {
    problems.push(`editorial/${name}: "${ref}" nicht auflösbar`);
    continue;
  }
  const out = path.join('public/editorial', `${name}.jpg`);
  await render({ source: entry.file, out, width: spec.w, aspect: spec.ar, kind: spec.grade, position: spec.position });
  pushCredit(entry, `/editorial/${name}.jpg`);
  console.log(`✓ editorial/${name}`);
}

// --- Bildnachweis ----------------------------------------------------------
const unique = [];
const seen = new Set();
for (const c of credits) {
  const id = `${c.title}|${c.creator}`;
  if (seen.has(id)) continue;
  seen.add(id);
  unique.push(c);
}

await fs.writeFile(
  'src/data/image-credits.ts',
  `export interface ImageCredit {
  file: string;
  title: string;
  creator: string;
  license: string;
  licenseUrl: string;
  landing: string;
}

/** Wird von scripts/build-assets.mjs erzeugt. Nicht von Hand bearbeiten. */
export const imageCredits: ImageCredit[] = ${JSON.stringify(unique, null, 2)};
`,
);

// Rollenübersicht für den Abgleich mit data/vehicles.ts
await fs.writeFile('scripts/.cache/roles.json', JSON.stringify(vehicleRoles, null, 2));

if (problems.length) {
  console.log('\nOFFEN:');
  problems.forEach((p) => console.log(' -', p));
  process.exitCode = 1;
} else {
  console.log(`\nFertig. ${credits.length} Dateien, ${unique.length} Nachweise.`);
}
