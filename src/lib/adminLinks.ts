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

const orcamentoLabel = "Solicitar orçamento no WhatsApp";
const wa = (msg: string) => `https://wa.me/?text=${encodeURIComponent(msg)}`;

export const PAGE_META: { key: PageKey; label: string; defaultLabel: string; defaultUrl: string }[] = [
  { key: "gb-studio", label: "GB Studio", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Quero um orçamento do GB Studio (fotografia com IA).") },
  { key: "gb-social", label: "GB Social", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Quero um orçamento do GB Social (social media de IA).") },
  { key: "ecommerce", label: "E-commerce", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Quero um orçamento de E-commerce completo (loja + automação + IA).") },
  { key: "crm", label: "CRM", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Quero um orçamento de CRM sob medida.") },
  { key: "site-institucional", label: "Site Institucional", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Quero um orçamento de Site Institucional.") },
  { key: "cardapio-digital", label: "Cardápio Digital", defaultLabel: orcamentoLabel, defaultUrl: wa("Olá! Quero um orçamento de Cardápio Digital + Social Media.") },
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
