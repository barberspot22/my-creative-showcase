import { useEffect, useState } from "react";

export type PageKey =
  | "gb-studio"
  | "gb-social"
  | "ecommerce"
  | "crm"
  | "site-institucional"
  | "cardapio-digital"
  | "trilha-cta";

export type PageLink = { ctaUrl: string; ctaLabel: string };
export type PageLinks = Record<PageKey, PageLink>;

export const PAGE_META: { key: PageKey; label: string; defaultLabel: string; defaultUrl: string }[] = [
  { key: "gb-studio", label: "GB Studio", defaultLabel: "Solicitar briefing", defaultUrl: "" },
  { key: "gb-social", label: "GB Social", defaultLabel: "Conhecer o GB Social", defaultUrl: "" },
  { key: "ecommerce", label: "E-commerce", defaultLabel: "Falar no WhatsApp", defaultUrl: "https://wa.me/?text=Ol%C3%A1%2C%20quero%20conversar%20sobre%20um%20e-commerce%20completo." },
  { key: "crm", label: "CRM", defaultLabel: "Falar no WhatsApp", defaultUrl: "https://wa.me/?text=Ol%C3%A1%2C%20quero%20conversar%20sobre%20um%20CRM%20pr%C3%B3prio." },
  { key: "site-institucional", label: "Site Institucional", defaultLabel: "Falar no WhatsApp", defaultUrl: "https://wa.me/?text=Ol%C3%A1%2C%20quero%20conversar%20sobre%20um%20site%20institucional." },
  { key: "cardapio-digital", label: "Cardápio Digital", defaultLabel: "Falar no WhatsApp", defaultUrl: "https://wa.me/?text=Ol%C3%A1%2C%20quero%20conversar%20sobre%20card%C3%A1pio%20digital%20e%20social%20media." },
  { key: "trilha-cta", label: "Home · Trilha (CTA final)", defaultLabel: "Começar minha trilha", defaultUrl: "#kontakt" },
];

export const defaultLinks: PageLinks = PAGE_META.reduce((acc, item) => {
  acc[item.key] = { ctaUrl: item.defaultUrl, ctaLabel: item.defaultLabel };
  return acc;
}, {} as PageLinks);

export const ADMIN_LINKS_KEY = "gbia.pageLinks.v1";

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
        merged[key] = {
          ctaUrl: typeof value.ctaUrl === "string" ? value.ctaUrl : defaultLinks[key].ctaUrl,
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
  return useAdminLinks()[key];
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
