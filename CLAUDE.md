# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Local Development

This is a pure static HTML/CSS/JS site with no build step. To preview locally (required for the partial-include fetch() calls to work — they fail on `file://`):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Architecture

### Partial Includes (Header/Footer)
`partials/header.html` and `partials/footer.html` are shared components. They are **not** server-side includes — they are fetched at runtime by `assets/js/main.js` using `fetch()`. Any element with `data-include="<url>"` gets its content replaced with the fetched HTML.

### `{{ROOT}}` Token
Partials use `{{ROOT}}` as a placeholder for the relative path back to the site root. `getRootPrefix()` in `main.js` computes this at runtime based on the current URL depth (e.g., pages in `standorte/` get `../`, root pages get `""`). This makes the same `header.html` work at both `/index.html` and `/standorte/dachau.html`.

### Page Types
- **Root pages**: `index.html`, `leistungen.html`, `standorte.html`, `kontakt.html`, etc. — link assets with relative paths directly (e.g., `assets/css/styles.css`)
- **Service pages**: `leistungen-*.html` — same depth as root
- **Location pages**: `standorte/*.html` — one level deep; link assets with `../assets/...`

### Adding a New Location Page
Copy an existing `standorte/*.html`, update the title, meta description, canonical URL, and Schema.org structured data. The `{{ROOT}}` token handling in `main.js` and partials handles navigation links automatically.

## Key Files
- `assets/css/styles.css` — single stylesheet; uses CSS custom properties defined in `:root`
- `assets/js/main.js` — handles partial includes and burger menu init
- `partials/header.html` / `partials/footer.html` — shared nav/footer using `{{ROOT}}` tokens
- `ai-context.json` / `llms.txt` — structured context files for AI assistants about the business
- `sitemap.xml` — must be updated manually when pages are added/removed

## Deployment
Hosted on GitHub Pages at `https://4rjn.github.io/entruempelung-jetzt.de/`. Canonical URLs and Schema.org `@id` values in each page's `<script type="application/ld+json">` reference this base URL and must be updated if pages are added.
