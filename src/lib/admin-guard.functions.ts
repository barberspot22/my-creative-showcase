import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Inline admin check via user_roles read (allowed by "users read own roles" RLS policy).
// Avoids exposing a SECURITY DEFINER function to signed-in users.
async function checkAdmin(context: {
  supabase: import("@supabase/supabase-js").SupabaseClient;
  userId: string;
}): Promise<boolean> {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return !!data;
}

/** Server-side check: true if current authenticated user has admin role. */
export const svIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    return { isAdmin: await checkAdmin(context) };
  });

/** Reusable helper for admin-only server functions. */
export async function assertAdmin(context: {
  supabase: import("@supabase/supabase-js").SupabaseClient;
  userId: string;
}) {
  if (!(await checkAdmin(context))) throw new Error("Forbidden: admin only");
}
