import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, PointerEvent, ReactNode, useEffect, useRef, useState } from "react";
import { ElasticGrid } from "@/components/imported/ElasticGrid";
import { LumusReplicaEffect } from "@/components/imported/LumusReplicaEffect";
import { ProcessTrail } from "@/components/imported/ProcessTrail";
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
  ["Quem entende, quem constrói", "Sem terceirizar pra quem não conhece o seu processo. Quem desenha a solução é quem também mantém no ar."],
  ["Arquitetura em vez de ferramenta genérica", "Antes de qualquer n8n ou Zapier, checamos se existe uma solução melhor pro seu caso específico."],
  ["Automação com aprovação", "Automações autônomas, mas com humano no controle onde o risco é alto."],
  ["Honestidade radical", "Se não faz sentido, a gente fala. Você não recebe o que pediu — recebe o que precisa."],
  ["Em dias, não em meses", "O que demora semanas em outro lugar, a gente entrega com foco e clareza em poucos dias."],
];

type CaseFrame = { kind: "image"; src: string; alt: string } | { kind: "ui"; variant: string; label: string };
type CaseCard = { key: string; href: string; title: string; description: string; badge: string; frames: CaseFrame[] };
type StoredCaseCard = { key?: string; href: string; title?: string; description?: string; badge?: string; frames?: string[] };

const ADMIN_CASES_KEY = "gbia.caseCards.v4";

const caseCards: CaseCard[] = [
  {
    key: "studio",
    href: "/gb-studio",
    title: "Studio",
    description: "Lookbook completo gerado por IA para marca têxtil",
    badge: "LOOKBOOK",
    frames: studioCoverImages.slice(0, 3).map((src, index) => ({ kind: "image", src, alt: `Capa Studio ${index + 1}` })),
  },
  {
    key: "social",
    href: "/gb-social",
    title: "Social",
    description: "Seu Social Media de IA no WhatsApp",
    badge: "CHAT IA",
    frames: [
      { kind: "ui", variant: "social-chat-card", label: "Chat animado do GB Social" },
    ],
  },
  {
    key: "ecommerce",
    href: "/ecommerce",
    title: "E-commerce",
    description: "Loja pronta pra vender no automático, com IA que atende e converte",
    badge: "LOJA",
    frames: [
      { kind: "image", src: webCoverImages.ecommerce[0], alt: "Loja virtual aberta em notebook" },
      { kind: "image", src: webCoverImages.ecommerce[1], alt: "Compra online em notebook" },
      { kind: "ui", variant: "commerce-product", label: "Página de produto" },
    ],
  },
  {
    key: "crm",
    href: "/crm",
    title: "CRM",
    description: "Funil, follow-up e dashboard num só lugar — comercial que não perde lead",
    badge: "CRM + IA",
    frames: [
      { kind: "ui", variant: "crm-dashboard-plus", label: "Dashboard subindo mais um cliente" },
      { kind: "ui", variant: "recover-followup", label: "Follow-up enviado" },
      { kind: "ui", variant: "recover-converted", label: "Venda recuperada" },
    ],
  },
  {
    key: "site",
    href: "/site-institucional",
    title: "Site Institucional",
    description: "Autoridade em segundos e contato sem desvio",
    badge: "SITES",
    frames: [
      { kind: "ui", variant: "institutional-relaunch", label: "Website Relaunch institucional" },
    ],
  },
  {
    key: "menu",
    href: "/cardapio-digital",
    title: "Menu Digital",
    description: "Cardápio, pedidos e presença digital que vendem por você",
    badge: "CATÁLOGO",
    frames: [
      { kind: "ui", variant: "menu-catalog", label: "Catálogo digital com produtos rolando" },
    ],
  },
];

