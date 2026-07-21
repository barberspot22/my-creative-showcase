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
}

export function ReferenceGallery({ items, ctaUrl, title }: ReferenceGalleryProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const state = useRef({ startX: 0, startScroll: 0, moved: false, pausedUntil: 0 });

  const loop = items.length > 1 ? [...items, ...items, ...items] : items;

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length <= 1) return;
    const setStart = () => {
      const third = el.scrollWidth / 3;
      el.scrollLeft = third;
    };
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
    console.log("handleClick", src, "moved", state.current.moved);
    if (state.current.moved) return;
    setLightbox(src);
  };


  return (
    <div className="referenceGallery">
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
            <article
              key={`${ref.segment}-${i}`}
              className="referenceCard"
              onClickCapture={(e) => { if (state.current.moved) { e.preventDefault(); e.stopPropagation(); } }}
            >
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
                <span className="referenceCardMedia">
                  <img src={ref.image} alt={`Referência ${ref.segment}`} loading="lazy" decoding="async" />
                </span>
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
      <p className="referenceDragHint">Arraste para explorar · clique para ampliar</p>

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
