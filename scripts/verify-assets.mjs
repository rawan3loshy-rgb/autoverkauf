/**
 * Prüft, dass jeder in den Daten referenzierte Bildpfad tatsächlich existiert.
 * Läuft absichtlich ohne Buildschritt – so lässt sich der Bestand jederzeit kontrollieren.
 */
import fs from 'node:fs';

const src = fs.readFileSync('src/data/vehicles.ts', 'utf8');
const EDITORIAL = ['hero', 'ankauf', 'showroom', 'qualitaet', 'ankauf-portrait', 'ueber-uns'];

const missing = [];
let checked = 0;

const re = /gallery\('([^']+)', '[^']+', \[([^\]]*)\]\)/g;
let match;
while ((match = re.exec(src))) {
  const slug = match[1];
  const roles = match[2]
    .split(',')
    .map((r) => r.trim().replace(/'/g, ''))
    .filter(Boolean);
  if (!roles.length) missing.push(`${slug}: keine Bilder definiert`);
  for (const role of roles) {
    checked++;
    const file = `public/vehicles/${slug}/${role}.jpg`;
    if (!fs.existsSync(file)) missing.push(file);
  }
}

for (const name of EDITORIAL) {
  checked++;
  const file = `public/editorial/${name}.jpg`;
  if (!fs.existsSync(file)) missing.push(file);
}

console.log(`Bildpfade geprüft: ${checked} · fehlend: ${missing.length}`);
missing.forEach((f) => console.log(' -', f));
if (missing.length) process.exitCode = 1;
