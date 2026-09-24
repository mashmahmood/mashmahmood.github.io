# assets/video

The thesis card on the home page plays an inline, muted, looping clip:

```
uav-demo.mp4     the clip the page plays
```

One file is enough: H.264 in an MP4 container plays in every current browser, including
Safari. A second WebM copy used to be the workaround for old Safari, and VP9 is sometimes
smaller, but for this footage it came out larger, so it was dropped.

The page falls back to `assets/img/uav-poster.png` whenever the clip is missing.
The file it looks for is set in `_data/content.yml`, under the thesis project's `video:`.

## What the clip should be

| | |
|:--|:--|
| Length | 8 to 15 seconds, cut so it loops without a jarring jump |
| Aspect ratio | 16:10. The card crops anything else from the centre |
| Resolution | 1280x800, about twice the size it is displayed at |
| Frame rate | 24 or 30 fps |
| Audio | none at all, strip the track (it is muted anyway, and it saves bytes) |
| Target size | under 3 MB, ideally 1 to 2 MB |

## Encoding with ffmpeg

From a source clip that is already 16:10 (`ffmpeg` installs with
`winget install Gyan.FFmpeg`):

```bash
ffmpeg -i source.mp4 -an -vf "scale=1280:800,fps=30" \
  -c:v libx264 -profile:v main -pix_fmt yuv420p -crf 26 -preset slow \
  -movflags +faststart uav-demo.mp4
```

Raise `-crf` to shrink the file, lower it for more quality. To trim first, put
`-ss 00:00:34 -t 12` before `-i`. If the source is 16:9, crop it to 16:10 in the same
pass by making the filter `crop=ih*16/10:ih,scale=1280:800,fps=30`.

Keep it well under the GitHub limits: 100 MB per file is a hard block and repositories
are meant to stay under about 1 GB. Source footage stays out of the repo; `.gitignore`
already excludes `short.mp4`.

## Poster frame

`assets/img/uav-poster.png` is the still shown before the clip loads and whenever it is
missing. It is pixel art rather than a real frame. To use a real one instead:

```bash
ffmpeg -ss 00:00:02 -i uav-demo.mp4 -frames:v 1 -q:v 2 ../img/uav-poster.jpg
```

Then point `poster:` in `_data/content.yml` at the new file. Keep the poster at 16:10 so
nothing shifts on load.
