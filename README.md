# l8PYGIT — portfolio + donate (static)

Single-page, bilingual (Persian default / English toggle) portfolio + donation site for
**l8PYGIT**. Plain HTML/CSS/JS — no build step, no frameworks, no CDN, no webfonts, no trackers.

## Files

```
index.html            # everything: hero, about, stack, projects, donate, contact, footer
assets/style.css      # design system + layout + animations (respects prefers-reduced-motion)
assets/app.js         # FA/EN switch, copy buttons + toast, scroll reveal, status line, nav
assets/img/dashboard.png  # real RatholeHub dashboard screenshot (1440×900, lazy-loaded)
assets/img/avatar.svg     # "L8" monogram with gradient ring (also usable as social avatar)
assets/img/favicon.svg    # monogram favicon
```

## Preview locally

```bash
cd scratch/portfolio-site
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
- **Projects** are `<article class="project">` cards; private ones use `project--private`
  (dashed border + lock pill, no link), public ones use a `project-link` anchor.
- **Colors / type / radii** are CSS variables at the top of `assets/style.css` (`:root`).
- **Languages**: the toggle persists to `localStorage` (`l8-lang`); default is FA + RTL.
  Titles/descriptions for the two languages are in `TITLES` / `DESCRIPTIONS` in `assets/app.js`.

## Deploy

Copy the whole folder to the root of `l8PYGIT/l8PYGIT.github.io` (GitHub Pages user site) and push.
No actions/workflow required. If the final URL changes, update `<link rel="canonical">`,
`og:url` and `og:image` in `index.html`.

License: AGPL-3.0-or-later (consistent with the projects it links to).
