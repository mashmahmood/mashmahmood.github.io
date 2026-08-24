# assets/video

The thesis card on the home page plays an inline, muted, looping clip. It looks for these
two files, in this order, and falls back to `assets/img/uav-poster.png` when neither is
present:

```
uav-demo.webm    preferred, smaller for the same quality
uav-demo.mp4     fallback, plays everywhere including older Safari
```

## What the clip should be

| | |
|:--|:--|
| Length | 8 to 15 seconds, cut so it loops without a jarring jump |
| Resolution | 1280x720 is plenty; the card renders it around 700px wide |
| Frame rate | 24 or 30 fps |
| Audio | none at all, strip the track (it is muted anyway, and it saves bytes) |
| Target size | under 3 MB, ideally 1 to 2 MB |

Keep it well under the GitHub limits: 100 MB per file is a hard block and repositories
are meant to stay under about 1 GB.

## Encoding with ffmpeg

Start from your source clip, trim it, then run both encodes:

```bash
# 1. trim: 12 seconds starting at 00:00:34, no audio
ffmpeg -ss 00:00:34 -t 12 -i source.mp4 -an -c:v copy trimmed.mp4

# 2. MP4 (H.264). yuv420p and faststart are what make it play everywhere.
ffmpeg -i trimmed.mp4 -an -vf "scale=1280:-2,fps=30" \
  -c:v libx264 -profile:v main -pix_fmt yuv420p -crf 26 -preset slow \
  -movflags +faststart uav-demo.mp4

# 3. WebM (VP9), usually 25 to 40 percent smaller
ffmpeg -i trimmed.mp4 -an -vf "scale=1280:-2,fps=30" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 uav-demo.webm
```

Raise `-crf` to shrink the file, lower it for more quality. Check the result:

```bash
ls -lh uav-demo.*
```

If the MP4 lands over 3 MB, try `-crf 30`, drop to `scale=960:-2`, or shorten the clip.

## Poster frame

`assets/img/uav-poster.png` is the still shown before the video loads and whenever the
files are missing. Replace it with a real frame from the clip once you have one:

```bash
ffmpeg -ss 00:00:02 -i uav-demo.mp4 -frames:v 1 -q:v 2 ../img/uav-poster.jpg
```

If you switch to a `.jpg`, update the `poster` attribute on the `<video>` in `index.html`.
Keep the poster the same aspect ratio as the clip so nothing shifts on load.
