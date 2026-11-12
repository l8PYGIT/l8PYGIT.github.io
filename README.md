# l8PYGIT — portfolio + donate (static)

Single-page, bilingual (Persian default / English toggle) portfolio + donation site for
**l8PYGIT**. Plain HTML/CSS/JS — no build step, no frameworks, no CDN, no webfonts, no trackers.

Design language: **Apple-inspired** — light surfaces, system typography, generous whitespace,
soft radii and a single blue accent (`#0071e3`, Apple system blue) instead of a rainbow palette.

## Sections

Hero → About → Focus areas (the four things I build) → Stack → Projects (with per-project
documentation links) → Documentation hub → Donate → Contact.

## Files

```
index.html            # everything: hero, about, areas, stack, projects, docs, donate, contact
assets/style.css      # design tokens (:root) + layout + animations (respects prefers-reduced-motion)
assets/app.js         # FA/EN switch, copy buttons + toast, scroll reveal, status line, nav
assets/img/dashboard.png  # real RatholeHub dashboard screenshot (1440×900, lazy-loaded)
assets/img/avatar.svg     # "L8" monogram with gradient ring (also usable as social avatar)
assets/img/favicon.svg    # monogram favicon
```

## Preview locally

```bash
python -m http.server 8090
# open http://127.0.0.1:8090/
```

(You can also open `index.html` directly; clipboard falls back to `execCommand` outside
secure contexts.)

## Editing content

- **Copy (FA / EN)** lives in `index.html` as pairs: the visible Persian text is the element
  content, the English translation is in `data-en="..."` (or `data-en-alt` / `data-en-aria`
  for image alt text and ARIA labels). Edit both sides of a pair.
- **Crypto addresses** appear twice: visible in `<code class="addr">` and in the copy button's
  `data-copy="..."`. Keep them identical. Add/remove a donate card by copying one
  `<article class="donate-card">` block and changing `data-network` (used in the ARIA label
  and toast).
- **Focus areas** are `<article class="area-card">` blocks; the chips at the bottom link to the
  matching projects.
- **Projects** are `<article class="project">` cards; private ones use `project--private`
  (muted surface + lock pill, no link), public ones use `project-link` anchors (repository +
  docs/wiki where the repo actually has one).
- **Documentation hub** (`#docs`) reuses the `contact-card` component — one card per doc entry
  point (docs site, `docs/` source, releases, per-project wikis).
- **Theme**: every color, radius and font is a CSS variable in `:root` at the top of
  `assets/style.css`. Change `--blue*` to re-skin the accent; `--bg` / `--bg-alt` swap the
  light/gray section rhythm.
- **Languages**: the toggle persists to `localStorage` (`l8-lang`); default is FA + RTL.
  Titles/descriptions for the two languages are in `TITLES` / `DESCRIPTIONS` in `assets/app.js`.

## Deploy

This folder *is* the root of `l8PYGIT/l8PYGIT.github.io` (GitHub Pages user site) — commit and
push `main`; Pages serves it at <https://l8pygit.github.io/>. No Actions workflow required.
If the final URL changes, update `<link rel="canonical">`, `og:url` and `og:image` in `index.html`.

License: AGPL-3.0-or-later (consistent with the projects it links to).