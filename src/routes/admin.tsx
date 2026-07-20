import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback, ReactNode } from "react";
import { toast, Toaster } from "sonner";
import {
  fetchHomeCards, upsertHomeCards, HomeCard,
  fetchPageLinks, savePageLinks, PageLinkRow,
  fetchPortfolio, upsertPortfolioItem, deletePortfolioItem, PortfolioItem, PORTFOLIO_PAGES,
  fetchSiteText, saveSiteText, SITE_TEXT_PAGES,
  fetchTracking, saveTracking, TrackingSettings, defaultTracking,
} from "@/lib/cms";
import { PAGE_META, defaultLinks, ADMIN_LINKS_KEY } from "@/lib/adminLinks";

const ADMIN_CASES_KEY = "gbia.caseCards.v4";

const defaultHomeCards: HomeCard[] = [
  { key: "studio", title: "Studio", description: "Lookbook completo gerado por IA para marca têxtil", badge: "LOOKBOOK", href: "/gb-studio", frames: [], position: 0 },
  { key: "social", title: "Social", description: "Seu Social Media de IA no WhatsApp", badge: "CHAT IA", href: "/gb-social", frames: [], position: 1 },
  { key: "ecommerce", title: "E-commerce", description: "Loja pronta pra vender no automático", badge: "LOJA", href: "/ecommerce", frames: [], position: 2 },
  { key: "crm", title: "CRM", description: "Funil, follow-up e dashboard num só lugar", badge: "CRM + IA", href: "/crm", frames: [], position: 3 },
  { key: "site", title: "Site Institucional", description: "Autoridade em segundos e contato sem desvio", badge: "SITES", href: "/site-institucional", frames: [], position: 4 },
  { key: "menu", title: "Menu Digital", description: "Cardápio, pedidos e presença digital", badge: "CATÁLOGO", href: "/cardapio-digital", frames: [], position: 5 },
];

type TabKey = "home" | "portfolio" | "links" | "textos" | "tracking";

