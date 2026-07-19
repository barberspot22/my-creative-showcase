import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, PointerEvent, ReactNode, WheelEvent, useEffect, useRef, useState } from "react";
import { ElasticGrid } from "@/components/imported/ElasticGrid";
import { LumusReplicaEffect } from "@/components/imported/LumusReplicaEffect";
import gbLogo from "@/assets/gb-ia-logo.png";

const A = "/lumus-assets/";
const clients = ["FZ Jeans", "Santa Pimenta", "Dondoca Express", "Anykill", "Vivence Pharma", "Fontana di Trevi"];
const studioCoverImages = ["/gb-studio/lookbook-01.png", "/gb-studio/lookbook-04.png", "/gb-studio/lookbook-05.png", "/gb-studio/lookbook-08.png", "/gb-studio/lookbook-09.png", "/gb-studio/lookbook-10.png", "/gb-studio/modelo-01.png", "/gb-studio/modelo-02.png"];
const socialCoverImages = [
  "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1800&q=94",
  "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1800&q=94",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=94",
];
const webCoverImages = {
  ecommerce: [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2200&q=95",
    "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=2200&q=95",
  ],
  crm: [
    "/crm-metrics-example.png",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2200&q=95",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=2200&q=95",
  ],
  site: [
    "/site-main-example-moon.png",
    "/site-main-example-stairs.png",
    "/site-main-example-orbit.png",
  ],
  menu: [
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=2200&q=95",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=2200&q=95",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=95",
  ],
};
const catalogItems = [
  { src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=700&q=90", name: "Camiseta premium", price: "R$ 89" },
  { src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=90", name: "Pizza artesanal", price: "R$ 42" },
  { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=90", name: "Tênis urbano", price: "R$ 219" },
  { src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=90", name: "Bowl especial", price: "R$ 36" },
  { src: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=90", name: "Jaqueta leve", price: "R$ 189" },
  { src: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=90", name: "Burger combo", price: "R$ 39" },
  { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=90", name: "Look completo", price: "R$ 279" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=90", name: "Prato da casa", price: "R$ 58" },
];
const socialPostGrid = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=90",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=90",
  "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=90",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=90",
];
const benefits = [
  ["Quem entende, quem constrói", "Sem terceirizar pra quem não conhece o seu processo. Quem desenha o sistema é quem também mantém no ar."],
  ["Arquitetura em vez de ferramenta genérica", "Antes de qualquer n8n ou Zapier, checamos se existe uma solução melhor pro seu caso específico."],
  ["Automação com aprovação", "Sistemas autônomos, mas com humano no controle onde o risco é alto."],
  ["Honestidade radical", "Se não faz sentido, a gente fala. Você não recebe o que pediu — recebe o que precisa."],
  ["Em dias, não em meses", "O que demora semanas em outro lugar, a gente entrega com foco e clareza em poucos dias."],
];

type CaseFrame = { kind: "image"; src: string; alt: string } | { kind: "ui"; variant: string; label: string };
type CaseCard = { href: string; title: string; description: string; badge: string; frames: CaseFrame[] };
type StoredCaseCard = { href: string; title?: string; description?: string; badge?: string; frames?: string[] };

const ADMIN_CASES_KEY = "gbia.caseCards.v4";

const caseCards: CaseCard[] = [
  {
    href: "/gb-studio",
    title: "Studio",
    description: "Lookbook completo gerado por IA para marca têxtil",
    badge: "LOOKBOOK",
    frames: studioCoverImages.slice(0, 3).map((src, index) => ({ kind: "image", src, alt: `Capa Studio ${index + 1}` })),
  },
  {
    href: "/gb-social",
    title: "Social",
    description: "Seu Social Media de IA no WhatsApp",
    badge: "CHAT IA",
    frames: [
      { kind: "ui", variant: "social-chat-card", label: "Chat animado do GB Social" },
    ],
  },
  {
    href: "/ecommerce",
    title: "E-commerce",
    description: "Loja, automação e IA vendedora em um sistema só",
    badge: "LOJA",
    frames: [
      { kind: "image", src: webCoverImages.ecommerce[0], alt: "Loja virtual aberta em notebook" },
      { kind: "image", src: webCoverImages.ecommerce[1], alt: "Compra online em notebook" },
      { kind: "ui", variant: "commerce-product", label: "Página de produto" },
    ],
  },
  {
    href: "/crm",
    title: "CRM",
    description: "CRM, follow-up automatico e dashboard de vendas em um sistema so",
    badge: "CRM + IA",
    frames: [
      { kind: "ui", variant: "crm-dashboard-plus", label: "Dashboard subindo mais um cliente" },
      { kind: "ui", variant: "recover-followup", label: "Follow-up enviado" },
      { kind: "ui", variant: "recover-converted", label: "Venda recuperada" },
    ],
  },
  {
    href: "/site-institucional",
    title: "Site Institucional",
    description: "Autoridade em segundos e contato sem desvio",
    badge: "SITES",
    frames: [
      { kind: "ui", variant: "institutional-relaunch", label: "Website Relaunch institucional" },
    ],
  },
  {
    href: "/cardapio-digital",
    title: "Menu Digital",
    description: "Cardápio e presença digital em um sistema só",
    badge: "CATÁLOGO",
    frames: [
      { kind: "ui", variant: "menu-catalog", label: "Catálogo digital com produtos rolando" },
    ],
  },
];

function mergeAdminCaseCards(defaults: CaseCard[], stored: StoredCaseCard[]): CaseCard[] {
  return defaults.map((card) => {
    const override = stored.find((item) => item.href === card.href);
    if (!override) return card;
    const imageFrames = override.frames?.map((src, index) => src.trim()).filter(Boolean).map((src, index) => ({
      kind: "image" as const,
      src,
      alt: `${override.title || card.title} capa ${index + 1}`,
    }));
    const frames = card.href === "/crm" && imageFrames?.length ? [...imageFrames, ...card.frames] : (imageFrames?.length ? imageFrames : card.frames);
    return {
      ...card,
      title: override.title?.trim() || card.title,
      description: override.description?.trim() || card.description,
      badge: override.badge?.trim() || card.badge,
      frames,
    };
  });
}

function readAdminCaseCards(): CaseCard[] {
  if (typeof window === "undefined") return caseCards;
  try {
    const raw = window.localStorage.getItem(ADMIN_CASES_KEY);
    if (!raw) return caseCards;
    return mergeAdminCaseCards(caseCards, JSON.parse(raw) as StoredCaseCard[]);
  } catch {
    return caseCards;
  }
}

function CaseFramePreview({ frame }: { frame: CaseFrame }) {
  if (frame.kind === "image") return <img src={frame.src} alt={frame.alt} draggable={false}/>;
  if (frame.variant === "social-chat-card") return <div className="caseUiFrame socialCardChat" aria-label={frame.label}>
    <div className="socialMiniPhone">
      <header>
        <span><i/>GB Social</span>
        <small>online</small>
      </header>
      <div className="socialMiniThread">
        <p className="socialMiniBubble contact">Você recebeu mais 10 seguidores hoje, o seu conteúdo está ótimo!</p>
        <p className="socialMiniBubble user">Me recomende o conteúdo dessa semana para aumentar ainda mais o engajamento.</p>
        <p className="socialMiniBubble contact">Ok, o conteúdo é: bastidores da marca, prova social, oferta leve e um post educativo.</p>
        <div className="socialMiniGrid" aria-hidden="true">
          {socialPostGrid.map((src, index) => <img src={src} alt="" draggable={false} key={index}/>)}
        </div>
        <p className="socialMiniBubble user">Obrigado, pode postar em todas as redes sociais.</p>
        <p className="socialMiniBubble contact">Postei. Agora é só esperar as curtidas.</p>
      </div>
    </div>
  </div>;
  if (frame.variant === "menu-catalog") return <div className="caseUiFrame menuCatalogFrame" aria-label={frame.label}>
    <div className="catalogPhone">
      <header><b>Catálogo</b><span>online</span></header>
      <div className="catalogScroll" aria-hidden="true">
        {[0, 1].map((loop) => <div className="catalogGrid" key={loop}>
          {catalogItems.map((item) => <article key={`${loop}-${item.name}`}>
            <img src={item.src} alt="" draggable={false}/>
            <strong>{item.name}</strong>
            <small>{item.price}</small>
          </article>)}
        </div>)}
      </div>
    </div>
  </div>;
  if (frame.variant === "institutional-relaunch") return <div className="caseUiFrame institutionalRelaunchFrame" aria-label={frame.label}>
    <div className="institutionalBrowser">
      <header>
        <b>GB Sites</b>
        <nav><span>Serviços</span><span>Blog</span><span>Contato</span></nav>
        <small>Orçamento</small>
      </header>
      <h4>para sua marca memorável</h4>
      <div className="institutionalSeal"><span>GB</span></div>
      <div className="institutionalCards" aria-hidden="true">
        <article className="ghost"><strong>Presença</strong><small>Autoridade online</small></article>
        <article className="main"><strong>Website Relaunch</strong><small>Site Institucional</small></article>
        <article><strong>Conversão</strong><small>Contato direto</small></article>
      </div>
    </div>
  </div>;
  return <div className={`caseUiFrame ${frame.variant}`} aria-label={frame.label}>
    <div className="caseChrome"><i/><i/><i/></div>
    <div className="caseUiContent">
      {frame.variant.startsWith("social") && <><p className="bubble agent">Tenho uma sugestão de post pronta.</p><div className="postPreview"><b>AGENDA ABERTA</b><span/></div><p className="bubble lead">{frame.variant.includes("approved") ? "Aprovado. Pode postar." : "Ajusta o CTA?"}</p></>}
      {frame.variant.startsWith("commerce") && <><header><b>{frame.variant.includes("product") ? "Produto" : frame.variant.includes("checkout") ? "Checkout" : "Loja online"}</b><span>comprar</span></header><div className="shopHero"/><div className="shopGrid"><i/><i/><i/></div></>}
      {frame.variant === "crm-chat" && <div className="crmWhatsAppMock"><div className="waTop"><span>IA</span><div><b>Agente GB</b><small>online agora</small></div></div><div className="crmConversation"><p className="crmMsg client"><b>Cliente:</b> Oi, vi o anúncio. Ainda tem esse plano?</p><p className="crmMsg agent"><b>Agente:</b> Tenho sim. Ele sai por R$97 hoje.</p><p className="crmMsg client"><b>Cliente:</b> Perfeito, quero comprar.</p><p className="crmMsg agent"><b>Agente:</b> Fechado. Vou gerar seu link.</p></div></div>}
      {frame.variant === "crm-payment" && <div className="crmPaymentMock"><header><b>Compra assistida</b><span>checkout</span></header><div className="crmPurchaseEmoji" aria-hidden="true">🛒</div><div className="crmPaymentFlow"><p className="crmMsg agent">Link de pagamento gerado:</p><button>https://pay.gb/cliente</button><p className="crmMsg client">Compra efetuada ✅</p><p className="crmPaid">Pagamento confirmado</p></div></div>}
      {frame.variant === "crm-dashboard-plus" && <div className="crmDashboardMock"><header><div><b>Dashboard</b><small>Visão geral em tempo real do agente de vendas.</small></div><span>Hoje</span></header><div className="crmDashCards"><div><small>Leads ativos</small><strong>1</strong></div><div><small>Clientes ganhos</small><strong className="plusOne">+1</strong></div><div><small>Conversão</small><strong>100%</strong></div></div><div className="crmDashKanban"><span>Link enviado</span><i/><b>1</b><span>Comprou</span><i/><b>1</b></div></div>}
      {frame.variant.startsWith("site") && <><header><b>Institucional</b><span>CTA</span></header><h4>Empresa séria em segundos.</h4><div className="siteBlocks"><i/><i/><i/></div></>}
      {frame.variant.startsWith("menu") && <><header><b>Cardápio</b><span>pedido</span></header><div className="plate"/><div className="menuLines"><i/><i/><i/></div></>}
      {frame.variant.startsWith("recover") && <><p className="bubble agent">Ainda posso te ajudar com o kit?</p>{frame.variant.includes("typing") && <p className="typingDots"><i/><i/><i/></p>}{frame.variant.includes("converted") && <p className="bubble lead">Fechado, manda o link.</p>}<small>{frame.variant.includes("converted") ? "✓✓ lido · convertido" : "✓✓ entregue"}</small></>}
    </div>
  </div>;
}

function LoopingCaseCard({ card, startIndex }: { card: CaseCard; startIndex: number }) {
  const [active, setActive] = useState(startIndex % card.frames.length);

  useEffect(() => {
    card.frames.forEach((frame) => {
      if (frame.kind === "image") {
        const image = new Image();
        image.src = frame.src;
      }
    });
  }, [card.frames]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % card.frames.length);
    }, 6400 + startIndex * 140);
    return () => window.clearInterval(timer);
  }, [card.frames.length, startIndex]);

  return <article className="reveal caseCard loopCaseCard">
    <a href={card.href}>
      <div className="caseBoxCover" aria-label={`Capa em loop de ${card.title}`}>
        {card.frames.map((frame, index) => <div className={`caseLoopFrame ${index === active ? "active" : ""}`} key={`${card.title}-${index}`}><CaseFramePreview frame={frame}/></div>)}
        <span>{card.badge}</span>
      </div>
      <div className="caseBoxContent"><h3>{card.title}</h3><p>{card.description}</p></div>
    </a>
  </article>;
}

function CircleGalleryCarousel({ cards }: { cards: CaseCard[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeRef = useRef(0);
  const drag = useRef({ active: false, x: 0, moved: false });
  const count = cards.length;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  const normalize = (index: number) => {
    const half = Math.floor(count / 2);
    return ((index - active + count + half) % count) - half;
  };

  const moveTo = (next: number) => {
    setActive((next + count) % count);
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (Math.abs(event.deltaY) + Math.abs(event.deltaX) < 8) return;
    moveTo(activeRef.current + (event.deltaY + event.deltaX > 0 ? 1 : -1));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, x: event.clientX, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
    setPaused(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const delta = event.clientX - drag.current.x;
    if (Math.abs(delta) < 55) return;
    drag.current = { active: true, x: event.clientX, moved: true };
    moveTo(activeRef.current + (delta < 0 ? 1 : -1));
  };

  const onPointerUp = () => {
    drag.current.active = false;
    window.setTimeout(() => setPaused(false), 900);
  };

  return <section className="circleProductSection reveal" aria-label="Produtos GB IA">
    <h2>O futuro muda o seu<br/>produto</h2>
    <div
      className="circleProductCarousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={(event) => {
        if (drag.current.moved) event.preventDefault();
      }}
    >
      <div className="circleProductStage">
        {cards.map((card, index) => {
          const offset = normalize(index);
          const abs = Math.abs(offset);
          const x = offset * 270;
          const y = abs * 34;
          const rotate = offset * -10;
          const scale = Math.max(.72, 1 - abs * .14);
          return <a
            className={`circleProductCard ${offset === 0 ? "active" : ""}`}
            href={card.href}
            key={card.href}
            aria-label={`Abrir página de ${card.title}`}
            style={{
              transform: `translate3d(${x}px, ${y}px, ${-abs * 120}px) rotate(${rotate}deg) scale(${scale})`,
              opacity: abs > 3 ? 0 : 1 - abs * .16,
              zIndex: 50 - abs,
              filter: `blur(${abs > 0 ? Math.min(7, abs * 2.2) : 0}px) grayscale(${abs ? .7 : 0}) saturate(${abs ? .72 : 1.1})`,
            }}
          >
            <div className="circleProductVisual">
              <CaseFramePreview frame={card.frames[0]}/>
              <span>{card.badge}</span>
            </div>
            <strong>{card.title}</strong>
          </a>;
        })}
      </div>
      <button type="button" className="circleNav circlePrev" onClick={() => moveTo(active - 1)} aria-label="Produto anterior">‹</button>
      <button type="button" className="circleNav circleNext" onClick={() => moveTo(active + 1)} aria-label="Próximo produto">›</button>
      <p>Arraste ou role para explorar · clique para abrir</p>
    </div>
  </section>;
}

function HomePage() {
  const [menu, setMenu] = useState(false);
  const [contact, setContact] = useState(false);
  const [sent, setSent] = useState(false);
  const [editableCaseCards, setEditableCaseCards] = useState<CaseCard[]>(caseCards);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("seen")), { threshold: .12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const move = (e: MouseEvent) => { document.documentElement.style.setProperty("--mx", `${e.clientX}px`); document.documentElement.style.setProperty("--my", `${e.clientY}px`); };
    const refreshAdminCases = () => setEditableCaseCards(readAdminCaseCards());
    refreshAdminCases();
    window.addEventListener("mousemove", move);
    window.addEventListener("storage", refreshAdminCases);
    return () => { io.disconnect(); window.removeEventListener("mousemove", move); window.removeEventListener("storage", refreshAdminCases); };
  }, []);

  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  const go = () => setMenu(false);

  return <>
    <div className="cursor" aria-hidden="true" />
    <header className="nav">
      <a href="#top" className="brand gbImageBrand"><img src={gbLogo} alt="GB IA" /></a>
      <button className="menuButton" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Abrir menu"><i/><i/></button>
      <nav className={menu ? "open" : ""}>
        <a onClick={go} href="#leistungen">O que fazemos</a><a onClick={go} href="#ueber-uns">Por que GB IA</a><a onClick={go} href="#referenzen">Clientes</a><a onClick={go} href="/gb-studio">GB Studio</a><a onClick={go} href="#kontakt">Contato</a>
      </nav>
    </header>

    <main id="top">
      <section className="hero"><ElasticGrid/><LumusReplicaEffect/></section>

      <CircleGalleryCarousel cards={editableCaseCards} />

      <section className="references light homeCasesFirst">
        <h2 className="showTitle reveal">Serviços</h2>
        <div className="showcases">
          {editableCaseCards.map((card, index) => <LoopingCaseCard key={card.href} card={card} startIndex={index}/>)}
        </div>
      </section>

      <section id="leistungen" className="services light">
        <h2 className="reveal">O que fazemos</h2>
        <div className="serviceGrid">
          <article className="reveal"><div className="lineIcon systemIcon" aria-hidden="true"><svg viewBox="0 0 96 96" role="img"><rect x="18" y="22" width="60" height="48" rx="7"/><path d="M18 36h60"/><path d="M31 52h20"/><path className="iconAccent cursorCue" d="M57 48v18"/><circle className="iconAccent" cx="29" cy="29" r="2.5"/><circle cx="38" cy="29" r="2"/></svg></div><h3>Sistemas &amp; Sites</h3><p>Plataformas, painéis e sites sob medida para o processo real da sua empresa — não um template genérico adaptado à força.</p></article>
          <article className="reveal"><div className="lineIcon automationIcon" aria-hidden="true"><svg viewBox="0 0 96 96" role="img"><path d="M48 18v9M48 69v9M27 27l6 6M63 63l6 6M18 48h9M69 48h9M27 69l6-6M63 33l6-6"/><circle cx="48" cy="48" r="21"/><circle className="iconAccent gearCore" cx="48" cy="48" r="7"/></svg></div><h3>Automação de Processos</h3><p>Tarefas manuais, aprovações e fluxos internos rodando sem depender de alguém lembrar de fazer.</p></article>
          <article className="reveal"><div className="lineIcon aiIcon" aria-hidden="true"><svg viewBox="0 0 96 96" role="img"><path d="M48 48 25 27M48 48l46 0M48 48 26 70M48 48 68 24M48 48l20 24"/><circle className="iconAccent coreNode" cx="48" cy="48" r="8"/><circle cx="25" cy="27" r="5"/><circle cx="26" cy="70" r="5"/><circle cx="68" cy="24" r="5"/><circle cx="68" cy="72" r="5"/><circle cx="79" cy="48" r="5"/></svg></div><h3>IA Autônoma</h3><p>Agentes que atendem, respondem e executam — com camadas de aprovação onde importa.</p></article>
        </div>
      </section>

      <section id="ueber-uns" className="why">
        <div className="whyIntro reveal"><h2>Por que<br/>GB IA</h2><button className="pill" onClick={() => setContact(true)}>Falar com a equipe <span>→</span></button></div>
        <div className="whyPanel reveal"><div className="panelHero"><img src="/gb-network-map.png" alt="Mapa visual de conexões representando a arquitetura dos sistemas da GB IA"/><div><h3>Nosso jeito de construir</h3><p>Primeiro entendemos o gargalo. Depois desenhamos, construímos e acompanhamos o sistema em produção.</p></div></div><ol>{benefits.map((b,i)=><li key={b[0]}><span>{i+1}</span><div><strong>{b[0]}</strong><p>{b[1]}</p></div></li>)}</ol></div>
      </section>

      <section id="referenzen" className="references light">
        <h2 className="reveal">Clientes</h2>
        <div className="logoGrid clientNames reveal">{clients.map((name)=><div key={name}><strong>{name}</strong></div>)}</div>
      </section>

      <section id="kontakt" className="contact reveal"><div><h2>Vamos<br/>conver<br/>sar.</h2><button onClick={() => setContact(true)}>Falar com a equipe <span>↗</span></button></div><div className="contactCopy"><p>Vamos descobrir juntos se<br/>e como podemos te ajudar.</p><p>Conte o problema.<br/>A gente desenha o sistema.</p></div></section>
    </main>

    <footer><div><p>GB IA<br/>Colatina, ES</p><nav><a href="#leistungen">O que fazemos</a><a href="#ueber-uns">Por que GB IA</a><a href="#referenzen">Clientes</a><a href="#kontakt">Contato</a></nav></div><div className="ticker"><span>FAZER EM VEZ DE FALAR · FAZER EM VEZ DE FALAR · </span><span>FAZER EM VEZ DE FALAR · FAZER EM VEZ DE FALAR · </span></div><small>© 2026 GB IA. Todos os direitos reservados. <span>GB Studio&nbsp;&nbsp; GB Social</span></small></footer>

    {contact && <div className="modal" role="dialog" aria-modal="true" aria-labelledby="contactTitle" onMouseDown={(e)=>e.target===e.currentTarget&&setContact(false)}><div className="modalBox"><button className="close" onClick={()=>setContact(false)} aria-label="Fechar">×</button>{sent?<div className="success"><b>✓</b><h2>Recebemos.</h2><p>A equipe da GB IA vai continuar o contato com você.</p><button onClick={()=>{setSent(false);setContact(false)}}>Fechar</button></div>:<><p className="eyebrow">PRIMEIRO PAPO</p><h2 id="contactTitle">Conta o problema.</h2><form onSubmit={submit}><label>Nome<input required name="name" placeholder="Seu nome"/></label><label>E-mail<input required type="email" name="email" placeholder="voce@empresa.com.br"/></label><label>WhatsApp<input type="tel" name="phone" placeholder="Opcional"/></label><label>Como podemos ajudar?<select name="service"><option>Sistemas &amp; Sites</option><option>Automação de Processos</option><option>IA Autônoma</option><option>GB Studio</option><option>GB Social</option></select></label><label>Mensagem<textarea required name="message" placeholder="Explique o processo, tarefa ou gargalo"/></label><label className="check"><input required type="checkbox"/> <span>Concordo com o uso dos meus dados para contato.</span></label><button type="submit">Enviar mensagem <span>↗</span></button></form></>}</div></div>}
  </>;
}

export const Route = createFileRoute("/")({ component: HomePage });
