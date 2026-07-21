import { PointerEvent, useRef, useState } from "react";

const templates = [
  { name: "Atelier", type: "Moda & editorial", className: "commerceTemplateFashion", headline: "Nova coleção", metric: "Checkout em 2 etapas", products: ["Look 01", "Look 02", "Look 03"] },
  { name: "Forma", type: "Casa & design", className: "commerceTemplateHome", headline: "Casa pronta", metric: "Vitrine por ambiente", products: ["Sala", "Cozinha", "Quarto"] },
  { name: "Pulse", type: "Fitness & wellness", className: "commerceTemplateWellness", headline: "Drop ativo", metric: "Carrinho lateral", products: ["Kit", "Acessório", "Plano"] },
  { name: "Nativa", type: "Beleza & autocuidado", className: "commerceTemplateBeauty", headline: "Rotina completa", metric: "Upsell no checkout", products: ["Sérum", "Creme", "Kit"] },
  { name: "Essencial", type: "Catálogo minimalista", className: "commerceTemplateMinimal", headline: "Linha essencial", metric: "Compra rápida", products: ["Produto A", "Produto B", "Produto C"] },
];

export function BentoMorphGallery() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const state = useRef({ startX: 0, startScroll: 0, moved: false });

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    setDragging(true);
    state.current = { startX: e.clientX, startScroll: trackRef.current.scrollLeft, moved: false };
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
    try { trackRef.current?.releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  return <div className="commerceScrollWrap">
    <div
      ref={trackRef}
      className={`commerceScrollTrack ${dragging ? "isDragging" : ""}`}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {templates.map(template => <article
        key={template.name}
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
    <p>Arraste para o lado para ver mais modelos →</p>
  </div>;
}
