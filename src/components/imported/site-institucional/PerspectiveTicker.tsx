
import { PointerEvent, useEffect, useRef } from "react";

const cases = [
  { category: "Restaurante", name: "Casa GB", className: "siteWorkVivence", headline: "Cardápio que aparece", sections: ["Menu", "Reserva", "Delivery"] },
  { category: "Clínica", name: "Beleza & Cia", className: "siteWorkStudio", headline: "Autoridade que agenda", sections: ["Tratamentos", "Equipe", "Agendar"] },
  { category: "Serviço B2B", name: "United Safety Net", className: "siteWorkUnited", headline: "Credibilidade que vende", sections: ["Soluções", "Cases", "Contato"] },
  { category: "Marca de moda", name: "Kongfy", className: "siteWorkKongfy", headline: "Marca pronta pra vender", sections: ["Produto", "Prova", "Compra"] },
];

export function PerspectiveTicker() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 0, velocity: -.22, dragging: false, pointerX: 0, lastX: 0 });

  useEffect(() => {
    let frame = 0;
    let lastScroll = window.scrollY;
    const tick = () => {
      const s = state.current;
      if (!s.dragging) {
        s.x += s.velocity;
        s.velocity *= .94;
        if (Math.abs(s.velocity) < .12) s.velocity = -.12;
      }
      const width = track.current ? track.current.scrollWidth / 2 : 1;
      if (s.x < -width) s.x += width;
      if (s.x > 0) s.x -= width;
      if (track.current) track.current.style.transform = `translate3d(${s.x}px,0,0)`;
      frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      const rect = viewport.current?.getBoundingClientRect();
      if (rect && rect.bottom > 0 && rect.top < window.innerHeight) state.current.velocity -= Math.max(-2.2, Math.min(2.2, delta * .018));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); };
  }, []);

  const down = (event: PointerEvent<HTMLDivElement>) => {
    state.current.dragging = true;
    state.current.pointerX = event.clientX;
    state.current.lastX = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!state.current.dragging) return;
    const delta = event.clientX - state.current.pointerX;
    state.current.x += delta;
    state.current.velocity = (event.clientX - state.current.lastX) * .55;
    state.current.pointerX = event.clientX;
    state.current.lastX = event.clientX;
  };
  const up = (event: PointerEvent<HTMLDivElement>) => {
    state.current.dragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <div ref={viewport} className="siteTicker" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
    <div ref={track} className="siteTickerTrack">{[...cases, ...cases].map((item, index) => <article className={`siteWorkCard ${item.className}`} key={`${item.name}-${index}`}>
      <div className="siteWorkMock siteTemplateMock">
        <span className="siteTemplateNav"><i/><i/><i/><b>{item.name}</b></span>
        <strong>{item.headline}</strong>
        <em>Falar no WhatsApp</em>
        <span className="siteTemplateHero"/>
        <span className="siteTemplateSections">{item.sections.map(section => <i key={section}>{section}</i>)}</span>
      </div>
      <div className="siteWorkMeta"><small>{item.category}</small><h3>{item.name}</h3></div>
    </article>)}</div>
    <p>Templates reais · arraste para explorar</p>
  </div>;
}
