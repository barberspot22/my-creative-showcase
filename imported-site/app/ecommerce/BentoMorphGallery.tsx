"use client";

import { PointerEvent, useEffect, useState } from "react";

const templates = [
  { name: "Atelier", type: "Moda & editorial", className: "commerceTemplateFashion", headline: "Nova coleção", metric: "Checkout em 2 etapas", products: ["Look 01", "Look 02", "Look 03"] },
  { name: "Forma", type: "Casa & design", className: "commerceTemplateHome", headline: "Casa pronta", metric: "Vitrine por ambiente", products: ["Sala", "Cozinha", "Quarto"] },
  { name: "Pulse", type: "Fitness & wellness", className: "commerceTemplateWellness", headline: "Drop ativo", metric: "Carrinho lateral", products: ["Kit", "Acessório", "Plano"] },
  { name: "Nativa", type: "Beleza & autocuidado", className: "commerceTemplateBeauty", headline: "Rotina completa", metric: "Upsell no checkout", products: ["Sérum", "Creme", "Kit"] },
  { name: "Essencial", type: "Catálogo minimalista", className: "commerceTemplateMinimal", headline: "Linha essencial", metric: "Compra rápida", products: ["Produto A", "Produto B", "Produto C"] },
];

export function BentoMorphGallery() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % templates.length), 2500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--commerce-x", `${((event.clientX - box.left) / box.width - .5) * 12}deg`);
    event.currentTarget.style.setProperty("--commerce-y", `${((event.clientY - box.top) / box.height - .5) * -10}deg`);
  };

  return <div
    className="commerceBento commerceTemplateLoop"
    onPointerMove={move}
    onPointerEnter={() => setPaused(true)}
    onPointerLeave={event => {
      setPaused(false);
      event.currentTarget.style.setProperty("--commerce-x", "0deg");
      event.currentTarget.style.setProperty("--commerce-y", "0deg");
    }}
  >
    {templates.map((template, index) => <button
      key={template.name}
      type="button"
      className={`commerceTemplate ${template.className} ${active === index ? "active" : ""}`}
      onClick={() => setActive(index)}
      aria-pressed={active === index}
      aria-label={`Ver template ${template.name}, ${template.type}`}
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
    </button>)}
    <p>Loop automático de templates · pause ao passar o cursor</p>
  </div>;
}
