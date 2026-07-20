import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const [tab, setTab] = useState<TabKey>("home");
  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <a className="adminBack" href="/">← Voltar para o site</a>
        <div>
          <p className="adminEyebrow">GB IA Admin</p>
          <h1>Painel de controle</h1>
          <p>Personalize conteúdo, portfólio, links e rastreamento.</p>
        </div>
        <nav>
          {([
            ["home", "Home · Cards"],
            ["portfolio", "Portfólios"],
            ["links", "Links / CTAs"],
            ["textos", "Textos das páginas"],
            ["tracking", "Rastreamento / Pixel"],
          ] as [TabKey, string][]).map(([k, l]) => (
            <button key={k} className={tab === k ? "active" : ""} onClick={() => setTab(k)}>{l}</button>
          ))}
        </nav>
      </aside>
      <section className="adminEditor">
        {tab === "home" && <HomeCardsTab />}
        {tab === "portfolio" && <PortfolioTab />}
        {tab === "links" && <LinksTab />}
        {tab === "textos" && <TextsTab />}
        {tab === "tracking" && <TrackingTab />}
      </section>
    </div>
  );
}

function useStatus() {
  const [status, setStatus] = useState("Pronto para editar.");
  const [saving, setSaving] = useState(false);
  return { status, setStatus, saving, setSaving };
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// ============ HOME CARDS ============
function HomeCardsTab() {
  const [cards, setCards] = useState<HomeCard[]>(defaultHomeCards);
  const [activeKey, setActiveKey] = useState("studio");
  const s = useStatus();

  useEffect(() => {
    fetchHomeCards().then((cloud) => {
      if (cloud.length) {
        // merge cloud into defaults
        const merged = defaultHomeCards.map((d) => cloud.find((c) => c.key === d.key) ?? d);
        setCards(merged);
      }
    }).catch(() => s.setStatus("Não consegui carregar do Cloud. Editando padrão."));
  }, []);

  const active = useMemo(() => cards.find((c) => c.key === activeKey) ?? cards[0], [cards, activeKey]);

  const update = (patch: Partial<HomeCard>) => {
    setCards((cur) => cur.map((c) => c.key === activeKey ? { ...c, ...patch } : c));
    s.setStatus("Alterações não salvas.");
  };

  const setFrame = (i: number, src: string) => update({ frames: active.frames.map((f, j) => j === i ? src : f) });
  const addFrame = () => update({ frames: [...active.frames, ""] });
  const removeFrame = (i: number) => update({ frames: active.frames.filter((_, j) => j !== i) });

  const save = async () => {
    s.setSaving(true);
    try {
      await upsertHomeCards(cards);
      // mirror to localStorage so home reads immediately without reload
      const legacy = cards.map((c) => ({ key: c.key, href: c.href, title: c.title, description: c.description, badge: c.badge, frames: c.frames.filter(Boolean) }));
      window.localStorage.setItem(ADMIN_CASES_KEY, JSON.stringify(legacy));
      window.dispatchEvent(new Event("storage"));
      s.setStatus("Salvo no Cloud. Alterações visíveis para todos os visitantes.");
    } catch (e: any) {
      s.setStatus("Erro ao salvar: " + (e?.message ?? e));
    } finally { s.setSaving(false); }
  };

  const onUpload = async (i: number, file: File | null) => {
    if (!file) return;
    const url = await fileToDataUrl(file);
    setFrame(i, url);
  };

  return (
    <>
      <TopBar status={s.status} onSave={save} saving={s.saving} />
      <div className="adminGrid">
        <div className="adminForm">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {cards.map((c) => (
              <button key={c.key} type="button" onClick={() => setActiveKey(c.key)}
                style={{ padding: "6px 12px", borderRadius: 6, background: activeKey === c.key ? "#c8a24a" : "#1a1a1a", color: "#fff", border: "1px solid #333" }}>
                {c.title}
              </button>
            ))}
          </div>
          <label>Título<input value={active.title} onChange={(e) => update({ title: e.target.value })}/></label>
          <label>Descrição<textarea value={active.description} onChange={(e) => update({ description: e.target.value })}/></label>
          <label>Selo (badge)<input value={active.badge} onChange={(e) => update({ badge: e.target.value })}/></label>
          <label>Link (href) — pode ser rota interna ou URL externa<input value={active.href} onChange={(e) => update({ href: e.target.value })}/></label>
          <div className="adminImageEditor">
            <div className="adminFieldHead">
              <div><strong>Imagens do card (loop na capa)</strong><small>Suba fotos ou cole URLs.</small></div>
              <button onClick={addFrame} type="button">+ Adicionar imagem</button>
            </div>
            {(active.frames.length ? active.frames : [""]).map((src, i) => (
              <div className="adminImageRow" key={i}>
                <div className="adminThumb">{src ? <img src={src} alt=""/> : <span>Sem imagem</span>}</div>
                <label>Imagem {i + 1}
                  <input value={src} placeholder="URL ou caminho" onChange={(e) => setFrame(i, e.target.value)}/>
                </label>
                <input type="file" accept="image/*" onChange={(e) => onUpload(i, e.target.files?.[0] ?? null)}/>
                <button onClick={() => removeFrame(i)} type="button">Remover</button>
              </div>
            ))}
          </div>
        </div>
        <div className="adminPreview">
          <p className="adminEyebrow">Prévia</p>
          <div className="adminCardPreview">
            <div className="adminImageStack">
              {active.frames.filter(Boolean).slice(0, 3).map((src, i) => <img src={src} key={i} alt=""/>)}
              <span>{active.badge}</span>
            </div>
            <h2>{active.title}</h2>
            <p>{active.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

// ============ PORTFOLIO ============
function PortfolioTab() {
  const [pageKey, setPageKey] = useState(PORTFOLIO_PAGES[0].key);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const s = useStatus();

  const load = () => fetchPortfolio(pageKey).then(setItems).catch(() => s.setStatus("Erro carregando."));
  useEffect(() => { load(); }, [pageKey]);

  const addItem = async () => {
    const newItem: PortfolioItem = { page_key: pageKey, title: "Novo item", description: "", image_url: "", link_url: "", position: items.length, visible: true };
    await upsertPortfolioItem(newItem);
    load();
  };

  const update = (idx: number, patch: Partial<PortfolioItem>) => {
    setItems((cur) => cur.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };

  const saveOne = async (idx: number) => {
    s.setSaving(true);
    try { await upsertPortfolioItem(items[idx]); s.setStatus("Item salvo."); load(); }
    catch (e: any) { s.setStatus("Erro: " + e.message); }
    finally { s.setSaving(false); }
  };

  const remove = async (idx: number) => {
    const it = items[idx];
    if (!it.id) { setItems((cur) => cur.filter((_, i) => i !== idx)); return; }
    if (!confirm("Excluir este item?")) return;
    await deletePortfolioItem(it.id);
    load();
  };

  const onUpload = async (idx: number, file: File | null) => {
    if (!file) return;
    const url = await fileToDataUrl(file);
    update(idx, { image_url: url });
  };

  return (
    <>
      <TopBar status={s.status} onSave={async () => {
        s.setSaving(true);
        try { for (const it of items) await upsertPortfolioItem(it); s.setStatus("Todos salvos."); }
        catch (e: any) { s.setStatus("Erro: " + e.message); }
        finally { s.setSaving(false); }
      }} saving={s.saving} extraActions={<button type="button" onClick={addItem}>+ Novo item</button>}/>
      <div style={{ marginBottom: 16 }}>
        <label>Página do portfólio
          <select value={pageKey} onChange={(e) => setPageKey(e.target.value)}>
            {PORTFOLIO_PAGES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
        </label>
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        {items.length === 0 && <p style={{ opacity: .7 }}>Nenhum item ainda. Clique em "+ Novo item".</p>}
        {items.map((it, idx) => (
          <div key={it.id ?? idx} className="adminForm" style={{ border: "1px solid #333", padding: 16, borderRadius: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
              <div className="adminThumb" style={{ minHeight: 140 }}>
                {it.image_url ? <img src={it.image_url} alt=""/> : <span>Sem imagem</span>}
              </div>
              <div>
                <label>Título<input value={it.title} onChange={(e) => update(idx, { title: e.target.value })}/></label>
                <label>Descrição<textarea value={it.description} onChange={(e) => update(idx, { description: e.target.value })}/></label>
                <label>Link (opcional)<input value={it.link_url} onChange={(e) => update(idx, { link_url: e.target.value })}/></label>
                <label>URL da imagem<input value={it.image_url} onChange={(e) => update(idx, { image_url: e.target.value })}/></label>
                <input type="file" accept="image/*" onChange={(e) => onUpload(idx, e.target.files?.[0] ?? null)}/>
                <label style={{ display: "flex", alignItems: "center", gap: 8, flexDirection: "row" }}>
                  <input type="checkbox" checked={it.visible} onChange={(e) => update(idx, { visible: e.target.checked })}/>
                  Visível no site
                </label>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button type="button" onClick={() => saveOne(idx)}>Salvar</button>
                  <button type="button" onClick={() => remove(idx)}>Excluir</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ============ LINKS ============
function LinksTab() {
  const [links, setLinks] = useState<PageLinkRow[]>(
    PAGE_META.map((m) => ({ page_key: m.key, cta_label: defaultLinks[m.key].ctaLabel, cta_url: defaultLinks[m.key].ctaUrl }))
  );
  const s = useStatus();

  useEffect(() => {
    fetchPageLinks().then((cloud) => {
      setLinks((cur) => cur.map((l) => cloud[l.page_key] ? { ...l, ...cloud[l.page_key] } : l));
    }).catch(() => {});
  }, []);

  const update = (i: number, patch: Partial<PageLinkRow>) =>
    setLinks((cur) => cur.map((l, j) => j === i ? { ...l, ...patch } : l));

  const save = async () => {
    s.setSaving(true);
    try {
      await savePageLinks(links);
      // mirror to localStorage for existing consumers
      const legacy: Record<string, { ctaLabel: string; ctaUrl: string }> = {};
      links.forEach((l) => { legacy[l.page_key] = { ctaLabel: l.cta_label, ctaUrl: l.cta_url }; });
      window.localStorage.setItem(ADMIN_LINKS_KEY, JSON.stringify(legacy));
      window.dispatchEvent(new Event("gbia:links-changed"));
      s.setStatus("Links salvos no Cloud.");
    } catch (e: any) { s.setStatus("Erro: " + e.message); }
    finally { s.setSaving(false); }
  };

  return (
    <>
      <TopBar status={s.status} onSave={save} saving={s.saving}/>
      <div style={{ display: "grid", gap: 12 }}>
        {links.map((l, i) => {
          const meta = PAGE_META.find((m) => m.key === l.page_key);
          return (
            <div key={l.page_key} className="adminForm" style={{ border: "1px solid #333", padding: 12, borderRadius: 8 }}>
              <strong>{meta?.label ?? l.page_key}</strong>
              <label>Texto do botão<input value={l.cta_label} onChange={(e) => update(i, { cta_label: e.target.value })}/></label>
              <label>URL de destino<input value={l.cta_url} onChange={(e) => update(i, { cta_url: e.target.value })} placeholder="https://... ou #kontakt"/></label>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ============ TEXTS ============
function TextsTab() {
  const [pageKey, setPageKey] = useState(SITE_TEXT_PAGES[0].key);
  const [content, setContent] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const s = useStatus();

  useEffect(() => { fetchSiteText(pageKey).then(setContent).catch(() => setContent({})); }, [pageKey]);

  const save = async () => {
    s.setSaving(true);
    try { await saveSiteText(pageKey, content); s.setStatus("Textos salvos."); }
    catch (e: any) { s.setStatus("Erro: " + e.message); }
    finally { s.setSaving(false); }
  };

  return (
    <>
      <TopBar status={s.status} onSave={save} saving={s.saving}/>
      <label>Página
        <select value={pageKey} onChange={(e) => setPageKey(e.target.value)}>
          {SITE_TEXT_PAGES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
        </select>
      </label>
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {Object.entries(content).map(([k, v]) => (
          <div key={k} className="adminForm">
            <label>{k}
              <textarea value={v} onChange={(e) => setContent((c) => ({ ...c, [k]: e.target.value }))}/>
            </label>
            <button type="button" onClick={() => setContent((c) => { const { [k]: _, ...rest } = c; return rest; })}>Remover chave</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="nome_da_chave (ex: hero_title)" value={newKey} onChange={(e) => setNewKey(e.target.value)}/>
          <button type="button" onClick={() => { if (newKey.trim()) { setContent((c) => ({ ...c, [newKey.trim()]: "" })); setNewKey(""); } }}>+ Adicionar chave</button>
        </div>
        <p style={{ opacity: .6, fontSize: 12 }}>Dica: use estas chaves no código com o hook <code>useSiteText</code> para tornar textos editáveis.</p>
      </div>
    </>
  );
}

// ============ TRACKING ============
function TrackingTab() {
  const [t, setT] = useState<TrackingSettings>(defaultTracking);
  const s = useStatus();

  useEffect(() => { fetchTracking().then(setT).catch(() => {}); }, []);
  const update = (patch: Partial<TrackingSettings>) => setT((cur) => ({ ...cur, ...patch }));

  const save = async () => {
    s.setSaving(true);
    try { await saveTracking(t); s.setStatus("Configurações salvas. Recarregue o site para aplicar os pixels."); }
    catch (e: any) { s.setStatus("Erro: " + e.message); }
    finally { s.setSaving(false); }
  };

  return (
    <>
      <TopBar status={s.status} onSave={save} saving={s.saving}/>
      <div className="adminForm">
        <h3>Meta (Facebook / Instagram)</h3>
        <label>Meta Pixel ID<input value={t.meta_pixel_id} onChange={(e) => update({ meta_pixel_id: e.target.value })} placeholder="123456789012345"/></label>
        <label style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={t.meta_capi_enabled} onChange={(e) => update({ meta_capi_enabled: e.target.checked })}/>
          Ativar Conversion API (server-side)
        </label>
        <label>Meta CAPI Test Event Code (opcional)<input value={t.meta_test_event_code} onChange={(e) => update({ meta_test_event_code: e.target.value })} placeholder="TEST12345"/></label>
        <p style={{ opacity: .7, fontSize: 12 }}>Para ativar a CAPI, adicione o secret <code>META_CAPI_ACCESS_TOKEN</code> no Lovable Cloud.</p>

        <h3 style={{ marginTop: 24 }}>Google Analytics 4</h3>
        <label>Measurement ID<input value={t.ga4_measurement_id} onChange={(e) => update({ ga4_measurement_id: e.target.value })} placeholder="G-XXXXXXXXXX"/></label>

        <h3 style={{ marginTop: 24 }}>Google Tag Manager</h3>
        <label>GTM Container ID<input value={t.gtm_container_id} onChange={(e) => update({ gtm_container_id: e.target.value })} placeholder="GTM-XXXXXXX"/></label>

        <h3 style={{ marginTop: 24 }}>Google Ads</h3>
        <label>Conversion ID<input value={t.google_ads_id} onChange={(e) => update({ google_ads_id: e.target.value })} placeholder="AW-123456789"/></label>
        <label>Conversion Label<input value={t.google_ads_conversion_label} onChange={(e) => update({ google_ads_conversion_label: e.target.value })} placeholder="abcDEF123"/></label>
      </div>
    </>
  );
}

// ============ UI helpers ============
function TopBar({ status, onSave, saving, extraActions }: { status: string; onSave: () => void; saving: boolean; extraActions?: React.ReactNode }) {
  return (
    <div className="adminTopbar">
      <div><span>Status</span><strong>{status}</strong></div>
      <div className="adminActions">
        {extraActions}
        <button type="button" onClick={onSave} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
      </div>
    </div>
  );
}
