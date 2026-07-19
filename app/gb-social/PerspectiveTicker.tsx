"use client";

import { useEffect, useRef } from "react";

const designs = [
  "/gb-social-designs/design-08.png",
  "/gb-social-designs/design-09.png",
  "/gb-social-designs/design-10.png",
  "/gb-social-designs/design-02.png",
  "/gb-social-designs/design-03.png",
  "/gb-social-designs/design-04.png",
  "/gb-social-designs/design-05.png",
  "/gb-social-designs/design-06.png",
  "/gb-social-designs/design-07.png",
];

export function PerspectiveTicker() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let x = 0;
    let raf = 0;
    let paused = false;
    const tick = () => {
      if (!paused) {
        x -= .42;
        const half = el.scrollWidth / 2;
        if (-x >= half) x += half;
        el.style.transform = `translate3d(${x}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    const stop = () => { paused = true; };
    const start = () => { paused = false; };
    el.addEventListener("pointerenter", stop);
    el.addEventListener("pointerleave", start);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", stop);
      el.removeEventListener("pointerleave", start);
    };
  }, []);

  const doubled = [...designs, ...designs];
  return <div className="socialTickerViewport" aria-label="Exemplos de designs criados com o GB Social">
    <div className="socialTickerTrack" ref={track}>
      {doubled.map((src, i) => <figure className="socialDesignCard" key={`${src}-${i}`}>
        <img src={src} alt={`Design criado com o GB Social ${i % designs.length + 1}`} loading={i < 5 ? "eager" : "lazy"}/>
      </figure>)}
    </div>
    <p>Designs criados para marcas e campanhas reais</p>
  </div>;
}
