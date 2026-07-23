import { createServerFn } from "@tanstack/react-start";

// All writes for /admin. /admin is not auth-gated in this project (matches the
// legacy behavior). Server functions use the service-role client so RLS
// (locked to service_role) is satisfied.

type PortfolioItemInput = {
  id?: string;
  page_key: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  position: number;
  visible: boolean;
};

export const svUpsertPortfolioItem = createServerFn({ method: "POST" })
  .inputValidator((data: PortfolioItemInput) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("portfolio_items").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svUpsertPortfolioMany = createServerFn({ method: "POST" })
  .inputValidator((data: PortfolioItemInput[]) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("portfolio_items").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svDeletePortfolioItem = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("portfolio_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svUpsertHomeCards = createServerFn({ method: "POST" })
  .inputValidator((data: any[]) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("home_cards").upsert(data, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svSavePageLinks = createServerFn({ method: "POST" })
  .inputValidator((data: { page_key: string; cta_label: string; cta_url: string }[]) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("page_links").upsert(data, { onConflict: "page_key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svSaveSiteText = createServerFn({ method: "POST" })
  .inputValidator((data: { page_key: string; content: Record<string, string> }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("site_texts").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svSaveTracking = createServerFn({ method: "POST" })
  .inputValidator((data: Record<string, any>) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("tracking_settings").upsert({ id: 1, ...data });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
