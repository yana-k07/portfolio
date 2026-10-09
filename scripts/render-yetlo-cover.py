# Renders the Yetlo case cover (public/assets/yetlo/cover.webp) from the
# two-phone mockup in scripts/yetlo-cover/mockup.png: the Transfer screen goes
# on the front phone, Verification on the phone behind it.
# Screen corners come from scripts/yetlo-cover/detect.py (re-run it if the
# mockup changes). Run: python3 scripts/render-yetlo-cover.py
import pathlib
import cv2
import numpy as np
from scipy import ndimage
from PIL import Image, ImageDraw

D = pathlib.Path(__file__).resolve().parent / 'yetlo-cover'
OUT = pathlib.Path(__file__).resolve().parent.parent / 'public/assets/yetlo/cover.webp'

FRONT = [(620.4, 229.3), (1366.7, 123.9), (1808.1, 1791.9), (1056.3, 1972.0)]
BACK = [(1838.7, 411.8), (2609.6, 564.0), (2135.7, 2244.1), (1329.3, 2039.5)]
SW, SH = 750, 1624   # screen exports
RADIUS = 108         # display corner radius at that size, measured on the mockup
OVERSCAN = 12        # px of source pushed under the bezel so no old pixel peeks out

mock = Image.open(D / 'mockup.png').convert('RGB')
MW, MH = mock.size


def with_island(path):
    s = Image.open(path).convert('RGB').resize((SW, SH), Image.LANCZOS)
    ImageDraw.Draw(s).rounded_rectangle((250, 22, 500, 96), radius=37, fill=(0, 0, 0))
    return s


def coeffs(dst, src):
    A, b = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); b.append(v)
    return np.linalg.solve(np.array(A, float), np.array(b, float)).tolist()


RECT = [(0, 0), (SW, 0), (SW, SH), (0, SH)]


def fwd(quad, x, y):
    """A point in screen space → the mockup, through the screen's homography."""
    a, b, c, d, e, f, g, h = coeffs(RECT, quad)  # maps RECT → quad
    w = g * x + h * y + 1
    return ((a * x + b * y + c) / w, (d * x + e * y + f) / w)


def warp(img, quad, grow=0):
    """An image covering the screen grown by `grow` px, warped onto the mockup."""
    src = [(-grow, -grow), (SW + grow, -grow), (SW + grow, SH + grow), (-grow, SH + grow)]
    dst = [fwd(quad, x, y) for x, y in src]
    S = 2  # warp at 2x for clean edges
    corners = [(0, 0), (img.width, 0), (img.width, img.height), (0, img.height)]
    big = img.transform((MW * S, MH * S), Image.PERSPECTIVE,
                        coeffs([(x * S, y * S) for x, y in dst], corners), Image.BICUBIC)
    return big.resize((MW, MH), Image.LANCZOS)


def rounded(grow):
    m = Image.new('L', (SW + 2 * grow, SH + 2 * grow), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, m.width - 1, m.height - 1), radius=RADIUS + grow, fill=255)
    return m


def place(screen, quad):
    o = OVERSCAN
    big = screen.resize((SW + 2 * o, SH + 2 * o), Image.LANCZOS).convert('RGBA')
    big.putalpha(rounded(o))
    return warp(big, quad, o)


m = np.asarray(mock).astype(int)
lo, hi = m.min(axis=2), m.max(axis=2)
DARK = hi < 70
SILVER = ((hi - lo) < 22) & (hi > 90) & (hi < 248)


def glass(seed):
    """The exact glass of one phone: the light region inside its bezel, made convex
    (which also takes in the island and dark content), grown 1px over the edge."""
    lab, _ = ndimage.label(~DARK)
    ys, xs = np.nonzero(lab == lab[seed[1], seed[0]])
    hull = cv2.convexHull(np.stack([xs, ys], 1).astype(np.int32))
    g = np.zeros(DARK.shape, np.uint8)
    cv2.fillPoly(g, [hull], 255)
    return cv2.dilate(g, np.ones((3, 3), np.uint8))


def grown(mask, r):
    return cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1)))


def onto(base, layer, mask):
    a = (np.asarray(layer.getchannel('A'), np.float32) / 255) * (mask.astype(np.float32) / 255)
    b = np.asarray(base, np.float32)
    b[..., :3] = b[..., :3] * (1 - a[..., None]) + np.asarray(layer, np.float32)[..., :3] * a[..., None]
    return b


FRONT_GLASS = glass((900, 900))
# Dark content in the mockup's own screen (its bottom-left corner) touches the
# bezel, so the hull misses that corner: fill it from the fitted screen shape,
# pulled in a little so it never reaches over the bezel.
fitted = np.asarray(warp(rounded(0), FRONT, 0))
FRONT_GLASS = np.maximum(FRONT_GLASS, cv2.erode(fitted, np.ones((21, 21), np.uint8)))
BACK_GLASS = glass((2200, 1100))
out = onto(np.asarray(mock.convert('RGBA')), place(with_island(D / 'verification.png'), BACK), BACK_GLASS)
out = onto(out, place(with_island(D / 'transfer.png'), FRONT), FRONT_GLASS)
# Where the phones overlap, put the front phone's bezel and frame back on top:
# dark pixels right around its glass, silver ones a little further out.
outside = FRONT_GLASS == 0
keep = outside & ((DARK & (grown(FRONT_GLASS, 30) > 0)) | (SILVER & (grown(FRONT_GLASS, 90) > 0)))
out[keep, :3] = m[keep]
Image.fromarray(out.astype(np.uint8)).convert('RGB').resize((1800, 1350), Image.LANCZOS).save(OUT, 'WEBP', quality=90)
print('ok', OUT)
