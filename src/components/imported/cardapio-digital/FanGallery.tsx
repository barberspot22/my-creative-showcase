import { useState } from "react";
import executivo from "@/assets/menu-card-executivo.jpg";
import pizza from "@/assets/menu-card-pizza.jpg";
import burger from "@/assets/menu-card-burger.jpg";
import sushi from "@/assets/menu-card-sushi.jpg";
import frango from "@/assets/menu-card-frango.jpg";

const items = [
  { label: "Executivo do Chef", type: "Prato do dia", className: "menuFanCard0", image: executivo, price: "R$ 49,90", cta: "Adicionar" },
  { label: "Pizza Pepperoni", type: "Pizzaria", className: "menuFanCard1", image: pizza, price: "R$ 59,90", cta: "Peça agora" },
  { label: "Smash Duplo", type: "Hamburgueria", className: "menuFanCard2", image: burger, price: "R$ 39,90", cta: "Adicionar" },
  { label: "Combo Sushi 20pç", type: "Japonês delivery", className: "menuFanCard3", image: sushi, price: "R$ 89,90", cta: "Montar combo" },
  { label: "Balde Crispy", type: "Frango & sides", className: "menuFanCard4", image: frango, price: "R$ 49,90", cta: "Peça agora" },
];

export function FanGallery() {
  const [active, setActive] = useState(2);
  return <div className="menuFanGallery" style={{ "--fan-active": active } as React.CSSProperties}>
    <div className="menuFanStage">{items.map((item, index) => <button
      type="button"
      key={item.label}
      className={`menuFanCard ${item.className} ${active === index ? "active" : ""}`}
      style={{ "--fan-index": index, "--fan-distance": index - active } as React.CSSProperties}
      onMouseEnter={() => setActive(index)}
      onFocus={() => setActive(index)}
      onClick={() => setActive(index)}
      aria-pressed={active === index}
      aria-label={`Destacar ${item.label}`}
    >
      <span className="menuFanMedia menuPhotoMedia">
        <img src={item.image} alt={item.label} loading="lazy" draggable={false} />
        <span className="menuPhotoInfo">
          <small>{item.type}</small>
          <b>{item.label}</b>
          <span className="menuPhotoRow">
            <em>{item.price}</em>
            <strong>{item.cta}</strong>
          </span>
        </span>
      </span>
    </button>)}</div>
    <p>Cardápios reais · toque para explorar</p>
  </div>;
}
