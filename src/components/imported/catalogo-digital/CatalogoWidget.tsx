import { useMemo, useRef, useState, useEffect } from "react";
import imgMoveis from "@/assets/references/catalogo/product-moveis.jpg";
import imgModa from "@/assets/references/catalogo/product-moda.jpg";
import imgConstrucao from "@/assets/references/catalogo/product-construcao.jpg";
import imgServicos from "@/assets/references/catalogo/product-servicos.jpg";
import imgImobiliaria from "@/assets/references/catalogo/product-imobiliaria.jpg";
import imgEventos from "@/assets/references/catalogo/product-eventos.jpg";

type Category = "Todos" | "Móveis" | "Moda" | "Construção" | "Serviços" | "Imobiliária" | "Eventos";

type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: Exclude<Category, "Todos">;
  tag?: "MAIS VENDIDO" | "NOVO" | "PROMO" | "DESTAQUE";
};

const PRODUCTS: Product[] = [
  { id: "cat-sofa", name: "Sofá Modular 3 Lugares", desc: "Linho natural, estrutura em madeira maciça e conforto de alta densidade.", price: 4890, oldPrice: 5690, image: imgMoveis, category: "Móveis", tag: "MAIS VENDIDO" },
  { id: "cat-poltrona", name: "Poltrona de Couro", desc: "Couro legítimo, base giratória em alumínio e design atemporal.", price: 2490, image: imgMoveis, category: "Móveis", tag: "DESTAQUE" },
  { id: "cat-blazer", name: "Blazer Alfaiataria", desc: "Corte slim, tecido italiano e acabamento impecável.", price: 1890, oldPrice: 2290, image: imgModa, category: "Moda", tag: "PROMO" },
  { id: "cat-vestido", name: "Vestido Midi Drapeado", desc: "Silhueta fluida, tecido premium e versatilidade total.", price: 1590, image: imgModa, category: "Moda", tag: "NOVO" },
  { id: "cat-cimento", name: "Cimento CP II 50kg", desc: "Ideal para construção civil, alta resistência e durabilidade.", price: 39, image: imgConstrucao, category: "Construção", tag: "MAIS VENDIDO" },
  { id: "cat-torneira", name: "Torneira Monocomando", desc: "Acabamento cromado, design moderno e instalação simplificada.", price: 420, image: imgConstrucao, category: "Construção", tag: "DESTAQUE" },
  { id: "cat-consultoria", name: "Diagnóstico Estratégico", desc: "Sessão de 2h para mapear gargalos e oportunidades do negócio.", price: 2500, image: imgServicos, category: "Serviços", tag: "MAIS VENDIDO" },
  { id: "cat-pacote", name: "Pacote Mensal de Growth", desc: "Acompanhamento semanal de métricas, campanhas e ações.", price: 4900, oldPrice: 5900, image: imgServicos, category: "Serviços", tag: "PROMO" },
  { id: "cat-apartamento", name: "Apartamento Alto Padrão", desc: "3 suítes, 180m², vista panorâmica e área de lazer completa.", price: 1850000, image: imgImobiliaria, category: "Imobiliária", tag: "DESTAQUE" },
  { id: "cat-casa", name: "Casa em Condomínio Fechado", desc: "4 quartos, piscina, quintal privativo e segurança 24h.", price: 2300000, image: imgImobiliaria, category: "Imobiliária", tag: "NOVO" },
  { id: "cat-mesa", name: "Mesa de Eventos Premium", desc: "Mesa de vidro 2m com base dourada, perfeita para casamentos.", price: 1200, image: imgEventos, category: "Eventos", tag: "MAIS VENDIDO" },
  { id: "cat-lustre", name: "Lustre de Cristal", desc: "Iluminação sofisticada para ambientes de gala e celebrações.", price: 4500, image: imgEventos, category: "Eventos", tag: "DESTAQUE" },
];

const CATEGORIES: Category[] = ["Todos", "Móveis", "Moda", "Construção", "Serviços", "Imobiliária", "Eventos"];

