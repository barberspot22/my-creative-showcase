import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";

export type ReferenceType = "ecommerce" | "institucional" | "vendas" | "captura" | "cardapio" | "catalogo";

export interface Reference {
  image: string;
  segment: string;
  domain?: string;
  type?: ReferenceType;
}

interface ReferenceGalleryProps {
  items: Reference[];
  ctaUrl?: string;
  title?: string;
  /** "tall" enables vertical scroll of full-page screenshots inside each card. */
  variant?: "default" | "tall";
  /** Show search + type filter chips. Defaults true when items span >1 type. */
  enableFilters?: boolean;
  /** Show the "X referências" count text. Defaults true. */
  showResultCount?: boolean;
  /** Show the search input. Defaults true. */
  showSearch?: boolean;
}

const TYPE_LABELS: Record<ReferenceType, string> = {
  ecommerce: "E-commerce",
  institucional: "Institucional",
  vendas: "Página de vendas",
  captura: "Página de captura",
  cardapio: "Cardápio digital",
  catalogo: "Catálogo digital",
};

export function ReferenceGallery({ items, ctaUrl, title, variant = "default", enableFilters, showResultCount = true, showSearch = true }: ReferenceGalleryProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<ReferenceType | "all">("all");
  const trackRef = useRef<HTMLDivElement | null>(null);
  const state = useRef({ startX: 0, startY: 0, startScroll: 0, moved: false, pausedUntil: 0, intent: "" as "" | "x" | "y" });

  const availableTypes = useMemo(() => {
    const set = new Set<ReferenceType>();
    for (const r of items) if (r.type) set.add(r.type);
    return Array.from(set);
  }, [items]);

  const showFilters = enableFilters ?? (availableTypes.length > 1 || items.length > 6);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      if (activeType !== "all" && r.type !== activeType) return false;
      if (!q) return true;
      return (
        r.segment.toLowerCase().includes(q) ||
        (r.domain?.toLowerCase().includes(q) ?? false) ||
        (r.type ? TYPE_LABELS[r.type].toLowerCase().includes(q) : false)
      );
    });
  }, [items, query, activeType]);

  const loop = filtered.length > 2 ? [...filtered, ...filtered, ...filtered] : filtered;

  useEffect(() => {
    const el = trackRef.current;
    if (!el || filtered.length <= 2) return;
    const setStart = () => { el.scrollLeft = el.scrollWidth / 3; };
    setStart();
    const ro = new ResizeObserver(setStart);
    ro.observe(el);
    return () => ro.disconnect();
  }, [filtered.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || filtered.length <= 2) return;
    const onScroll = () => {
      const third = el.scrollWidth / 3;
      if (el.scrollLeft < third * 0.5) el.scrollLeft += third;
      else if (el.scrollLeft > third * 1.5) el.scrollLeft -= third;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [filtered.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || filtered.length <= 2) return;
    // Disable auto-scroll on coarse-pointer (touch) devices — it fights native scroll.
    if (typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches) return;
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
  }, [dragging, filtered.length]);

  const snapToNearest = () => {
    const el = trackRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".referenceCard"));
    if (!cards.length) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let nearest = cards[0];
    let best = Infinity;
    for (const card of cards) {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < best) {
        best = distance;
        nearest = card;
      }
    }
    el.scrollTo({ left: nearest.offsetLeft - (el.clientWidth - nearest.offsetWidth) / 2, behavior: "smooth" });
  };

  const scrollOne = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    state.current.pausedUntil = performance.now() + 4000;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".referenceCard"));
    if (!cards.length) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let currentIndex = 0;
    let best = Infinity;
    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < best) {
        best = distance;
        currentIndex = index;
      }
    });
    const targetIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + direction));
    const target = cards[targetIndex];
    if (!target) return;
    el.scrollTo({ left: target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2, behavior: "smooth" });
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    // On touch, let the browser handle native horizontal scroll (smoother, momentum, snap).
    if (e.pointerType === "touch") { state.current.moved = false; state.current.pausedUntil = performance.now() + 3000; return; }
    setDragging(true);
    state.current = { startX: e.clientX, startY: e.clientY, startScroll: trackRef.current.scrollLeft, moved: false, pausedUntil: 0, intent: "" };
    try { trackRef.current.setPointerCapture(e.pointerId); } catch { /* noop */ }
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging || !trackRef.current) return;
    // Mouse/pen: if no button is held, treat as pointer-up (prevents "hover drags").
    if (e.pointerType !== "touch" && e.buttons === 0) {
      setDragging(false);
      state.current.intent = "";
      state.current.moved = false;
      try { trackRef.current.releasePointerCapture(e.pointerId); } catch { /* noop */ }
      return;
    }
    const dx = e.clientX - state.current.startX;
    const dy = e.clientY - state.current.startY;
    if (!state.current.intent) {
      const ax = Math.abs(dx), ay = Math.abs(dy);
      // Vertical wins as soon as any meaningful vertical drift appears — preserves page scroll.
      if (ay > 5 && ay >= ax * 0.9) {
        state.current.intent = "y";
        setDragging(false);
        try { trackRef.current.releasePointerCapture(e.pointerId); } catch { /* noop */ }
        return;
      }
      if (ax > 12 && ax > ay * 1.8) state.current.intent = "x";
      else return;
    }

    if (state.current.intent !== "x") return;
    if (Math.abs(dx) > 4) state.current.moved = true;
    trackRef.current.scrollLeft = state.current.startScroll - dx;
    if (state.current.moved && e.cancelable) e.preventDefault();
  };

  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    state.current.pausedUntil = performance.now() + 1500;
    try { trackRef.current?.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    if (state.current.moved) window.setTimeout(snapToNearest, 20);
  };

  const handleClick = (src: string) => {
    if (state.current.moved) return;
    setLightbox(src);
  };

  return (
    <div className={`referenceGallery ${variant === "tall" ? "referenceGalleryTall" : ""}`}>
      {title && <p className="referenceGalleryHint">{title}</p>}
      {showFilters && (
        <div className="referenceFilterBar">
          {showSearch && (
            <label className="referenceSearch">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por segmento, domínio ou tipo…"
                aria-label="Buscar referências"
              />
              {query && (
                <button type="button" className="referenceSearchClear" onClick={() => setQuery("")} aria-label="Limpar busca">×</button>
              )}
            </label>
          )}
          {availableTypes.length > 1 && (
            <div className="referenceChips" role="tablist">
              <button
                role="tab"
                aria-selected={activeType === "all"}
                className={`referenceChip ${activeType === "all" ? "active" : ""}`}
                onClick={() => setActiveType("all")}
              >
                Todos <em>{items.length}</em>
              </button>
              {availableTypes.map((t) => {
                const count = items.filter((r) => r.type === t).length;
                return (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={activeType === t}
                    className={`referenceChip ${activeType === t ? "active" : ""}`}
                    onClick={() => setActiveType(t)}
                  >
                    {TYPE_LABELS[t]} <em>{count}</em>
                  </button>
                );
              })}
            </div>
          )}
          {showResultCount && (
            <span className="referenceResultCount" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "referência" : "referências"}
            </span>
          )}
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="referenceEmpty">
          <p>Nenhuma referência encontrada.</p>
          <button type="button" onClick={() => { setQuery(""); setActiveType("all"); }}>Limpar filtros</button>
        </div>
      ) : (
      <>
      <div className="referenceScrollWrap">
        <button
          type="button"
          className="referenceNavArrow referenceNavArrowLeft"
          aria-label="Ver anteriores"
          onClick={() => scrollOne(-1)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6"/></svg>
        </button>
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
              </span>
            </article>
          ))}
        </div>
        <button
          type="button"
          className="referenceNavArrow referenceNavArrowRight"
          aria-label="Ver próximos"
          onClick={() => scrollOne(1)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>
      <p className="referenceDragHint">
        {variant === "tall" ? "Use as setas · arraste lateral · role dentro do card para ver o site completo" : "Use as setas ou arraste · clique para ampliar"}
      </p>
      </>
      )}


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
          <div className="referenceLightboxFrame" onClick={(e) => e.stopPropagation()}>
            <div className="referenceLightboxTop">
              <span className="referenceLightboxDots"><i /><i /><i /></span>
              <span className="referenceLightboxUrl">preview.gb-ia.com</span>
              <span className="referenceLightboxSpacer" />
            </div>
            <div className="referenceLightboxViewport">
              <img src={lightbox} alt="Referência ampliada" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Vertical auto-scrolling site preview inside a browser frame; drag Y / wheel / scrollbar to control. */
