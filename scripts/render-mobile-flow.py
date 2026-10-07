# Renders the TradeZella mobile flow (public/assets/mobile-flow.webm + poster)
# from three static screens in scripts/mobile-flow/:
#   overview.png  - the Performance overview (long capture)
#   edit.png      - Summary in edit mode (long capture, action bar at the bottom)
#   select.png    - the Select metric sheet over the page (one screen)
# Overview, tap the summary gear, edit mode with the action bar pinned while the
# tiles scroll, tap Add new, the metric sheet slides up, then loop.
# Run: python3 scripts/render-mobile-flow.py  (needs Pillow and ffmpeg)
import pathlib, subprocess, tempfile
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'scripts/mobile-flow'
OUT = ROOT / 'public/assets'
W, H, FPS = 780, 1688, 30
STATUS = 118           # status bar height, same in every capture
BAR_TOP, BAR_BOTTOM = 3386, 3550  # action bar inside edit.png
SHEET_TOP = 352        # top of the sheet in select.png
GEAR = (682, 1295)     # summary settings, on overview.png
ADD = (540, 3258)      # Add new tile, on edit.png

overview = Image.open(SRC / 'overview.png').convert('RGB')
edit = Image.open(SRC / 'edit.png').convert('RGB')
select = Image.open(SRC / 'select.png').convert('RGB')

bar = Image.new('RGB', (W, BAR_BOTTOM - BAR_TOP + 28), 'white')
bar.paste(edit.crop((0, BAR_TOP, W, BAR_BOTTOM)), (0, 0))
status = edit.crop((0, 0, W, STATUS))
content_bottom = H - bar.height
MAX_SCROLL = BAR_TOP - content_bottom

sheet = select.crop((0, SHEET_TOP, W, H))
mask = Image.new('L', sheet.size, 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, W, sheet.height + 60), radius=30, fill=255)
sheet.putalpha(mask)


def ease(t):
    t = min(max(t, 0), 1)
    return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def ease_out(t):
    t = min(max(t, 0), 1)
    return 1 - (1 - t) ** 3


def overview_frame():
    return overview.crop((0, 0, W, H))


def edit_frame(scroll):
    f = Image.new('RGB', (W, H), (246, 246, 246))
    f.paste(edit.crop((0, scroll, W, scroll + H)), (0, 0))
    f.paste(status, (0, 0))
    f.paste(bar, (0, content_bottom))
    return f


def with_sheet(base, t):
    f = base.copy()
    dim = Image.new('RGB', (W, H), (20, 21, 36))
    f = Image.blend(f, dim, 0.5 * ease_out(t))
    y = int(SHEET_TOP + (H - SHEET_TOP) * (1 - ease_out(t)))
    f.paste(sheet, (0, y), sheet)
    return f


def tap(frame, point, t, scroll=0):
    """A touch: a soft disc that grows and fades out."""
    if not 0 <= t <= 1:
        return frame
    f = frame.convert('RGBA')
    layer = Image.new('RGBA', f.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, y = point[0], point[1] - scroll
    r = 26 + 26 * ease_out(t)
    a = int(255 * (1 - t) ** 1.5)
    d.ellipse((x - r, y - r, x + r, y + r), fill=(30, 30, 40, int(a * 0.22)), outline=(255, 255, 255, int(a * 0.9)), width=3)
    return Image.alpha_composite(f, layer).convert('RGB')


# Timeline, seconds.
T = dict(tap1=1.4, fade1=1.85, scroll0=3.0, scroll1=4.8, tap2=5.3, sheet=5.75, back=8.6, end=9.0)
frames = []
for i in range(int(T['end'] * FPS)):
    s = i / FPS
    if s < T['fade1']:
        f = tap(overview_frame(), GEAR, (s - T['tap1']) / 0.45)
    elif s < T['fade1'] + 0.35:
        f = Image.blend(overview_frame(), edit_frame(0), ease((s - T['fade1']) / 0.35))
    elif s < T['sheet']:
        sc = int(MAX_SCROLL * ease((s - T['scroll0']) / (T['scroll1'] - T['scroll0'])))
        f = tap(edit_frame(sc), ADD, (s - T['tap2']) / 0.45, sc)
    elif s < T['back']:
        f = with_sheet(edit_frame(MAX_SCROLL), (s - T['sheet']) / 0.45)
    else:
        f = Image.blend(with_sheet(edit_frame(MAX_SCROLL), 1), overview_frame(), ease((s - T['back']) / (T['end'] - T['back'])))
    frames.append(f)

with tempfile.TemporaryDirectory() as tmp:
    for i, f in enumerate(frames):
        f.save(f'{tmp}/{i:04d}.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{tmp}/%04d.png',
                    '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-pix_fmt', 'yuv420p', '-row-mt', '1',
                    str(OUT / 'mobile-flow.webm')], check=True)
frames[0].save(OUT / 'mobile-flow-poster.webp', 'WEBP', quality=86)
print('ok', len(frames), 'frames, scroll', MAX_SCROLL)
