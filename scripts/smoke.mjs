/**
 * Funktionsprüfung der Demo: Navigation, Filter, Galerie, Formulare.
 * Aufruf: node scripts/smoke.mjs [port]
 */
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = process.argv[2] || '57001';
const BASE = `http://localhost:${PORT}`;

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const consoleErrors = [];
const failedRequests = [];
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160));
});
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + String(e).slice(0, 160)));
page.on('requestfailed', (r) => {
  // Abgebrochene Prefetches beim Seitenwechsel sind normal und kein Fehler.
  if (r.failure()?.errorText !== 'net::ERR_ABORTED') failedRequests.push(r.url());
});
page.on('response', (r) => {
  if (r.status() === 404) failedRequests.push(`404 ${r.url()}`);
});

const text = () => page.evaluate(() => document.body.innerText);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Seiten erreichbar ---------------------------------------------------
for (const path of ['/', '/fahrzeuge', '/ankauf', '/aufbereitung', '/ueber-uns', '/kontakt', '/impressum', '/datenschutz', '/agb']) {
  const res = await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  check(`Seite ${path}`, res?.status() === 200, `HTTP ${res?.status()}`);
}

// --- 404 ------------------------------------------------------------------
{
  const res = await page.goto(`${BASE}/fahrzeuge/gibt-es-nicht`, { waitUntil: 'networkidle2' });
  const body = await text();
  check('404-Seite', res?.status() === 404 && body.includes('Bestand'), `HTTP ${res?.status()}`);
}

// --- Filter ---------------------------------------------------------------
await page.goto(`${BASE}/fahrzeuge`, { waitUntil: 'networkidle2' });
{
  const before = await page.$eval('main', (el) => el.innerText.match(/(\d+)\s+Fahrzeuge?\s+gefunden/)?.[1]);
  // Marke BMW anhaken
  const clicked = await page.evaluate(() => {
    const labels = [...document.querySelectorAll('aside label')];
    const bmw = labels.find((l) => l.textContent.trim().startsWith('BMW'));
    if (!bmw) return false;
    bmw.click();
    return true;
  });
  await wait(500);
  const after = await page.$eval('main', (el) => el.innerText.match(/(\d+)\s+Fahrzeuge?\s+gefunden/)?.[1]);
  check('Filter Marke BMW', clicked && after === '4', `${before} -> ${after}`);
  check('Filter schreibt URL', page.url().includes('marke=BMW'), page.url().replace(BASE, ''));

  // Chip entfernen
  await page.evaluate(() => {
    const chip = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'BMW');
    chip?.click();
  });
  await wait(400);
  const reset = await page.$eval('main', (el) => el.innerText.match(/(\d+)\s+Fahrzeuge?\s+gefunden/)?.[1]);
  check('Filter-Chip entfernen', reset === before, `${reset} von ${before}`);
}

// --- Filter aus URL -------------------------------------------------------
{
  await page.goto(`${BASE}/fahrzeuge?karosserie=SUV`, { waitUntil: 'networkidle2' });
  const n = await page.$eval('main', (el) => el.innerText.match(/(\d+)\s+Fahrzeuge?\s+gefunden/)?.[1]);
  check('URL-Filter Karosserie=SUV', n === '6', `${n} Treffer`);
}
{
  await page.goto(`${BASE}/fahrzeuge?preisBis=50000`, { waitUntil: 'networkidle2' });
  const n = await page.$eval('main', (el) => el.innerText.match(/(\d+)\s+Fahrzeuge?\s+gefunden/)?.[1]);
  check('URL-Filter preisBis=50000', Number(n) >= 1 && Number(n) < 16, `${n} Treffer`);
}

// --- Freitextsuche --------------------------------------------------------
{
  await page.goto(`${BASE}/fahrzeuge`, { waitUntil: 'networkidle2' });
  await page.type('input[type="search"]', 'kombi', { delay: 15 });
  await wait(500);
  const n = await page.$eval('main', (el) => el.innerText.match(/(\d+)\s+Fahrzeuge?\s+gefunden/)?.[1]);
  check('Freitextsuche "kombi"', n === '3', `${n} Treffer`);
}

// --- Leerergebnis ---------------------------------------------------------
{
  await page.goto(`${BASE}/fahrzeuge?q=zzzz`, { waitUntil: 'networkidle2' });
  const body = await text();
  check('Leerzustand', body.includes('Kein Fahrzeug passt zu dieser Auswahl.'));
}

