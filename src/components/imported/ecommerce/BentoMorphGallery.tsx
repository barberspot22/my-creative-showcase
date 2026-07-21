import { PointerEvent, useEffect, useRef, useState } from "react";

const templates = [
  {
    name: "Atelier",
    type: "Moda & editorial",
    className: "commerceSiteFashion",
    headline: "Nova coleção\nno ar",
    subline: "Drop exclusivo mobile",
    ctaLabel: "QUERO ESSE MODELO",
    nav: ["Loja", "Coleção", "Checkout"],
  },
  {
    name: "Forma",
    type: "Casa & design",
    className: "commerceSiteHome",
    headline: "Ambiente\npronto",
    subline: "Vitrine por cômodo",
    ctaLabel: "VER MODELO",
    nav: ["Ambientes", "Produtos", "Orçamento"],
  },
  {
    name: "Pulse",
    type: "Fitness & wellness",
    className: "commerceSiteWellness",
    headline: "Drop\nativo",
    subline: "Assinatura + upsell",
    ctaLabel: "QUERO PULSE",
    nav: ["Planos", "Suplementos", "Comprar"],
  },
  {
    name: "Nativa",
    type: "Beleza & autocuidado",
    className: "commerceSiteBeauty",
    headline: "Rotina\ncompleta",
    subline: "Kit de autocuidado",
    ctaLabel: "VER NATIVA",
    nav: ["Skincare", "Rituais", "Checkout"],
  },
  {
    name: "Essencial",
    type: "Catálogo minimalista",
    className: "commerceSiteMinimal",
    headline: "Linha\nessencial",
    subline: "Compra rápida no WhatsApp",
    ctaLabel: "QUERO ESSENCIAL",
    nav: ["Catálogo", "Pedido", "Contato"],
  },
];

// Triplicate for seamless infinite scroll (drag freely + auto-loop)
const loop = [...templates, ...templates, ...templates];

export function BentoMorphGallery({ ctaUrl }: { ctaUrl: string }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const state = useRef({ startX: 0, startScroll: 0, moved: false, pausedUntil: 0 });

  // Center on middle copy for symmetric infinite scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const setStart = () => {
      const third = el.scrollWidth / 3;
      el.scrollLeft = third;
    };
    setStart();
    const ro = new ResizeObserver(setStart);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Wrap scroll position to fake infinity
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const third = el.scrollWidth / 3;
      if (el.scrollLeft < third * 0.5) el.scrollLeft += third;
      else if (el.scrollLeft > third * 1.5) el.scrollLeft -= third;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-marquee (pauses on interaction)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const speed = 28; // px/s
    const tick = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      if (!dragging && performance.now() > state.current.pausedUntil) {
        el.scrollLeft += speed * dt;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dragging]);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    setDragging(true);
    state.current = { startX: e.clientX, startScroll: trackRef.current.scrollLeft, moved: false, pausedUntil: 0 };
    trackRef.current.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging || !trackRef.current) return;
    const dx = e.clientX - state.current.startX;
    if (Math.abs(dx) > 4) state.current.moved = true;
    trackRef.current.scrollLeft = state.current.startScroll - dx;
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    state.current.pausedUntil = performance.now() + 1500;
    try { trackRef.current?.releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  return (
    <div className="commerceScrollWrap" onMouseEnter={() => { state.current.pausedUntil = performance.now() + 2000; }}>
      <div
        ref={trackRef}
        className={`commerceScrollTrack ${dragging ? "isDragging" : ""}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {loop.map((template, i) => (
          <article
            key={`${template.name}-${i}`}
            className={`commerceSiteCard ${template.className}`}
            onClickCapture={(e) => { if (state.current.moved) { e.preventDefault(); e.stopPropagation(); } }}
          >
            <span className="commerceSiteHeader">
              <span className="commerceSiteDots">
                <i /><i /><i />
              </span>
              <span className="commerceSiteNav">
                {template.nav.map((item) => <b key={item}>{item}</b>)}
              </span>
            </span>
            <span className="commerceSitePreview">
              <b>{template.headline}</b>
              <em>{template.subline}</em>
              <a
                className="commerceSiteCta"
                href={ctaUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => { if (state.current.moved) e.preventDefault(); }}
              >
                FALAR NO WHATSAPP
              </a>
            </span>
            <span className="commerceSiteMeta">
              <b>{template.name}</b>
              <small>{template.type}</small>
            </span>
          </article>
        ))}
      </div>
      <p>Loop infinito · arraste ou deixe rolar →</p>
    </div>
  );
}