const fmt = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function CatalogoWidget() {
  const [cat, setCat] = useState<Category>("Todos");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [pulse, setPulse] = useState<string | null>(null);
  const pulseRef = useRef<number | null>(null);

  useEffect(() => () => { if (pulseRef.current) window.clearTimeout(pulseRef.current); }, []);

  const list = useMemo(() => cat === "Todos" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat), [cat]);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, q]) => {
    const p = PRODUCTS.find(x => x.id === id);
    return sum + (p ? p.price * q : 0);
  }, 0);

  function add(id: string) {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setPulse(id);
    if (pulseRef.current) window.clearTimeout(pulseRef.current);
    pulseRef.current = window.setTimeout(() => setPulse(null), 380);
  }
  function remove(id: string) {
    setCart(c => {
      const n = { ...c };
      if (!n[id]) return c;
      if (n[id] <= 1) delete n[id]; else n[id] -= 1;
      return n;
    });
  }

  return (
    <div className="menuCatalogFrame" role="group" aria-label="Prévia do catálogo digital">
      <div className="menuCatalogNotch" aria-hidden="true"><span/></div>
      <div className="menuCatalogScreen menuCatalogScreenV2">
        <div className="menuCatalogHeaderV2">
          <div className="menuCatalogBrandV2">
            <span className="menuCatalogBrandMark">GB</span>
            <div>
              <b>Catálogo GB</b>
              <em>Tudo organizado · pronto para vender</em>
            </div>
          </div>
          <button className="menuCatalogSearchV2" aria-label="Buscar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
          </button>
        </div>

        <div className="menuCatalogHeroV2">
          <div>
            <span className="menuCatalogHeroTag">CATALOGO DIGITAL</span>
            <h4>Tudo o que você vende</h4>
            <p>Produtos, serviços e imóveis em um só lugar. O cliente navega, escolhe e entra em contato.</p>
          </div>
          <span className="menuCatalogHeroBadge">✦</span>
        </div>

        <div className="menuCatalogChipsV2" role="tablist">
          {CATEGORIES.map(c => (
            <button key={c} role="tab" aria-selected={cat === c} className={`menuCatalogChipV2 ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        <div className="menuCatalogListV2">
          {list.map(p => (
            <div key={p.id} className={`menuCatalogRowV2 ${pulse === p.id ? "pulse" : ""}`}>
              <div className="menuCatalogRowInfo">
                <div className="menuCatalogRowTop">
                  <strong>{p.name}</strong>
                  {p.tag && <em className={`menuCatalogTagV2 tag-${p.tag.toLowerCase().replace(/[^a-z]/g,"")}`}>{p.tag}</em>}
                </div>
                <p>{p.desc}</p>
                <div className="menuCatalogRowPrice">
                  {p.oldPrice && <s>R$ {fmt(p.oldPrice)}</s>}
                  <b>R$ {fmt(p.price)}</b>
                </div>
              </div>
              <div className="menuCatalogRowMedia">
                <img src={p.image} alt={p.name} loading="lazy" />
                {cart[p.id] ? (
                  <div className="menuCatalogQtyV2">
                    <button onClick={() => remove(p.id)} aria-label="Remover">−</button>
                    <b>{cart[p.id]}</b>
                    <button onClick={() => add(p.id)} aria-label="Adicionar">+</button>
                  </div>
                ) : (
                  <button className="menuCatalogAddV2" onClick={() => add(p.id)} aria-label={`Adicionar ${p.name}`}>+</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={`menuCatalogCartV2 ${totalItems ? "visible" : ""}`} aria-live="polite">
          <div className="menuCatalogCartInfo">
            <b>{totalItems} {totalItems === 1 ? "item" : "itens"}</b>
            <span>Solicitar orçamento no WhatsApp</span>
          </div>
          <button className="menuCatalogCartCta">
            <span>Ver interesse</span>
            <strong>R$ {fmt(totalPrice)}</strong>
          </button>
        </div>
      </div>
    </div>
  );
}
