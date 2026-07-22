import { supabase } from "@/integrations/supabase/client";
import { upsertPortfolioFn, deletePortfolioFn } from "@/lib/portfolio.functions";

export type HomeCard = {
  key: string;
  title: string;
  description: string;
  badge: string;
  href: string;
  frames: string[];
  position: number;
};

export type PortfolioItem = {
  id?: string;
  page_key: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  position: number;
  visible: boolean;
};

export type PageLinkRow = { page_key: string; cta_label: string; cta_url: string };

export type TrackingSettings = {
  meta_pixel_id: string;
  meta_capi_enabled: boolean;
  meta_test_event_code: string;
  ga4_measurement_id: string;
  gtm_container_id: string;
  google_ads_id: string;
  google_ads_conversion_label: string;
};

export const PORTFOLIO_PAGES: { key: string; label: string }[] = [
  { key: "gb-social", label: "GB Social" },
  { key: "site-institucional", label: "Site Institucional" },
  { key: "ecommerce", label: "E-commerce" },
  { key: "cardapio-digital", label: "Cardápio / Menu Digital" },
  { key: "gb-studio", label: "GB Studio" },
  { key: "crm", label: "CRM" },
];

export const SITE_TEXT_PAGES = [
  { key: "home", label: "Home" },
  ...PORTFOLIO_PAGES,
];

// ---------------- Home Cards ----------------
export async function fetchHomeCards(): Promise<HomeCard[]> {
  const { data, error } = await supabase.from("home_cards").select("*").order("position");
  if (error) throw error;
  return (data ?? []).map((row) => ({
    key: row.key,
    title: row.title,
    description: row.description,
    badge: row.badge,
    href: row.href,
    frames: Array.isArray(row.frames) ? (row.frames as string[]) : [],
    position: row.position,
  }));
}

export async function upsertHomeCards(cards: HomeCard[]) {
  const rows = cards.map((c, i) => ({ ...c, position: i, frames: c.frames as unknown as any }));
  const { error } = await supabase.from("home_cards").upsert(rows, { onConflict: "key" });
  if (error) throw error;
}

// ---------------- Page Links ----------------
export async function fetchPageLinks(): Promise<Record<string, { cta_label: string; cta_url: string }>> {
  const { data, error } = await supabase.from("page_links").select("*");
  if (error) throw error;
  const map: Record<string, { cta_label: string; cta_url: string }> = {};
  (data ?? []).forEach((row: any) => {
    map[row.page_key] = { cta_label: row.cta_label ?? "", cta_url: row.cta_url ?? "" };
  });
  return map;
}

export async function savePageLinks(links: PageLinkRow[]) {
  const { error } = await supabase.from("page_links").upsert(links, { onConflict: "page_key" });
  if (error) throw error;
}

// ---------------- Portfolio ----------------
export async function fetchPortfolio(pageKey: string): Promise<PortfolioItem[]> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("page_key", pageKey)
    .order("position");
  if (error) throw error;
  return (data ?? []) as PortfolioItem[];
}

export async function upsertPortfolioItem(item: PortfolioItem) {
  const { error } = await supabase.from("portfolio_items").upsert(item);
  if (error) throw error;
}

export async function deletePortfolioItem(id: string) {
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderPortfolio(items: PortfolioItem[]) {
  const rows = items.map((it, i) => ({ ...it, position: i }));
  const { error } = await supabase.from("portfolio_items").upsert(rows);
  if (error) throw error;
}

// ---------------- Site Texts ----------------
export async function fetchSiteText(pageKey: string): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("site_texts").select("content").eq("page_key", pageKey).maybeSingle();
  if (error) throw error;
  return (data?.content as Record<string, string>) ?? {};
}

export async function saveSiteText(pageKey: string, content: Record<string, string>) {
  const { error } = await supabase.from("site_texts").upsert({ page_key: pageKey, content });
  if (error) throw error;
}

// ---------------- Tracking ----------------
export const defaultTracking: TrackingSettings = {
  meta_pixel_id: "",
  meta_capi_enabled: false,
  meta_test_event_code: "",
  ga4_measurement_id: "",
  gtm_container_id: "",
  google_ads_id: "",
  google_ads_conversion_label: "",
};

export async function fetchTracking(): Promise<TrackingSettings> {
  const { data, error } = await supabase.from("tracking_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return { ...defaultTracking, ...(data ?? {}) } as TrackingSettings;
}

export async function saveTracking(settings: TrackingSettings) {
  const { error } = await supabase.from("tracking_settings").upsert({ id: 1, ...settings });
  if (error) throw error;
}
