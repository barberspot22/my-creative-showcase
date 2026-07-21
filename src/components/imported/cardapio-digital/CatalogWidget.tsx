import { useState, useRef, useEffect } from "react";

type Product = {
  id: string;
  name: string;
  short: string;
  desc: string;
  price: number;
  oldPrice?: number;
  badge?: { label: string; tone: "novo" | "promo" };
  emoji: string;
  gallery: string[];
  sizes: { label: string; sub?: string }[];
  category: "salgados" | "doces";
  chip: string;
};

const PRODUCTS: Product[] = [
  {
    id: "burguer-trufado",
    name: "Burguer Trufado",
    short: "Blend 180g · pão brioche",
    desc: "Blend 180g maturado, cheddar inglês, maionese trufada e pão brioche tostado na manteiga.",
    price: 42.9,
    badge: { label: "NOVO", tone: "novo" },
    emoji: "🍔",
    gallery: ["🍔", "🧀", "🍟", "🥤"],
    sizes: [{ label: "Solo" }, { label: "Duplo", sub: "+R$ 8" }, { label: "Combo", sub: "+R$ 14" }],
    category: "salgados",
    chip: "Novidades",
  },
  {
    id: "pizza-napoletana",
    name: "Pizza Napoletana",
    short: "Massa 48h · muçarela de búfala",
    desc: "Massa de fermentação natural 48h, molho de tomate San Marzano, muçarela de búfala e manjericão.",
    price: 68.0,
    oldPrice: 84.9,
    badge: { label: "PROMO -20%", tone: "promo" },
    emoji: "🍕",
    gallery: ["🍕", "🧑‍🍳", "🌿", "🔥"],
    sizes: [
      { label: "P", sub: "25cm" },
      { label: "M", sub: "30cm" },
      { label: "G", sub: "35cm" },
    ],
    category: "salgados",
    chip: "Pratos",
  },
  {
    id: "acai-premium",
    name: "Açaí Premium",
    short: "Cremoso · frutas frescas",
    desc: "Açaí puro batido na hora com banana, granola artesanal, leite condensado e frutas frescas.",
    price: 24.9,
    badge: { label: "NOVO", tone: "novo" },
    emoji: "🍧",
    gallery: ["🍧", "🍌", "🍓", "🥥"],
    sizes: [
      { label: "300ml" },
      { label: "500ml", sub: "+R$ 6" },
      { label: "700ml", sub: "+R$ 12" },
    ],
    category: "doces",
    chip: "Sobremesas",
  },
  {
    id: "suco-detox",
    name: "Suco Detox",
    short: "Couve · limão · gengibre",
    desc: "Couve orgânica, limão siciliano, gengibre e maçã verde, prensados a frio no dia.",
    price: 18.0,
    oldPrice: 22.0,
    badge: { label: "PROMO -20%", tone: "promo" },
    emoji: "🥤",
    gallery: ["🥤", "🥬", "🍋", "🫚"],
    sizes: [{ label: "300ml" }, { label: "500ml", sub: "+R$ 4" }, { label: "1L", sub: "+R$ 9" }],
    category: "doces",
    chip: "Bebidas",
  },
  {
    id: "parmegiana-trufada",
    name: "Parmegiana Trufada",
    short: "Filé mignon · molho pomodoro",
    desc: "Filé mignon empanado, molho pomodoro artesanal, muçarela de búfala e um toque de óleo trufado.",
    price: 78.0,
    badge: { label: "NOVO", tone: "novo" },
    emoji: "🥩",
    gallery: ["🥩", "🍅", "🧀", "🌿"],
    sizes: [{ label: "Individual" }, { label: "Dupla", sub: "+R$ 22" }, { label: "Família", sub: "+R$ 48" }],
    category: "salgados",
    chip: "Pratos",
  },
  {
    id: "ravioli-costela",
    name: "Ravioli de Costela",
    short: "Massa fresca · manteiga de sálvia",
    desc: "Ravioli recheado com costela desfiada 12h, finalizado com manteiga noisette e sálvia crocante.",
    price: 62.0,
    oldPrice: 74.0,
    badge: { label: "PROMO -15%", tone: "promo" },
    emoji: "🍝",
    gallery: ["🍝", "🥩", "🧈", "🌿"],
    sizes: [{ label: "6 un" }, { label: "10 un", sub: "+R$ 14" }, { label: "16 un", sub: "+R$ 28" }],
    category: "salgados",
    chip: "Pratos",
  },
  {
    id: "petit-gateau",
    name: "Petit Gateau",
    short: "Chocolate 70% · sorvete de creme",
    desc: "Bolo quente de chocolate belga 70% com centro cremoso, acompanha sorvete de creme francês.",
    price: 32.0,
    badge: { label: "NOVO", tone: "novo" },
    emoji: "🍫",
    gallery: ["🍫", "🍨", "🍓", "☕"],
    sizes: [{ label: "Solo" }, { label: "Duplo", sub: "+R$ 10" }],
    category: "doces",
    chip: "Sobremesas",
  },
  {
    id: "cheesecake-frutas",
    name: "Cheesecake Vermelho",
    short: "Cream cheese · frutas vermelhas",
    desc: "Cheesecake cremoso com base de biscoito amanteigado e calda de frutas vermelhas do dia.",
    price: 28.0,
    oldPrice: 34.0,
    badge: { label: "PROMO -17%", tone: "promo" },
    emoji: "🍰",
    gallery: ["🍰", "🍓", "🫐", "🥧"],
    sizes: [{ label: "Fatia" }, { label: "1/4", sub: "+R$ 22" }, { label: "Inteiro", sub: "+R$ 62" }],
    category: "doces",
    chip: "Sobremesas",
  },
];

