import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

async function loadTracking() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const res = await fetch(`${url}/rest/v1/tracking_settings?id=eq.1&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) return null;
  const rows = (await res.json()) as Array<Record<string, unknown>>;
  return rows[0] ?? null;
}

function hash(v: string) {
  return createHash("sha256").update(v.trim().toLowerCase()).digest("hex");
}

export const Route = createFileRoute("/api/public/meta-capi")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env.META_CAPI_ACCESS_TOKEN;
        if (!token) return new Response(JSON.stringify({ ok: false, error: "no_token" }), { status: 200 });

        const settings = await loadTracking();
        const pixelId = settings?.meta_pixel_id as string | undefined;
        const testCode = settings?.meta_test_event_code as string | undefined;
        if (!pixelId || !settings?.meta_capi_enabled) {
          return new Response(JSON.stringify({ ok: false, error: "capi_disabled" }), { status: 200 });
        }

        const body = (await request.json()) as {
          event_name: string;
          event_id?: string;
          event_source_url?: string;
          custom_data?: Record<string, unknown>;
          user?: { email?: string; phone?: string };
        };

        const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
        const ua = request.headers.get("user-agent") ?? "";

        const userData: Record<string, unknown> = { client_ip_address: ip, client_user_agent: ua };
        if (body.user?.email) userData.em = [hash(body.user.email)];
        if (body.user?.phone) userData.ph = [hash(body.user.phone.replace(/\D/g, ""))];

        const payload: Record<string, unknown> = {
          data: [{
            event_name: body.event_name,
            event_time: Math.floor(Date.now() / 1000),
            event_id: body.event_id,
            event_source_url: body.event_source_url,
            action_source: "website",
            user_data: userData,
            custom_data: body.custom_data ?? {},
          }],
        };
        if (testCode) payload.test_event_code = testCode;

        const res = await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json().catch(() => ({}));
        return new Response(JSON.stringify({ ok: res.ok, meta: json }), {
          status: res.ok ? 200 : 502,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
