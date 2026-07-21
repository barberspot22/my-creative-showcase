import { PointerEvent, useEffect, useRef, useState } from "react";

const templates = [
  { name: "Atelier", type: "Moda & editorial", className: "commerceTemplateFashion", headline: "Nova coleção", metric: "Checkout em 2 etapas", products: ["Look 01", "Look 02", "Look 03"] },
  { name: "Forma", type: "Casa & design", className: "commerceTemplateHome", headline: "Casa pronta", metric: "Vitrine por ambiente", products: ["Sala", "Cozinha", "Quarto"] },
  { name: "Pulse", type: "Fitness & wellness", className: "commerceTemplateWellness", headline: "Drop ativo", metric: "Carrinho lateral", products: ["Kit", "Acessório", "Plano"] },
  { name: "Nativa", type: "Beleza & autocuidado", className: "commerceTemplateBeauty", headline: "Rotina completa", metric: "Upsell no checkout", products: ["Sérum", "Creme", "Kit"] },
  { name: "Essencial", type: "Catálogo minimalista", className: "commerceTemplateMinimal", headline: "Linha essencial", metric: "Compra rápida", products: ["Produto A", "Produto B", "Produto C"] },
];

// Triplicate for seamless infinite scroll (drag freely + auto-loop)
const loop = [...templates, ...templates, ...templates];

export function BentoMorphGallery() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const state = useRef({ startX: 0, startScroll: 0, moved: false, pausedUntil: 0 });

  // Center on middle copy for symmetric infinite scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const setStart = () => { el.scrollLeft = el.scrollWidth / 3; };
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
    const speed = 30; // px/s
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

  return <div className="commerceScrollWrap"
    onMouseEnter={() => { state.current.pausedUntil = performance.now() + 2000; }}
  >
    <div
      ref={trackRef}
      className={`commerceScrollTrack ${dragging ? "isDragging" : ""}`}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {loop.map((template, i) => <article
        key={`${template.name}-${i}`}
        className={`commerceTemplate ${template.className}`}
        onClickCapture={e => { if (state.current.moved) { e.preventDefault(); e.stopPropagation(); } }}
      >
        <span className="templateChrome"><i/><i/><i/></span>
        <span className="templateMock commerceTemplateImage">
          <span className="commerceTemplateNav"><i/><i/><i/></span>
          <b>{template.headline}</b>
          <em>{template.metric}</em>
          <span className="commerceTemplateProducts">{template.products.map(product => <i key={product}>{product}</i>)}</span>
          <strong>Comprar agora</strong>
        </span>
        <span className="templateMeta"><b>{template.name}</b><small>{template.type}</small></span>
      </article>)}
    </div>
    <p>Loop infinito · arraste ou deixe rolar →</p>
  </div>;
}
