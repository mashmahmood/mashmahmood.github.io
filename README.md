# mashmahmood.github.io

Personal portfolio — robotics, autonomous systems and applied AI/ML.
Plain HTML, CSS and vanilla JS. No build step, no dependencies.

## Files

```
index.html          all content lives here
styles.css          theme tokens at the top (:root)
main.js             hero reveal, rotating word, nav
assets/img/*.svg    placeholder images (replace with real ones)
Mashrur_Resume.pdf  linked from the hero and contact section
```

## Preview locally

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy

This is a GitHub Pages *user site*: push to `main` and it publishes at
`https://mashmahmood.github.io`. Enable it once under
**Settings → Pages → Source: Deploy from a branch → main / (root)**.

## Replacing the placeholder images

Every image is an SVG placeholder in `assets/img/`. To swap one in, drop your real
file next to it and update the `src` in `index.html`:

| Placeholder | Used for |
|---|---|
| `portrait.svg` | photo in the About section |
| `uav.svg` | Autonomous Indoor UAV |
| `dlsprint.svg` | DL Sprint 2.0 |
| `aicontest.svg` | Steal the Flag AI agent |
| `simulator.svg` | BRTA driving simulator |
| `buckling.svg` | Automated buckling rig |
| `heatexchanger.svg` | Compact heat exchanger |

Project cards look best with roughly 16:10 images (1200×750 works well).

## Changing the theme

All colours are CSS variables at the top of `styles.css`:

```css
--bg: #0B0F14;  --surface: #121820;  --text: #E6EDF3;
--muted: #8A97A6;  --accent: #34D399;
```

The rotating words in the hero are the `WORDS` array in `main.js`.

## Notes

- Phone number and the referee contact details from the resume are deliberately
  **not** on the public page.
- All motion is disabled automatically under `prefers-reduced-motion`.
