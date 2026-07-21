import { useEffect, useRef, useState } from "react";

const designs = [
  "/gb-social-designs/new-01.jpg",
  "/gb-social-designs/new-02.jpg",
  "/gb-social-designs/new-03.jpg",
  "/gb-social-designs/new-04.jpg",
  "/gb-social-designs/new-05.jpg",
  "/gb-social-designs/new-06.jpg",
  "/gb-social-designs/new-07.jpg",
  "/gb-social-designs/new-08.jpg",
  "/gb-social-designs/new-09.jpg",
];

export function PerspectiveTicker() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    const vp = viewport.current;
    const el = track.current;
    if (!vp || !el) return;

    let x = 0;
    let raf = 0;
    let paused = false;
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let moved = 0;

    const half = () => el.scrollWidth / 2;
    const apply = () => { el.style.transform = `translate3d(${x}px,0,0)`; };
    const normalize = () => {
      const h = half();
      if (h <= 0) return;
      while (-x >= h) x += h;
      while (x > 0) x -= h;
    };

    const tick = () => {
      if (!paused && !dragging) {
        x -= .42;
        normalize();
        apply();
      }
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => { paused = true; };
    const onLeave = () => { if (!dragging) paused = false; };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      startX = e.clientX;
      startOffset = x;
      vp.setPointerCapture(e.pointerId);
      vp.classList.add("isDragging");
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.abs(dx);
      x = startOffset + dx;
      normalize();
      apply();
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try { vp.releasePointerCapture(e.pointerId); } catch {}
      vp.classList.remove("isDragging");
      paused = false;
    };

    vp.addEventListener("pointerenter", onEnter);
    vp.addEventListener("pointerleave", onLeave);
    vp.addEventListener("pointerdown", onPointerDown);
    vp.addEventListener("pointermove", onPointerMove);
    vp.addEventListener("pointerup", onPointerUp);
    vp.addEventListener("pointercancel", onPointerUp);

    // suppress click if user actually dragged
    const onClickCapture = (e: MouseEvent) => {
      if (moved > 6) { e.stopPropagation(); e.preventDefault(); moved = 0; }
    };
    vp.addEventListener("click", onClickCapture, true);

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      vp.removeEventListener("pointerenter", onEnter);
      vp.removeEventListener("pointerleave", onLeave);
      vp.removeEventListener("pointerdown", onPointerDown);
      vp.removeEventListener("pointermove", onPointerMove);
      vp.removeEventListener("pointerup", onPointerUp);
      vp.removeEventListener("pointercancel", onPointerUp);
      vp.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  const doubled = [...designs, ...designs];
  return <>
    <div className="socialTickerViewport" ref={viewport} aria-label="Exemplos de designs criados com o GB Social">
      <div className="socialTickerTrack" ref={track}>
        {doubled.map((src, i) => <figure className="socialDesignCard" key={`${src}-${i}`} onClick={() => setLightbox(src)}>
          <img src={src} alt={`Design criado com o GB Social ${i % designs.length + 1}`} loading={i < 5 ? "eager" : "lazy"} draggable={false}/>
        </figure>)}
      </div>
      <p>Arraste para explorar · toque para ampliar</p>
    </div>
    {lightbox && <div className="socialLightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
      <button className="socialLightboxClose" aria-label="Fechar" onClick={(e) => { e.stopPropagation(); setLightbox(null); }}>×</button>
      <img src={lightbox} alt="Design em tela cheia" onClick={(e) => e.stopPropagation()}/>
    </div>}
  </>;
}
