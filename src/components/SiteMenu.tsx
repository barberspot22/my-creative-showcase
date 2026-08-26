import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

export const MENU_SERVICES = [
  { href: "/gb-social", label: "GB Social" },
  { href: "/cardapio-digital", label: "Menu Digital" },
  { href: "/ecommerce", label: "E-commerce" },
  { href: "/catalogo-digital", label: "Catálogo Digital" },
  { href: "/site-institucional", label: "Site Institucional" },
  { href: "/crm", label: "CRM" },
  { href: "/gb-studio", label: "GB Studio" },
] as const;

export function SiteMenu() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); setServicesOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [open]);

  const goAnchor = (id: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (!isHome) return; // deixa o link /#id navegar normalmente
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const rect = el.getBoundingClientRect();
    const target = rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2;
    window.scrollTo({ top: Math.max(target, 0), behavior: "smooth" });
  };

  return (
    <div className="siteMenu" ref={rootRef}>
      <button
        className={`menuButton ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        <i /><i /><i />
      </button>

      <nav className={open ? "open" : ""} aria-label="Menu principal">
        {isHome ? (
          <a href="#top" onClick={(e) => { setOpen(false); e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Início</a>
        ) : (
          <Link to="/" onClick={() => setOpen(false)}>Início</Link>
        )}

        <div className={`menuGroup ${servicesOpen ? "open" : ""}`}>
          <button
            type="button"
            className="menuGroupToggle"
            onClick={() => setServicesOpen(!servicesOpen)}
            aria-expanded={servicesOpen}
          >
            Serviços <span aria-hidden="true">▾</span>
          </button>
          <div className="menuGroupPanel"><div className="menuGroupPanelInner">
            {MENU_SERVICES.map((s) => (
              <Link
                key={s.href}
                to={s.href}
                onClick={() => setOpen(false)}
                className={pathname === s.href ? "current" : undefined}
              >
                {s.label}
              </Link>
            ))}
          </div></div>
        </div>

        <a href="/#servicos" onClick={goAnchor("servicos")}>Como trabalhamos</a>
        <a href="/#kontakt" onClick={goAnchor("kontakt")}>Contato</a>
      </nav>
    </div>
  );
}
