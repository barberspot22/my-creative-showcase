import asyncio
import json
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "references"

REFERENCES = {
    "ecommerce": [
        ("https://www.nuddystudio.com.br/", "nuddy-studio"),
        ("https://www.themorais.com.br/", "the-morais"),
        ("https://www.miriamp.com.br/", "miriam-p"),
        ("https://www.pontoatelier.com.br/", "ponto-atelier"),
        ("https://www.santonina.com.br/", "santonina"),
    ],
    "cardapio": [
        ("https://olipizza.com.br/", "oli-pizza"),
        ("https://domrufs.com.br/", "dom-rufs"),
        ("https://bonburger.com.br/", "bon-burger"),
        ("https://www.joaquinabar.com.br/", "joaquina"),
        ("https://astroexperience.com.br/", "astro"),
    ],
    "institucional": [
        ("https://agaia.com.br/", "agaia"),
        ("https://bcicleta.com.br/", "bcicleta"),
        ("https://agenciaminimal.com.br/", "minimal"),
        ("https://agenciadigitals.com.br/", "digitals"),
        ("https://gabrieldosite.com.br/", "gabriel-site"),
    ],
}

VIEWPORT = {"width": 1440, "height": 900}

COOKIE_SELECTORS = [
    "#onetrust-consent-sdk",
    "#onetrust-banner-sdk",
    "#cookie-banner",
    ".cookie-banner",
    ".lgpd",
    ".lgpd-banner",
    ".cookie-notice",
    "#cookie-notice",
    ".banner-lgpd",
    ".cky-consent-bar",
    ".omnisend-form",
    "#omnisend-form",
    ".newsletter-popup",
    ".popup-newsletter",
    "#newsletter-popup",
    ".modal-newsletter",
]

CLOSE_TEXTS = ["close", "fechar", "x", "×", "✕", "entendi", "aceitar", "aceito", "não quero", "rejeitar", "dispensar"]


async def clean_page(page):
    for selector in COOKIE_SELECTORS:
        try:
            el = await page.query_selector(selector)
            if el:
                await page.evaluate("(el) => el.style.display='none'", el)
        except Exception:
            pass
    # try to click buttons with close/dismiss text
    for text in CLOSE_TEXTS:
        try:
            buttons = await page.query_selector_all(f"button:has-text('{text}'), a:has-text('{text}'), [role='button']:has-text('{text}')")
            for btn in buttons:
                try:
                    await btn.click(timeout=500)
                    await asyncio.sleep(0.1)
                except Exception:
                    pass
        except Exception:
            pass


async def capture(browser, url: str, slug: str, out_dir: Path):
    page = await browser.new_page(viewport=VIEWPORT)
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(2.5)
        try:
            await page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            pass
        await clean_page(page)
        await asyncio.sleep(0.5)
        # attempt small scroll to reveal hero if page is blank
        try:
            await page.evaluate("() => window.scrollTo(0, 200)")
            await asyncio.sleep(0.3)
        except Exception:
            pass
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
