import { PointerEvent, useEffect, useRef, useState } from "react";

export interface Reference {
  image: string;
  segment: string;
  domain?: string;
}

interface ReferenceGalleryProps {
  items: Reference[];
  ctaUrl?: string;
  title?: string;
  /** "tall" enables vertical scroll of full-page screenshots inside each card. */
  variant?: "default" | "tall";
}

export function ReferenceGallery({ items, ctaUrl, title, variant = "default" }: ReferenceGalleryProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const state = useRef({ startX: 0, startScroll: 0, moved: false, pausedUntil: 0 });

  const loop = items.length > 1 ? [...items, ...items, ...items] : items;

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length <= 1) return;
    const setStart = () => { el.scrollLeft = el.scrollWidth / 3; };
    setStart();
    const ro = new ResizeObserver(setStart);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length <= 1) return;
    const onScroll = () => {
      const third = el.scrollWidth / 3;
      if (el.scrollLeft < third * 0.5) el.scrollLeft += third;
      else if (el.scrollLeft > third * 1.5) el.scrollLeft -= third;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length <= 1) return;
    let raf = 0;
    let last = performance.now();
    const speed = 26;
    const tick = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      if (!dragging && performance.now() > state.current.pausedUntil) {
        el.scrollLeft += speed * dt;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dragging, items.length]);

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

  const handleClick = (src: string) => {
    if (state.current.moved) return;
    setLightbox(src);
  };

  return (
    <div className={`referenceGallery ${variant === "tall" ? "referenceGalleryTall" : ""}`}>
      {title && <p className="referenceGalleryHint">{title}</p>}
      <div className="referenceScrollWrap">
        <div
          ref={trackRef}
          className={`referenceScrollTrack ${dragging ? "isDragging" : ""}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onMouseEnter={() => { state.current.pausedUntil = performance.now() + 2000; }}
        >
          {loop.map((ref, i) => (
            <article key={`${ref.segment}-${i}`} className="referenceCard">
              <button
                type="button"
                className="referenceCardFrame"
                onClick={() => handleClick(ref.image)}
                aria-label={`Ampliar referência ${ref.segment}`}
              >
                <span className="referenceCardTop">
                  <span className="referenceCardDots"><i /><i /><i /></span>
                  <span className="referenceCardUrl">{ref.domain || ref.segment}</span>
                </span>
                {variant === "tall" ? (
                  <TallScrollingMedia src={ref.image} alt={`Referência ${ref.segment}`} />
                ) : (
                  <span className="referenceCardMedia">
                    <img src={ref.image} alt={`Referência ${ref.segment}`} loading="lazy" decoding="async" />
                  </span>
                )}
              </button>
              <span className="referenceCardMeta">
                <small>{ref.segment}</small>
                {ctaUrl && (
                  <a
                    href={ctaUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => { if (state.current.moved) e.preventDefault(); }}
                  >
                    Falar no WhatsApp
                  </a>
                )}
              </span>
            </article>
          ))}
        </div>
      </div>
      <p className="referenceDragHint">
        {variant === "tall" ? "Arraste lateral · role dentro do card para ver o site completo" : "Arraste para explorar · clique para ampliar"}
      </p>

      {lightbox && (
        <div className="referenceLightbox" onClick={() => setLightbox(null)}>
          <button
            type="button"
            className="referenceLightboxClose"
            onClick={() => setLightbox(null)}
            aria-label="Fechar ampliado"
          >
            ×
          </button>
          <img src={lightbox} alt="Referência ampliada" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

/** Vertical auto-scrolling site preview inside a browser frame; drag Y to control. */
function TallScrollingMedia({ src, alt }: { src: string; alt: string }) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [posPct, setPosPct] = useState(0); // 0..1 vertical position
  const dragState = useRef({ dragging: false, startY: 0, startPct: 0, pausedUntil: 0, dir: 1 });

  // Auto-scroll animation
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const speed = 0.05; // fraction per second
    const tick = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      if (!dragState.current.dragging && performance.now() > dragState.current.pausedUntil) {
        setPosPct((p) => {
          let next = p + speed * dragState.current.dir * dt;
          if (next >= 1) { next = 1; dragState.current.dir = -1; dragState.current.pausedUntil = performance.now() + 900; }
          else if (next <= 0) { next = 0; dragState.current.dir = 1; dragState.current.pausedUntil = performance.now() + 900; }
          return next;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    dragState.current.dragging = true;
    dragState.current.startY = e.clientY;
    dragState.current.startPct = posPct;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!dragState.current.dragging) return;
    e.stopPropagation();
    const wrap = wrapRef.current; const img = imgRef.current;
    if (!wrap || !img) return;
    const range = img.offsetHeight - wrap.offsetHeight;
    if (range <= 0) return;
    const dy = e.clientY - dragState.current.startY;
    const dPct = -dy / range;
    setPosPct(Math.min(1, Math.max(0, dragState.current.startPct + dPct)));
  };
  const onPointerUp = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    dragState.current.pausedUntil = performance.now() + 2200;
    try { (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); } catch { /* noop */ }
  };
  const onWheel = (e: React.WheelEvent<HTMLSpanElement>) => {
    const wrap = wrapRef.current; const img = imgRef.current;
    if (!wrap || !img) return;
    const range = img.offsetHeight - wrap.offsetHeight;
    if (range <= 0) return;
    const delta = e.deltaY / range;
    setPosPct((p) => Math.min(1, Math.max(0, p + delta)));
    dragState.current.pausedUntil = performance.now() + 2200;
  };

  const wrapH = wrapRef.current?.offsetHeight ?? 0;
  const imgH = imgRef.current?.offsetHeight ?? 0;
  const translate = -(Math.max(0, imgH - wrapH)) * posPct;

  return (
    <span
      ref={wrapRef}
      className="referenceCardMedia referenceCardMediaTall"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onClick={(e) => e.stopPropagation()}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ transform: `translateY(${translate}px)` }}
        draggable={false}
      />
      <span className="referenceScrollbar" aria-hidden>
        <span style={{ top: `${posPct * 100}%` }} />
      </span>
    </span>
  );
}
