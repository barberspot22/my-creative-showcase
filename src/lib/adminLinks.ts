import { useEffect, useState } from "react";
import { isPreviewMode, useOverlay } from "@/lib/livePreview";

export type PageKey =
  | "gb-studio"
  | "gb-social"
  | "ecommerce"
  | "crm"
  | "site-institucional"
  | "cardapio-digital"
  | "catalogo-digital"
  | "trilha-cta";

export type PageLink = { ctaUrl: string; ctaLabel: string };
export type PageLinks = Record<PageKey, PageLink>;

/** WhatsApp comercial GB IA (DDI 55 + DDD 27). */
export const WHATSAPP_NUMBER = "5527992812332";

const orcamentoLabel = "SOLICITAR ORÇAMENTO";
export const wa = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export const PAGE_META: { key: PageKey; label: string; defaultLabel: string; defaultUrl: string }[] = [
  { key: "gb-studio", label: "GB Studio", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Vim pelo site e quero um orçamento do GB Studio (fotografia com IA).") },
  { key: "gb-social", label: "GB Social", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Vim pelo site e quero um orçamento do GB Social (social media de IA).") },
  { key: "ecommerce", label: "E-commerce", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Vim pelo site e quero um orçamento de E-commerce completo (loja + automação + IA).") },
  { key: "crm", label: "CRM", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Vim pelo site e quero um orçamento de CRM sob medida.") },
  { key: "site-institucional", label: "Site Institucional", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Vim pelo site e quero um orçamento de Site Institucional.") },
  { key: "cardapio-digital", label: "Cardápio Digital", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Vim pelo site e quero um orçamento de Cardápio Digital. Vendo por mesa/delivery/WhatsApp e quero que meus clientes vejam e peçam sozinhos.") },
  { key: "catalogo-digital", label: "Catálogo Digital", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Vim pelo site e quero um orçamento de Catálogo Digital. Vendo produtos/serviços/imóveis/eventos e quero que meus clientes peçam orçamento sozinhos.") },
  { key: "trilha-cta", label: "Home · Contato / Trilha", defaultLabel: "Falar no WhatsApp", defaultUrl: wa("Olá! Vim pelo site da GB IA e quero conversar sobre um projeto.") },
];

export const defaultLinks: PageLinks = PAGE_META.reduce((acc, item) => {
  acc[item.key] = { ctaUrl: item.defaultUrl, ctaLabel: item.defaultLabel };
  return acc;
}, {} as PageLinks);

export const ADMIN_LINKS_KEY = "gbia.pageLinks.v2";

/** Garante número comercial mesmo em URLs antigas salvas sem telefone. */
function normalizeWhatsAppUrl(url: string, fallback: string): string {
  if (!url || url.startsWith("#") || url.startsWith("/")) return url;
  try {
    const u = new URL(url);
    if (!/(^|\.)wa\.me$/i.test(u.hostname) && !/api\.whatsapp\.com$/i.test(u.hostname)) {
      return url;
    }
    const text = u.searchParams.get("text") ?? "";
    // wa.me/?text=... (sem número) ou número errado → força o comercial
    if (u.hostname.includes("wa.me")) {
      const pathNum = u.pathname.replace(/\D/g, "");
      if (!pathNum || pathNum !== WHATSAPP_NUMBER) {
        return text ? wa(decodeURIComponent(text)) : fallback;
      }
    }
    return url;
  } catch {
    return url;
  }
}

function readLinks(): PageLinks {
  if (typeof window === "undefined") return defaultLinks;
  try {
    const raw = window.localStorage.getItem(ADMIN_LINKS_KEY);
    if (!raw) return defaultLinks;
    const parsed = JSON.parse(raw) as Partial<PageLinks>;
    const merged: PageLinks = { ...defaultLinks };
    (Object.keys(defaultLinks) as PageKey[]).forEach((key) => {
      const value = parsed[key];
      if (value && typeof value === "object") {
        const ctaUrl = typeof value.ctaUrl === "string" ? value.ctaUrl : defaultLinks[key].ctaUrl;
        merged[key] = {
          ctaUrl: normalizeWhatsAppUrl(ctaUrl, defaultLinks[key].ctaUrl),
          ctaLabel: typeof value.ctaLabel === "string" && value.ctaLabel.trim() ? value.ctaLabel : defaultLinks[key].ctaLabel,
        };
      }
    });
    return merged;
  } catch {
    return defaultLinks;
  }
}

export function useAdminLinks(): PageLinks {
  const [links, setLinks] = useState<PageLinks>(defaultLinks);
  useEffect(() => {
    setLinks(readLinks());
    const onChange = () => setLinks(readLinks());
    window.addEventListener("storage", onChange);
    window.addEventListener("gbia:links-changed", onChange as EventListener);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("gbia:links-changed", onChange as EventListener);
    };
  }, []);
  return links;
}

export function usePageLink(key: PageKey): PageLink {
  const base = useAdminLinks()[key];
  const overlay = useOverlay();
  if (!isPreviewMode()) {
    return {
      ...base,
      ctaUrl: normalizeWhatsAppUrl(base.ctaUrl, defaultLinks[key].ctaUrl),
    };
  }
  const o = overlay.links[key];
  if (!o) {
    return {
      ...base,
      ctaUrl: normalizeWhatsAppUrl(base.ctaUrl, defaultLinks[key].ctaUrl),
    };
  }
  const ctaUrl = typeof o.ctaUrl === "string" ? o.ctaUrl : base.ctaUrl;
  return {
    ctaUrl: normalizeWhatsAppUrl(ctaUrl, defaultLinks[key].ctaUrl),
    ctaLabel: typeof o.ctaLabel === "string" && o.ctaLabel.trim() ? o.ctaLabel : base.ctaLabel,
  };
}

export function saveLinks(links: PageLinks) {
  window.localStorage.setItem(ADMIN_LINKS_KEY, JSON.stringify(links));
  window.dispatchEvent(new Event("gbia:links-changed"));
  window.dispatchEvent(new Event("storage"));
}

export function resetLinks() {
  window.localStorage.removeItem(ADMIN_LINKS_KEY);
  window.dispatchEvent(new Event("gbia:links-changed"));
  window.dispatchEvent(new Event("storage"));
}
