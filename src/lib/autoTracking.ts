// Rastreamento automático de comportamento: cliques, scroll, tempo na página,
// seções vistas, links externos e WhatsApp. Dispara para Meta Pixel, GA4, GTM e CAPI.
import { trackEvent } from "@/lib/tracking";

const SCROLL_MARKS = [25, 50, 75, 90, 100];
const TIME_MARKS = [10, 30, 60, 120, 300];

let started = false;
let cleanup: (() => void) | null = null;

function labelOf(el: Element): string {
  const node = el as HTMLElement;
  const explicit = node.getAttribute("data-track-label") || node.getAttribute("aria-label");
  if (explicit) return explicit.trim().slice(0, 80);
  const text = (node.innerText || node.textContent || "").replace(/\s+/g, " ").trim();
  if (text) return text.slice(0, 80);
  const img = node.querySelector("img");
  if (img?.alt) return img.alt.slice(0, 80);
  return node.tagName.toLowerCase();
}

function sectionOf(el: Element): string {
  const named = el.closest("[data-track-section]") as HTMLElement | null;
  if (named) return named.dataset.trackSection || "";
  const sec = el.closest("section[id], section, header, footer") as HTMLElement | null;
  return sec?.id || sec?.tagName.toLowerCase() || "page";
}

export function initAutoTracking() {
  if (started || typeof window === "undefined") return () => {};
  started = true;

  const base = () => ({
    page_path: window.location.pathname,
    page_title: document.title,
  });

  // ---------- Cliques ----------
  const onClick = (e: MouseEvent) => {
    const target = e.target as Element | null;
    if (!target) return;
    const el = target.closest("a, button, [role='button'], [data-track]") as HTMLElement | null;
    if (!el) return;

    const label = labelOf(el);
    const section = sectionOf(el);
    const href = (el as HTMLAnchorElement).href || el.getAttribute("data-href") || "";
    const common = { ...base(), label, section, href, element: el.tagName.toLowerCase() };

    if (/wa\.me|whatsapp/i.test(href)) {
      trackEvent("Contact", { ...common, method: "whatsapp" });
      trackEvent("WhatsAppClick", common);
      return;
    }
    if (href.startsWith("tel:")) { trackEvent("Contact", { ...common, method: "phone" }); return; }
    if (href.startsWith("mailto:")) { trackEvent("Contact", { ...common, method: "email" }); return; }
    if (href && !href.startsWith(window.location.origin) && href.startsWith("http")) {
      trackEvent("OutboundClick", common);
      return;
    }
    trackEvent("ClickButton", common);
  };

  // ---------- Scroll ----------
  const seenScroll = new Set<number>();
  let ticking = false;
  const measureScroll = () => {
    ticking = false;
    const doc = document.documentElement;
    const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const pct = Math.min(100, Math.round(((window.scrollY || 0) / max) * 100));
    for (const m of SCROLL_MARKS) {
      if (pct >= m && !seenScroll.has(m)) {
        seenScroll.add(m);
        trackEvent("Scroll", { ...base(), percent_scrolled: m });
      }
    }
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(measureScroll);
  };

  // ---------- Tempo na página ----------
  const start = Date.now();
  let activeMs = 0;
  let lastTick = Date.now();
  const seenTime = new Set<number>();
  const timer = window.setInterval(() => {
    const now = Date.now();
    if (document.visibilityState === "visible") activeMs += now - lastTick;
    lastTick = now;
    const secs = Math.round(activeMs / 1000);
    for (const m of TIME_MARKS) {
      if (secs >= m && !seenTime.has(m)) {
        seenTime.add(m);
        trackEvent("TimeOnPage", { ...base(), seconds: m });
        if (m === 30) trackEvent("EngagedVisit", { ...base(), seconds: m });
      }
    }
  }, 5000);

  // ---------- Seções vistas ----------
  const seenSections = new Set<string>();
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      const name = el.dataset.trackSection || el.id;
      if (!name || seenSections.has(name)) continue;
      seenSections.add(name);
      trackEvent("ViewSection", { ...base(), section: name });
    }
  }, { threshold: 0.4 });
  document.querySelectorAll("section[id], [data-track-section]").forEach((el) => io.observe(el));

  // ---------- Formulários ----------
  const onSubmit = (e: Event) => {
    const form = e.target as HTMLFormElement;
    trackEvent("FormSubmit", { ...base(), section: sectionOf(form), form_id: form.id || form.name || "form" });
  };

  // ---------- Saída ----------
  const onLeave = () => {
    const total = Math.round((Date.now() - start) / 1000);
    trackEvent("PageExit", {
      ...base(),
      seconds: total,
      engaged_seconds: Math.round(activeMs / 1000),
      max_scroll: seenScroll.size ? Math.max(...seenScroll) : 0,
    });
  };

  document.addEventListener("click", onClick, true);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("submit", onSubmit, true);
  window.addEventListener("pagehide", onLeave);

  cleanup = () => {
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("submit", onSubmit, true);
    window.removeEventListener("pagehide", onLeave);
    window.clearInterval(timer);
    io.disconnect();
    started = false;
  };

  measureScroll();
  return cleanup;
}

export function stopAutoTracking() {
  cleanup?.();
  cleanup = null;
}

// Reobserva seções e reinicia contadores em troca de rota.
export function resetPageTracking() {
  stopAutoTracking();
  initAutoTracking();
}
