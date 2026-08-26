# mashmahmood.github.io

Personal portfolio for Mashrur Mahmood: robotics, autonomous systems and applied AI/ML.
Plain HTML, CSS and vanilla JavaScript. No build step, no dependencies.

## Files

```
index.html          all content lives here
404.html            pixel art not found page, served automatically by Pages
styles.css          design tokens at the top (:root)
main.js             nav, scroll progress, reveals, project filters, stat counters, demo clip,
                    highlights scroller and its lightbox
robots.txt          crawler policy
sitemap.xml         single page sitemap
.nojekyll           tells GitHub Pages to serve files as they are
assets/img/*.svg    placeholder artwork (replace with real images)
assets/img/og-cover.png    social share card, 1200x630
assets/img/uav-poster.png  poster frame for the thesis clip
assets/img/highlights/     photos for the Highlights gallery in the ECA section
assets/video/       the thesis demo clip goes here, see the README in that folder
Mashrur_Resume.pdf  linked from the hero, nav and contact section
```

## Sections

| id | Section | Contains |
|:--|:--|:--|
| `#top` | Hero | Welcome line, social icon links, resume |
| `#about` | About | Personal intro, portrait, education and training, toolkit |
| `#projects` | Projects | Filterable card grid, no chronology, thesis spotlighted at the top |
| `#eca` | ECA & Awards | Competitive programming stats, award list, activities, Highlights gallery |
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
| `uav-poster.png` | poster frame behind the thesis clip |
| `heatexchanger.svg` | Compact heat exchanger |
| `buckling.svg` | Automated buckling rig |
| `dlsprint.svg` | DL Sprint 2.0 |
| `simulator.svg` | BRTA driving simulator |
| `aicontest.svg` | Steal the Flag AI agent |

Project images look best at roughly 16:10 (1200x750), which is exactly the shape of the
card's media box. At that ratio `object-fit: cover` neither crops nor letterboxes, so any
16:10 file drops straight in. Off ratio files are cropped from the centre, so keep the
subject there. If an image must never be cropped, for instance a diagram or a screenshot
with text near the edges, add `is-fit` to its wrapper and it switches to `contain`:

```html
<div class="proj-media is-fit"> ... </div>
```

## The thesis clip

The thesis card plays an inline muted loop. Drop `uav-demo.webm` and/or `uav-demo.mp4`
into `assets/video/`; until then the poster frame shows and nothing breaks. Encoding
recipes and size targets are in `assets/video/README.md`.

## Adding a project

Copy any `<li class="proj">` block inside `#projectList`, then set:

* `data-tags` to one or more of `ai`, `robotics`, `mechanical`, `games`
  (this is what the filter buttons read)
* add `is-featured` to the `<article class="proj-card">` for a gradient top bar
* `is-spotlight` on the `<li>` is the full width, media beside text treatment
  reserved for the thesis

The grid is `auto-fill` with a 290px minimum, so it lands on three columns at desktop
width and reflows down on its own. Order the list however reads best; it is deliberately
not chronological, so there is no year to keep in sync.

## The Highlights gallery

`#eca` ends with a horizontal scroller so photos can be added without making the page
taller. Each entry is one `<li>` inside `#galTrack`:

```html
<li>
  <figure class="gal-item">
    <button class="gal-shot" type="button"
            data-full="assets/img/highlights/your-photo.jpg"
            data-caption="Title, short context"
            aria-label="Open a larger view: Title">
      <img src="assets/img/highlights/your-photo.jpg" alt="What the photo shows"
           width="1200" height="800" loading="lazy" decoding="async">
    </button>
    <figcaption>
      <span class="gal-title">Title</span>
      <span class="gal-sub">Short context</span>
    </figcaption>
  </figure>
</li>
```

* Thumbnails are 3:2 and cropped from the centre; `data-full` is what the lightbox shows,
  so point it at a larger file if you have one.
* Native scrolling does the work. The arrows, the edge fades and mouse dragging are added
  by `main.js` and the strip still scrolls with a trackpad, a touch swipe or the keyboard
  if that script never runs.
* The files in `assets/img/highlights/` are placeholders. Replace them with real photos
  and update `alt`, `gal-title` and `gal-sub`.

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
* `og-cover.png` and `uav-poster.png` were generated as pixel art. Replace them with real
  images whenever you like; keep `og-cover.png` at 1200x630.
* The thesis clip autoplays muted and only while it is on screen. Under
  `prefers-reduced-motion` it stops autoplaying and shows normal controls instead.