// --- Detailseite & Galerie ------------------------------------------------
{
  await page.goto(`${BASE}/fahrzeuge/audi-rs-6-avant-performance`, { waitUntil: 'networkidle2' });
  const body = await text();
  check('Detail: Preis', body.includes('119.900 €'));
  check('Detail: Fahrzeugdaten', body.includes('Erstzulassung') && body.includes('02/2024'));
  check('Detail: Leistung kW/PS', body.includes('463 kW / 630 PS'));

  await wait(600);
  const counterBefore = await page.$eval('main', (el) => el.innerText.match(/(\d+) \/ \d+/)?.[1]);
  await page.evaluate(() => {
    document.querySelector('[aria-label="Nächstes Bild"]')?.click();
  });
  await wait(700);
  const counterAfter = await page.$eval('main', (el) => el.innerText.match(/(\d+) \/ \d+/)?.[1]);
  check('Galerie: Weiterblättern', counterBefore === '1' && counterAfter === '2', `${counterBefore} -> ${counterAfter}`);

  await page.evaluate(() => document.querySelector('[aria-label="Bild vergrößern"]')?.click());
  await wait(400);
  const lightbox = await page.evaluate(() => !!document.querySelector('[role="dialog"][aria-modal="true"]'));
  check('Galerie: Lightbox öffnet', lightbox);
  await page.keyboard.press('Escape');
  await wait(300);
  const closed = await page.evaluate(() => !document.querySelector('[role="dialog"][aria-modal="true"]'));
  check('Galerie: Lightbox schließt', closed);

  // Ausstattung aufklappen
  const opened = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Infotainment'));
    if (!btn) return false;
    btn.click();
    return true;
  });
  await wait(250);
  check('Ausstattung aufklappbar', opened && (await text()).includes('Bang & Olufsen'));
}

// --- Verkauftes Fahrzeug --------------------------------------------------
{
  await page.goto(`${BASE}/fahrzeuge/vw-touareg-r-line-v6-tdi`, { waitUntil: 'networkidle2' });
  // innerText liefert durch text-transform Großschreibung – deshalb unabhängig von Groß-/Kleinschreibung prüfen.
  const body = (await text()).toLowerCase();
  check('Verkauft: Status sichtbar', body.includes('verkauft'));
  check('Verkauft: Suchauftrag statt Probefahrt', body.includes('suchauftrag aufgeben') && !body.includes('probefahrt anfragen'));
}

