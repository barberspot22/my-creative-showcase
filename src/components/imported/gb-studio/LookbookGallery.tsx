import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";

type LookbookCase = {
  id: string;
  title: string;
  client: string;
  images: string[];
};

type Item = LookbookCase & { image: string; imageIndex: number };

/** Arquivos reais em `public/gb-studio/` — rota pública `/gb-studio/…`. */
const STUDIO_IMGS = [
  "/gb-studio/lookbook-01.png",
  "/gb-studio/lookbook-02.png",
  "/gb-studio/lookbook-03.png",
  "/gb-studio/lookbook-04.png",
  "/gb-studio/lookbook-05.png",
  "/gb-studio/lookbook-06.png",
  "/gb-studio/lookbook-07.png",
  "/gb-studio/lookbook-08.png",
  "/gb-studio/lookbook-09.png",
  "/gb-studio/lookbook-10.png",
  "/gb-studio/lookbook-11.png",
  "/gb-studio/modelo-01.png",
  "/gb-studio/modelo-02.png",
];

const lookbookCases: LookbookCase[] = [
  { id: "galleria-milano", title: "Editorial Galleria", client: "Maison Vera", images: STUDIO_IMGS.slice(0, 2) },
  { id: "paris-alfaiataria", title: "Alfaiataria em Paris", client: "Atelier Nord", images: STUDIO_IMGS.slice(2, 4) },
  { id: "denim-listrado", title: "Denim listrado", client: "Zinsk Collection", images: STUDIO_IMGS.slice(4, 7) },
  { id: "verao-lago", title: "Verão à beira do lago", client: "Marê Beachwear", images: STUDIO_IMGS.slice(7, 10) },
  { id: "denim-verde", title: "Denim em estúdio", client: "Casa Índigo", images: [STUDIO_IMGS[10], STUDIO_IMGS[11]] },
  { id: "linho-cru", title: "Linho cru no píer", client: "Studio Marés", images: [STUDIO_IMGS[12], STUDIO_IMGS[0], STUDIO_IMGS[3]] },
  { id: "detalhes-tecido", title: "Detalhes de tecido", client: "Studio Marés", images: [STUDIO_IMGS[1], STUDIO_IMGS[5], STUDIO_IMGS[8]] },
  { id: "palmeiras-dourado", title: "Palmeiras ao entardecer", client: "Casa Litoral", images: [STUDIO_IMGS[2], STUDIO_IMGS[6], STUDIO_IMGS[9]] },
  { id: "lago-alpino", title: "Lago alpino", client: "Nortada Studio", images: [STUDIO_IMGS[4], STUDIO_IMGS[11], STUDIO_IMGS[7]] },
];

type Props = {
  /** URLs do admin (`portfolio_items`, page_key=`gb-studio`). Vazio → fallback local. */
  images?: string[];
};

export function LookbookGallery({ images }: Props = {}) {
  const base = useMemo<Item[]>(() => {
    const cms = (images ?? [])
      .map((u) => u?.trim())
      .filter((u): u is string => !!u && !u.includes("/__l5e/") && !(u.startsWith("data:") && u.length < 64));
    if (cms.length) {
      return cms.map((image, imageIndex) => ({
        id: `cms-${imageIndex}`,
        title: "Lookbook",
        client: "GB Studio",
        images: [image],
        image,
        imageIndex,
      }));
    }
    return lookbookCases.flatMap((c) =>
      c.images.map((image, imageIndex) => ({ ...c, image, imageIndex })),
    );
  }, [images]);

  const items = useMemo(() => [...base, ...base], [base]);

  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, offset: 0, moved: false, pending: false });
  const suppressClick = useRef(false);
  const hoverRef = useRef(false);
  const [active, setActive] = useState<Item | null>(null);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) halfWidthRef.current = trackRef.current.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items.length]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - prev);
      prev = now;
      if (!reduce && !draggingRef.current && !hoverRef.current && !active) {
        offsetRef.current -= dt * 0.06;
      }
      const hw = halfWidthRef.current;
      if (hw > 0) {
        if (offsetRef.current <= -hw) offsetRef.current += hw;
        if (offsetRef.current > 0) offsetRef.current -= hw;
      }
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: e.clientX, y: e.clientY, offset: offsetRef.current, moved: false, pending: true };
    draggingRef.current = false;
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = dragStart.current;
    if (e.pointerType !== "touch" && e.buttons === 0) {
      s.pending = false;
      if (draggingRef.current) {
        draggingRef.current = false;
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
      }
      return;
    }
    if (s.pending && !draggingRef.current) {
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { s.pending = false; return; }
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        draggingRef.current = true; s.pending = false;
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      } else return;
    }
    if (!draggingRef.current) return;
    const delta = e.clientX - s.x;
    if (Math.abs(delta) > 5) s.moved = true;
    offsetRef.current = s.offset + delta;
  };

  const onUp = () => {
    draggingRef.current = false;
    dragStart.current.pending = false;
    if (dragStart.current.moved) {
      suppressClick.current = true;
      window.setTimeout(() => (suppressClick.current = false), 120);
    }
  };

  return (
    <>
      <div
        className="lookbookViewport"
        aria-label="Galeria horizontal de lookbooks"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={() => { onUp(); hoverRef.current = false; }}
        onPointerEnter={() => { hoverRef.current = true; }}
      >
        <div className="lookbookTrack" ref={trackRef}>
          {items.map((item, i) => (
            <figure
              key={`${item.id}-${item.imageIndex}-${i}`}
              className="lookbookCard"
              onClick={() => { if (!suppressClick.current) setActive(item); }}
            >
              <img src={item.image} alt={`${item.client} — ${item.title}`} draggable={false} />
              <figcaption>
                <strong>{item.client}</strong>
                <span>{item.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="lookbookHint">Arraste ou clique para ampliar</p>
      </div>

      {active && (
        <div className="studioLightbox" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <button type="button" onClick={() => setActive(null)} aria-label="Fechar">×</button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={active.image} alt={`${active.client} — ${active.title}`} draggable={false} />
            <figcaption><strong>{active.client}</strong><span>{active.title}</span></figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
