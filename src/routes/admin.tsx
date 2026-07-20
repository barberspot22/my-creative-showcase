import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PAGE_META, defaultLinks, resetLinks, saveLinks, ADMIN_LINKS_KEY, type PageKey, type PageLinks } from "@/lib/adminLinks";

type AdminCase = {
  key: string;
  href: string;
  title: string;
  description: string;
  badge: string;
  frames: string[];
};

const ADMIN_CASES_KEY = "gbia.caseCards.v4";

const defaultCases: AdminCase[] = [
  {
    key: "studio",
    href: "/gb-studio",
    title: "Studio",
    description: "Lookbook completo gerado por IA para marca têxtil",
    badge: "LOOKBOOK",
    frames: ["/gb-studio/lookbook-01.png", "/gb-studio/lookbook-04.png", "/gb-studio/lookbook-05.png"],
  },
  {
    key: "social",
    href: "/gb-social",
    title: "Social",
    description: "Seu Social Media de IA no WhatsApp",
    badge: "DESIGNS",
    frames: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1800&q=94",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=94",
    ],
  },
  {
    key: "ecommerce",
    href: "/ecommerce",
    title: "E-commerce",
    description: "Loja, automação e IA vendedora em um sistema só",
    badge: "LOJA",
    frames: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2200&q=95",
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=2200&q=95",
    ],
  },
  {
    key: "crm",
    href: "/crm",
    title: "CRM",
    description: "Comercial e produção em módulos separados",
    badge: "DASHBOARD",
    frames: [
      "/crm-metrics-example.png",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2200&q=95",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=2200&q=95",
    ],
  },
  {
    key: "site",
    href: "/site-institucional",
    title: "Site Institucional",
    description: "Autoridade em segundos e contato sem desvio",
    badge: "SITES",
    frames: [
      "/site-main-example-moon.png",
      "/site-main-example-stairs.png",
      "/site-main-example-orbit.png",
    ],
  },
  {
    key: "menu",
    href: "/cardapio-digital",
    title: "Menu Digital",
    description: "Cardápio e presença digital em um sistema só",
    badge: "CARDÁPIO",
    frames: [
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=2200&q=95",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=2200&q=95",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=95",
    ],
  },
];

function normalizeCases(value: unknown): AdminCase[] {
  if (!Array.isArray(value)) return defaultCases;
  return defaultCases.map((item) => {
    const saved = value.find((entry) => entry?.key === item.key) || value.find((entry) => entry?.href === item.href);
    return {
      ...item,
      href: typeof saved?.href === "string" && saved.href.trim() ? saved.href.trim() : item.href,
      title: typeof saved?.title === "string" ? saved.title : item.title,
      description: typeof saved?.description === "string" ? saved.description : item.description,
      badge: typeof saved?.badge === "string" ? saved.badge : item.badge,
      frames: Array.isArray(saved?.frames) ? saved.frames.filter((src: unknown) => typeof src === "string") : item.frames,
    };
  });
}

