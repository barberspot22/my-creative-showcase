
import { useState } from "react";

const items = [
  { label: "Menu Executivo", type: "Cardápio digital", className: "menuFanCard0", lines: ["Entrada", "Prato do dia", "Sobremesa"], price: "R$ 49" },
  { label: "Pizzaria", type: "Cardápio QR", className: "menuFanCard1", lines: ["Tradicionais", "Especiais", "Bebidas"], price: "Peça agora" },
  { label: "Hamburgueria", type: "Cardápio delivery", className: "menuFanCard2", lines: ["Smash", "Combos", "Milk-shake"], price: "R$ 39" },
  { label: "Sushi", type: "Rodízio & à la carte", className: "menuFanCard3", lines: ["Sashimi", "Uramaki", "Hot roll"], price: "Montar" },
  { label: "Cafeteria", type: "Cardápio de mesa", className: "menuFanCard4", lines: ["Especiais", "Brunch", "Doces"], price: "Chamar" },
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
      <span className="menuFanMedia menuTemplateMedia">
        <i className="menuTemplatePlate"/>
        <b>{item.label}</b>
        <small>{item.type}</small>
        <span className="menuTemplateList">{item.lines.map(line => <em key={line}>{line}</em>)}</span>
        <strong>{item.price}</strong>
      </span>
    </button>)}</div>
    <p>Cardápios e templates · toque para explorar</p>
  </div>;
}