function mergeAdminCaseCards(defaults: CaseCard[], stored: StoredCaseCard[]): CaseCard[] {
  return defaults.map((card) => {
    const override = stored.find((item) => item.key === card.key) || stored.find((item) => item.href === card.href);
    if (!override) return card;
    const imageFrames = override.frames?.map((src) => src.trim()).filter(Boolean).map((src, index) => ({
      kind: "image" as const,
      src,
      alt: `${override.title || card.title} capa ${index + 1}`,
    }));
    const frames = card.key === "crm" && imageFrames?.length ? [...imageFrames, ...card.frames] : (imageFrames?.length ? imageFrames : card.frames);
    return {
      ...card,
      href: typeof override.href === "string" && override.href.trim() ? override.href.trim() : card.href,
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

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

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
  if (frame.variant === "institutional-relaunch") return <div className="caseUiFrame institutionalLiveFrame" aria-label={frame.label}>
    <div className="instSite">
      <div className="instGrain" aria-hidden="true"/>
      <div className="instGlow instGlow1" aria-hidden="true"/>
      <div className="instGlow instGlow2" aria-hidden="true"/>
      <header className="instTop">
        <b>GB<i>.</i>studio</b>
        <nav><span>Home</span><span>Sobre</span><span>Cases</span><span>Contato</span></nav>
        <small>Fale conosco →</small>
      </header>
      <div className="instHero">
        <span className="instTag"><i/> Marca viva desde 2019</span>
        <h5>
          <em>Sua marca</em>
          <strong>merece um site</strong>
          <u>memorável.</u>
        </h5>
        <p>Design, código e conteúdo em um só ciclo — publicado em dias, não meses.</p>
        <div className="instCta"><button className="primary">Começar projeto</button><button className="ghost">Ver cases</button></div>
        <div className="instStats">
          <div><b>+120</b><small>marcas</small></div>
          <div><b>4.9</b><small>avaliação</small></div>
          <div><b>7d</b><small>entrega</small></div>
        </div>
      </div>
      <div className="instShowcase" aria-hidden="true">
        <div className="instShot instShotA"><i/><span/><span/></div>
        <div className="instShot instShotB"><i/><span/><span/></div>
      </div>
      <div className="instFloatCard"><i/><div><strong>Aprovado</strong><span>Nova identidade no ar</span></div></div>
      <div className="instCursor" aria-hidden="true"/>
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
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, x: 0, y: 0, pointerId: -1, intent: "" as "" | "x" | "y", moved: false, activeIndex: 0, delta: 0 });
  const rafPending = useRef(false);
  const suppressClickUntil = useRef(0);
  const count = cards.length;

  const normalize = (index: number, base: number) => {
    const raw = ((index - base) % count + count) % count;
    return raw > count / 2 ? raw - count : raw;
  };

  const applyTransforms = (base: number, delta: number) => {
    const els = cardRefs.current;
    for (let index = 0; index < els.length; index++) {
      const el = els[index];
      if (!el) continue;
      const offset = normalize(index, base) - delta / 270;
      const abs = Math.abs(offset);
      const hidden = abs >= count / 2;
      const x = offset * 270;
      const y = abs * 34;
      const rotate = offset * -10;
      const scale = Math.max(.72, 1 - abs * .14);
      const s = el.style;
      s.transform = `translate3d(${x}px, ${y}px, ${-abs * 120}px) rotate(${rotate}deg) scale(${scale})`;
      s.opacity = hidden ? "0" : String(1 - abs * .16);
      s.zIndex = String(50 - Math.round(abs));
      s.filter = `blur(${abs > 0 ? Math.min(7, abs * 2.2) : 0}px) grayscale(${abs > 0.05 ? .7 : 0}) saturate(${abs > 0.05 ? .72 : 1.1})`;
      s.pointerEvents = hidden ? "none" : "";
    }
  };

  useEffect(() => { applyTransforms(active, 0); }, [active]);

  const moveTo = (next: number) => {
    setActive((next % count + count) % count);
  };

  const shouldBlockDragClick = () => Date.now() < suppressClickUntil.current || drag.current.moved;

  const scheduleFrame = () => {
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      if (drag.current.intent === "x") applyTransforms(drag.current.activeIndex, drag.current.delta);
    });
  };

  const setDraggingClass = (on: boolean) => {
    const stage = stageRef.current?.parentElement;
    if (stage) stage.classList.toggle("dragging", on);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest(".circleNav")) return;
    drag.current = { active: true, x: event.clientX, y: event.clientY, pointerId: event.pointerId, intent: "", moved: false, activeIndex: active, delta: 0 };
    try { (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId); } catch {}
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || drag.current.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    if (!drag.current.intent) {
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        drag.current.intent = "x";
        setDraggingClass(true);
      } else if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        drag.current.intent = "y";
        try { (event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId); } catch {}
        drag.current.active = false;
        return;
      } else return;
    }
    if (drag.current.intent !== "x") return;
    drag.current.moved = true;
    drag.current.delta = dx;
    scheduleFrame();
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = drag.current.delta;
    const steps = Math.abs(dx) > 40 ? (dx < 0 ? 1 : -1) : 0;
    if (drag.current.intent === "x" && steps !== 0) {
      suppressClickUntil.current = Date.now() + 450;
      moveTo(drag.current.activeIndex + steps);
    } else if (drag.current.moved) {
      suppressClickUntil.current = Date.now() + 450;
      applyTransforms(drag.current.activeIndex, 0);
    }
    drag.current.active = false;
    setDraggingClass(false);
    try { (event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId); } catch {}
  };

  return <section className="circleProductSection reveal" aria-label="Produtos GB IA">
    <h2>O futuro molda<br/>o seu negócio</h2>
    <div
      className="circleProductCarousel"
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={(event) => {
        if ((event.target as HTMLElement).closest(".circleNav")) return;
        if (shouldBlockDragClick()) {
          event.preventDefault();
          event.stopPropagation();
          drag.current.moved = false;
        }
      }}
    >
      <div className="circleProductStage" ref={stageRef}>
        {cards.map((card, index) => {
          const external = isExternalHref(card.href);
          return <a
            ref={(el) => { cardRefs.current[index] = el; }}
            className={`circleProductCard ${index === active ? "active" : ""}`}
            href={card.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            draggable={false}
            key={card.key}
            aria-label={`Abrir página de ${card.title}`}
            onClick={(event) => {
              if (shouldBlockDragClick()) {
                event.preventDefault();
                drag.current.moved = false;
              }
            }}
            style={{ willChange: "transform, opacity, filter", backfaceVisibility: "hidden" }}
          >
            <div className="circleProductVisual">
              <CaseFramePreview frame={card.frames[0]}/>
              <span>{card.badge}</span>
            </div>
            <strong>{card.title}</strong>
          </a>;
        })}
      </div>
      <button type="button" className="circleNav circlePrev" onPointerDown={(event) => event.stopPropagation()} onClick={() => moveTo(active - 1)} aria-label="Produto anterior">‹</button>
      <button type="button" className="circleNav circleNext" onPointerDown={(event) => event.stopPropagation()} onClick={() => moveTo(active + 1)} aria-label="Próximo produto">›</button>
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
      <button className={`menuButton ${menu ? "open" : ""}`} onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Abrir menu"><i/><i/><i/></button>
      <nav className={menu ? "open" : ""}>
        <a onClick={go} href="#leistungen">O que fazemos</a><a onClick={go} href="#referenzen">Clientes</a><a onClick={go} href="/gb-studio">GB Studio</a><a onClick={go} href="#kontakt">Contato</a>
      </nav>
    </header>

    <main id="top">
      <div className="heroFoldScene">
        <section className="hero"><ElasticGrid/><LumusReplicaEffect/></section>
        <CircleGalleryCarousel cards={editableCaseCards} />
      </div>

      <ProcessTrail />

      <section id="ueber-uns" className="why hidden" style={{ display: "none" }} aria-hidden="true">
        <div className="whyIntro reveal"><h2>Por que<br/>GB IA</h2><button className="pill" onClick={() => setContact(true)}>Falar com a equipe <span>→</span></button></div>
        <div className="whyPanel reveal"><div className="panelHero"><img src="/gb-network-map.png" alt="Mapa visual de conexões representando a arquitetura das soluções da GB IA"/><div><h3>Nosso jeito de construir</h3><p>Primeiro entendemos o gargalo. Depois desenhamos, construímos e acompanhamos a solução em produção.</p></div></div><ol>{benefits.map((b,i)=><li key={b[0]}><span>{i+1}</span><div><strong>{b[0]}</strong><p>{b[1]}</p></div></li>)}</ol></div>
      </section>

      <section id="referenzen" className="references light">
        <h2 className="reveal">Clientes</h2>
        <div className="logoGrid clientNames reveal">{clients.map((name)=><div key={name}><strong>{name}</strong></div>)}</div>
      </section>

      <section id="kontakt" className="contact reveal" aria-labelledby="contactHeading">
        <div className="contactInner">
          <div className="contactGoldGlow" aria-hidden="true" />
          <h2 id="contactHeading" className="contactHeading">Vamos<br/>conversar.</h2>
          <button type="button" className="contactCta" onClick={() => { import("@/lib/tracking").then(({ trackLead }) => trackLead("home_contact_cta")); setContact(true); }}>
            <span className="contactCtaLabel">Falar com a equipe</span>
          </button>
          <div className="contactCopy">
            <p className="contactLead">Vamos descobrir juntos se e como podemos te ajudar.</p>
            <p className="contactSub">Conte o problema.<br/>A gente desenha a solução.</p>
          </div>
          <div className="contactEdge" aria-hidden="true" />
        </div>
      </section>
    </main>

    <footer className="siteFooter">
      <div className="footerOverlap" aria-hidden="true" />
      <div className="footerInner">
        <div className="footerTop">
          <div className="footerBrand">
            <img className="footerLogo" src={gbLogo} alt="GB IA" />
            <p className="footerTag">Soluções sob medida, automação e IA autônoma.</p>
          </div>
          <div className="footerCols">
            <div>
              <h5>Navegar</h5>
            <a href="#leistungen">O que fazemos</a>
            <a href="#referenzen">Clientes</a>
            <a href="#kontakt">Contato</a>
            </div>
            <div>
              <h5>Produtos</h5>
              <Link to="/gb-studio">GB Studio</Link>
              <Link to="/gb-social">GB Social</Link>
              <Link to="/ecommerce">E-commerce</Link>
              <Link to="/crm">CRM</Link>
            </div>
            <div>
              <h5>Legal</h5>
              <Link to="/politica-de-privacidade">Política de Privacidade</Link>
              <Link to="/termos-de-uso">Termos de Uso</Link>
              <a href="mailto:privacidade@gbia.com.br">Contato LGPD</a>
            </div>
          </div>
        </div>
        <div className="footerBottom">
          <small>© 2026 GB IA. Todos os direitos reservados.</small>
          <small>CNPJ em conformidade com a LGPD · Lei nº 13.709/2018</small>
        </div>
      </div>
    </footer>

    {contact && <div className="modal" role="dialog" aria-modal="true" aria-labelledby="contactTitle" onMouseDown={(e)=>e.target===e.currentTarget&&setContact(false)}><div className="modalBox"><button className="close" onClick={()=>setContact(false)} aria-label="Fechar">×</button>{sent?<div className="success"><b>✓</b><h2>Recebemos.</h2><p>A equipe da GB IA vai continuar o contato com você.</p><button onClick={()=>{setSent(false);setContact(false)}}>Fechar</button></div>:<><p className="eyebrow">PRIMEIRO PAPO</p><h2 id="contactTitle">Conta o problema.</h2><form onSubmit={submit}><label>Nome<input required name="name" placeholder="Seu nome"/></label><label>E-mail<input required type="email" name="email" placeholder="voce@empresa.com.br"/></label><label>WhatsApp<input type="tel" name="phone" placeholder="Opcional"/></label><label>Como podemos ajudar?<select name="service"><option>Sistemas &amp; Sites</option><option>Automação de Processos</option><option>IA Autônoma</option><option>GB Studio</option><option>GB Social</option></select></label><label>Mensagem<textarea required name="message" placeholder="Explique o processo, tarefa ou gargalo"/></label><label className="check"><input required type="checkbox"/> <span>Concordo com o uso dos meus dados para contato.</span></label><button type="submit">Enviar mensagem <span>↗</span></button></form></>}</div></div>}
  </>;
}

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: "/lumus-effect/gb-ia-robot.webp", type: "image/webp", fetchpriority: "high" } as any,
      { rel: "preload", as: "fetch", href: "/lumus-effect/helvetiker_bold.typeface.json", crossOrigin: "anonymous" } as any,
      { rel: "preload", as: "image", href: "/lumus-effect/cube/posx.jpg" },
      { rel: "preload", as: "image", href: "/lumus-effect/cube/negx.jpg" },
      { rel: "preload", as: "image", href: "/lumus-effect/cube/posy.jpg" },
      { rel: "preload", as: "image", href: "/lumus-effect/cube/negy.jpg" },
      { rel: "preload", as: "image", href: "/lumus-effect/cube/posz.jpg" },
      { rel: "preload", as: "image", href: "/lumus-effect/cube/negz.jpg" },
    ],
  }),
});