// --- Anfrageformular Validierung -----------------------------------------
{
  await page.goto(`${BASE}/kontakt`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button[type="submit"]')].pop();
    btn?.click();
  });
  await wait(400);
  const body = await text();
  check('Kontakt: Pflichtfeldprüfung', body.includes('Vorname wird benötigt.') && body.includes('Datenschutzhinweise'));

  await page.type('#vorname', 'Katharina');
  await page.type('#nachname', 'Renner');
  await page.type('#email', 'nicht-valide');
  await wait(150);
  await page.evaluate(() => [...document.querySelectorAll('button[type="submit"]')].pop()?.click());
  await wait(300);
  check('Kontakt: E-Mail-Prüfung', (await text()).includes('Bitte prüfen Sie die E-Mail-Adresse.'));

  await page.evaluate(() => {
    const el = document.querySelector('#email');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, 'k.renner@example.de');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.evaluate(() => {
    const label = [...document.querySelectorAll('label')].find((l) => l.textContent.includes('Datenschutzhinweise'));
    label?.click();
  });
  await wait(200);
  await page.evaluate(() => [...document.querySelectorAll('button[type="submit"]')].pop()?.click());
  await wait(1600);
  const done = await text();
  check('Kontakt: Bestätigung', done.includes('Vielen Dank.') && /#AK-\d{5}/.test(done), (done.match(/#AK-\d{5}/) || [''])[0]);
}

// --- Ankauf: mehrstufiges Formular ---------------------------------------
{
  await page.goto(`${BASE}/ankauf`, { waitUntil: 'networkidle2' });

  const clickWeiter = async () => {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Weiter');
      b?.click();
    });
    await wait(450);
  };
  const pickSelect = async (labelText, optionText) => {
    await page.evaluate((lt) => {
      const field = [...document.querySelectorAll('label')].find((l) => l.textContent.trim().startsWith(lt));
      const trigger = field?.parentElement?.querySelector('button[role="combobox"]');
      trigger?.click();
    }, labelText);
    await wait(280);
    await page.evaluate((ot) => {
      const opt = [...document.querySelectorAll('[role="option"]')].find((o) => o.textContent.trim() === ot);
      opt?.click();
    }, optionText);
    await wait(280);
  };

  await clickWeiter();
  check('Ankauf: Schritt 1 blockt leer', (await text()).includes('Marke wird benötigt.'));

  await pickSelect('Marke', 'Mercedes-Benz');
  await page.type('#modell', 'C 220 d T-Modell');
  await pickSelect('Baujahr', '2021');
  await page.type('#km', '96500');
  check('Ankauf: Tausenderpunkte', (await page.$eval('#km', (el) => el.value)) === '96.500');
  await clickWeiter();
  check('Ankauf: Schritt 2 erreicht', (await text()).includes('Technische Daten'));

  await pickSelect('Kraftstoff', 'Diesel');
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button[role="radio"]')].find((x) => x.textContent.includes('Automatik'));
    b?.click();
  });
  await page.type('#ps', '200');
  await page.type('#farbe', 'Selenitgrau Metallic');
  await clickWeiter();
  check('Ankauf: Schritt 3 erreicht', (await text()).includes('Zustand des Fahrzeugs'));

  await page.evaluate(() => {
    const radios = [...document.querySelectorAll('button[role="radio"]')];
    radios.filter((r) => r.textContent.trim() === 'Ja').slice(0, 2).forEach((r) => r.click());
    radios.find((r) => r.textContent.includes('Sehr gut'))?.click();
  });
  await pickSelect('Anzahl Vorbesitzer', '1');
  await clickWeiter();
  check('Ankauf: Schritt 4 erreicht', (await text()).includes('Ihre Kontaktdaten'));
  check('Ankauf: Zusammenfassung mitgeführt', (await text()).includes('C 220 d T-Modell') && (await text()).includes('96.500 km'));

  await page.type('#vorname-ankauf', 'Jonas');
  await page.type('#nachname-ankauf', 'Wittkamp');
  await page.type('#telefon-ankauf', '0511 8823410');
  await page.type('#email-ankauf', 'j.wittkamp@example.de');
  await page.evaluate(() => {
    const label = [...document.querySelectorAll('label')].find((l) => l.textContent.includes('Datenschutzhinweise'));
    label?.click();
  });
  await wait(200);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button[type="submit"]')].find((x) => x.textContent.includes('Ankauf anfragen'));
    b?.click();
  });
  await wait(1700);
  const done = await text();
  check('Ankauf: Bestätigung', done.includes('Vielen Dank.') && done.toLowerCase().includes('ankaufsanfrage'), (done.match(/#AK-\d{5}/) || [''])[0]);
}

// --- Inzahlungnahme -------------------------------------------------------
{
  await page.goto(`${BASE}/ankauf?anlass=inzahlungnahme`, { waitUntil: 'networkidle2' });
  const body = (await text()).toLowerCase();
  check('Inzahlungnahme-Variante', body.includes('auf ihren kaufpreis angerechnet') && body.includes('inzahlungnahme'));
}

// --- Fahrzeugaufbereitung -------------------------------------------------
{
  await page.goto(`${BASE}/aufbereitung`, { waitUntil: 'networkidle2' });
  await wait(900); // Radix setzt role="combobox" erst nach der Hydration.
  const body = await text();
  check('Aufbereitung: Leistungen', ['Innenraum', 'Außenbereich', 'Lack & Politur', 'Leasingrückgabe'].every((t) => body.includes(t)));
  check('Aufbereitung: Leasingrückgabe-Block', body.includes('Leasingrückgabe steht bevor?'));
  check(
    'Aufbereitung: keine Leasing-Garantie',
    !/garant|kostenlos übernommen|ohne Nachzahlung/i.test(body) && body.includes('liegt beim Leasinggeber'),
  );
  check('Aufbereitung: Anfrageformular', body.includes('Aufbereitung anfragen'));

  await page.waitForSelector('[role="combobox"]', { timeout: 8000 }).catch(() => {});
  const topic = await page.$eval('[role="combobox"]', (el) => el.textContent.trim()).catch(() => null);
  check('Aufbereitung: Formular vorbelegt', topic === 'Fahrzeugaufbereitung', String(topic));
}

// --- Finanzierung ist entfernt --------------------------------------------
{
  const res = await page.goto(`${BASE}/finanzierung`, { waitUntil: 'domcontentloaded' });
  check('Finanzierung entfernt', res?.status() === 404, `HTTP ${res?.status()}`);

  await page.goto(BASE, { waitUntil: 'networkidle2' });
  const home = await text();
  check('Startseite ohne Finanzierung', !/Finanzierung|Schlussrate|Leasingrate/i.test(home));
  check('Startseite mit Aufbereitung', home.includes('Perfekt vorbereitet.'));
}

// --- mobile.de ------------------------------------------------------------
{
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href*="home.mobile.de"]')].map((a) => ({
      href: a.getAttribute('href'),
      target: a.getAttribute('target'),
      rel: a.getAttribute('rel'),
    })),
  );
  check('mobile.de: CTA vorhanden', links.length >= 1, `${links.length} Link(s)`);
  check(
    'mobile.de: korrekte Händler-URL',
    links.every((l) => l.href === 'https://home.mobile.de/AUTOKUNSTLANGENHAGENLANGENHAGEN'),
    links[0]?.href ?? '-',
  );
  check('mobile.de: neuer Tab', links.every((l) => l.target === '_blank'), links[0]?.target ?? '-');
  check(
    'mobile.de: rel-Attribute',
    links.every((l) => (l.rel || '').includes('noreferrer') && (l.rel || '').includes('noopener')),
    links[0]?.rel ?? '-',
  );
  check('mobile.de: kein iframe', (await page.$$('iframe')).length === 0);
}

