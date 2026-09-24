# mashmahmood.github.io

Personal portfolio for Mashrur Mahmood: robotics, autonomous systems and applied AI/ML.
Plain HTML, CSS and vanilla JavaScript, with the text kept in one data file that
GitHub Pages (Jekyll) fills into the page on every push.

## Files

```
_data/content.yml   ALL the words: about, education, skills, projects, awards,
                    activities, highlights, contact. Edit this, not index.html
index.html          layout only, a Jekyll template that reads content.yml
_includes/icon.html the inline SVG icons (GitHub, LinkedIn, arrows...)
_config.yml         Jekyll settings for GitHub Pages
Gemfile             local preview with Jekyll, see below
404.html            pixel art not found page, served automatically by Pages
styles.css          design tokens at the top (:root)
main.js             nav, scroll progress, reveals, project filters, stat counters, demo clip,
                    highlights scroller and its lightbox
robots.txt          crawler policy
sitemap.xml         single page sitemap
assets/img/*.webp   project images and portrait
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

## Editing content

Open `_data/content.yml`, change the text, commit and push. GitHub Pages rebuilds the
page in a minute or two. The file is YAML; the comments at its top explain the two
kinds of field (plain text versus "HTML ok") and when to use quotes. Order in the file
is order on the page.

## Preview locally

Needs Ruby (installed at `C:\Ruby40-x64`). From the project folder:

```bash
bundle install                          # first time only
bundle exec jekyll serve --livereload   # then open http://localhost:4000
```

Saving any file, including `_data/content.yml`, rebuilds the page and refreshes the
browser. Stop the server with Ctrl+C. The build output goes to `_site/`, which git ignores.

The `Gemfile` uses Jekyll 4 because the `github-pages` gem needs Ruby below 4.0. GitHub
ignores the Gemfile and builds with its own Jekyll 3.10; this page renders the same on both.

## Deploy

This is a GitHub Pages *user site*: push to `main` and it publishes at
`https://mashmahmood.github.io`. Enable it once under
**Settings > Pages > Source: Deploy from a branch > main / (root)**.

After the first deploy, submit `https://mashmahmood.github.io/sitemap.xml` in
[Google Search Console](https://search.google.com/search-console) so the page gets indexed.

## Replacing the placeholder images

To swap an image, drop the file into `assets/img/` and point the matching `image:` (or
`portrait:`) in `_data/content.yml` at it:

| Placeholder | Used for |
|:--|:--|
| `portrait.webp` | photo in the About section (square, 800x800 works) |
| `uav-poster.png` | poster frame behind the thesis clip |
| `heatexchanger.webp` | Compact heat exchanger |
| `buckling.webp` | Automated buckling rig |
| `dlsprint.webp` | DL Sprint 2.0 |
| `simulator.webp` | BRTA driving simulator |
| `aicontest.webp` | Steal the Flag AI agent |

Project images look best at roughly 16:10 (1200x750), which is exactly the shape of the
card's media box. At that ratio `object-fit: cover` neither crops nor letterboxes, so any
16:10 file drops straight in. Off ratio files are cropped from the centre, so keep the
subject there. If an image must never be cropped, for instance a diagram or a screenshot
with text near the edges, add `is-fit` to the `proj-media` wrapper in `index.html` and it
switches to `contain`.

## The thesis clip

The thesis card plays an inline muted loop. Drop `uav-demo.webm` and/or `uav-demo.mp4`
into `assets/video/`; until then the poster frame shows and nothing breaks. Encoding
recipes and size targets are in `assets/video/README.md`.

## Adding a project

Add an entry under `projects:` in `_data/content.yml`; copying an existing one is easiest:

```yaml
  - title: My New Project
    tags: [ai, robotics]          # keys from filters:, drives the filter buttons
    lead: Where or what it was
    award: 1st place              # optional
    image: assets/img/my-project.webp
    alt: What the image shows
    text: >-
      A sentence or two about it.
    chips: [Python, ROS 2]
    links:
      - label: Source on GitHub
        url: https://github.com/...
```

* `featured: true` gives the card a gradient top bar
* `spotlight: true` is the full width, media beside text treatment reserved for the thesis

The grid is `auto-fill` with a 290px minimum, so it lands on three columns at desktop
width and reflows down on its own. Order the list however reads best; it is deliberately
not chronological, so there is no year to keep in sync.

## The Highlights gallery

`#eca` ends with a horizontal scroller so photos can be added without making the page
taller. Each entry lives under `highlights:` in `_data/content.yml`:

```yaml
  - title: Title                  # shown under the thumbnail
    caption: Short context        # shown only in the lightbox, after the title
    image: assets/img/highlights/your-photo.jpg
    full: assets/img/highlights/your-photo-large.jpg   # optional, lightbox only
    alt: What the photo shows
```

* Thumbnails are 3:2 and cropped from the centre; `full` is what the lightbox shows,
  so point it at a larger file if you have one.
* Native scrolling does the work. The arrows, the edge fades and mouse dragging are added
  by `main.js` and the strip still scrolls with a trackpad, a touch swipe or the keyboard
  if that script never runs.
* The files in `assets/img/highlights/` are placeholders. Replace them with real photos
  and update their entries in `content.yml`.

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
