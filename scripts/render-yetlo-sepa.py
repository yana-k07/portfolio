# Renders the Yetlo SEPA payment flow (public/assets/yetlo/sepa-flow.webm + poster)
# from the seven screens in scripts/yetlo-sepa/ (750px wide exports):
#   1 empty form  2 filled form  3 amount, empty  4 amount, 800 €
#   5 account sheet  6 confirm (taller, button pinned)  7 home with the toast
# Flow: the form fills in as if typed, Continue, 800 typed on the keypad, the
# account sheet opens and closes, Send, the Hold to confirm button is dragged
# across, the money goes and the home screen shows the toast. Then it loops.
# Run: python3 scripts/render-yetlo-sepa.py  (needs Pillow and ffmpeg)
import pathlib, subprocess, tempfile
import numpy as np
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'scripts/yetlo-sepa'
OUT = ROOT / 'public/assets/yetlo'
W, H, FPS = 750, 1624, 30
FIELD_BG = (244, 244, 244)
ORANGE = (255, 123, 0)
F = {i: Image.open(SRC / f'{i}.png').convert('RGB') for i in range(1, 8)}


def ease(t):
    t = min(max(t, 0.0), 1.0)
    return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def ease_out(t):
    t = min(max(t, 0.0), 1.0)
    return 1 - (1 - t) ** 3


def glyphs(im, x0, x1, y0, y1, th=130):
    """Column groups with ink in a text line: roughly one per character."""
    a = np.asarray(im.crop((x0, y0, x1, y1)).convert('L'))
    ink = (a < th).any(axis=0)
    out = []
    for i, on in enumerate(ink):
        if on:
            if out and x0 + i - out[-1][1] <= 2:
                out[-1][1] = x0 + i
            else:
                out.append([x0 + i, x0 + i])
    return out


def caret(d, x, y0, y1):
    d.rectangle((x, y0, x + 2, y1), fill=ORANGE)


