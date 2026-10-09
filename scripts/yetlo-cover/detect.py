# Finds the four virtual corners of each screen in mockup.png: the inner edge of
# the black bezel is sampled along each side, a line is fitted robustly, and the
# corners are the intersections. Prints them for render-yetlo-cover.py.
import math, pathlib
import numpy as np
from PIL import Image

D = pathlib.Path(__file__).resolve().parent
a = np.asarray(Image.open(D / 'mockup.png').convert('RGB')).astype(int)
dark = a.max(axis=2) < 70
K = 3.2  # the rough guides below were read off a 1000px-wide preview


def scan(get, start, step):
    i, seen = int(start), False
    for _ in range(400):
        if get(i):
            seen = True
        elif seen:
            return i
        i += step
    return None


def first(get, start, step):
    i = int(start)
    for _ in range(200):
        if get(i):
            return i - step  # the last glass pixel
        i += step
    return None


def robust(u, v):
    keep = np.ones(len(u), bool)
    for _ in range(4):
        m, c = np.polyfit(u[keep], v[keep], 1)
        res = np.abs(v - (m * u + c))
        keep = res < max(2.5, np.median(res[keep]) * 3)
    return m, c, keep.sum(), len(u)


def side(p, q, rng, kind, inside=False):
    (x0, y0), (x1, y1) = [(x * K, y * K) for x, y in (p, q)]
    pts = []
    for t in rng:
        if kind in 'LR':
            e = x0 + (t - y0) * (x1 - x0) / (y1 - y0)
            if inside:  # walk out from the glass to the first dark pixel
                r = first(lambda x: dark[t, x], e + 60 if kind == 'L' else e - 60, -1 if kind == 'L' else 1)
            else:
                r = scan(lambda x: dark[t, x], e - 90 if kind == 'L' else e + 90, 1 if kind == 'L' else -1)
            if r: pts.append((t, r))
        else:
            e = y0 + (t - x0) * (y1 - y0) / (x1 - x0)
            if inside:
                r = first(lambda y: dark[y, t], e + 60 if kind == 'T' else e - 80, -1 if kind == 'T' else 1)
            else:
                r = scan(lambda y: dark[y, t], e - 90 if kind == 'T' else e + 90, 1 if kind == 'T' else -1)
            if r: pts.append((t, r))
    P = np.array(pts, float)
    m, c, k, n = robust(P[:, 0], P[:, 1])
    return ('x' if kind in 'LR' else 'y', m, c)


def corner(e1, e2):
    if e1[0] == 'y': e1, e2 = e2, e1
    _, m1, c1 = e1; _, m2, c2 = e2  # x = m1 y + c1 ; y = m2 x + c2
    y = (m2 * c1 + c2) / (1 - m2 * m1)
    return (round(m1 * y + c1, 1), round(y, 1))


R = lambda a, b: range(int(a * K), int(b * K), 4)
PHONES = {
    'front': dict(L=((215, 140), (300, 450), R(150, 400)), R=((470, 150), (545, 480), R(160, 400), True),
                  T=((250, 70), (420, 45), R(240, 400)), B=((360, 600), (545, 568), [*R(350, 408), *R(493, 537)], True)),  # skips the home indicator
    'back': dict(L=((560, 175), (520, 320), R(190, 320), True), R=((805, 225), (670, 640), R(240, 620)),
                 T=((590, 140), (780, 175), R(600, 770)), B=((470, 650), (620, 680), R(480, 600))),
}
for name, s in PHONES.items():
    e = {k: side(*v[:3], k, *v[3:]) for k, v in s.items()}
    c = [corner(e['L'], e['T']), corner(e['R'], e['T']), corner(e['R'], e['B']), corner(e['L'], e['B'])]
    print(name, '=', [tuple(map(float, p)) for p in c])
