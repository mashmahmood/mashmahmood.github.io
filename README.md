# mashmahmood.github.io

Personal portfolio for Mashrur Mahmood: robotics, autonomous systems and applied AI/ML.
Plain HTML, CSS and vanilla JavaScript. No build step, no dependencies.

## Files

```
index.html          all content lives here
styles.css          design tokens at the top (:root)
main.js             nav, scroll progress, reveals, project filters, stat counters
robots.txt          crawler policy
sitemap.xml         single page sitemap
.nojekyll           tells GitHub Pages to serve files as they are
assets/img/*.svg    placeholder artwork (replace with real images)
assets/img/og-cover.png  social share card, 1200x630
Mashrur_Resume.pdf  linked from the hero, nav and contact section
```

## Sections

| id | Section | Contains |
|:--|:--|:--|
| `#top` | Hero | Welcome line, social icon links, resume |
| `#about` | About | Bio, education facts, portrait, full toolkit |
| `#projects` | Projects | Filterable chronological timeline, including the industrial attachment |
| `#eca` | ECA & Awards | Competitive programming stats, award list, activities |
| `#contact` | Contact | Email block and profile icons |

## Preview locally

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy

This is a GitHub Pages *user site*: push to `main` and it publishes at
`https://mashmahmood.github.io`. Enable it once under
**Settings > Pages > Source: Deploy from a branch > main / (root)**.

After the first deploy, submit `https://mashmahmood.github.io/sitemap.xml` in
[Google Search Console](https://search.google.com/search-console) so the page gets indexed.

## Replacing the placeholder images

Every project image is an SVG placeholder in `assets/img/`. To swap one in, drop your real
file next to it and update the `src` in `index.html`:

| Placeholder | Used for |
|:--|:--|
| `portrait.svg` | photo in the About section (square, 800x800 works) |
| `uav.svg` | Autonomous Indoor UAV |
| `heatexchanger.svg` | Compact heat exchanger |
| `plant.svg` | Industrial attachment |
| `buckling.svg` | Automated buckling rig |
| `dlsprint.svg` | DL Sprint 2.0 |
| `simulator.svg` | BRTA driving simulator |
| `aicontest.svg` | Steal the Flag AI agent |

Project images look best at roughly 16:10 (1200x750). They are cropped with
`object-fit: cover`, so keep the subject near the centre.

## Adding a project

Copy any `<li class="tl-item">` block inside `#projectList`, then set:

* `data-tags` to one or more of `ai`, `robotics`, `mechanical`, `games`
  (this is what the filter buttons read)
* the `<p class="tl-year">` value, and keep the list ordered newest first
* add `is-featured` to the `<article class="tl-card">` for a gradient top bar

## Theme

All colours are CSS variables at the top of `styles.css`:

```css
--bg: #07090E;  --surface: #10141D;  --text: #E9EEF8;  --muted: #8D99AE;
--accent: #5EEAD4;  --accent-2: #A78BFA;  --accent-3: #FBBF24;
```

Fonts: **Silkscreen** (pixel display), **Space Grotesk** (body and headings),
**JetBrains Mono** (meta labels). All three come from Google Fonts.

## Notes

* Phone number and the referee contact details from the resume are deliberately
  **not** on the public page.
* The award list has no outbound links by design; the same evidence is linked from
  the matching project entries.
* All motion is disabled automatically under `prefers-reduced-motion`.
* `og-cover.png` was generated as pixel art. Regenerate or replace it if the tagline changes.
