
import { PointerEvent, WheelEvent, useEffect, useRef, useState } from "react";

const images = [
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
];

export function PerspectiveSpiralGallery() {
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const drag = useRef({ active: false, x: 0, rotation: 0 });
  const rotationRef = useRef(0);
  const idle = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - previous);
      previous = now;
      if (!drag.current.active && !idle.current) {
        rotationRef.current += dt * 0.0025;
        setRotation(rotationRef.current);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const pauseDrift = () => {
    if (idle.current) window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => { idle.current = null; }, 900);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { active: true, x: e.clientX, rotation: rotationRef.current };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - rect.top) / rect.height - .5) * -3,
      y: ((e.clientX - rect.left) / rect.width - .5) * 4,
    });
    if (!drag.current.active) return;
    rotationRef.current = drag.current.rotation + (e.clientX - drag.current.x) * .22;
    setRotation(rotationRef.current);
  };
  const onPointerUp = () => { drag.current.active = false; pauseDrift(); };
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    rotationRef.current += (e.deltaY + e.deltaX) * .035;
    setRotation(rotationRef.current);
    pauseDrift();
  };

  return (
    <div
      className="spiralViewport"
      aria-label="Galeria interativa de imagens produzidas pelo GB Studio"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={(e) => { onPointerUp(); setTilt({ x: 0, y: 0 }); }}
      onWheel={onWheel}
    >
      <div className="spiralStage" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        {images.map((src, index) => {
          const angle = index * (360 / images.length) + rotation;
          const y = (index - (images.length - 1) / 2) * 66;
          return (
            <figure
              className="spiralCard"
              key={`${src}-${index}`}
              style={{ transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(var(--spiral-radius)) translateY(${y}px) rotateY(${-angle}deg)` }}
            >
              <img src={src} alt={`Modelo virtual do GB Studio — amostra ${index + 1}`} draggable={false} />
            </figure>
          );
        })}
      </div>
      <p className="galleryHint">Arraste ou role para explorar</p>
    </div>
  );
}
