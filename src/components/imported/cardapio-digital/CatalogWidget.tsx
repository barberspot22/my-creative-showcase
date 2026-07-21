import { useMemo, useRef, useState, useEffect } from "react";
import imgBurger from "@/assets/menu-card-burger.jpg";
import imgPizza from "@/assets/menu-card-pizza.jpg";
import imgExecutivo from "@/assets/menu-card-executivo.jpg";
import imgSushi from "@/assets/menu-card-sushi.jpg";
import imgFrango from "@/assets/menu-card-frango.jpg";

type Category = "Todos" | "Executivos" | "Burgers" | "Pizzas" | "Sushi" | "Frango" | "Bebidas" | "Sobremesas";

type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: Exclude<Category, "Todos">;
  tag?: "MAIS PEDIDO" | "NOVO" | "PROMO" | "CHEF";
  rating?: number;
  time?: string;
};

const PRODUCTS: Product[] = [
  { id: "exec-mignon", name: "Executivo Filé Mignon", desc: "Arroz, feijão, salada e mignon ao molho madeira.", price: 38.9, image: imgExecutivo, category: "Executivos", tag: "MAIS PEDIDO", rating: 4.9, time: "25–35 min" },
  { id: "exec-frango", name: "Executivo Frango Grelhado", desc: "Peito grelhado, arroz, feijão e legumes salteados.", price: 29.9, oldPrice: 34.9, image: imgFrango, category: "Executivos", tag: "PROMO", rating: 4.8, time: "20–30 min" },
  { id: "burg-classic", name: "Smash Burger Duplo", desc: "Blend 180g, cheddar, cebola caramelizada e molho da casa.", price: 34.9, image: imgBurger, category: "Burgers", tag: "MAIS PEDIDO", rating: 4.9, time: "20–30 min" },
  { id: "burg-bacon", name: "Bacon Trufado", desc: "Blend 160g, bacon crocante, cheddar e maionese trufada.", price: 39.9, image: imgBurger, category: "Burgers", tag: "CHEF", rating: 4.9, time: "20–30 min" },
  { id: "pizza-pepperoni", name: "Pizza Pepperoni", desc: "Massa 48h, muçarela, pepperoni curado e orégano.", price: 68.0, oldPrice: 84.9, image: imgPizza, category: "Pizzas", tag: "PROMO", rating: 4.8, time: "35–45 min" },
  { id: "pizza-margherita", name: "Pizza Margherita", desc: "Molho San Marzano, muçarela de búfala e manjericão fresco.", price: 62.0, image: imgPizza, category: "Pizzas", rating: 4.7, time: "35–45 min" },
  { id: "sushi-combo", name: "Combo Sushi 20 peças", desc: "Sashimi, uramaki filadélfia, niguiris e hot roll.", price: 89.9, image: imgSushi, category: "Sushi", tag: "MAIS PEDIDO", rating: 4.9, time: "40–50 min" },
  { id: "sushi-temaki", name: "Temaki Salmão", desc: "Cone de nori com arroz temperado, salmão fresco e cream cheese.", price: 32.0, image: imgSushi, category: "Sushi", rating: 4.8, time: "20–30 min" },
  { id: "frango-balde", name: "Balde Crispy 8 peças", desc: "Frango crocante empanado na hora, molhos à parte.", price: 54.9, image: imgFrango, category: "Frango", tag: "NOVO", rating: 4.8, time: "25–35 min" },
  { id: "frango-tenders", name: "Tenders + Fritas", desc: "6 tiras de peito crocante, fritas rústicas e barbecue.", price: 32.9, image: imgFrango, category: "Frango", rating: 4.7, time: "20–30 min" },
  { id: "beb-suco", name: "Suco Detox 500ml", desc: "Couve, limão, gengibre e maçã verde prensados a frio.", price: 16.0, image: imgExecutivo, category: "Bebidas", rating: 4.6, time: "5–10 min" },
  { id: "beb-refri", name: "Refrigerante Lata", desc: "Coca-Cola, Guaraná ou Sprite 350ml, sempre gelado.", price: 7.0, image: imgExecutivo, category: "Bebidas", rating: 4.5, time: "5 min" },
  { id: "sob-petit", name: "Petit Gateau", desc: "Bolo quente de chocolate belga com sorvete de creme.", price: 26.0, image: imgExecutivo, category: "Sobremesas", tag: "CHEF", rating: 4.9, time: "10–15 min" },
  { id: "sob-cheese", name: "Cheesecake Vermelho", desc: "Cream cheese cremoso com calda de frutas vermelhas.", price: 22.0, oldPrice: 28.0, image: imgExecutivo, category: "Sobremesas", tag: "PROMO", rating: 4.8, time: "5–10 min" },
];