// --- Standort Langenhagen -------------------------------------------------
{
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  const body = await text();
  check('Standort: Langenhagen', body.includes('Langenhagen'));
  check('Standort: Anschrift', body.includes('Ikarusallee 2') && body.includes('30179'));
}

// --- Hero-Suche -----------------------------------------------------------
{
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const t = [...document.querySelectorAll('button[role="combobox"]')].find((b) => b.getAttribute('aria-label') === 'Marke');
    t?.click();
  });
  await wait(300);
  await page.evaluate(() => {
    const opt = [...document.querySelectorAll('[role="option"]')].find((o) => o.textContent.trim() === 'Porsche');
    opt?.click();
  });
  await wait(700);
  check('Hero-Suche: Zähler aktualisiert', (await text()).includes('2 Fahrzeuge im Bestand'));
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button[type="submit"]')].find((x) => x.textContent.includes('Fahrzeuge anzeigen'));
    b?.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
  await wait(600);
  check('Hero-Suche: führt zur Liste', page.url().includes('/fahrzeuge?marke=Porsche'), page.url().replace(BASE, ''));
}

// --- Mobile ---------------------------------------------------------------
{
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  const bar = await page.evaluate(() => {
    const el = [...document.querySelectorAll('a')].find((a) => a.textContent.trim() === 'Anrufen');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { bottom: Math.round(r.bottom), height: Math.round(r.height), href: el.getAttribute('href') };
  });
  check('Mobile: Aktionsleiste', !!bar && bar.href.startsWith('tel:') && bar.height >= 44, JSON.stringify(bar));

  await page.evaluate(() => document.querySelector('[aria-label="Menü öffnen"]')?.click());
  await wait(400);
  const menu = await text();
  check('Mobile: Menü öffnet', menu.includes('Fahrzeuge') && menu.includes('Aufbereitung'));
  await page.setViewport({ width: 1440, height: 900 });
}

// --- Konsole & Ressourcen -------------------------------------------------
const realErrors = consoleErrors.filter((e) => !e.includes('favicon') && !e.includes('404'));
check('Keine Konsolenfehler', realErrors.length === 0, realErrors.slice(0, 3).join(' | '));
// 'gibt-es-nicht' und '/finanzierung' werden absichtlich angesteuert und müssen 404 liefern.
const missing = [...new Set(failedRequests)].filter(
  (u) => !u.includes('favicon') && !u.includes('gibt-es-nicht') && !u.includes('/finanzierung'),
);
check('Keine fehlenden Ressourcen', missing.length === 0, missing.slice(0, 3).join(' | '));

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} Prüfungen bestanden`);
if (failed.length) process.exitCode = 1;
