import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdmin } from "./admin-guard.functions";

// All writes for /admin. Every function requires an authenticated user with
// the `admin` role. Writes then use the service-role client to satisfy RLS
// (locked to service_role).

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
  .middleware([requireSupabaseAuth])
  .inputValidator((data: PortfolioItemInput) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("portfolio_items").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svUpsertPortfolioMany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: PortfolioItemInput[]) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("portfolio_items").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svDeletePortfolioItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("portfolio_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svUpsertHomeCards = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: any[]) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("home_cards").upsert(data, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svSavePageLinks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { page_key: string; cta_label: string; cta_url: string }[]) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("page_links").upsert(data, { onConflict: "page_key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svSaveSiteText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { page_key: string; content: Record<string, string> }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("site_texts").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svSaveTracking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: Record<string, any>) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("tracking_settings").upsert({ id: 1, ...data });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const svSaveSectionVisibility = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { page_key: string; section_key: string; visible: boolean }[]) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = data.map((r) => ({ ...r, updated_at: new Date().toISOString() }));
    const { error } = await supabaseAdmin
      .from("section_visibility")
      .upsert(rows, { onConflict: "page_key,section_key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
