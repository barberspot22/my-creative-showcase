// Catalog of top-level sections per page that admins can hide/show.
// Each entry maps a stable section_key to a CSS selector already present in
// the page markup. Hiding is applied via a global <style> injected by
// SectionVisibilityStyle in __root.tsx — no route JSX changes needed.

export type SectionDef = { key: string; label: string; selector: string };

export type SectionsPageKey =
  | "home"
  | "gb-studio"
  | "gb-social"
  | "ecommerce"
  | "crm"
  | "site-institucional"
  | "cardapio-digital";

export const SECTIONS_PAGES: { key: SectionsPageKey; label: string; route: string }[] = [
  { key: "home",              label: "Home",              route: "/" },
  { key: "gb-studio",         label: "GB Studio",         route: "/gb-studio" },
  { key: "gb-social",         label: "GB Social",         route: "/gb-social" },
  { key: "ecommerce",         label: "E-commerce",        route: "/ecommerce" },
  { key: "crm",               label: "CRM",               route: "/crm" },
  { key: "site-institucional",label: "Site Institucional",route: "/site-institucional" },
  { key: "cardapio-digital",  label: "Cardápio Digital",  route: "/cardapio-digital" },
];

export const SECTIONS_CATALOG: Record<SectionsPageKey, SectionDef[]> = {
  "home": [
    { key: "hero",         label: "Hero (robô + título)", selector: ".heroFoldScene" },
    { key: "produtos",     label: "Cards de produtos",    selector: ".circleProductSection" },
    { key: "referencias",  label: "Referências",          selector: "section.references" },
    { key: "contato",      label: "Contato / CTA final",  selector: "section.contact" },
  ],
  "gb-studio": [
    { key: "hero",     label: "Hero",              selector: ".studioHero" },
    { key: "gallery",  label: "Galeria lookbook",  selector: ".galleryBlock" },
    { key: "problem",  label: "Bloco de problema", selector: ".problemBlock" },
    { key: "process",  label: "Como funciona",     selector: ".processBlock" },
    { key: "audience", label: "Público-alvo",      selector: ".audienceBlock" },
    { key: "final-cta",label: "CTA final",         selector: ".finalCta" },
  ],
  "gb-social": [
    { key: "hero",      label: "Hero",             selector: ".socialHero" },
    { key: "showcase",  label: "Showcase",         selector: ".socialWorkShowcase" },
    { key: "whatsapp",  label: "Bloco WhatsApp",   selector: ".whatsappBlock" },
    { key: "features",  label: "Recursos",         selector: ".socialFeatures" },
    { key: "flow",      label: "Como funciona",    selector: ".socialFlow" },
    { key: "final-cta", label: "CTA final",        selector: ".finalCta" },
  ],
  "ecommerce": [
    { key: "hero",         label: "Hero",              selector: ".commerceHero" },
    { key: "gallery",      label: "Galeria de sites",  selector: ".commerceGallerySection" },
    { key: "deliverables", label: "O que entregamos",  selector: ".commerceDeliverables" },
    { key: "audio",        label: "Bloco de áudio IA", selector: ".commerceAudio" },
    { key: "omni",         label: "Omnichannel",       selector: ".commerceOmni" },
    { key: "final-cta",    label: "CTA final",         selector: ".finalCta" },
  ],
  "crm": [
    { key: "hero",       label: "Hero",                selector: ".crmHero" },
    { key: "auto",       label: "Automações",          selector: ".crmAutoBlock" },
    { key: "showcase",   label: "Showcase do sistema", selector: ".crmSystemShowcase" },
    { key: "chat",       label: "Chat / IA",           selector: ".crmChatBlock" },
    { key: "structure",  label: "Estrutura",           selector: ".crmStructure" },
    { key: "recover",    label: "Recuperação",         selector: ".crmRecoverShowcase" },
    { key: "compare",    label: "Comparativo",         selector: ".crmCompareBlock" },
    { key: "final-cta",  label: "CTA final",           selector: ".finalCta" },
  ],
  "site-institucional": [
    { key: "hero",       label: "Hero",                selector: ".siteProductHero" },
    { key: "showcase",   label: "Showcase de sites",   selector: ".siteWorkShowcase" },
    { key: "value",      label: "Valor / entrega",     selector: ".siteProductValue" },
    { key: "process",    label: "Como funciona",       selector: ".siteProductProcess" },
    { key: "final-cta",  label: "CTA final",           selector: ".finalCta" },
  ],
  "cardapio-digital": [
    { key: "hero",         label: "Hero",              selector: ".menuProductHero" },
    { key: "deliverables", label: "O que entregamos",  selector: ".menuValueDeliverables" },
    { key: "reference",    label: "Referências",       selector: ".menuReferenceSection" },
    { key: "catalog",      label: "Widget de cardápio",selector: ".menuCatalogWidgetSection" },
    { key: "process",      label: "Como funciona",     selector: ".menuProductProcess" },
    { key: "final-cta",    label: "CTA final",         selector: ".finalCta" },
  ],
};

export type VisibilityMap = Record<string, Record<string, boolean>>; // page -> section -> visible

export function isSectionVisible(map: VisibilityMap, pageKey: string, sectionKey: string): boolean {
  const v = map?.[pageKey]?.[sectionKey];
  return v === undefined ? true : v;
}
