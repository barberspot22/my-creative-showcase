import { createFileRoute } from "@tanstack/react-router";

// One-shot endpoint to create the initial admin account. Protected by
// BOOTSTRAP_ADMIN_TOKEN. Call once and then the token can be rotated/removed.
//
// POST /api/public/bootstrap-admin
//   headers: x-bootstrap-token: <BOOTSTRAP_ADMIN_TOKEN>
//   body: { "email": "...", "password": "..." }

export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.BOOTSTRAP_ADMIN_TOKEN;
        if (!expected) return json({ ok: false, error: "not_configured" }, 500);
        const got = request.headers.get("x-bootstrap-token");
        if (!got || got !== expected) return json({ ok: false, error: "unauthorized" }, 401);

        const body = (await request.json().catch(() => ({}))) as {
          email?: string; password?: string;
        };
        if (!body.email || !body.password || body.password.length < 8) {
          return json({ ok: false, error: "invalid_input" }, 400);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Find or create user
        let userId: string | null = null;
        const list = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const found = list.data?.users?.find(
          (u) => u.email?.toLowerCase() === body.email!.toLowerCase(),
        );
        if (found) {
          userId = found.id;
          // Ensure password matches what caller provided + confirm email
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: body.password,
            email_confirm: true,
          });
        } else {
          const created = await supabaseAdmin.auth.admin.createUser({
            email: body.email,
            password: body.password,
            email_confirm: true,
          });
          if (created.error || !created.data.user) {
            return json({ ok: false, error: created.error?.message ?? "create_failed" }, 500);
          }
          userId = created.data.user.id;
        }

        // Grant admin role (idempotent)
        const { error: roleErr } = await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
        if (roleErr) return json({ ok: false, error: roleErr.message }, 500);

        return json({ ok: true, user_id: userId });
      },
    },
  },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
