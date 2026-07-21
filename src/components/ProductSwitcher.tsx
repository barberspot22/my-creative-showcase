import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export type ProductKey =
  | "site-institucional"
  | "cardapio-digital"
  | "ecommerce"
  | "crm"
  | "gb-social"
  | "gb-studio";

const PRODUCTS: { key: ProductKey; label: string; href: string }[] = [
  { key: "site-institucional", label: "Site Institucional", href: "/site-institucional" },
  { key: "cardapio-digital", label: "Cardápio Digital", href: "/cardapio-digital" },
  { key: "ecommerce", label: "E-commerce", href: "/ecommerce" },
  { key: "crm", label: "CRM", href: "/crm" },
  { key: "gb-social", label: "GB Social", href: "/gb-social" },
  { key: "gb-studio", label: "GB Studio", href: "/gb-studio" },
];

export function ProductSwitcher({ current }: { current: ProductKey }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  const dragState = useRef<{ startX: number; startScroll: number; active: boolean; moved: number }>({
    startX: 0,
    startScroll: 0,
    active: false,
    moved: 0,
  });

  useEffect(() => {
    const track = trackRef.current;
    const active = activeRef.current;
    if (!track || !active) return;
    const target = active.offsetLeft - track.clientWidth / 2 + active.clientWidth / 2;
    track.scrollTo({ left: Math.max(0, target), behavior: "auto" });
  }, [current]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { startX: e.clientX, startScroll: track.scrollLeft, active: true, moved: 0 };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - dragState.current.startX;
    dragState.current.moved = Math.abs(dx);
    track.scrollLeft = dragState.current.startScroll - dx;
  };
  const endDrag = () => {
    dragState.current.active = false;
  };
  const onLinkClick = (e: React.MouseEvent) => {
    if (dragState.current.moved > 6) {
      e.preventDefault();
    }
  };

  return (
    <nav className="productSwitcher" aria-label="Nossos produtos">
      <div
        className="productSwitcherTrack"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <span className="productSwitcherEyebrow">PRODUTOS</span>
        {PRODUCTS.map((p) => {
          const isActive = p.key === current;
          if (isActive) {
            return (
              <span key={p.key} className="productSwitcherItem active" aria-current="page">
                {p.label}
              </span>
            );
          }
          return (
            <Link
              key={p.key}
              to={p.href}
              className="productSwitcherItem"
              ref={undefined}
              onClick={onLinkClick}
              draggable={false}
            >
              {p.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