function TallScrollingMedia({ src, alt }: { src: string; alt: string }) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const [posPct, setPosPct] = useState(0);
  const [ready, setReady] = useState(false);
  const dragState = useRef({ dragging: false, pending: false, startX: 0, startY: 0, startPct: 0, pausedUntil: 0, dir: 1, source: "" as "media" | "bar" | "", moved: false });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const speed = 0.05;
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

  const pause = (ms = 2200) => { dragState.current.pausedUntil = performance.now() + ms; };

  const onMediaDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    // Only hijack a confirmed vertical mouse/pen drag; horizontal drag belongs to the gallery.
    if (e.pointerType === "touch") { pause(2500); return; }
    dragState.current = { ...dragState.current, pending: true, dragging: false, startX: e.clientX, startY: e.clientY, startPct: posPct, source: "media", moved: false };
  };
  const onMediaMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "touch" && e.buttons === 0) {
      if (dragState.current.dragging || dragState.current.pending) {
        dragState.current.dragging = false;
        dragState.current.pending = false;
        dragState.current.source = "";
        try { (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
      }
      return;
    }
    if (dragState.current.pending && dragState.current.source === "media") {
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        dragState.current.pending = false;
        dragState.current.source = "";
        return;
      }
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
        dragState.current.pending = false;
        dragState.current.dragging = true;
        e.stopPropagation();
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      } else return;
    }
    if (!dragState.current.dragging || dragState.current.source !== "media") return;
    e.stopPropagation();
    const wrap = wrapRef.current; const img = imgRef.current;
    if (!wrap || !img) return;
    const range = img.offsetHeight - wrap.offsetHeight;
    if (range <= 0) return;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dy) > 4) dragState.current.moved = true;
    setPosPct(Math.min(1, Math.max(0, dragState.current.startPct + (-dy / range))));
  };
  const onUp = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!dragState.current.dragging && !dragState.current.pending) return;
    dragState.current.dragging = false;
    dragState.current.pending = false;
    dragState.current.source = "";
    pause();
    try { (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); } catch { /* noop */ }
  };
  const onWheel = (e: React.WheelEvent<HTMLSpanElement>) => {
    const wrap = wrapRef.current; const img = imgRef.current;
    if (!wrap || !img) return;
    const range = img.offsetHeight - wrap.offsetHeight;
    if (range <= 0) return;
    e.preventDefault();
    e.stopPropagation();
    setPosPct((p) => Math.min(1, Math.max(0, p + e.deltaY / range)));
    pause();
  };

  const onBarDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    setPosPct(pct);
    dragState.current = { ...dragState.current, dragging: true, startY: e.clientY, startPct: pct, source: "bar" };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onBarMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!dragState.current.dragging || dragState.current.source !== "bar") return;
    e.stopPropagation();
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    setPosPct(pct);
  };

  const wrapH = wrapRef.current?.offsetHeight ?? 0;
  const imgH = imgRef.current?.offsetHeight ?? 0;
  const range = Math.max(0, imgH - wrapH);
  const translate = -range * posPct;
  const thumbH = wrapH && imgH ? Math.max(24, (wrapH / imgH) * wrapH) : 40;
  const thumbTop = wrapH ? (wrapH - thumbH) * posPct : 0;

  return (
    <span
      ref={wrapRef}
      className="referenceCardMedia referenceCardMediaTall"
      onPointerDown={onMediaDown}
      onPointerMove={onMediaMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onWheel={onWheel}
      onClick={(e) => { if (dragState.current.moved) { e.stopPropagation(); dragState.current.moved = false; } }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        onLoad={() => setReady(true)}
        style={{ transform: `translateY(${translate}px)` }}
        draggable={false}
      />
      {range > 0 && (
        <>
          <span
            ref={barRef}
            className="referenceScrollbar"
            onPointerDown={onBarDown}
            onPointerMove={onBarMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            aria-hidden
          >
            <span
              className="referenceScrollbarThumb"
              style={{ top: `${thumbTop}px`, height: `${thumbH}px`, opacity: ready ? 1 : 0 }}
            />
          </span>
          <span className="referenceScrollHint" aria-hidden>↕ role para ver o site</span>
        </>
      )}
    </span>
  );
}
