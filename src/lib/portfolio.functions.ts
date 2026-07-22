import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemSchema = z.object({
  id: z.string().uuid().optional(),
  page_key: z.string().min(1),
  title: z.string().default(""),
  description: z.string().default(""),
  image_url: z.string().default(""),
  link_url: z.string().default(""),
  position: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const upsertPortfolioFn = createServerFn({ method: "POST" })
  .inputValidator((data) => itemSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("portfolio_items").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePortfolioFn = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("portfolio_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