function AdminPage() {
  const [cases, setCases] = useState<AdminCase[]>(defaultCases);
  const [activeKey, setActiveKey] = useState(defaultCases[0].key);
  const [status, setStatus] = useState("Pronto para editar.");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ADMIN_CASES_KEY);
      if (raw) setCases(normalizeCases(JSON.parse(raw)));
    } catch {
      setStatus("Não consegui carregar edições antigas. Mantive o padrão.");
    }
  }, []);

  const activeCase = useMemo(() => cases.find((item) => item.key === activeKey) || cases[0], [cases, activeKey]);

  const updateCase = (patch: Partial<AdminCase>) => {
    setCases((current) => current.map((item) => item.key === activeKey ? { ...item, ...patch } : item));
    setStatus("Alteração ainda não salva.");
  };

  const updateFrame = (index: number, src: string) => {
    updateCase({ frames: activeCase.frames.map((frame, frameIndex) => frameIndex === index ? src : frame) });
  };

  const addFrame = () => {
    updateCase({ frames: [...activeCase.frames, ""] });
  };

  const removeFrame = (index: number) => {
    updateCase({ frames: activeCase.frames.filter((_, frameIndex) => frameIndex !== index) });
  };

  const uploadFrame = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) updateFrame(index, result);
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    window.localStorage.setItem(ADMIN_CASES_KEY, JSON.stringify(cases));
    window.dispatchEvent(new Event("storage"));
    setStatus("Salvo. Volte para a home para ver o cardbox atualizado.");
  };

  const reset = () => {
    window.localStorage.removeItem(ADMIN_CASES_KEY);
    setCases(defaultCases);
    setStatus("Voltou para o padrão original.");
  };

  const [tab, setTab] = useState<"cards" | "links">("cards");
  const [links, setLinks] = useState<PageLinks>(defaultLinks);
  const [linkStatus, setLinkStatus] = useState("Pronto para editar links.");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ADMIN_LINKS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PageLinks>;
        setLinks({ ...defaultLinks, ...parsed } as PageLinks);
      }
    } catch { /* ignore */ }
  }, []);

  const updateLink = (key: PageKey, patch: Partial<PageLinks[PageKey]>) => {
    setLinks((current) => ({ ...current, [key]: { ...current[key], ...patch } }));
    setLinkStatus("Alteração de link ainda não salva.");
  };
  const saveAllLinks = () => { saveLinks(links); setLinkStatus("Links salvos. Todas as páginas já refletem os novos botões."); };
  const resetAllLinks = () => { resetLinks(); setLinks(defaultLinks); setLinkStatus("Links restaurados ao padrão."); };

  return <main className="adminShell">
    <aside className="adminSidebar">
      <a className="adminBack" href="/">← Voltar para o site</a>
      <div>
        <p className="adminEyebrow">GB IA Admin</p>
        <h1>Painel administrativo</h1>
        <p>Edite cardboxes da home e os links dos botões de cada página.</p>
      </div>
      <div className="adminTabs">
        <button className={tab === "cards" ? "active" : ""} onClick={() => setTab("cards")} type="button">Cardboxes</button>
        <button className={tab === "links" ? "active" : ""} onClick={() => setTab("links")} type="button">Links de botões</button>
      </div>
      {tab === "cards" && <nav>
        {cases.map((item) => <button className={item.href === activeHref ? "active" : ""} key={item.href} onClick={() => setActiveHref(item.href)}>{item.title}</button>)}
      </nav>}
    </aside>

    {tab === "links" ? <section className="adminEditor">
      <div className="adminTopbar">
        <div><span>Status</span><strong>{linkStatus}</strong></div>
        <div className="adminActions">
          <button onClick={resetAllLinks} type="button">Restaurar padrão</button>
          <button onClick={saveAllLinks} type="button">Salvar todos os links</button>
        </div>
      </div>
      <div className="adminLinksGrid">
        {PAGE_META.map((meta) => {
          const value = links[meta.key];
          return <article className="adminLinkCard" key={meta.key}>
            <header>
              <div><p className="adminEyebrow">Página</p><h3>{meta.label}</h3></div>
              <a href={`/${meta.key}`} target="_blank" rel="noreferrer">/{meta.key} ↗</a>
            </header>
            <label>Texto do botão
              <input value={value.ctaLabel} onChange={(event) => updateLink(meta.key, { ctaLabel: event.target.value })} placeholder={meta.defaultLabel}/>
            </label>
            <label>Link de redirecionamento
              <input value={value.ctaUrl} onChange={(event) => updateLink(meta.key, { ctaUrl: event.target.value })} placeholder={meta.defaultUrl || "https://wa.me/... ou https://sua-url.com"}/>
            </label>
            <small>Esse link é aplicado em todos os botões principais da página (menu, hero e CTA final). Deixe em branco para usar o comportamento padrão.</small>
          </article>;
        })}
      </div>
    </section> : <section className="adminEditor">
      <div className="adminTopbar">
        <div><span>Status</span><strong>{status}</strong></div>
        <div className="adminActions">
          <button onClick={reset} type="button">Restaurar padrão</button>
          <button onClick={save} type="button">Salvar alterações</button>
        </div>
      </div>

      <div className="adminGrid">
        <form className="adminForm" onSubmit={(event) => { event.preventDefault(); save(); }}>
          <label>Título
            <input value={activeCase.title} onChange={(event) => updateCase({ title: event.target.value })}/>
          </label>
          <label>Descrição
            <textarea value={activeCase.description} onChange={(event) => updateCase({ description: event.target.value })}/>
          </label>
          <label>Selo do cardbox
            <input value={activeCase.badge} onChange={(event) => updateCase({ badge: event.target.value })}/>
          </label>
          <label>Link da página
            <input value={activeCase.href} readOnly/>
          </label>
          <div className="adminImageEditor">
            <div className="adminFieldHead">
              <div>
                <strong>Imagens dentro do card da home</strong>
                <small>Essas são as imagens que fazem loop na capa do cardbox.</small>
              </div>
              <button onClick={addFrame} type="button">+ Adicionar imagem</button>
            </div>
            {(activeCase.frames.length ? activeCase.frames : [""]).map((src, index) => <div className="adminImageRow" key={`${activeCase.href}-${index}`}>
              <div className="adminThumb">{src ? <img src={src} alt=""/> : <span>Sem imagem</span>}</div>
              <label>Imagem {index + 1}
                <input value={src} placeholder="Cole a URL ou caminho da imagem" onChange={(event) => updateFrame(index, event.target.value)}/>
              </label>
              <button onClick={() => removeFrame(index)} type="button" aria-label={`Remover imagem ${index + 1}`}>Remover</button>
            </div>)}
            <small>Use caminhos do site, como /gb-studio/lookbook-01.png, ou URLs externas. Se tiver mais de uma imagem, o card da home faz loop entre elas.</small>
          </div>
          <button type="submit">Salvar este cardbox</button>
        </form>

        <div className="adminPreview">
          <p className="adminEyebrow">Prévia do cardbox</p>
          <div className="adminCardPreview">
            <div className="adminImageStack">
              {(activeCase.frames.length ? activeCase.frames : ["/crm-metrics-example.png"]).slice(0, 3).map((src, index) => <img src={src} alt="" key={`${src}-${index}`}/>)}
              <span>{activeCase.badge}</span>
            </div>
            <h2>{activeCase.title}</h2>
            <p>{activeCase.description}</p>
          </div>
          <div className="adminHint">
            <strong>Importante:</strong> esta versão salva no navegador. Para edição pública com login e banco de dados, dá para evoluir esse admin depois.
          </div>
        </div>
      </div>
    </section>}
  </main>;
}

export const Route = createFileRoute("/admin")({ component: AdminPage });
