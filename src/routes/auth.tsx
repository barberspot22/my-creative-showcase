import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "/admin",
  }),
  head: () => ({
    meta: [
      { title: "Entrar — GB IA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: redirect || "/admin" });
    });
  }, [navigate, redirect]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("E-mail ou senha inválidos.");
      return;
    }
    navigate({ to: redirect || "/admin" });
  }

  return (
    <div style={{
      minHeight: "100vh", display: "grid", placeItems: "center",
      background: "#0a0a0a", color: "#f5f5f5", padding: 24,
      fontFamily: "'Manrope', system-ui, sans-serif",
    }}>
      <form onSubmit={onSubmit} style={{
        width: "100%", maxWidth: 380, background: "#141414",
        border: "1px solid #262626", borderRadius: 16, padding: 32,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>GB IA · Admin</h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
          Acesso restrito. Entre com sua conta.
        </p>
        <label style={{ display: "block", fontSize: 12, color: "#aaa", marginBottom: 6 }}>E-mail</label>
        <input
          type="email" value={email} required autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <label style={{ display: "block", fontSize: 12, color: "#aaa", margin: "16px 0 6px" }}>Senha</label>
        <input
          type="password" value={password} required autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        {error && (
          <p style={{ color: "#ff6b6b", fontSize: 13, marginTop: 12 }}>{error}</p>
        )}
        <button type="submit" disabled={loading} style={{
          marginTop: 20, width: "100%", padding: "12px 16px", borderRadius: 10,
          background: loading ? "#333" : "#f5f5f5", color: "#0a0a0a",
          border: "none", fontWeight: 700, cursor: loading ? "wait" : "pointer",
          fontSize: 14,
        }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  background: "#0a0a0a", border: "1px solid #333", color: "#f5f5f5",
  fontSize: 14, outline: "none",
};
