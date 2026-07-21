import asyncio
import json
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "references"

REFERENCES = {
    "ecommerce": [
        ("https://www.themorais.com.br/", "the-morais"),
        ("https://www.miriamp.com.br/", "miriam-p"),
        ("https://www.pontoatelier.com.br/", "ponto-atelier"),
        ("https://www.benoliel.com.br/", "benoliel"),
        ("https://www.santalollastore.com.br/", "santa-lolla"),
        ("https://www.ticatura.com/", "ticatura"),
    ],
    "cardapio": [
        ("https://olipizza.com.br/", "oli-pizza"),
        ("https://domrufs.com.br/", "dom-rufs"),
        ("https://bonburger.com.br/", "bon-burger"),
        ("https://www.joaquinabar.com.br/", "joaquina"),
        ("https://kithamburgueria.com.br/", "kit-burger"),
        ("https://www.menottipizza.com.br/", "menotti"),
    ],
    "institucional": [
        ("https://agaia.com.br/", "agaia"),
        ("https://bcicleta.com.br/", "bcicleta"),
        ("https://agenciaminimal.com.br/", "minimal"),
        ("https://gabrieldosite.com.br/", "gabriel-site"),
        ("https://weareco.com.br/", "weareco"),
        ("https://carbono.studio/", "carbono"),
    ],
}

VIEWPORT = {"width": 1440, "height": 900}

POPUP_SELECTORS = [
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
    ".usp-popup",
    ".overlay-popup",
]

CLOSE_SELECTORS = [
    "button:has-text('x')",
    "button:has-text('×')",
    "button:has-text('✕')",
    "button:has-text('close')",
    "button:has-text('fechar')",
    "button:has-text('entendi')",
    "button:has-text('aceitar')",
    "button:has-text('aceito')",
    "button:has-text('não quero')",
    "button:has-text('rejeitar')",
    "button:has-text('dispensar')",
    "button:has-text('depois')",
    "button:has-text('agora não')",
    "button:has-text('não, obrigado')",
    "[aria-label='close']",
    "[aria-label='Close']",
    "[aria-label='Fechar']",
    ".close",
    ".close-popup",
    "svg[role='button']",
]


async def hide_popups(page):
    for selector in POPUP_SELECTORS:
        try:
            el = await page.query_selector(selector)
            if el:
                await page.evaluate("(el) => { el.style.display='none'; el.style.visibility='hidden'; el.style.opacity='0'; }", el)
        except Exception:
            pass
    for selector in CLOSE_SELECTORS:
        try:
            buttons = await page.query_selector_all(selector)
            for btn in buttons:
                try:
                    await btn.click(timeout=600)
                    await asyncio.sleep(0.1)
                except Exception:
                    pass
        except Exception:
            pass


async def capture(browser, url: str, slug: str, out_dir: Path):
    page = await browser.new_page(viewport=VIEWPORT)
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(3.0)
        try:
            await page.wait_for_load_state("networkidle", timeout=20000)
        except Exception:
            pass
        await hide_popups(page)
        await asyncio.sleep(0.5)
        # scroll to top for hero-rich screenshot
        try:
            await page.evaluate("() => { window.scrollTo(0, 0); }")
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
                if not (out_dir / f"{slug}.jpg").exists():
                    tasks.append(capture(browser, url, slug, out_dir))
        results = await asyncio.gather(*tasks)
        await browser.close()
    print(json.dumps(results, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
