import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";

type LookbookCase = {
  id: string;
  title: string;
  client: string;
  images: string[];
};

type Item = LookbookCase & { image: string; imageIndex: number };

const lookbookCases: LookbookCase[] = [
  {
    id: "fz-jeans",
    title: "Denim editorial",
    client: "FZ Jeans",
    images: ["/gb-studio/lookbook-02.png", "/gb-studio/lookbook-03.png", "/gb-studio/lookbook-11.png"],
  },
  {
    id: "santa-pimenta",
    title: "Lookbook branco",
    client: "Santa Pimenta",
    images: ["/gb-studio/lookbook-04.png", "/gb-studio/lookbook-05.png", "/gb-studio/lookbook-09.png"],
  },
  {
    id: "dondoca-express",
    title: "Campanha urbana",
    client: "Dondoca Express",
    images: ["/gb-studio/lookbook-01.png", "/gb-studio/lookbook-08.png", "/gb-studio/lookbook-10.png"],
  },
  {
    id: "beauty-studio",
    title: "Beauty commerce",
    client: "Studio Beauty",
    images: ["/gb-studio/lookbook-06.png", "/gb-studio/lookbook-07.png", "/gb-studio/modelo-01.png"],
  },
];

export function LookbookGallery() {
  const base = useMemo<Item[]>(
    () => lookbookCases.flatMap((c) => c.images.map((image, imageIndex) => ({ ...c, image, imageIndex }))),
    [],
  );
  // duplicate for seamless loop
  const items = useMemo(() => [...base, ...base], [base]);

  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStart = useRef({ x: 0, offset: 0, moved: false });
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
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - prev);
      prev = now;
      if (!reduce && !draggingRef.current && !hoverRef.current && !active) {
        offsetRef.current -= dt * 0.06; // right -> left
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
    draggingRef.current = true;
    dragStart.current = { x: e.clientX, offset: offsetRef.current, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const delta = e.clientX - dragStart.current.x;
    if (Math.abs(delta) > 5) dragStart.current.moved = true;
    offsetRef.current = dragStart.current.offset + delta;
  };
  const onUp = () => {
    draggingRef.current = false;
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
