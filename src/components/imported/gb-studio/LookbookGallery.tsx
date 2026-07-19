
import { PointerEvent, WheelEvent, useEffect, useMemo, useRef, useState } from "react";

type LookbookCase = {
  id: string;
  title: string;
  client: string;
  images: string[];
};

type SpiralItem = LookbookCase & {
  image: string;
  imageIndex: number;
};

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
  const items = useMemo<SpiralItem[]>(() => lookbookCases.flatMap((item) => item.images.map((image, imageIndex) => ({ ...item, image, imageIndex }))), []);
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeImage, setActiveImage] = useState<SpiralItem | null>(null);
  const [dragging, setDragging] = useState(false);
  const rotationRef = useRef(0);
  const dragStart = useRef({ x: 0, rotation: 0, moved: false });
  const suppressClick = useRef(false);

  useEffect(() => {
    items.forEach((item) => {
      const image = new Image();
      image.src = item.image;
    });
  }, [items]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(32, now - previous);
      previous = now;
      if (!dragging && !activeImage) {
        rotationRef.current -= delta * 0.018;
        setRotation(rotationRef.current);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [dragging, activeImage]);

  useEffect(() => {
    if (!activeImage) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeImage]);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    dragStart.current = { x: event.clientX, rotation: rotationRef.current, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((event.clientY - rect.top) / rect.height - .5) * -5,
      y: ((event.clientX - rect.left) / rect.width - .5) * 7,
    });
    if (!dragging) return;
    const delta = event.clientX - dragStart.current.x;
    if (Math.abs(delta) > 5) dragStart.current.moved = true;
    rotationRef.current = dragStart.current.rotation + delta * 0.24;
    setRotation(rotationRef.current);
  };

  const endDrag = () => {
    setDragging(false);
    if (dragStart.current.moved) {
      suppressClick.current = true;
      window.setTimeout(() => { suppressClick.current = false; }, 120);
    }
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    rotationRef.current += (event.deltaY + event.deltaX) * 0.045;
    setRotation(rotationRef.current);
  };

  return (
    <>
      <div
        className="spiralViewport"
        aria-label="Espiral de fotos de lookbook"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => { endDrag(); setTilt({ x: 0, y: 0 }); }}
        onWheel={onWheel}
      >
      <div className="spiralStage" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        {items.map((item, index) => {
          const angle = (360 / items.length) * index + rotation;
          const angleRad = (angle * Math.PI) / 180;
          const frontness = (Math.cos(angleRad) + 1) / 2;
          const lift = (index - (items.length - 1) / 2) * 54 + Math.sin(angleRad) * 22;
          const scale = 0.66 + frontness * 0.35;
          const opacity = 0.26 + frontness * 0.74;
          const cardTilt = Math.sin(angleRad) * 5;
          return (
            <figure
              className="spiralCard"
              key={`${item.id}-${item.imageIndex}`}
              style={{
                transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(var(--spiral-radius)) translateY(${lift}px) rotateY(${-angle}deg) rotateZ(${cardTilt}deg) scale(${scale})`,
                opacity,
                zIndex: Math.round(frontness * 100),
                filter: `grayscale(${1 - frontness}) saturate(${0.8 + frontness * 0.52}) contrast(${0.94 + frontness * 0.12})`,
              }}
              onClick={() => {
                if (!suppressClick.current) setActiveImage(item);
              }}
            >
              <img src={item.image} alt={`${item.client} — ${item.title} — imagem ${item.imageIndex + 1}`} draggable={false} />
              <figcaption>
                <strong>{item.client}</strong>
                <span>{item.title}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
        <p className="galleryHint">Arraste, role ou clique para ampliar</p>
      </div>
      {activeImage && <div className="studioLightbox" role="dialog" aria-modal="true" aria-label="Imagem ampliada do GB Studio" onClick={() => setActiveImage(null)}>
        <button type="button" onClick={() => setActiveImage(null)} aria-label="Fechar imagem ampliada">×</button>
        <figure onClick={(event) => event.stopPropagation()}>
          <img src={activeImage.image} alt={`${activeImage.client} — ${activeImage.title} ampliada`} draggable={false} />
          <figcaption><strong>{activeImage.client}</strong><span>{activeImage.title}</span></figcaption>
        </figure>
      </div>}
    </>
  );
}
