# Renders the Yetlo case cover (public/assets/yetlo/cover.webp, 1800x1350):
# the Transfer screen in the iPhone mockup, lying tilted on a soft warm,
# fabric-like ground, with its edge, contact shadow and a faint screen glare.
# Run: python3 scripts/render-yetlo-cover.py  (needs Pillow and numpy)
import pathlib
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCREEN = ROOT / 'scripts/yetlo-cover/transfer.png'
FRAME = ROOT / 'public/mockups/iphone-air.png'
OUT = ROOT / 'public/assets/yetlo/cover.webp'
W, H = 1800, 1350
SS = 2  # render at 2x, downsample at the end
rng = np.random.default_rng(7)

# ---- the phone, flat -------------------------------------------------------
frame = Image.open(FRAME).convert('RGBA')
fw, fh = frame.size
ix, iy = round(fw * 0.0483), round(fh * 0.0234)
sw, sh = fw - 2 * ix, fh - 2 * iy
screen = Image.open(SCREEN).convert('RGB').resize((sw, sh), Image.LANCZOS)
# a faint glare across the glass
glare = np.zeros((sh, sw), np.float32)
yy, xx = np.mgrid[0:sh, 0:sw]
band = (xx / sw * 0.8 + yy / sh * 0.5)
glare = np.clip(1 - np.abs(band - 0.55) / 0.35, 0, 1) * 0.07
scr = np.asarray(screen, np.float32)
scr = scr + (255 - scr) * glare[..., None]
screen = Image.fromarray(scr.astype(np.uint8))
smask = Image.new('L', (sw, sh), 0)
ImageDraw.Draw(smask).rounded_rectangle((0, 0, sw - 1, sh - 1), radius=round(sw * 0.104), fill=255)
phone = Image.new('RGBA', (fw, fh), (0, 0, 0, 0))
phone.paste(screen, (ix, iy), smask)
phone = Image.alpha_composite(phone, frame)
alpha = phone.getchannel('A')
# fill the body under the bezel so nothing shows through
body = Image.new('L', (fw, fh), 0)
ImageDraw.Draw(body).rounded_rectangle((2, 2, fw - 3, fh - 3), radius=round(fw * 0.16), fill=255)
alpha = ImageChops.lighter(alpha, body)
phone.putalpha(alpha)

# ---- 3D placement ------------------------------------------------------------
S = 0.72 * SS  # phone pixels → canvas pixels


def project(rz, rx, f, cx, cy):
    """Corners of the phone after rotating about z, tilting about x, perspective."""
    pts = []
    for x, y in [(0, 0), (fw, 0), (fw, fh), (0, fh)]:
        X, Y, Z = (x - fw / 2) * S, (y - fh / 2) * S, 0.0
        X, Y = X * np.cos(rz) - Y * np.sin(rz), X * np.sin(rz) + Y * np.cos(rz)
        Y, Z = Y * np.cos(rx), -Y * np.sin(rx)  # the top of the phone lies farther away
        k = f / (f + Z)
        pts.append((cx + X * k, cy + Y * k))
    return pts


def coeffs(dst, src):
    """Perspective coefficients mapping output (dst) points back to input (src)."""
    A, b = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); b.append(v)
    return np.linalg.solve(np.array(A, float), np.array(b, float)).tolist()


cw, ch = W * SS, H * SS
dst = project(np.radians(-30), np.radians(34), 3000 * SS, cw * 0.52, ch * 0.5)
src = [(0, 0), (fw, 0), (fw, fh), (0, fh)]
warped = phone.transform((cw, ch), Image.PERSPECTIVE, coeffs(dst, src), Image.BICUBIC)
wa = warped.getchannel('A')

# ---- the ground: warm, soft, fabric-like --------------------------------------
yy, xx = np.mgrid[0:ch, 0:cw].astype(np.float32)
t = np.clip((xx / cw) * 0.6 + (1 - yy / ch) * 0.4, 0, 1)[..., None]
dark, light = np.array([176, 88, 44], np.float32), np.array([238, 150, 82], np.float32)
g = dark + (light - dark) * t
# big soft folds, like a tufted cushion
folds = np.zeros((ch, cw), np.float32)
for _ in range(9):
    cx0, cy0 = rng.uniform(0, cw), rng.uniform(0, ch)
    r = rng.uniform(0.25, 0.5) * cw
    folds += rng.uniform(-1, 1) * np.exp(-(((xx - cx0) ** 2 + (yy - cy0) ** 2) / (2 * r * r)))
folds = folds / (np.abs(folds).max() + 1e-6)
g *= (1 + 0.14 * folds)[..., None]
# woven grain: fine noise, a touch of softer clumps
fine = rng.normal(0, 1, (ch, cw)).astype(np.float32)
clump = np.asarray(Image.fromarray(((rng.normal(0, 1, (ch, cw)) * 40 + 128).clip(0, 255)).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.2)), np.float32) - 128
g *= (1 + 0.035 * fine + 0.004 * clump)[..., None]
# vignette
d = np.sqrt(((xx - cw * 0.55) / cw) ** 2 + ((yy - ch * 0.45) / ch) ** 2)
g *= (1 - 0.35 * np.clip(d - 0.2, 0, 1))[..., None]
ground = Image.fromarray(np.clip(g, 0, 255).astype(np.uint8)).convert('RGBA')

# ---- shadows and the phone's edge ----------------------------------------------
def shadow(mask, dx, dy, blur, strength):
    m = Image.new('L', mask.size, 0)
    m.paste(mask, (int(dx), int(dy)))
    m = m.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: int(v * strength))
    layer = Image.new('RGBA', mask.size, (60, 22, 8, 255))
    layer.putalpha(m)
    return layer

canvas = ground
canvas = Image.alpha_composite(canvas, shadow(wa, 50 * SS, 70 * SS, 55 * SS, 0.7))
canvas = Image.alpha_composite(canvas, shadow(wa, 8 * SS, 14 * SS, 10 * SS, 0.7))
# the titanium side, seen below the glass because the phone is tilted
edge = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
for i, c in enumerate(np.linspace(30, 70, 9 * SS)):
    layer = Image.new('RGBA', (cw, ch), (int(c), int(c * 0.95), int(c * 0.92), 255))
    m = Image.new('L', (cw, ch), 0)
    m.paste(wa, (0, int(9 * SS - i)))
    layer.putalpha(m)
    edge = Image.alpha_composite(edge, layer)
canvas = Image.alpha_composite(canvas, edge)
canvas = Image.alpha_composite(canvas, warped)

canvas.convert('RGB').resize((W, H), Image.LANCZOS).save(OUT, 'WEBP', quality=90)
print('ok', OUT)