const TABS: { key: TabKey; label: string; icon: string; group: string }[] = [
  { key: "home",      label: "Home",       icon: "◧", group: "Conteúdo" },
  { key: "portfolio", label: "Portfólios", icon: "▦", group: "Conteúdo" },
  { key: "links",     label: "Links",      icon: "↗", group: "Conteúdo" },
  { key: "textos",    label: "Textos",     icon: "¶", group: "Conteúdo" },
  { key: "tracking",  label: "Pixel",      icon: "◈", group: "Rastreamento" },
];

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const [tab, setTab] = useState<TabKey>("home");
  const current = TABS.find((t) => t.key === tab)!;

  return (
    <div className="admX-shell">
      <Toaster position="top-right" richColors closeButton theme="light"/>

      {/* Desktop sidebar */}
      <aside className="admX-side">
        <div className="admX-brand">
          <div className="admX-brand-mark">GB</div>
          <div className="admX-brand-name">GB IA Admin<small>Painel de conteúdo</small></div>
        </div>
        <a href="/" className="admX-back">← Voltar para o site</a>

        <div className="admX-nav">
          <div className="admX-nav-label">Conteúdo</div>
          {TABS.filter((t) => t.group === "Conteúdo").map((t) => (
            <button key={t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
              <span className="ico">{t.icon}</span> {t.label}
            </button>
          ))}
          <div className="admX-nav-label" style={{ marginTop: 8 }}>Rastreamento</div>
          {TABS.filter((t) => t.group === "Rastreamento").map((t) => (
            <button key={t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
              <span className="ico">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </aside>

      <main className="admX-main">
        <TopCrumb section={current.label} />
        <section className="admX-section" key={tab}>
          {tab === "home" && <HomeCardsTab />}
          {tab === "portfolio" && <PortfolioTab />}
          {tab === "links" && <LinksTab />}
          {tab === "textos" && <TextsTab />}
          {tab === "tracking" && <TrackingTab />}
        </section>
      </main>

      {/* Mobile bottom nav */}
      <div className="admX-bottom">
        <nav>
          {TABS.map((t) => (
            <button key={t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)} aria-label={t.label}>
              <span className="ico" style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function TopCrumb({ section }: { section: string }) {
  return (
    <div className="admX-topbar">
      <div className="admX-crumb">GB IA · Admin / <b>{section}</b></div>
    </div>
  );
}

/* --------------------- Section header --------------------- */
function SectionHeader({
  title, description, actions,
}: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="admX-h">
      <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
      {actions && <div className="admX-h-actions">{actions}</div>}
    </div>
  );
}

/* --------------------- Save button --------------------- */
function SaveButton({ dirty, saving, onClick, label = "Salvar" }: { dirty: boolean; saving: boolean; onClick: () => void; label?: string }) {
  return (
    <button className={"admX-save" + (dirty ? " dirty" : "")} onClick={onClick} disabled={saving}>
      <span className="dot"/> {saving ? "Salvando…" : label}
    </button>
  );
}

/* --------------------- Cmd/Ctrl+S --------------------- */
function useSaveShortcut(fn: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") { e.preventDefault(); fn(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [fn]);
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/* =========================================================
   HOME · CARDS
   ========================================================= */
function HomeCardsTab() {
  const [cards, setCards] = useState<HomeCard[]>(defaultHomeCards);
  const [activeKey, setActiveKey] = useState("studio");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchHomeCards().then((cloud) => {
      if (cloud.length) setCards(defaultHomeCards.map((d) => cloud.find((c) => c.key === d.key) ?? d));
    }).catch(() => toast.error("Não consegui carregar do Cloud. Editando os padrões.")).finally(() => setLoaded(true));
  }, []);

  const active = useMemo(() => cards.find((c) => c.key === activeKey) ?? cards[0], [cards, activeKey]);

  const update = (patch: Partial<HomeCard>) => {
    setCards((cur) => cur.map((c) => c.key === activeKey ? { ...c, ...patch } : c));
    setDirty(true);
  };
  const setFrame = (i: number, src: string) => update({ frames: active.frames.map((f, j) => j === i ? src : f) });
  const addFrame = () => update({ frames: [...active.frames, ""] });
  const removeFrame = (i: number) => update({ frames: active.frames.filter((_, j) => j !== i) });
  const onUpload = async (i: number, file: File | null) => { if (file) setFrame(i, await fileToDataUrl(file)); };

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await upsertHomeCards(cards);
      const legacy = cards.map((c) => ({ key: c.key, href: c.href, title: c.title, description: c.description, badge: c.badge, frames: c.frames.filter(Boolean) }));
      window.localStorage.setItem(ADMIN_CASES_KEY, JSON.stringify(legacy));
      window.dispatchEvent(new Event("storage"));
      setDirty(false);
      toast.success("Cards salvos e publicados no site.");
    } catch (e: any) { toast.error("Erro ao salvar: " + (e?.message ?? e)); }
    finally { setSaving(false); }
  }, [cards]);
  useSaveShortcut(save);

  return (
    <>
      <SectionHeader
        title="Cards da home"
        description="Os cards que aparecem no carrossel principal. Selecione um para editar título, descrição, badge, link e imagens."
        actions={<SaveButton dirty={dirty} saving={saving} onClick={save} label="Publicar" />}
      />

      <div className="admX-split">
        <div>
          <div className="admX-card">
            <h3>Cards</h3>
            <p className="hint">Toque em um card para editar. As alterações aparecem para todos os visitantes ao publicar.</p>
            <div className="admX-list">
              {cards.map((c) => (
                <div key={c.key} className={"admX-item" + (c.key === activeKey ? " active" : "")} onClick={() => setActiveKey(c.key)}>
                  <div className="admX-thumb">
                    {c.frames.filter(Boolean)[0] ? <img src={c.frames.filter(Boolean)[0]} alt=""/> : <span>Sem imagem</span>}
                  </div>
                  <div className="admX-item-body">
                    <strong>{c.title}</strong>
                    <span>{c.href}</span>
                  </div>
                  <span className={"admX-badge " + (c.frames.filter(Boolean).length ? "ok" : "warn")}>
                    {c.frames.filter(Boolean).length ? `${c.frames.filter(Boolean).length} img` : "sem img"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {loaded && active && (
            <div className="admX-card" style={{ marginTop: 16 }}>
              <h3>Editar: {active.title}</h3>
              <p className="hint">Título, descrição, selo e destino do clique.</p>
              <div className="admX-row2">
                <div className="admX-field"><label>Título</label><input className="admX-input" value={active.title} onChange={(e) => update({ title: e.target.value })}/></div>
                <div className="admX-field"><label>Selo (badge)</label><input className="admX-input" value={active.badge} onChange={(e) => update({ badge: e.target.value })}/></div>
              </div>
              <div className="admX-field"><label>Descrição</label><textarea className="admX-textarea" value={active.description} onChange={(e) => update({ description: e.target.value })}/></div>
              <div className="admX-field">
                <label>Link de destino</label>
                <input className="admX-input" value={active.href} onChange={(e) => update({ href: e.target.value })} placeholder="/rota-interna ou https://…" />
                <span className="desc">Rota interna do site (ex.: /crm) ou URL completa.</span>
              </div>

              <div className="admX-field" style={{ marginTop: 8 }}>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  Imagens do card (loop na capa)
                  <button type="button" className="admX-btn primary" onClick={addFrame}>+ Adicionar</button>
                </label>
                <div className="admX-images">
                  {(active.frames.length ? active.frames : [""]).map((src, i) => (
                    <div className="admX-image-row" key={i}>
                      <div className="admX-thumb">{src ? <img src={src} alt=""/> : <span>Sem imagem</span>}</div>
                      <input type="text" value={src} placeholder="URL da imagem" onChange={(e) => setFrame(i, e.target.value)}/>
                      <label className="admX-upload">Upload<input type="file" accept="image/*" onChange={(e) => onUpload(i, e.target.files?.[0] ?? null)}/></label>
                      <button type="button" className="admX-btn danger" onClick={() => removeFrame(i)}>Remover</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {active && (
          <aside className="admX-preview">
            <div className="admX-preview-head">Prévia do card <span>{active.key}</span></div>
            <div className="admX-preview-body">
              <div className="admX-preview-frame">
                {active.frames.filter(Boolean).slice(0, 3).map((src, i) => <img src={src} key={i} alt=""/>)}
                <span className="pb">{active.badge}</span>
              </div>
              <h4>{active.title}</h4>
              <p>{active.description}</p>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}

/* =========================================================
   PORTFOLIO
   ========================================================= */
function PortfolioTab() {
  const [pageKey, setPageKey] = useState(PORTFOLIO_PAGES[0].key);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [pending, setPending] = useState<Record<number, boolean>>({});

  const load = useCallback(() => fetchPortfolio(pageKey).then(setItems).catch(() => toast.error("Erro carregando portfólio.")), [pageKey]);
  useEffect(() => { load(); setEditingIdx(null); setPending({}); }, [pageKey, load]);

  const addItem = async () => {
    const newItem: PortfolioItem = { page_key: pageKey, title: "Novo item", description: "", image_url: "", link_url: "", position: items.length, visible: true };
    try { await upsertPortfolioItem(newItem); toast.success("Item criado."); await load(); setEditingIdx(items.length); }
    catch (e: any) { toast.error("Erro: " + e.message); }
  };
  const update = (idx: number, patch: Partial<PortfolioItem>) => {
    setItems((cur) => cur.map((it, i) => i === idx ? { ...it, ...patch } : it));
    setPending((p) => ({ ...p, [idx]: true }));
  };
  const saveOne = async (idx: number) => {
    setSaving(true);
    try { await upsertPortfolioItem(items[idx]); toast.success("Item salvo."); setPending((p) => { const n = { ...p }; delete n[idx]; return n; }); await load(); }
    catch (e: any) { toast.error("Erro: " + e.message); }
    finally { setSaving(false); }
  };
  const remove = async (idx: number) => {
    const it = items[idx];
    if (!it.id) { setItems((cur) => cur.filter((_, i) => i !== idx)); return; }
    toast("Confirmar exclusão?", {
      action: { label: "Excluir", onClick: async () => { await deletePortfolioItem(it.id!); toast.success("Item removido."); load(); setEditingIdx(null); } },
      cancel: { label: "Cancelar", onClick: () => {} },
    });
  };
  const onUpload = async (idx: number, file: File | null) => { if (file) update(idx, { image_url: await fileToDataUrl(file) }); };

  const saveAll = useCallback(async () => {
    setSaving(true);
    try { for (const it of items) await upsertPortfolioItem(it); toast.success("Todos os itens salvos."); setPending({}); }
    catch (e: any) { toast.error("Erro: " + e.message); }
    finally { setSaving(false); }
  }, [items]);
  useSaveShortcut(saveAll);
  const dirty = Object.keys(pending).length > 0;

  const editing = editingIdx !== null ? items[editingIdx] : null;

  return (
    <>
      <SectionHeader
        title="Portfólios"
        description="Casos e exemplos exibidos em cada página de produto."
        actions={<>
          <button className="admX-btn primary" onClick={addItem}>+ Novo item</button>
          <SaveButton dirty={dirty} saving={saving} onClick={saveAll} label="Salvar tudo"/>
        </>}
      />

      <div className="admX-chips">
        {PORTFOLIO_PAGES.map((p) => (
          <button key={p.key} className={"admX-chip" + (p.key === pageKey ? " active" : "")} onClick={() => setPageKey(p.key)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="admX-split">
        <div>
          <div className="admX-card">
            <h3>Itens ({items.length})</h3>
            <p className="hint">Clique em um item para editar. Novos itens ficam ocultos até você marcá-los como visíveis.</p>
            {items.length === 0 && <div className="admX-item" style={{ justifyContent: "center", color: "var(--adm-ink-soft)" }}>Nenhum item nesta página ainda.</div>}
            <div className="admX-list">
              {items.map((it, idx) => (
                <div key={it.id ?? idx} className={"admX-item" + (editingIdx === idx ? " active" : "")} onClick={() => setEditingIdx(idx)}>
                  <div className="admX-thumb">{it.image_url ? <img src={it.image_url} alt=""/> : <span>Sem imagem</span>}</div>
                  <div className="admX-item-body">
                    <strong>{it.title || "(sem título)"}</strong>
                    <span>{it.link_url || "sem link"}</span>
                  </div>
                  <span className={"admX-badge " + (it.visible ? "ok" : "off")}>{it.visible ? "visível" : "oculto"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="admX-card" style={{ position: "sticky", top: 76 }}>
          {!editing && <p className="hint" style={{ margin: 0 }}>Selecione um item ao lado para editar.</p>}
          {editing && editingIdx !== null && (
            <>
              <h3>Editar item</h3>
              <div className="admX-field"><label>Título</label><input className="admX-input" value={editing.title} onChange={(e) => update(editingIdx, { title: e.target.value })}/></div>
              <div className="admX-field"><label>Descrição</label><textarea className="admX-textarea" value={editing.description} onChange={(e) => update(editingIdx, { description: e.target.value })}/></div>
              <div className="admX-field"><label>Link (opcional)</label><input className="admX-input" value={editing.link_url} onChange={(e) => update(editingIdx, { link_url: e.target.value })}/></div>
              <div className="admX-field"><label>URL da imagem</label><input className="admX-input" value={editing.image_url} onChange={(e) => update(editingIdx, { image_url: e.target.value })} placeholder="https://…"/></div>
              <div className="admX-field">
                <label className="admX-upload" style={{ textAlign: "center" }}>Fazer upload da imagem
                  <input type="file" accept="image/*" onChange={(e) => onUpload(editingIdx, e.target.files?.[0] ?? null)}/>
                </label>
              </div>
              {editing.image_url && (
                <div className="admX-thumb" style={{ width: "100%", height: 160, marginBottom: 12 }}>
                  <img src={editing.image_url} alt=""/>
                </div>
              )}
              <label className="admX-toggle">
                <input type="checkbox" checked={editing.visible} onChange={(e) => update(editingIdx, { visible: e.target.checked })}/>
                Visível no site
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "space-between" }}>
                <button className="admX-btn danger" onClick={() => remove(editingIdx)}>Excluir</button>
                <button className="admX-btn primary" onClick={() => saveOne(editingIdx)} disabled={saving}>{saving ? "…" : "Salvar item"}</button>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}

/* =========================================================
   LINKS
   ========================================================= */
function LinksTab() {
  const [links, setLinks] = useState<PageLinkRow[]>(
    PAGE_META.map((m) => ({ page_key: m.key, cta_label: defaultLinks[m.key].ctaLabel, cta_url: defaultLinks[m.key].ctaUrl }))
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetchPageLinks().then((cloud) => {
      setLinks((cur) => cur.map((l) => cloud[l.page_key] ? { ...l, ...cloud[l.page_key] } : l));
    }).catch(() => {});
  }, []);

  const update = (i: number, patch: Partial<PageLinkRow>) => {
    setLinks((cur) => cur.map((l, j) => j === i ? { ...l, ...patch } : l));
    setDirty(true);
  };

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await savePageLinks(links);
      const legacy: Record<string, { ctaLabel: string; ctaUrl: string }> = {};
      links.forEach((l) => { legacy[l.page_key] = { ctaLabel: l.cta_label, ctaUrl: l.cta_url }; });
      window.localStorage.setItem(ADMIN_LINKS_KEY, JSON.stringify(legacy));
      window.dispatchEvent(new Event("gbia:links-changed"));
      setDirty(false);
      toast.success("Links atualizados no site.");
    } catch (e: any) { toast.error("Erro: " + e.message); }
    finally { setSaving(false); }
  }, [links]);
  useSaveShortcut(save);

  const filtered = links
    .map((l, i) => ({ l, i, meta: PAGE_META.find((m) => m.key === l.page_key) }))
    .filter(({ l, meta }) => !q || (meta?.label ?? l.page_key).toLowerCase().includes(q.toLowerCase()) || l.cta_label.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <SectionHeader
        title="Links & CTAs"
        description="Texto e destino de cada botão principal, por página."
        actions={<SaveButton dirty={dirty} saving={saving} onClick={save}/>}
      />

      <div className="admX-search" style={{ maxWidth: 420 }}>
        <input className="admX-input" placeholder="Buscar por página ou botão…" value={q} onChange={(e) => setQ(e.target.value)}/>
      </div>

      <div className="admX-list">
        {filtered.map(({ l, i, meta }) => (
          <div key={l.page_key} className="admX-card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0 }}>{meta?.label ?? l.page_key}</h3>
                <p className="hint" style={{ margin: "2px 0 0" }}>{l.cta_url || "sem URL"}</p>
              </div>
              {l.cta_url && (
                <a className="admX-btn ghost" href={l.cta_url} target="_blank" rel="noopener noreferrer">Abrir ↗</a>
              )}
            </div>
            <div className="admX-row2">
              <div className="admX-field"><label>Texto do botão</label><input className="admX-input" value={l.cta_label} onChange={(e) => update(i, { cta_label: e.target.value })}/></div>
              <div className="admX-field"><label>URL de destino</label><input className="admX-input" value={l.cta_url} onChange={(e) => update(i, { cta_url: e.target.value })} placeholder="https://… ou #contato"/></div>
            </div>
            <div style={{ marginTop: 4 }}>
              <span className="admX-badge warn" style={{ background: "var(--adm-ink)", color: "var(--adm-bg)" }}>{l.cta_label || "sem texto"}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* =========================================================
   TEXTOS
   ========================================================= */
function TextsTab() {
  const [pageKey, setPageKey] = useState(SITE_TEXT_PAGES[0].key);
  const [content, setContent] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => { fetchSiteText(pageKey).then(setContent).catch(() => setContent({})); setDirty(false); }, [pageKey]);

  const save = useCallback(async () => {
    setSaving(true);
    try { await saveSiteText(pageKey, content); setDirty(false); toast.success("Textos salvos."); }
    catch (e: any) { toast.error("Erro: " + e.message); }
    finally { setSaving(false); }
  }, [pageKey, content]);
  useSaveShortcut(save);

  const entries = Object.entries(content).filter(([k, v]) => !q || k.toLowerCase().includes(q.toLowerCase()) || v.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <SectionHeader
        title="Textos das páginas"
        description="Textos editáveis expostos pelo hook useSiteText. Use chaves como hero_title, cta_help, etc."
        actions={<SaveButton dirty={dirty} saving={saving} onClick={save}/>}
      />

      <div className="admX-chips">
        {SITE_TEXT_PAGES.map((p) => (
          <button key={p.key} className={"admX-chip" + (p.key === pageKey ? " active" : "")} onClick={() => setPageKey(p.key)}>{p.label}</button>
        ))}
      </div>

      <div className="admX-search" style={{ maxWidth: 420 }}>
        <input className="admX-input" placeholder="Buscar chave ou conteúdo…" value={q} onChange={(e) => setQ(e.target.value)}/>
      </div>

      <div className="admX-list">
        {entries.length === 0 && <div className="admX-card"><p className="hint" style={{ margin: 0 }}>Nenhuma chave ainda. Crie a primeira abaixo.</p></div>}
        {entries.map(([k, v]) => (
          <div key={k} className="admX-card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <code style={{ font: "700 12px JetBrains Mono, monospace", color: "var(--adm-gold-ink)", background: "var(--adm-gold-soft)", padding: "3px 8px", borderRadius: 6 }}>{k}</code>
              <button className="admX-btn danger" onClick={() => { setContent((c) => { const { [k]: _, ...rest } = c; return rest; }); setDirty(true); }}>Remover</button>
            </div>
            <textarea className="admX-textarea" value={v} onChange={(e) => { setContent((c) => ({ ...c, [k]: e.target.value })); setDirty(true); }}/>
          </div>
        ))}
      </div>

      <div className="admX-card">
        <h3>Nova chave</h3>
        <p className="hint">Ex.: <code>hero_title</code>, <code>cta_secundario</code>.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="admX-input" placeholder="nome_da_chave" value={newKey} onChange={(e) => setNewKey(e.target.value)}/>
          <button className="admX-btn primary" onClick={() => { if (newKey.trim()) { setContent((c) => ({ ...c, [newKey.trim()]: "" })); setNewKey(""); setDirty(true); } }}>+ Adicionar</button>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   TRACKING
   ========================================================= */
function TrackingTab() {
  const [t, setT] = useState<TrackingSettings>(defaultTracking);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchTracking().then(setT).catch(() => {}); }, []);
  const update = (patch: Partial<TrackingSettings>) => { setT((cur) => ({ ...cur, ...patch })); setDirty(true); };

  const save = useCallback(async () => {
    setSaving(true);
    try { await saveTracking(t); setDirty(false); toast.success("Configurações salvas. Recarregue o site para aplicar."); }
    catch (e: any) { toast.error("Erro: " + e.message); }
    finally { setSaving(false); }
  }, [t]);
  useSaveShortcut(save);

  const providers = [
    {
      title: "Meta Pixel + CAPI", subtitle: "Facebook / Instagram Ads",
      on: !!t.meta_pixel_id,
      body: (
        <>
          <div className="admX-field"><label>Pixel ID</label><input className="admX-input" value={t.meta_pixel_id} onChange={(e) => update({ meta_pixel_id: e.target.value })} placeholder="123456789012345"/></div>
          <label className="admX-toggle"><input type="checkbox" checked={t.meta_capi_enabled} onChange={(e) => update({ meta_capi_enabled: e.target.checked })}/>Ativar Conversion API (server-side)</label>
          <div className="admX-field" style={{ marginTop: 12 }}><label>Test Event Code (opcional)</label><input className="admX-input" value={t.meta_test_event_code} onChange={(e) => update({ meta_test_event_code: e.target.value })} placeholder="TEST12345"/></div>
          <p className="hint" style={{ margin: 0 }}>Para a CAPI funcionar, o secret <code>META_CAPI_ACCESS_TOKEN</code> precisa estar configurado no backend.</p>
        </>
      ),
    },
    {
      title: "Google Analytics 4", subtitle: "Eventos e conversões",
      on: !!t.ga4_measurement_id,
      body: <div className="admX-field"><label>Measurement ID</label><input className="admX-input" value={t.ga4_measurement_id} onChange={(e) => update({ ga4_measurement_id: e.target.value })} placeholder="G-XXXXXXXXXX"/></div>,
    },
    {
      title: "Google Tag Manager", subtitle: "Container para todas as tags",
      on: !!t.gtm_container_id,
      body: <div className="admX-field"><label>Container ID</label><input className="admX-input" value={t.gtm_container_id} onChange={(e) => update({ gtm_container_id: e.target.value })} placeholder="GTM-XXXXXXX"/></div>,
    },
    {
      title: "Google Ads", subtitle: "Conversões de anúncios",
      on: !!t.google_ads_id,
      body: (
        <>
          <div className="admX-field"><label>Conversion ID</label><input className="admX-input" value={t.google_ads_id} onChange={(e) => update({ google_ads_id: e.target.value })} placeholder="AW-123456789"/></div>
          <div className="admX-field"><label>Conversion Label</label><input className="admX-input" value={t.google_ads_conversion_label} onChange={(e) => update({ google_ads_conversion_label: e.target.value })} placeholder="abcDEF123"/></div>
        </>
      ),
    },
  ];

  return (
    <>
      <SectionHeader
        title="Rastreamento & Pixel"
        description="Configure os IDs de cada plataforma. Os scripts são injetados automaticamente no site publicado."
        actions={<SaveButton dirty={dirty} saving={saving} onClick={save}/>}
      />

      <div className="admX-track-grid">
        {providers.map((p) => (
          <div key={p.title} className="admX-track-card">
            <header>
              <div><h3>{p.title}</h3><p>{p.subtitle}</p></div>
              <span className={"admX-status " + (p.on ? "on" : "off")}>{p.on ? "Configurado" : "Desativado"}</span>
            </header>
            {p.body}
          </div>
        ))}
      </div>
    </>
  );
}