def tap(frame, point, t):
    """A touch: a soft disc that grows and fades."""
    if not 0 <= t <= 1:
        return frame
    f = frame.convert('RGBA')
    layer = Image.new('RGBA', f.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, y = point
    r = 26 + 24 * ease_out(t)
    a = int(255 * (1 - t) ** 1.5)
    d.ellipse((x - r, y - r, x + r, y + r), fill=(30, 30, 40, int(a * 0.2)), outline=(255, 255, 255, int(a * 0.9)), width=3)
    return Image.alpha_composite(f, layer).convert('RGB')


def touch(frame, point):
    """A finger resting on the screen."""
    f = frame.convert('RGBA')
    layer = Image.new('RGBA', f.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, y = point
    d.ellipse((x - 30, y - 30, x + 30, y + 30), fill=(30, 30, 40, 50), outline=(255, 255, 255, 220), width=3)
    return Image.alpha_composite(f, layer).convert('RGB')


def push(a, b, t):
    """iOS push: the new screen slides in from the right over the old one."""
    t = ease(t)
    f = Image.new('RGB', (W, H))
    old = Image.blend(a, Image.new('RGB', (W, H), (0, 0, 0)), 0.12 * t)
    f.paste(old, (int(-0.3 * W * t), 0))
    f.paste(b, (int(W * (1 - t)), 0))
    return f


# ---- 1 → 2: the form fills in --------------------------------------------
FIELDS = [  # (field box y0, y1, value line y0, y1, tap point)
    (208, 320, 268, 302, (375, 264)),
    (352, 464, 412, 440, (375, 408)),
    (640, 752, 699, 728, (375, 696)),
]
FIELD_GLYPHS = [glyphs(F[2], 60, 700, v0, v1) for _, _, v0, v1, _ in FIELDS]


def form(progress, show_caret, btn=0.0):
    """progress: list of revealed glyph counts per field (None = untouched)."""
    f = F[1].copy()
    d = ImageDraw.Draw(f)
    for (y0, y1, v0, v1, _), g, n in zip(FIELDS, FIELD_GLYPHS, progress):
        if n is None:
            continue
        f.paste(F[2].crop((40, y0, 710, y1)), (40, y0))
        right = g[n - 1][1] + 2 if n else 72
        if n < len(g):
            d.rectangle((right + 1, v0, 700, v1), fill=FIELD_BG)
        if show_caret is not None and show_caret == (y0, n):
            caret(d, right + 3, v0 - 2, v1 + 2)
    return form_button(f, btn) if btn else f


def form_button(f, t):
    btn = Image.blend(F[1].crop((40, 904, 710, 1004)), F[2].crop((40, 904, 710, 1004)), ease(t))
    f.paste(btn, (40, 904))
    return f


# ---- 3 → 4: 800 typed on the keypad ----------------------------------------
AMOUNT_GLYPHS = glyphs(F[4], 450, 700, 300, 350)  # "8", "0", "0"
AMOUNT_RIGHT = AMOUNT_GLYPHS[-1][1]
KEYS = {'8': (375, 1300), '0': (375, 1420)}


def amount(n, blink):
    if n == 0:
        f = F[3].copy()
        if not blink:  # hide the caret on the off beat
            ImageDraw.Draw(f).rectangle((668, 296, 676, 356), fill=FIELD_BG)
        return f
    f = F[3].copy()
    d = ImageDraw.Draw(f)
    d.rectangle((600, 290, 690, 360), fill=FIELD_BG)  # the 0 and the caret
    g0, g1 = AMOUNT_GLYPHS[0][0], AMOUNT_GLYPHS[n - 1][1]
    piece = F[4].crop((g0, 296, g1 + 1, 352))
    x = AMOUNT_RIGHT - (g1 - g0)
    d.rectangle((x - 4, 290, 690, 360), fill=FIELD_BG)
    f.paste(piece, (x, 296))
    if blink:
        caret(d, AMOUNT_RIGHT + 6, 300, 350)
    return f


# ---- 4 ↔ 5: the account sheet ----------------------------------------------
SHEET_TOP = 1082
# The scrim measured on screen 5: white 255 turns into (111, 113, 118).
DIM = [(0.42, 4.0), (0.42, 6.0), (0.42, 11.0)]
sheet = F[5].crop((0, SHEET_TOP, W, H)).convert('RGBA')
m = Image.new('L', sheet.size, 0)
ImageDraw.Draw(m).rounded_rectangle((0, 0, W, sheet.height + 80), radius=44, fill=255)
sheet.putalpha(m)


def with_sheet(t):
    t = ease_out(t)
    base = np.asarray(F[4], dtype=np.float32)
    dimmed = np.stack([base[..., c] * DIM[c][0] + DIM[c][1] for c in range(3)], -1)
    f = Image.fromarray(np.clip(base + (dimmed - base) * t, 0, 255).astype(np.uint8))
    f.paste(sheet, (0, int(SHEET_TOP + (H - SHEET_TOP) * (1 - t))), sheet)
    return f


# ---- 6: confirm, Hold to confirm pinned, dragged across ---------------------
BAR = 244  # button and home indicator, pinned to the bottom
confirm = F[6].crop((0, 0, W, H))
confirm.paste(F[6].crop((0, F[6].height - BAR, W, F[6].height)), (0, H - BAR))
BTN = (40, 1512 - 100, 710, 1612 - 100)  # in the pinned frame
SS = 3  # supersampling for the drawn button


def hold(p, knob_alpha, done=False):
    f = confirm.copy()
    x0, y0, x1, y1 = BTN
    w, h = x1 - x0, y1 - y0
    big = Image.new('RGBA', (w * SS, h * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(big)
    r = h * SS // 2
    d.rounded_rectangle((0, 0, w * SS - 1, h * SS - 1), radius=r, fill=ORANGE + (255,))
    label = F[6].crop((x0, 1512, x1, 1612)).resize((w * SS, h * SS), Image.LANCZOS).convert('RGBA')
    shape = Image.new('L', label.size, 0)
    ImageDraw.Draw(shape).rounded_rectangle((0, 0, w * SS - 1, h * SS - 1), radius=r, fill=int(255 * max(0.0, 1 - p * 1.6)))
    big.paste(label, (0, 0), shape)
    pad = 8 * SS
    kr = r - pad
    travel = w * SS - 2 * r
    kx = r + travel * p
    # the trail behind the knob, a deeper orange
    if knob_alpha > 0:
        d.rounded_rectangle((0, 0, int(kx + r), h * SS - 1), radius=r, fill=(214, 96, 0, int(255 * knob_alpha)))
        d.ellipse((kx - kr, r - kr, kx + kr, r + kr), fill=(255, 255, 255, int(255 * knob_alpha)))
        col = (214, 96, 0, int(255 * knob_alpha))
        lw = 5 * SS
        if done:
            d.line([(kx - kr * 0.35, r + kr * 0.02), (kx - kr * 0.08, r + kr * 0.3), (kx + kr * 0.38, r - kr * 0.28)], fill=col, width=lw, joint='curve')
        else:
            d.line([(kx - kr * 0.32, r), (kx + kr * 0.3, r)], fill=col, width=lw)
            d.line([(kx + kr * 0.02, r - kr * 0.3), (kx + kr * 0.32, r), (kx + kr * 0.02, r + kr * 0.3)], fill=col, width=lw, joint='curve')
    small = big.resize((w, h), Image.LANCZOS)
    f.paste(small, (x0, y0), small)
    knob_screen = (int(x0 + kx / SS), int(y0 + r / SS))
    return f, knob_screen


# ---- 7: home, the toast drops in -------------------------------------------
home_clean = F[7].copy()
ImageDraw.Draw(home_clean).rectangle((30, 80, 720, 219), fill=(244, 244, 244))
toast = F[7].crop((30, 84, 720, 234))


def home(t):
    f = home_clean.copy()
    y = int(84 - 170 * (1 - ease_out(t)))
    f.paste(toast, (30, y))
    return f if t < 1 else F[7]


# ---- timeline ---------------------------------------------------------------
CH = 0.075  # seconds per typed character
frames = []


def hold_for(img, sec):
    frames.extend([img] * int(sec * FPS))


def anim(sec, fn):
    n = max(1, int(sec * FPS))
    for i in range(n):
        frames.append(fn(i / (n - 1) if n > 1 else 1.0))


hold_for(F[1], 0.8)
progress = [None, None, None]
btn = 0.0  # Continue turns orange as the IBAN, the last required field, completes
for k, (fld, g) in enumerate(zip(FIELDS, FIELD_GLYPHS)):
    anim(0.35, lambda t, k=k: tap(form(progress, None, btn), FIELDS[k][4], t))
    for n in range(len(g) + 1):
        progress[k] = n
        if k == 1 and n > len(g) - 4:
            btn = (n - len(g) + 4) / 4
        img = form(progress, (fld[0], n), btn)
        gap = n > 1 and g[n - 1][0] - g[n - 2][1] > 10  # a space before this glyph
        hold_for(img, (CH * 2.2 if gap else CH) if n else 0.15)
    hold_for(img, 0.25)
filled = form_button(form([len(g) for g in FIELD_GLYPHS], None), 1)
hold_for(filled, 0.5)
anim(0.4, lambda t: tap(filled, (375, 954), t))
anim(0.45, lambda t: push(filled, amount(0, True), t))
for i in range(3):
    hold_for(amount(0, i % 2 == 0), 0.3)
for n, key in enumerate('800', 1):
    anim(0.3, lambda t, n=n, key=key: tap(amount(n, True), KEYS[key], t))
    hold_for(amount(n, True), 0.12)
anim(0.35, lambda t: Image.blend(amount(3, False), F[4], ease(t)))
hold_for(F[4], 0.9)
anim(0.35, lambda t: tap(F[4], (160, 323), t))
anim(0.45, with_sheet)
hold_for(with_sheet(1), 1.2)
anim(0.35, lambda t: tap(with_sheet(1), (375, 760), t))
anim(0.4, lambda t: with_sheet(1 - t))
hold_for(F[4], 0.5)
anim(0.4, lambda t: tap(F[4], (375, 954), t))
anim(0.45, lambda t: push(F[4], confirm, t))
hold_for(confirm, 1.0)
x_start = BTN[0] + (BTN[3] - BTN[1]) // 2
anim(0.25, lambda t: (lambda f, k: touch(f, k))(*hold(0, t)))
anim(1.1, lambda t: (lambda f, k: touch(f, k))(*hold(ease(t), 1)))
anim(0.3, lambda t: hold(1, 1, done=True)[0])
hold_for(hold(1, 1, done=True)[0], 0.4)
anim(0.45, lambda t: Image.blend(hold(1, 1, done=True)[0], home(0), ease(t)))
anim(0.5, home)
hold_for(F[7], 1.8)
anim(0.5, lambda t: Image.blend(F[7], F[1], ease(t)))

with tempfile.TemporaryDirectory() as tmp:
    for i, f in enumerate(frames):
        f.save(f'{tmp}/{i:05d}.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{tmp}/%05d.png',
                    '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '33', '-pix_fmt', 'yuv420p', '-row-mt', '1',
                    str(OUT / 'sepa-flow.webm')], check=True)
F[1].save(OUT / 'sepa-flow-poster.webp', 'WEBP', quality=86)
print('ok', len(frames), 'frames', round(len(frames) / FPS, 1), 's')
