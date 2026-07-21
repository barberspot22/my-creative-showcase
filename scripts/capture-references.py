import asyncio
import json
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "references"

REFERENCES = {
    "ecommerce": [
        ("https://www.maduu.com.br/", "moda-autoral"),
        ("https://mandacaru.design/", "design-lifestyle"),
        ("https://www.biasouzabrand.com.br/", "moda-feminina"),
    ],
    "cardapio": [
        ("https://nossahamburgueria.com.br/", "hamburgueria"),
        ("https://olipizza.com.br/", "pizzaria"),
        ("https://domrufs.com.br/", "pizzaria-artesanal"),
    ],
    "institucional": [
        ("https://dignodesign.com.br/", "agencia-sites"),
        ("https://agenciaventura.com.br/", "agencia-pme"),
        ("https://agaia.com.br/", "estudio-criativo"),
    ],
}

VIEWPORT = {"width": 1440, "height": 900}

COOKIE_BANNERS = [
    "#onetrust-consent-sdk",
    "#onetrust-banner-sdk",
    "#cookie-banner",
    ".cookie-banner",
    ".lgpd",
    ".lgpd-banner",
    ".cookie-notice",
    "#cookie-notice",
    ".banner-lgpd",
]


async def capture(browser, url: str, slug: str, out_dir: Path):
    page = await browser.new_page(viewport=VIEWPORT)
    try:
        await page.goto(url, wait_until="networkidle", timeout=60000)
        await asyncio.sleep(2.5)
        # try to dismiss cookie banners
        for selector in COOKIE_BANNERS:
            try:
                el = await page.query_selector(selector)
                if el:
                    await page.evaluate("(el) => el.style.display = 'none'", el)
            except Exception:
                pass
        await asyncio.sleep(0.3)
        path = out_dir / f"{slug}.jpg"
        await page.screenshot(path=str(path), type="jpeg", quality=85)
        return {"status": "ok", "path": str(path.relative_to(ROOT))}
    except Exception as e:
        return {"status": "error", "url": url, "error": str(e)}
    finally:
        await page.close()


async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        tasks = []
        for category, sites in REFERENCES.items():
            out_dir = OUT / category
            out_dir.mkdir(parents=True, exist_ok=True)
            for url, slug in sites:
                tasks.append(capture(browser, url, slug, out_dir))
        results = await asyncio.gather(*tasks)
        await browser.close()
    print(json.dumps(results, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