const CHIPS = ["Entradas", "Pratos", "Bebidas", "Sobremesas"];

function formatPrice(v: number) {
  return v.toFixed(2).replace(".", ",");
}

export function CatalogWidget() {
  const [tab, setTab] = useState<"salgados" | "doces">("salgados");
  const [chip, setChip] = useState("Entradas");
  const [selected, setSelected] = useState<Product | null>(null);
  const [size, setSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [image, setImage] = useState(0);
  const [toast, setToast] = useState(false);
  const toastRef = useRef<number | null>(null);

  useEffect(() => () => { if (toastRef.current) window.clearTimeout(toastRef.current); }, []);

  function openProduct(p: Product) {
    setSelected(p);
    setSize(0);
    setQty(1);
    setImage(0);
  }
  function back() { setSelected(null); }
  function addToCart() {
    setToast(true);
    if (toastRef.current) window.clearTimeout(toastRef.current);
    toastRef.current = window.setTimeout(() => {
      setToast(false);
      setSelected(null);
    }, 1200);
  }

  const visible = PRODUCTS.filter(p => p.category === tab);

  return (
    <div className="menuCatalogFrame" role="group" aria-label="Prévia do catálogo digital">
      <div className="menuCatalogNotch" aria-hidden="true"><span/></div>
      <div className="menuCatalogScreen">
        {!selected && (
          <>
            <div className="menuCatalogTopbar">
              <button className="menuCatalogIconBtn" aria-label="Loja">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l2-5h14l2 5"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/></svg>
              </button>
              <div className="menuCatalogToggle" role="tablist">
                <button role="tab" aria-selected={tab === "salgados"} className={tab === "salgados" ? "active" : ""} onClick={() => setTab("salgados")}>SALGADOS</button>
                <button role="tab" aria-selected={tab === "doces"} className={tab === "doces" ? "active" : ""} onClick={() => setTab("doces")}>DOCES</button>
              </div>
              <button className="menuCatalogIconBtn" aria-label="Buscar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
              </button>
            </div>

            <div className="menuCatalogBanner">
              <div className="menuCatalogBannerContent">
                <h4>Bom apetite!</h4>
                <h5>DIRETO DA COZINHA</h5>
                <button className="menuCatalogBannerCta">VER CARDÁPIO</button>
              </div>
              <div className="menuCatalogBannerBrand">
                <span className="menuCatalogBrandLogo">🍽️</span>
                <b>Casa GB</b>
                <em>Restaurante</em>
              </div>
              <span className="menuCatalogBannerEmoji" aria-hidden="true">🔥</span>
            </div>

            <div className="menuCatalogChips">
              {CHIPS.map(c => (
                <button key={c} className={`menuCatalogChip ${chip === c ? "active" : ""}`} onClick={() => setChip(c)}>{c}</button>
              ))}
            </div>

            <div className="menuCatalogGrid">
              {visible.map(p => (
                <button key={p.id} className="menuCatalogCard" onClick={() => openProduct(p)} aria-label={`Ver ${p.name}`}>
                  <div className="menuCatalogCardMedia">
                    <span aria-hidden="true">{p.emoji}</span>
                    {p.badge && <em className={`menuCatalogBadge ${p.badge.tone}`}>{p.badge.label}</em>}
                  </div>
                  <div className="menuCatalogCardInfo">
                    <strong>R$ {formatPrice(p.price)}</strong>
                    <span>{p.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="menuCatalogTabbar">
              <button aria-label="Loja" className="active"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l2-5h14l2 5"/><path d="M4 9v11h16V9"/></svg></button>
              <button aria-label="Mensagens"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h16v11H8l-4 4z"/></svg></button>
              <button aria-label="Pedidos"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16"/></svg></button>
              <button aria-label="Perfil"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg></button>
            </div>
          </>
        )}

        {selected && (
          <div className="menuCatalogDetail" role="dialog" aria-label={selected.name}>
            <div className="menuCatalogDetailTop">
              <button className="menuCatalogIconBtn" aria-label="Voltar" onClick={back}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5l-7 7 7 7"/></svg>
              </button>
              <span>Detalhes do produto</span>
              <button className="menuCatalogIconBtn" aria-label="Favoritar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.7A4 4 0 0119 11c0 5.5-7 10-7 10z"/></svg>
              </button>
            </div>

            <div className="menuCatalogHero">
              <span aria-hidden="true">{selected.gallery[image]}</span>
              {selected.badge && <em className={`menuCatalogBadge ${selected.badge.tone}`}>{selected.badge.label}</em>}
            </div>

            <div className="menuCatalogThumbs">
              {selected.gallery.map((g, i) => (
                <button key={i} className={i === image ? "active" : ""} onClick={() => setImage(i)} aria-label={`Imagem ${i + 1}`}>
                  <span aria-hidden="true">{g}</span>
                </button>
              ))}
            </div>

            <div className="menuCatalogInfo">
              <h4>{selected.name}</h4>
              <p>{selected.desc}</p>
              <div className="menuCatalogPriceRow">
                {selected.oldPrice && <s>R$ {formatPrice(selected.oldPrice)}</s>}
                <strong>R$ {formatPrice(selected.price)}</strong>
              </div>

              <div className="menuCatalogSection">
                <label>Tamanho</label>
                <div className="menuCatalogSizes">
                  {selected.sizes.map((s, i) => (
                    <button key={s.label} className={i === size ? "active" : ""} onClick={() => setSize(i)}>
                      <b>{s.label}</b>
                      {s.sub && <em>{s.sub}</em>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="menuCatalogSection menuCatalogQtyRow">
                <label>Quantidade</label>
                <div className="menuCatalogQty">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuir">−</button>
                  <b>{qty}</b>
                  <button onClick={() => setQty(qty + 1)} aria-label="Aumentar">+</button>
                </div>
              </div>
            </div>

            <button className="menuCatalogAdd" onClick={addToCart}>
              Adicionar ao pedido · R$ {formatPrice(selected.price * qty)}
            </button>

            {toast && <div className="menuCatalogToast" role="status">Adicionado ✓</div>}
          </div>
        )}
      </div>
    </div>
  );
}