const CATEGORIES: Category[] = ["Todos", "Executivos", "Burgers", "Pizzas", "Sushi", "Frango", "Bebidas", "Sobremesas"];

const fmt = (v: number) => v.toFixed(2).replace(".", ",");

export function CatalogWidget() {
  const [cat, setCat] = useState<Category>("Todos");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [pulse, setPulse] = useState<string | null>(null);
  const pulseRef = useRef<number | null>(null);

  useEffect(() => () => { if (pulseRef.current) window.clearTimeout(pulseRef.current); }, []);

  const list = useMemo(() => cat === "Todos" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat), [cat]);
  const grouped = useMemo(() => {
    if (cat !== "Todos") return [{ cat, items: list }];
    const map = new Map<string, Product[]>();
    for (const p of PRODUCTS) {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    }
    return Array.from(map.entries()).map(([cat, items]) => ({ cat, items }));
  }, [cat, list]);

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
    <div className="menuCatalogFrame" role="group" aria-label="Prévia do cardápio digital">
      <div className="menuCatalogNotch" aria-hidden="true"><span/></div>
      <div className="menuCatalogScreen menuCatalogScreenV2">

        <div className="menuCatalogHeaderV2">
          <div className="menuCatalogBrandV2">
            <span className="menuCatalogBrandMark">GB</span>
            <div>
              <b>Casa GB</b>
              <em>Aberto agora · Entrega em 30 min</em>
            </div>
          </div>
          <button className="menuCatalogSearchV2" aria-label="Buscar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
          </button>
        </div>

        <div className="menuCatalogHeroV2">
          <div>
            <span className="menuCatalogHeroTag">FRETE GRÁTIS ACIMA DE R$ 60</span>
            <h4>Bom apetite</h4>
            <p>Escolha, personalize e receba em casa ou peça direto na mesa.</p>
          </div>
          <span className="menuCatalogHeroBadge">🔥</span>
        </div>

        <div className="menuCatalogChipsV2" role="tablist">
          {CATEGORIES.map(c => (
            <button key={c} role="tab" aria-selected={cat === c} className={`menuCatalogChipV2 ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        <div className="menuCatalogListV2">
          {grouped.map(g => (
            <div key={g.cat} className="menuCatalogGroupV2">
              <h5 className="menuCatalogGroupTitle">{g.cat}</h5>
              <ul>
                {g.items.map(p => (
                  <li key={p.id} className={`menuCatalogRowV2 ${pulse === p.id ? "pulse" : ""}`}>
                    <div className="menuCatalogRowInfo">
                      <div className="menuCatalogRowTop">
                        <strong>{p.name}</strong>
                        {p.tag && <em className={`menuCatalogTagV2 tag-${p.tag.toLowerCase().replace(/[^a-z]/g,"")}`}>{p.tag}</em>}
                      </div>
                      <p>{p.desc}</p>
                      <div className="menuCatalogRowMeta">
                        <span>★ {p.rating?.toFixed(1)}</span>
                        <span>·</span>
                        <span>{p.time}</span>
                      </div>
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
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`menuCatalogCartV2 ${totalItems ? "visible" : ""}`} aria-live="polite">
          <div className="menuCatalogCartInfo">
            <b>{totalItems} {totalItems === 1 ? "item" : "itens"}</b>
            <span>Retirada ou entrega</span>
          </div>
          <button className="menuCatalogCartCta">
            <span>Ver pedido</span>
            <strong>R$ {fmt(totalPrice)}</strong>
          </button>
        </div>

      </div>
    </div>
  );
}
