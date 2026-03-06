// --- HTML Includes (Header/Footer) ---
// Lädt alle Elemente mit [data-include] per fetch() und ersetzt deren Inhalt.
// Wichtig: Auf GitHub Pages mit Custom Domain (entrümpelung-jetzt.de) funktionieren
// absolute Pfade wie /partials/... zuverlässig. (Bei Repo-Subpath müsste man anpassen.)

// --- Root-Prefix Helper (GitHub Pages Subfolder & Custom Domain kompatibel) ---
function getRootPrefix() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const repoName = 'entruempelung-jetzt.de';
  let idx = parts.indexOf(repoName);
  if (idx === -1) idx = -1; // Custom-Domain: Site liegt im Root
  const after = idx === -1 ? parts : parts.slice(idx + 1); // Pfad innerhalb der Site
  // depth = Anzahl Ordner (ohne Dateiname)
  const depth = Math.max(0, after.length - 1);
  return '../'.repeat(depth);
}

function resolveRootToken(s) {
  const prefix = getRootPrefix();
  return (s || '').replace(/\{\{ROOT\}\}/g, prefix);
}

async function loadIncludes() {
 const targets = Array.from(document.querySelectorAll('[data-include]'));
 for (const el of targets) {
 let url = el.getAttribute('data-include');
  if (!url) continue;
  url = resolveRootToken(url);
 try {
 const res = await fetch(url, { cache: 'no-cache' });
 if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
 const html = await res.text();
      el.innerHTML = resolveRootToken(html);
 } catch (e) {
 console.error('Include failed:', e);
 el.innerHTML = `<div style="padding:12px;border:1px solid rgba(255,0,0,.35);border-radius:12px">
 Include konnte nicht geladen werden: <code>${url}</code><br>
 Tipp: Prüfe, ob <code>${url}</code> im Root vorhanden ist.
 </div>`;
 }
 }
}

// Burger-Menü Hook (wird nach Include erneut ausgeführt)
function initBurger() {
 const btn = document.querySelector('[data-burger]');
 const menu = document.querySelector('[data-mobile-menu]');
 if (btn && menu) {
 btn.addEventListener('click', () => {
 const isHidden = menu.hasAttribute('hidden');
 if (isHidden) menu.removeAttribute('hidden');
 else menu.setAttribute('hidden', '');
 btn.setAttribute('aria-expanded', String(isHidden));
 });
 }
}

(async () => {
 // 1) includes laden (Header/Footer kommen erst danach ins DOM)
 await loadIncludes();

 // 2) danach Interaktionen initialisieren
 initBurger();
})();
