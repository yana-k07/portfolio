# Renders the Quorso insights export screens from scripts/export-shots.html
# into public/assets/quorso-insights/export-*.webp (2400x1520).
# Run: python3 scripts/render-export-shots.py  (needs Playwright and Pillow)
import asyncio, io, pathlib
from PIL import Image
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/assets/quorso-insights'

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1200, 'height': 1600}, device_scale_factor=2)
        await pg.goto((ROOT / 'scripts/export-shots.html').as_uri())
        await pg.wait_for_timeout(300)
        for fid, name in [('dialog', 'export-dialog'), ('page', 'export-page')]:
            png = await pg.locator('#' + fid).screenshot()
            Image.open(io.BytesIO(png)).convert('RGB').save(OUT / f'{name}.webp', 'WEBP', quality=90)
            print(name)
        await b.close()

asyncio.run(main())
