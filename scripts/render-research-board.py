# Renders scripts/research-board.html to public/assets/research-board.webp (2x).
import asyncio, pathlib
from playwright.async_api import async_playwright
root = pathlib.Path(__file__).resolve().parent.parent
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1600, 'height': 620}, device_scale_factor=2)
        await pg.goto((root / 'scripts/research-board.html').as_uri())
        await pg.screenshot(path=str(root / 'scripts/.board.png'))
        await b.close()
asyncio.run(main())
from PIL import Image
Image.open(root / 'scripts/.board.png').save(root / 'public/assets/research-board.webp', 'WEBP', quality=88)
(root / 'scripts/.board.png').unlink()
